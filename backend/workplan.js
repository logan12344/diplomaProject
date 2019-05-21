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

            db.query('SELECT subjects.subject_id, subjects.name,\
            json_agg(lectures.*) as lectures FROM work_plan, subjects, \
            (SELECT subj_lectures.subj_lec_id, subj_lectures.lec_num, subj_lectures.topic, \
            subj_lectures.work_content, subj_lectures.control_type, subj_lectures.total_points, \
            lecture_types.lec_name FROM subj_lectures, lecture_types \
            WHERE subj_lectures.lec_type_id = lecture_types.lec_type_id \
            ORDER BY subj_lectures.lec_num ) as lectures  \
            WHERE lectures.subj_lec_id = ANY(work_plan.lecture_ids) AND \
            work_plan.subject_id = subjects.subject_id \
            GROUP BY subjects.subject_id \
            ORDER BY subjects.subject_id',
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
