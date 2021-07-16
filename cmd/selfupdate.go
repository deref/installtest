package cmd

import (
	"fmt"

	"github.com/deref/installtest/assets"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(selfUpdateCmd)
}

var selfUpdateCmd = &cobra.Command{
	Use:   "self-update",
	Short: "Updates installtest to the latest version",
	Long:  `Checks for the most recent version of installtest and updates itself if it is out of date`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("TODO: Update from %s to ?\n", assets.Version)
	},
}
