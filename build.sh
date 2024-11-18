#!/bin/bash

# Add node_modules/.bin to PATH
export PATH="./node_modules/.bin:$PATH"

# Install dependencies
npm install --legacy-peer-deps

# Run build
./node_modules/.bin/vite build
