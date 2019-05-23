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

            db.query('SELECT educational_plan.edu_plan_id, specialty.specialty_name, \
            educational_plan.approv_date, edu_quali.edu_quali_name, \
            edu_level.edu_level_name, edu_form.edu_form_name, \
            educational_plan.train_period, knowl_area.knowl_area_name \
            FROM educational_plan, specialty, edu_quali, edu_level, edu_form, knowl_area \
            WHERE educational_plan.specialty_code = specialty.specialty_id AND \
            educational_plan.edu_quali_id = edu_quali.edu_quali_id AND \
            educational_plan.edu_level_id = edu_level.edu_level_id AND \
            educational_plan.edu_form_id = edu_form.edu_form_id AND \
            educational_plan.knowl_area_id = knowl_area.knowl_area_id',
            [], (error, results) =>{
            if (error) {
                console.error("SELECT: ", error);
                callback.json({error: true, result: 'Error get educational plan'}).end();
                return;
            }

            if (results.rowCount == 0) {
                callback.json({error: true, result: 'educational plan empty'}).end();
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

            db.query('DELETE FROM educational_plan WHERE educational_plan.edu_plan_id = $1',
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
    if (!(params && params.token && params.id && params.sp_code && params.date && params.quali
        && params.level && params.form && params.period && params.area)){
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

            db.query('UPDATE educational_plan \
             SET specialty_code = $2, approv_date = $3, edu_quali_id = $4, edu_level_id = $5,\
             edu_form_id = $6, train_period = $7, knowl_area_id = $8 \
             WHERE individual_plan.individ_plan_id = $1',
            [params.id, params.sp_code, params.date, params.quali, params.level, 
                params.form, params.period, params.area], (error, results) =>{
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
    if (!(params && params.token && params.sp_code && params.date && params.quali
        && params.level && params.form && params.period && params.area)){
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

            db.query('INSERT INTO educational_plan( specialty_code, approv_date,\
             edu_quali_id, edu_level_id, edu_form_id, train_period, knowl_area_id)\
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