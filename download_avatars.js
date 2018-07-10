// Coded with @matthew-kelly and @comberj
require('dotenv').config()
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var args = process.argv;

console.log('Welcome to the GitHub Avatar Downloader!');

//Main function, gets arguments from Command Line and callback function. Submits GET request into main API.
function getRepoContributors(repoOwner, repoName, cb) {
  if (!repoOwner || !repoName) {
    console.log("Incorrect number of arguments.");
    return;
  }
  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': process.env.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    if (res.statusCode === 404) {
      console.log('Owner/Repo invalid.')
      return;
    }
    cb(err, body);
  });
}

//Calling function with downloadImage function as callback.
getRepoContributors(args[2], args[3], function(err, result) {
  var repos = JSON.parse(result);
  if (!fs.existsSync('./avatars/')) {
    mkdirp('./avatars/');
  }
  repos.forEach(function(repo) {
    var login = './avatars/' + repo.login + '.jpg';
    var url = repo.avatar_url;
    downloadImageByURL(url, login);
  });
});

//Function to download image. Takes login and avatar URL as parameters and adds into new file.
function downloadImageByURL(url, filePath) {
  //Adds the directory if it doesnt exist.
  request.get(url)
    .on('error', function(err) {
      return err;
    })
    .on('response', function(response) {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        console.log('Error ' + response.statusCode + ' found.');
        return Error();
      }
    })
    .on('end', function() {
      console.log('Download complete.');
    })
    .pipe(fs.createWriteStream(filePath));
}