import express from "express";
import { loginC, logoutC, signupC } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { onboardC } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signupC);
router.post("/login", loginC);
router.post("/logout", logoutC);

router.post("/onboard",protectRoute , onboardC);

router.post("/me",protectRoute ,(req, res) => {
    res.status(200).json({ user: req.user });
});

export default router;