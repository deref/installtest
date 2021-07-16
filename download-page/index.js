addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


const maxVersionAgeSecs = 15;

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const { pathname, searchParams } = new URL(request.url);

  switch (pathname) {
    case '/version.txt': {
      const version = await VERSIONS.get('exo')
      return new Response(version, {
        headers: {
          'content-type': 'text/plain',
          'cache-control': `public; s-max-age=${maxVersionAgeSecs}`,
        },
      })
    }
    case '/install.sh': {
      let version = searchParams.get('version');
      if (version === null) {
        version = await VERSIONS.get('exo')
      }

      return new Response(getInstallScript(version), {
        headers: {
          'content-type': 'text/plain',
          'cache-control': `public; s-max-age=${maxVersionAgeSecs}`,
        },
      })
    }
  
    default:
      return new Response('Not found', {
        status: 404,
        headers: {
          'content-type': 'text/plain',
          'cache-control': `public; s-max-age=60`,
        }
      })
  }
  
}

function getInstallScript(version) {
  return `#!/bin/sh

set -eu

EXO_VERSION=\${EXO_VERSION:-${version}}
INSTALLROOT=\${INSTALLROOT:-"\${HOME}/.exo"}

exit_with_success() {
  echo ""
  echo "exo has been installed. To use, open a new terminal, or add exo to your path:"
  echo ""
  echo "  export PATH=\\$PATH:\${INSTALLROOT}/bin"
  echo ""
  echo "To check whether exo is installed, run:"
  echo ""
  echo "  exo version"
  echo ""
  echo "Want to know how to use exo? "
  echo "Visit https://deref.io/exo/\${EXO_VERSION}/recipes"
  echo ""
  exit 0
}

validate_checksum() {
  filename=$1
  SHA=$(curl -sfL "\${url}.sha256")
  echo ""
  echo "Validating checksum..."

  case $checksumbin in
    *openssl)
      checksum=$($checksumbin dgst -sha256 "\${filename}" | sed -e 's/^.* //')
      ;;
    *shasum)
      checksum=$($checksumbin -a256 "\${filename}" | sed -e 's/^.* //')
      ;;
  esac

  if [ "$checksum" != "$SHA" ]; then
    echo "Checksum validation failed." >&2
    return 1
  fi
  echo "Checksum valid."
  return 0
}

OS=$(uname -s)
arch=$(uname -m)
cli_arch=""
case $OS in
  CYGWIN* | MINGW64*)
    OS=windows.exe
    ;;
  Darwin)
    ;;
  Linux)
    case $arch in
      x86_64)
        cli_arch=amd64
        ;;
      armv8*)
        cli_arch=arm64
        ;;
      aarch64*)
        cli_arch=arm64
        ;;
      armv*)
        cli_arch=arm
        ;;
      amd64|arm64)
        cli_arch=$arch
        ;;
      *)
        echo "There is no exo $OS support for $arch. Please open an issue with your platform details."
        exit 1
        ;;
    esac
    ;;
  *)
    echo "There is no exo support for $OS/$arch. Please open an issue with your platform details."
    exit 1
    ;;
esac
OS=$(echo $OS | tr '[:upper:]' '[:lower:]')

checksumbin=$(command -v openssl) || checksumbin=$(command -v shasum) || {
  echo "Failed to find checksum binary. Please install openssl or shasum."
  exit 1
}


tmpdir=$(mktemp -d /tmp/exo.XXXXXX)
srcfile="exo-\${EXO_VERSION}-\${OS}"
if [ -n "\${cli_arch}" ]; then
  srcfile="\${srcfile}-\${cli_arch}"
fi
dstfile="\${INSTALLROOT}/bin/exo-\${EXO_VERSION}"
url="https://github.com/deref/exo/releases/download/v\${EXO_VERSION}/\${srcfile}"

if [ -e "\${dstfile}" ]; then
  if validate_checksum "\${dstfile}"; then
    echo ""
    echo "exo \${EXO_VERSION} was already downloaded; making it the default 🎉"
    echo ""
    echo "To force re-downloading, delete '\${dstfile}' then run me again."
    (
      rm -f "\${INSTALLROOT}/bin/exo"
      ln -s "\${dstfile}" "\${INSTALLROOT}/bin/exo"
    )
    exit_with_success
  fi
fi

(
  cd "$tmpdir"

  echo "Downloading \${srcfile} from ${url}..."
  curl -fLO "\${url}"
  echo "Download complete!"

  if ! validate_checksum "\${srcfile}"; then
    exit 1
  fi
  echo ""
)

(
  mkdir -p "\${INSTALLROOT}/bin"
  mv "\${tmpdir}/\${srcfile}" "\${dstfile}"
  chmod +x "\${dstfile}"
  rm -f "\${INSTALLROOT}/bin/exo"
  ln -s "\${dstfile}" "\${INSTALLROOT}/bin/exo"
)


rm -r "$tmpdir"

echo "exo \${EXO_VERSION} was successfully installed 🎉"
echo ""
exit_with_success  
`;
}
