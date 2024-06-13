import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getAllMessagesForUser() {
  const { data } = await axios.get("/api/v1/user/get-all-messages");
  return data;
}

const useGetAllMessagesForUserQuery = () => {
  return useQuery({
    queryKey: ["getAllMessagesForUser"],
    queryFn: getAllMessagesForUser,
  });
};

export default useGetAllMessagesForUserQuery;
