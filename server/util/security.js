"use strict";
const jwt = require('jsonwebtoken');
const dbUser = require('../db/dbUser.js');
const dbKlasse = require('../db/dbKlasse.js');

const authorRoles = {
  CLASSLIST: 'classlist',
  CHAT: 'chat'
}
const standardRoles = [authorRoles.CHAT, authorRoles.CLASSLIST];

function isLoggedIn(req) {
  return req.user != null;
}

function currentUser(req) {
  return req.user.name;
}

function createSessionToken(name, secret, options, callback) {
  if (!name) {
    console.log('createSessionToken: name is empty - cant create token');
    return "";
  }
  jwt.sign({name}, secret, options, (err, token) => {
    callback({email: name, token: token})
  });
}

function handleRegister(req, res) {

  if (isLoggedIn(req)) {
    res.status("401").json(false);
  }
  else {
    if (!req.body.email || !req.body.pwd) {
      console.log('handleRegister neither email nor password');
      res.status("401").json(false);
    }
    else {
      dbUser.register(req, function (err, valid) {
        if (valid) {
          createSessionToken(req.body.email, req.app.get("jwt-secret"), req.app.get("jwt-sign"), (token) => res.json(token));
        }
        else {
          if (err >= 0 || err != null) {
            res.status(err).json(false);
          }
          else {
            res.status("401").json(false);
          }
        }
      });
    }
  }
}

function handleLogin(req, res) {
  if (isLoggedIn(req)) {
    res.send(true);
  }
  else {
    if (!req.body.email || !req.body.pwd) {
      res.status("401").json(false);
    }
    else {
      dbUser.authenticate(req.body.email, req.body.pwd, function (err, valid) {
        if (valid) {
          createSessionToken(req.body.email, req.app.get("jwt-secret"), req.app.get("jwt-sign"), (authToken) => {

            getUserRoles(req.body.email, (err, roles) => {
              authToken.user_can = roles || [];
              res.json(authToken);
              return;
            });
            res.json(token);

          });
        }
        else {
          console.log('handleLogin: 401');
          res.status("401").json(false);
        }
      });
    }
  }
}

function handlePasswordChange(req, res) {
  if (req.body.pwd !== req.body.new_pwd) {
    dbUser.authenticate(req.user.name, req.body.pwd, function (err, valid) {
      if (valid) {
        dbUser.updatePassword(req.user.name, req.body.new_pwd, function (err, valid) {
          console.log('handlePasswordChange: err:' + err);
          if (err) {
            res.status('500').json(false);
            return;
          }
          res.json(true);

        });
      }
      else {
        console.log('handlePasswordChange: 401');
        res.status("401").json(false);
      }
    });
  }
  else {
    console.log('handlePasswordChange: new pwd is eq old pwd');
    res.status("401").json(false);
  }
}

function getUserRoles(email, callback) {
  dbUser.getUserAuthorizationInfos(email, (err, authorInfos) => {

    if (err) {
      callback(err, []);
      return;
    } else {

      if (authorInfos.is_approved && authorInfos.is_active) {

        callback(false, standardRoles);
        return;
      }
      callback('not authorized for main features', []);
    }
  });
}
function authorizeBackend(email, accessRight, callback) {

  getUserRoles(email, (err, authorRoles) => {

    if (err) {
      callback(false);
    }
    else {
      for (let x in authorRoles) {
        // check accessRight if its in array authorRoles and if so return true (=authorized)
        if (authorRoles[x] === accessRight) {
          callback(true);
          return;
        }
      }
      callback(false);
    }
  });
}

function getKlasseData(req, res) {
  return dbKlasse.getAllKlasseData();
}

module.exports = {
  isLoggedIn: isLoggedIn,
  currentUser: currentUser,
  createSessionToken: createSessionToken,
  handleRegister: handleRegister,
  handleLogin: handleLogin,
  handlePasswordChange: handlePasswordChange,
  getUserRoles: getUserRoles,
  authorizesBackend: authorizeBackend,
  authorRoles: authorRoles,
  getKlasseData: getKlasseData
}
;
