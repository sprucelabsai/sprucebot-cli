# sprucebot-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/sprucelabsai/sprucebot-cli.svg)](https://greenkeeper.io/)
Hey, I'm Sprucebot! This CLI was designed to give you the tools you need to begin building skills to help brick-and-mortar businesses thrive in the Internet age. 

Our goal is to connect people, not replace them. So make
sure your skill promotes human-to-human connection.

[![Watch Vignette 1](images/video-poster.jpg?raw=true)](https://vimeo.com/196923365)

## Skills Development
First there were desktop applications, then mobile apps, now we are entering the `Decade of the Skill`!  💥💥💥

They are the next step in `App Evolution`. They are interface agnostic. They react to real world events. 

Beyond reacting JUST voice commands (Alexa -*COMING SOON*-, Google Home -*COMING SOON*-, HomePod -*COMING SOON*-). I can chat through pretty much any interface (sms, Facebook Messenger -*COMING SOON*-, etc.), I know when teammates arrive at work, when guests arrive at local businesses, when business owners ask to borrow a ladder from a neighbor -*COMING SOON*-, when guests message a business, EVEN WHEN SOMEONE BOOKS A HAIRCUT -*COMING SOON*-!! 💇

*But, to be clear; I take privacy very seriously and as a Skills Developer, I'm not gonna share much  with you. Seriously, all you'll get is the guest's first name and a link to their profile photo in a few sizes. Oh, and you can only access data your skill collects. All data shared between skills is done through the [emitting of events](https://github.com/liquidg3/sprucebot-skills-kit/blob/dev/docs/events.md).*

Anyway, what was I saying before things got all serious?

It's the ultimate social network, and with your skills giving me the power to
facilitate amazing experiences, brick-and-mortar, ma and pa shops will live long into the future. 🌲🤖

### Prerequisites
* [nvm](https://github.com/creationix/nvm/blob/master/README.md)
* [git](https://git-scm.com/downloads)
* [node](https://nodejs.org)
* [yarn](https://github.com/yarnpkg/yarn) (**OPTIONAL**)

### Installation
```bash
yarn global add sprucebot-cli

```


### Skill Commands
This is where the magic happens!

* `sprucebot skill create`
  * Downloads the [Skills Kit](https://www.npmjs.com/package/sprucebot-skills-kit) and helps you get your new skill setup
  * All subsequent commands require you to be in the skill's directory
* `sprucebot remote set [prod|alpha|stage|qa|dev|alpha]`
  * You probably only have access to `prod`
  * If you wish test skills at `alpha` locations, eg [Spruce](https://vimeo.com/214239239), email `scientists@sprucelabs.ai`
  * If you wish to get early access to features on `stage`... you guessed it
* `sprucebot skill register`
  * Registers your skill with `remote`
* `sprucebot skill update`
  * Updates your skill from `package.json#version` to `sprucebot-skills-kit@version`
  * Requires a clean working directory and git repo
  * To see what changed, use `git status`
  * After resolving any conflicts run `yarn install && yarn test`
* `sprucebot skill unregister` -*COMING SOON*-
  * Takes your skill entirely off remote
  * It will be uninstalled from all locations that had it
  * All meta data will be deleted
* `sprucebot skill listen [event-name]`-*COMING SOON*-
  * Adds a listener to your skill. 
  * Events are lower cased, seperated by dashes "`-`"
  * Creates `./events/event-name.js`
  * Custom events are namespaced, such as `vip:will-send`
    * Creates `./events/vip/will-send.js`
    * Jump in and start editing
* `sprucebot skill ignore [event-name]` -*COMING SOON*-
  * Removes a listener and moves the callback file.
  * `./events/did-enter.js` -> `./events/disabled/did-enter.js`
* `sprucebot skill [get|post|patch|delete] "[route/path]"` -*COMING SOON*-
  * Stubs a controller & route
* `sprucebot skill page /path` -*COMING SOON*-
  * Creates a react route and corresponding page stubbed with a React component
  * Example: `/guest/profiles/:profileId/bookings/:bookingId` generates `/pages/guest/profiles/bookings.js`

### User Commands
Auth n' such. Requires you to have an account at your chosen `remote` (probably hello.sprucebot.com).

* `sprucebot user login`
  * Log you in and sets you up to dev at a location of your choosing
* `sprucebot user logout` -*COMING SOON*-*
  * Logs you out

### Simulator Commands
When your skill needs to respond to different events (enter, leave), you need to simulate them locally.

* `cd my-skill-dir #Run the simulator in your skill`
* `sprucebot simulator start`

Once the simulator is running, you can press different keys to simulate events. You'll see when you get there.

#  Platform Development
This section is only relevant if you've been given permission to work directly on my core systems.

### Prerequisites
* Access to the platform repositories
* [Docker For Mac](https://www.docker.com/docker-mac)
* [Git](https://git-scm.com)
* [Postgresql on Host machine](https://gist.github.com/sgnl/609557ebacd3378f3b72)
* [bash](https://www.gnu.org/software/bash/)

### Platform Commands

* `sprucebot platform install [path]`
  * `path` defaults to `./sprucebot`
  * `-p --platform` to select `web`, `api`, or defaults `all`
  * `--s --select-version` to checkout specific versions once cloned
  * `-b --branch` the branch to checkout, defaults to `dev`
  * *REQUIRED* You need to fork the following projects:
    * `com-sprucebot-api`
    * `com-sprucebot-web`
    * `sprucebot-dev-services`
* `sudo sprucebot platform development`
  * Setup dns and hosts configurations for local development.
  * Adds `local.sprucebot.com`, `local-api.sprucebot.com`, and `local-devtools.sprucebot.com` to `hosts`
* `sprucebot platform start [key]`
  * Launches the platform
  * `key` can be `all`, `web`, `api`, `relay`
  * Default to `all`
  * Visit your local [Sprucebot](https://local.sprucebot.com) to verify platform is running properly
* `sudo sprucebot platform logs [key]`
  * `key` can be `all`, `web`, `api`, `relay`
  * Default to `all`
* `sprucebot platform version`
  * Launch the interactive version select prompt

### Developer Guidelines
* See [CONTRIBUTING](https://github.com/sprucelabsai/sprucebot-cli/blob/dev/docs/CONTRIBUTING.md) for the rules around skill development.
