# sprucebot-cli
A super simple cli

# Installation
* ~~`yarn add -g sprucebot-cli` or `npm install -g sprucebot-cli`~~
* See [CONTRIBUTING](https://github.com/sprucelabsai/sprucebot-cli/blob/dev/CONTRIBUTING.md) for alternative installation methods

# Platform Commands
Platform commands require the following packages to be installed and available to run in `$PATH`
* [Docker](http://docker.com)
* [Git](https://git-scm.com)
* [bash](https://www.gnu.org/software/bash/) or [Bash For Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about)


* `sprucebot platform init`
  * *REQUIRED* You need to fork `com-sprucebot-api` and `com-sprucebot-hello` projects
  * Clones platform repositories and setup local docker build
  * Creates docker-compose build directory
* `sudo sprucebot platform configure`
  * Setup dns and hosts configurations.
  * Adds `local.sprucebot.com`, `local-api.sprucebot.com`, and `local-devtools.sprucebot.com` to `hosts`
  * Creates loopbackAlias from `config.loopbackAlias`
* `sprucebot platform start`
  * Runs docker-compose from sprucebot build directory
  * Visit [Local Sprucebot](https://local.sprucebot.com) to verify platform is running properly
* `sprucebot platform remove`
  * Allows for the removal of platform specific files and configurations
  * Asks user to `rm -rf sprucebot/*`
  * Asks user to remove `loopback` alias
  * Asks user to remove `hosts` redirects (`*.sprucebot.com`)