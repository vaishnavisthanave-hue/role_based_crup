const canUpdateBusiness = ({ user, business }) => {
    if (!user || !business) {
        return false;
    }

    // Admin can update any business
    if (user.role === "admin") {
        return true;
    }

    // Vendor can update only his own business
    if (user.role === "vendor" &&user.id === business.userid) {
        return true;
    }

    return false;
};

module.exports = 
    canUpdateBusiness;
