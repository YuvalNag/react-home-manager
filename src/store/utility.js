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

export const groupBy = (arr, key) => {
    return arr.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export const deepClone = (object) => {
    const newObject = {}
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            if (typeof element === 'object' && element instanceof Array) {
                newObject[key] = element.map(elm => deepClone(elm))
            }
            else if (typeof element === 'object' && element instanceof Array) {
                newObject[key] = deepClone(element)
            }
            else {
                newObject[key] = element
            }
        }
    }
    return newObject
}

export const margeTwoArraysWithImportantProp = (arr1, arr2, prop) => {
    const object = {};
    for (const elem of arr1) {
        object[elem.id] = elem;
    }
    for (const elem of arr2) {
        if (object.hasOwnProperty(elem.id) && elem[prop] !== undefined) {
            object[elem.id] = elem;

        } else {
            object[elem.id] = elem;

        }
    }
    return Object.values(object);
}
export const distanceOfStrings = (substr, str) => {
    const substrSet = new Set(substr);
    let dis = 0;
    for (const char of str) {
        if (!substrSet.has(char)) {
            dis++
        }
    }
    return 1 - dis / str.length

}