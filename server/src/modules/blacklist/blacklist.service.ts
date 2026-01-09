import BlackListModel from "./blacklist.model";

export const addTokenToBlacklist = async (token: string) => {
  return await BlackListModel.create({ token });
};

export const isTokenBlacklisted = async (token: string) => {
  const exists = await BlackListModel.exists({ token });
  return !!exists;
};

export const clearExpiredBlacklist = async (beforeDate: Date) => {
  return await BlackListModel.deleteMany({
    createdAt: { $lt: beforeDate },
  });
};
