<script>
    import { onMount } from "svelte";

    export let initialTime = 7 * 1;
    export let shortBreakTime = 5 * 1;
    export let longBreakTime = 6 * 1;
    export let runningAtStart = false;

    let currentInitialTime = initialTime;
    let runningTime = initialTime;
    let pause = false;
    let isRunning = false;
    let formattedTime = formatTime(runningTime);
    let startTime;
    let elapsedPauseTime = 0;
    let shortBreakCount = 0;
    let audio;
    let timerInterval;

    onMount(() => {
        audio = new Audio('alarm.wav');

        if (runningAtStart) startTimer();
    });

    function startTimer() {
        if (isRunning && !pause) {
            pause = true;
            elapsedPauseTime = Date.now() - startTime;
            clearInterval(timerInterval);
        } else {
            isRunning = true;
            pause = false;
            startTime = Date.now() - elapsedPauseTime;
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        if (pause) return;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        runningTime = currentInitialTime - elapsed;
        formattedTime = formatTime(runningTime);
        if (runningTime <= 0) {
            isRunning = false;
            clearInterval(timerInterval);
            if (audio) {
                audio.play();
            }
            handleTimerEnd();
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
        isRunning = false;
        pause = false;
        elapsedPauseTime = 0;
        clearInterval(timerInterval);
    }

    $: isPomodoro = currentInitialTime === initialTime;
    $: isShortBreak = currentInitialTime === shortBreakTime;
    $: isLongBreak = currentInitialTime === longBreakTime;
</script>

<svelte:head>
    {#if isPomodoro}
        <title>Pomodoro {formattedTime}</title>
    {:else if isShortBreak}
        <title>Short Break {formattedTime}</title>
    {:else if isLongBreak}
        <title>Long Break {formattedTime}</title>
    {/if}
</svelte:head>

<div class="timer">
    <h1>{formattedTime}</h1>
    <div class="startButtons">
        <button class="btn-secondary" on:click={startTimer}>{isRunning && !pause ? 'Pause' : 'Start'}</button>
        <button class="btn-secondary" on:click={() => resetTimer(currentInitialTime)}>Reset</button>
    </div>
    <div class="timeButtons">
        <button on:click={() => resetTimer(initialTime)} class:btn-primary={isPomodoro} class:btn-secondary={!isPomodoro}>Pomodoro</button>
        <button on:click={() => resetTimer(shortBreakTime)} class:btn-primary={isShortBreak} class:btn-secondary={!isShortBreak}>Short Break</button>
        <button on:click={() => resetTimer(longBreakTime)} class:btn-primary={isLongBreak} class:btn-secondary={!isLongBreak}>Long Break</button>
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
        background-color: var(--first-color-dark);
        color: white;
        border-radius: 20px;
        position: relative;
    }

    .timer h1 {
        font-size: 7rem;
    }

    .startButtons {
        gap: 1rem;
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

    .btn-primary, .btn-secondary {
        padding: 20px 20px;
        border-radius: 19px;
        font-size: 20px;
        cursor: pointer;
        text-align: center;
        border: none;
    }

    .btn-primary {
        background-color: var(--third-color-dark);
        color: var(--font2-color-dark);
        border: 2px solid var(--third-color-dark);
    }

    .btn-primary:hover {
        background-color: #7ec5af;
        border: 2px solid #7ec5af;
    }

    .btn-secondary {
        background-color: transparent;
        color: var(--font-color-dark);
        border: 2px solid var(--second-color-dark);
    }

    .btn-secondary:hover {
        background-color: var(--bg-color-dark);
        color: white;
    }
</style>