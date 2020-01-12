const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dbConfig = require('../../config/db');
const { Schema } = mongoose;

const UsersSchema = new Schema({
  id: Number,
  email: String,
  first_name: String,
  last_name: String,
  admin: Boolean,
  hash: String,
  salt: String,
});
UsersSchema.index({first_name: 'text', last_name: 'text'});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, dbConfig.secret);
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    id: this.id,
    _id: this._id,
    email: this.email,
    first_name: this.first_name,
    last_name: this.last_name,
    admin: this.admin,
    token: this.generateJWT(),
  };
};

mongoose.model('Users', UsersSchema);
