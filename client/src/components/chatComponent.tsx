import { useEffect, useState } from "react";
import socket from "../socket";

const ChatComponent = ({
  selectedUser,
  loginUser,
  onlineUsers,
}: any) => {
  interface Message {
    content: string;
    from: string;
  }

  interface Conversation {
    conversationID: string;
    messages: Message[];
  }

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleMessageChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  console.log(conversations, "messages");

  console.log(selectedUser, "selectedUser");

  const handleMessageSend = (e: any) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      socket.emit("private message", {
        content: newMessage,
        to: selectedUser.userID,
      });
      setConversations((prevConversations: Conversation[]) => {
        const updatedConversations = prevConversations.map(
          (conversation: Conversation) => {
            if (conversation.conversationID === selectedUser.userID) {
              return {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  { content: newMessage, from: loginUser?.user._id },
                ],
              };
            }
            return conversation;
          }
        );

        if (
          !updatedConversations.some(
            (c: Conversation) => c.conversationID === selectedUser.userID
          )
        ) {
          updatedConversations.push({
            conversationID: selectedUser.userID,
            messages: [{ content: newMessage, from: loginUser?.user._id }],
          });
        }

        return updatedConversations;
      });
      setNewMessage("");
    }
  };

  useEffect(() => {
    socket.on("private message", ({ content, from }) => {
      console.log("first");
      for (let i = 0; i < onlineUsers.length; i++) {
        const user = onlineUsers[i];
        if (user.userID === from) {
          setConversations((prevConversations: Conversation[]) => {
            const updatedConversations = prevConversations.map(
              (conversation: Conversation) => {
                if (conversation.conversationID === from) {
                  return {
                    ...conversation,
                    messages: [...conversation.messages, { content, from }],
                  };
                }
                return conversation;
              }
            );

            if (
              !updatedConversations.some(
                (c: Conversation) => c.conversationID === from
              )
            ) {
              updatedConversations.push({
                conversationID: from,
                messages: [{ content, from }],
              });
            }

            return updatedConversations;
          });
          if (user !== selectedUser._id) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });

    return () => {
      socket.off("private message");
    };
  }, [conversations]);

  return (
    <div>
      {selectedUser && (
        <div>
          <div className="chat-container">
            {conversations.length >= 1 &&
              conversations
                .filter(
                  (conversation: Conversation) =>
                    conversation.conversationID === selectedUser.userID
                )
                .flatMap((conversation: Conversation) =>
                  conversation?.messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`chat ${message.from === loginUser?.user._id ? "chat-start" : "chat-end"}`}
                    >
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                          />
                        </div>
                      </div>
                      <div className="chat-header">
                        {message.from === loginUser?.user._id
                          ? "you"
                          : selectedUser.username}
                        {/* <time className="text-xs opacity-50">{new Date().toLocaleTimeString()}</time> */}
                      </div>
                      <div className="chat-bubble">{message.content}</div>
                      <div className="chat-footer opacity-50">Delivered</div>
                    </div>
                  ))
                )}
          </div>
          <form onSubmit={handleMessageSend} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Type your message..."
              className="input input-bordered"
            />
            <button type="submit" className="btn ml-2">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
