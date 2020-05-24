function groupBy(array, path) {
    const result = {}
    for (item of array) {
        if (!Array.isArray(result[accessByPath(item, path)])) {
            result[accessByPath(item, path)] = []
        }
        result[accessByPath(item, path)].push(item)

    }
    return result
}

function keyBy(array, path) {
    const result = {}
    for (item of array) {

        result[accessByPath(item, path)] = item

    }
    return result
}

function accessByPath(obj, path, val) {
    let parts = path.split('.'),
        depth = parts.length,
        setter = (typeof val !== "undefined") ? true : false;

    return parts.reduce(function (o, key, i) {
        if (setter && (i + 1) === depth) {
            if (typeof o[key] === "object" && typeof val === "object") {
                Object.assign(o[key], val);
            } else {
                o[key] = val;
            }
        }
        return key in o ? o[key] : {};
    }, obj);
}


function serializeToJson(form) {
    return $(form).serializeArray().reduce((acc, val) => {
        acc[val.name] = val.value
        return acc
    }, {})

}
