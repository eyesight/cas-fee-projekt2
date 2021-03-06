'use strict';

const db = require('./dbconnection');
const ModelBase = require('./dbModelBase');
const crypto = require('crypto');
const cryptoUtil = require('../util/cryptoUtil');

const emailRGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
class UserRegister {
  constructor(email, password, isTeacher) {
    this.email = email;
    this.encrypted_password = cryptoUtil.hashPwd(password);
    this.is_teacher = isTeacher;
  }
}

class UserModel extends ModelBase {

  constructor(class_id, parent_surname, parent_forename, parent_gender, parent_language, child_surname, child_forename, child_gender, child_birthdate, adress, zip, place, tel_private, tel_office, is_approved, user_avatar) {
    super();
    this.class_id = class_id;
    this.parent_surname = parent_surname;
    this.parent_forename = parent_forename;
    this.parent_gender = parent_gender;
    this.parent_language = parent_language;
    this.child_surname = child_surname;
    this.child_forename = child_forename;
    this.child_gender = child_gender;
    this.child_date_of_birth = child_birthdate;
    this.adress = adress;
    this.zip = zip;
    this.place = place;
    this.tel_private = tel_private;
    this.tel_office = tel_office;
    this.is_active = 1;
    this.user_avatar = user_avatar;
  }
}

// create a user-object from a json-string
function UserFromJson(req) {
  var r = req.body;
  return new UserModel(
    r.class_id,
    r.parent_surname,
    r.parent_forename,
    r.parent_gender,
    r.parent_language,
    r.child_surname,
    r.child_forename,
    r.child_gender,
    r.child_date_of_birth,
    r.adress,
    r.zip,
    r.place,
    r.tel_private,
    r.tel_office,
    r.is_active,
    r.user_avatar
  );
}

function registerUser(email, passwort, isTeacher, req, updateUserFunc, callback) {
  if (!(email && passwort)) {
    callback("no user", null);
  }

  const user = new UserRegister(email, passwort, !!isTeacher);
  return db.query("Insert into users ( email, encrypted_password, is_teacher) values(?,?,?)", [user.email, user.encrypted_password, user.is_teacher], function (err, newDoc) {
    if (callback) {
      if (err) {
        console.log('registerUser: error: user exists already?' + err);
        callback(901, false);
        return;

      }
      const um = UserFromJson(req);
      if (updateUserFunc !== null) {
        console.log('registerUser: error?' + err);

        updateUserFunc(email, um, callback);
      } else {
        console.log('registerUser: error?' + err);
        callback(err, newDoc);
      }
    }
  });
}

function updatePassword(email, newPasswort, callback) {
  if (!(email && newPasswort)) {
    callback("no user", null);
    return;
  }

  const user = new UserRegister(email, newPasswort);

  return db.query("update users set  encrypted_password = ? where email = ?", [user.encrypted_password, user.email], function (err, newDoc) {
    if (callback) {
      callback(err, newDoc);
    }
  });
}

function updateAvatarFilename(email, filename, callback) {
  return db.query("update users set  avatar_filename = ? where email = ?", [filename, email], function (err, newDoc) {
    if (callback) {
      callback(err, newDoc);
    }
  });
}

function updateUser(email, userModel, callback) {

  var sf = userModel.mySqlGetUpdateStatement('users', "email='" + email + "'");

  return db.query(sf, userModel.getAttributeList(), function (err, newDoc) {

    if (callback) {
      if (err) {
        console.log('updateUser err:' + err)
      }
      console.log(err);
      callback(err, newDoc.affectedRows);
    }
  });
}
// callback(err, res)
// to reject request res must be false!
function register(req, callback) {
  const email = req.body.email;
  const password = req.body.pwd;
  const isTeacher = req.body.is_teacher;
  if (!(email && password)) {
    callback(false, false);
  }
  // check if proper email
  if (!emailRGX.test(email)) {
    console.log('register: email is wrong');
    callback(400, false);
    return;
  }

  this.registerUser(email, password, isTeacher, req, this.updateUser, function (err, doc) {
    callback(err, doc);
  });

}

function authenticate(email, password, callback) {
  if (!(email && password)) {
    callback(false);
    return;
  }
  this.getUserByEmail(email, function (err, doc) {
    if ((doc === null ) && !err) {
      callback('401', false);
    }
    else {
      callback(err, doc && doc[0].encrypted_password === cryptoUtil.hashPwd(password));
    }
  });
}

function getAllUserDetails(email, callback) {
  return db.query("select u.id,  u.email,u.class_id, u.parent_surname, u.parent_forename, u.parent_gender, u.parent_language, " +
    "u.child_surname, u.child_forename,u.child_gender, u.child_date_of_birth, u.adress, u.zip, u.place, u.tel_private, u.tel_office, u.is_teacher, " +
    "k.name klasse_name, k.description klasse_description, k.start_at klasse_start_at, k.end_at klasse_end_at, k.teacher_user_id teacher_user_id, " +
    "t.parent_surname teacher_surname, t.parent_forename teacher_forename, t.email teacher_email, t.zip teacher_zip, t.place teacher_place, t.tel_private teacher_tel_private, t.tel_office teacher_tel_office, t.parent_gender teacher_gender " +
    "from users u, klasses k, (select users.parent_surname, users.parent_forename, users.email, users.zip, users.place, users.tel_private, users.tel_office, users.parent_gender, users.id, users.is_teacher, " +
    "klasses.teacher_user_id, klasses.id class_id from users, klasses where klasses.teacher_user_id = users.id and users.is_teacher = 1) t " +
    "where ((u.class_id = k.id and t.class_id = u.class_id and COALESCE(NULL,u.is_teacher,0) = 0) " +
    "OR ( t.teacher_user_id = u.id AND u.is_teacher = 1 AND k.id = t.class_id)) and u.email=?", [email], function (err, newDoc) {
    if (callback) {
      if (newDoc) {
        if (newDoc.length <= 0) {
          newDoc = null;
          err = err || 'SQL no Result';
        }
        else {
          if (newDoc.length > 1) {
            err = 'SQL SEVERE ERROR: more than one entry for user.email:' + email;
          }
        }
      } else {
        err = 'SQL SEVERE ERROR: no resultset:' + email;
        newDoc = null;
      }
      if (newDoc) {
        callback(err, newDoc[0]);
      }
      else {
        console.log('getAllUserDetails:erro:' + err || -1);
        callback(err, false);
      }
    }
  });
}

function getUserByEmail(email, callback) {
  return db.query("select encrypted_password, email from users where email=?", [email], function (err, newDoc) {
    if (callback) {
      if (newDoc.length <= 0) {
        newDoc = null;
      }
      else {
        if (newDoc.length > 1) {
          err = 'SQL SEVERE ERROR: more than one entry for user.email:' + email;
        }
      }
      callback(err, newDoc);
    }
  });
}

function getUserAuthorizationInfos(email, callback) {
  return db.query("select is_teacher, email, is_approved, is_active from users where email=?", [email], function (err, newDoc) {
    if (callback) {
      if (!newDoc || newDoc.length <= 0) {
        newDoc = null;
        err = err || 'SQL no Result';
      }
      else {
        if (newDoc.length > 1) {
          err = 'SQL SEVERE ERROR: more than one entry for user.email:' + email;
        }
      }
      if (err) {
        console.log('getUserAuthorizationInfos error?:' + err);
        callback(err, null);
      } else {
        callback(err, newDoc[0]);
      }
    }
  });
}

function getUserIdByEmail(email, callback) {
  return db.query("select id, class_id, is_teacher from users where email=?", [email], function (err, newDoc) {
    if (callback) {
      if (newDoc.length <= 0) {
        newDoc = null;
        err = err || 'SQL no Result';
      }
      else {
        if (newDoc.length > 1) {
          err = 'SQL SEVERE ERROR: more than one entry for user.email:' + email;
        }
      }
      if (err) {
        callback(err, null);
      } else {
        callback(err, newDoc);
      }
    }
  });
}

function getClassIdByEmail(email, callback) {
  return db.query("select class_id from users where email=?", [email], function (err, newDoc) {
    if (callback) {
      if (newDoc.length <= 0) {
        newDoc = null;
        err = err || 'SQL no Result';
      }
      else {
        if (newDoc.length > 1) {
          err = 'SQL SEVERE ERROR: more than one entry for user.email:' + email;
        }
      }
      if (err) {
        callback(err, null);
      } else {
        callback(err, newDoc[0].class_id);
      }
    }
  });
}

function getAvatarFilenameByEmail(email, callback) {
  return db.query("select avatar_filename from users where email=?", [email], function (err, newDoc) {
    if (callback) {
      if (newDoc.length <= 0) {
        newDoc = null;
        err = err || 'SQL no Result';
      }
      else {
        if (newDoc.length > 1) {
          err = 'SQL SEVERE ERROR: more than one entry for user.email:' + email;
        }
      }
      if (err) {
        callback(err, null);
      } else {
        callback(err, newDoc[0].avatar_filename);
      }
    }
  });
}

function getAvatarFilenamesByEmail(email, callback) {
  return db.query("select u.avatar_filename, u.email,u.class_id from users u, klasses k,  " +
    "(select class_id, is_teacher from users where email=?) pr1 " +
    "where u.class_id = k.id  and k.id = pr1.class_id  and ( (  pr1.is_teacher = 1) OR (u.is_approved = 1 and pr1.is_teacher = 0))",
    [email], function (err, newDoc) {

      if (callback) {
        if (newDoc.length <= 0) {
          newDoc = null;
        }
        callback(err, newDoc);
      }
    });
}

// userId is the user to approve
// username is the teacher (taken from jwt)
function approveUser(userId, username, approve, callback) {

  // get teacher infos
  return getUserIdByEmail(username, function (err, doc) {
    if (err) {
      callback(err, doc);
    }
    else {
      if (!doc) {
        callback(err, doc);
      }
      else {
        if (doc[0].is_teacher && doc[0].class_id && userId
          && doc[0].is_teacher === 1
          && (approve === 1 || approve === 0)) {

          const sf = 'update users set is_approved = ? where id = ? and class_id = ?';

          return db.query(sf, [approve, userId, doc[0].class_id], function (err2, newDoc) {

            if (callback) {
              if (newDoc) {
                if (newDoc.affectedRows !== 1) {
                  newDoc = 'ASAS SQL SEVERE ERROR: more than one entry for user.id:' + userId;
                  err = 400;

                }
              }
              callback(err, newDoc);
            }
          });
        } else {
          callback(400, 'invalid Request');
        }
      }
    }
  });
}

function deleteUser(userId, username, callback) {
  return getUserIdByEmail(username, function (err, doc) {
    if (err) {
      callback(err, doc);
    }
    else {
      if (!doc) {
        callback(err, doc);
      }
      else {
        if (doc[0].is_teacher && doc[0].class_id && userId
          && doc[0].is_teacher === 1) {

          //  check if we should not delete if there are chats from user: and (select count(*) from chat where user_id = ?) = 0
          const sf = 'delete users, chat from users left join chat on  chat.user_id = users.id  where users.id = ? and users.class_id = ? and users.is_approved = 0';

          return db.query(sf, [userId, doc[0].class_id, userId ], function (err2, newDoc2) {
            if (callback) {
              if (err2 || newDoc2.affectedRows === 0) {
                callback(400,null);
              } else {
                callback(0, true);
              }
            }
          });
        } else {
          callback(400, 'invalid Request');
        }
      }
    }
  });
}

// get CurrentUser from jwt (jwt writes user into req
function currentUser(req) {
  return req.user.name;
}

function createSessionToken(name, secret, options, callback) {
  if (!name) {
    return "";
  }
  jwt.sign({name}, secret, options, (err, token) => callback(token));
}

module.exports = {
  authenticate: authenticate,
  currentUser: currentUser,
  register: register,
  registerUser: registerUser,
  updatePassword: updatePassword,
  updateUser: updateUser,
  updateAvatarFilename: updateAvatarFilename,
  UserFromJson: UserFromJson,
  getUserByEmail: getUserByEmail,
  getUserAuthorizationInfos: getUserAuthorizationInfos,
  getUserIdByEmail: getUserIdByEmail,
  getClassIdByEmail: getClassIdByEmail,
  getAvatarFilenameByEmail: getAvatarFilenameByEmail,
  getAvatarFilenamesByEmail: getAvatarFilenamesByEmail,
  getAllUserDetails: getAllUserDetails,
  approveUser: approveUser,
  deleteUser: deleteUser
};



