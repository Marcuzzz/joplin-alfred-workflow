const request = require('request');
const { exec } = require('child_process');
require('dotenv').config();

const API_TOKEN = process.env.joplin_key;
const API_BASE_URL = process.env.joplin_url;

function searchNotes() {
  return new Promise((resolve, reject) => {
    const options = {
      url: `${API_BASE_URL}/search?token=${API_TOKEN}&limit=10&query=${process.argv[2]}`,
      json: true,
      headers: {
        'User-Agent': 'Chrome', // Set the custom User-Agent header here
      },
    };

    request.get(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${response.statusCode}`));
      } else {
        resolve(body.items);
      }
    });
  });
}

searchNotes()
  .then((notes) => {
    
    console.log(JSON.stringify({ "items" : notes.map((note) => ({
      title: note.title,
      subtitle: `Open note ...`,
      valid: true,
      arg: `[${note.title}](joplin://x-callback-url/openNote?id=${note.id})`, // Pass the note ID as an argument for Alfred to use later
      icon: {path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionIcon.icns"}
    }))}));

  })
  .catch((err) => {
    console.error('Error:', err.message);
  });