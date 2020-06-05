'use strict';

exports.calculateUserAge = function (dob) {
   if (!dob) {
      return null;
   }

   var date = new Date(dob);

   var ageDifMs = Date.now() - date.getTime();
   var ageDate = new Date(ageDifMs); // miliseconds from epoch
   var year = Math.abs(ageDate.getUTCFullYear() - 1970);
   if (year === 0) {
      var month = ageDate.getMonth();
      year = month/12
   }
  return year.toFixed(0)
}

exports.generateNewPhoneVerificationCodeObject = function (type) {
   return {
      code: Math.floor(1000 + Math.random() * 9000),
      expiryTime: (Date.now() + 24 * 60 * 60 * 1000),
      type: type
   }
}