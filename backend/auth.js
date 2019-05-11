jwt = require('jsonwebtoken');
token_config = require('./token_config.json');

exports.exec = (method, params) => {
    switch (method){
        case 'signin':
            return SignIn(params);
        case 'signup':
            return SignUp(params);    
        case 'logout':
            return LogOut(params);    
        default:
            return {error: true,  result: 'Method not found'};
    }
}

function SignIn(params){
    if (params && params.login)
    {
        token = jwt.sign({user: params.login},token_config.secret);
        return {error: false, result: {token: token}};
    }
    return {error: true, result: 'Wrong login or password'};
}

function SignUp(params){
    if (params)
    return params;
    return {error: true, result: 'Wrong login or password'};
}

function LogOut(params){
    if (params)
    return params;
    return {error: true, result: 'Wrong login or password'};
}