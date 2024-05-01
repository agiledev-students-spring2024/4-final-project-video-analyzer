import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import './RecordPage.css';

const RecordPage = () => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const [isAudioRecording, setIsAudioRecording] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaBlob, setMediaBlob] = useState(null);
    const [conversionResult, setConversionResult] = useState(null);
    const [transcriptionResult, setTranscriptionResult] = useState('');

    useEffect(() => {
        if (isVideoRecording && videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
        }
    }, [mediaStream, isVideoRecording]);

    const handleRecording = (mediaType) => {
        if ((mediaType === 'video' && isVideoRecording) || (mediaType === 'audio' && isAudioRecording)) {
            const tracks = mediaStream.getTracks();
            tracks.forEach(track => track.stop());
            mediaRecorderRef.current.stop();
            setIsVideoRecording(false);
            setIsAudioRecording(false);
            setMediaStream(null);
        } else {
            navigator.mediaDevices.getUserMedia({
                audio: mediaType === 'audio', 
                video: mediaType === 'video'
            }).then(stream => {
                setMediaStream(stream);
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = event => setMediaBlob(event.data);
                mediaRecorderRef.current.start();
                if (mediaType === 'video') setIsVideoRecording(true);
                if (mediaType === 'audio') setIsAudioRecording(true);
            }).catch(error => console.error(`Error accessing ${mediaType} devices:`, error));
        }
    };

    useEffect(() => {
        if (mediaBlob) {
            const fileType = mediaBlob.type || 'application/octet-stream';
            const media = new File([mediaBlob], "recording", { type: fileType });
            const formData = new FormData();
            formData.append('media', media);
            console.log(mediaBlob);  // Check what mediaBlob contains
            if (!(mediaBlob instanceof Blob)) {
                console.error('mediaBlob is not a Blob:', mediaBlob);
            }

            fetch('http://localhost:3000/convert', {
                method: 'POST', 
                body: formData
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ${response.statusText}');
                }
                return response.json();
            }).then(data => {
                console.log('Conversion success:', data);
                setConversionResult(data.url); // Assuming the backend sends back a 'url'
            }).catch(error => {
                console.error('Conversion error:', error);
                setTranscriptionResult('Error during file conversion.');
            });
        }
    }, [mediaBlob]);

    useEffect(() => {
        if (conversionResult) {
            fetch(`/transcribe?file=${conversionResult}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Transcription request failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Transcription success:', data);
                setTranscriptionResult(data.text || 'No transcription text received.');
            })
            .catch(error => {
                console.error('Transcription error:', error);
                setTranscriptionResult('Error during transcription.');
            });
        }
    }, [conversionResult]);

    return (
        <div>
            <Header />
            <div className="record-page">
                <main className="record-main">
                    {isVideoRecording && <video ref={videoRef} className="media-display" autoPlay muted></video>}
                    {!isVideoRecording && <div className="media-placeholder"></div>}
                    <button className="video-record-btn" onClick={() => handleRecording('video')}>
                        {isVideoRecording ? 'Stop' : 'Start Video Recording'}
                    </button>
                    <div className="or-divider">OR</div>
                    <button className="audio-record-btn" onClick={() => handleRecording('audio')}>
                        {isAudioRecording ? 'Stop' : 'Start Audio Recording'}
                    </button>
                    <div className="transcription-result">
                        <h2>Transcription Result:</h2>
                        <pre>{transcriptionResult}</pre>
                    </div>
                    <button className="button" onClick={() => window.history.back()}>
                        Back
                </button>
                </main>
            </div>
        </div>
    );
};

export default RecordPage;
