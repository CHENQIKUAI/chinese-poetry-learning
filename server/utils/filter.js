
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

            // findObj = {
            //     ...findObj,
            //     [propertyName]: propertyValue,
            // }
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
    // const type = null, type待定
    return {
        $or: [
            { title },
            { dynasty },
            { writer },
            { content },
        ]
    }
}
