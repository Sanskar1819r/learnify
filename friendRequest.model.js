import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending"
    },
}, { timestamps: true });

const friendRequest = mongoose.model("friendRequest",friendRequestSchema);

export default friendRequest;