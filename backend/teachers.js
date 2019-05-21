const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');

exports.exec = (method, params, db, callback) => {
    switch (method){
        case 'get':
            get(params,db,callback);
            break;
        case 'create':
            create(params,db,callback);
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

            //if (decoded.permit > 1 && params.tid)
               // decoded.tid = params.tid

            db.query('SELECT teachers_list.teacher_id, teachers_list.work_exp, teachers_list.academic_status, \
            teachers_list.position, teachers_list.department_id, teachers_list.pib, \
            teachers_list.degree, teachers_list.contact_info, teachers_list.biography, \
            teachers_list.photo, array_agg(subjects.name) as discipline  FROM  teachers_list, subjects WHERE \
            subjects.subject_id = ANY (teachers_list.discipline) GROUP BY teachers_list.teacher_id',
            [], (error, results) =>{
                if (error) {
                    console.error("SELECT: ", error);
                    callback.json({error: true, result: 'Error get teachers list'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true, result: 'teachers list empty'}).end();
                    return;
                }
            
                callback.json({error: false, result: results.rows}).end();
            });

        });
    });
}

function create(params,db,callback){
    if (!(params && params.token)){
        callback.json({error: true, result: 'Wrong params'}).end();
        return;
    }

    
}