#!/bin/bash

application_server_cmd="python3 application/server.py"
user_db_server_cmd="node backend/user-database/server.js"
content_db_server_cmd="node backend/content-database/server.js"

# remove all node and python processes
cleanup() {
    eval "killall node"
    eval "killall Python"
}

if [[ "$OSTYPE" == "linux-gnu" || "$OSTYPE" == "darwin"* ]]; then # Linux and Mac

    # run application, user and content servers in background process
    eval "2>/dev/null 1>&2 $application_server_cmd & 2>/dev/null 1>&2 $user_db_server_cmd & 2>/dev/null 1>&2 $content_db_server_cmd"
    # trap cleanup EXIT
    echo "Started Application, User and Content Server"

    # run cleanup function before exiting program
    trap cleanup EXIT

    # loop forever
    while true
    do
        echo 
    done

elif [[ "$OSTYPE" == "msys" ]]; then # Windows (MinGW)
    # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
    echo "Windows"
else
    echo "What are you?"
fi
