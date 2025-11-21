<script lang="ts">
	import {
		Badge,
		List,
		ListItem,
		GradientText,
		StepIndicator,
		IconBadge,
		Section,
		Heading,
		Container,
		Card,
		Button,
		Text,
	} from '@equaltoai/greater-components-primitives';
	import {
		CheckIcon,
		XIcon,
		ArrowRightIcon,
		SettingsIcon,
		TargetIcon,
	} from '@equaltoai/greater-components-icons';

	// State for StepIndicator demo
	let currentStep = $state(1);
	const totalSteps = 4;

	function nextStep() {
		if (currentStep < totalSteps + 1) currentStep++;
	}

	function resetSteps() {
		currentStep = 1;
	}

	function getStepState(step: number) {
		if (step < currentStep) return 'completed';
		if (step === currentStep) return 'active';
		return 'pending';
	}
</script>

<Container maxWidth="lg" padding="md">
	<Heading level={1} class="mb-8">Phase 2: Core Components</Heading>

	<!-- Badge Demo -->
	<Section spacing="lg">
		<Heading level={2} class="mb-4">Badge Component</Heading>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card padding="md">
				<Heading level={3} size="sm" class="mb-4">Variants</Heading>
				<div class="flex flex-wrap gap-4 items-center">
					<Badge variant="pill" label="Pill (Default)" description="With description" />
					<Badge variant="dot" label="Dot" />
					<Badge variant="outlined" label="Outlined" />
					<Badge variant="filled" label="Filled" />
				</div>
			</Card>
			<Card padding="md">
				<Heading level={3} size="sm" class="mb-4">Colors</Heading>
				<div class="flex flex-wrap gap-4">
					<Badge color="primary" label="Primary" />
					<Badge color="success" label="Success" />
					<Badge color="warning" label="Warning" />
					<Badge color="error" label="Error" />
					<Badge color="info" label="Info" />
					<Badge color="gray" label="Gray" />
				</div>
			</Card>
			<Card padding="md">
				<Heading level={3} size="sm" class="mb-4">Sizes</Heading>
				<div class="flex flex-wrap gap-4 items-end">
					<Badge size="sm" label="Small" />
					<Badge size="md" label="Medium" />
					<Badge size="lg" label="Large" />
				</div>
			</Card>
		</div>
	</Section>

	<!-- GradientText Demo -->
	<Section spacing="lg">
		<Heading level={2} class="mb-4">GradientText Component</Heading>
		<Card padding="lg">
			<div class="flex flex-col gap-4">
				<Heading level={3} size="3xl">
					<GradientText gradient="primary">Primary Gradient Heading</GradientText>
				</Heading>
				<Heading level={3} size="2xl">
					<GradientText gradient="success">Success Gradient</GradientText>
				</Heading>
				<Heading level={3} size="xl">
					<GradientText gradient="warning">Warning Gradient</GradientText>
				</Heading>
				<Heading level={3} size="lg">
					<GradientText gradient="custom" from="#FF0080" to="#7928CA" direction="to right">
						Custom Gradient (Pink to Purple)
					</GradientText>
				</Heading>
			</div>
		</Card>
	</Section>

	<!-- List Demo -->
	<Section spacing="lg">
		<Heading level={2} class="mb-4">List Component</Heading>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card padding="md">
				<Heading level={3} size="sm" class="mb-4">With ListItem (Auto Icons)</Heading>
				<List icon={CheckIcon} iconColor="success" spacing="md">
					<ListItem>Define precise scopes for enterprise software</ListItem>
					<ListItem>Capture domain knowledge efficiently</ListItem>
					<ListItem>Transform requirements into code</ListItem>
				</List>
			</Card>

			<Card padding="md">
				<Heading level={3} size="sm" class="mb-4">Override Icons</Heading>
				<List spacing="md">
					<ListItem icon={CheckIcon} iconColor="success">Completed Task</ListItem>
					<ListItem icon={XIcon} iconColor="error">Failed Task</ListItem>
					<ListItem icon={ArrowRightIcon} iconColor="primary">Next Task</ListItem>
				</List>
			</Card>
		</div>
	</Section>

	<!-- IconBadge Demo -->
	<Section spacing="lg">
		<Heading level={2} class="mb-4">IconBadge Component</Heading>
		<Card padding="md">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
				<div class="flex flex-col gap-2 items-center">
					<IconBadge icon={TargetIcon} size="sm" />
					<Text size="xs">Small</Text>
				</div>
				<div class="flex flex-col gap-2 items-center">
					<IconBadge icon={TargetIcon} size="md" color="success" />
					<Text size="xs">Medium</Text>
				</div>
				<div class="flex flex-col gap-2 items-center">
					<IconBadge icon={TargetIcon} size="lg" color="warning" variant="outlined" />
					<Text size="xs">Large Outlined</Text>
				</div>
				<div class="flex flex-col gap-2 items-center">
					<IconBadge icon={TargetIcon} size="xl" color="error" shape="square" />
					<Text size="xs">XL Square</Text>
				</div>
			</div>
		</Card>
	</Section>

	<!-- StepIndicator Demo -->
	<Section spacing="lg">
		<Heading level={2} class="mb-4">StepIndicator Component</Heading>
		<Card padding="md">
			<div class="flex justify-between items-center mb-8 max-w-2xl mx-auto">
				<StepIndicator number={1} state={getStepState(1)} label="Start" />
				<div class="h-[2px] bg-gray-200 flex-1 mx-4"></div>
				<StepIndicator number={2} state={getStepState(2)} label="Details" />
				<div class="h-[2px] bg-gray-200 flex-1 mx-4"></div>
				<StepIndicator number={3} state={getStepState(3)} label="Review" />
				<div class="h-[2px] bg-gray-200 flex-1 mx-4"></div>
				<StepIndicator number={4} state={getStepState(4)} label="Done" />
			</div>

			<div class="flex justify-center gap-4">
				<Button variant="outline" onclick={resetSteps} disabled={currentStep === 1}>Reset</Button>
				<Button variant="solid" onclick={nextStep} disabled={currentStep > totalSteps}>
					{currentStep > totalSteps ? 'Finished' : 'Next Step'}
				</Button>
			</div>
		</Card>
	</Section>
</Container>

<style>
	/* Utility classes for demo styling */
	.mb-4 {
		margin-bottom: 1rem;
	}
	.mb-8 {
		margin-bottom: 2rem;
	}
	.grid {
		display: grid;
	}
	.gap-4 {
		gap: 1rem;
	}
	.gap-8 {
		gap: 2rem;
	}
	.flex {
		display: flex;
	}
	.flex-col {
		flex-direction: column;
	}
	.flex-wrap {
		flex-wrap: wrap;
	}
	.items-center {
		align-items: center;
	}
	.items-end {
		align-items: flex-end;
	}
	.justify-between {
		justify-content: space-between;
	}
	.justify-center {
		justify-content: center;
	}
	.mx-auto {
		margin-left: auto;
		margin-right: auto;
	}
	.max-w-2xl {
		max-width: 42rem;
	}
	.flex-1 {
		flex: 1;
	}
	.mx-4 {
		margin-left: 1rem;
		margin-right: 1rem;
	}
	.h-\[2px\] {
		height: 2px;
	}
	.bg-gray-200 {
		background-color: var(--gr-color-gray-200);
	}

	@media (min-width: 768px) {
		.md\:grid-cols-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.md\:grid-cols-4 {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
