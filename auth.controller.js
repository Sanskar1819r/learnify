import User from "../models/user.model.js";
import "dotenv/config"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js";

export const signupC = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !password || !email) {
            return res.status(400).json("All Fields Are Required");
        }
        if (password.length < 6) {
            return res.status(400).json("Password Should Be More Then 6 characters");
        }
        const emailChar = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailChar.test(email)) {
            return res.status(400).json("Enter a Valid Email");
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json("User Already exist");
        }

        const index = Math.floor(Math.random() * 100) + 1; // range - (1 - 100)
        const avatar = `https://avatar.iran.liara.run/public/${index}.png`;


        const newUser = await User.create({
            fullname,
            email,
            password,
            profilePic: avatar,
        })
        await newUser.save();

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePic || ""
            });
            console.log("Stream user created:", newUser.fullname);
        } catch (error) {
            console.error("User not created:", error);
        }

        const Token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.cookie("Token", Token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({ success: true, user: newUser })

    } catch (error) {
        console.log("Error in SignUp controller", error);
        res.status(500).json({ Message: "Internal Server Error" })
    }
};
export const loginC = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json("All field are Required")
        }
        const userExist = await User.findOne({ email })
        if (!userExist) {
            return res.status(400).json("Invalid Credentials")
        }
        const passCorrect = await userExist.PassAuth(password)
        if (!passCorrect) {
            return res.status(400).json("Credentials are Incorrect")
        }

        const Token = jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.cookie("Token", Token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ success: true, user: "Signin !!" });
    } catch (error) {
        console.log("Error in Sign in :", error);
        res.status(500).json({ Message: "Internal Server Error" })
    }
};
export const logoutC = (req, res) => {
    res.clearCookie("Token")
    res.status(200).json({ success: true, Message: "Logout Successful" });
};
export const onboardC = async (req, res) => {
    try {
        const userId = req.user._id
        const { fullname, bio, nativelanguage, learninglanguage, location } = req.body
        if (!fullname || !bio || !nativelanguage || !learninglanguage || !location) {
            return res.status(401).json({
                message: "All field are required", missingFields: [
                    !fullname && "fullname",
                    !bio && "bio",
                    !nativelanguage && "nativelanguage",
                    !learninglanguage && "learninglanguage",
                    !location && "location"
                ].filter(Boolean)
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            inOnboarded: true
        }, { new: true }).select("-password")

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullname,
                image: updatedUser.profilePic || ""
            })
            console.log(`Stream user created: ${updatedUser.fullname}`);
        } catch (error) {
            console.log("Stream user not created:", error);
        }
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("onBoard Error :", error);
        return res.status(500).json({ message: "Internel Server Error" })
    }
}
