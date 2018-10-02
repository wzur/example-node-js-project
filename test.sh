#!/bin/sh -u
. venv/bin/activate

docker-compose up --build -d && python test.py --port 443 --cert-path ./nginx/localhost.crt