const pedal = document.getElementById('gas-pedal');
const gaugeFill = document.getElementById('gauge-progress');
const rpmValue = document.getElementById('rpm-value');
const shoutScreen = document.getElementById('shout-screen');
const flash = document.getElementById('flash-overlay');

let progress = 0;
let isAccelerating = false;
const MAX_PROGRESS = 126; // Lunghezza del tracciato SVG

function update() {
    if (isAccelerating) {
        progress += 1.5;
        document.body.style.transform = `scale(${1 + (progress/1000)})`;
    } else {
        progress -= 1.0;
    }

    if (progress < 0) progress = 0;
    if (progress >= 100) {
        triggerShout();
        return;
    }

    // Calcolo per l'offset dell'SVG (il tachimetro)
    const offset = MAX_PROGRESS - (progress / 100) * MAX_PROGRESS;
    gaugeFill.style.strokeDashoffset = offset;
    rpmValue.innerText = Math.floor(progress);

    requestAnimationFrame(update);
}

function triggerShout() {
    isAccelerating = false;
    flash.classList.add('flash-active');
    
    setTimeout(() => {
        shoutScreen.classList.remove('hidden');
        document.body.style.transform = "scale(1)";
        // Qui potresti far vibrare lo smartphone se supportato
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
    }, 300);
}

// Eventi Touch per Mobile-First
pedal.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isAccelerating = true;
});

pedal.addEventListener('touchend', () => {
    isAccelerating = false;
});

// Fallback per Desktop
pedal.addEventListener('mousedown', () => isAccelerating = true);
pedal.addEventListener('mouseup', () => isAccelerating = false);

update();