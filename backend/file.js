const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');
const uuid = require('uuid/v4');

exports.exec = (method, params, files, db, callback) => {
    switch (method){
        case 'upload':
            Upload(params, files, db, callback);
            break;
        /*case 'download':
            Download(params,db,callback); 
            break;   
        case 'list':
            List(params,db,callback);  
            break;  */
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