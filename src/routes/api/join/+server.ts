import { json } from '@sveltejs/kit'
import { supabase } from '../../../db'
import type { RequestHandler } from './$types'

export const POST = (async ({ url, params }) => {
    supabase.from('servers').insert({})
    return json({})
}) satisfies RequestHandler
