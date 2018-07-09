var request = require('request');
var token = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN;
    }
  };

  request(url, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

// request.get('https://sytantris.github.io/http-examples/future.jpg')               // Note 1
//        .on('error', function (err) {                                   // Note 2
//          throw err;
//        })
//        .on('response', function (response) {
//         if (response.statusCode < 200 || response.statusCode >= 300){
//           console.log("Error " + response.statusCode + " found.");
//           throw Error();
//         }
//          console.log('Response Status Code: ', response.statusCode);
//          console.log('Response message: ' + response.statusMessage);
//          console.log('Content type: ' + response.headers['content-type']);
//        })
//        .on('end', function(){
//         console.log('Download complete.');
//        })