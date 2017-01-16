require('dotenv').config()
const request      = require("request");
const fs           = require("fs");
const GITHUB_USER  = process.env.GITHUB_USER;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const owner        = process.argv[2];
const name         = process.argv[3]

const downloadImageByURL = (url, filePath) => {
  request.get(url)
     .on("error", (err) => {
       throw err;
     })
     .on("response", (res) => {
       console.log(`Response Status Code: ${res.statusCode}\n
         Status Message${res.statusMessage}\n
         Content Type: ${res.headers["content-type"]}`);
     })
     .pipe(fs.createWriteStream(`./avatars/${filePath}.jpg`));
};

const getAvatarURL = (err, result) => {
  if (err) {
    console.log("Errors:", err);
  } else {
    result.forEach((data) => {
      downloadImageByURL(data.avatar_url, data.login)
    })
  }
};

const getRepoContributors = (repoOwner, repoName, cb) => {

  if (!repoOwner || !repoName) {
    return console.log("No repo name/owner specified!!!");
  }
  if (repoOwner == "" || repoName == "") {
    return console.log("No repo name/owner specified!!!");
  }

  const options = {
    url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, (err, res, body) => {
    let jsonData = JSON.parse(body);
    getAvatarURL(err, jsonData)
  });
};

getRepoContributors(owner, name, getAvatarURL);
