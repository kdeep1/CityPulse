import express from "express";
import { scanTicketController } from "../controllers/ticket.controller";

const router = express.Router();

router.post("/scan", scanTicketController);
export default router;