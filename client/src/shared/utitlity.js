
export const updateObject= (state, updatedProperties) => {
    return {
        ...state,
        ...updatedProperties
    }
};

export const checkValidity = (value, rules) => {
    let isValid = true;

    if (rules.required){
        isValid= value.trim() !== "" && isValid; // trim() method is used to remove white spaces...
        // this is to make sure no field is empty
        // if the check is not equal(meaning that the input value is not null) then the check will return true
        //console.log(isValid, 'required')
    }
    if (rules.maxLength){
        isValid = value.length <= rules.maxLength && isValid;
        //console.log(isValid, 'maxLength');
    }
    if (rules.minLength){
        isValid = value.length >= rules.minLength && isValid;
        //console.log(isValid, 'minLength');
    }
    if (rules.isANumber){
        isValid = !isNaN(value) && isValid;
    }
    if (rules.isEmail){ // eslint-disable-next-line
        const pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; // regular expression for email addresse
        isValid = pattern.test(value) && isValid;
    }
    if(rules.special){
        const regularExpression = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}/;
         isValid = regularExpression.test(value);
    }

    return isValid;
}