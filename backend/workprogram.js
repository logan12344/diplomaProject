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
            /*
            SELECT work_program.work_prog_id, work_program.edu_plan_id, work_program.specialty_code,\
            teachers_list.pib, json_agg(lectures.*) as lectures  FROM  work_program, teachers_list, lectures\
            WHERE work_program.teacher_id = teachers_list.teacher_id AND\
            lectures.lecture_id = ANY (work_program.lectures_id) GROUP BY work_program.work_prog_id, teachers_list.pib
            */



            db.query('SELECT work_program.work_prog_id, work_program.edu_plan_id, work_program.specialty_code,\
            teachers_list.pib, json_agg(lectures_u.*) as lectures FROM  work_program, teachers_list,\
            (SELECT lectures.lecture_id, lectures.topic, lectures.type,\
            lectures.work_content, json_agg(method_materials.*) as method_mat,\
            lectures.control_type, lectures.total_points FROM lectures, method_materials WHERE\
            method_materials.method_mat_id = ANY (lectures.method_mat_ids) GROUP BY lectures.lecture_id ) as lectures_u\
            WHERE work_program.teacher_id = teachers_list.teacher_id AND\
            lectures_u.lecture_id = ANY (work_program.lectures_id) GROUP BY work_program.work_prog_id, teachers_list.pib',
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
