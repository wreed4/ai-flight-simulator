import { Engine } from './core/Engine';

let engine;

// Function to start the simulator
function startSimulator() {
    console.log("Starting flight simulator");

    // Create and initialize the engine
    engine = new Engine();
    engine.init();
    engine.start();

    console.log("Flight simulator started");
}

// Update controls dialog to describe all the controls
function updateControlsDialog() {
    const tbody = document.querySelector('.controls-table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td><span class="key-badge">W</span> or <span class="key-badge">↑</span></td>
            <td>Pitch up (nose down)</td>
        </tr>
        <tr>
            <td><span class="key-badge">S</span> or <span class="key-badge">↓</span></td>
            <td>Pitch down (nose up)</td>
        </tr>
        <tr>
            <td><span class="key-badge">A</span></td>
            <td>Roll left & turn left</td>
        </tr>
        <tr>
            <td><span class="key-badge">D</span></td>
            <td>Roll right & turn right</td>
        </tr>
        <tr>
            <td><span class="key-badge">←</span></td>
            <td>Yaw left</td>
        </tr>
        <tr>
            <td><span class="key-badge">→</span></td>
            <td>Yaw right</td>
        </tr>
        <tr>
            <td><span class="key-badge">Shift</span></td>
            <td>Increase throttle</td>
        </tr>
        <tr>
            <td><span class="key-badge">Ctrl</span></td>
            <td>Decrease throttle</td>
        </tr>
        <tr>
            <td><span class="key-badge">Space</span></td>
            <td>Toggle pause</td>
        </tr>
    `;
}

// Set up the controls dialog
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, setting up controls dialog");

    updateControlsDialog();

    // Set up dialog close handlers
    const controlsOverlay = document.getElementById('controls-overlay');
    const closeButton = document.getElementById('close-controls');
    const startButton = document.getElementById('start-simulator');

    function closeControlsDialog() {
        console.log("Closing controls dialog");
        controlsOverlay.style.display = 'none';
        startSimulator();
    }

    closeButton.addEventListener('click', closeControlsDialog);
    startButton.addEventListener('click', closeControlsDialog);
});
