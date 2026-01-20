const openai = require("../clients/openai.client");

/**
 *  Call OpenAI API awaiting response. Return the message
 */
async function chatbotConversation(messages) {
    try {
        // Call OpenAI to get a return message. Returns a JSON object.
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages, // history of all messages, both user and chatbot
            temperature: 0.7, // 0 - 1.0. Higher numbers have more creative responses
        });

        return completion.choices[0].message; 
    } catch (err) {
        console.error("OpenAI error:", err);
        throw new Error("Chatbot service failed");
    }
}

module.exports = {
    chatbotConversation,
};