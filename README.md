TimePirati
===
This is a little side project to build a time tracker.

The backend will be Amazon AWS serverless services like Lambda and DynamoDB.
The client will make use of CSS Modules with React and webpack.

Status: timer works and continues even if laptop sleeps or hibernates.
But doesn't survive a browser window refresh (since it's not saving state anywhere else yet)

Converted to single page app with React Router Dom.
Uses ES6 javascript with [Standard Style](https://standardjs.com/) formatting.

Unit tests in Jest and Enzyme.

TO DO:
* save timer state in case browser closed.
* Add Client/Project/Task stuff
* Add Log Hours button to Timer window