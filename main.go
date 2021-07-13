package main

//go:generate go run script/includeassets.go
import "github.com/deref/installtest/cmd"

func main() {
	cmd.Execute()
}
