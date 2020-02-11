
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
