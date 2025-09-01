#!/bin/sh

# If a command fails then the deploy stops
set -e

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Clean previous build
rm -rf dist/*

# Build the project with Astro
npm run build

# Go to dist folder (Astro's output directory)
cd dist

# Initialize git if not already done
if [ ! -d .git ]; then
    git init
    git remote add origin https://github.com/rjgsousa/rjgsousa.github.io.git
fi

# Add CNAME for custom domain
echo "rsousa.co" > CNAME

# Add changes to git
git add .

# Commit changes
msg="rebuilding site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi
git commit -m "$msg"

# Push to master branch (GitHub Pages)
git push -f origin HEAD:master
