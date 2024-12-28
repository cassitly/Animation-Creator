const lyrics = document.querySelectorAll('.lyric-line');
const particlesContainer = document.getElementById('particles');
const audioPlayer = document.getElementById('audio-player');

// Function to show lyrics with animation
function showLyrics() {
    let delay = 0;
    lyrics.forEach((line, index) => {
        anime({
            targets: line,
            opacity: 1,
            translateY: 20,
            easing: 'easeOutExpo',
            duration: 1000,
            delay: delay,
            begin: () => {
                line.style.display = 'block';
            }
        });
        delay += 2000; // Adjust delay between lyrics
    });
}

// Create particles effect (floating circles)
function createParticles() {
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        let particle = document.createElement('div');
        particle.classList.add('particle');
        particlesContainer.appendChild(particle);

        // Randomize particle position
        const startPosX = Math.random() * window.innerWidth;
        const startPosY = Math.random() * window.innerHeight;
        const size = Math.random() * 5 + 2; // Random size
        particle.style.left = `${startPosX}px`;
        particle.style.top = `${startPosY}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Animate particles (movement and opacity)
        anime({
            targets: particle,
            translateX: (Math.random() - 0.5) * 300,
            translateY: (Math.random() - 0.5) * 300,
            opacity: [1, 0],
            duration: 4000 + Math.random() * 3000,
            easing: 'easeInOutSine',
            loop: true
        });
    }
}

// Animate glowing text effect
function animateTextGlow() {
    anime({
        targets: '.lyric-line',
        keyframes: [
            { color: '#ff007f', duration: 1000 },  // Pink
            { color: '#00ff7f', duration: 1000 },  // Green
            { color: '#ffff00', duration: 1000 },  // Yellow
            { color: '#ffffff', duration: 1000 }   // White
        ],
        delay: (el, index) => index * 2000,  // Adjust delay for each line
        loop: true
    });
}

// Fade-in effect for the entire page or container
function fadeIn() {
    anime({
        targets: 'body', // Or a specific container element if needed
        opacity: 1,
        duration: 5000,  // 5 seconds fade-in
        easing: 'easeInOutQuad'
    });
}

// Simulate camera movement with zoom and smooth panning
let cameraPosition = { x: 0, y: 0, z: -100 };
let zoomingIn = true; // Toggle zoom direction
const zoomSpeed = 0.5; // Zoom speed
const movementSpeed = 2; // Camera movement speed

// Function to update camera position
function updateCameraPosition() {
    // Randomize camera movement within bounds
    cameraPosition.x += (Math.random() - 0.5) * 5;
    cameraPosition.y += (Math.random() - 0.5) * 5;
    cameraPosition.x = Math.max(-100, Math.min(cameraPosition.x, 100));
    cameraPosition.y = Math.max(-50, Math.min(cameraPosition.y, 50));

    // Zoom effect (moving the camera closer or further away)
    if (zoomingIn) {
        cameraPosition.z += zoomSpeed;
        if (cameraPosition.z >= -100) {
            zoomingIn = false;
        }
    } else {
        cameraPosition.z -= zoomSpeed;
        if (cameraPosition.z <= -150) {
            zoomingIn = true;
        }
    }

    // Apply camera position (This is just for visualization in 2D here)
    document.body.style.transform = `translate3d(${cameraPosition.x}px, ${cameraPosition.y}px, ${cameraPosition.z}px)`;
}

// Set cover image (can be changed dynamically)
document.getElementById('cover-image').style.backgroundImage = "url('rs.jpg')";

// Synchronize animations with beat
function syncWithBeat() {
    const player = new Tone.Player(audioPlayer.src).toDestination();
    const analyser = new Tone.Analyser("waveform", 1024);
    player.connect(analyser);

    // Start audio when ready
    player.start();

    // Set up a rhythm loop using Tone.js
    const loop = new Tone.Loop(time => {
        // Detect beat and animate accordingly
        const beat = analyser.getValue();
        const peak = Math.max(...beat);

        // Sync screen movements to beat
        anime({
            targets: 'body',
            translateX: peak * 10, // Adjust sensitivity as needed
            translateY: peak * 10,
            easing: 'easeInOutSine',
            duration: 100, // Quick shake effect
        });

        // Particle effect synchronization with beat
        anime({
            targets: '.particle',
            scale: Math.random() * 2 + 0.5, // Randomize scale with beat
            easing: 'easeInOutQuad',
            duration: 100, // Quick pulse
            loop: true,
        });
    }, "8n").start(); // Loop on each 8th note

    // Start the Tone.js Transport (this is needed to sync everything)
    Tone.Transport.start();
}

// Start the animation and sync with beat
window.onload = () => {
    fadeIn(); // Fade-in the page
    showLyrics();
    createParticles();
    animateTextGlow();
    syncWithBeat(); // Sync with music beat

    // Start camera movement
    setInterval(updateCameraPosition, 50); // Update camera position every 50ms
};