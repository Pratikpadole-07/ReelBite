const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
        default: "https://ui-avatars.com/api/?name=User"
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner" }]


},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;