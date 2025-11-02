import { JSDOM } from 'jsdom';

let cachedDocument: Document | null = null;

function getDocument(): Document {
	if (!cachedDocument) {
		const { window } = new JSDOM('');
		cachedDocument = window.document;
	}
	return cachedDocument;
}

export function extractPlainText(html: string | undefined | null): string {
	if (!html) {
		return '';
	}

	const doc = getDocument();
	const container = doc.createElement('div');
	container.innerHTML = html;
	const textContent = container.textContent ?? '';
	container.textContent = '';
	return textContent;
}
