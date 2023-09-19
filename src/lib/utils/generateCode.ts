const generateCode = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    const bytes = new Uint8Array(length)
    crypto.getRandomValues(bytes)
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters[bytes[i] % charactersLength]
    }
    return result
}

export default generateCode
