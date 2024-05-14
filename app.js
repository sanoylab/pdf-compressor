// app.js
/*
To compress PDF files in Node.js, we can use the Ghostscript command-line tool. Ghostscript is a powerful tool for processing PDF files and can be used to compress PDF files by reducing the resolution and quality of the images in the file.
You may install Ghostscript on your system by visiting the official website and downloading the installer for your operating system.
- brew install ghostscript
- export PATH="/usr/local/bin:$PATH"
- source ~/.bashrc  OR  source ~/.bash_profile
*/


const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Create the compressed directory if it doesn't exist
if (!fs.existsSync('compressed')) {
    fs.mkdirSync('compressed');
}

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
  const inputFilePath = req.file.path;
  const outputFilePath = path.join('compressed', req.file.filename + '.pdf');

  /*
  The Ghostscript command to compress a PDF file is as follows:
- `/screen`: low resolution, lowest output size
- `/ebook`: medium resolution, medium output size
- `/printer`: high resolution, high output size
- `/prepress`: high resolution, high output size, preserves color information
 */

  const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${inputFilePath}`;
  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.log(`Error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }

      // Send the compressed file to the client
      // Send the compressed file to the client
res.download(outputFilePath, (err) => {
    if (err) {
        if (err.code === 'ECONNABORTED') {
            console.log('Download was cancelled');
        } else {
            throw err;
        }
    }

    // Delete the files after sending to the client
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(outputFilePath);
});
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));