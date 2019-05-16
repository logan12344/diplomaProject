const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');

exports.exec = (method, params, db, callback) => {
    switch (method){
        case 'getsessions':
            GetSessions(params,db,callback);
            break;
        case 'closesession':
            CloseSession(params,db,callback);
            break;
        default:
            callback.status(404).end();
            break;
    }
}

function GetSessions(params,db,callback){
    if (!(params && params.token)){
        callback.json({error: true, result: 'Wrong params'}).end();
        return;
    }

    jwt.verify(params.token, token_config.secret, (error, decoded) => {
        if (error){
            console.error(error);
            callback.json({error: true, result: 'Wrong token'}).end();
            return;
        }
        
        db.query('SELECT * FROM active_sessions WHERE user_id = $1 AND session_id = $2',
        [decoded.uid, decoded.sid], (error, results) => {
            if (error){
                console.error(error);
                callback.json({error: true,  result: 'Error SignIn'}).end();
                return;
            }

            if (results.rowCount == 0) {
                callback.json({error: true, result: 'Token expired'}).end();
                return;
            }

            db.query('SELECT session_id, (session_id = $2) as current FROM active_sessions WHERE user_id = $1',
            [decoded.uid, decoded.sid], (error, results) =>{
            if (error) {
                console.error("SELECT: ", error);
                callback.json({error: true, result: 'Error get teachers list'}).end();
                return;
            }

            if (results.rowCount == 0) {
                callback.json({error: true, result: 'How did u get it?'}).end();
                return;
            }
            
            callback.json({error: false, result: results.rows}).end();
        });

        });
    });
}

function CloseSession(params,db,callback){
    if (!(params && params.token && params.session_id)){
        callback.json({error: true, result: 'Wrong params'}).end();
        return;
    }

    jwt.verify(params.token, token_config.secret, (error, decoded) => {
        if (error){
            console.error(error);
            callback.json({error: true, result: 'Wrong token'}).end();
            return;
        }
        
        db.query('SELECT * FROM active_sessions WHERE user_id = $1 AND session_id = $2',
        [decoded.uid, decoded.sid], (error, results) => {
            if (error){
                console.error(error);
                callback.json({error: true,  result: 'Error SignIn'}).end();
                return;
            }

            if (results.rowCount == 0) {
                callback.json({error: true, result: 'Token expired'}).end();
                return;
            }

            db.query('DELETE FROM active_sessions WHERE user_id = $1 AND session_id = $2',
            [decoded.uid, params.session_id], (error, results) =>{
            if (error) {
                console.error("SELECT: ", error);
                callback.json({error: true, result: 'Error get teachers list'}).end();
                return;
            }
            
            GetSessions(params,db,callback);
        });

        });
    });
}
