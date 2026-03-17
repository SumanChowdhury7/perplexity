import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  
  let chat = null;
  let title = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    console.log("USER:", req.user);

    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }
    const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });
  const result = await generateResponse(messages);





  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });



  res.status(201).json({
    aiMessage: result,
    chatTitle: title,
    chat,
    aiMessage,
    userMessage,
  });
}
