const pedal = document.getElementById('gasPedal');
const needle = document.getElementById('needle');
const dashboard = document.getElementById('dashboard');
const explosionScreen = document.getElementById('explosionScreen');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let isPressing = false;
let rpm = 0; // Giri del motore (da 0 a 100)
let animationFrame;

// Gestione eventi per desktop e mobile
pedal.addEventListener('mousedown', () => isPressing = true);
pedal.addEventListener('mouseup', () => isPressing = false);
pedal.addEventListener('mouseleave', () => isPressing = false);
pedal.addEventListener('touchstart', (e) => { e.preventDefault(); isPressing = true; });
pedal.addEventListener('touchend', () => isPressing = false);

// Loop principale del motore
function engineLoop() {
    if (isPressing) {
        rpm += 1.5; // Velocità di accelerazione
        document.body.classList.add('shake'); // Piccolo tremolio mentre accelera
    } else {
        rpm -= 2; // Decelerazione
        document.body.classList.remove('shake');
    }

    // Limiti del contagiri
    if (rpm < 0) rpm = 0;
    if (rpm > 100) rpm = 100;

    // Aggiorna l'ago del tachimetro (da -90deg a +90deg)
    let angle = -90 + (rpm * 1.8);
    needle.style.transform = `rotate(${angle}deg)`;

    // Se raggiunge il massimo, scatena l'esclamazione!
    if (rpm >= 100) {
        triggerExplosion();
        return; // Ferma il loop
    }

    animationFrame = requestAnimationFrame(engineLoop);
}

engineLoop();

// --- LOGICA ESPLOSIONE E PARTICELLE ---
function triggerExplosion() {
    cancelAnimationFrame(animationFrame);
    document.body.classList.add('shake');
    document.body.style.backgroundColor = "#ff0000"; // Flash rosso
    
    setTimeout(() => {
        document.body.style.backgroundColor = "#0d0d0d";
    }, 100);

    dashboard.classList.add('hidden');
    explosionScreen.classList.remove('hidden');

    createParticles();
}

// Setup Canvas per esplosione di scintille
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.vx = (Math.random() - 0.5) * 30; // Velocità esplosiva X
        this.vy = (Math.random() - 0.5) * 30; // Velocità esplosiva Y
        this.size = Math.random() * 5 + 2;
        this.color = Math.random() > 0.5 ? '#ff1e00' : '#ffae00';
        this.life = 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02; // Velocità di scomparsa
    }
    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = [];

function createParticles() {
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
    animateParticles();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.life <= 0) {
            particles.splice(index, 1);
        }
    });

    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    } else {
        // Quando le particelle finiscono, ferma il tremolio
        document.body.classList.remove('shake');
    }
}