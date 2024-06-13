import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../../socket";

interface register {
  name: string;
  email: string;
  password: string;
}
async function register(input: register) {
  const { data } = await axios.post("/api/v1/register", input);
  return data;
}

const useRegisterUserMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["registerUser"],
    mutationFn: (input: register) => register(input),
    onSuccess: async (data) => {
      const userID = await data.user._id;
      socket.auth = {userID}
      socket.connect();
      localStorage.setItem("chatAppUser", "isAuthenticated");
      toast.success("User registered successfully");
      navigate({ to: "/home" });
    },
    onError: (error: any) => {
      const message = error.response.data.message;
      toast.error(message);
    },
  });
};

export default useRegisterUserMutation;
