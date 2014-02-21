#!/usr/bin/env node
var path = require("path"),
    fs = require("fs"),
    rootdir = process.argv[ 2 ],
    iconroot = rootdir + "/assets/icon/android",
    screenroot = rootdir + "/assets/screen/android",
    androidroot = rootdir + "/platforms/android";

var exec = require('child_process').exec,
    child;

try {
    fs.lstatSync(androidroot).isDirectory();
}
catch (e) {
    console.log("android platform does not exist. nothing to do here.");
    process.exit(0);
}

var projectname = "Scrambler";

var errorHandler = function (error, stdout, stderr) {
    if (error !== null) {
        console.log('exec error: ' + error);
    }
};

exec("cp -Rf " + iconroot + "/* " + androidroot + "/res", errorHandler);
exec("cp -Rf " + screenroot + "/* " + androidroot + "/res", errorHandler);

console.log("Copied all android assets.");

process.exit(0);