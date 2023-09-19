import { persisted } from 'svelte-local-storage-store'

export const me = persisted('me', {
    id: crypto.randomUUID(),
})
