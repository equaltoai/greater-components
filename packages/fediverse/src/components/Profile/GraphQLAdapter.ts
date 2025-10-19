import type {
	ProfileContext,
	ProfileData,
	ProfileEditData,
	ProfileHandlers,
	ProfileRelationship,
	ProfileField,
} from './context.js';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

interface ProfileGraphQLAdapterOptions {
	context: ProfileContext;
	adapter: LesserGraphQLAdapter;
	username: string;
	pageSize?: number;
	isOwnProfile?: boolean;
}

interface RelationshipPayload {
	following?: boolean | null;
	followedBy?: boolean | null;
	blocking?: boolean | null;
	blockedBy?: boolean | null;
	muting?: boolean | null;
	mutingNotifications?: boolean | null;
	requested?: boolean | null;
	domainBlocking?: boolean | null;
	showingReblogs?: boolean | null;
	note?: string | null;
}

const EMPTY_RELATIONSHIP: ProfileRelationship = {
	following: false,
	followedBy: false,
	blocking: false,
	blockedBy: false,
	muting: false,
	mutingNotifications: false,
	requested: false,
	domainBlocking: false,
	endorsed: false,
	note: undefined,
};

/**
 * GraphQL-backed Profile controller that wires Profile components to the Lesser adapter.
 */
export class ProfileGraphQLController {
	private readonly context: ProfileContext;
	private readonly adapter: LesserGraphQLAdapter;
	private readonly pageSize: number;
	private username: string;
	private disposed = false;
	private initializing: Promise<void> | null = null;

	private currentProfileId: string | null = null;
	private followersLoading = false;
	private followingLoading = false;

	private readonly handlers: ProfileHandlers;

	constructor(options: ProfileGraphQLAdapterOptions) {
		this.context = options.context;
		this.adapter = options.adapter;
		this.username = options.username;
		this.pageSize = options.pageSize ?? 40;

		this.context.updateState({ isOwnProfile: options.isOwnProfile ?? false });

		this.handlers = {
			onFollow: (id) => this.followActor(id),
			onUnfollow: (id) => this.unfollowActor(id),
			onBlock: (id) => this.blockActor(id),
			onUnblock: (id) => this.unblockActor(id),
			onMute: (id, notifications) => this.muteActor(id, notifications),
			onUnmute: (id) => this.unmuteActor(id),
			onSave: (data) => this.updateProfile(data),
			onLoadMoreFollowers: () => this.loadFollowers(false),
			onLoadMoreFollowing: () => this.loadFollowing(false),
		};

		this.context.setHandlers(this.handlers);
	}

	/**
	 * Returns true when the controller already matches the provided configuration.
	 */
	matches(adapter: LesserGraphQLAdapter, username: string, pageSize: number): boolean {
		return this.adapter === adapter && this.username === username && this.pageSize === pageSize;
	}

	/**
	 * Update ownership state for the profile.
	 */
	setIsOwnProfile(isOwnProfile: boolean): void {
		this.context.updateState({ isOwnProfile });
	}

	/**
	 * Initialise profile data and hydrate followers/following lists.
	 */
	async initialize(): Promise<void> {
		if (this.initializing) {
			return this.initializing;
		}

		const promise = this.runInitialization();
		this.initializing = promise;
		try {
			await promise;
		} finally {
			this.initializing = null;
		}
	}

	private async runInitialization(): Promise<void> {
		this.context.updateState({
			loading: true,
			error: null,
			followers: [],
			followersLoading: true,
			followersCursor: null,
			followersTotal: undefined,
			following: [],
			followingLoading: true,
			followingCursor: null,
			followingTotal: undefined,
		});

		try {
			await this.loadProfile();
		} catch (error) {
			if (!this.disposed) {
				this.context.updateState({
					error: error instanceof Error ? error.message : 'Failed to load profile',
					loading: false,
					followersLoading: false,
					followingLoading: false,
				});
			}
			return;
		}

		await Promise.all([
			this.loadFollowers(true).catch((error) => {
				if (!this.disposed) {
					this.context.updateState({
						error: error instanceof Error ? error.message : 'Failed to load followers',
						followersLoading: false,
					});
				}
			}),
			this.loadFollowing(true).catch((error) => {
				if (!this.disposed) {
					this.context.updateState({
						error: error instanceof Error ? error.message : 'Failed to load following',
						followingLoading: false,
					});
				}
			}),
		]);

		if (!this.disposed) {
			this.context.updateState({ loading: false });
		}
	}

	/**
	 * Clean up controller resources.
	 */
	destroy(): void {
		this.disposed = true;
	}

	private ensureActive(): void {
		if (this.disposed) {
			throw new Error('Profile controller has been destroyed.');
		}
	}

	private async loadProfile(): Promise<void> {
		this.ensureActive();

		const actor = await this.adapter.getActorByUsername(this.username);
		if (!actor) {
			throw new Error('Profile not found');
		}

		const baseProfile = this.mapGraphQLActor(actor);
		if (!baseProfile) {
			throw new Error('Invalid profile payload received from server');
		}

		const relationshipPayload = await this.fetchRelationship(baseProfile.id);
		const relationship = relationshipPayload
			? this.mapRelationship(relationshipPayload)
			: this.context.state.profile?.relationship;

		const profile = relationship ? this.withRelationship(baseProfile, relationship) : baseProfile;
		this.currentProfileId = profile.id;

		this.context.updateState({
			profile,
			followersTotal: profile.followersCount,
			followersCursor: null,
			followers: [],
			followersLoading: true,
			followingTotal: profile.followingCount,
			followingCursor: null,
			following: [],
			followingLoading: true,
		});
	}

	private async fetchRelationship(actorId: string): Promise<RelationshipPayload | null> {
		try {
			const result = await this.adapter.getRelationship(actorId);
			return result ?? null;
		} catch (error) {
			console.warn('Failed to fetch relationship', error);
			return null;
		}
	}

	private async loadFollowers(reset: boolean): Promise<void> {
		this.ensureActive();
		if (this.followersLoading) {
			return;
		}

		if (!reset && !this.context.state.followersCursor) {
			return;
		}

		this.followersLoading = true;
		this.context.updateState({ followersLoading: true });

		try {
			const cursor = reset ? undefined : this.context.state.followersCursor ?? undefined;
			const response = await this.adapter.getFollowers(this.username, this.pageSize, cursor);
			const page = this.normalizeActorPage(response);

			const converted = page.actors
				.map((actor) => this.mapGraphQLActor(actor, EMPTY_RELATIONSHIP))
				.filter((account): account is ProfileData => Boolean(account));

			const merged = reset ? converted : [...this.context.state.followers, ...converted];

			this.context.updateState({
				followers: merged,
				followersCursor: page.nextCursor,
				followersTotal: page.totalCount,
				followersLoading: false,
			});
			this.syncProfileCounts('followersCount', page.totalCount);
		} finally {
			this.followersLoading = false;
		}
	}

	private async loadFollowing(reset: boolean): Promise<void> {
		this.ensureActive();
		if (this.followingLoading) {
			return;
		}

		if (!reset && !this.context.state.followingCursor) {
			return;
		}

		this.followingLoading = true;
		this.context.updateState({ followingLoading: true });

		try {
			const cursor = reset ? undefined : this.context.state.followingCursor ?? undefined;
			const response = await this.adapter.getFollowing(this.username, this.pageSize, cursor);
			const page = this.normalizeActorPage(response);

			const converted = page.actors
				.map((actor) => this.mapGraphQLActor(actor, EMPTY_RELATIONSHIP))
				.filter((account): account is ProfileData => Boolean(account));

			const merged = reset ? converted : [...this.context.state.following, ...converted];

			this.context.updateState({
				following: merged,
				followingCursor: page.nextCursor,
				followingTotal: page.totalCount,
				followingLoading: false,
			});
			this.syncProfileCounts('followingCount', page.totalCount);
		} finally {
			this.followingLoading = false;
		}
	}

	private async followActor(actorId: string): Promise<void> {
		this.ensureActive();
		await this.adapter.followActor(actorId);

		if (actorId === this.currentProfileId) {
			this.applyProfileRelationship({
				following: true,
				requested: false,
			});
			this.incrementProfileCount('followersCount', +1);
		}

		this.updateAccountRelationship('followers', actorId, { following: true, requested: false });
		this.updateAccountRelationship('following', actorId, { following: true, requested: false });
	}

	private async unfollowActor(actorId: string): Promise<void> {
		this.ensureActive();
		await this.adapter.unfollowActor(actorId);

		if (actorId === this.currentProfileId) {
			this.applyProfileRelationship({
				following: false,
				requested: false,
			});
			this.incrementProfileCount('followersCount', -1);
		}

		this.updateAccountRelationship('followers', actorId, { following: false, requested: false });
		this.updateAccountRelationship('following', actorId, { following: false, requested: false });
	}

	private async blockActor(actorId: string): Promise<void> {
		this.ensureActive();
		await this.adapter.blockActor(actorId);

		if (actorId === this.currentProfileId) {
			this.applyProfileRelationship({ blocking: true });
		}

		this.updateAccountRelationship('followers', actorId, { blocking: true });
		this.updateAccountRelationship('following', actorId, { blocking: true });
	}

	private async unblockActor(actorId: string): Promise<void> {
		this.ensureActive();
		await this.adapter.unblockActor(actorId);

		if (actorId === this.currentProfileId) {
			this.applyProfileRelationship({ blocking: false });
		}

		this.updateAccountRelationship('followers', actorId, { blocking: false });
		this.updateAccountRelationship('following', actorId, { blocking: false });
	}

	private async muteActor(actorId: string, notifications?: boolean): Promise<void> {
		this.ensureActive();
		await this.adapter.muteActor(actorId, notifications);

		const updates: Partial<ProfileRelationship> = {
			muting: true,
			mutingNotifications: Boolean(notifications),
		};

		if (actorId === this.currentProfileId) {
			this.applyProfileRelationship(updates);
		}

		this.updateAccountRelationship('followers', actorId, updates);
		this.updateAccountRelationship('following', actorId, updates);
	}

	private async unmuteActor(actorId: string): Promise<void> {
		this.ensureActive();
		await this.adapter.unmuteActor(actorId);

		const updates: Partial<ProfileRelationship> = {
			muting: false,
			mutingNotifications: false,
		};

		if (actorId === this.currentProfileId) {
			this.applyProfileRelationship(updates);
		}

		this.updateAccountRelationship('followers', actorId, updates);
		this.updateAccountRelationship('following', actorId, updates);
	}

	private async updateProfile(data: ProfileEditData): Promise<void> {
		this.ensureActive();

		const input = {
			displayName: data.displayName?.trim() || undefined,
			bio: data.bio?.trim() || undefined,
			avatar: typeof data.avatar === 'string' ? data.avatar : undefined,
			header: typeof data.header === 'string' ? data.header : undefined,
			fields: data.fields?.map((field) => ({
				name: field.name,
				value: field.value,
				verifiedAt: field.verifiedAt,
			})),
		};

		const updated = await this.adapter.updateProfile(input);
		const relationship = this.context.state.profile?.relationship ?? null;
		const profileBase = this.mapGraphQLActor(updated, relationship ?? undefined);
		if (!profileBase) {
			throw new Error('Received invalid profile payload after update');
		}

		const profile = relationship ? this.withRelationship(profileBase, relationship) : profileBase;

		this.context.updateState({
			profile,
			followersTotal: profile.followersCount,
			followingTotal: profile.followingCount,
		});
	}

	private normalizeActorPage(payload: unknown): {
		actors: unknown[];
		totalCount: number;
		nextCursor: string | null;
	} {
		if (!payload || typeof payload !== 'object') {
			return { actors: [], totalCount: 0, nextCursor: null };
		}

		const record = payload as Record<string, unknown>;
		const actorsValue = record['actors'];
		const actors = Array.isArray(actorsValue) ? actorsValue : [];
		const totalCountValue = record['totalCount'];
		const totalCount =
			typeof totalCountValue === 'number' ? totalCountValue : actors.length;
		const nextCursorValue = record['nextCursor'];
		const nextCursor =
			typeof nextCursorValue === 'string' && nextCursorValue.length > 0 ? nextCursorValue : null;

		return { actors, totalCount, nextCursor };
	}

	private mapGraphQLActor(
		actor: unknown,
		relationship?: ProfileRelationship | null
	): ProfileData | null {
		if (!actor || typeof actor !== 'object') {
			return null;
		}

		const record = actor as Record<string, unknown>;
		const idValue = record['id'];
		const usernameValue = record['username'];
		if (typeof idValue !== 'string' || typeof usernameValue !== 'string') {
			return null;
		}

		const displayNameValue = record['displayName'];
		const summaryValue = record['summary'];
		const avatarValue = record['avatar'];
		const headerValue = record['header'];
		const urlValue = record['url'];
		const followersValue = record['followers'];
		const followingValue = record['following'];
		const statusesCountValue = record['statusesCount'];
		const createdAtValue = record['createdAt'];
		const trustScoreValue = record['trustScore'];

		const fieldsValue = Array.isArray(record['fields']) ? record['fields'] : [];
		const fields: ProfileField[] = fieldsValue
			.map((field) => {
				if (!field || typeof field !== 'object') {
					return null;
				}

				const fieldRecord = field as Record<string, unknown>;
				const nameValue = fieldRecord['name'];
				const valueValue = fieldRecord['value'];
				const name = typeof nameValue === 'string' ? nameValue : '';
				const value = typeof valueValue === 'string' ? valueValue : '';
				if (!name && !value) {
					return null;
				}

				const verifiedAtValue = fieldRecord['verifiedAt'];
				const verifiedAt =
					typeof verifiedAtValue === 'string' ? verifiedAtValue : undefined;
				return {
					name,
					value,
					verifiedAt,
				} as ProfileField;
			})
			.filter((field): field is ProfileField => field !== null);

		const effectiveRelationship = relationship
			? this.cloneRelationship(relationship)
			: undefined;

		const profile: ProfileData = {
			id: idValue,
			username: usernameValue,
			displayName:
				typeof displayNameValue === 'string' && displayNameValue.length > 0
					? displayNameValue
					: usernameValue,
			bio:
				typeof summaryValue === 'string' && summaryValue.length > 0 ? summaryValue : undefined,
			avatar:
				typeof avatarValue === 'string' && avatarValue.length > 0 ? avatarValue : undefined,
			header:
				typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : undefined,
			url: typeof urlValue === 'string' && urlValue.length > 0 ? urlValue : undefined,
			followersCount: typeof followersValue === 'number' ? followersValue : 0,
			followingCount: typeof followingValue === 'number' ? followingValue : 0,
			statusesCount: typeof statusesCountValue === 'number' ? statusesCountValue : 0,
			fields,
			createdAt: typeof createdAtValue === 'string' ? createdAtValue : undefined,
			trustScore: typeof trustScoreValue === 'number' ? trustScoreValue : undefined,
			isFollowing: effectiveRelationship?.following ?? false,
			isFollowedBy: effectiveRelationship?.followedBy ?? false,
			isBlocked: effectiveRelationship?.blocking ?? false,
			isMuted: effectiveRelationship?.muting ?? false,
		};

		if (effectiveRelationship) {
			profile.relationship = effectiveRelationship;
		}

		return profile;
	}

	private withRelationship(profile: ProfileData, relationship: ProfileRelationship): ProfileData {
		const merged = this.cloneRelationship(relationship);
		return {
			...profile,
			relationship: merged,
			isFollowing: merged.following,
			isFollowedBy: merged.followedBy,
			isBlocked: merged.blocking,
			isMuted: merged.muting,
		};
	}

	private cloneRelationship(relationship: ProfileRelationship): ProfileRelationship {
		return { ...EMPTY_RELATIONSHIP, ...relationship };
	}

	private mapRelationship(relationship: RelationshipPayload): ProfileRelationship {
		return {
			following: Boolean(relationship.following),
			followedBy: Boolean(relationship.followedBy),
			blocking: Boolean(relationship.blocking),
			blockedBy: Boolean(relationship.blockedBy),
			muting: Boolean(relationship.muting),
			mutingNotifications: Boolean(relationship.mutingNotifications),
			requested: Boolean(relationship.requested),
			domainBlocking: Boolean(relationship.domainBlocking),
			endorsed: Boolean(relationship.showingReblogs),
			note: relationship.note ?? undefined,
		};
	}

	private updateAccountRelationship(
		listKey: 'followers' | 'following',
		accountId: string,
		updates: Partial<ProfileRelationship>
	): void {
		const list = listKey === 'followers' ? this.context.state.followers : this.context.state.following;
		const index = list.findIndex((account) => account.id === accountId);
		if (index === -1) {
			return;
		}

		const current = list[index];
		if (!current) {
			return;
		}

		const baseRelationship = current.relationship
			? this.cloneRelationship(current.relationship)
			: this.cloneRelationship(EMPTY_RELATIONSHIP);
		const nextRelationship = {
			...baseRelationship,
			...updates,
		};

		const updatedAccount: ProfileData = {
			...current,
			relationship: nextRelationship,
			isFollowing: nextRelationship.following,
			isFollowedBy: nextRelationship.followedBy,
			isBlocked: nextRelationship.blocking,
			isMuted: nextRelationship.muting,
		};

		const updatedList = [...list];
		updatedList[index] = updatedAccount;

		if (listKey === 'followers') {
			this.context.updateState({ followers: updatedList });
		} else {
			this.context.updateState({ following: updatedList });
		}
	}

	private applyProfileRelationship(updates: Partial<ProfileRelationship>): void {
		const profile = this.context.state.profile;
		if (!profile) return;

		const baseRelationship = profile.relationship
			? this.cloneRelationship(profile.relationship)
			: this.cloneRelationship(EMPTY_RELATIONSHIP);
		const relationship = { ...baseRelationship, ...updates };

		this.context.updateState({
			profile: {
				...profile,
				isFollowing: relationship.following,
				isFollowedBy: relationship.followedBy,
				isBlocked: relationship.blocking,
				isMuted: relationship.muting,
				relationship,
			},
		});
	}

	private incrementProfileCount(
		key: 'followersCount' | 'followingCount',
		delta: number
	): void {
		const profile = this.context.state.profile;
		if (!profile) return;

		const nextValue = Math.max(0, (profile[key] ?? 0) + delta);
		this.context.updateState({
			profile: {
				...profile,
				[key]: nextValue,
			},
			...(key === 'followersCount'
				? { followersTotal: nextValue }
				: { followingTotal: nextValue }),
		});
	}

	private syncProfileCounts(key: 'followersCount' | 'followingCount', value: number): void {
		const profile = this.context.state.profile;
		if (!profile) return;

		if (profile[key] === value) {
			this.context.updateState(
				key === 'followersCount' ? { followersTotal: value } : { followingTotal: value }
			);
			return;
		}

		this.context.updateState({
			profile: {
				...profile,
				[key]: value,
			},
			...(key === 'followersCount'
				? { followersTotal: value }
				: { followingTotal: value }),
		});
	}
}
