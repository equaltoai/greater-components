export type TimelineTypeOption = 'home' | 'local' | 'federated';

export function toTimelineType(type: TimelineTypeOption = 'home'): 'HOME' | 'LOCAL' | 'PUBLIC' {
	return type === 'federated' ? 'PUBLIC' : (type.toUpperCase() as 'HOME' | 'LOCAL');
}
