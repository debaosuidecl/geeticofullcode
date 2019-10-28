const fs = require('fs');
(async () => {
  try {
    fs.unlinkSync('./filetodelete.txt');
    console.log('successfully deletedtxt');
  } catch (error) {
    console.log('something went wrong bro');
  }
})();
