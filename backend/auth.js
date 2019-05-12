const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');
const uuid = require('uuid/v4');

exports.exec = (method, params, db, callback) => {
    switch (method){
        case 'signin':
            SignIn(params,db,callback);
            break;
        case 'signup':
            SignUp(params,db,callback); 
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
    if (!(params && params.login && params.passwd)){
        callback.json({error: true, result: 'Wrong login or password'});
        return;
    }
    
    db.query('SELECT users.user_id, teachers_list.pib  FROM users, teachers_list WHERE user_login = $1 AND user_passwd = $2 AND users.teacher_id = teachers_list.teacher_id',
    [params.login, params.passwd], (error, results) =>{
        if (error) {
            console.log("SELECT: "+ error);
            callback.json({error: true, result: 'Error SignIn'});
            return;
        }

        if (results.rowCount == 0) {
            callback.json({error: true, result: 'Wrong login or password'});
            return;
        }

        session = uuid();
        pib = results.rows[0].pib;
        db.query('INSERT INTO active_sessions(user_id, session_id) VALUES ($1,$2)',
        [results.rows[0].user_id, session], (error, results) => {
            if (error){
                console.log(error);
                callback.json({error: true,  result: 'Error SignIn'});
                return;
            }
                
            jwt.sign({user_id: session},token_config.secret, (error, token) => {
                if (error){
                    console.log(error);
                    callback.json({error: true,  result: 'Error SignIn'});
                    return;
                }

                callback.json({error: false, result: {token: token, pib: pib}});
                return;
            });
        });
    });
}

function SignUp(params,db,callback){
    if (!(params && params.login && params.passwd && params.teach_id)){
        callback.json({error: true, result: 'Wrong login or password or teacher id'});
        return;
    }
        
    db.query('SELECT user_id, teacher_id  FROM users WHERE user_login = $1 OR users.teacher_id = $2',
    [params.login, params.teach_id], (error, results) =>{
        if (error) {
            console.log(error);
            callback.json({error: true,  result: 'Error creating user'});
            return;
        } 
        
        if (results.rowCount > 0) {
            if (results.rows[0].teacher_id == params.teach_id)
            {
                callback.json({error: true,  result: 'Such user alredy exsist'});
                return;
            }
            callback.json({error: true,  result: 'User name alredy exsist'});
            return;
        } 

        db.query('SELECT teacher_id  FROM teachers_list WHERE teacher_id = $1',
        [params.teach_id], (error, results) =>{
            if (error){
                console.log(error);
                callback.json({error: true,  result: 'Error creating user'});
                return;
            }

            if (results.rowCount == 0) {
                callback.json({error: true,  result: 'Pre-defind techer id not found'});
                return;
            }
            
            db.query('INSERT INTO users(user_login, user_passwd, teacher_id) VALUES ($1,$2,$3)',
            [params.login, params.passwd, params.teach_id], (error, results) =>{
                if (error){
                    console.log(error);
                    callback.json({error: true,  result: 'Error creating user'});
                    return;
                }
            
                SignIn(params,db,callback);
            });
        });
    });
}

function LogOut(params,db,callback){
    if (!(params && params.token)) {
        callback.json({error: true, result: 'Token not found'});
        return;
    }
        
    jwt.verify(params.token, token_config.secret, (error, decoded) => {
        if (error){
            console.log(error);
            callback.json({error: true, result: 'Wrong token'});
            return;
        }

        db.query('DELETE FROM active_sessions WHERE session_id = $1', [decoded.user_id],
        (error, results) =>{
            if (error){
                console.log(error);
                callback.json({error: true, result: 'Error log out'});
                return;
            }
        
            if (results.rowCount == 0){
                callback.json({error: true, result: 'Alredy log out'});
                return;
            }
        
            callback.json({error: false, result: 'Log out successful'});
            return;
        });

    });
}