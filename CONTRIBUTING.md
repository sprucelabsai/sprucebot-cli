## PRs and Code Contributions
* All development work should follow the [Github Flow](https://guides.github.com/introduction/flow/) guidlines
  * Work should be done on your own Fork of the project
  * PRs should be approved by other members of the team. No self merging
* Each commit must pass [JavaScript Standard](http://standardjs.com/) lint rules
  * `npm run lint` also runs using Git `precommit` hook
* Each PR must pass tests
  * `npm test` also runs using Git `prepush` hook

## Branches
* TODO - Branching strategy

## Developer Setup
* Clone the repo to your local machine
* Install dependencies `yarn install` or `npm install`
* Create symlink in global folder `yarn link` or `npm link`
* Reload your terminal and verify installation with `sprucebot -V`