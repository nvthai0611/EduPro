// stores/zustand/notificationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (noti) =>
        set((state) => ({
          notifications: [{ ...noti, read: false }, ...state.notifications],
        })),
      markAsRead: (index) =>
        set((state) => {
          const updated = [...state.notifications];
          if (updated[index]) updated[index].read = true;
          return { notifications: updated };
        }),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "notifications-store", // lưu vào localStorage
    }
  )
);

export default useNotificationStore;
