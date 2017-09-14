#!/bin/sh
DIR="$(cd "$(dirname "$0")" && pwd)"
LOOPBACK_SCRIPT="$DIR/loopbackAlias.sh"
LOOPBACK_PLIST="$DIR/io.barbershop.haircut.plist"
mkdir -p /usr/local/etc/haircut
cp "$LOOPBACK_SCRIPT" /usr/local/etc/haircut
sudo cp "$LOOPBACK_PLIST" /Library/LaunchDaemons/
chmod 0777 /usr/local/etc/haircut/loopbackAlias.sh
bash /usr/local/etc/haircut/loopbackAlias.sh
sudo launchctl load -w /Library/LaunchDaemons//io.barbershop.haircut.plist