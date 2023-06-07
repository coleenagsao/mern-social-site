import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import pkg from 'validator';  //used as email format validator
const {isEmail} = pkg;

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    validate: [isEmail, "Invalid Email"] 
  },
  password: { type: String, required: true },
  sentFriendRequests: {type: Array, default: []},
  friendRequests: {type: Array, default: []},
  friends: { type: Array, default: [] },
});

UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

mongoose.model("User", UserSchema);
