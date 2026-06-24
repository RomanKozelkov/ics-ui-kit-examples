import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "ics-ui-kit/components/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "ics-ui-kit/components/select";
// import { API_DATA } from "./data";
// import { ApiGroupSection } from "./components/ApiGroupSection";
import { Badge } from "ics-ui-kit/components/badge";

export const API_VERSIONS = ["v2.0", "v1.0"];
export const API_TITLE = "ICS-IT API";
export const API_DESCRIPTION = "REST API для управления пользователями, аутентификацией и каталогом товаров.";
export const API_BASE_URL = "https://api.ics-it.ru/v2";

export function OpenAPI() {
	const [version, setVersion] = useState(API_VERSIONS[0]);

	return (
		<div className="mx-auto flex max-w-5xl flex-col gap-5 bg-secondary-bg px-6 py-10">
			<div className="flex flex-row items-start justify-between border-b border-secondary-border pb-8">
				<div className="flex flex-col gap-2.5">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold text-primary-fg">{API_TITLE}</h1>

						<Select value={version} onValueChange={setVersion}>
							<SelectTrigger className="w-28">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{API_VERSIONS.map((v) => (
									<SelectItem key={v} value={v}>
										{v}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
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

			{/* <div className="space-y-5">
				{API_DATA.map((group) => (
					<ApiGroupSection group={group} key={group.tag} />
				))}
			</div> */}
		</div>
	);
}
