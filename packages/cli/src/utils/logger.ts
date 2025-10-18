type LogPayload = string | number | boolean | null | undefined;

const stringify = (message: LogPayload = ''): string => {
	if (message === null || message === undefined) {
		return '';
	}

	return String(message);
};

const ensureTrailingNewline = (message: string): string => {
	if (message === '') {
		return '\n';
	}

	return message.endsWith('\n') ? message : `${message}\n`;
};

const writeTo = (stream: NodeJS.WriteStream) => (message?: LogPayload): void => {
	const output = ensureTrailingNewline(stringify(message));
	stream.write(output);
};

const writeStdout = writeTo(process.stdout);
const writeStderr = writeTo(process.stderr);

export const logger = {
	info: (message?: LogPayload): void => {
		writeStdout(message);
	},
	success: (message?: LogPayload): void => {
		writeStdout(message);
	},
	note: (message?: LogPayload): void => {
		writeStdout(message);
	},
	warn: (message?: LogPayload): void => {
		writeStderr(message);
	},
	error: (message?: LogPayload): void => {
		writeStderr(message);
	},
	newline: (): void => {
		writeStdout('');
	},
};

export type Logger = typeof logger;
