import { json } from "express"
import friendRequest from "../models/friendRequest.model.js"
import User from "../models/user.model.js"

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const currentUser = req.user

        const recommendedUser = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { $id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        })
        res.status(200).json(recommendedUser);
    } catch (error) {
        console.log("Error occur while fetching recommended users", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullname profilepic nativelanguage learninglanguage")

        res.status(200).json(user.friends)
    } catch (error) {
        console.log("Error occur while getting friends", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.perams

        if (myId == recipientId) {
            return res.status(400).json({ message: "you can't send request to yourself" })
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(400).json({ message: "User do not exist" })
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "you are Already Friends" })
        }

        const existingRequest = await friendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { recipient: myId, sender: recipientId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already Exist" })
        }

        const request = await friendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        return res.status(200).json(request);

    } catch (error) {
        console.log("Error occur while Sending friend Request", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const searchRequest = await friendRequest.findById({ requestId })

        if (!searchRequest) {
            return res.status(404).send({ message: "Friend Request not found" })
        }

        const userId = req.user.id;
        if (searchRequest.recipient.toString !== userId) {
            return res.status(404).send({ message: "Not authoried to accept the request" });
        }
        searchRequest.status = "accepted";
        await searchRequest.save();

        await User.findByIdAndUpdate(searchRequest.sender, {
            $addToSet: { friends: searchRequest.recipient }
        });
        await User.findByIdAndUpdate(searchRequest.recipient, {
            $addToSet: { friends: searchRequest.sender }
        });
        res.status(200).json({ message: "friend request accepted" })
    } catch (error) {
        console.log("Error occur while Accepting friend Request", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }

}
export const getFriendRequest = async (req, res) => {
    try {
        const incomingReq = await friendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "profilepic fullname nativelanguage learninglanguage");

        const acceptedReq = await friendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "profilepic fullname");

        res.status(200).json({ incomingReq, acceptedReq })
    } catch (error) {
        console.log("Error occur while Getting friend Request", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const getOutGoingFriendRequest = async (req, res) => {
    try {
        const outgoingRequest = await friendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullname profilepic nativelanguage learninglanguage");

        res.status(200).json(outgoingRequest)
    } catch (error) {
        console.log("Error occur while OutGoing friend Request", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
