/**
 * Commission Pattern
 *
 * Factory for commission workflow management.
 *
 * @module @equaltoai/greater-components-artist/patterns/commission
 */

// import type { CommissionData } from '../types/index.js';
import type {
	CommissionPatternConfig,
	CommissionPatternHandlers,
	CommissionStep,
	CommissionRole,
	PatternFactoryResult,
} from './types.js';
import {
	createPatternId,
	createLoadingState,
	setLoading,
	setSuccess,
	setError,
	type LoadingStateData,
} from './utils.js';

// ============================================================================
// Commission Step Definitions
// ============================================================================

/**
 * Step order for commission workflow
 */
export const COMMISSION_STEP_ORDER: CommissionStep[] = [
	'inquiry',
	'quote',
	'agreement',
	'payment',
	'progress',
	'review',
	'revision',
	'delivery',
	'complete',
];

/**
 * Steps available for each role
 */
export const ROLE_STEPS: Record<CommissionRole, CommissionStep[]> = {
	artist: ['quote', 'progress', 'delivery', 'complete'],
	client: ['inquiry', 'agreement', 'payment', 'review', 'revision'],
};

/**
 * Step validation requirements
 */
export interface StepValidation {
	/** Required fields for this step */
	requiredFields: string[];
	/** Validation function */
	validate: (data: Record<string, unknown>) => boolean;
	/** Error message if validation fails */
	errorMessage: string;
}

/**
 * Step validations
 */
export const STEP_VALIDATIONS: Partial<Record<CommissionStep, StepValidation>> = {
	inquiry: {
		requiredFields: ['description', 'budget'],
		validate: (data) => Boolean(data['description'] && data['budget']),
		errorMessage: 'Please provide a description and budget for your commission request.',
	},
	quote: {
		requiredFields: ['amount', 'timeline', 'deliverables'],
		validate: (data) => Boolean(data['amount'] && data['timeline'] && data['deliverables']),
		errorMessage: 'Please provide quote amount, timeline, and deliverables.',
	},
	agreement: {
		requiredFields: ['accepted'],
		validate: (data) => data['accepted'] === true,
		errorMessage: 'Please accept the terms to proceed.',
	},
	payment: {
		requiredFields: ['paymentMethod'],
		validate: (data) => Boolean(data['paymentMethod']),
		errorMessage: 'Please select a payment method.',
	},
};

// ============================================================================
// Commission Pattern State
// ============================================================================

/**
 * Commission pattern state
 */
export interface CommissionPatternState {
	/** Pattern instance ID */
	id: string;
	/** Current step */
	currentStep: CommissionStep;
	/** Completed steps */
	completedSteps: CommissionStep[];
	/** Step data */
	stepData: Record<CommissionStep, Record<string, unknown>>;
	/** Validation errors */
	validationErrors: Record<string, string>;
	/** Loading state for async operations */
	operationState: LoadingStateData<string>;
	/** Whether commission is cancelled */
	isCancelled: boolean;
	/** Notification queue */
	pendingNotifications: string[];
}

// ============================================================================
// Commission Pattern Factory
// ============================================================================

/**
 * Create commission pattern instance
 *
 * @example
 * ```typescript
 * const commission = createCommissionPattern({
 *   role: 'artist',
 *   commission: existingCommission,
 *   onStepComplete: (step, data) => saveProgress(step, data),
 *   onCancel: () => handleCancel(),
 * }, {
 *   onQuoteSubmit: async (amount, details) => { ... },
 *   onProgressUpdate: async (update, media) => { ... },
 * });
 * ```
 */
export function createCommissionPattern(
	config: CommissionPatternConfig,
	handlers: Partial<CommissionPatternHandlers> = {}
): PatternFactoryResult<CommissionPatternConfig, CommissionPatternHandlers> {
	const id = createPatternId('commission');

	// Determine initial step based on existing commission
	const getInitialStep = (): CommissionStep => {
		if (!config.commission) return 'inquiry';

		const statusToStep: Record<string, CommissionStep> = {
			inquiry: 'inquiry',
			quoted: 'quote',
			accepted: 'agreement',
			'in-progress': 'progress',
			review: 'review',
			revision: 'revision',
			completed: 'complete',
		};

		return statusToStep[config.commission.status] || 'inquiry';
	};

	// Initialize state
	const state: CommissionPatternState = {
		id,
		currentStep: getInitialStep(),
		completedSteps: [],
		stepData: {
			inquiry: {},
			quote: {},
			agreement: {},
			payment: {},
			progress: {},
			review: {},
			revision: {},
			delivery: {},
			complete: {},
		},
		validationErrors: {},
		operationState: createLoadingState<string>(),
		isCancelled: false,
		pendingNotifications: [],
	};

	// Populate completed steps from existing commission
	if (config.commission) {
		const currentIndex = COMMISSION_STEP_ORDER.indexOf(state.currentStep);
		state.completedSteps = COMMISSION_STEP_ORDER.slice(0, currentIndex);
	}

	// Validate step data
	const validateStep = (step: CommissionStep): boolean => {
		const validation = STEP_VALIDATIONS[step];
		if (!validation) return true;

		const data = state.stepData[step];
		const isValid = validation.validate(data);

		if (!isValid) {
			state.validationErrors[step] = validation.errorMessage;
		} else {
			delete state.validationErrors[step];
		}

		return isValid;
	};

	// Update step data
	const updateStepData = (step: CommissionStep, data: Record<string, unknown>) => {
		state.stepData[step] = { ...state.stepData[step], ...data };
		validateStep(step);
	};

	// Complete current step
	const completeStep = async (data?: Record<string, unknown>) => {
		if (data) {
			updateStepData(state.currentStep, data);
		}

		if (!validateStep(state.currentStep)) {
			throw new Error(state.validationErrors[state.currentStep]);
		}

		state.operationState = setLoading(state.operationState);

		try {
			// Call step complete handler
			config.onStepComplete(state.currentStep, state.stepData[state.currentStep]);

			// Mark step as completed
			if (!state.completedSteps.includes(state.currentStep)) {
				state.completedSteps.push(state.currentStep);
			}

			// Queue notification if enabled
			if (config.enableNotifications) {
				state.pendingNotifications.push(`Step ${state.currentStep} completed`);
			}

			// Move to next step
			const currentIndex = COMMISSION_STEP_ORDER.indexOf(state.currentStep);
			const nextStep = COMMISSION_STEP_ORDER[currentIndex + 1];

			if (nextStep) {
				state.currentStep = nextStep;
			}

			state.operationState = setSuccess(state.operationState, 'completed');
		} catch (error) {
			state.operationState = setError(state.operationState, error as Error);
			throw error;
		}
	};

	// Go to specific step
	const goToStep = (step: CommissionStep) => {
		const stepIndex = COMMISSION_STEP_ORDER.indexOf(step);
		const currentIndex = COMMISSION_STEP_ORDER.indexOf(state.currentStep);

		// Can only go back to completed steps or current step
		if (stepIndex <= currentIndex || state.completedSteps.includes(step)) {
			state.currentStep = step;
		}
	};

	// Cancel commission
	const cancel = () => {
		state.isCancelled = true;
		config.onCancel();
	};

	// Get step progress
	const getProgress = (): number => {
		const totalSteps = COMMISSION_STEP_ORDER.length;
		const completedCount = state.completedSteps.length;
		return Math.round((completedCount / totalSteps) * 100);
	};

	// Check if step is accessible
	const isStepAccessible = (step: CommissionStep): boolean => {
		if (state.completedSteps.includes(step)) return true;
		if (step === state.currentStep) return true;
		return false;
	};

	// Check if step is for current role
	const isStepForRole = (step: CommissionStep): boolean => {
		return ROLE_STEPS[config.role].includes(step);
	};

	// Persist progress to storage
	const persistProgress = () => {
		if (!config.enablePersistence) return;

		const progressData = {
			currentStep: state.currentStep,
			completedSteps: state.completedSteps,
			stepData: state.stepData,
		};

		try {
			localStorage.setItem(`commission-${id}`, JSON.stringify(progressData));
		} catch {
			// Storage not available
		}
	};

	// Load progress from storage
	const loadProgress = () => {
		if (!config.enablePersistence) return;

		try {
			const stored = localStorage.getItem(`commission-${id}`);
			if (stored) {
				const progressData = JSON.parse(stored);
				state.currentStep = progressData.currentStep;
				state.completedSteps = progressData.completedSteps;
				state.stepData = progressData.stepData;
			}
		} catch {
			// Storage not available or invalid data
		}
	};

	// Initialize with persisted data
	loadProgress();

	// Cleanup function
	const destroy = () => {
		persistProgress();
	};

	// Compose handlers
	const composedHandlers: CommissionPatternHandlers = {
		onQuoteSubmit: async (amount, details) => {
			updateStepData('quote', { amount, details });
			await handlers.onQuoteSubmit?.(amount, details);
			await completeStep();
		},
		onAgreementAccept: async () => {
			updateStepData('agreement', { accepted: true });
			await handlers.onAgreementAccept?.();
			await completeStep();
		},
		onPaymentProcess: async (milestoneId) => {
			updateStepData('payment', { milestoneId, processed: true });
			await handlers.onPaymentProcess?.(milestoneId);
			await completeStep();
		},
		onProgressUpdate: async (update, media) => {
			await handlers.onProgressUpdate?.(update, media);
		},
		onRevisionRequest: async (feedback) => {
			updateStepData('revision', { feedback });
			await handlers.onRevisionRequest?.(feedback);
		},
		onDelivery: async (files) => {
			updateStepData('delivery', { files });
			await handlers.onDelivery?.(files);
			await completeStep();
		},
	};

	return {
		config,
		handlers: composedHandlers,
		get state() {
			return {
				...state,
				completeStep,
				goToStep,
				cancel,
				getProgress,
				isStepAccessible,
				isStepForRole,
				updateStepData,
				validateStep,
				persistProgress,
			};
		},
		destroy,
	};
}

// ============================================================================
// Commission Pattern Helpers
// ============================================================================

/**
 * Get step display name
 */
export function getStepDisplayName(step: CommissionStep): string {
	const names: Record<CommissionStep, string> = {
		inquiry: 'Commission Request',
		quote: 'Quote & Pricing',
		agreement: 'Terms Agreement',
		payment: 'Payment',
		progress: 'Work in Progress',
		review: 'Review',
		revision: 'Revisions',
		delivery: 'Final Delivery',
		complete: 'Complete',
	};

	return names[step];
}

/**
 * Get step description
 */
export function getStepDescription(step: CommissionStep, role: CommissionRole): string {
	const descriptions: Record<CommissionStep, Record<CommissionRole, string>> = {
		inquiry: {
			artist: 'Review the commission request from the client.',
			client: 'Describe what you would like commissioned.',
		},
		quote: {
			artist: 'Provide a quote with pricing and timeline.',
			client: 'Review the quote from the artist.',
		},
		agreement: {
			artist: 'Wait for the client to accept the terms.',
			client: 'Review and accept the commission terms.',
		},
		payment: {
			artist: 'Wait for payment to be processed.',
			client: 'Complete payment to begin the commission.',
		},
		progress: {
			artist: 'Share progress updates with the client.',
			client: "Follow along with the artist's progress.",
		},
		review: {
			artist: 'Wait for the client to review the work.',
			client: 'Review the completed work.',
		},
		revision: {
			artist: 'Make requested revisions.',
			client: 'Request any needed revisions.',
		},
		delivery: {
			artist: 'Deliver the final files.',
			client: 'Receive the final deliverables.',
		},
		complete: {
			artist: 'Commission completed successfully!',
			client: 'Commission completed successfully!',
		},
	};

	return descriptions[step][role];
}
