const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');

exports.exec = (method, params, db, callback) => {
    switch (method){
        case 'get':
            Get(params,db,callback);
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

function Get(params,db,callback){
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

            db.query('SELECT teachers_list.pib, subjects.name, \
            individual_plan.num_lec_hours, individual_plan.num_prac_hours, \
            individual_plan.num_lab_hours, individual_plan.num_indep_hours, \
            individual_plan.num_indiv_hours FROM individual_plan, teachers_list, subjects WHERE \
            teachers_list.teacher_id = individual_plan.teacher_id AND \
            individual_plan.subject_id = subjects.subject_id',
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

            db.query('DELETE FROM individual_plan WHERE individual_plan.individ_plan_id = $1',
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

                callback.json({error: false, result: 'Delete successful'}).end();
                return;    
            });
        });

    });
}

function Edit(params, db, callback){
    if (!(params && params.token && params.id && params.tid, params.sid, params.lec, 
        params.prac, params.lab, params.indep, params.indiv)){
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

            db.query('UPDATE individual_plan \
             SET teacher_id = $2, subject_id = $3, num_lec_hours = $4, num_prac_hours = $5,\
             num_lab_hours = $6, num_indep_hours = $7, num_indiv_hours = $8 \
             WHERE individual_plan.individ_plan_id = $1',
            [params.id, params.tid, params.sid, params.lec, params.prac, 
                params.lab, params.indep, params.indiv], (error, results) =>{
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

function Add(params, db, callback){
    if (!(params && params.token && params.id && params.tid, params.sid, params.lec, 
        params.prac, params.lab, params.indep, params.indiv)){
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

            db.query('INSERT INTO individual_plan( teacher_id, subject_id,\
             num_lec_hours, num_prac_hours, num_lab_hours, num_indep_hours, num_indiv_hours)\
             VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [params.tid, params.sid, params.lec, params.prac, 
                params.lab, params.indep, params.indiv], (error, results) =>{
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