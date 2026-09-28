#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Building Main Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Building Education Mock..."
cd mock-education-frontend
npm install
npx vite build --base=/education/
cd ..

echo "Building Employment Mock..."
cd mock-employment-frontend
npm install
npx vite build --base=/employment/
cd ..

echo "Merging builds into a single 'dist' directory..."
# Create a root dist folder
mkdir -p dist

# Copy main frontend files to the root of dist
cp -a frontend/dist/* dist/

# Copy mock education files into dist/education/
mkdir -p dist/education
cp -a mock-education-frontend/dist/* dist/education/

# Copy mock employment files into dist/employment/
mkdir -p dist/employment
cp -a mock-employment-frontend/dist/* dist/employment/

echo "Build complete! You can now deploy the 'dist' folder."
