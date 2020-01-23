# sprucebot-cli

Hey, I'm Sprucebot! This CLI was designed to give you the tools you need to begin building skills to help brick-and-mortar businesses thrive in the Internet age.

Our goal is to connect people, not replace them. So make
sure your skill promotes human-to-human connection.

[![Watch Vignette 1](images/video-poster.jpg?raw=true)](https://vimeo.com/196923365)

## Skills Development

First there were desktop applications, then mobile apps, now we are entering the `Decade of the Skill`! 💥💥💥

They are the next step in `App Evolution`. They are interface agnostic. They react to real world events.

Beyond reacting JUST voice commands (Alexa -_COMING SOON_-, Google Home -_COMING SOON_-, HomePod -_COMING SOON_-). I can chat through pretty much any interface (sms, Facebook Messenger -_COMING SOON_-, etc.), I know when teammates arrive at work, when guests arrive at local businesses, when business owners ask to borrow a ladder from a neighbor -_COMING SOON_-, when guests message a business, EVEN WHEN SOMEONE BOOKS A HAIRCUT!! 💇

_But, to be clear; I take privacy very seriously and as a Skills Developer, I'm not gonna share much with you. Seriously, all you'll get is the guest's first name and a link to their profile photo in a few sizes. Oh, and you can only access data your skill collects. All data shared between skills is done through the [emitting of events](https://github.com/liquidg3/sprucebot-skills-kit/blob/dev/docs/events.md)._

Anyway, what was I saying before things got all serious?

It's the ultimate social network, and with your skills giving me the power to
facilitate amazing experiences, brick-and-mortar, ma and pa shops will live long into the future. 🌲🤖

### Prerequisites

- [nvm](https://github.com/creationix/nvm/blob/master/README.md)
- [git](https://git-scm.com/downloads)
- [node](https://nodejs.org)
- [yarn](https://github.com/yarnpkg/yarn) (**OPTIONAL**)

### Installation

```bash
npm i -g @sprucelabs/sprucebot-cli
```

### Getting Started Building Your Skill

Before you build your first Skill, you need to setup a business, lets do that!

1. Visit https://platform.spruce.ai and login.
2. Scroll to the bottom of the page and tap **Add My Location**.
3. Once your location is created, you can start to dev your first skill!
4. `npm i -g @sprucelabs/sprucebot-cli`
5. `cd ~/path/to/dev/folder`
6. `sprucebot skill create`
7. Follow steps and change the world! 💪
8. **Be sure to select a version that matches 7.4.x (not canary).**

### Skill Commands

This is where the magic happens!

- `sprucebot skill create`
  - Downloads the [Skills Kit](https://www.npmjs.com/package/sprucebot-skills-kit) and helps you get your new skill setup
  - All subsequent commands require you to be in the skill's directory
- `sprucebot remote set [prod|alpha|stage|qa|dev|alpha]`
  - You probably only have access to `prod`
  - If you wish test skills at `alpha` locations, eg [Spruce](https://vimeo.com/214239239), email `scientists@sprucelabs.ai`
  - If you wish to get early access to features on `stage`... you guessed it
- `sprucebot skill register`
  - Registers your skill with `remote`
- `sprucebot skill update`
  - Updates your skill from `package.json#version` to `sprucebot-skills-kit@version`
  - Requires a clean working directory and git repo
  - To see what changed, use `git status`
  - After resolving any conflicts run `yarn install && yarn test`
- `sprucebot skill unregister` -_COMING SOON_-
  - Takes your skill entirely off remote
  - It will be uninstalled from all locations that had it
  - All meta data will be deleted

### User Commands

Requires you to have an account at your chosen `remote` (probably platform.spruce.ai).

- `sprucebot user login`
  - Log you in and sets you up to dev at a location of your choosing
- `sprucebot user logout` -_COMING SOON_-\*
  - Logs you out

### Simulator Commands

When your skill needs to respond to different events (enter, leave), you need to simulate them locally.

- `cd my-skill-dir`
- `sprucebot simulator start`

Once the simulator is running, you can press different keys to simulate events. You'll see when you get there.

# Platform Development

This section is only relevant if you've been given permission to work directly on my core systems.

### Prerequisites

- Access to the platform repositories
- [Docker For Mac](https://www.docker.com/docker-mac)
- [Git](https://git-scm.com)
- [Postgresql on Host machine](https://gist.github.com/sgnl/609557ebacd3378f3b72)
- [bash](https://www.gnu.org/software/bash/)

### Platform Commands

- `sprucebot platform install [path]`
  - `path` defaults to `./sprucebot`
  - `-p --platform` to select `web`, `api`, or defaults `all`
  - `--s --select-version` to checkout specific versions once cloned
  - `-b --branch` the branch to checkout, defaults to `dev`
  - _REQUIRED_ You need to fork the following projects:
    - `com-sprucebot-api`
    - `com-sprucebot-web`
    - `sprucebot-dev-services`
- `sudo sprucebot platform development`
  - Setup dns and hosts configurations for local development.
  - Adds `local.spruce.ai`, `local-api.spruce.ai`, and `local-devtools.spruce.ai` to `hosts`
- `sprucebot platform start [key]`
  - Launches the platform
  - `key` can be `all`, `web`, `api`, `relay`
  - Default to `all`
  - Visit your local [Sprucebot](https://local.spruce.ai) to verify platform is running properly
- `sudo sprucebot platform logs [key]`
  - `key` can be `all`, `web`, `api`, `relay`
  - Default to `all`
- `sprucebot platform version`
  - Launch the interactive version select prompt

### Developer Guidelines

- See [CONTRIBUTING](https://github.com/sprucelabsai/sprucebot-cli/blob/dev/docs/CONTRIBUTING.md) for the rules around skill development.
