export function getStage(now, startedAt, endedAt) {
	now = new Date(now);
	startedAt = new Date(startedAt);
	endedAt = endedAt === null ? endedAt : new Date(endedAt);

	if (now < startedAt) {
		return 'waiting';
	}

	if (endedAt === null || now < endedAt) {
		return 'running';
	}

	if (now > endedAt) {
		return 'finished';
	}

	return 'error';
}

export function NullEndedAt() {
	return { date: '', time: '' };
}
