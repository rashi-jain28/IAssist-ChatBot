exports.user = function(ninerID,firstName,lastName,emailAddress){
  var userItemObj = {
    NinerID:ninerID,
    firstName:firstName,
    lastName:lastName,
    emailAddress:emailAddress,
  }
  return userItemObj;
};
