const getSquare = (x: number, y: number) => {
    return `${String.fromCharCode(97 + x)}${8 - y}` as const
}

export default getSquare
