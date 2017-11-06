# Skills Contributions
In order to ensure the best experience possible for all brick-and-mortar business owners, we need to make sure we are disciplined in how we design, build, and deploy skills.
* TBD

# Platform Contributions
If you have been approved to work on the core platform, follow the guidelines below. We are not accepting any new platform contributors, but star this repo to be notified when things chang.

### PRs and Code Contributions
* All development work should follow the [Github Flow](https://guides.github.com/introduction/flow/) guidlines
  * Work should be done on your own Fork of the project
  * PRs should be approved by other members of the team. No self merging
* Each commit must pass [JavaScript Standard](http://standardjs.com/) lint rules
  * `npm run lint` also runs using Git `precommit` hook
* Each PR must pass tests
  * `npm test` also runs using Git `prepush` hook

### Branches
* TODO - Branching strategy

### Developer Setup
* Clone the repo to your local machine
* Install dependencies `yarn install` or `npm install`
* Create symlink in global folder `yarn link` or `npm link`
* Reload your terminal and verify installation with `sprucebot -V`