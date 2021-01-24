#!/bin/bash

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
    fi
fi

echo "Building docker image."
docker build --tag slytherindor/${REPOSITORY_NAME} .
echo "Tagging docker image."
docker tag slytherindor/${REPOSITORY_NAME} 530678340229.dkr.ecr.us-east-1.amazonaws.com/${REPOSITORY_NAME}
echo "Logging in AWS ECR."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 530678340229.dkr.ecr.us-east-1.amazonaws.com
echo "Pushing to AWS ECR"
docker push 530678340229.dkr.ecr.us-east-1.amazonaws.com/${REPOSITORY_NAME}:latest
exit $?
