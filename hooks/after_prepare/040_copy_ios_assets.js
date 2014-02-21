#!/usr/bin/env node
var path = require("path"),
    fs = require("fs"),
    rootdir = process.argv[ 2 ],
    iconroot = rootdir + "/assets/icon/ios",
    screenroot = rootdir + "/assets/screen/ios",
    iosroot = rootdir + "/platforms/ios";

var exec = require('child_process').exec,
    child;

try {
    fs.lstatSync(iosroot).isDirectory();
}
catch (e) {
    console.log("ios platform does not exist. nothing to do here.");
    process.exit(0);
}

// incase there are any spaces in the projectname
var projectname = "Scrambler";

var errorHandler = function (error, stdout, stderr) {
    if (error !== null) {
        console.log('exec error: ' + error);
    }
};

exec("cp -Rf " + iconroot + "/*" + " " + iosroot + "/" + projectname + "/Resources/icons/", errorHandler);
exec("cp -Rf " + screenroot + "/*" + " " + iosroot + "/" + projectname + "/Resources/splash/", errorHandler);

console.log("Copied all ios assets.");

process.exit(0);