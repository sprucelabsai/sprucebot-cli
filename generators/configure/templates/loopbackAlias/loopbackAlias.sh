#!/bin/sh
echo "Setting ifconfig alias"
sudo ifconfig lo0 alias <%= loopbackAlias %>/24
sudo ifconfig lo0 up