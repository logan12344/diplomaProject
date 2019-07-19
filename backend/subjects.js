const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');

exports.exec = (method, params, db, callback) => {
    switch (method){
        case 'get':
            get(params,db,callback);
            break;
        case 'delete':
            Delete(params,db,callback);
            break;
        case 'edit':
            Edit(params,db,callback);
            break;
        case 'add':
            Add(params,db,callback);
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
            subjects.work_prog_file_id, method_materials.file_name FROM subjects, teachers_list, method_materials \
            WHERE subjects.teacher_id = teachers_list.teacher_id AND \
            method_materials.method_mat_id = subjects.work_prog_file_id',
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

function Delete(params, db, callback){
    if (!(params && params.token && params.id)){
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

            db.query('DELETE FROM subjects WHERE subjects.subject_id = $1',
            [params.id], (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error delete file'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'Alredy deleted'}).end();
                    return;
                }

                get(params,db,callback);
                return;    
            });
        });

    });
}

function Edit(params, db, callback){
    if (!(params && params.token && params.id && params.name && params.selective && params.lec &&
         params.prac && params.lab && params.indep && params.indiv && params.project &&
         params.exam && params.plan && params.term && params.tid && params.fid)){
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

            db.query('UPDATE subjects \
             SET name = $2, selective = $3, num_lec_hours = $4, num_prac_hours = $5,\
             num_lab_hours = $6, num_indep_hours = $7, num_indiv_hours = $8, project = $9, \
             exam = $10, edu_plan_id = $11, term = $12, teacher_id = $13, work_prog_file_id = $14 \
             WHERE subjects.subject_id = $1',
            [params.id, params.name, params.selective, params.lec, params.prac, params.lab,
                params.indep, params.indiv, params.project, params.exam, params.plan, params.term,
                params.tid, params.fid], (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error list files'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'files not found'}).end();
                    return;
                }
                
                get(params,db,callback);
                return;
            });
        });
    });
}

function Add(params, db, callback){
    if (!(params && params.token && params.name && params.selective && params.lec &&
        params.prac && params.lab && params.indep && params.indiv && params.project &&
        params.exam && params.plan && params.term && params.tid && params.fid)){
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

            db.query('INSERT INTO subjects(name, selective, num_lec_hours, num_prac_hours,\
                num_lab_hours, num_indep_hours, num_indiv_hours, project, \
                exam, edu_plan_id, term, teacher_id, work_prog_file_id)\
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
            [params.name, params.selective, params.lec, params.prac, params.lab, params.indep,
                params.indiv, params.project, params.exam, params.plan, params.term,
                params.tid, params.fid], (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error list files'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'files not found'}).end();
                    return;
                }
                
                get(params,db,callback);
                return;
            });
        });
    });
}