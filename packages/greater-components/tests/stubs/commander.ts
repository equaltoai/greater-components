export class Command {
	command() {
		return this;
	}
	description() {
		return this;
	}
	action() {
		return this;
	}
	parseAsync() {
		return Promise.resolve();
	}
}
