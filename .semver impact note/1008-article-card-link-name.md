# Patch — give article cards a concise accessible link name

`ArticleCard` now places its single link around the article title while retaining the full-card
pointer target through a stretched pseudo-element. Date, author, reading-time, tag, and excerpt text
no longer inflate or duplicate the link's accessible name.

The component props, keyboard access, focus indicator, and visual card target remain supported.
