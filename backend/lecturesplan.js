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

            db.query('SELECT teachers_list.teacher_id, teachers_list.pib,\
            json_agg(lectures_plan.*) as lectures\
            FROM teachers_list,\
            (SELECT lectures_plan.lec_plan_id, subj_lectures.subj_lec_id, subj_lectures.lec_num,\
             subj_lectures.topic, subj_lectures.work_content, subj_lectures.control_type,\
            lectures_plan.teacher_id, lectures_plan.report_date, subj_lectures.total_points,\
            lecture_types.lec_name, json_agg(method_materials.*) as method_mat \
             FROM lectures_plan, subj_lectures, lecture_types, \
             (SELECT teachers_list.pib, method_materials.method_mat_id,\
              method_materials.file_name, method_materials.description, method_materials.public,\
              method_materials.tmp_name FROM method_materials, teachers_list \
              WHERE teachers_list.teacher_id = method_materials.teacher_id) as method_materials\
            WHERE  method_materials.method_mat_id = ANY (lectures_plan.method_mat_ids) AND\
             subj_lectures.subj_lec_id = lectures_plan.subj_lec_id AND\
             subj_lectures.lec_type_id = lecture_types.lec_type_id\
            GROUP BY lectures_plan.lec_plan_id, subj_lectures.subj_lec_id, lecture_types.lec_type_id) as lectures_plan\
            WHERE lectures_plan.teacher_id  = teachers_list.teacher_id \
            GROUP BY teachers_list.teacher_id',
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
