import {
	ToggleGroup,
	ToggleGroupItem
} from "ics-ui-kit/components/toggle-group";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

interface CodeFile {
	fileName: string;
	language: string;
	code: string;
}

interface ComponentCodeProps {
	files: CodeFile[];
}

export function ComponentCode({ files }: ComponentCodeProps) {
	const [activeFile, setActiveFile] = useState(files[0]?.fileName ?? "");
	const [copied, setCopied] = useState(false);

	const current = files.find((f) => f.fileName === activeFile) ?? files[0];

	function handleCopy() {
		navigator.clipboard.writeText(current.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="border border-secondary-border bg-background-secondary font-mono text-sm">
			<div className="flex items-center justify-between px-2 py-1 border-b border-secondary-border">
				<ToggleGroup
					type="single"
					value={activeFile}
					onValueChange={(v) => {
						if (v) setActiveFile(v);
					}}
				>
					{files.map((file) => (
						<ToggleGroupItem
							key={file.fileName}
							value={file.fileName}
							className="text-xs font-mono rounded-none py-1 h-6"
						>
							{file.fileName}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>
			<div className="relative">
				<Highlight
					theme={themes.vsDark}
					code={current.code}
					language={current.language}
				>
					{({ style, tokens, getLineProps, getTokenProps }) => (
						<div
							className="resize-y overflow-auto min-h-[80px]"
							style={{ backgroundColor: style.backgroundColor }}
						>
							<pre
								className="p-4 text-xs font-mono"
								style={style}
							>
								{tokens.map((line, i) => (
									<div key={i} {...getLineProps({ line })}>
										{line.map((token, key) => (
											<span
												key={key}
												{...getTokenProps({ token })}
											/>
										))}
									</div>
								))}
							</pre>
						</div>
					)}
				</Highlight>
				<button
					onClick={handleCopy}
					className="absolute top-1 right-2 p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
				>
					{copied ? <Check size={16} /> : <Copy size={16} />}
				</button>
			</div>
		</div>
	);
}
