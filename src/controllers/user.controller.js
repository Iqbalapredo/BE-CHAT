const userModel = require('../models/user.model');
const chatModel = require('../models/chat.model');
const { success, failed } = require('../helpers/response');
const fs = require('fs');
const deleteFile = (path) => {
  // cek apakah file ada
  if (fs.existsSync(path)) {
    // delete file
    fs.unlinkSync(path);
  }
};

const userController = {
  list: (req, res) => {
    try {
      const name = req.query.name || '';
      const id = req.APP_DATA.tokenDecoded.id;
      userModel
        .listUser(name)
        .then(async (result) => {
          const data = await Promise.all(
            result.rows.map(async (item) => {
              const chat = await chatModel.listChat(id, item.id);
              const lastChat = chat.rowCount === 0 ? 'No Chat' : chat.rows[chat.rowCount - 1];
              const obj = {
                user: item,
                lastChat,
              };
              return obj;
            })
          );
          success(res, {
            code: 200,
            status: 'success',
            message: 'Get all user success',
            data,
          });
        })
        .catch((err) => {
          failed(res, {
            code: 500,
            status: 'failed',
            message: err.message,
            err: [],
          });
        });
    } catch (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: err,
      });
    }
  },
  updateProfile: (req, res) => {
    try {
      const { name, username, phone, description } = req.body;
      if (!name) {
        throw Error("Field 'Fullname' cannot be empty");
      }
      const id = req.APP_DATA.tokenDecoded.id;
      userModel
        .updateProfile(id, name, username, phone, description)
        .then(() => {
          success(res, {
            code: 200,
            status: 'success',
            message: 'Update profile success',
          });
        })
        .catch((err) => {
          failed(res, {
            code: 200,
            status: 'failed',
            message: err.message,
            error: [],
          });
        });
    } catch (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: err,
      });
    }
  },
  updateImage: async (req, res) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id;
      const image = req.file.filename;
      const checkPhoto = await userModel.getPhoto(id);
      const getPhoto = checkPhoto.rows[0].image;
      if (getPhoto !== 'profile-default.png') {
        deleteFile(`./public/${getPhoto}`);
      }
      userModel
        .updatePhoto(id, image)
        .then(() => {
          success(res, {
            code: 200,
            status: 'success',
            message: 'Profile photo updated successfully',
            data: [],
          });
        })
        .catch((err) => {
          failed(res, {
            code: 500,
            status: 'failed',
            message: err.message,
            error: [],
          });
        });
    } catch (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: err,
      });
    }
  },
  myProfile: (req, res) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id;
      userModel
        .getDetailUser(id)
        .then((result) => {
          if (!result.rowCount) {
            failed(res, {
              code: 500,
              status: 'failed',
              message: 'Failed get data (user not found)',
              error: [],
            });
          } else {
            success(res, {
              code: 200,
              status: 'success',
              message: 'get my profile success',
              data: result.rows,
            });
          }
        })
        .catch((err) => {
          failed(res, {
            code: 500,
            status: 'failed',
            message: err.message,
            error: [],
          });
        });
    } catch (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: err,
      });
    }
  },
  Profile: (req, res) => {
    try {
      const { id } = req.params;
      userModel
        .getDetailUser(id)
        .then((result) => {
          if (!result.rowCount) {
            failed(res, {
              code: 500,
              status: 'failed',
              message: 'Failed get data (user not found)',
              error: [],
            });
          } else {
            success(res, {
              code: 200,
              status: 'success',
              message: 'get data user success',
              data: result.rows,
            });
          }
        })
        .catch((err) => {
          failed(res, {
            code: 500,
            status: 'failed',
            message: err.message,
            error: [],
          });
        });
    } catch (err) {
      failed(res, {
        code: 500,
        status: 'error',
        message: err.message,
        error: err,
      });
    }
  },
};

module.exports = userController;
