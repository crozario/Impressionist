#!/bin/bash

application_server_cmd="python3 server.py"
user_db_server_cmd="node ../backend/user-database/server.js"
content_db_server_cmd="node ../backend/content-database/server.js"

# remove subprocesses
cleanup() {
    eval "kill 0"
}

if [[ "$OSTYPE" == "linux-gnu" || "$OSTYPE" == "darwin"* ]]; then # Linux and Mac

    # run application, user and content servers in background process
    eval "$content_db_server_cmd sleep 100 & $user_db_server_cmd sleep 100 & $application_server_cmd"
    # eval "2>/dev/null 1>&2 $application_server_cmd & 2>/dev/null 1>&2 $user_db_server_cmd & 2>/dev/null 1>&2 $content_db_server_cmd"
    
    # run cleanup function before exiting program
    trap cleanup EXIT

elif [[ "$OSTYPE" == "msys" ]]; then # Windows (MinGW)
    # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
    echo "Windows"
else
    echo "What are you?"
fi
