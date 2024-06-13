import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getAllUsers() {
  const { data } = await axios.get("/api/v1/users");

  return data;
}

const useGetAllUserQuery = () => {
  return useQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAllUsers,
  });
};

export default useGetAllUserQuery;
