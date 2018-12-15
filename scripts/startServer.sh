#!/bin/bash

# Usage: Enter folder directory and run ./scripts/startServer.sh

baseDir=`pwd`

nodemon ${baseDir}/app.js &
nodemon ${baseDir}/fileUpload.js &

echo "Starting server"

sleep 2 && echo "To stop the servers, do a Control + C"
while true; do sleep 1; done
