<script>
    import { onMount } from "svelte";

    export let initialTime = 1500;
    export let shortBreakTime = 300;
    export let longBreakTime = 900;
    export let runningAtStart = false;

    let currentInitialTime = initialTime;
    let runningTime = initialTime;
    let pause = false;
    let isRunning = false;
    let formattedTime = formatTime(runningTime);
    let interval;

    onMount(() => {
        if (runningAtStart) startTimer();
    });

    function startTimer() {
        if (isRunning) {
            pause = !pause;
            return;
        }
        isRunning = true;
        pause = false;
        updateTimer();
        interval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (pause) return;
        formattedTime = formatTime(runningTime);
        runningTime--;
        if (runningTime < 0) {
            clearInterval(interval);
            isRunning = false;
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function resetTimer(time) {
        clearInterval(interval);
        currentInitialTime = time;
        runningTime = time;
        formattedTime = formatTime(runningTime);
        isRunning = false;
        pause = false;
    }
</script>

<div class="timer">
    <h1>{formattedTime}</h1>
    <button on:click={startTimer}>{isRunning && !pause ? 'Pause' : 'Start'}</button>
    <button on:click={resetTimer(currentInitialTime)}>Reset</button>
    <button on:click={resetTimer(initialTime)}>Pomodoro</button>
    <button on:click={resetTimer(shortBreakTime)}>Short Break</button>
    <button on:click={resetTimer(longBreakTime)}>Long Break</button>
</div>