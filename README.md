# sprucebot-cli

Hey, I'm Sprucebot! This CLI was designed to give you the tools you need to begin building skills to help brick-and-mortar businesses thrive in the Internet age.

Our goal is to connect people, not replace them. So make
sure your skill promotes human-to-human connection.

[![Watch Vignette 1](images/video-poster.png?raw=true)](https://vimeo.com/196923365)

## Skills Development

First there were desktop applications, then mobile apps, now we are entering the `Decade of the Skill`! 💥💥💥

They are the next step in `App Evolution`. They are interface agnostic. They react to real world events.

Beyond voice commands (Alexa -_COMING SOON_-, Google Home -_COMING SOON_-, HomePod -_COMING SOON_-). I can chat through pretty much any interface (sms, Facebook Messenger -_COMING SOON_-, etc.), I know when teammates arrive at work, when guests arrive at local businesses, when business owners ask to borrow a ladder from a neighbor -_COMING SOON_-, when guests message a business, EVEN WHEN SOMEONE BOOKS A HAIRCUT!! 💇

_But, to be clear; I take privacy very seriously and as a Skills Developer, I'm not gonna share much with you. Seriously, all you'll get is the guest's first name and a link to their profile photo in a few sizes. Oh, and you can only access data your skill collects. All data shared between skills is done through [Mercury](https://developer.spruce.ai)._

Anyway, what was I saying before things got all serious?

It's the ultimate social network, and with your skills giving me the power to
facilitate amazing experiences, brick-and-mortar, ma and pa shops will live long into the future. 🌲🤖

### Prerequisites

- [nvm](https://github.com/creationix/nvm/blob/master/README.md)
- [git](https://git-scm.com/downloads)
- [node](https://nodejs.org)
- [yarn](https://github.com/yarnpkg/yarn) (**OPTIONAL**)

### Installation

Yarn

```bash
yarn global add @sprucelabs/sprucebot-cli
```

Npm

```bash
npm install -g @sprucelabs/sprucebot-cli
```

Sprucebot can be accessed anywhere by running

```bash
sb
```

### Skill Commands

This is how I start creating a skill for you. I can even register it with the platform when you're ready.

- `sb skill create` - Start creating a skill
  - `-n` `--name` - Give your skill a name "wrapped in quotes".
  - `-s` `--slug` - A machine friendly, human readable identifier (using your skill's name lower-case-and-hyphan-separated)
  - `-d` `--description` - A description of your skill
  - `-v` `--version` - Set the version of skills kit to download, defaults to latest stable
  - `-d` `--destination` - Where should I save the skill? defaults to a folder that matches the slug
- `sb remote set [prod|alpha|stage|qa|dev|alpha]` - Point your skill to a different remote environment. For Spruce Labs devs only (defaults to `prod`)
- `sb skill register` - Register your skill with the `remote` environment
  - `--fast` pass this to skip confirmation prompts
- `sb skill update` - Updates your skill from `package.json#version` to `sprucebot-skills-kit@version`
- `sb skill unregister` -_COMING SOON_- Removes your skill from the `remote` environment
- `sb skill install` -_COMING SOON_- Install a skill
  - `-s` `--skill` - The skill's slug
  - `-o` `--orgId` - The organization we're installing to
  - `-l` `--locationIds` - By default a skill is enabled at all locations, but you can override that by passing a comma seperated string of Id's
- `sb skill uninstall` -_COMING SOON_- Uninstall a skill at an org
  - `-s` `--skill` - The skill's slug
  - `-o` `-orgId` - The organization's id
- `sb skill enable` -_COMING SOON_- Enable a skill at a location
  - `-l` `-locationIds` - Comma separated list of location ids.

### Seed Commands

To get working fast, you can provision yourself a fully functioning organization. How cool is that!? 💪

- `sb seed organization` -_COMING SOON_- Seed an organization (limit 1 per size per environment)
  - `--size` - small|medium|large|huge
    - _small_ - Generates a 1 to 5 location small business
    - _medium_ - A small franchise or expanding family business
    - _large_ - Thousand plus locations, but probably still private
    - _huge_ - Publically traded bohemith
- `sb seed locations` -_COMING SOON_- Add a location to an org
  - `-o` `--organizationId` - The org we're seeding under
  - `-n` `--num` - How many locations should we create (defaults to 1)?
- `sb seed role [guest|teammate|manager|groupManager]` -_COMING SOON_- Seed some people 👨‍👩‍👧‍👦
  - `-l` `--locationId` - The location we're seeding under
  - `-n` `--num` - How many people should we create (defaults to 1)?
  - `-j` `--jobIds` - By default I'll assign people to random jobs, you can force me to select certain jobs by passing a comma separated string of job id's
- `sb seed skill` -_COMING SOON_- Send the seed command to a skill
  - `-s` `--skills` - The comma separated list of slugs of the skill you're targeting
  - `-o` `--orgId` - The ID of the organization to seed

### **M**ercury Commands ☿

For emitting and listening to events in the digital and physical worlds. ⚡️ Most these commands simply update `config/eventContract.ts`

- `sb m create event` -_COMING SOON_- Introduce a new event into the system. Note: You'll need to define your event's payload and response body in `config/eventContract.ts` once this command is complete
  - `-n` `--name` - The name of the event, must start with your skill's slug i.e. `commerce:did-checkout`
  - `-d` `--description` - A few more words about your new event
- `sb m disable event` -_COMING SOON_- Temporarily disables an event
  - `-n` `--name` - The name of the event
- `sb m enable event` -_COMING SOON_- Enables an event
  - `-n` `--name` - The name of the event
- `sb m create listener` -_COMING SOON_- Create's an event listener file with a callback strictly typed and ready to roll at `server/listeners/{{name}}.ts` and a corresponding test file at `server/tests/listeners/{{name}}.ts`
  - `-n` `--name` - The name of the event you want to listen to
- `sb m disable listener` -_COMING SOON_- Temporarily disable your event listener.
  - `-n` `--name` - The name of the event
- `sb m enable listener` -_COMING SOON_- Enable your event listener
  - `-n` `--name` - The name of the event

### **H**eartwood Commands

For creating skill views. 🏞

- `sb h create view` -_COMING SOON_- Create a new skill view in `interface/pages/skill-views/{{route_path}}.tsx`
  - `-r` `--route` - An enum of (core routes)[https://developer.spruce.ai/#/core-routes], where the skill view will render
- `sb h create page` -_COMING SOON_- Create a web page that can be rendered outside the platform at `interface/pages/{{path}}.tsx`
  - `-p` `--path` - The path to the page, e.g. `/signup`

### **R**EST Commands

For creating REST endpoints. 🛌

- `sb r create action` -_COMING SOON_- Create a new action and a cooresponding test at `server/rest/actions/{{method}}/{{last_segment}}.ts` and `server/test/rest/actions/{{method}}{{last_segment}}.ts` respectively, e.g. `server/rest/actions/post/submit-form.ts` and `server/tests/rest/actions/post/submit-form.ts`
  - `-p` `--path` - The path to the endpoint e.g. `/rest/v1/submit-form.json`
  - `-m` `--method` - post|get|put|delete
  - `-d` `--desc` - Describe your endpointdf

### **G**QL Commands

For creating GQL endpoints.

- `sb g create endpoint` -_COMING SOON_- Create a new GQL endpoint at `server/gql/{{mutations|queries}}/{{name}}/{{name}}.ts` and corresponding sdl at `server/gql/{{mutations|queries}}/{{name}}/{{name}}.gql` and a corresponding test at `server/tests/gql/{{mutations|queries}}/{{name}}.ts`
  - `-t` `--type` - mutation|query
  - `-n` `--name` - The name of the mutation or query, camelCase
- `sb g create type` - Create a new GQL type at `server/gql/types/{{name}}.sdl`
  - `-n` `--name` - The name of the type, PascalCase
- `sb g regenerate queries` -_COMING SOON_- Regenerates gql query files that can be included in both the front end and back end when making gql requests.

### Model Commands

For creating Sequelize data models.

- `sb model create` -_COMING SOON_- Create a new data model at `server/models/{{name}}.ts`
  - `-n` `--name` - The name of the model, PascalCase
- `sb model create migration` -_COMING SOON_- Create a new data migration at `server/migrations/{{timestamp}}-{{name}}.ts`
  - `-n` `--name` - Name the migration, lower-case-hyphen-separated

### **U**ser Commands

Login/Signup, the world is yours!

- `sb u login` - Log you in and sets you up to dev at a location of your choosing
  - `-p` `--phone` - Your phone for sms confirmation
- `sb u logout` -_COMING SOON_- Logs you out

### Simulator Commands

When your skill needs to respond to different events (enter, leave), you need to simulate them locally.

- `sb sim start` -_COMING SOON_- Starts the simulator in interactive mode
- `sb sim emit` -_COMING SOON_- Emit an event
  - `-n` `--name` - The name of the event, i.e. "booking:did-book-appointment" or ["did-enter"](https://developer.spruce.ai/#/events?id=core-events).
  - `-p` `--payload` - A JSON payload in "quotes" to be passed with the event (core events come with payloads)
  - `-f` `--file` - Point to a `.json` file that will be used as the payload

### Service Commands

Write some code that touches another API or does some other async work.

- `sb service create` -_COMING SOON_- Create a service at `server/services/{{name}}.ts`
  - `-n` `--name` - Name the service, PascalCase

### Utility Commands

Here is code that is reused often and makes our lives easier.

- `sb utility create` -_COMING SOON_- Create a utility at `server/utilities/{{name}}.ts`
  - `-n` `--name` - Name the utility, PascalCase

# Platform Development

This section is only relevant if you've been given permission to work directly on my core systems.

### Platform Commands

- `sb platform install [path]` -_COMING SOON_- Install the whole or parts of the platform (SL team only), `path` defaults to `./sprucebot`
  - `-p --platform` - `all`, `web`, `api`, or defaults `all`
  - `-b --branch` - the branch to checkout, defaults to `dev`
- `sb platform start [all|web|api]` -_COMING SOON_- Launches the platform, defaults to `all`
  - Visit your local [Spruce instance](https://local.spruce.ai) to verify platform is running properly
- `sudo sprucebot platform logs [all|web|api]` -_COMING SOON_- View logs for the platform, defaults to `all`

### Learn More

- [Skills Kit Readme](https://developer.spruce.ai)
