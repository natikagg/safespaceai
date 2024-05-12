import React from 'react';
import './HeroLeft.css'; // Make sure to import the CSS file
import Button from '@mui/material/Button';

function HeroLeft() {
    return (
        <div className="container">
            <h1 className='heroHeading'>Build <span className='unshakable'>Unshakable</span> Confidence At Work</h1>
            <p className='herosub'>Role play <span className='unshakable'>challenging work conversations</span> with an AI Coach,<br />
               Get Tailored Feedback, and Continuously Improve</p>
            <div className="sign-up-bar">
                <input type="text" className='emailPlaceHolder' placeholder="jane@doe.com" />
                <Button
                color="primary"
                variant="outlined"
                size="medium"
                component="a"
                href="/login"
                sx={{ borderRadius: '20px',
                  color: 'black',
                  border: '2px solid black',
                  margin: '4px',
                  fontWeight: 'bold',
                    
                 }}
                target="_blank"
              >
                Try for free
              </Button>
            </div>
            <div className="no-credit">No Credit Card Required</div>
        </div>
    );
}

export default HeroLeft;
