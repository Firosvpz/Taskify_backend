import express from "express";
import { userRegister, userLogin,userLogout } from "../controllers/authController";
import userAuth from "../middlewares/userAuth";

const router = express.Router();

router.post("/register", (req, res) => {
  userRegister(req, res);
});

router.post("/login", (req, res) => {
  userLogin(req, res);
});

router.post("/logout",userAuth, (req, res) => {
  userLogout(req, res);
});

export default router;
