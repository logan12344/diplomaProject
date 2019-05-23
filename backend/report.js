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

            db.query('SELECT reports.report_id, teachers_list.pib, to_list.pib \
              FROM  teachers_list, teachers_list as to_list, reports, method_materials WHERE \
              teachers_list.teacher_id = reports.report_from AND \
              to_list.teacher_id = reports.report_to AND\
              reports.file_id = method_materials.method_mat_id',
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

            db.query('DELETE FROM reports WHERE reports.report_id = $1',
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

function Add(params, db, callback){
    if (!(params && params.token && params.work_exp && params.acad_status && params.position &&
        params.dep_id && params.pib && params.degree && params.contact_info &&
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

            db.query('INSERT INTO reports(report_from, report_to, file_id)\
             VALUES ($1, $2, $3,)',
            [params.from, params.to, params.file_id],
                (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error list files'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'files not found'}).end();
                    return;
                }
                
                callback.json({error: false, result: 'Updated successful'}).end();
                return;
            });
        });
    });
}