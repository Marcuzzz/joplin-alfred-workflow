#!/bin/bash

# Your GitHub repository owner and name
OWNER="marcuzzz"
REPO=$(git config --get remote.origin.url | sed 's/.*\/\([^/]*\)\.git/\1/')

#Patch version:
if [ "$1" != "pass-patch" ]; then
    # Increment the patch version
    /opt/homebrew/bin/oc
    npm version patch --force
    echo "patched..."
fi

BUNDLEID=$(plutil -extract bundleid raw -o - ./info.plist)
NAME=${BUNDLEID##*.}
VERSION=$(jq -r .version package.json)
plutil -replace version -string $VERSION info.plist
npm run package-mac

EXE=$(jq -r .name package.json)

FILENAME="$NAME.v$VERSION.alfredworkflow"
plutil -replace version -string "$VERSION" info.plist

echo "NAME: $NAME"
echo "NEW VERSION: v$VERSION"

echo "Building release..."
echo
mkdir releases 2> /dev/null
zip "releases/$FILENAME" -r "$EXE" info.plist icon.png assets/*
echo

echo "Released $NAME v$VERSION"
echo " * releases/$FILENAME"

if [ "$1" != "pass-patch" ]; then
    # Create a new release...
    git tag -a "v$VERSION" -m "Released $NAME v$VERSION"
    git push origin "v$VERSION"
    gh release create "v$VERSION" "./releases/$FILENAME" --notes "Released $NAME v$VERSION"
    echo "..."
fi


echo "Opening new release"
open "./releases/$FILENAME"