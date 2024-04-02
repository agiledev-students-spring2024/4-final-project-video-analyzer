import React, { useState, useEffect, useRef }from 'react';
import Header from '../Header/Header'; // Import the Header component
import './RecordPage.css';

const RecordPage = () => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const [isAudioRecording, setIsAudioRecording] = useState(false);
    const [mediaStream, setMediaStream] = useState(null); 
    const [mediaBlob, setMediaBlob] = useState(null);

    useEffect(() => {
        if (isVideoRecording && videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }
    }, [mediaStream, isVideoRecording]);

    const stopRecording = (mediaType) => {
        console.log(`Stopping ${mediaType} recording...`);
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop(); // Stops the recording
                console.log('Media recording stopped');
                if (mediaType === 'video' && videoRef.current && videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks();
                    console.log(`Stopping ${tracks.length} track(s)`);
                    tracks.forEach(track => track.stop()); // Stops the stream
                }
            }
            setIsVideoRecording(false);
            setIsAudioRecording(false);
            setMediaStream(null);
        };

    const startRecording = (mediaType) => {
        console.log(`Starting ${mediaType} recording...`);
        navigator.mediaDevices.getUserMedia({ audio: mediaType === 'audio', video: mediaType === 'video' })
            .then(stream => {
                console.log(`${mediaType} stream obtained`);
                setMediaStream(stream);
                if (mediaType === 'video') {
                    console.log(videoRef.current);
                    if (videoRef.current) {
                        videoRef.current.play();
                        console.log('VideoRef srcObject set');
                    } 
                }
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = event => {
                    setMediaBlob(event.data);
                };
                mediaRecorderRef.current.start();
                console.log('MediaRecorder started');
                if (mediaType === 'video') setIsVideoRecording(true);
                if (mediaType === 'audio') setIsAudioRecording(true);
            })
            .catch(error => {
                console.error(`Error accessing ${mediaType} devices:`, error);
            });
        };

    // Handles both starting and stopping of media recording
    const handleRecording = (mediaType) => {
        console.log(`handleRecording called with mediaType: ${mediaType}`);
        if ((mediaType === 'video' && isVideoRecording) || (mediaType === 'audio' && isAudioRecording)) {
            stopRecording(mediaType);
        } else {
            startRecording(mediaType);
        }
    };

    // Example of sending mediaBlob to backend (ensure backend endpoint is set up to handle uploads)
    const [conversionResult, setConversionResult] = useState(null);
    const [transcriptionResult, setTranscriptionResult] = useState('');

    useEffect(() => {
        if (mediaBlob) {
            const media = new File([mediaBlob], "recording", { type: mediaBlob.type });
            console.log('File recorded:', media);

            const formData = new FormData();
            formData.append('media', media);
            // if the media is a video, set targetFormat to 'mp4'
            if (mediaBlob.type.includes('video')) formData.append('targetFormat', 'mp4');
            // if the media is an audio, set targetFormat to 'mp3'
            if (mediaBlob.type.includes('audio')) formData.append('targetFormat', 'mp3');

            fetch('/convert', {
                method: 'POST', 
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Conversion success:', data);
                // Assuming `data` contains the path to the converted file
                setConversionResult(data.filePath);
            })
            .catch(error => {
                console.error('Conversion error:', error);
                setTranscriptionResult('Error during file conversion.');
            });
        }
    }, [mediaBlob]);

    useEffect(() => {
        if (conversionResult) {
            // const file = new File([mediaBlob], "filename", { type: mediaBlob.type });
            // console.log('File recorded:', file);
            // if (!file) return;

            // const formData = new FormData();
            // formData.append('file', mediaBlob);
            // fetch('/transcribe', {
            //     method: 'POST', 
            //     body: formData
            // })
            fetch(`/transcribe?file=${conversionResult}`)
            .then(response => {
                console.log(response);
                response.json();
            })
            .then(data => {
                console.log('Upload success:', data);
                setTranscriptionResult(data.text || 'No transcription text received.');
            })
            .catch(error => {
                console.error('Upload error:', error);
                setTranscriptionResult('Error during transcription.');
            });

            
        }
    }, [conversionResult]);

    
    return (
        <div className="record-page">
            <Header /> {/* Use the Header component */}
            <main className="record-main">
                {isVideoRecording && <video ref={videoRef} className="media-display" autoPlay muted></video>}
                {!isVideoRecording && <div className="media-placeholder"></div>}
                <button className="video-record-btn" onClick={() => handleRecording('video')}>
                    {isVideoRecording ? 'Stop' : 'Video Record'}
                </button>
                <div className="or-divider">OR</div>
                <button className="audio-record-btn" onClick={() => handleRecording('audio')}>
                    {isAudioRecording ? 'Stop' : 'Audio Record'}
                </button>
                <div className="transcription-result">
                    <h2>Transcription Result:</h2>
                    <pre>{transcriptionResult}</pre>
                </div>
            </main>
        </div>
    );
};

export default RecordPage;