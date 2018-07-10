require('dotenv').config()
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var args = process.argv;

console.log('Welcome to the GitHub Avatar Downloader!');

//Main function, gets arguments from Command Line and callback function. Submits GET request into main API.
function getRepoContributors(repoOwner, repoName, cb) {
    if (args.length !== 4) {
        throw Error;
    }
    var options = {
        url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
        headers: {
            'User-Agent': 'request',
            'Authorization': process.env.GITHUB_TOKEN
        }
    };
    request(options, function(err, res, body) {
        cb(err, body);
    });
}
//Calling function with downloadImage function as callback.
getRepoContributors(args[2], args[3], function(err, result) {
    var repos = JSON.parse(result);
    repos.forEach(function(repo) {
        var login = repo.login;
        var url = repo.avatar_url;
        downloadImageByURL(url, login);
    });
});

//Function to download image. Takes login and avatar URL as parameters and adds into new file.
function downloadImageByURL(url, filePath) {
//Adds the directory if it doesnt exist.
  if (!fs.existsSync('./avatars/')){
    mkdirp('./avatars/');
  }

    request.get(url)
        .on('error', function(err) {
            throw err;
        })
        .on('response', function(response) {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                console.log('Error ' + response.statusCode + ' found.');
                throw Error();
            }
        })
        .on('end', function() {
            console.log('Download complete.');
        })
        .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpg'));
}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./kvirani.jpg");


