import { useState, useEffect } from "react";
import useGetLoginUserQuery from "../actions/user/getUserProfile";
import socket from "../socket";
import ChatComponent from "../components/chatComponent";
import useGetAllUserQuery from "../actions/user/getAllUsers";
import Header from "../components/layouts/heade";

const Home = () => {
  const { data: userData, refetch: refetchUserData } = useGetLoginUserQuery();
  const { data: allUsers, refetch: refetchAllUsers } = useGetAllUserQuery();
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  socket.onAny((event, ...args) => {
    console.log(event, args, "socket");
  });

  // sort all users by name
  const [sortedUsers, setSortedUsers] = useState<any>([]);
  useEffect(() => {
    if (userData && allUsers) {
      const currentUsername = userData?.user?.name;
      const sortedUsers =
        [...allUsers?.users].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }) || [];

      const currentUserIndex = sortedUsers.findIndex(
        (user) => user.name === currentUsername
      );
      if (currentUserIndex > -1) {
        const [currentUser] = sortedUsers.splice(currentUserIndex, 1);
        sortedUsers.unshift(currentUser);
      }
      setSortedUsers(sortedUsers);
    }
  }, [userData, allUsers]);

  useEffect(() => {
    if (userData) {
      const userID = userData?.user?._id;
      socket.auth = { userID };
      socket.connect();
    }
  }, [userData]);

  type socketUser = {
    userID: string;
    username: string;
    connected: boolean;
    messages?: string[];
  };

  // socket connection
  useEffect(() => {
    // session
    socket.on("session", ({ userID }) => {
      socket.auth = { userID };
      refetchAllUsers();
      refetchUserData();
    });

    // set online users
    socket.on("users", (users) => {
      refetchAllUsers();
      refetchUserData();
      const socketUsers: socketUser[] = [];
      console.log(users, "users");
      users.forEach((user: socketUser) => {
        socketUsers.push(user);
      });
      setOnlineUsers(socketUsers);
    });

    // new user connected
    socket.on("user connected", (user) => {
      refetchAllUsers();
      refetchUserData();
      console.log(user, "user connected");
      // update online users
      setOnlineUsers((prevUsers: any) => {
        const existingUserIndex = prevUsers.findIndex(
          (u: any) => u.username === user.username
        );

        if (existingUserIndex !== -1) {
          // Replace existing user
          const updatedUsers = [...prevUsers];
          updatedUsers[existingUserIndex] = {
            userID: user.userID,
            username: user.username,
          };
          return updatedUsers;
        } else {
          // Add new user
          return [
            ...prevUsers,
            { userID: user.userID, username: user.username },
          ];
        }
      });
    });

    // user disconnected
    socket.on("disconnect", () => {
      refetchAllUsers();
      refetchUserData();
      const updatedUsers = onlineUsers.filter(
        (user: socketUser) => user.userID !== socket.userID
      );
      setOnlineUsers(updatedUsers);
    });

    // Clean up the event listener
    return () => {
      socket.off("users");
      socket.off("user connected");
      socket.off("session");
      socket.off("disconnect");
    };
  }, [socket]);

  console.log(onlineUsers, "online users");

  const handleUserClick = (user: any) => {
    // const currentUser = onlineUsers.find(
    //   (u: socketUser) => u.username === user
    // );
    setSelectedUser(user);
  };

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-6xl screen-height flex mt-6 rounded-md shadow-md p-6 bg-gray-900">
        {/* all users Users */}
        <div className="w-2/6 overflow-auto">
        <div className="flex flex-col lg:max-w-96">
          {sortedUsers &&
            sortedUsers.filter((user: any) => user.name !== userData?.user?.name).map((user: any) => (
              <div
                key={user._id}
                className={`cursor-pointer text-lg p-2 rounded-md lg:w-52 hover:bg-gray-500 mb-4  ${
                  selectedUser?.name === user.name && "bg-blue-600"
                }`}
                onClick={() => handleUserClick(user)}
              >
                <p>{user._id === userData?.user._id ? "You" : user.name}</p>
                <p className="text-xs font-extralight">
                  {user.connected ? (
                    <span className="text-green-500">online</span>
                  ) : (
                    <span className="text-red-500">offline</span>
                  )}
                </p>
              </div>
            ))}
        </div>
        </div>

        {/* Chat */}
        {selectedUser && (
          <div className="w-full overflow-auto bg-gray-700 rounded-md">
            {/* Render the chat component for the selected user */}
            <p className="sticky top-0 p-2 z-10 bg-stone-700 rounded-sm">
              Selected User: {selectedUser.name}
            </p>
            <ChatComponent selectedUser={selectedUser} loginUser={userData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
