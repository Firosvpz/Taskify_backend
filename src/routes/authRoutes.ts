import express from "express";
import { userRegister, userLogin } from "../controllers/authController";

const router = express.Router();

router.post("/register", (req, res) => {
  userRegister(req, res);
});

router.post("/login", (req, res) => {
  userLogin(req, res);
});

export default router;
