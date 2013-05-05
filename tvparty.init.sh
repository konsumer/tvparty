#!/bin/bash
# On Linux: Install this file in /etc/init.d/tvparty

# set this to wherever you installed tvparty
INSTALL_DIR="/usr/local/share/tvparty"

export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules:$INSTALL_DIR/node_modules

case "$1" in
  start)
  exec "${INSTALL_DIR}/node_modules/.bin/forever" --sourceDir="${INSTALL_DIR}" -a -p /var/run -l /var/log/tvparty-daemon.log -o /var/log/tvparty-out.log -e /var/log/tvparty-err.log app.js > /dev/null 2> /dev/null &
  ;;
stop)
  exec "${INSTALL_DIR}/node_modules/.bin/forever" stop --sourceDir="${INSTALL_DIR}" app.js
  ;;
*)
  echo "Usage: /etc/init.d/tvparty {start|stop}"
  exit 1
  ;;
esac

exit 0
