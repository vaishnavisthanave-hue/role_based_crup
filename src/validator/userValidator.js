const validateCreateUser = (req, res, next) => {

    const {
        name,
        email,
        password,
        roleid
    } = req.body;

    if (!name || !email || !password || !roleid) {
        return res.status(400).json({
            success: false,
            message:
                "Name, email, password and roleid are required."
        });
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format."
        });
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message:
                "Password must contain uppercase, lowercase, number and special character."
        });
    }

    if (!Number.isInteger(Number(roleid))) {
        return res.status(400).json({
            success: false,
            message: "Invalid roleid."
        });
    }

    next();
};

module.exports = validateCreateUser;