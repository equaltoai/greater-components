/**
 * Mock Commission Data
 *
 * Factory functions for generating sample commission data for tests.
 */

export type CommissionStatus =
	| 'inquiry'
	| 'quoted'
	| 'accepted'
	| 'in_progress'
	| 'revision'
	| 'completed'
	| 'cancelled';

export interface MockCommission {
	id: string;
	clientId: string;
	artistId: string;
	status: CommissionStatus;
	title: string;
	description: string;
	price?: number;
	currency: string;
	deadline?: string;
	messages: {
		id: string;
		senderId: string;
		content: string;
		timestamp: string;
	}[];
	attachments: {
		id: string;
		url: string;
		type: 'image' | 'document';
		name: string;
	}[];
	milestones: {
		id: string;
		title: string;
		completed: boolean;
		dueDate?: string;
	}[];
	createdAt: string;
	updatedAt: string;
}

/**
 * Creates a mock commission with default values
 */
export function createMockCommission(
	id: string,
	overrides: Partial<MockCommission> = {}
): MockCommission {
	return {
		id,
		clientId: `client-${id}`,
		artistId: `artist-${id}`,
		status: 'inquiry',
		title: `Commission ${id}`,
		description: `Commission request description for ${id}`,
		currency: 'USD',
		messages: [],
		attachments: [],
		milestones: [
			{ id: `m1-${id}`, title: 'Initial sketch', completed: false },
			{ id: `m2-${id}`, title: 'Line art', completed: false },
			{ id: `m3-${id}`, title: 'Final delivery', completed: false },
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		...overrides,
	};
}

/**
 * Creates a commission in progress with messages
 */
export function createMockCommissionInProgress(id: string): MockCommission {
	return createMockCommission(id, {
		status: 'in_progress',
		price: 250,
		deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
		messages: [
			{
				id: `msg1-${id}`,
				senderId: `client-${id}`,
				content: 'Hi, I would like to commission a portrait.',
				timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
			},
			{
				id: `msg2-${id}`,
				senderId: `artist-${id}`,
				content: 'Sure! I can do that. Here is my quote.',
				timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			},
		],
		milestones: [
			{ id: `m1-${id}`, title: 'Initial sketch', completed: true },
			{ id: `m2-${id}`, title: 'Line art', completed: false },
			{ id: `m3-${id}`, title: 'Final delivery', completed: false },
		],
	});
}

/**
 * Creates a list of mock commissions with various statuses
 */
export function createMockCommissionList(count: number): MockCommission[] {
	const statuses: CommissionStatus[] = [
		'inquiry',
		'quoted',
		'accepted',
		'in_progress',
		'revision',
		'completed',
	];
	return Array.from({ length: count }, (_, i) =>
		createMockCommission(`commission-${i + 1}`, {
			status: statuses[i % statuses.length],
		})
	);
}
