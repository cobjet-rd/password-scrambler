# Password Scrambler - A simple ionic-based app [![Build Status](https://travis-ci.org/mohlendo/password-scrambler.svg?branch=master)](https://travis-ci.org/mohlendo/password-scrambler)

## What's in it

1. [Cordova](http://cordova.apache.org/) for packaging the app and accessing native features (Clipboard copy)
*  [gulp.js](http://gulpjs.com/) for building the app
*  [SASS](http://sass-lang.com/) for writing nicer css
*  [Ionic](http://ionicframework.com/) for the _awesomeness_!

## How to setup

    npm install -g cordova
    npm install -g ios-sim
    npm install -g gulp
    npm install
    cordova platform add ios

## How to build

    gulp build

## How to start with iOS

    gulp build
    cordova build
    cordova emulate ios

## How to start with Android (more complicated to setup)

Before staring, make sure that you have a Android Image ready.

    cordova platform add android
    cordova build
    cordova emulate android

## How to develop

Start the gulp watcher, that will update your app.css and check for lint errors

    gulp watch
