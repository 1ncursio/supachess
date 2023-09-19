<script lang="ts">
  import chess from '$lib/utils/chess'
  import { BOARD_SIZE, SQUARE_SIZE } from '$lib/utils/constants'
  import getSquare from '$lib/utils/getSquare'
  import getSquareXY from '$lib/utils/getSymbol'
  import type { Square } from 'chess.js'
  import {
    Application,
    Assets,
    FederatedPointerEvent,
    Graphics,
    Sprite,
    Texture,
    type ICanvas,
  } from 'pixi.js'
  import { createEventDispatcher, onMount } from 'svelte'
  import type { EventMap } from './Board.type'

  export let isWhite: boolean

  let app: Application<ICanvas>
  let board: Sprite
  let canvas: HTMLCanvasElement

  let draggingPiece: Sprite | null = null

  const dispatch = createEventDispatcher<EventMap>()

  onMount(async () => {
    Assets.add('wk', '/wk.png')
    Assets.add('wp', '/wp.png')
    Assets.add('wn', '/wn.png')
    Assets.add('wb', '/wb.png')
    Assets.add('wr', '/wr.png')
    Assets.add('wq', '/wq.png')
    Assets.add('bk', '/bk.png')
    Assets.add('bp', '/bp.png')
    Assets.add('bn', '/bn.png')
    Assets.add('bb', '/bb.png')
    Assets.add('br', '/br.png')
    Assets.add('bq', '/bq.png')
    Assets.add('board', '/board.png')

    board = new Sprite(await Assets.load<Texture>('board'))
    // board.scale.set(1 / 4)

    board.interactive = true // Make the wk interactive
    board.on('mousemove', (e) => {
      if (draggingPiece) {
        const newPosition = e.getLocalPosition(board)
        draggingPiece.position.x = newPosition.x
        draggingPiece.position.y = newPosition.y
      }
    })
    // .on('rightdown', onDragCancel)
    // .on('contextmenu', onDragCancel)

    app = new Application({
      view: canvas,
      width: BOARD_SIZE,
      height: BOARD_SIZE,
      backgroundColor: 0xffffff,
    })

    app.stage.addChild(board)

    syncBoard()
  })

  const onDragStart = (e: FederatedPointerEvent) => {
    const piece = e.currentTarget as Sprite
    // do not pick up pieces if the game is over
    if (chess.isGameOver()) return

    // only pick up pieces for own color
    if (isWhite && piece.name!.search(/^b/) !== -1) return
    if (!isWhite && piece.name!.search(/^w/) !== -1) return
    // if (piece.name!.search(/^b/) !== -1) return

    console.log('pointerdown', { name: piece.name })
    // drag

    draggingPiece = piece
    piece.scale.set(1.2)

    // TODO: 함수로 빼기. board.on mousemove에서도 같은 로직을 사용하고 있음.
    const newPosition = e.getLocalPosition(board)
    draggingPiece.position.x = newPosition.x
    draggingPiece.position.y = newPosition.y

    // highlight the possible squares for this piece
    // TODO: 가능한 무브가 프로모션인 경우, 한 포지션에 여러 무브가 겹쳐서 표시됨.
    const moves = chess.moves({ square: piece.name!.split('-')[1] as Square, verbose: true })
    moves.forEach((move) => {
      const [x, y] = getSquareXY(move.to)
      const square = new Graphics()
      square.beginFill(0x000000, 0.3)
      square.drawRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE)
      square.endFill()
      square.name = `legal-move-highlight-${move.to}`

      // TODO: z-index 설정
      board.addChild(square)
    })
  }

  const onDrop = (e: FederatedPointerEvent) => {
    const piece = e.currentTarget as Sprite
    console.log('pointerup', { name: piece.name })

    // only pick down pieces for own color
    if (isWhite && piece.name!.search(/^b/) !== -1) return
    if (!isWhite && piece.name!.search(/^w/) !== -1) return

    // get position of collision point
    const newPosition = e.getLocalPosition(piece.parent)
    // get the square
    const squareX = Math.floor(newPosition.x / SQUARE_SIZE)
    const squareY = Math.floor(newPosition.y / SQUARE_SIZE)

    const target = getSquare(squareX, squareY) as Square
    const [, source] = piece.name!.split('-') as [string, Square]
    console.log({ position: target })

    try {
      // see if the move is legal
      const move = chess.move({
        from: source,
        to: target,
        promotion: 'q', // NOTE: always promote to a queen for example simplicity
      })

      syncBoard()

      // dispatch move
      dispatch('move', {
        move,
      })

      // setTimeout(makeRandomMove, 250)
    } catch (_) {
      console.log('invalid move')

      // move back to original position
      const [x, y] = getSquareXY(source)
      piece.position.set(x * SQUARE_SIZE + SQUARE_SIZE / 2, y * SQUARE_SIZE + SQUARE_SIZE / 2)
    }

    // drop
    draggingPiece = null
    piece.scale.set(1)
    // remove highlights. the name of the highlight is the square
    board.children
      .filter((piece) => piece.name!.search(/^legal-move-highlight/) !== -1)
      .forEach((piece) => {
        piece.destroy()
      })

    // board.getChildByName
  }

  // const makeRandomMove = () => {
  //   const possibleMoves = chess.moves({ verbose: true })

  //   // game over
  //   if (possibleMoves.length === 0) return

  //   const randomIdx = Math.floor(Math.random() * possibleMoves.length)
  //   const chosen = possibleMoves[randomIdx]
  //   const move = chess.move(chosen)

  //   syncBoard()
  // }

  const onDragCancel = () => {
    draggingPiece = null
  }

  export const syncBoard = () => {
    board.removeChildren()

    chess.board().forEach((row, rowIndex) => {
      row.forEach(async (col, colIndex) => {
        if (col === null) return
        const { type, color, square } = col

        const symbol = `${color}${type}` as const

        const texture = await Assets.load<Texture>(symbol)
        const piece = new Sprite(texture)

        piece.name = `${symbol}-${square}`
        piece.anchor.set(0.5)
        piece.rotation = isWhite ? 0 : Math.PI
        piece.position.set(
          colIndex * SQUARE_SIZE + SQUARE_SIZE / 2,
          rowIndex * SQUARE_SIZE + SQUARE_SIZE / 2,
        )
        piece.interactive = true // Make the piece interactive
        piece.cursor = 'pointer' // Make the piece interactive
        piece.on('pointerdown', onDragStart).on('pointerup', onDrop).on('pointerupoutside', onDrop)

        board.addChild(piece)
      })
    })

    // if color is black, rotate the board
    if (!isWhite) {
      board.rotation = Math.PI
      board.position.set(BOARD_SIZE, BOARD_SIZE)
    }
  }
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    display: block;
    width: 512px;
    height: 512px;
  }
</style>
