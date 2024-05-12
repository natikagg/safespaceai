import React from 'react';
import './Demo.css'; // Make sure to import the CSS file

const youTubeEmbedUrl = "https://www.youtube.com/embed/Opwzt8zzXlU";


const Demo: React.FC = () => {
    return (
        <div>
            <h1 className='demoHeading'>Watch it in action!</h1>
            <div className="video-container">
            <iframe
                width="760"
                height="450"
                src={youTubeEmbedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            </div>
        </div>
    );
};

export default Demo;
