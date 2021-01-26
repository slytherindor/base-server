#!/bin/bash -e

# This script should be run on CI/CD platform. If you would like to run it locally
# please provide the required env variables.
# Following variables are required:
# REPOSITORY_NAME - AWS ECR repo to store docker image
# BUCKET_NAME - AWS S3 bucket to fetch web client build

# TODO: Use getopt to pass above variables as args.

set -e
REPOSITORY_EXISTS=$(aws ecr describe-repositories --repository-names=${REPOSITORY_NAME} --region=us-east-1 | jq -r ".repositories[].repositoryName")
if [ ! -z ${REPOSITORY_EXISTS} ] && [ ${REPOSITORY_EXISTS} == ${REPOSITORY_NAME} ]; then
    echo "The AWS ECR repository ${REPOSITORY_NAME} exists"
else
    echo "The AWS ECR repository ${REPOSITORY_NAME} does not exists, creating repository."
    REPOSITORY_CREATED=$(aws ecr create-repository --repository-name=${REPOSITORY_NAME} --region=us-east-1 | jq -r ".repository.repositoryName")
    if [ ! -z  ${REPOSITORY_CREATED} ]; then
        echo "The AWS ECR repository ${REPOSITORY_CREATED} was created successfully"
    else
        echo "Something went wrong"
        exit 1
    fi
fi

echo "Bundle client app with build"
aws s3 sync s3://${BUCKET_NAME}/base-web-client/build build/client
echo "Building docker image."
docker build --tag slytherindor/${REPOSITORY_NAME} .
echo "Tagging docker image."
docker tag slytherindor/${REPOSITORY_NAME} 530678340229.dkr.ecr.us-east-1.amazonaws.com/${REPOSITORY_NAME}
echo "Logging in AWS ECR."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 530678340229.dkr.ecr.us-east-1.amazonaws.com
echo "Pushing to AWS ECR"
docker push 530678340229.dkr.ecr.us-east-1.amazonaws.com/${REPOSITORY_NAME}:latest
set +e
