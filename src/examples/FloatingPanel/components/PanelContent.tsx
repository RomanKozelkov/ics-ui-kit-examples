import { ActivityItem } from "./ActivityItem";

export const PanelContent = () => {
	return (
		<div className="flex flex-col px-1 pb-1 pt-14">
			<ActivityItem
				avatarSrc="https://github.com/shadcn.png"
				avatarFallback="CN"
				author="Nikita Strapilov"
				time="1 hour ago"
				description="Added event handler to dropdown component."
				showIndicator
			/>

			<ActivityItem
				avatarSrc="https://github.com/leerob.png"
				avatarFallback="AK"
				author="Alexander Kurbatov"
				time="yesterday"
				description="Added event handler to dropdown component."
				showIndicator
			/>

			<ActivityItem
				avatarFallback="SP"
				author="Stanislav Peremychkin"
				time="1 day ago"
				description="Added event handler to dropdown component."
				showIndicator
			/>

			<ActivityItem
				avatarFallback="KB"
				author="Konstantin Borodinsky"
				time="11 months ago"
				description="Added event handler to dropdown component."
			/>

			<ActivityItem
				avatarFallback="BV"
				author="Borislav Vronsky"
				time="1 year ago"
				description="Added event handler to dropdown component, updated 3 files."
			/>

			<ActivityItem
				avatarFallback="NS"
				author="Nikolai Sorokin"
				time="2 years ago"
				description="Refactored the sidebar navigation component."
			/>
		</div>
	);
};
