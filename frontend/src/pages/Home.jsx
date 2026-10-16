import React from 'react';
import WelcomeIntro from '../components/WelcomeIntro';
import Hero from '../components/Hero';
import Metrics from '../components/Metrics';

export default function Home() {
  return (
    <>
      {/* Auto-Dismissing Cinematic Welcome Intro */}
      <WelcomeIntro />

      {/* Hero Section */}
      <Hero />

      {/* Metrics & Antigravity Stats Grid */}
      <Metrics />
    </>
  );
}
