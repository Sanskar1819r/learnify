import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: ""
    },
    profilepic: {
        type: String,
        default: ""
    },
    nativelanguage: {
        type: String,
        default: ""
    },
    learninglanguage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    isOnboarded: {
        Type: Boolean
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.PassAuth = async function (password) {
    return bcrypt.compare(password, this.password);
};

const user = mongoose.model("User", userSchema);

export default user;
