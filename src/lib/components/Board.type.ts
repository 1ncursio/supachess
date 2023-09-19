import type { Move } from 'chess.js'

export type EventMap = {
    move: MoveEventPayload
}

export type MoveEventPayload = {
    move: Move
}
