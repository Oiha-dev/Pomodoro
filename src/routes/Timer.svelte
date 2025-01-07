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
    let elapsedPauseTime = 0;
    let shortBreakCount = 0;
    let audio;
    let timerInterval;

    onMount(() => {
        console.log(runningAtStart)
        audio = new Audio('alarm.wav');

        if (runningAtStart !== "false") {
            isRunning = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }
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
        <button class="start btn-secondary" on:click={startTimer}>{isRunning && !pause ? 'Pause' : 'Start'}</button>
        <button class="reset btn-secondary" on:click={() => resetTimer(currentInitialTime)}>Reset</button>
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
        padding: 20px;
    }

    .timer h1 {
        font-size: 7rem;
    }

    .startButtons {
        gap: 1rem;
        display: flex;
        justify-content: space-around;
        position: absolute;
        top: 69%;
    }

    .timeButtons {
        display: flex;
        justify-content: space-around;
        position: absolute;
        top: 20%;
        width: 75%;
        gap: 10px;
    }

    .timeButtons button {
        width: 156px;
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

    .start {
        width: 96px;
    }

    /* Tablet styles */
    @media (max-width: 768px) {
        .timer {
            width: 80vw;
            height: 60vh;
        }

        .timer h1 {
            position: absolute;
            font-size: 8rem;
            top: 0;
        }

        .timeButtons {
            position: static;
            flex-direction: row;
            width: 100%;
            margin-top: 20px;
        }

        .timeButtons button {
            width: 120px;
            padding: 15px 10px;
            font-size: 16px;
        }

        .btn-primary, .btn-secondary {
            padding: 15px 15px;
            font-size: 18px;
        }
    }

    /* Mobile styles */
    @media (max-width: 480px) {
        .timer {
            width: 90vw;
            height: auto;
            min-height: 70vh;
            padding: 30px 15px;
        }

        .timer h1 {
            font-size: 3.5rem;
        }

        .timeButtons {
            flex-direction: column;
            gap: 10px;
        }

        .timeButtons button {
            width: 100%;
            padding: 12px 10px;
            font-size: 14px;
        }

        .startButtons {
            width: 100%;
            margin: 15px 0;
        }

        .start, .reset {
            width: 45%;
            padding: 12px;
            font-size: 16px;
        }

        .btn-primary, .btn-secondary {
            padding: 12px;
            font-size: 16px;
        }
    }
</style>