import express from "express";
import initDbController from "../controller/initDb.controller.js";

const router = express.Router();

router.post('/', initDbController)

export default router;