const EventEmitter = require('events');
const emitter = new EventEmitter();

const files = fs.readdir('./', function(err, files){
  if (err) console.log('Error', err);
  else console.log('Result', files)
}); 