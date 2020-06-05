const models = require('../../db_schemas');

module.exports.getUserById = async (userId, include) => {
  return await models.Users.findOne({
    where: {
      id: userId
    },
    include: include
  })
}

module.exports.getUserByUserName = async(email) => {
  return await models.Users.findOne({
    where: {
      email: email
    }
  })
}



module.exports.storeToken = async function(data,token,expiryTime){

  var id = data.id

  await models.UserTokens.create({
      userId: id,
      token,
      expiryTime,
      type: 'login-token'
  })
}


module.exports.checkIfTokenHashExist = async function(userId,token){
  if(!userId){
    userId = null
  }
  let userTokenObj = await models.UserTokens.findOne({
    where:{
      userId: userId,
      token,
      type: 'login-token'
    }
  })
  return userTokenObj ? true : false
}