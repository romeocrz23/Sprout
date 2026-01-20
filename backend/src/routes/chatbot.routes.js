const express = require("express");
const chatbotController = require("../controllers/chatbot.controller");
const router = express.Router();

router.post("/", chatbotController.chatbotConversation);

module.exports = router;