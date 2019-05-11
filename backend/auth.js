const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');
const uuid = require('uuid/v4');

exports.exec = (method, params, db, callback) => {
    switch (method){
        case 'signin':
            SignIn(params,db,callback);
            break;
        case 'signup':
            SignUp(params,callback); 
            break;   
        case 'logout':
            LogOut(params,db,callback);  
            break;  
        default:
            callback.json({error: true,  result: 'Method not found'});
            break;
    }
}

function SignIn(params,db,callback){
    if (params && params.login && params.passwd)
    {
        db.query('SELECT user_id FROM users WHERE user_login = $1 AND user_passwd = $2',
        [params.login, params.passwd], (error, results) =>{
            if (error) {
                callback.json({error: true, result: 'Wrong login or password'});
            } else {
                session = uuid();
                db.query('INSERT INTO active_sessions(user_id, session_id) VALUES ($1,$2)',
                [results.rows[0].user_id, session], (error, results) => {
                    if (error){
                        console.log(error.error);
                        callback.json({error: true,  result: 'Error SignIn'});
                    } else {
                        token = jwt.sign({user_id: session},token_config.secret);
                        callback.json({error: false, result: {token: token}});
                    }
                });
            }
        });
    }
    else
    callback.json({error: true, result: 'Wrong login or password'});
}

function SignUp(params,callback){
    if (params)
    callback.json(params);
    callback.json({error: true, result: 'Wrong login or password'});
}

function LogOut(params,db,callback){
    if (params && params.token)
    {
        data = jwt.verify(params.token, token_config.secret);
        db.query('DELETE FROM active_sessions WHERE session_id = $1', [data.user_id],
        (error, results) =>{
            if (error){
                callback.json({error: true, result: 'Wrong token'});
            } else
            callback.json({error: false, result: ''});
        });
    }
    else
    callback.json({error: true, result: 'Token not found'});
}