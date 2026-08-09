# Minor — expose SSR-stable article date formatting

`ArticleReader`, `ArticleCard`, and `formatArticleDateTime` now accept an optional IANA time zone so
SSR consumers can keep published-date labels stable through hydration. Existing local-zone defaults
remain unchanged.
