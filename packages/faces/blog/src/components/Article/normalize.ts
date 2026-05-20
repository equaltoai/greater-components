import type {
	ArticleData,
	ArticleInputData,
	ArticleInputAuthor,
	ArticleInputCategory,
	ArticleInputFeaturedImage,
	ArticleMetadata,
	AuthorData,
} from '../../types.js';

function hasObjectMetadata(article: ArticleInputData): article is ArticleData {
	return (
		'metadata' in article &&
		!!article.metadata &&
		typeof article.metadata === 'object' &&
		'title' in article.metadata &&
		'description' in article.metadata &&
		'publishedAt' in article.metadata
	);
}

function normalizeContentFormat(
	format: ArticleInputData['contentFormat']
): ArticleData['contentFormat'] {
	return String(format).toLowerCase() === 'html' ? 'html' : 'markdown';
}

function normalizeAuthor(author: AuthorData | ArticleInputAuthor): AuthorData {
	if ('name' in author && typeof author.name === 'string' && author.name.trim()) {
		return {
			id: author.id,
			name: author.name,
			username: author.username,
			bio: author.bio,
			shortBio: author.shortBio,
			avatar: author.avatar,
			coverImage: author.coverImage,
			socialLinks: author.socialLinks,
			publication: author.publication,
			articleCount: author.articleCount,
			followerCount: author.followerCount,
		};
	}

	const displayName = 'displayName' in author ? author.displayName : undefined;
	const username = 'username' in author ? author.username : undefined;
	const avatarUrl = 'avatarUrl' in author ? author.avatarUrl : undefined;

	return {
		id: author.id,
		name: displayName?.trim() || (username ? `@${username}` : 'Unknown author'),
		username,
		bio: author.bio,
		avatar: avatarUrl,
	};
}

function normalizeCategoryName(category: string | ArticleInputCategory): string {
	return typeof category === 'string' ? category : category.name;
}

function normalizeFeaturedImage(
	featuredImage: string | ArticleInputFeaturedImage | undefined
): Pick<ArticleMetadata, 'featuredImage' | 'featuredImageAlt' | 'featuredImageCaption'> {
	if (!featuredImage) {
		return {};
	}

	if (typeof featuredImage === 'string') {
		return { featuredImage };
	}

	return {
		featuredImage: featuredImage.url ?? featuredImage.src,
		featuredImageAlt: featuredImage.altText ?? featuredImage.alt,
		featuredImageCaption: featuredImage.caption,
	};
}

/**
 * Normalizes the canonical Greater `ArticleData` shape and the flat Lesser/Emdash
 * article display shape into the Blog face view model consumed by Article.* components.
 */
export function normalizeArticleData(article: ArticleInputData): ArticleData {
	if (hasObjectMetadata(article)) {
		return {
			...article,
			contentFormat: normalizeContentFormat(article.contentFormat),
			author: normalizeAuthor(article.author),
			metadata: {
				...article.metadata,
				description:
					article.metadata.description || article.metadata.subtitle || article.metadata.title,
			},
			isPublished: article.isPublished ?? true,
		};
	}

	const categories = article.categories?.map(normalizeCategoryName).filter(Boolean) ?? [];
	const tags = article.tags ?? article.metadata?.tags ?? categories;
	const featuredImage = normalizeFeaturedImage(article.featuredImage);
	const metadata: ArticleMetadata = {
		title: article.title ?? article.metadata?.title ?? 'Untitled article',
		subtitle: article.subtitle ?? article.metadata?.subtitle,
		description:
			article.description ??
			article.excerpt ??
			article.seoDescription ??
			article.metadata?.description ??
			article.subtitle ??
			article.title ??
			'Untitled article',
		publishedAt: article.publishedAt ?? article.metadata?.publishedAt ?? article.updatedAt ?? '',
		updatedAt: article.updatedAt ?? article.metadata?.updatedAt,
		readingTime: article.readingTimeMinutes ?? article.readingTime ?? article.metadata?.readingTime,
		wordCount: article.wordCount ?? article.metadata?.wordCount,
		canonicalUrl: article.canonicalUrl ?? article.metadata?.canonicalUrl,
		tags: [...tags],
		category: article.category ?? article.metadata?.category ?? categories[0],
		...featuredImage,
	};

	return {
		id: article.id,
		slug: article.slug,
		metadata,
		content: article.content,
		contentFormat: normalizeContentFormat(article.contentFormat),
		author: normalizeAuthor(article.author),
		publication: article.publication,
		isPublished: article.isPublished ?? true,
		isFeatured: article.isFeatured,
		viewCount: article.viewCount,
		reactions: article.reactions,
		commentCount: article.commentCount,
	};
}
