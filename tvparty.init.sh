#!/bin/sh
#/etc/init.d/tvparty

export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules

case "$1" in
  start)
  exec forever --sourceDir=/usr/local/share/tvparty -p /var/run app.js
  ;;
stop)
  exec forever stop --sourceDir=/usr/local/share/tvparty app.js
  ;;
*)
  echo "Usage: /etc/init.d/tvparty {start|stop}"
  exit 1
  ;;
esac

exit 0