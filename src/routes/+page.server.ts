import generateCode from '$lib/utils/generateCode'
import { error } from '@sveltejs/kit'
import { supabase } from '../db'
import type { Actions } from './$types'

export const actions = {
    async create({ request }) {
        const formData = await request.formData()

        const name = formData.get('name')?.toString() ?? ''
        const id = formData.get('id')?.toString() ?? ''
        const color = formData.get('color')?.toString() ?? ''
        const timeLimit = Number(formData.get('timeLimit'))
        const timeIncrement = Number(formData.get('timeIncrement'))
        const code = generateCode()

        const selectedColor = color === 'random' ? ['white', 'black'][Math.floor(Math.random() * 2)] : color
        await supabase.from('games').insert({
            code,
            black_id: selectedColor === 'black' ? id : null,
            white_id: selectedColor === 'white' ? id : null,
        })

        console.log({ name, selectedColor, timeLimit, timeIncrement })

        return {
            name,
            color,
            timeLimit,
            timeIncrement,
        }
    },
    async join({ request }) {
        const formData = await request.formData()

        const name = formData.get('name')?.toString() ?? ''
        const code = formData.get('code')?.toString() ?? ''

        const { data: game, error: postgrestError } = await supabase.from('games').select('*').eq('code', code).single()

        // TODO: error handling

        if (!game) {
            throw error(404, 'Game not found')
        }
    },
} satisfies Actions
