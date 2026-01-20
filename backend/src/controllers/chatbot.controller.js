const chatbotService = require("../services/chatbot.service");

/* Accepts chat request from client and validates the input, returning the response as JSON */
async function chatbotConversation(req, res) {
  try {
    const { messages } = req.body;

    // If messages are not in array format, return status 400
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const reply = await chatbotService.chatbotConversation(messages); // get reply from chatbot. Call the service

    // return status from the chatbot and set the status to 200.
    res.status(200).json({
      role: reply.role,
      content: reply.content,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
}

module.exports = {
  chatbotConversation,
};
