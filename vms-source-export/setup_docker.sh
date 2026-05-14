#!/bin/bash
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker Desktop or Docker Engine."
    exit 1
fi
echo "Docker found. Building container..."
docker-compose build
echo "Build complete. Run 'docker-compose up' to start the development environment."
