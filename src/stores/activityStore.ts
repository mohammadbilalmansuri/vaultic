import { create } from "zustand";
import { IActivity } from "@/types";

interface IActivityStore {
  activities: IActivity[];
  clearActivities: () => void;
  setActivities: (activities: IActivity[]) => void;
}

const useActivityStore = create<IActivityStore>((set, get) => ({
  activities: [],
  clearActivities: () => set({ activities: [] }),
  setActivities: (activities: IActivity[]) => set({ activities }),
}));

export default useActivityStore;
