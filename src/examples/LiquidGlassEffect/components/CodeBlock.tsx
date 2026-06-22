import * as React from "react";
import { Button } from "ics-ui-kit/components/button";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ label, code }: { label: string; code: string }) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = React.useCallback(async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [code]);

	return (
		<div className="overflow-hidden rounded-2xl border border-secondary-border">
			<div className="flex items-center justify-between border-b border-secondary-border bg-secondary-bg px-4 py-2.5">
				<span className="text-xs font-medium text-secondary-fg">{label}</span>
				<Button size="xs" variant="secondary" className="gap-1.5" onClick={handleCopy}>
					{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
					{copied ? "Скопировано" : "Копировать"}
				</Button>
			</div>
			<pre className="overflow-x-auto bg-primary-bg p-4 font-mono text-xs leading-relaxed text-primary-fg">
				<code>{code}</code>
			</pre>
		</div>
	);
}
