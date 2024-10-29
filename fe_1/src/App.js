// App.js
import React, { useState } from 'react';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';

const App = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const sendCodeToBackend = async () => {
        const submissionData = {
            lang: "71",
            Qcode: "DOG",
            Code: code
        };

        try {
            const response = await axios.post('http://localhost:5000/user/submit', submissionData);
            const submissionId = response.data.data.submissionId;

            setLoading(true);
            setTimeout(() => fetchSTDOUT(submissionId), 2000);
        } catch (error) {
            console.error('Error sending code:', error);
        }
    };

    const fetchSTDOUT = async (submissionId) => {
        try {
            const response = await axios.get(`http://localhost:5000/stdout/${submissionId}`);
            const result = response.data;
            if (result.length > 0) {
                setOutput(result[0].stdout || 'No output');
                setStatus(result[0].status.description || 'Unknown status');
            } else {
                setOutput('No output available');
                setStatus('No status available');
            }
        } catch (error) {
            console.error('Error fetching output:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'green';
            case 'Wrong Answer':
                return 'red';
            case 'Time Limit Exceeded':
                return 'orange';
            case 'Memory Limit Exceeded':
                return 'purple';
            case 'Compilation Error':
                return 'blue';
            case 'In Queue':
                return 'gray';
            default:
                return 'black';
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Online Code Editor</h2>
            <div style={styles.editorContainer}>
                <MonacoEditor
                    height="60vh"
                    language="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                    }}
                />
            </div>
            <button style={styles.button} onClick={sendCodeToBackend} disabled={loading}>
                {loading ? 'Running...' : 'Run Code'}
            </button>
            <div style={styles.outputContainer}>
                <h3 style={styles.outputTitle}>Output</h3>
                <pre style={styles.output}>{output}</pre>
                <p style={{ ...styles.status, color: getStatusColor(status) }}>{status}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '80%',
        margin: 'auto',
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        color: 'white',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '1rem',
        color: '#ffffff',
    },
    editorContainer: {
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '1rem 0',
    },
    button: {
        padding: '0.7rem 1.5rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        marginTop: '1rem',
    },
    outputContainer: {
        backgroundColor: '#2e2e2e',
        padding: '1rem',
        marginTop: '1rem',
        borderRadius: '8px',
    },
    outputTitle: {
        fontSize: '1.5rem',
        color: '#ffffff',
    },
    output: {
        backgroundColor: '#1e1e1e',
        padding: '1rem',
        borderRadius: '8px',
        color: '#d4d4d4',
        fontSize: '1rem',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
    },
    status: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginTop: '1rem',
    }
};

export default App;
