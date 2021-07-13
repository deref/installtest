package assets_test

import (
	"testing"

	"github.com/deref/installtest/priv/assets"
)

func TestVersionExists(t *testing.T) {
	if assets.Version == "" {
		t.Error("No version set")
	}
}
