#!/usr/bin/env bash
docker build -t gijsvandulmen/echoserver:latest .
docker push gijsvandulmen/echoserver:latest

# arm64
docker build -t gijsvandulmen/echoserver:latest-arm64 --build-arg ARCH=arm64v8/ .
docker push gijsvandulmen/echoserver:latest-arm64

# extra tag for flagger deployments
docker tag gijsvandulmen/echoserver:latest gijsvandulmen/echoserver:v9