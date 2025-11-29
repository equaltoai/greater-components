/**
 * Types for Compose components
 */

export type MediaCategory = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'GIFV' | 'DOCUMENT';

export interface MediaAttachment {
	id: string;
	type: 'image' | 'video' | 'audio' | 'gifv';
	url: string;
	previewUrl?: string;
	description?: string;
	sensitive?: boolean;
	spoilerText?: string | null;
	mediaCategory?: MediaCategory;
	blurhash?: string;
	meta?: {
		width?: number;
		height?: number;
		duration?: number;
	};
}

