var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');
var args = process.argv;

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (args.length !== 4){
    throw Error;
  }
    var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': token.GITHUB_TOKEN
        }

    };


    request(options, function(err, res, body) {
        cb(err, body);
    });
}

getRepoContributors(args[2], args[3], function(err, result) {
    var repos = JSON.parse(result);
    repos.forEach(function(repo){
    var login = repo.login;
    var url = repo.avatar_url;
    downloadImageByURL(url, login);
  });
});

function downloadImageByURL(url, filePath) {

    request.get(url) // Note 1
        .on('error', function(err) { // Note 2
            throw err;
        })
        .on('response', function(response) {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                console.log("Error " + response.statusCode + " found.");
                throw Error();
            }
        })
        .on('end', function() {
            console.log('Download complete.');
        })
        .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpg'));

}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./kvirani.jpg");