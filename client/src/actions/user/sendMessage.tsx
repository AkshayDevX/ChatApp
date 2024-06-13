import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../../socket";

interface messageInput {
  receiverId: string;
  message: string;
}

async function sendMessage(input: messageInput) {
  const { data } = await axios.put("/api/v1/user/send-message", input);
  return data;
}

const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: messageInput) => sendMessage(input),
    onSuccess: (_data, variables) => {
      socket.emit("message", {
        message: variables.message,
        userId: variables.receiverId,
      });
      queryClient.refetchQueries({ queryKey: ["loginUser"], exact: true });
    },
    onError: (error: any) => {
      const message = error.response.data.message;
      toast.error(message);
    },
  });
};

export default useSendMessageMutation;