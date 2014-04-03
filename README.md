# Password Scrambler - A simple ionic-based app [![Build Status](https://travis-ci.org/mohlendo/password-scrambler.svg?branch=master)](https://travis-ci.org/mohlendo/password-scrambler)

## How to setup

    gem install sass
    npm install -g cordova
    npm install -g ios-sim
    npm install

## How to build

    gulp build

## How to start with iOS

    mkdir platforms
    cordova platform add ios
    cordova build
    cordova emulate ios

## How to start with Android (more complicated to setup)

Before staring, make sure that you have a Android Image ready.

    cordova platform add android
    cordova build
    cordova emulate android

## How to update app.scss

Start the SASS watcher, that will update your app.css

    sass --watch www/scss/app.scss:www/css/app.css
