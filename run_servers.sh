#!/bin/bash

application_server_cmd="python3 application/server.py"
user_db_server_cmd="node backend/user-database/server.js"
content_db_server_cmd="node backend/content-database/server.js"

cleanup() {
    echo "exiting..."
    eval "killall node"
    eval "killall Python"
}

if [[ "$OSTYPE" == "linux-gnu" || "$OSTYPE" == "darwin"* ]]; then # Linux
    eval "2>/dev/null 1>&2 $application_server_cmd & 2>/dev/null 1>&2 $user_db_server_cmd & 2>/dev/null 1>&2 $content_db_server_cmd &"
    # trap cleanup EXIT
    echo "Turned on Application, User and Content Server."

elif [[ "$OSTYPE" == "msys" ]]; then # Windows (MinGW)
    # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
    echo "Windows"
else
    echo "What are you?"
fi
