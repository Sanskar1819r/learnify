import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js"


export const protectRoute = async (req, res, next) => {

    try {
        const Token = req.cookies.Token;
        if (!Token) {
            return res.status(401).json({ message: "UnAuthorised - No Token provider" });
        }
        const decoded = jwt.verify(Token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "UnAuthorised - Token inCorrect or Expired" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;
        next();
    } catch (error) {
        console.log("Error Occur while authorising")
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

