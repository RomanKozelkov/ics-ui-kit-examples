import { createContext, useContext } from "react";
import type { DropZone } from "../../../types/DndTypes";

type DndStateContextValue = {
	activeId: string | null;
	dropZone: DropZone;
};

const DndStateContext = createContext<DndStateContextValue>({
	activeId: null,
	dropZone: null
});

export const DndStateProvider = DndStateContext.Provider;

export function useDndState() {
	return useContext(DndStateContext);
}
