import bcrypt from "bcrypt";
export default {
  hashMake: async (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, salt);
  },

  hashCheck: async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  },
};
