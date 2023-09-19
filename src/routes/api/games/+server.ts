import { supabase } from '../../../db'
import type { RequestHandler } from './$types'

export const POST = (async ({ request }) => {
    const { code, whiteId, blackId, fen, pgn } = await request.json()
    const { data, error } = await supabase.from('games').insert({
        code,
        white_id: whiteId,
        black_id: blackId,
        fen,
        pgn,
    })

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify(data))
}) satisfies RequestHandler
