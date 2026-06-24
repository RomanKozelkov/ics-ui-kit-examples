export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ParameterOption {
	value: string;
	label: string;
}

export interface Parameter {
	name: string;
	type: string;
	location: string;
	description: string;
	required?: boolean;
	defaultValue?: string | number;
	placeholder?: string;
	help?: string;
	enum?: string[];
	options?: ParameterOption[];
}

export interface SchemaField {
	name: string;
	type: string;
}

export interface SchemaObject {
	type: string;
	fields?: SchemaField[];
}

export interface ResponseExample {
	label: string;
	json: string;
}

export interface ResponseCode {
	code: number;
	description: string;
	contentTypes?: string[];
	examples?: ResponseExample[];
	schema?: SchemaObject;
	acceptHelper?: boolean;
}

export interface RequestBody {
	contentType: string;
	example: string;
}

export interface Endpoint {
	method: HttpMethod;
	path: string;
	summary: string;
	description: string;
	parameters: Parameter[];
	responses: ResponseCode[];
	requestBody?: RequestBody;
	authLocked?: boolean;
}

export interface ApiGroup {
	tag: string;
	description: string;
	endpoints: Endpoint[];
}
