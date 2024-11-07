// frontend/src/components/NewsChecker.js

import React, { useState } from 'react';
import { checkIfFakeNews } from '../services/api';

function NewsChecker() {
    const [newsText, setNewsText] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const predictionData = await checkIfFakeNews(newsText);

        if (predictionData.error) {
            setResult("Error: Could not retrieve prediction");
        } else {
            setResult(`The news is likely ${predictionData.prediction}.`);
        }
    };

    return (
        <div>
            <h1>Fake News Detection</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="Enter news text here..."
                />
                <button type="submit">Check News</button>
            </form>
            {result && <p>{result}</p>}
        </div>
    );
}

export default NewsChecker;
