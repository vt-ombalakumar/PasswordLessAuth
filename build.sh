#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
pip install -r backend/requirements.txt
