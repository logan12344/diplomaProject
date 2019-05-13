const jwt = require('jsonwebtoken');
const token_config = require('./token_config.json');
const fs = require('fs');

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
        default:
            callback.status(404).end();
            break;
    }
}

function Upload(params, files, db, callback){
    if (!(params && params.token && files && files.upload_files)){
        callback.json({error: true, result: 'Wrong params'}).end();
        return;
    }

    jwt.verify(params.token, token_config.secret, (error, decoded) => {
        if (error){
            console.error(error);
            callback.json({error: true, result: 'Wrong token'}).end();
            return;
        }

        if(files.upload_files[0]) {
            for (let i = 0; i < files.upload_files.length; i++){
                files.upload_files[i].mv('d:\\files\\'+decoded.uid+'\\'+files.upload_files[i].name, (error) => {
                    if (error){
                        console.error(error);
                        callback.json({error: true, result: 'Error save file'});
                        return;
                    }
                });
            }
        }

        console.log(files.upload_files[0]);
    });
}

function SignUp(params,db,callback){
    if (!(params && params.login && params.passwd && params.teach_id)){
        callback.json({error: true, result: 'Wrong login or password or teacher id'}).end();
        return;
    }
        
}

function LogOut(params,db,callback){
    if (!(params && params.token)) {
        callback.json({error: true, result: 'Token not found'}).end();
        return;
    }       
}