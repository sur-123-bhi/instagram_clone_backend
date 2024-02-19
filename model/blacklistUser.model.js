const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
    token: String
});

const BlackListModel = mongoose.model("blacklisttokens", blacklistSchema);

module.exports = {
    BlackListModel
}