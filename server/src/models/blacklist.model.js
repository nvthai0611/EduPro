const mongoose = require("mongoose");
const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
}, {timestamps: true, collection: 'BlackLists'});
const BackLists = mongoose.model("BlackLists", blacklistSchema);
module.exports = BackLists;