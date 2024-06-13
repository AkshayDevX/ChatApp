import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../../socket";

interface LoginInput {
  email: string;
  password: string;
}

async function login(input: LoginInput) {
  const { data } = await axios.post("/api/v1/login", input);
  return data;
}

const useLoginUserMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async (data, _variables) => {
      navigate({ to: "/home" });
      console.log(data)
      const userID = await data.user._id;
      console.log(userID);
      socket.auth = {userID}
      socket.connect();
      toast.success("Login Successful");
      localStorage.setItem("chatAppUser", "isAuthenticated");
    },
    onError: (error: any) => {
      const message = error.response.data.message;
      toast.error(message);
    },
  });
};

export default useLoginUserMutation;
