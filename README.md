TimePirati
===
This is a little side project to build a time tracker.

The frontend is now live at [TimePirati](http://timepirati.mikesilversides.com.s3-website-us-east-1.amazonaws.com/) hosted at Amazon S3.

The backend will be Amazon AWS serverless services like Lambda and DynamoDB.
The client will make use of CSS Modules with React and webpack.

Status: timer works and continues even if laptop sleeps or hibernates.
Stores timer, project/task info to localStorage so it survives page refreshes/reloads.

Converted to single page app with React Router Dom.
Uses ES6 javascript with [Standard Style](https://standardjs.com/) formatting.

Unit tests in Jest and Enzyme.
