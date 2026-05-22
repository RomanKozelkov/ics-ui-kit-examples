const cache = new Map<string, string>();
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;
let snapshot: { values: Map<string, string> } = { values: cache };

function read(name: string): string {
	if (typeof document === "undefined") return "";
	const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return v;
}

function invalidate() {
	cache.clear();
	snapshot = { values: cache };
	for (const l of listeners) l();
}

function ensureObserver() {
	if (observer || typeof document === "undefined") return;
	observer = new MutationObserver(invalidate);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "style"]
	});
}

export function subscribe(listener: () => void): () => void {
	ensureObserver();
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && observer) {
			observer.disconnect();
			observer = null;
		}
	};
}

export function getToken(name: string): string {
	let v = cache.get(name);
	if (v === undefined) {
		v = read(name);
		cache.set(name, v);
	}
	return v;
}

export function getSnapshotVersion(): object {
	return snapshot;
}

export function getServerSnapshot(): object {
	return snapshot;
}
