const ytdl = require('youtube-dl');

//var url = 'https://www.youtube.com/watch?v=H7HmzwI67ec';
var url = 'https://www.youtube.com/playlist?list=PLEFA9E9D96CB7F807';

ytdl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function exec(err, output) {
  'use strict';
  if (err) { throw err; }
  console.log(output.join('\n'));
  //console.log(output);
});
