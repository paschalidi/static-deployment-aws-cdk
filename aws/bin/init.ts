#!/usr/bin/env node
import cdk = require("@aws-cdk/core");
import stack = require("../lib/static-website-stack");

const app = new cdk.App();

new stack.StaticWebsiteStack(app, "cdk-example-react-app", {
  websiteBuildFolder: "../build"
});
