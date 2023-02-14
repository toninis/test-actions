#!/usr/bin/env bash

set -Eeuxo pipefail

docker pull --platform=linux/x86_64 bitpoke/mysql-operator:v0.6.2
docker pull --platform=linux/x86_64 bitpoke/mysql-operator-sidecar-5.7:v0.6.2
docker pull --platform=linux/x86_64 bitpoke/mysql-operator-orchestrator:v0.6.2
docker pull --platform=linux/x86_64 percona:5.7.35
docker pull --platform=linux/x86_64 prom/mysqld-exporter:v0.11.0

minikube cache add docker-image bitpoke/mysql-operator:v0.6.2
minikube cache add docker-image bitpoke/mysql-operator-sidecar-5.7:v0.6.2
minikube cache add docker-image bitpoke/mysql-operator-orchestrator:v0.6.2
minikube cache add docker-image percona:5.7.35
minikube cache add docker-image prom/mysqld-exporter:v0.11.0

helm repo add bitpoke https://helm-charts.bitpoke.io
helm repo update 
helm install mysql-operator bitpoke/mysql-operator --namespace mysql-operator --create-namespace --set "extraArgs={--mysql-versions-to-image=5.7.26=percona:5.7.35}" --version v0.6.2

kubectl get pods --all-namespaces
sleep 20
kubectl get pods --all-namespaces

kubectl apply -f database.yaml

sleep 9999999999999999
echo "Ready for testing"
