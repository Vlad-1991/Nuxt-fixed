import type {arrInfoType, fieldType} from "@/utils/types/requestTypes";

/* validation of any text, phone input field, field cant be empty and must be valid by own RegExp pattern.
 If field activated once, then validation will be present */
export const validateField = (field: fieldType): void => {
    if (field.val !== '') {
        field.activated = true
        field.valid = false
    }
    if (field.val === '' && field.activated) {
        field.error = 'Field cant be empty'
        field.valid = false
    }
    if (field.val !== '' && field.activated && !(field.pattern.test(field.val))) {
        field.error = field.errorText
        field.valid = false
    }
    if (field.activated && (field.pattern.test(field.val))) {
        field.error = ''
        field.valid = true
    }
}

/* validation of checkbox - field must be selected */
export const validateChecked = (infoArr: arrInfoType[], index: number): void => {
    infoArr[index].valid = infoArr[index].val !== '';
}


/* validation of text field - must be not empty, tested by RegExp pattern */
export function validateFieldWithIndex(infoArr: arrInfoType[], index: number): void {

    let pattern: RegExp | undefined = infoArr[index].pattern

    if (infoArr[index].val !== '') {
        infoArr[index].activated = true
        infoArr[index].valid = false
    }
    if (infoArr[index].val === '' && infoArr[index].activated) {
        infoArr[index].error = 'Field cant be empty'
        infoArr[index].valid = false
    }
    if (infoArr[index].val !== '' && infoArr[index].activated && pattern) {

        if (!pattern.test(infoArr[index].val)) {
            infoArr[index].error = infoArr[index].errorText
            infoArr[index].valid = false
        }

    }
    if (infoArr[index].activated && pattern) {

        if (pattern.test(infoArr[index].val)) {
            infoArr[index].error = ''
            infoArr[index].valid = true
        }

    }
}

/* to check if all fields is valid to return true to enable Sign In button */
export const checkAllFields = (arrInfo: Array<arrInfoType>): boolean => {

    let validCount: number = 0
    arrInfo.forEach((el: arrInfoType): void => {
        if (el.valid) {
            validCount++
        }
    })
    return validCount === arrInfo.length;
}