// stric
'use strict';

// path
const path = require('path');
// fs
const fs = require('fs');
// youtube dl
const ytdl = require('youtube-dl');
// promise
const Promise = require("bluebird");

//
const glob = require('glob');
// child process, exec
const exec = require('child_process').exec;
//
const audioPath = __dirname;
//
let playListUrl = 'https://www.youtube.com/playlist?list=PLEFA9E9D96CB7F807';


// now rename promise
function renamePromise() { return new Promise((resolve, reject) => {
  glob(path.join(audioPath, "/**/*.mp3"), (er, files) => {
      Promise.each(files, (singleClipFile) => {
        return new Promise((resolve1, reject1) => {
          let arr = singleClipFile.split("/");
          let lastElement = arr[arr.length - 1];
          let tmpFileName = lastElement.replace(/[&\/\\#,+()$~%'":*?<>{}\ ]/g, "_");
          let tmpFullFile = path.join(audioPath, '/', tmpFileName);

          // rename it
          fs.rename(singleClipFile, tmpFullFile, function(err) {
            if ( err ) console.log('ERROR: ' + err);

            console.log("-- Rename one file --");
            console.log(tmpFullFile);
            resolve1();
          }); // end rename
        });
      })
      .then(() => {
        console.log('--- rename all files done ---');
        resolve();
      });
    });

  }); // end promise
};


// adb kill
function adbKillPromise() { return new Promise((resolve, reject) => {
  exec("adb kill-server", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stdout);
      console.log('---adb kill---');
      resolve();
    });
  });
};


// adb start
function adbStartPromise() { return new Promise((resolve, reject) => {
    exec("adb start-server", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stdout);
      console.log('---adb start---');
      resolve();
    });
  });
};


// adb push promise
function adbPushPromise() { return new Promise((resolve, reject) => {
  glob(path.join(audioPath, "/**/*.mp3"), (er, files) => {
      Promise.each(files, (singleMusicFile) => {
        return new Promise((resolve1, reject1) => {
          let cmd = "adb push" + " " + singleMusicFile + " " + "/sdcard/Music";
          exec(cmd, (err, stdout, stderr) => {
            console.log(cmd);
            resolve1();
          });
        });
      })
      .then(() => {
        console.log('---- done push all music ---');
        resolve();
      });

    });
  });
};


function dlAudio() {
  return new Promise((resolve, reject) => {
    ytdl.exec(playListUrl, ['-x', '--audio-format', 'mp3'], {}, function exec(err, output) {
      if (err) {
        reject();
        throw err;
      }
      //console.log(output.join('\n'));
      //console.log(output);
      resolve(); // will dl in this dir
    });
  });
}

// run
dlAudio()
  .then(() => {
    return renamePromise();
  })
  .then(() => {
    return adbKillPromise();
  })
  .then(() => {
    return adbStartPromise();
  })
  .then(() => {
    return adbPushPromise();
  })
  .then(() => {
    console.log('--- done ---');
    process.exit(0);
  });
