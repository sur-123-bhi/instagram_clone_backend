const { BlackListModel } = require("../model/blacklistUser.model");

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ "msg": "You are unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, 'masai');
        const isTokenBlacklisted = await BlackListModel.findOne({ token });
        if (isTokenBlacklisted) {
            res.status(401).json({ "msg": "User has invalid token" });
        } else {
            req.userId = decoded.userId;
            next();
        }
    } catch (err) {
        res.status(400).json({ "msg": err });
    }
}

module.exports = {
    authMiddleware
}