import type { Square } from 'chess.js'

const getSquareXY = (square: Square) => {
    const x = square.charCodeAt(0) - 97
    const y = 8 - parseInt(square[1])
    return [x, y] as const
}

export default getSquareXY
