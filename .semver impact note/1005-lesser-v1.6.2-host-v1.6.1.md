# Minor — consume canonical Lesser article HTML and refresh upstream pins

Greater now pins Lesser v1.6.2 and Lesser Host v1.6.1, regenerates GraphQL and REST artifacts from those exact releases, and accepts Lesser's optional `Article.renderedHtml` field in the Blog face display input. When present, canonical server HTML is preferred over raw source and passes through Greater's existing defense-in-depth sanitizer; when absent, Greater does not render Markdown into public HTML.

The FaceTheory development pin also advances to the verified v4.0.6 release asset. Existing Blog inputs, component behavior, theming tokens, accessibility semantics, and Mastodon-compatible surfaces remain supported.
