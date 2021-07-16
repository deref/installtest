# installtest

This package is a test/demonstration of creating a distributable binary application that can update itself.

## Publishing a new version

The GitHub actions on this project are configured to create a version tag whenever the VERSION file is updated. Creating a version tag will subsequently trigger the creation of a release. The release does the following:

1. Create a GitHub Release named after the tag.
2. Build binaries using a matrix build.
3. Upload the binaries to the release.
4. Update the version stored in CloudFlare Workers KV, which is used to generate the "latest" install script and is also used by the self-update function.
