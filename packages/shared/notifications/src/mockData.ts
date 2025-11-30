import type { Account, Notification, Status } from './types.js';

const baseAccount: Account = {
	id: '1',
	username: 'user',
	acct: 'user@example.com',
	displayName: 'Example User',
	avatar: 'https://placehold.co/48x48',
	url: 'https://example.com/@user',
	createdAt: new Date().toISOString(),
};

function createAccount(index: number): Account {
	return {
		...baseAccount,
		id: `account-${index}`,
		username: `user${index}`,
		acct: `user${index}@example.com`,
		displayName: `User ${index}`,
		avatar: `https://placehold.co/48x48?text=U${index}`,
		url: `https://example.com/@user${index}`,
	};
}

function createStatus(account: Account, index: number, type: Notification['type']): Status {
	return {
		id: `${type}-status-${index}`,
		createdAt: new Date().toISOString(),
		content: `<p>Status content ${index} for ${type}</p>`,
		account,
		visibility: 'public',
		sensitive: false,
		mediaAttachments: [],
	};
}

export function generateMockNotifications(count: number): Notification[] {
	const types: Notification['type'][] = [
		'mention',
		'reblog',
		'favourite',
		'follow',
		'follow_request',
		'poll',
		'status',
		'update',
		'admin.sign_up',
		'admin.report',
	];

	return Array.from({ length: count }, (_, index) => {
		const account = createAccount(index);
		const type = types[index % types.length];
		const common = {
			id: `notification-${index}`,
			account,
			createdAt: new Date(Date.now() - index * 60000).toISOString(),
			read: index % 3 === 0 ? false : true,
			dismissed: false,
		};

		switch (type) {
			case 'mention':
				return {
					...common,
					type,
					status: createStatus(account, index, type),
				} satisfies Notification;
			case 'reblog':
			case 'favourite':
			case 'poll':
			case 'status':
			case 'update':
				return {
					...common,
					type,
					status: createStatus(account, index, type),
				} as Notification;
			case 'follow':
			case 'follow_request':
				return {
					...common,
					type,
				} as Notification;
			case 'admin.sign_up':
				return {
					...common,
					type,
				} as Notification;
			case 'admin.report':
				return {
					...common,
					type,
					report: {
						id: `report-${index}`,
						targetAccount: createAccount(index + 1000),
						comment: 'Report reason',
					},
				} as Notification;
			default:
				return {
					...common,
					type: 'status',
					status: createStatus(account, index, 'status'),
				} as Notification;
		}
	});
}
