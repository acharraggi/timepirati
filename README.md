TimePirati
===
This is a little side project to build a time tracker.

The backend will be Amazon AWS serverless services like Lambda and DynamoDB.
The client will make use of CSS Modules with React and webpack.

Status: timer works and continues even if laptop sleeps or hibernates.
But doesn't survive a browser window refresh (since it's not saving state anywhere else yet)

TO DO:
1. remove lap stuff from timer
2. move timer to own page that opens in a new window, add Start Timer button to app page.
3. save timer state in case browser closed.
4. Add Client/Project/Task stuff
5. Add Log Hours button to Timer window