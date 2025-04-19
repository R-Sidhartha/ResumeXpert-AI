import { create } from "zustand";

interface PremiumModalState {
  open: boolean;
  title?: string;
  description?: string;
  feature?: string;
  setOpen: (open: boolean) => void;
  setModalContent: (content: {
    title?: string;
    description?: string;
    feature?: string;
  }) => void;
}

const usePremiumModal = create<PremiumModalState>((set) => ({
  open: false,
  title: undefined,
  description: undefined,
  feature: undefined,
  setOpen: (open) => set({ open }),
  setModalContent: (content) => set({ ...content, open: true }),
}));

export default usePremiumModal;
