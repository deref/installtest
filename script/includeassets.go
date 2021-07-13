package main

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

const (
	assetsDir = "assets"
)

// Reads all files in the assets folder and encodes them as strings literals
// in assets.go
func main() {
	fs, _ := ioutil.ReadDir(assetsDir)
	dir := filepath.Join(".", "priv", "assets")
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		panic(err)
	}
	out, _ := os.Create(filepath.Join(dir, "variables.go"))
	out.Write([]byte("package assets \n\nconst (\n"))
	for _, f := range fs {
		filePath := filepath.Join(assetsDir, f.Name())
		content, err := ioutil.ReadFile(filePath)
		if err != nil {
			panic(err)
		}
		out.Write([]byte("\t"))
		out.Write([]byte(strings.Title(strings.ToLower(f.Name()))))
		out.Write([]byte(" = `"))
		out.Write([]byte(strings.TrimRight(string(content), "\r\n")))
		out.Write([]byte("`\n"))
	}
	out.Write([]byte(")\n"))
}
