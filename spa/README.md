## Getting started in local environment
1. Go to the SPA folder:

  `cd spa`
1. Download all the NPM packages:

 `npm install`

1. Run the frontend build:

  `npm run local`


## Building in DEV/UAT/Production
The following is used in Teamcity for building a minified, un-sourcemapped output.

1. `npm install` .

1. In UAT, and Production, run `npm run pro`

  This runs the code through uglify, and get's rid of comments, sourcemaps, and applies dead-code removal. It also doesn't watch for updates, and doesn't use BrowserSync.

  In UAT and Production, it runs the build once that outputs unminified version, and a second time that runs it with minification via UglifyJS. Normal requests retrieve the minified version, while a developer could retrieve the unminified version (by adding the querystring '?buildmode=original') to troubleshoot an UAT/Production issue.


Use color scheme based on https://dribbble.com/shots/2119206-Hixle-Feed/attachments/384630


