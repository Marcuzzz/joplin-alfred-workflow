const request = require('request');
const { exec } = require('child_process');

const API_TOKEN = 'd22ec028b8493db1f2b5afbd8747d750f0d75f3107b5d67ee09253f8290f48a3e4717422cba30e361302fee8cf5181179cfa757f112e1050a4c733f6ce01544c';

const API_BASE_URL = 'http://127.0.0.1:41184'; // Change this if your Joplin Web Clipper has a different port or domain.



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

// Example usage:
searchNotes()
  .then((notes) => {
    
    // notes.forEach((note) => {
    //   console.log(note.title);
    // });

    console.log(JSON.stringify({ "items" : notes.map((note) => ({
      title: note.title,
      subtitle: `Paste this into a note and click on the link to open...`, // Assuming you want to show the note ID as the subtitle
      valid: true,
      arg: `[${note.title}](joplin://x-callback-url/openNote?id=${note.id})`, // Pass the note ID as an argument for Alfred to use later
      icon: {path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionIcon.icns"}
      // Add any other properties you want for each item, e.g., icons, etc.
    }))}));

  })
  .catch((err) => {
    console.error('Error:', err.message);
  });


// exec(`open "joplin://x-callback-url/openNote?id=0abb557b91a839063a2b52bda352a193"`, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error opening Joplin note: ${error.message}`);
//     return;
//   }

//   // Output the result of the command if needed
//   console.log(stdout);

//   // If there's any error output, log it as well
//   if (stderr) {
//     console.error(stderr);
//   }
// });