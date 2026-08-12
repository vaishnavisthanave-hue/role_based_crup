const { User, Role } = require("../models");

const processOneUserDelete = async () => {
  const user = await User.findOne({
    where: {
      is_request: 1,
      active: 1,
    },
    order: [["id", "ASC"]],
  });
  
  if (!user) {
    console.log("No pending user delete request");
    return;
  }
 
  const role = await Role.findByPk(user.roleid);
  
  if(role.name == 'admin'){
    console.log("This User is Admin");
    return;
  }

  await user.update({
    deletedAt: new Date(),
    is_request: 0,
    active: 0,
  });

  console.log(
    `User ${user.id} is soft deleted successfully`
  );
  return user;
};
module.exports = {
  processOneUserDelete,
};