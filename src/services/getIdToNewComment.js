export const getArrayId = (comments) => {
    let arrayId = []
    comments.forEach(item => {
        arrayId.push(item.id)
        if (item.replies && item.replies.length) {
            arrayId.push(...getArrayId(item.replies))
        }
    })
    arrayId = arrayId.sort((a, b) => {
        return a - b
    })
    return arrayId
}

export const getIdToNewComment = (comments) => {
    let arrayId = getArrayId(comments)
    let id = arrayId[arrayId.length - 1] + 1
    return id
}

// export getIdToNewComment