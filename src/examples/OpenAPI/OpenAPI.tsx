import { Lock } from "lucide-react";
import { Button } from "ics-ui-kit/components/button";
import { API_DATA } from "./data";
import { ApiGroupSection } from "./components/ApiGroupSection";
import { Badge } from "ics-ui-kit/components/badge";
import { Tabs, TabsList, TabsTrigger } from "ics-ui-kit/components/tabs";

export const API_VERSIONS = ["v2.0", "v1.0"];
export const API_TITLE = "ICS-IT API";
export const API_DESCRIPTION = "REST API для управления пользователями, аутентификацией и каталогом товаров.";
export const API_BASE_URL = "https://api.ics-it.ru/v2";

export function OpenAPI() {
	return (
		<div className="mx-auto flex max-w-5xl flex-col gap-5 bg-secondary-bg px-6 py-10">
			<div className="flex flex-row items-start justify-between border-b border-secondary-border pb-8">
				<div className="flex flex-col gap-2.5">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold text-primary-fg">{API_TITLE}</h1>

						<Tabs defaultValue={API_VERSIONS[0]}>
							<TabsList>
								{API_VERSIONS.map((v) => (
									<TabsTrigger key={v} value={v} className="px-2">
										{v}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</div>

					<p className="text-sm text-muted">{API_DESCRIPTION}</p>

					<Badge className="w-fit rounded-md font-mono text-sm text-muted" size="lg">
						<span className="font-bold text-status-success">BASE</span>
						{API_BASE_URL}
					</Badge>
				</div>

				<Button variant="outline" startIcon={Lock}>
					Авторизоваться
				</Button>
			</div>

			<div className="space-y-5">
				{API_DATA.map((group) => (
					<ApiGroupSection group={group} key={group.tag} />
				))}
			</div>
		</div>
	);
}
