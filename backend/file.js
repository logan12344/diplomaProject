const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');
const uuid = require('uuid/v4');

exports.exec = (method, params, files, db, callback) => {
    switch (method){
        case 'upload':
            Upload(params, files, db, callback);
            break;
        case 'download':
            Download(params,db,callback); 
            break; 
        case 'list':
            List(params,db,callback);  
            break;
        case 'delete':
            Delete(params,db,callback);  
            break;
        case 'edit':
            Edit(params,db,callback);  
            break;     
        default:
            callback.status(404).end();
            break;
    }
}

function Upload(params, files, db, callback){
    if (!(params && params.token && files && files.uploadFiles)){
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

            if(files.uploadFiles[0]) {
                for (let i = 0; i < files.uploadFiles.length; i++){
                    save_file(uuid(), files.uploadFiles[i], params, decoded, db);
                }
    
                callback.end();
                return;
            }
    
            save_file(uuid(), files.uploadFiles, params, decoded, db);
            callback.end();
        });    
    });
}

function save_file (new_name, file, params, decoded, db){
    file.mv('d:\\files\\'+decoded.uid+'\\'+new_name, (error) => {
        if (error){
            console.error(error);
            return;
        }

        db.query('INSERT INTO method_materials(teacher_id, file_name, description, public, tmp_name) VALUES ($1, $2, $3, $4, $5)',
        [decoded.tid, file.name, params.desc ? params.desc : '', params.public ? params.public : false, new_name], 
        (error, results) => {
            if (error){
                console.error(error);
                return;
            }
        });
    });
}

function List(params, db, callback){
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

            db.query('SELECT method_mat_id, file_name, description, public\
             FROM method_materials WHERE teacher_id = $1',
            [decoded.tid], (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error list files'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'files not found'}).end();
                    return;
                }

                callback.json({error: false, result: results.rows}).end();
                return;
            });
        });

    });
}

function Download(params, db, callback){
    if (!(params && params.token && params.file_id)){
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

            db.query('SELECT user_id, tmp_name, file_name \
             FROM method_materials, users WHERE method_materials.method_mat_id = $1 AND \
             (method_materials.teacher_id = $2 OR method_materials.public) AND \
             method_materials.teacher_id = users.teacher_id ',
            [params.file_id, decoded.tid], (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error list files'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'files not found'}).end();
                    return;
                }

                callback.download('d:\\files\\'+results.rows[0].user_id+'\\'+results.rows[0].tmp_name,results.rows[0].file_name);    
                return;
            });
        });

    });
}

function Delete(params, db, callback){
    if (!(params && params.token && params.file_id)){
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

            db.query('DELETE FROM method_materials WHERE method_materials.method_mat_id = $1 AND \
             method_materials.teacher_id = $2 ',
            [params.file_id, decoded.tid], (error, results) =>{
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
    if (!(params && params.token && params.file_id && params.name && params.desc && params.public)){
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

            db.query('UPDATE method_materials \
             SET file_name = $3, description = $4, public = $5 \
             WHERE method_materials.method_mat_id = $1 AND \
             method_materials.teacher_id = $2 ',
            [params.file_id, decoded.tid, params.name, params.desc, params.public], (error, results) =>{
                if (error){
                    console.error(error);
                    callback.json({error: true,  result: 'Error list files'}).end();
                    return;
                }

                if (results.rowCount == 0) {
                    callback.json({error: true,  result: 'files not found'}).end();
                    return;
                }

                callback.download('d:\\files\\'+results.rows[0].user_id+'\\'+results.rows[0].tmp_name,results.rows[0].file_name);    
                return;
            });
        });
    });
}