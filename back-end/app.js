const express = require('express');
const multer = require('multer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const API_TOKEN = 'd8019923168b47c899e0a274d7d856e5';
const upload = multer({ dest: 'uploads/' });  


// function to connect mongodb
const transcriptionSchema = new mongoose.Schema({
    audioUrl: String,
    transcript: String,
    status: String
});

const Transcription = mongoose.model('Transcription', transcriptionSchema);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
};

connectDB();

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
                            // Store to MongoDB when transcription is complete
                            const newTranscription = new Transcription({
                                audioUrl: audio_url,
                                transcript: transcriptionResult.text,
                                status: transcriptionResult.status
                            });

                            // Save the new transcription to the database
                            return newTranscription.save()
                                .then(() => transcriptionResult); // Return the transcription result after saving
                        } else if (transcriptionResult.status === 'error') {
                            throw new Error(`Transcription failed: ${transcriptionResult.error}`);
                        } else {
                            // Poll again if the status is not completed or error
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


const User = require('./models/User'); // Adjust path as necessary

app.post('/register', express.json(), async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        const hashedPassword = await User.encryptPassword(password);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        console.log('JWT Secret:', process.env.JWT_SECRET);

        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).send({ message: 'User created', token });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).send('Server error');
    }
});


app.post('/login', express.json(), async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('User does not exist');
        }

        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid password');
        }

        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ message: 'User logged in', token });
    } catch (error) {
        console.error('Server error', error);
        res.status(500).send('Server error during password comparison');
    }
});

app.get('/user-info', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('No authorization header present.');
        return res.status(401).send('Unauthorized - Header missing');
    }

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        console.log('Extracted Token:', token); // Debugging
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log('JWT verification failed:', err);
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send('Unauthorized - Token expired');
                } else {
                    return res.status(401).send('Unauthorized - JWT verification failed');
                }
            }
            res.json({ username: user.username, email: user.email });
        });
    } else {
        console.log('Authorization header format is not Bearer <token>');
        return res.status(401).send('Unauthorized - Bearer token malformed');
    }
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