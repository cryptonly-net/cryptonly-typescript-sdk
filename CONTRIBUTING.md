# Contributing

## Releasing

1. Update `CHANGELOG.md`.
2. Bump `version` in `package.json` and `package-lock.json`.
3. Commit that change on `master`.
4. Tag the commit `vX.Y.Z`. The tag without the leading `v` must equal `package.json` `version`.
5. Publish a GitHub Release for that tag.

The release runs [`.github/workflows/publish.yml`](.github/workflows/publish.yml), which tests the package and publishes it to npm.
