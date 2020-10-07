module.exports.registerErrorsHandler = (err) => {
    let error = {
        email: '',
        password: '',
        name: '',
        surname: '',
        city: '',
        birth: ''
    }

    // Duplicate email error code
    if (err.code == 11000)
        error.email = "Adres email jest już zajęty."

    // validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.error).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }

    return error;
}