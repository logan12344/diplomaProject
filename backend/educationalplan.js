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
