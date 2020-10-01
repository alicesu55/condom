# The Condom Project: Dockerfile obfuscator in Github Actions

This project serves as a simple obfuscator for a Dockerfile. After obfuscation, the contents of the dockerfile cannot be easily read by a human, but still runs and generates the same layer structure of the container.

This project is designed to run on Github Actions. To use it, add a file to your repository as `.github/workflows/condom.yml`

On every commit, the obfuscated files will appear as a new branch that you specify. In this example, it will be a branch named `compiled`.

```
name: 'Dcokerfile compilation'
on:
  pull_request:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Alice's condom
        uses: alicesu55/condom@v0.0.3
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add csteps
          git commit -m "Add changes" -a
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          force: true
          branch: compiled
          github_token: ${{ secrets.GITHUB_TOKEN }}


```

# Status of the Project

Currently, this is only a proof-of-concept. The Dockerfile will be obfuscated for a little bit, but no strong encryption has been implemented. A determined user can still easily figure out the content of the dockerfile.

This project is under active development. Please do not use it in production in its current shape.

Future work:
 * Implement full encryption for both the steps in the Dockerfile and the files copied to the container during the build process. The content will only be decrypted during the docker build process if the key is provided as an environment variable.
 * Customize the build process to allow replacing the name of the internal executable.

# Do not Read the Master Branch

The real source code is under the `source` branch. The `master` branch is reserved to publish a clean compiled version. This arrangement is due to the nature of GitHub Actions which requires a built version to be checked in. The maintainer of the project (Alice) wishes to have a clean separation between compiled codes and the source code, though many others have made a different choice.

# Contribution

Any pull requests are highly appreciated. There may be some items marked as "help wanted" in the issues section of this project.
