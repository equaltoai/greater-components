# Minor — pin Lesser v1.6.3 article search contracts

Greater now pins the exact Lesser v1.6.3 release and regenerates its GraphQL types. The generated
`QueryArticlesArgs` surface gains the optional `search` argument for Lesser's case-insensitive public
article-text search.

Existing article queries, Blog inputs, Mastodon-compatible behavior, and Lesser Host v1.6.1 pin remain
supported.
