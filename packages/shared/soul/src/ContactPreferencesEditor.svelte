<!--
  Soul.ContactPreferencesEditor - Editor UI for lesser-soul v3 contact preferences
-->
<script lang="ts">
	import {
		Button,
		Card,
		Heading,
		SettingsField,
		Switch,
		Text,
		TextField,
	} from '@equaltoai/greater-components-primitives';

	import type { SoulContactPreferences } from './types.js';

	type Channel = SoulContactPreferences['preferred'];
	type Window = NonNullable<NonNullable<SoulContactPreferences['availability']['windows']>[number]>;
	type RateLimits = NonNullable<SoulContactPreferences['rateLimits']>;
	type EmailSmsRateLimits = NonNullable<RateLimits['email']>;
	type VoiceRateLimits = NonNullable<RateLimits['voice']>;
	type EmailSmsRateLimitKey = keyof EmailSmsRateLimits;
	type VoiceRateLimitKey = keyof VoiceRateLimits;

	interface Props {
		value: SoulContactPreferences | null;
		disabled?: boolean;
		title?: string;
		class?: string;
		onchange?: (value: SoulContactPreferences | null) => void;
	}

	let {
		value = $bindable(null),
		disabled = false,
		title = 'Edit contact preferences',
		class: className = '',
		onchange,
	}: Props = $props();

	const CHANNELS: Array<{ value: Channel; label: string }> = [
		{ value: 'email', label: 'Email' },
		{ value: 'sms', label: 'SMS' },
		{ value: 'voice', label: 'Voice' },
		{ value: 'activitypub', label: 'ActivityPub' },
		{ value: 'mcp', label: 'MCP' },
	];

	const SCHEDULES: Array<{
		value: SoulContactPreferences['availability']['schedule'];
		label: string;
	}> = [
		{ value: 'always', label: 'Always' },
		{ value: 'business-hours', label: 'Business hours' },
		{ value: 'custom', label: 'Custom' },
	];

	const GUARANTEES: Array<{
		value: SoulContactPreferences['responseExpectation']['guarantee'];
		label: string;
	}> = [
		{ value: 'best-effort', label: 'Best effort' },
		{ value: 'guaranteed', label: 'Guaranteed' },
	];

	const DAYS: Array<{
		value: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
		label: string;
	}> = [
		{ value: 'mon', label: 'Mon' },
		{ value: 'tue', label: 'Tue' },
		{ value: 'wed', label: 'Wed' },
		{ value: 'thu', label: 'Thu' },
		{ value: 'fri', label: 'Fri' },
		{ value: 'sat', label: 'Sat' },
		{ value: 'sun', label: 'Sun' },
	];

	function setValue(next: SoulContactPreferences | null) {
		value = next;
		onchange?.(next);
	}

	function ensureValue(): SoulContactPreferences {
		if (value) return value;

		const defaults: SoulContactPreferences = {
			preferred: 'email',
			fallback: 'activitypub',
			availability: {
				schedule: 'always',
				timezone: 'UTC',
				windows: null,
			},
			responseExpectation: {
				target: '1h',
				guarantee: 'best-effort',
			},
			languages: ['en'],
			contentTypes: ['text/plain'],
			firstContact: {
				requireSoul: false,
				requireReputation: null,
				introductionExpected: true,
			},
		};

		setValue(defaults);
		return defaults;
	}

	function update<K extends keyof SoulContactPreferences>(
		key: K,
		next: SoulContactPreferences[K]
	): void {
		const current = ensureValue();
		setValue({ ...current, [key]: next });
	}

	function updateAvailability(partial: Partial<SoulContactPreferences['availability']>) {
		const current = ensureValue();
		update('availability', { ...current.availability, ...partial });
	}

	function updateResponseExpectation(
		partial: Partial<SoulContactPreferences['responseExpectation']>
	) {
		const current = ensureValue();
		update('responseExpectation', { ...current.responseExpectation, ...partial });
	}

	function updateFirstContact(
		partial: Partial<NonNullable<SoulContactPreferences['firstContact']>>
	) {
		const current = ensureValue();
		const defaults: NonNullable<SoulContactPreferences['firstContact']> = {
			requireSoul: false,
			requireReputation: null,
			introductionExpected: true,
		};
		update('firstContact', { ...defaults, ...(current.firstContact ?? {}), ...partial });
	}

	function parseCsv(input: string): string[] {
		return input
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
	}

	function parseLanguages(input: string): string[] {
		const tokens = parseCsv(input).map((t) => t.toLowerCase());
		return Array.from(new Set(tokens.filter((t) => /^[a-z]{2}$/.test(t))));
	}

	function updateLanguages(input: string) {
		const current = ensureValue();
		const parsed = parseLanguages(input);
		update('languages', parsed.length ? parsed : current.languages);
	}

	function updateContentTypes(input: string) {
		const next = parseCsv(input);
		update('contentTypes', next.length ? next : undefined);
	}

	function addWindow() {
		const current = ensureValue();
		const windows = current.availability.windows ? [...current.availability.windows] : [];
		windows.push({ days: ['mon'], startTime: '09:00', endTime: '17:00' } as Window);
		updateAvailability({ windows });
	}

	function removeWindow(index: number) {
		const current = ensureValue();
		const windows = (current.availability.windows ? [...current.availability.windows] : []).filter(
			(_, i) => i !== index
		);
		updateAvailability({ windows: windows.length ? windows : null });
	}

	function setWindow(index: number, next: Window) {
		const current = ensureValue();
		const windows = current.availability.windows ? [...current.availability.windows] : [];
		windows[index] = next;
		updateAvailability({ windows });
	}

	function toggleWindowDay(index: number, day: Window['days'][number], checked: boolean) {
		const current = ensureValue();
		const windows = current.availability.windows ? [...current.availability.windows] : [];
		const win = windows[index];
		if (!win) return;
		const days = new Set<Window['days'][number]>(win.days ?? []);
		if (checked) days.add(day);
		else days.delete(day);
		const nextDays = Array.from(days);
		setWindow(index, { ...win, days: (nextDays.length ? nextDays : [day]) as Window['days'] });
	}

	function setRateLimit(
		path: ['email' | 'sms', 'maxInboundPerHour' | 'maxInboundPerDay'],
		raw: string
	) {
		const current = ensureValue();
		const num = raw.trim() === '' ? undefined : Number(raw);
		const next =
			Number.isFinite(num) && num !== undefined ? Math.max(1, Math.floor(num)) : undefined;

		const rateLimits: RateLimits = { ...(current.rateLimits ?? {}) };
		const channel = path[0];
		const key = path[1] satisfies EmailSmsRateLimitKey;
		const channelLimits: EmailSmsRateLimits = { ...(rateLimits[channel] ?? {}) };

		if (next === undefined) delete channelLimits[key];
		else channelLimits[key] = next;

		if (Object.keys(channelLimits).length === 0) delete rateLimits[channel];
		else rateLimits[channel] = channelLimits;

		update('rateLimits', Object.keys(rateLimits).length ? rateLimits : undefined);
	}

	function setVoiceRateLimit(path: ['maxConcurrentCalls' | 'maxCallsPerDay'], raw: string) {
		const current = ensureValue();
		const num = raw.trim() === '' ? undefined : Number(raw);
		const next =
			Number.isFinite(num) && num !== undefined ? Math.max(1, Math.floor(num)) : undefined;

		const rateLimits: RateLimits = { ...(current.rateLimits ?? {}) };
		const key = path[0] satisfies VoiceRateLimitKey;
		const voiceLimits: VoiceRateLimits = { ...(rateLimits.voice ?? {}) };

		if (next === undefined) delete voiceLimits[key];
		else voiceLimits[key] = next;

		if (Object.keys(voiceLimits).length === 0) delete rateLimits.voice;
		else rateLimits.voice = voiceLimits;

		update('rateLimits', Object.keys(rateLimits).length ? rateLimits : undefined);
	}
</script>

<Card variant="outlined" padding="lg" class={`soul-preferences-editor ${className}`}>
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#snippet header()}
		<Heading level={3} size="lg" class="soul-preferences-editor__title">{title}</Heading>
	{/snippet}

	{#if !value}
		<Text size="sm" color="secondary">No preferences set.</Text>
		<div class="soul-preferences-editor__actions">
			<Button variant="outline" size="sm" {disabled} onclick={() => ensureValue()}>
				Create defaults
			</Button>
		</div>
	{:else}
		<div class="soul-preferences-editor__groups">
			<div class="soul-preferences-editor__group">
				<Text as="div" size="sm" weight="semibold" class="soul-preferences-editor__group-title"
					>Channel</Text
				>
				<Text as="div" size="sm" color="secondary" class="soul-preferences-editor__group-desc"
					>These are routing hints, not access control.</Text
				>
				<SettingsField label="Preferred channel">
					<select
						class="soul-preferences-editor__select"
						{disabled}
						value={value.preferred}
						onchange={(e) =>
							update('preferred', (e.currentTarget as HTMLSelectElement).value as Channel)}
					>
						{#each CHANNELS as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</SettingsField>

				<SettingsField label="Fallback channel" description="Used when preferred is unavailable.">
					<select
						class="soul-preferences-editor__select"
						{disabled}
						value={value.fallback ?? ''}
						onchange={(e) => {
							const raw = (e.currentTarget as HTMLSelectElement).value;
							update('fallback', raw ? (raw as Channel) : undefined);
						}}
					>
						<option value="">None</option>
						{#each CHANNELS as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</SettingsField>
			</div>

			<div class="soul-preferences-editor__group">
				<Text as="div" size="sm" weight="semibold" class="soul-preferences-editor__group-title"
					>Availability</Text
				>
				<Text as="div" size="sm" color="secondary" class="soul-preferences-editor__group-desc"
					>Outside windows, messages are queued by the gateway.</Text
				>
				<SettingsField label="Schedule">
					<select
						class="soul-preferences-editor__select"
						{disabled}
						value={value.availability.schedule}
						onchange={(e) => {
							const current = ensureValue();
							const schedule = (e.currentTarget as HTMLSelectElement)
								.value as SoulContactPreferences['availability']['schedule'];
							updateAvailability({
								schedule,
								windows: schedule === 'custom' ? (current.availability.windows ?? []) : null,
							});
						}}
					>
						{#each SCHEDULES as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</SettingsField>

				<SettingsField
					label="Timezone"
					description="IANA timezone (e.g. America/New_York). Required when schedule is not always."
				>
					<TextField
						value={value.availability.timezone ?? ''}
						{disabled}
						placeholder="UTC"
						oninput={(e) =>
							updateAvailability({
								timezone: (e.currentTarget as HTMLInputElement).value.trim() || undefined,
							})}
					/>
				</SettingsField>

				{#if value.availability.schedule === 'custom'}
					<div class="soul-preferences-editor__windows">
						<div class="soul-preferences-editor__windows-header">
							<Text size="sm" weight="medium">Windows</Text>
							<Button variant="outline" size="sm" {disabled} onclick={addWindow}>Add window</Button>
						</div>

						{#if !value.availability.windows?.length}
							<Text size="sm" color="secondary">No windows defined.</Text>
						{:else}
							{#each value.availability.windows as win, i (i)}
								<div class="soul-preferences-editor__window">
									<div class="soul-preferences-editor__window-days" role="group" aria-label="Days">
										{#each DAYS as d (d.value)}
											<label class="soul-preferences-editor__day">
												<input
													type="checkbox"
													{disabled}
													checked={win.days.includes(d.value)}
													onchange={(e) =>
														toggleWindowDay(
															i,
															d.value,
															(e.currentTarget as HTMLInputElement).checked
														)}
												/>
												<span>{d.label}</span>
											</label>
										{/each}
									</div>

									<div class="soul-preferences-editor__window-times">
										<label class="soul-preferences-editor__time">
											<span>Start</span>
											<input
												type="time"
												{disabled}
												value={win.startTime}
												onchange={(e) =>
													setWindow(i, {
														...win,
														startTime: (e.currentTarget as HTMLInputElement).value,
													})}
											/>
										</label>
										<label class="soul-preferences-editor__time">
											<span>End</span>
											<input
												type="time"
												{disabled}
												value={win.endTime}
												onchange={(e) =>
													setWindow(i, {
														...win,
														endTime: (e.currentTarget as HTMLInputElement).value,
													})}
											/>
										</label>
										<Button variant="ghost" size="sm" {disabled} onclick={() => removeWindow(i)}>
											Remove
										</Button>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				{/if}
			</div>

			<div class="soul-preferences-editor__group">
				<Text as="div" size="sm" weight="semibold" class="soul-preferences-editor__group-title"
					>Response expectation</Text
				>
				<SettingsField
					label="Target response time"
					description="Duration like 5m, 1h, 24h, or best-effort."
				>
					<TextField
						value={value.responseExpectation.target}
						{disabled}
						placeholder="1h"
						oninput={(e) =>
							updateResponseExpectation({
								target: (e.currentTarget as HTMLInputElement).value.trim(),
							})}
					/>
				</SettingsField>

				<SettingsField label="Guarantee">
					<select
						class="soul-preferences-editor__select"
						{disabled}
						value={value.responseExpectation.guarantee}
						onchange={(e) =>
							updateResponseExpectation({
								guarantee: (e.currentTarget as HTMLSelectElement)
									.value as SoulContactPreferences['responseExpectation']['guarantee'],
							})}
					>
						{#each GUARANTEES as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</SettingsField>
			</div>

			<div class="soul-preferences-editor__group">
				<Text as="div" size="sm" weight="semibold" class="soul-preferences-editor__group-title"
					>Rate limits</Text
				>
				<Text as="div" size="sm" color="secondary" class="soul-preferences-editor__group-desc"
					>Enforced by the gateway; exceeding limits is bounced.</Text
				>
				<div class="soul-preferences-editor__limits">
					<div class="soul-preferences-editor__limit-row">
						<Text size="sm" weight="medium">Email</Text>
						<input
							type="number"
							min="1"
							{disabled}
							placeholder="/hour"
							value={value.rateLimits?.email?.maxInboundPerHour ?? ''}
							oninput={(e) =>
								setRateLimit(
									['email', 'maxInboundPerHour'],
									(e.currentTarget as HTMLInputElement).value
								)}
						/>
						<input
							type="number"
							min="1"
							{disabled}
							placeholder="/day"
							value={value.rateLimits?.email?.maxInboundPerDay ?? ''}
							oninput={(e) =>
								setRateLimit(
									['email', 'maxInboundPerDay'],
									(e.currentTarget as HTMLInputElement).value
								)}
						/>
					</div>

					<div class="soul-preferences-editor__limit-row">
						<Text size="sm" weight="medium">SMS</Text>
						<input
							type="number"
							min="1"
							{disabled}
							placeholder="/hour"
							value={value.rateLimits?.sms?.maxInboundPerHour ?? ''}
							oninput={(e) =>
								setRateLimit(
									['sms', 'maxInboundPerHour'],
									(e.currentTarget as HTMLInputElement).value
								)}
						/>
						<input
							type="number"
							min="1"
							{disabled}
							placeholder="/day"
							value={value.rateLimits?.sms?.maxInboundPerDay ?? ''}
							oninput={(e) =>
								setRateLimit(
									['sms', 'maxInboundPerDay'],
									(e.currentTarget as HTMLInputElement).value
								)}
						/>
					</div>

					<div class="soul-preferences-editor__limit-row">
						<Text size="sm" weight="medium">Voice</Text>
						<input
							type="number"
							min="1"
							{disabled}
							placeholder="concurrent"
							value={value.rateLimits?.voice?.maxConcurrentCalls ?? ''}
							oninput={(e) =>
								setVoiceRateLimit(
									['maxConcurrentCalls'],
									(e.currentTarget as HTMLInputElement).value
								)}
						/>
						<input
							type="number"
							min="1"
							{disabled}
							placeholder="/day"
							value={value.rateLimits?.voice?.maxCallsPerDay ?? ''}
							oninput={(e) =>
								setVoiceRateLimit(['maxCallsPerDay'], (e.currentTarget as HTMLInputElement).value)}
						/>
					</div>
				</div>
			</div>

			<div class="soul-preferences-editor__group">
				<Text as="div" size="sm" weight="semibold" class="soul-preferences-editor__group-title"
					>Language and content</Text
				>
				<SettingsField
					label="Languages"
					description="Comma-separated ISO 639-1 codes (e.g. en, es)."
				>
					<TextField
						value={value.languages.join(', ')}
						{disabled}
						placeholder="en"
						oninput={(e) => updateLanguages((e.currentTarget as HTMLInputElement).value)}
					/>
				</SettingsField>

				<SettingsField label="Accepted content types" description="Comma-separated MIME types.">
					<TextField
						value={(value.contentTypes ?? ['text/plain']).join(', ')}
						{disabled}
						placeholder="text/plain"
						oninput={(e) => updateContentTypes((e.currentTarget as HTMLInputElement).value)}
					/>
				</SettingsField>
			</div>

			<div class="soul-preferences-editor__group">
				<Text as="div" size="sm" weight="semibold" class="soul-preferences-editor__group-title"
					>First contact policy</Text
				>
				<SettingsField
					label="Prefer soul senders"
					description="Non-soul senders are not blocked but receive lower priority."
				>
					<Switch
						checked={Boolean(value.firstContact?.requireSoul)}
						{disabled}
						onchange={(checked) => updateFirstContact({ requireSoul: checked })}
					/>
				</SettingsField>

				<SettingsField
					label="Introduction expected"
					description="If enabled, first-contact messages should include a statement of purpose."
				>
					<Switch
						checked={Boolean(value.firstContact?.introductionExpected)}
						{disabled}
						onchange={(checked) => updateFirstContact({ introductionExpected: checked })}
					/>
				</SettingsField>

				<SettingsField
					label="Reputation threshold"
					description="Minimum composite reputation score for priority handling (0–1)."
				>
					<input
						type="number"
						min="0"
						max="1"
						step="0.01"
						{disabled}
						value={value.firstContact?.requireReputation === null ||
						value.firstContact?.requireReputation === undefined
							? ''
							: value.firstContact.requireReputation}
						oninput={(e) => {
							const raw = (e.currentTarget as HTMLInputElement).value.trim();
							updateFirstContact({
								requireReputation: raw === '' ? null : Math.min(1, Math.max(0, Number(raw))),
							});
						}}
					/>
				</SettingsField>
			</div>
		</div>
	{/if}
</Card>

<style>
	:global(.soul-preferences-editor__title) {
		margin: 0;
	}

	.soul-preferences-editor__actions {
		margin-top: var(--gr-spacing-md, 1rem);
	}

	.soul-preferences-editor__groups {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.soul-preferences-editor__group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	:global(.soul-preferences-editor__group-title) {
		margin: 0;
	}

	:global(.soul-preferences-editor__group-desc) {
		margin: -0.5rem 0 0;
	}

	.soul-preferences-editor__select {
		width: 100%;
		min-width: 220px;
		border: 1px solid var(--gr-color-border, #e5e7eb);
		border-radius: var(--gr-radius-md, 0.5rem);
		background: var(--gr-color-bg, #fff);
		color: var(--gr-color-text, #111827);
		padding: 0.5rem 0.75rem;
		font: inherit;
	}

	.soul-preferences-editor__windows {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.soul-preferences-editor__windows-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.soul-preferences-editor__window {
		border: 1px solid var(--gr-color-border, #e5e7eb);
		border-radius: var(--gr-radius-md, 0.5rem);
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.soul-preferences-editor__window-days {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.75rem;
	}

	.soul-preferences-editor__day {
		display: inline-flex;
		gap: 0.35rem;
		align-items: center;
		font-size: 0.875rem;
		color: var(--gr-color-text, #111827);
	}

	.soul-preferences-editor__window-times {
		display: flex;
		align-items: end;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.soul-preferences-editor__time {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8125rem;
		color: var(--gr-color-text-muted, #6b7280);
	}

	.soul-preferences-editor__time input {
		border: 1px solid var(--gr-color-border, #e5e7eb);
		border-radius: var(--gr-radius-md, 0.5rem);
		padding: 0.4rem 0.6rem;
		font: inherit;
		color: var(--gr-color-text, #111827);
		background: var(--gr-color-bg, #fff);
	}

	.soul-preferences-editor__limits {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.soul-preferences-editor__limit-row {
		display: grid;
		grid-template-columns: 120px 1fr 1fr;
		gap: 0.5rem;
		align-items: center;
	}

	.soul-preferences-editor__limit-row input {
		border: 1px solid var(--gr-color-border, #e5e7eb);
		border-radius: var(--gr-radius-md, 0.5rem);
		padding: 0.4rem 0.6rem;
		font: inherit;
		color: var(--gr-color-text, #111827);
		background: var(--gr-color-bg, #fff);
		width: 100%;
	}

	@media (max-width: 640px) {
		.soul-preferences-editor__limit-row {
			grid-template-columns: 1fr;
		}
	}
</style>
