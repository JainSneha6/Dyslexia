import React, { useState } from 'react';
import axios from 'axios';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

// Set the workerSrc to the pdf.worker.js file from pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${'2.13.216'}/pdf.worker.min.js`;

const DocumentSimplifier = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [simplifiedText, setSimplifiedText] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first file selected
        if (file) {
            console.log('Selected file:', file); // Log the file for debugging
            setSelectedFile(file); // Set the file in the state
            setMessage(''); // Clear any previous messages
        } else {
            setMessage('Please select a valid file.');
        }
    };

    const extractTextFromPDF = async (file) => {
        const pdfData = await file.arrayBuffer(); // Read the PDF file as an ArrayBuffer
        const pdfDoc = await getDocument({ data: pdfData }).promise; // Load the PDF document
        let text = '';

        // Extract text from each page
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            text += pageText + '\n'; // Append the text of each page
        }

        return text.trim(); // Return the extracted text
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a file to upload.');
            return;
        }

        try {
            // Extract text from the PDF
            const extractedText = await extractTextFromPDF(selectedFile);
            console.log('Extracted text:', extractedText); // Log extracted text for debugging

            // Create an object to send to the backend
            const dataToSend = {
                content: extractedText, // The text extracted from the PDF
            };

            // Make sure the access token exists before sending
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authorization token is missing.');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/upload-pdf', dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token in the Authorization header
                },
            });

            console.log('Response from server:', response.data); // Log server response for debugging
            setSimplifiedText(response.data.simplified_text);
            setMessage('PDF uploaded and simplified successfully!');
        } catch (error) {
            console.error('Error uploading the PDF:', error.response ? error.response.data : error.message);
            setMessage('Error uploading the PDF! ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">AI-Powered Document Simplifier</h1>

            <div className="mb-4">
                <input type="file" name='file' accept=".pdf" onChange={handleFileChange} />
            </div>

            <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleUpload}
            >
                Upload and Simplify PDF
            </button>

            {message && <p className="mt-4">{message}</p>}

            {simplifiedText && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Simplified Text:</h2>
                    <p className="mt-2 whitespace-pre-wrap">{simplifiedText}</p>
                </div>
            )}
        </div>
    );
};

export default DocumentSimplifier;
