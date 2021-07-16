package cmd

import (
	"fmt"

	"github.com/deref/installtest/assets"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(versionCmd)
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of installtest",
	Long:  `A command for printing the current version`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("installtest: %s\n", assets.Version)
	},
}
