package assets_test

import (
	"testing"

	"github.com/deref/installtest/assets"
)

func TestVersionExists(t *testing.T) {
	if assets.Version == "" {
		t.Error("No version set")
	}
}
