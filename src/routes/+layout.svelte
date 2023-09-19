<script lang="ts">
    // Your custom Skeleton theme:
    import '../theme.postcss'
    // This contains the bulk of Skeletons required styles:
    import '@skeletonlabs/skeleton/styles/skeleton.css'
    // Finally, your application's global stylesheet (sometimes labeled 'app.css')
    import CreateGameForm from '$lib/components/CreateGameForm.svelte'
    import JoinGameForm from '$lib/components/JoinGameForm.svelte'
    import { me } from '$lib/stores'
    import {
        AppBar,
        AppShell,
        LightSwitch,
        Modal,
        type ModalComponent,
    } from '@skeletonlabs/skeleton'
    import '../app.postcss'

    $: console.log($me)

    const modalComponentRegistry: Record<string, ModalComponent> = {
        CreateGameForm: {
            ref: CreateGameForm,
        },
        JoinGameForm: {
            ref: JoinGameForm,
        },
    }
</script>

<Modal components={modalComponentRegistry} />
<AppShell>
    <svelte:fragment slot="pageHeader">
        <AppBar slotDefault="place-self-center">
            <svelte:fragment slot="lead">
                <a href="/">
                    <h3 class="h3 font-semibold">SupaChess</h3>
                </a>
            </svelte:fragment>

            <svelte:fragment slot="trail">
                <LightSwitch rounded="rounded-full" />
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <!-- ... -->
    <main class="container mx-auto p-4 space-y-4">
        <slot />
    </main>
</AppShell>
