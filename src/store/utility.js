export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}
export const removeItem = (array, index) => {
    if (index > -1)
        return [
            ...array.slice(0, index),
            ...array.slice(index + 1)
        ];
    else
        return array
}

export const insertItem = (array, item, index = 0) => {
    return [
        ...array.slice(0, index),
        item,
        ...array.slice(index)
    ]
}