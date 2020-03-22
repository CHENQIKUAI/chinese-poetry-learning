
exports.getFuzzyMatchingFilterObj = (filterObj) => {
    let findObj = {};

    Object.keys(filterObj).map((item) => {
        const propertyName = item;
        const propertyValue = filterObj[propertyName];

        if (typeof propertyValue === "string" && propertyValue.length !== 0) {
            findObj = {
                ...findObj,
                [propertyName]: new RegExp(propertyValue, "g"),
            }
        } else if (typeof propertyValue === "number") {
            findObj = {
                ...findObj,
                [propertyName]: propertyValue,
            }
        } else if (Array.isArray(propertyValue)) {
            findObj = {
                ...findObj,
                [propertyName]: { $in: propertyValue },
            }
        }
    })

    return findObj;
}


exports.getMatchingFilterObj = (filterObj) => {
    let findObj = {};

    Object.keys(filterObj).map((item) => {
        const propertyName = item;
        const propertyValue = filterObj[propertyName];

        if (typeof propertyValue === "string" && propertyValue.length !== 0) {
            switch (propertyName) {
                case "type":
                    findObj = {
                        ...findObj,
                        "type": { $in: propertyValue.split(/\s|，/) }
                    }
                    break;
                default:
                    findObj = {
                        ...findObj,
                        [propertyName]: new RegExp(propertyValue, "g"),
                    }
                    break;
            }

        } else if (typeof propertyValue === "number") {
            findObj = {
                ...findObj,
                [propertyName]: propertyValue,
            }
        } else if (Array.isArray(propertyValue)) {
            findObj = {
                ...findObj,
                [propertyName]: { $in: propertyValue },
            }
        }
    })

    return findObj;
}


exports.getPoetrySearchFilterObj = (value) => {

    if (!value) {
        return {};
    }

    value = value.trim();

    const replacedValue = (value + "").replace(' ', '.*');
    const title = new RegExp(replacedValue, 'g');
    const dynasty = new RegExp(value, 'g');
    const writer = new RegExp(value, 'g');
    const content = new RegExp(replacedValue, 'g');
    const type = { $in: value.split(' ') }
    return {
        $or: [
            { title },
            { dynasty },
            { writer },
            { content },
            { type }
        ]
    }
}
