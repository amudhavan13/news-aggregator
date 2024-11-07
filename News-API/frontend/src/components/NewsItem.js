import React from 'react';
import './NewsItem.css';

function NewsItem({ article }) {
    return (
        <div className={`news-item ${article.isFake ? 'fake' : 'real'}`}>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
            {article.isFake ? (
                <span className="fake-alert">Fake News</span>
            ) : (
                <span className="real-check">✔️</span>
            )}
        </div>
    );
}

export default NewsItem;
