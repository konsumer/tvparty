#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"
nohup node app.js > /var/log/tvparty.log 2> /var/log/tvparty.log &
