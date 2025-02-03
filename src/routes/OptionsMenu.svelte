<script>
    import { onMount, createEventDispatcher } from "svelte";

    export let visible = false;
    export let initialTime;
    export let shortBreakTime;
    export let longBreakTime;
    export let runningAtStart;

    let newInitialTime = initialTime / 60;
    let newShortBreakTime = shortBreakTime / 60;
    let newLongBreakTime = longBreakTime / 60;
    let newRunningAtStart = runningAtStart;

    const dispatch = createEventDispatcher();

    onMount(() => {
        const savedSettings = JSON.parse(localStorage.getItem("pomodoroSettings"));
        if (savedSettings) {
            newInitialTime = savedSettings.initialTime / 60;
            newShortBreakTime = savedSettings.shortBreakTime / 60;
            newLongBreakTime = savedSettings.longBreakTime / 60;
            newRunningAtStart = savedSettings.runningAtStart;
        }
    });

    function saveOptions() {
        const updatedSettings = {
            initialTime: newInitialTime * 60,
            shortBreakTime: newShortBreakTime * 60,
            longBreakTime: newLongBreakTime * 60,
            runningAtStart: newRunningAtStart,
        };

        localStorage.setItem("pomodoroSettings", JSON.stringify(updatedSettings));
        dispatch("updateSettings", updatedSettings);
        visible = false;
    }
</script>

{#if visible}
    <div class="options-menu"
         class:visible
         on:click|self={() => visible = false}>
        <div class="options-content"
             on:click|stopPropagation>
            <h2>Options</h2>
            <div class="input-container">
                <label>
                    <span>Pomodoro Time (minutes):</span>
                    <input
                            type="number"
                            bind:value={newInitialTime}
                            min="1"
                            max="60"
                            class="input-number"
                    />
                </label>
                <label>
                    <span>Short Break Time (minutes):</span>
                    <input
                            type="number"
                            bind:value={newShortBreakTime}
                            min="1"
                            max="60"
                            class="input-number"
                    />
                </label>
                <label>
                    <span>Long Break Time (minutes):</span>
                    <input
                            type="number"
                            bind:value={newLongBreakTime}
                            min="1"
                            max="60"
                            class="input-number"
                    />
                </label>
                <label class="toggle-container">
                    <span>Running at Start:</span>
                    <input
                            type="checkbox"
                            bind:checked={newRunningAtStart}
                            class="input-checkbox"
                    />
                </label>
            </div>
            <button on:click={saveOptions}>Save</button>
        </div>
    </div>
{/if}

<style>
    .options-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        transition: background-color 0.3s ease;
        backdrop-filter: blur(0px);
    }

    .options-menu.visible {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(3px);
    }

    .options-content {
        background-color: var(--first-color-dark);
        padding: 20px;
        border-radius: 10px;
        color: white;
        width: 300px;
    }

    .options-content h2 {
        margin-bottom: 20px;
        text-align: center;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        gap: 0.6em;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        font-size: 14px;
    }

    input {
        padding: 10px 20px;
        border-radius: 19px;
        font-size: 16px;
        border: none;
        background-color: var(--third-color-dark);
        border-bottom: 4px solid var(--bg-color-dark);
        color: white;
        width: 100%;
        box-sizing: border-box;
    }

    .toggle-container {
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .input-checkbox {
        width: auto;
        margin-left: 10px;
    }

    button {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: var(--third-color-dark);
        color: var(--font-color-dark);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
    }

    button:hover {
        background-color: #7ec5af;
    }

    @media (max-width: 480px) {
        .options-content {
            width: 90%;
            padding: 15px;
        }
    }
</style>