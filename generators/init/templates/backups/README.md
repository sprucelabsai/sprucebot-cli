# Importing Data From Dev
./restore.sh is run automatically in `sprucebot_api/src/app/orm/index.js:up()` if no organizations are found on the local machine.

The goal is to ensure devs have workable data

After, sequelize migrations are run to bring the schema up-to-date.