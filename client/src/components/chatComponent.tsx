import { useEffect, useState } from "react";
import socket from "../socket";
import useGetAllMessagesForUserQuery from "../actions/user/getAllMessagesForUser";

const ChatComponent = ({ selectedUser, loginUser }: any) => {
  const { data: messageData, refetch: refetchMessages } =
    useGetAllMessagesForUserQuery();

  interface Message {
    content: string;
    from: string;
    to: string;
    createdAt: any;
  }

  const [conversations, setConversations] = useState<Message[]>(
    messageData?.messages || []
  );

  console.log(conversations, "sdhjg");
  const [newMessage, setNewMessage] = useState("");

  const handleMessageChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    if (messageData) {
      setConversations(messageData.messages);
    }
  }, [messageData]);

  console.log(conversations, "messages");

  console.log(selectedUser, "selectedUser");

  const handleMessageSend = (e: any) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      socket.emit("private message", {
        content: newMessage,
        to: selectedUser.userID,
      });
      setNewMessage("");
    }
    refetchMessages();
  };

  useEffect(() => {
    socket.on("private message", ({}) => {
      console.log("first");
      refetchMessages();
    });

    return () => {
      socket.off("private message");
    };
  }, [conversations]);

  return (
    <div>
      {selectedUser && (
        <div>
          <div className="p-5 chat-height">
            {conversations.length >= 1 &&
              conversations.filter((message) => message.from === selectedUser.userID || message.to === selectedUser.userID).map((message, index) => (
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
                      ? "You"
                      : selectedUser.username}
                    <time className="text-xs ml-2 opacity-50">
                      {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                    </time>
                  </div>
                  <div className="chat-bubble">{message.content}</div>
                  <div className="chat-footer opacity-50">Delivered</div>
                </div>
              ))}
          </div>
          <form onSubmit={handleMessageSend} className="flex sticky bottom-0 p-5 rounded-tr-lg rounded-tl-lg bg-neutral">
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
