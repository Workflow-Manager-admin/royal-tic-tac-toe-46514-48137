#!/bin/bash
cd /home/kavia/workspace/code-generation/royal-tic-tac-toe-46514-48137/web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

