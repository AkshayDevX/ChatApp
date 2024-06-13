const Message = require("./models/message");

class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userID) {}
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

  async findMessagesForUser(userID) {
    try {
      const messages = await this.messages.find({
        $or: [{ from: userID }, { to: userID }],
      });
      return messages || [];
    } catch (err) {
      console.error("Error finding messages for user:", err);
      return [];
    }
  }
}

module.exports = {
  MongoMessageStore,
};
