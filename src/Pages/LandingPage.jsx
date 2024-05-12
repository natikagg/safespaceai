import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppAppBar from '../Components/AppAppBar';
import Hero from '../Components/Hero';
import Demo from '../Components/Demo';
import './LandingPage.css';
import PricingSection from '../Components/PricingSection';

const LandingPage = () =>{
  return (
    <div className='landingContainer'>
        <AppAppBar />
        <Hero/>
        <Demo />
    </div>
  );
}
export default LandingPage;