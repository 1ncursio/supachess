<script lang="ts">
    import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'

    const modalStore = getModalStore()

    const createGameModal: ModalSettings = {
        type: 'component',
        component: 'CreateGameForm',
    }

    const joinGameModal: ModalSettings = {
        type: 'component',
        component: 'JoinGameForm',
    }

    const handleStartGame = async () => {
        modalStore.trigger(createGameModal)
    }

    const handleJoinGame = async () => {
        // await goto(`/games/${value}`)
        modalStore.trigger(joinGameModal)
    }
</script>

<h2 class="h2 text-center">Welcome to Supabase Realtime Chess</h2>

<div class="flex flex-row gap-4 place-content-center">
    <button on:click={handleStartGame} class="btn font-semibold uppercase variant-filled-primary">
        Start new game
    </button>

    <button on:click={handleJoinGame} class="btn font-semibold uppercase variant-filled">
        Join existing game
    </button>
</div>
