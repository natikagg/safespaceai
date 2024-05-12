// src/components/HeroRight.js
import React from 'react';
import './HeroRight.css'; // Make sure to import the CSS file

function HeroRight() {
    return (
        <div className="hero-right">
            <div className="profile">
                <img src="/users/christina.jpg" alt="Negotiate Salary" />
                <p>Negotiate Salary</p>
            </div>
            <div className="profile">
                <img src="/users/alex.jpg" alt="Setting Expectations" />
                <p>Setting Expectations</p>
            </div>
            <div className="profile">
                <img src="/users/andrew.jpg" alt="Performance Issues" />
                <p>Performance Issues</p>
            </div>
        </div>
    );
}

export default HeroRight;
