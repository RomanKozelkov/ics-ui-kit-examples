import { Container } from "ics-ui-kit/components/container";
import { Avatar, AvatarImage, AvatarFallback } from "ics-ui-kit/components/avatar";
import { Label } from "ics-ui-kit/components/label";
import { Description } from "ics-ui-kit/components/description";
import { Indicator } from "ics-ui-kit/components/indicator";
import { Text } from "ics-ui-kit/components/text";

type ActivityItemProps = {
	avatarSrc?: string;
	avatarFallback: string;
	author: string;
	time: string;
	description: string;
	showIndicator?: boolean;
};

export const ActivityItem = ({
	avatarSrc,
	avatarFallback,
	author,
	time,
	description,
	showIndicator = false
}: ActivityItemProps) => {
	return (
		<Container type="round">
			<div className="flex flex-row gap-3">
				<Avatar size="sm">
					{avatarSrc && <AvatarImage src={avatarSrc} />}
					<AvatarFallback>{avatarFallback}</AvatarFallback>
				</Avatar>
				<div className="flex w-full flex-col">
					<div className="relative flex flex-row items-baseline gap-2">
						<Label className="leading-5">{author}</Label>
						<Description size="xs">{time}</Description>
						{showIndicator && (
							<Indicator className="absolute right-px top-px bg-status-error" rounded size="sm" />
						)}
					</div>
					<Text>{description}</Text>
				</div>
			</div>
		</Container>
	);
};
