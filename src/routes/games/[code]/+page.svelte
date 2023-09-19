<script lang="ts">
    import { browser } from '$app/environment'
    import { page } from '$app/stores'
    import Board from '$lib/components/Board.svelte'
    import type { MoveEventPayload } from '$lib/components/Board.type'
    import Timer from '$lib/components/Timer.svelte'
    import { me } from '$lib/stores'
    import chess from '$lib/utils/chess'
    import raise from '$lib/utils/raise'
    import { onDestroy, onMount } from 'svelte'
    import { supabase } from '../../../db'
    import type { Database } from '../../../types'

    type Game = Database['public']['Tables']['games']['Row']
    type Message = Database['public']['Tables']['messages']['Row']
    let game: Game | null = null
    let messages: Array<Message> = []
    let boardElement
    let content = ''
    let remainingMs = 5 * 60 * 1000
    let timer: number | null = null

    const { code } = $page.params

    const channel = supabase.channel(`room-${code}`)

    type NewMessagePayload = Database['public']['Tables']['messages']['Row']
    const changesChannel = supabase
        .channel('changes')
        .on<NewMessagePayload>(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                // filter: 'user_id=neq.' + $me.id,
            },
            (payload) => {
                console.log(payload)

                const { new: message } = payload

                messages = [...messages, message]
            },
        )
        .subscribe()

    $: isWhite = game?.white_id === $me.id
    $: console.log({ isWhite })
    $: if (game && browser && !timer) {
        // TODO: add timer

        timer = window.setInterval(() => {
            remainingMs -= 1000
        }, 1000)

        if (remainingMs <= 0) {
            window.clearInterval(timer)
        }
    }

    onMount(async () => {
        channel
            .on('broadcast', { event: 'join' }, ({ payload }) => {
                // TODO: add user to users list
            })
            .on('broadcast', { event: 'leave' }, ({ payload }) => {
                // TODO: remove user from users list
            })
            .on('broadcast', { event: 'move' }, ({ payload }) => {
                // TODO: update user position

                const { move } = payload as MoveEventPayload

                try {
                    console.log('received move', move)
                    chess.move(move)
                    boardElement.syncBoard()
                } catch (_) {
                    console.log('invalid move')
                }
            })
            // .on('broadcast', { event: 'capture' }, ({ payload }) => {
            //   // TODO: update user position and capture
            // })
            // .on('broadcast', { event: 'promotion' }, ({ payload }) => {
            //   // TODO: update user position and promotion
            // })
            // .on('broadcast', { event: 'check' }, ({ payload }) => {
            //   // TODO: update user position and check
            // })
            // .on('broadcast', { event: 'checkmate' }, ({ payload }) => {
            //   // TODO: update user position and checkmate
            // })
            // .on('broadcast', { event: 'draw' }, ({ payload }) => {
            //   // TODO: update user position and draw
            // })
            .on('broadcast', { event: 'resign' }, ({ payload }) => {
                // TODO: update user position and draw
            })
            .on('broadcast', { event: 'timeout' }, ({ payload }) => {
                // TODO:
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const res = await channel.send({
                        type: 'broadcast',
                        event: 'join',
                        payload: {
                            user: {
                                ...$me,
                            },
                        },
                    })
                    //   channel.send({
                    //     type: 'broadcast',
                    //     event: 'chat',
                    //     payload: { uuid: crypto.randomUUID(), message: 'Hello from the client!' },
                    //   })
                }
            })

        const { data: gameData } = await supabase.from('games').select().eq('code', code).single()
        game = gameData ?? raise('Game not found')

        const { data: messageData } = await supabase
            .from('messages')
            .select()
            .eq('game_id', game.id)
        messages = messageData ?? []
    })

    onDestroy(() => {
        supabase.removeChannel(channel)
        supabase.removeChannel(changesChannel)

        // clear timer
        if (timer) window.clearInterval(timer)
    })

    const handleMove = (e: CustomEvent<MoveEventPayload>) => {
        const { move } = e.detail

        channel.send({
            type: 'broadcast',
            event: 'move',
            payload: {
                move,
            },
        })
    }

    const handleSubmitMessage = async () => {
        if (!content || !game) return

        await supabase.from('messages').insert({ game_id: game.id, user_id: $me.id, content })

        content = ''
    }
</script>

{#if game}
    <section class="grid grid-cols-2">
        <Board bind:this={boardElement} on:move={handleMove} {isWhite} />
        <Timer {remainingMs} />
    </section>
    {#each messages as message (message.id)}
        <div>
            {message.user_id} : {message.content}
        </div>
    {/each}
    <form on:submit|preventDefault={handleSubmitMessage}>
        <div class="input-group grid-cols-[1fr_auto]">
            <input type="text" bind:value={content} />
            <button type="submit" class="btn rounded-[0,0,0,0] variant-filled-primary">Send</button>
        </div>
    </form>
{/if}
