let values = '123';
let validator = false;
let defaultValue='1'
const _validator = values || validator
? (val) => {
    let valid = false;
    let allowedValues = [];
    if (values) {
        allowedValues = [...values, defaultValue];
        valid || (valid = allowedValues.includes(val));
    }
    if (validator)
        valid || (valid = validator(val));
    if (!valid && allowedValues.length > 0) {
        // debugWarn(`Vue warn`, `Invalid prop: Expected one of (${allowedValues.join(', ')}), got value ${val}`);
    }
    return valid;
}
: undefined;
console.log(_validator())