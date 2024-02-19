const { BlackListModel } = require("../model/blacklistUser.model");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        const blacklistToken = await BlackListModel.findOne({ token });
        if (blacklistToken) {
            return res.status(401).json({ "msg": 'you are unauthorized' });
        }
        jwt.verify(token, "masai", async (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
            }
            if (decoded) {
                const { userId } = decoded;
                const user = await UserModel.findOne({ _id: userId });
                if (!user) {
                    return res.status(404).json({ error: "User not found", message: "User does not exist" });
                }
                // req.role = user.role;
                // console.log("User role:", req.role);
                next();
            } else {
                res.status(401).json({ error: "Unauthorized", message: "User not authorized" });
            }
        });
    } else {
        res.status(401).json({ error: "Unauthorized", message: "Token not provided" });
    }
};


module.exports = {
    authMiddleware
}