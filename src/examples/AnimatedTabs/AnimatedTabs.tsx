import { Icon } from "ics-ui-kit/components/icon";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from "ics-ui-kit/components/tabs";
import { Circle } from "lucide-react";

export function AnimatedTabs() {
	return (
		<Tabs defaultValue="account" className="w-[400px]">
			<TabsList>
				<TabsTrigger value="account">
					<Icon icon={Circle} />
					Account
				</TabsTrigger>
				<TabsTrigger value="password">
					<Icon icon={Circle} />
					Password
				</TabsTrigger>
				<TabsTrigger value="settings">
					<Icon icon={Circle} />
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<div className="p-4">
					<h3 className="text-lg font-medium">Account Settings</h3>
					<p className="text-sm text-muted-foreground">
						Make changes to your account settings here.
					</p>
				</div>
			</TabsContent>
			<TabsContent value="password">
				<div className="p-4">
					<h3 className="text-lg font-medium">Password</h3>
					<p className="text-sm text-muted-foreground">
						Change your password here.
					</p>
				</div>
			</TabsContent>
			<TabsContent value="settings">
				<div className="p-4">
					<h3 className="text-lg font-medium">Settings</h3>
					<p className="text-sm text-muted-foreground">
						Manage your application settings.
					</p>
				</div>
			</TabsContent>
		</Tabs>
	);
}
