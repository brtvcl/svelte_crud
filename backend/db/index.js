import mysql from "mysql";
import fs from "fs";

const pool = mysql.createPool({
    connectionLimit:10,
    password:"1544",
    user:"root",
    database:"machine_db",
    host:"localhost",
    port:"3306",
    multipleStatements: true
});

mysql.createConnection

let db = {};

db.all = () => {
    return new Promise(async(resolve, reject)=>{
        
        let machines;
        let files;
        let nested_response;
        try {
             machines = await db.all_machines();
            files = await db.files_all();
            nested_response = [];
        } catch (err) {
            if (err) {
                return reject(err);
            }
        };
        
        machines.forEach((machine,i) => {
            machine.files = [];
            nested_response.push(machine);

            files.forEach(file => {
                if ( file.machine_id == machine.id) {
                    nested_response[i].files.push(file);
                };
            });
        });
        return resolve(nested_response);
    });
};

db.all_machines = () => {
    return new Promise((resolve, reject)=>{
        pool.query("SELECT * FROM machine_db.tbl_machines;",(err,results)=>{
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    });
};

db.insert = (name) => {
    return new Promise((resolve, reject)=>{
        pool.query(`INSERT INTO machine_db.tbl_machines (name) VALUES ('${name}');`,(err,results)=>{
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    });
};

db.update = (name, id) => {
    return new Promise((resolve, reject)=>{
        pool.query("UPDATE `machine_db`.`tbl_machines` SET `name` = ? WHERE (`id` = ?);",[name,id],(err, results)=>{
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    });
}

db.delete = (id) => {
    return new Promise(async(resolve, reject)=>{
        await db.file_delete_machine(id);


        pool.query("DELETE FROM `machine_db`.`tbl_machines` WHERE (`id` = ?);",[id],(err, results)=>{
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    })
};

db.file_insert = (machine_id, file_name) => {
    return new Promise((resolve, reject)=>{
        pool.query("INSERT INTO `machine_db`.`tbl_machines_files` (`machine_id`, `file_path`) VALUES (?, ?);", [machine_id, file_name], (err, results) => {
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    });
};

db.file_delete_single = (file_id) => {
    return new Promise(async(resolve, reject)=>{
        let file_read = await db.file_read_single(file_id);
        
        let file_path = file_read[0].file_path;
        pool.query("DELETE FROM `machine_db`.`tbl_machines_files` WHERE (`id` = ?);", [file_id], (err, results)=>{
            if (err) {
                return reject(err);
            };
            fs.unlink(`./uploads/${file_path}`, (err)=>{
                if (err) {
                    return reject(err);
                }
            });
            return resolve(results);
        });
    });
};

db.file_delete_machine = (machine_id) => {
    return new Promise(async(resolve, reject)=>{
        let file_paths = await db.files_of_machine(machine_id);
        for (let i = 0; i < file_paths.length; i++) {
            const file = file_paths[i];     
            fs.unlink(`./uploads/${file_paths[i].file_path}`, (err)=>{
                if (err) {
                    return reject(err);
                }
            });     
        };


        pool.query("DELETE FROM `machine_db`.`tbl_machines_files` WHERE (`machine_id` = ?);", [machine_id], (err, results)=>{
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    });
};

db.files_all = () => {
    return new Promise((resolve, reject)=> {
        pool.query("SELECT * FROM machine_db.tbl_machines_files", (err, results)=>{
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    });
};

db.files_of_machine = (machine_id) => {
    return new Promise((resolve, reject)=>{
        pool.query("SELECT * FROM machine_db.tbl_machines_files WHERE (machine_id = ?);", [machine_id], (err, results)=>{
            if (err) {
                return reject(err);
            };
            return resolve(results);
        });
    });
};

db.file_read_single = (file_id)=>{
    return new Promise((resolve, reject)=>{
        pool.query("SELECT * FROM machine_db.tbl_machines_files WHERE (id = ?)",[file_id],(err, results)=>{
            if (err) {
                return reject(err);
            } 
            return resolve(results);
        });
    });
};

export default db;