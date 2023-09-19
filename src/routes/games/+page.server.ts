import type { Actions } from './$types'

export const actions: Actions = {
    async create({ request }) {
        return {
            status: 200,
            body: {
                message: 'create',
            },
        }
    },
}
