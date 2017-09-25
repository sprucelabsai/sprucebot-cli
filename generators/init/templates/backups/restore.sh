#/bin/bash
set -e

###################################################################
# Restores a remote database to a local docker container
# Author: Ken Goldfarb <ken@barbershop.io>
# Modified By: Taylor Romero <taylor@sprucelabs.ai>
###################################################################

usage ()
{
    echo ""
    echo "!! This is a destructive script.  All data in the local docker database will be lost !!"
    echo "Dumps a remote database and restores the database to docker"
    echo ""
    echo "Usage:"
    echo './restore.sh -h <host> -d <database name> -u <user> -p <password> -r <remote host> -l <local host>'
    echo ""
    echo "Example:"
    echo './restore.sh -h "1234.amazonaws.com" -d heroku_1234 -u user1234 -p pw1234 -l "localhost"'
    echo ""
    parameters
    echo ""
    exit
}

parameters ()
{
    echo "*************************"
    echo "** PARAMETERS"
    echo "*************************"
    echo "HOST: $HOST"
    echo "USER: $USER"
    echo "PASSWORD: $PASSWORD"
    echo "DB: $DB"
    echo "LOCAL_HOST: $LOCAL_HOST"
    echo "*************************"
}

while [ "$1" != "" ]; do
case $1 in
        -h )           shift
                       HOST=$1
                       ;;
        -u )           shift
                       USER=$1
                       ;;
        -p )           shift
                       PASSWORD=$1
                       ;;
        -d )           shift
                       DB=$1
                       ;;
        -r )           shift
                       REMOTE_HOST=$1
                       ;;
        -l )           shift
                       LOCAL_HOST=$1
                       ;;
        * )            EXTRA=$1
    esac
    shift
done

if [ "$HOST" = "" ]
then
    usage
fi
if [ "$USER" = "" ]
then
    usage
fi
if [ "$PASSWORD" = "" ]
then
    usage
fi
if [ "$DB" = "" ]
then
    usage
fi
if [ "$LOCAL_HOST" = "" ]
then
    usage
fi

echo ""
parameters
echo ""
echo ""

echo "Dumping remote database $HOST/$DB > backup.sql"
PGPASSWORD=$PASSWORD pg_dump -h $HOST -U $USER $DB > backup.sql

echo ""
echo "Deleting local docker db"
PGPASSWORD=barbershop123 psql -h $LOCAL_HOST -U barbershopio docker_db -c "drop schema public cascade"

echo ""
echo "Recreating local docker db"
PGPASSWORD=barbershop123 psql -h $LOCAL_HOST -U barbershopio docker_db -c "create schema public"

echo ""
echo "Restoring to docker container at $LOCAL_HOST"
PGPASSWORD=barbershop123 psql -h $LOCAL_HOST -U barbershopio docker_db < backup.sql
#
#echo ""
#echo "All done!  Test it's working by connecting to psql:'"
#echo docker exec sprucebot_postgres bash -c "\"PGPASSWORD=barbershop123 psql -h 127.0.0.1 -U barbershopio docker_db -c \\\"SELECT * FROM pg_catalog.pg_tables\\\"\""

