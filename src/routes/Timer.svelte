<script>
    import { onMount, tick } from "svelte";
    import OptionsMenu from "./OptionsMenu.svelte";

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
    let showOptions = false;
    let progress = 100;

    function toggleOptions() {
        showOptions = !showOptions;
    }

    function handleUpdateSettings(event) {
        const { initialTime: newInitial, shortBreakTime: newShort, longBreakTime: newLong, runningAtStart: newRunning } = event.detail;
        let previousMode = isPomodoro ? "pomodoro" : isShortBreak ? "shortBreak" : "longBreak";

        initialTime = newInitial;
        shortBreakTime = newShort;
        longBreakTime = newLong;
        runningAtStart = newRunning;

        if (previousMode === "pomodoro") {
            currentInitialTime = initialTime;
            runningTime = initialTime;
        } else if (previousMode === "shortBreak") {
            currentInitialTime = shortBreakTime;
            runningTime = shortBreakTime;
        } else if (previousMode === "longBreak") {
            currentInitialTime = longBreakTime;
            runningTime = longBreakTime;
        }

        formattedTime = formatTime(runningTime);
    }

    onMount(() => {
        const savedSettings = JSON.parse(localStorage.getItem("pomodoroSettings"));
        if (savedSettings) {
            initialTime = savedSettings.initialTime;
            shortBreakTime = savedSettings.shortBreakTime;
            longBreakTime = savedSettings.longBreakTime;
            runningAtStart = savedSettings.runningAtStart;
            currentInitialTime = initialTime;
            runningTime = initialTime;
            formattedTime = formatTime(runningTime);
        }

        audio = new Audio('alarm.wav');

        if (runningAtStart) {
            isRunning = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 10);
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
            timerInterval = setInterval(updateTimer, 10);
        }
    }

    async function updateTimer() {
        if (pause) return;
        const elapsed = (Date.now() - startTime) / 1000;
        runningTime = Math.floor(currentInitialTime - elapsed);
        formattedTime = formatTime(runningTime);

        progress = 100 - ((currentInitialTime - elapsed) / currentInitialTime) * 100;

        if (runningTime <= 0) {
            isRunning = false;
            clearInterval(timerInterval);
            if (audio) {
                audio.play();
            }
            handleTimerEnd();
        }

        await tick();
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


<div
        class="timer"
        class:running={isRunning && !pause}
        style="--progress: {progress}%;">
    <div
            class="progress-border"
            style="background: conic-gradient(var(--second-color-dark) {progress}%, transparent 0%);"
    ></div>
    <div class="timer-content">
        <div class="timeButtons">
            <button on:click={() => resetTimer(initialTime)}
                    class:btn-primary={isPomodoro}
                    class:btn-secondary={!isPomodoro}>Pomodoro
            </button>
            <button on:click={() => resetTimer(shortBreakTime)}
                    class:btn-primary={isShortBreak}
                    class:btn-secondary={!isShortBreak}>Short Break
            </button>
            <button on:click={() => resetTimer(longBreakTime)}
                    class:btn-primary={isLongBreak}
                    class:btn-secondary={!isLongBreak}>Long Break
            </button>
        </div>
        <h1>{formattedTime}</h1>
        <div class="startButtons">
            <button class="start btn-secondary" on:click={startTimer}>
                {isRunning && !pause ? 'Pause' : 'Start'}
            </button>
            <button class="reset btn-secondary" on:click={() => resetTimer(currentInitialTime)}>Reset</button>
            <button class="options btn-secondary" on:click={toggleOptions}>Options</button>
        </div>
    </div>
</div>

<OptionsMenu
        bind:visible={showOptions}
        {initialTime}
        {shortBreakTime}
        {longBreakTime}
        {runningAtStart}
        on:updateSettings={handleUpdateSettings}
/>

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
        overflow: hidden;
    }

    .progress-border {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: background 1s linear;
    }

    .timer::after {
        content: '';
        position: absolute;
        background-color: var(--first-color-dark);
        inset: 5px;
        border-radius: 15px;
    }

    .timer-content {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }

    .timer h1 {
        font-size: 7rem;
    }

    .startButtons {
        gap: 1rem;
        display: flex;
        justify-content: space-around;
        width: auto;
    }

    .timeButtons {
        display: flex;
        justify-content: space-around;
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
</style>
