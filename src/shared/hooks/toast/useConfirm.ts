import { useConfirmStore } from "@/shared/stores/confirmStore";

export function useConfirm() {
  const showConfirm = useConfirmStore((state) => state.showConfirm);
  return showConfirm;
}

// import { useToastStore } from "@/shared/stores/toastStore";

// export const useConfirm = () => {
//   return useToastStore((state) => state.confirm);
// };
