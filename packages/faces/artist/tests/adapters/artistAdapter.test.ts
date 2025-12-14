import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createArtistAdapter } from '../../src/adapters/artistAdapter';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

describe('createArtistAdapter', () => {
	let baseAdapter: LesserGraphQLAdapter;
	let artistAdapter: ReturnType<typeof createArtistAdapter>;

	const mockQuery = vi.fn();
	const mockMutate = vi.fn();

	beforeEach(() => {
		mockQuery.mockReset();
		mockMutate.mockReset();

		baseAdapter = {
			query: mockQuery,
			mutate: mockMutate,
		} as unknown as LesserGraphQLAdapter;

		artistAdapter = createArtistAdapter(baseAdapter);
	});

	describe('Artwork Operations', () => {
		it('createArtwork calls mutation and returns artwork on success', async () => {
			const input = {
				title: 'Test Art',
				file: new File([''], 'test.png'),
				metadata: { medium: 'digital' },
			};
			const mockResponse = {
				createArtwork: {
					success: true,
					artwork: { id: '1', title: 'Test Art' },
				},
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.createArtwork(input);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { input });
			expect(result).toEqual(mockResponse.createArtwork.artwork);
		});

		it('createArtwork throws error when success is false', async () => {
			const input = {
				title: 'Test Art',
				file: new File([''], 'test.png'),
				metadata: { medium: 'digital' },
			};
			const mockResponse = {
				createArtwork: {
					success: false,
					errors: ['Invalid file'],
				},
			};
			mockMutate.mockResolvedValue(mockResponse);

			await expect(artistAdapter.createArtwork(input)).rejects.toThrow('Invalid file');
		});

		it('updateArtwork calls mutation and returns artwork on success', async () => {
			const id = '1';
			const input = { title: 'Updated Art' };
			const mockResponse = {
				updateArtwork: {
					success: true,
					artwork: { id: '1', title: 'Updated Art' },
				},
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.updateArtwork(id, input);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { id, input });
			expect(result).toEqual(mockResponse.updateArtwork.artwork);
		});

		it('updateArtwork throws error when success is false', async () => {
			const id = '1';
			const input = { title: 'Updated Art' };
			const mockResponse = {
				updateArtwork: {
					success: false,
					errors: ['Not found'],
				},
			};
			mockMutate.mockResolvedValue(mockResponse);

			await expect(artistAdapter.updateArtwork(id, input)).rejects.toThrow('Not found');
		});

		it('deleteArtwork calls mutation and returns success boolean', async () => {
			const id = '1';
			const mockResponse = {
				deleteArtwork: {
					success: true,
					deletedId: '1',
				},
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.deleteArtwork(id);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { id });
			expect(result).toBe(true);
		});

		it('getArtwork calls query and returns artwork', async () => {
			const id = '1';
			const mockResponse = {
				artwork: { id: '1', title: 'Test Art' },
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.getArtwork(id);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), { id });
			expect(result).toEqual(mockResponse.artwork);
		});

		it('getArtworks calls query with options', async () => {
			const options = { first: 10, after: 'abc' };
			const mockResponse = {
				artworks: { edges: [] },
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.getArtworks(options);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), options);
			expect(result).toEqual(mockResponse.artworks);
		});
	});

	describe('Discovery Operations', () => {
		it('discoverArtworks calls query with filter', async () => {
			const filter = { medium: 'digital' };
			const options = { first: 10 };
			const mockResponse = {
				discoverArtworks: { edges: [] },
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.discoverArtworks(filter, options);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), { filter, ...options });
			expect(result).toEqual(mockResponse.discoverArtworks);
		});

		it('searchArtworks calls query with query string', async () => {
			const query = 'landscape';
			const filter = { medium: 'oil' };
			const mockResponse = {
				searchArtworks: { edges: [] },
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.searchArtworks(query, filter);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), { query, filter });
			expect(result).toEqual(mockResponse.searchArtworks);
		});

		it('colorSearch calls query with colors', async () => {
			const colors = ['#FF0000'];
			const options = { tolerance: 10 };
			const mockResponse = {
				colorSearch: { edges: [] },
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.colorSearch(colors, options);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), {
				colors,
				tolerance: 10,
				mode: undefined,
				first: undefined,
				after: undefined,
			});
			expect(result).toEqual(mockResponse.colorSearch);
		});

		it('getSimilarArtworks calls query', async () => {
			const artworkId = '1';
			const limit = 5;
			const mockResponse = {
				similarArtworks: [{ id: '2' }],
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.getSimilarArtworks(artworkId, limit);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), { artworkId, limit });
			expect(result).toEqual(mockResponse.similarArtworks);
		});
	});

	describe('Commission Operations', () => {
		it('createCommission calls mutation', async () => {
			const input = { artistId: '1', description: 'Portrait' };
			const mockResponse = {
				createCommissionRequest: { id: '1' },
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.createCommission(input);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { input });
			expect(result).toEqual(mockResponse.createCommissionRequest);
		});

		it('updateCommissionStatus delegates to specific methods', async () => {
			// Mock acceptQuote since updateCommissionStatus calls it
			const acceptQuoteSpy = vi.spyOn(artistAdapter, 'acceptQuote');
			acceptQuoteSpy.mockResolvedValue({ id: '1', status: 'ACCEPTED' } as any);

			await artistAdapter.updateCommissionStatus('1', 'ACCEPTED');

			expect(acceptQuoteSpy).toHaveBeenCalledWith('1');
		});

		it('updateCommissionStatus throws for unsupported status', async () => {
			await expect(artistAdapter.updateCommissionStatus('1', 'UNKNOWN' as any)).rejects.toThrow(
				'Direct status update to UNKNOWN not supported'
			);
		});
        
        it('updateCommissionStatus throws for DELIVERED status', async () => {
            await expect(artistAdapter.updateCommissionStatus('1', 'DELIVERED' as any)).rejects.toThrow(
                'Use deliverCommission() for delivery'
            );
        });

		it('submitQuote calls mutation', async () => {
			const commissionId = '1';
			const input = { price: { amount: 100, currency: 'USD' } };
			const mockResponse = {
				submitQuote: { id: '1' },
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.submitQuote(commissionId, input);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { commissionId, input });
			expect(result).toEqual(mockResponse.submitQuote);
		});

		it('acceptQuote calls mutation', async () => {
			const commissionId = '1';
			const mockResponse = {
				acceptQuote: { id: '1' },
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.acceptQuote(commissionId);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { commissionId });
			expect(result).toEqual(mockResponse.acceptQuote);
		});

		it('updateProgress calls mutation', async () => {
			const commissionId = '1';
			const input = { type: 'SKETCH' };
			const mockResponse = {
				updateProgress: { id: '1' },
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.updateProgress(commissionId, input);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { commissionId, input });
			expect(result).toEqual(mockResponse.updateProgress);
		});

		it('deliverCommission calls mutation', async () => {
			const commissionId = '1';
			const input = { files: [] };
			const mockResponse = {
				deliverCommission: { id: '1' },
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.deliverCommission(commissionId, input);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { commissionId, input });
			expect(result).toEqual(mockResponse.deliverCommission);
		});
	});

	describe('Profile Operations', () => {
		it('getArtistProfile calls query', async () => {
			const id = '1';
			const mockResponse = {
				artistProfile: { id: '1' },
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.getArtistProfile(id);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), { id });
			expect(result).toEqual(mockResponse.artistProfile);
		});

		it('updateArtistProfile calls mutation', async () => {
			const input = { statement: 'Hello' };
			const mockResponse = {
				updateArtistProfile: { id: '1' },
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.updateArtistProfile(input);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { input });
			expect(result).toEqual(mockResponse.updateArtistProfile);
		});

		it('updatePortfolioSections calls mutation', async () => {
			const sections = [{ id: '1', title: 'Paintings' }];
			const mockResponse = {
				updatePortfolioSections: sections,
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.updatePortfolioSections(sections);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { sections });
			expect(result).toEqual(mockResponse.updatePortfolioSections);
		});

		it('webFingerLookup calls query', async () => {
			const acct = 'user@domain';
			const mockResponse = {
				webFingerLookup: { id: '1' },
			};
			mockQuery.mockResolvedValue(mockResponse);

			const result = await artistAdapter.webFingerLookup(acct);

			expect(mockQuery).toHaveBeenCalledWith(expect.anything(), { acct });
			expect(result).toEqual(mockResponse.webFingerLookup);
		});

		it('followRemoteArtist calls mutation and returns boolean', async () => {
			const uri = 'https://example.com/user';
			const mockResponse = {
				followRemoteArtist: { success: true },
			};
			mockMutate.mockResolvedValue(mockResponse);

			const result = await artistAdapter.followRemoteArtist(uri);

			expect(mockMutate).toHaveBeenCalledWith(expect.anything(), { uri });
			expect(result).toBe(true);
		});
	});
});
