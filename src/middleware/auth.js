const jwt = require("jsonwebtoken");
const { User } = require("../models");

const verifyToken = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing."
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Toekn is missing"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        console.log("user=>",user)
       console.log("user session",user.sessionToken, "decord session",decoded.sessionToken)
        if(user.sessionToken != decoded.sessionToken){
            return res.status(401).json({
                success:false,
                message:"Session expired. You are logged in on another device."
            })
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = verifyToken;