import { SubmitEventHandler, useState, type FormEvent } from "react";
import { Button } from "ics-ui-kit/components/button";
import { Field } from "ics-ui-kit/components/field";
import { TextInput, Input } from "ics-ui-kit/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { DialogBody, DialogFooter } from "ics-ui-kit/components/dialog";
import type { PromoCalendarItem } from "../../api/promo.types";
import { useText } from "../../i18n";
import { CHANNEL_OPTIONS, CLIENT_OPTIONS } from "./constants";

type PromoFormValues = Omit<PromoCalendarItem, "id">;

/**
 * Форма промо на простом локальном состоянии (без react-hook-form/zod)
 */
export function PromoForm({
	defaultValues,
	mode,
	pending,
	onSave,
	onDelete,
	onCancel
}: {
	defaultValues: PromoFormValues;
	mode: "create" | "edit";
	pending: boolean;
	onSave: (values: PromoFormValues) => void;
	onDelete?: () => void;
	onCancel: () => void;
}) {
	const text = useText();
	const [values, setValues] = useState<PromoFormValues>(defaultValues);

	const patch = (next: Partial<PromoFormValues>) => setValues((prev) => ({ ...prev, ...next }));

	const handleChannelChange = (value: string) => {
		patch({ channelName: value });
	};

	const handleClientChange = (companyName: string) => {
		patch({ companyName });
	};

	const handleSubmit: SubmitEventHandler = (e) => {
		e.preventDefault();
		onSave(values);
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogBody className="space-y-4">
				<Field
					layout="vertical"
					title={text("editor.titleLabel")}
					control={({ id }) => (
						<TextInput id={id} value={values.title} onChange={(value) => patch({ title: value ?? "" })} />
					)}
				/>
				<Field
					layout="vertical"
					title={text("editor.channelLabel")}
					control={({ id }) => (
						<Select value={values.channelName} onValueChange={handleChannelChange}>
							<SelectTrigger id={id}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CHANNEL_OPTIONS.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
				<Field
					layout="vertical"
					title={text("editor.clientLabel")}
					control={({ id }) => (
						<Select value={values.companyName} onValueChange={handleClientChange}>
							<SelectTrigger id={id}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CLIENT_OPTIONS.map((o) => (
									<SelectItem key={o.companyName} value={o.companyName}>
										{o.companyName}
									</SelectItem>
								))}
								1
							</SelectContent>
						</Select>
					)}
				/>
				<div className="flex gap-4">
					<Field
						layout="vertical"
						title={text("editor.dateBeginLabel")}
						control={({ id }) => (
							<Input
								id={id}
								type="date"
								value={values.dateBegin}
								onChange={(e) => patch({ dateBegin: e.target.value })}
							/>
						)}
					/>
					<Field
						layout="vertical"
						title={text("editor.dateEndLabel")}
						control={({ id }) => (
							<Input
								id={id}
								type="date"
								value={values.dateEnd}
								onChange={(e) => patch({ dateEnd: e.target.value })}
							/>
						)}
					/>
				</div>
			</DialogBody>

			<DialogFooter>
				{mode === "edit" && onDelete && (
					<Button
						type="button"
						variant="outline"
						status="error"
						className="mr-auto"
						disabled={pending}
						onClick={onDelete}
					>
						{text("editor.delete")}
					</Button>
				)}
				<Button type="button" variant="ghost" disabled={pending} onClick={onCancel}>
					{text("editor.cancel")}
				</Button>
				<Button type="submit" variant="primary" disabled={pending}>
					{text("editor.save")}
				</Button>
			</DialogFooter>
		</form>
	);
}
