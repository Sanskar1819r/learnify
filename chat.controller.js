import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = (userId) => {
    try {
        const token = generateStreamToken(req.user.id);

        resizeBy.status(200).json({ token })
    } catch (error) {
        console.log("Error in getStreamToken Controller ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}