const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true
    }
})

// userSchema.pre("save", async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//         this.cpassword = await bcrypt.hash(this.cpassword, 10);
//     }
//     next();
// })

const User = new mongoose.model("People", userSchema);

module.exports = User;