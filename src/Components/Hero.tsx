// src/components/Hero.js
import React from 'react';
import HeroLeft from './HeroLeft'; // Adjust the path as needed
import HeroRight from './HeroRight'; // Adjust the path as needed
import './Hero.css'; // Make sure to import the CSS file

function Hero() {
    return (
        <div className="hero">
            <div className="hero-left">
                <HeroLeft />
            </div>
            <div className="hero-right">
                <HeroRight />
            </div>
        </div>
    );
}

export default Hero;
