exports.user = function(ninerID,firstName,lastName,emailAddress){
  var userItemObj = {
    ninerID:ninerID,
    firstName:firstName,
    lastName:lastName,
    emailAddress:emailAddress,
  }
  return userItemObj;
};
