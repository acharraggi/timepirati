Icons
---
The icon.psd file was created in Photoshop, and copy saved as icon.png.
Icon.png was converted to .ICO format by [https://realfavicongenerator.net](https://realfavicongenerator.net).

The resulting favicons.zip file was unpacked into the client/favicons folder and the Meta tags suggested by Real Favicon Generator were added to index.html.
The common webpack had file-loader added, and index.js updated to include all the items in the favicons folder into the dist folder.
Then the prod webpack config was updated to copy those to the root of the S3 bucket.

