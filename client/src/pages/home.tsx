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
      refetchUserData()
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
        (user: socketUser) => user.userID !== socket.id
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
    const currentUser = onlineUsers.find(
      (u: socketUser) => u.username === user
    );
    setSelectedUser(currentUser);
  };

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-6xl flex mt-6 rounded-md shadow-md p-6">
        {/* all users Users */}
        <div className="items-center justify-center m-8">
          {sortedUsers &&
            sortedUsers.map((user: any) => (
              <div
                key={user._id}
                className="cursor-pointer text-lg p-2 rounded-md hover:bg-gray-500 mb-4"
                onClick={() => handleUserClick(user.name)}
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

        {/* Chat */}
        {selectedUser && (
          <div className="">
            {/* Render the chat component or window for the selected user */}
            <p>Selected User: {selectedUser.username}</p>
            <ChatComponent
              selectedUser={selectedUser}
              loginUser={userData}
              onlineUsers={onlineUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
