import { beforeEach, vi } from 'vitest';

type AnimateKeyframes = Keyframe[] | PropertyIndexedKeyframes;

function normalizeKeyframes(keyframes: AnimateKeyframes): Keyframe[] {
	return Array.isArray(keyframes) ? keyframes : [keyframes as unknown as Keyframe];
}

function normalizeOptions(
	options?: number | KeyframeAnimationOptions
): KeyframeAnimationOptions | undefined {
	if (typeof options === 'number') return { duration: options };
	return options;
}

function createMockAnimation(
	element: Element,
	keyframes: Keyframe[],
	options: KeyframeAnimationOptions
) {
	let currentKeyframes = keyframes;

	const animation: Animation & {
		__grKeyframes?: Keyframe[];
		__grOptions?: KeyframeAnimationOptions;
	} = {
		effect: {
			setKeyframes(next: AnimateKeyframes) {
				currentKeyframes = normalizeKeyframes(next);
				animation.__grKeyframes = currentKeyframes;
			},
		} as unknown as AnimationEffect,
		currentTime: null,
		playbackRate: 1,
		ready: Promise.resolve({} as Animation),
		finished: Promise.resolve({} as Animation),
		id: '',
		pause: vi.fn(),
		play: vi.fn(),
		reverse: vi.fn(),
		finish: vi.fn(),
		cancel: vi.fn(),
		updatePlaybackRate: vi.fn(),
		persist: vi.fn(),
		commitStyles: vi.fn(),
		onfinish: null,
		oncancel: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
		__grKeyframes: currentKeyframes,
		__grOptions: options,
	} as unknown as Animation & {
		__grKeyframes?: Keyframe[];
		__grOptions?: KeyframeAnimationOptions;
	};

	(element as unknown as { __grLastAnimation?: unknown }).__grLastAnimation = animation;

	return animation;
}

const animateMock = vi.fn(function (
	this: Element,
	keyframes: AnimateKeyframes,
	options?: number | KeyframeAnimationOptions
) {
	const normalizedKeyframes = normalizeKeyframes(keyframes);
	const normalizedOptions = normalizeOptions(options) ?? {};
	return createMockAnimation(this, normalizedKeyframes, normalizedOptions);
});

Object.defineProperty(Element.prototype, 'animate', {
	value: animateMock,
	writable: true,
});

beforeEach(() => {
	animateMock.mockClear();
});
