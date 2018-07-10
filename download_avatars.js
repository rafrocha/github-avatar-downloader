var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }

  };

  request(options, function(err, res, body) {
    var repos = JSON.parse(body);
    repos.forEach(function(repo){
      console.log(repo.avatar_url);
    })
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

function downloadImageByURL(url, filePath) {

request.get(url)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .on('response', function (response) {
        if (response.statusCode < 200 || response.statusCode >= 300){
          console.log("Error " + response.statusCode + " found.");
          throw Error();
        }
         console.log('Response Status Code: ', response.statusCode);
         console.log('Response message: ' + response.statusMessage);
         console.log('Content type: ' + response.headers['content-type']);
       })
       .on('end', function(){
        console.log('Download complete.');
       })
       .pipe(fs.createWriteStream(filePath));

}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./kvirani.jpg");




