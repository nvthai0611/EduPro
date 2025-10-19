import { client } from "../utils/clientUtils";

export const getTodos = async () => {
  return await client.get("/todos");
};

// input  => custom lại từ 1 cái thư viện bootstrap
// caurausel => component
