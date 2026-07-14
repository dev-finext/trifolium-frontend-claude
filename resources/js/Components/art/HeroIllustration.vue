<script setup>
// HERO — Herb photograph: composed scene with mortar, leaves, bottle.
// Subject-relevant illustration placeholder for the home hero image slot,
// composed from simple shapes (ellipses, rectangles, paths) only.
import Sprig from './Sprig.vue';
import { PALETTES } from './art-data.js';

const p = PALETTES.earth;
</script>

<template>
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" style="width: 100%; height: 100%; display: block">
        <defs>
            <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" :stop-color="p.light" />
                <stop offset="60%" :stop-color="p.bg1" />
                <stop offset="100%" :stop-color="p.bg2" />
            </linearGradient>
            <radialGradient id="hero-glow" cx="0.35" cy="0.3" r="0.6">
                <stop offset="0%" stop-color="#fff8e8" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#fff8e8" stop-opacity="0" />
            </radialGradient>
            <pattern id="hero-grain" width="3" height="3" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="rgba(0,0,0,0.012)" />
                <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.04)" />
            </pattern>
        </defs>

        <rect width="600" height="600" fill="url(#hero-bg)" />
        <rect width="600" height="600" fill="url(#hero-glow)" />

        <!-- Backdrop herb sprigs (faint, depth) -->
        <g opacity="0.32" transform="translate(420,80) rotate(-18)">
            <Sprig :color="p.ink" />
        </g>
        <g opacity="0.25" transform="translate(60,420) rotate(35)">
            <Sprig :color="p.ink" :scale="0.85" />
        </g>

        <!-- Apothecary bottle (back) -->
        <g transform="translate(380,180)">
            <rect x="-32" y="0" width="64" height="14" rx="3" :fill="p.ink" opacity="0.85" />
            <path
                d="M -28 14 L -36 36 L -36 230 Q -36 250 -16 250 L 16 250 Q 36 250 36 230 L 36 36 L 28 14 Z"
                :fill="p.ink" opacity="0.78"
            />
            <!-- label -->
            <rect x="-26" y="120" width="52" height="60" :fill="p.light" opacity="0.94" />
            <rect x="-20" y="132" width="40" height="2" :fill="p.ink" opacity="0.5" />
            <rect x="-20" y="140" width="32" height="2" :fill="p.ink" opacity="0.35" />
            <rect x="-20" y="148" width="36" height="2" :fill="p.ink" opacity="0.35" />
            <rect x="-20" y="164" width="20" height="6" :fill="p.accent" opacity="0.65" />
        </g>

        <!-- Mortar (foreground) -->
        <g transform="translate(220,360)">
            <ellipse cx="0" cy="60" rx="140" ry="22" fill="rgba(0,0,0,0.12)" />
            <path d="M -120 -30 Q -130 50 -80 70 L 80 70 Q 130 50 120 -30 Z" :fill="p.ink" opacity="0.88" />
            <ellipse cx="0" cy="-30" rx="120" ry="22" :fill="p.bg2" opacity="0.95" />
            <ellipse cx="0" cy="-30" rx="100" ry="14" :fill="p.ink" opacity="0.55" />
            <!-- contents — dried herbs -->
            <g transform="translate(0,-30)">
                <ellipse cx="-50" cy="-2" rx="14" ry="4" :fill="p.accent" opacity="0.7" transform="rotate(-20 -50 -2)" />
                <ellipse cx="-20" cy="-6" rx="16" ry="4" :fill="p.accent" opacity="0.6" transform="rotate(8 -20 -6)" />
                <ellipse cx="20" cy="-4" rx="14" ry="4" :fill="p.accent" opacity="0.75" transform="rotate(-12 20 -4)" />
                <ellipse cx="50" cy="-2" rx="16" ry="4" :fill="p.accent" opacity="0.65" transform="rotate(18 50 -2)" />
                <ellipse cx="0" cy="-10" rx="18" ry="5" :fill="p.accent" opacity="0.7" />
            </g>
            <!-- pestle -->
            <g transform="translate(60,-110) rotate(22)">
                <rect x="-8" y="0" width="16" height="120" rx="6" :fill="p.ink" opacity="0.85" />
                <ellipse cx="0" cy="120" rx="14" ry="8" :fill="p.ink" opacity="0.9" />
            </g>
        </g>

        <!-- Foreground leaf sprig -->
        <g transform="translate(110,260) rotate(-22)">
            <Sprig :color="p.accent" :scale="1.1" />
        </g>

        <!-- subtle texture -->
        <rect width="600" height="600" fill="url(#hero-grain)" />
        <rect width="600" height="600" fill="rgba(255,255,255,0.04)" style="mix-blend-mode: overlay" />
    </svg>
</template>
