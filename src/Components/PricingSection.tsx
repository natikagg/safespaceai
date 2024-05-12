import React from 'react';
import PricingCard from './PricingCard';
import PricingText from './PricingText';
import './PricingSection.css';

const PricingSection: React.FC = () => {
    return (
        <div className='pricing'>
            <div className='pricingRight'>
                <PricingCard />
            </div>
            <div className='pricingLeft' >
            <PricingText/>
            </div>
        </div>
    );
};

export default PricingSection;