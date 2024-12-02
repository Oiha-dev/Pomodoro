<script>
    import { onMount } from "svelte";

    export let initialTime = 25 * 60;
    export let shortBreakTime = 5 * 60;
    export let longBreakTime = 15 * 60;
    export let runningAtStart = false;

    let currentInitialTime = initialTime;
    let runningTime = initialTime;
    let pause = false;
    let isRunning = false;
    let formattedTime = formatTime(runningTime);
    let startTime;
    let shortBreakCount = 0;
    let audio;

    onMount(() => {
        audio = new Audio('alarm.wav');

        if (runningAtStart) startTimer();
    });

    function startTimer() {
        if (isRunning && !pause) {
            pause = true;
        } else {
            isRunning = true;
            pause = false;
            startTime = Date.now();
            updateTimer();
        }
    }

    function updateTimer() {
        if (pause) return;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        runningTime = currentInitialTime - elapsed;
        formattedTime = formatTime(runningTime);
        if (runningTime <= 0) {
            isRunning = false;
            if (audio) {
                audio.play();
            }
            handleTimerEnd();
        } else {
            setTimeout(updateTimer, 1000);
        }
    }

    function handleTimerEnd() {
        if (currentInitialTime === initialTime) {
            if (shortBreakCount < 4) {
                shortBreakCount++;
                resetTimer(shortBreakTime);
            } else {
                shortBreakCount = 0;
                resetTimer(longBreakTime);
            }
        } else {
            resetTimer(initialTime);
        }
        startTimer();
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function resetTimer(time) {
        currentInitialTime = time;
        runningTime = time;
        formattedTime = formatTime(runningTime);
        if (isRunning && !pause) {
            startTime = Date.now();
            updateTimer();
        } else {
            isRunning = false;
            pause = false;
        }
    }
</script>

<svelte:head>
    {#if currentInitialTime === initialTime}
        <title>Pomodoro {formattedTime}</title>
    {:else if currentInitialTime === shortBreakTime}
        <title>Short Break {formattedTime}</title>
    {:else if currentInitialTime === longBreakTime}
        <title>Long Break {formattedTime}</title>
    {/if}
</svelte:head>

<div class="timer">
    <h1>{formattedTime}</h1>
    <div class="startButtons">
        <button on:click={startTimer}>{isRunning && !pause ? 'Pause' : 'Start'}</button>
        <button on:click={() => resetTimer(currentInitialTime)}>Reset</button>
    </div>
    <div class="timeButtons">
        <button on:click={() => resetTimer(initialTime)}>Pomodoro</button>
        <button on:click={() => resetTimer(shortBreakTime)}>Short Break</button>
        <button on:click={() => resetTimer(longBreakTime)}>Long Break</button>
    </div>
</div>

<style>
    .timer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50vw;
        height: 55vh;
        margin: auto;
        background-color: var(--color-theme-1);
        color: white;
        border-radius: 20px;
        position: relative;
    }

    .timer h1 {
        font-size: 7rem;
    }

    .startButtons {
        display: flex;
        justify-content: space-around;
    }

    .timeButtons {
        display: flex;
        justify-content: space-around;
        position: absolute;
        top: 50px;
        width: 75%;
    }
</style>