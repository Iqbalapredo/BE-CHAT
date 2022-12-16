const db = require('../config/db');
const userModel = {
  listUser: (name) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT id, email, name, username, phone, description, image FROM users WHERE lower(name) LIKE LOWER('%${name}%')`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  updateProfile: (id, name, username, phone, description) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET name=$2, username=$3, phone=$4, description=$5 WHERE id=$1', [id, name, username, phone, description], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  updatePhoto: (id, image) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET image=$2 WHERE id=$1', [id, image], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  getPhoto: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT image FROM users WHERE id=$1', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  getDetailUser: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT id, email, name, username, phone, description, image FROM users WHERE id=$1', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};
module.exports = userModel;
