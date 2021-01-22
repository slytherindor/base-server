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
