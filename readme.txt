// path
var path = require('path');
// fs
var fs   = require('fs');
// youtube dl
var ytdl = require('youtube-dl');

// playlist func
function playlist(url) {
  // stric
  'use strict';

  // get a single video
  var video = ytdl(url);

  // error, so.....
  video.on('error', function error(err) {
    console.log('error 2:', err);
  });

  // size == 0
  var size = 0;
  video.on('info', function(info) {
    // we have size
    size = info.size;
    // output is ./size.mp4
    var output = path.join(__dirname + '/', size + '.mp4');
    // video pipes it
    // fs writes output
    video.pipe(fs.createWriteStream(output));
  });

  // position of data
  var pos = 0;
  // video on data
  video.on('data', function data(chunk) {
    // chunk + chunk data
    pos += chunk.length;
    // `size` should not be 0 here.
    // if there is data
    if (size) {
      // progress percent
      var percent = (pos / size * 100).toFixed(2);
      // cursor to
      process.stdout.cursorTo(0);
      // clear line
      process.stdout.clearLine(1);
      // write
      process.stdout.write(percent + '%');
    }
  });

  // video on next
  video.on('next', playlist);

}

playlist('https://www.youtube.com/playlist?list=PLEFA9E9D96CB7F807');
