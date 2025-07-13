let time = 0;
let running = false;
let interval;

function setTimer() {
    const input = document.getElementById('setTime').value;
    time = parseInt(input) || 0; // Convert input to integer, default to 0 if invalid
    updateDisplay();
    document.getElementById('startPauseBtn').textContent = 'Start';
    document.getElementById('lapBtn').disabled = (time <= 0); // Disable lap button if no time set
}

function startStop() {
    const startPauseBtn = document.getElementById('startPauseBtn');
    const lapBtn = document.getElementById('lapBtn');
    if (!running && time > 0) {
        interval = setInterval(updateDisplay, 1000);
        running = true;
        startPauseBtn.textContent = 'Pause';
        lapBtn.disabled = false; // Enable lap button when timer starts
    } else if (running) {
        clearInterval(interval);
        running = false;
        startPauseBtn.textContent = 'Resume';
        lapBtn.disabled = true; // Disable lap button when paused
    }
}

function reset() {
    clearInterval(interval);
    running = false;
    time = 0;
    document.getElementById('display').textContent = "00:00:00";
    document.getElementById('setTime').value = "";
    document.getElementById('startPauseBtn').textContent = 'Start';
    document.getElementById('lapBtn').disabled = true; // Disable lap button on reset
    document.getElementById('laps').innerHTML = "";
}

function lap() {
    if (running && time > 0) {
        const lapTime = document.getElementById('display').textContent;
        const li = document.createElement('li');
        li.textContent = `Lap: ${lapTime}`;
        document.getElementById('laps').appendChild(li);
    }
}

function updateDisplay() {
    if (time <= 0) {
        clearInterval(interval);
        running = false;
        document.getElementById('display').textContent = "00:00:00";
        document.getElementById('startPauseBtn').textContent = 'Start';
        document.getElementById('lapBtn').disabled = true; // Disable lap button when timer ends
        alert("Time's up!");
        return;
    }
    time--;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    document.getElementById('display').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Add event listeners
document.getElementById('startPauseBtn').addEventListener('click', startStop);
