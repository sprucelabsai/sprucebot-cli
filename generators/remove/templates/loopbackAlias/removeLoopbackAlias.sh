#!/bin/sh
DIR="$(cd "$(dirname "$0")" && pwd)"
LOOPBACK_PLIST=io.barbershop.haircut.plist
sudo ifconfig lo0 delete <%= loopbackAlias %>
sudo launchctl unload "/Library/LaunchDaemons/$LOOPBACK_PLIST"
rm -rf /usr/local/etc/haircut
rm "/Library/LaunchDaemons/$LOOPBACK_PLIST"