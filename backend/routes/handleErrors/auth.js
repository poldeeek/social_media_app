module.exports.registerErrorsHandler = (err) => {
    let errors = {
        email: '',
        password: '',
        name: '',
        surname: '',
        city: '',
        birth: ''
    }

    // Duplicate email error code
    if (err.code == 11000)
        errors.email = "Adres email jest już zajęty."

    // validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}