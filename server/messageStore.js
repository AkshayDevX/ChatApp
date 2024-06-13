const Message = require("./models/message");

class MessageStore {
  saveMessage(message) {}
}

class MongoMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = Message;
  }

  async saveMessage(message) {
    try {
      const newMessage = new this.messages({
        from: message.from,
        to: message.to,
        content: message.content,
      });
      await newMessage.save();
    } catch (err) {
      console.error("Error saving message:", err);
    }
  }
}

module.exports = {
  MongoMessageStore,
};
