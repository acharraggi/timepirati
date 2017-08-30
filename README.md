TimePirati
===
This is a little side project to build a time tracker.

The backend will be Amazon AWS serverless services like Lambda and DynamoDB.
The client will make use of CSS Modules with React and webpack.

Status: timer works and continues even if laptop sleeps or hibernates.
Stores timer, project/task info to localStorage so it survives page refreshes/reloads.

Converted to single page app with React Router Dom.
Uses ES6 javascript with [Standard Style](https://standardjs.com/) formatting.

Unit tests in Jest and Enzyme.

TO DO:
* Add Log Hours button to Timer window (just alerts what to log so far)
* host pages in S3
* start adding Lambda functions to save/get data to database