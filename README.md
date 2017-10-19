# sprucebot-cli
Hey, I'm Sprucebot! This CLI was designed to give you the tools you need
to help brick-and-mortar businesses thrive in the Internet age. Once I'm
up and running in a store, you'll be able to react to real world events, such
as guests entering or leaving.

Once your skill is ready and making an impact, you can submit it to the
Skills Marketplace so other boutiques, bars, retailers, etc. can start
taking advantage of it.

Remember, our goal is to connect people, not replace them. So make
sure your skill promotes human-to-human connection.

[![Watch Vignette 1](images/video-poster.jpg?raw=true)](https://vimeo.com/196923365)


# Skills Development
Skills are how you give me new... well, skills. A skill is really analogous to
an app. It needs to be fully featured and create a real world experience people remember.
Keep in mind as you're out saving small business that the thing that makes
brick-and-mortar unique is the fact that real people are interacting face-to-face.

It's the ultimate social network, and with your skills giving me the power to
facilitate amazing experiences, brick-and-mortar, ma and pa shops will live long into the future. 🌲🤖

### Prerequisites
* TBD

### Installation
* ~~`yarn add -g sprucebot-cli`~~

### Skill Commands

* `sprucebot skill create "[Skill Name]"`
  * Creates a directory called: skill-${skill-name}
  * Everything is lowercased. [^a-z0-9] are converted to dashes "`-`"
  * All commands require you to be in the skill's directory
  * `cd skill-${skill-name}`
* `sprucebot skill listen [event-name]`
  * Adds a listener to your skill. 
  * Events are lower cased, seperated by dashes "`-`"
  * Creates `./events/event-name.js`
  * Core Events: 
    * did-enter
    * did-leave
    * ~~will-message~~
    * ~~did-message~~
    * ~~will-update-profile~~
    * ~~did-update-profile~~
  * Custom events are namespaced, such as `vip:will-send`
    * Creates `./events/vip/will-send.js`
    * Jump in and start editing
* `sprucebot skill ignore [event-name]`
  * Removes a listener and moves the callback file.
  * `./events/did-enter.js` -> `./events/disabled/did-enter.js`
* `sprucebot skill [get|post|patch|delete] "[route/path]"`
  * Sets up a callback and returns instructions with stub for implimentation
  * Example: 
  * `sprucebot skill get "/admin/:someVariable/test"`<br />
      Route created. <br />
      Add this to your desired controller (or create one) inside `./controllers/${anything}.js`<br />
      modules.export = {<br />
        &nbsp;&nbsp;&nbsp;&nbsp;"get /admin/:someVariable/test": (sb, req, res) {<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('hello world', req.params.someVariable)<br />
      &nbsp;&nbsp;&nbsp;&nbsp;}<br />
      }
* `sprucebot skill route "[route/path]" [path/to/page.js]`
  * Creates a react route and corresponding page stubbed with a React component

### Developer Guidelines
* See [CONTRIBUTING](https://github.com/sprucelabsai/sprucebot-cli/blob/dev/CONTRIBUTING.md) for the rules around skill development.

# Simulating Sprucebot Access Point
When your skill needs to respond to different events (enter, leave), you need to simulate them locally.

* `sprucebot ap start`

Once the AP (access point) simulator is running, you can press different keys to simulate events.

#  Platform Development
This section is only relevant if you've been given permission to work directly on my core systems.

### Prerequisites
* Access to the platform repositories
* [Docker For Mac](https://www.docker.com/docker-mac)
* [Git](https://git-scm.com)
* [bash](https://www.gnu.org/software/bash/)

### Installation
* ~~`yarn add -g sprucebot-cli`~~
* Clone the repo to your local machine `git clone git@github.com:sprucelabsai/sprucebot-cli.git`
* Install dependencies `yarn install`
* Create symlink in global folder `yarn link`
* Reload your terminal and verify installation with `sprucebot -V`

### Developer Guidelines
* See [CONTRIBUTING](https://github.com/sprucelabsai/sprucebot-cli/blob/dev/CONTRIBUTING.md) for the rules around platform development.


### Platform Commands

* `sprucebot platform init`
  * Use option `--select-version` to checkout specific versions once cloned
  * *REQUIRED* You need to fork the following projects:
    * `com-sprucebot-api`
    * `com-sprucebot-web`
    * `sprucebot-dev-services`
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
  * Asks user to remove `hosts` redirects (`*.sprucebot.com`)
  * Asks user to remove Docker images
* `sprucebot platform version`
  * Launch the interactive version select prompt