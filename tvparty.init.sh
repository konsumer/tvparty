#!/bin/bash
#/etc/init.d/tvparty

export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules

INSTALL_DIR="/usr/local/share/tvparty"

case "$1" in
  start)
  exec "${INSTALL_DIR}/node_modules/.bin/forever" --sourceDir="${INSTALL_DIR}" -p /var/run app.js
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
