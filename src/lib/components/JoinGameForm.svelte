<script lang="ts">
    import { enhance } from '$app/forms'
    import { me } from '$lib/stores'

    // Base classes
    const cHeader = 'text-2xl font-bold'

    const form = {
        name: 'GUEST',
        code: '',
    }

    const handleCreateGame = async () => {
        // await goto(`/games/${code}`)
    }
</script>

<!-- @component This example creates a simple form modal. -->
<div class="card p-4 w-modal shadow-xl space-y-4">
    <header class={cHeader}></header>
    <form
        method="post"
        action="?/join"
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
            <span>Code</span>
            <input type="text" placeholder="Input code" bind:value={form.code} class="input" />
        </label>
        <button
            type="submit"
            class="btn btn-lg font-semibold w-full variant-filled-primary uppercase"
        >
            Join game
        </button>
    </form>
</div>
