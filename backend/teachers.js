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

            db.query('DELETE FROM teachers_list WHERE teachers_list.teacher_id = $1',
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
    if (!(params && params.token && params.id && params.work_exp && params.acad_status &&
        params.position && params.dep_id && params.pib && params.degree && params.contact_info &&
        params.discipline && params.biography && params.photo)){
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

            db.query('UPDATE teachers_list \
             SET work_exp = $2, academic_status = $3, position = $4, department_id = $5,\
             pib = $6, degree = $7, contact_info = $8, discipline = $9, \
             biography = $10, photo = $11 WHERE subjects.subject_id = $1',
            [params.id, params.work_exp, params.acad_status, params.position, params.dep_id,
                params.pib, params.degree, params.contact_info, params.discipline, params.biography,
                params.photo], (error, results) =>{
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
    if (!(params && params.token && params.work_exp && params.acad_status && params.position &&
        params.dep_id && params.pib && params.degree && params.contact_info &&
        params.discipline && params.biography)){
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

            db.query('INSERT INTO teachers_list(work_exp, academic_status, position, \
             department_id, pib, degree, contact_info, discipline, biography)\
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [params.work_exp, params.acad_status, params.position, params.dep_id, params.pib,
                params.degree, params.contact_info, params.discipline, params.biography, params.photo],
                (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error add teacher'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'Error add teacher'}).end();
                    return;
                }
                
                get(params,db,callback);
                return;
            });
        });
    });
}