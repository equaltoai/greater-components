import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Content from '../../../src/components/Status/Content.svelte';

// Mock context
const mockStatus = {
    content: 'Hello world',
    spoilerText: '',
    mentions: [],
    tags: []
};

vi.mock('../../../src/components/Status/context.js', () => ({
    getStatusContext: () => ({
        actualStatus: mockStatus
    })
}));

describe('Status.Content', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders content using ContentRenderer by default', () => {
        render(Content);
        // ContentRenderer usually renders the HTML content directly or wrapped.
        // Assuming ContentRenderer outputs the text.
        expect(screen.getByText('Hello world')).toBeTruthy();
    });
});