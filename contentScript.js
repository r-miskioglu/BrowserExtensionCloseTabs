// Create and append modal to the DOM
const modal = document.createElement('div');
modal.innerHTML = `
  <div id="auto-close-modal" style="font-family: Sans-serif; background-color: rgba(255, 250, 255,0.75); color: rgb(140, 140, 140); width: 200px; height: 80px; position: fixed; top: 0; right: 0; display: none; flex-direction: column; justify-content: space-between; align-items: center; z-index: 10000;">
    <h1 id="auto-close-h1" style="margin: 0; font-size: 20px; display: flex; align-items: center; justify-content: center; height: 50%;">Auto-Close</h1>
    <div id="auto-close-buttons" style="display: flex; justify-content: space-between; height: 50%; width: 100%;">
      <button id="cancelAutoClose" style="font-size: 10px; font-family: Sans-serif; color: rgb(255, 250, 255); background-color: rgba(252, 81, 48, 0.75); width: 50%; box-sizing: border-box; height: 100%; border: none;">No</button>
      <button id="enableAutoClose" style="font-size: 10px; font-family: Sans-serif; color: rgb(255, 250, 255); background-color: rgba(53, 206, 141, 0.75); width: 50%; box-sizing: border-box; height: 100%; border: none;">Yes</button>
    </div>
  </div>
`;

document.body.appendChild(modal);

function showModal() {
    document.getElementById('auto-close-modal').style.display = 'flex';
}

function hideModal() {
    document.getElementById('auto-close-modal').style.display = 'none';
}

let myPort = browser.runtime.connect({ name: "port-from-cs" });


document.getElementById('enableAutoClose').addEventListener('click', function() {
    myPort.postMessage({ action: 'enableAutoClose' });
    hideModal();
});

document.getElementById('cancelAutoClose').addEventListener('click', function() {
    hideModal();
});

// Listen for messages
myPort.onMessage.addListener((message) => {
    if (message.action === 'showModal') {
        // Show the modal
        document.getElementById('auto-close-modal').style.display = 'flex';
    } else if (message.action === 'hideModal') {
        // Hide the modal
        document.getElementById('auto-close-modal').style.display = 'none';
    } else if (message.action === 'checkReady') {
        // Respond to background script to confirm readiness
        myPort.postMessage({ ready: true });
    }
});

// Listen for mouse movement
document.addEventListener('mousemove', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for mouse clicks
document.addEventListener('click', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for mouse down (press)
document.addEventListener('mousedown', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for mouse up (release)
document.addEventListener('mouseup', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for mouse scrolls
document.addEventListener('wheel', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for keyboard presses
document.addEventListener('keydown', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for keyboard release
document.addEventListener('keyup', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for touch on touch screens
document.addEventListener('touchstart', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for touch movement
document.addEventListener('touchmove', () => {
    myPort.postMessage({ action: 'inputDetected' });
});

// Listen for touch end (finger lifted)
document.addEventListener('touchend', () => {
    myPort.postMessage({ action: 'inputDetected' });
});
