const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');

exports.exec = (method, params, db, callback) => {
    switch (method){
        case 'get':
            get(params,db,callback);
            break;
        default:
            callback.status(404).end();
            break;
    }
}

function get(params,db,callback){
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

            if (decoded.permit > 1 && params.tid)
                decoded.tid = params.tid

            db.query('SELECT schedule.schedule_id, subjects.name, groups.group_name , schedule.lecture_id, schedule.audience, schedule.week, lecture_types.lecture_name, schedule.weekday FROM schedule, subjects, groups, lecture_types  WHERE schedule.teacher_id = $1 AND schedule.subject_id = subjects.subject_id AND groups.group_id = schedule.group_id AND schedule.lecture_type = lecture_types.lecture_type',
            [decoded.tid], (error, results) =>{
            if (error) {
                console.error("SELECT: "+ error);
                callback.json({error: true, result: 'Error get schedule'}).end();
                return;
            }

            if (results.rowCount == 0) {
                callback.json({error: true, result: 'Schedule not found'}).end();
                return;
            }
            
            callback.json({error: false, result: results.rows}).end();
        });

        });
    });
}
