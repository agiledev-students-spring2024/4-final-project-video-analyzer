const express = require('express');
const multer = require('multer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const app = express();

require('dotenv').config();
const bcrypt = require('bcrypt');


const API_TOKEN = 'd8019923168b47c899e0a274d7d856e5';
const upload = multer({ dest: 'uploads/' });  

// Function to upload a file to the AssemblyAI API
function upload_file(api_token, filePath) {
    const data = fs.readFileSync(filePath);
    const url = 'https://api.assemblyai.com/v2/upload';

    return axios.post(url, data, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': api_token,
        },
    }).then(response => {
        if (response.status === 200) {
            return response.data['upload_url'];
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return null;
        }
    }).catch(error => {
        console.error(`Error: ${error}`);
        return null;
    });
}

// Function to transcribe audio using the AssemblyAI API
function transcribeAudio(api_token, audio_url) {
    const headers = {
        'Authorization': api_token,
        'Content-Type': 'application/json',
    };

    return axios.post('https://api.assemblyai.com/v2/transcript', { audio_url }, { headers })
        .then(response => {
            const transcriptId = response.data.id;
            const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

            const pollTranscription = () => {
                return axios.get(pollingEndpoint, { headers })
                    .then(pollingResponse => {
                        const transcriptionResult = pollingResponse.data;

                        if (transcriptionResult.status === 'completed') {
                            return transcriptionResult;
                        } else if (transcriptionResult.status === 'error') {
                            throw new Error(`Transcription failed: ${transcriptionResult.error}`);
                        } else {
                            return new Promise(resolve => setTimeout(resolve, 3000))
                                .then(pollTranscription);
                        }
                    });
            };

            return pollTranscription();
        });
}

// Endpoint to handle file uploads and transcription
app.post('/transcribe', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    upload_file(API_TOKEN, filePath)
        .then(uploadUrl => {
            if (!uploadUrl) {
                throw new Error('Upload failed');
            }

            return transcribeAudio(API_TOKEN, uploadUrl);
        })
        .then(transcript => {
            res.json(transcript);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('An error occurred during the transcription process.');
        })
        .finally(() => {
            // Cleanup: delete the uploaded file from local storage after processing
            fs.unlink(filePath, err => {
                if (err) console.error(`Error deleting file ${filePath}:`, err);
            });
        });
});


// Placeholder for users data
const users = [];

// POST /register
app.post('/register', express.json(), (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // Check if the user already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).send('User already exists');
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Store user
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  res.status(201).send('User created');
});

// POST /login
app.post('/login', express.json(), (req, res) => {
    const { username, password } = req.body;
  
    // Validation
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
  
    // Find user
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(401).send('User does not exist');
    }
  
    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }
  
    res.send('User logged in');
  });

  // POST /change-password
app.post('/change-password', express.json(), (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    // validation
    if (!username || !oldPassword || !newPassword) {
        return res.status(400).send('Username, old password, and new password are required');
    }

    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return res.status(401).send('User does not exist');
    }

    const user = users[userIndex];
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).send('Old password is incorrect');
    }

    // new password
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    // Update password
    users[userIndex].password = hashedNewPassword;

    res.send('Password updated successfully');
});

app.post('/convert', upload.single('media'), (req, res) => {
    const tempPath = req.file.path;
    const targetFormat = req.body.targetFormat; // The desired target format (e.g., 'mp3', 'mp4')

    // Determine the target file extension and MIME type
    let extension, mimeType;
    switch (targetFormat) {
        case 'mp3':
            extension = '.mp3';
            mimeType = 'audio/mpeg';
            break;
        case 'mp4': 
            extension = '.mp4';
            mimeType = 'video/mp4';
            break;
        // Add more cases for other target formats as needed
        default:
            return res.status(400).send('Unsupported target format');
    }

    const targetPath = `${tempPath}${extension}`;

    // Perform the conversion
    ffmpeg(tempPath)
        .toFormat(targetFormat)
        .on('end', () => {
            // Send the converted file to the client or save it as needed
            res.type(mimeType).download(targetPath, `converted${extension}`, () => {
                // Optionally, delete the temporary files after sending
                fs.unlink(tempPath, err => {
                    if (err) console.error(`Error deleting original file: ${err}`);
                });
                fs.unlink(targetPath, err => {
                    if (err) console.error(`Error deleting converted file: ${err}`);
                });
            });
        })
        .on('error', (err) => {
            console.error('Error:', err.message);
            res.status(500).send(`Conversion error: ${err.message}`);
        })
        .save(targetPath);
});


module.exports = app;