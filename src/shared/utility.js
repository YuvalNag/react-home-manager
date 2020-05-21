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
    return arr[0] && arr.reduce((rv, x) => {
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
// export const levenshtein_distance_b = (s, t) => {
//     if (!s.length) return t.length;
//     if (!t.length) return s.length;

//     return Math.min(
//         levenshtein_distance_b(s.substr(1), t) + 1,
//         levenshtein_distance_b(t.substr(1), s) + 1,
//         levenshtein_distance_b(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
//     );
// }

export const checkValidity = (updatedValue, inputId, controls) => {
    const formValidator = (formControls) => {
        let formIsValid = true
        for (const key in formControls) {
            formIsValid = formIsValid && formControls[key].valid && formControls[key].touched
        }
        return formIsValid
    }
    const elementValidator = (value, validationRules) => {
        const validatePassword = (password) => {
            var re = /^[A-Za-z]\w{7,14}$/
            return re.test(password)
        }
        const validateEmail = (email) => {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        }
        let isValid = true
        let validationError = null
        if (validationRules.required) {
            isValid = isValid && value.trim() !== ''
            if (!isValid) {
                validationError = "This field is required!"
            }
        }
        if (validationRules.between) {
            isValid = isValid && value.trim().length >= validationRules.between[0] && value.trim().length <= validationRules.between[1]
            if (!isValid) {
                if (value.trim().length > validationRules.between[1])
                    validationError = "This field is too long!"
                if (value.trim().length < validationRules.between[0])
                    validationError = "This field is too short!"
            }
        }
        if (validationRules.isPassword) {
            isValid = isValid && validatePassword(value)
            if (!isValid) {
                validationError = "This password is not strong enough!"
            }
        }
        if (validationRules.isEmail) {
            isValid = isValid && validateEmail(value)
            if (!isValid) {
                validationError = "This email is not valid!"
            }
        }
        return { isValid: isValid, validationError: validationError }
    }
    const { isValid, validationError } = elementValidator(updatedValue, controls[inputId].validationRules)
    const updatedFromElement = updateObject(controls[inputId], {
        value: updatedValue,
        valid: isValid,
        touched: true,
        validationError: validationError
    })
    const updatedFrom = updateObject(controls, { [inputId]: updatedFromElement })
    const formIsValid = formValidator(updatedFrom)
    return { updatedFrom, formIsValid }
}