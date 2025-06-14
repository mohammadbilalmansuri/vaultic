import { create } from "zustand";
import { IActivity } from "@/types";

interface IActivityStore {
  activities: IActivity[];
  clearActivities: () => void;
  setActivities: (activities: IActivity[]) => void;
  addActivity: (activity: IActivity) => void;
}

const useActivityStore = create<IActivityStore>((set, get) => ({
  activities: [],
  clearActivities: () => set({ activities: [] }),
  setActivities: (activities: IActivity[]) => set({ activities }),
  addActivity: (activity: IActivity) =>
    set((state) => ({ activities: [...state.activities, activity] })),
}));

export default useActivityStore;
