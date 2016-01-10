'use strict'; 

var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
//uuid autogenerated by mongo
  timeCreated: Date,
  timeLastModified: { type: Date, default: Date.now }, 
  organization: String,  //organization ID
  driver: String, //driver ID
  createdBy: String, //origin of order, either admin created or from api
  pickupPoint: {
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String
    },
    phone: String,
    name: String,
    location: Array //long lat geocoordinates 
  },
  dropoffPoint: {
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String
    },
    phone: String,
    name: String,
    location: Array //long lat coordinates
  },
  state: [
  //array of objects with states  
  ],
  //current state
     //assigned, confirmed, active (picked up), delay, completed (dropped off)
  completeBefore: Date, //optional -- shouldn't take longer than 1 hour from order time
  startBy: Date, //optional --food takes 15 minutes prep time
  notes: String, //optional
  autoAssign: Boolean
});

/**
 * Password hash middleware.
 */
/**
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.

userSchema.methods.gravatar = function(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};
*/
module.exports = mongoose.model('Job', jobSchema);
