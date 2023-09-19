<script lang="ts">
    import { enhance } from '$app/forms'
    import { me } from '$lib/stores'

    // Base classes
    const cHeader = 'text-2xl font-bold'

    const form = {
        name: 'GUEST',
        color: 'white',
        timeLimit: 5,
        timeIncrement: 1,
    }

    const colors = ['white', 'black', 'random'] as const

    const handleCreateGame = async () => {
        // await goto(`/games/${code}`)
    }
</script>

<!-- @component This example creates a simple form modal. -->
<div class="card p-4 w-modal shadow-xl space-y-4">
    <header class={cHeader}></header>
    <form
        method="post"
        action="?/create"
        use:enhance={({ form }) => {
            return async ({ result, update }) => {
                if (result.type === 'success') {
                    form.reset()
                }
                // if (result.type === 'invalid') {
                //     await applyAction(result)
                // }
            }
        }}
        class="space-y-4"
    >
        <input type="text" bind:value={$me.id} hidden />
        <label class="label">
            <span>Name</span>
            <input type="text" placeholder="Input your name" bind:value={form.name} class="input" />
        </label>
        <label class="label">
            <span>Minutes per side: <strong>{form.timeLimit}</strong></span>
            <input name="timeLimit" type="range" bind:value={form.timeLimit} min={0} max={10} />
        </label>
        <label class="label">
            <span>Increment in seconds: <strong>{form.timeIncrement}</strong></span>
            <input
                name="timeIncrement"
                type="range"
                bind:value={form.timeIncrement}
                min={0}
                max={10}
            />
        </label>
        <label class="label">
            <span>Color</span>
            <select bind:value={form.color} name="color" class="select">
                {#each colors as color (color)}
                    <option value={color}>{color}</option>
                {/each}
            </select>
        </label>
        <button
            type="submit"
            class="btn btn-lg font-semibold w-full variant-filled-primary uppercase"
        >
            Create game
        </button>
    </form>
</div>
