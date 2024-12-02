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
    let shortBreakCount = 0;

    onMount(() => {
        if (runningAtStart) startTimer();
    });

    function startTimer() {
        if (isRunning && !pause) {
            pause = true;
            clearInterval(interval);
        } else {
            isRunning = true;
            pause = false;
            interval = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        if (pause) return;
        runningTime--;
        formattedTime = formatTime(runningTime);
        if (runningTime < 0) {
            clearInterval(interval);
            isRunning = false;
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
        clearInterval(interval);
        currentInitialTime = time;
        runningTime = time;
        formattedTime = formatTime(runningTime);
        if (isRunning && !pause) {
            interval = setInterval(updateTimer, 1000);
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
    <button on:click={startTimer}>{isRunning && !pause ? 'Pause' : 'Start'}</button>
    <button on:click={() => resetTimer(currentInitialTime)}>Reset</button>
    <button on:click={() => resetTimer(initialTime)}>Pomodoro</button>
    <button on:click={() => resetTimer(shortBreakTime)}>Short Break</button>
    <button on:click={() => resetTimer(longBreakTime)}>Long Break</button>
</div>