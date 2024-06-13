const User = require("./models/user");

class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class MongoSessionStore extends SessionStore {
  constructor() {
    super();
    this.session = User;
  }

  async findSession(id) {
    try {
      const user = await this.session.findById(id).select("-password");
      return user;
    } catch (err) {
      console.error("Error finding session:", err);
      return null;
    }
  }

  async saveSession(id, session) {
    try {
      const user = await this.session.findById(id);
      user.connected = session.connected;
      await user.save();
      return;
    } catch (err) {
      console.error("Error saving session:", err);
    }
  }

  async findAllSessions() {
    try {
      const users = await this.session.find({connected: true}).select("-password");
      return users;
    } catch (err) {
      console.error("Error finding all sessions:", err);
      return [];
    }
  }
}

module.exports = {
  MongoSessionStore,
};
