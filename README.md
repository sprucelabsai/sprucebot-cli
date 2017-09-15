# sprucebot-cli
A super simple cli

# Prerequisites
* Access to github.com repositories is controled via ssh. You will need to add your public key to github.com to be able to read project dependencies. More information can be found [here](https://help.github.com/articles/connecting-to-github-with-ssh/)
* [Docker For Mac](https://www.docker.com/docker-mac) Should be installed on the host machine
* [Git](https://git-scm.com)
* [bash](https://www.gnu.org/software/bash/)

# Installation
* ~~`yarn add -g sprucebot-cli` or `npm install -g sprucebot-cli`~~
* Clone the repo to your local machine `git clone git@github.com:sprucelabsai/sprucebot-cli.git`
* Install dependencies `yarn install` or `npm install`
* Create symlink in global folder `yarn link` or `npm link`
* Reload your terminal and verify installation with `sprucebot -V`
## Developer Setup
* See [CONTRIBUTING](https://github.com/sprucelabsai/sprucebot-cli/blob/dev/CONTRIBUTING.md) for alternative installation methods

# Platform Commands

* `sprucebot platform init`
  * *REQUIRED* You need to fork `com-sprucebot-api` and `com-sprucebot-hello` projects
  * Clones platform repositories and setup local docker build
  * Creates docker-compose build directory
* `sudo sprucebot platform configure`
  * Setup dns and hosts configurations.
  * Adds `local.sprucebot.com`, `local-api.sprucebot.com`, and `local-devtools.sprucebot.com` to `hosts`
* `sprucebot platform start`
  * Runs docker-compose from sprucebot build directory
  * Visit [Local Sprucebot](https://local.sprucebot.com) to verify platform is running properly
* `sudo sprucebot platform remove`
  * Allows for the removal of platform specific files and configurations
  * Asks user to `rm -rf sprucebot/*`
  * Asks user to remove `loopback` alias
  * Asks user to remove `hosts` redirects (`*.sprucebot.com`)