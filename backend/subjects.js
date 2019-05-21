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

            //if (decoded.permit > 1 && params.tid)
               // decoded.tid = params.tid

            db.query('SELECT subjects.subject_id, subjects.name, subjects.selective,\
            subjects.num_lec_hours, subjects.num_prac_hours, subjects.num_lab_hours,\
            subjects.num_indep_hours, subjects.num_indiv_hours, subjects.project,\
            subjects.exam, subjects.edu_plan_id, subjects.term, teachers_list.pib ,\
            subjects.work_prog_file_id FROM subjects, teachers_list \
            WHERE subjects.teacher_id = teachers_list.teacher_id',
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
