#!/usr/bin/env bash
mkcert -install \
    -cert-file cert.pem \
    -key-file key.pem \
    localhost 127.0.0.1 ::1 192.168.255.23
cat cert.pem key.pem > node_modules/webpack-dev-server/ssl/server.pem
rm cert.pem key.pem
