import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { jsPDF } from 'jspdf';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

// Set the workerSrc to the pdf.worker.js file from pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${'2.13.216'}/pdf.worker.min.js`;

const MindMapGenerator = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [simplifiedText, setSimplifiedText] = useState('');
    const [importantWords, setImportantWords] = useState([]);
    const [importantPoints, setImportantPoints] = useState([]); // State for important points
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file);
            setSelectedFile(file);
            setMessage('');
        } else {
            setMessage('Please select a valid file.');
        }
    };

    const extractTextFromPDF = async (file) => {
        const pdfData = await file.arrayBuffer();
        const pdfDoc = await getDocument({ data: pdfData }).promise;
        let text = '';

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            text += pageText + '\n';
        }

        return text.trim();
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a file to upload.');
            return;
        }

        try {
            const extractedText = await extractTextFromPDF(selectedFile);
            console.log('Extracted text:', extractedText);

            const dataToSend = {
                content: extractedText,
            };

            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authorization token is missing.');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/upload-pdf-notes', dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Response from server:', response.data);
            setSimplifiedText(response.data.simplified_text);
            setImportantWords(response.data.important_words);
            setImportantPoints(response.data.important_points);
            console.log(response.data.important_points)
            setMessage('PDF uploaded and simplified successfully!');
        } catch (error) {
            console.error('Error uploading the PDF:', error.response ? error.response.data : error.message);
            setMessage('Error uploading the PDF! ' + (error.response ? error.response.data.message : error.message));
        }
    };

    console.log(importantPoints)

    const handleDownloadPDF = () => {
        if (!simplifiedText) {
            setMessage('No simplified text to download.');
            return;
        }
    
        const doc = new jsPDF();
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(simplifiedText, 190);
        let yPosition = 10; 
        const lineHeight = 10;

        lines.forEach((line) => {
            if (yPosition + lineHeight > doc.internal.pageSize.height - 10) {
                doc.addPage();
                yPosition = 10;
            }
            doc.text(line, 10, yPosition);
            yPosition += lineHeight;
        });

        doc.save('simplified_text.pdf');
    };

    const highlightImportantWords = (text, importantWords) => {
        let highlightedText = text;
        importantWords.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>'); 
        });
        return highlightedText;
    };

    return (
        <div className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 min-h-screen p-8 flex flex-col items-center" style={{ fontFamily: 'OpenDyslexic', lineHeight: '1.5' }}>
            <ToastContainer />
            <h1 className="text-4xl font-bold mb-8 text-blue-800 text-center">AI-Powered Notes and MindMap Generator</h1>

            <div className="mb-4 w-full max-w-md">
                <input 
                    type="file" 
                    name='file' 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="block w-full border border-gray-300 rounded-md p-2 mb-4" 
                />
            </div>

            <button
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                onClick={handleUpload}
            >
                Upload and Provide Notes
            </button>

            {message && <p className="mt-4 text-red-600">{message}</p>}

            {simplifiedText && (
                <div className="mt-4 bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
                    <h2 className="text-xl font-bold">Simplified Text:</h2>
                    <p className="mt-2 whitespace-pre-wrap text-gray-700" dangerouslySetInnerHTML={{ __html: highlightImportantWords(simplifiedText, importantWords) }} />
                    
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600 transition duration-300 ease-in-out"
                        onClick={handleDownloadPDF}
                    >
                        Download Notes
                    </button>
                </div>
            )}

            {Array.isArray(importantPoints) && importantPoints.length > 0 && (
                <div className="mt-4 w-full max-w-4xl">
                    <h2 className="text-xl font-bold">Mind Map:</h2>
                    <MindMap importantPoints={importantPoints} />
                </div>
            )}
        </div>
    );
};

const MindMap = ({ importantPoints }) => {
    const elements = createMindMapElements(importantPoints);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <ReactFlow
                elements={elements}
                snapToGrid={true}
                snapGrid={[15, 15]}
                style={{ background: '#f0f0f0' }}
            >
                <MiniMap />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
};

const createMindMapElements = (points) => {
    const elements = [];

    points.forEach((point, index) => {
        const [name, childrenText] = point.split(':');
        const trimmedName = name.trim();
        const children = childrenText ? childrenText.split(',').map(child => child.trim()) : [];

        const nodeId = `${index + 1}`;
        elements.push({
            id: nodeId,
            data: { label: trimmedName }, // Name before the colon
            position: { x: Math.random() * 800, y: Math.random() * 600 },
        });

        // If there are children, create child nodes
        children.forEach((child, childIndex) => {
            const childNodeId = `${nodeId}-${childIndex + 1}`;
            elements.push({
                id: childNodeId,
                data: { label: child }, // Child name
                position: { x: Math.random() * 800, y: Math.random() * 600 },
            });

            // Create an edge for the connection
            elements.push({
                id: `edge-${nodeId}-${childNodeId}`,
                source: nodeId,
                target: childNodeId,
            });
        });
    });

    return elements;
};


export default MindMapGenerator;
