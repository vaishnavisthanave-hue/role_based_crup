
const { Business, user,Role } = require("../models");
const canUpdateBusiness =  async({ user, business }) => {
    if (!user || !business) {
        return false;
    }
    const role = await Role.findOne({
            where: {
                id: user.roleid,
              
            }
        });

    // Admin can update any business
    if (role.name === "admin") {
        return true;
    }

    // Vendor can update only his own business
   
    if (role.name === "vendor" &&user.id === business.userid) {
        return true;
    }

    return false;
};

module.exports = 
    canUpdateBusiness;
