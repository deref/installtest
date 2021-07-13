package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "installtest",
	Short: "Installtest is a binary application that can update itself",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Ok")
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
