/**
 * Custom Face Type Definitions
 */

export interface CustomCardData {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	author: {
		id: string;
		name: string;
		avatar?: string;
	};
}

export interface CustomCardConfig {
	showAuthor?: boolean;
	showTimestamp?: boolean;
	maxContentLength?: number;
	variant?: 'default' | 'compact' | 'featured';
}

export interface CustomCardHandlers {
	onAction?: (action: string, data: CustomCardData) => void;
	onSelect?: (data: CustomCardData) => void;
}
