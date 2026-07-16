import { useState } from "react";

export const useAtBottomScroll = () => {
	const [isAtBottom, setIsAtBottom] = useState(false);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
	};

	return { isAtBottom, handleScroll };
};
