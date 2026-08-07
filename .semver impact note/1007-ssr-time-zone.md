# Minor — allow SSR-stable absolute date labels

`formatDateTime` now accepts an optional IANA `timeZone`. Consumers can pin server and browser
rendering to the same zone without changing the existing local-time default, preventing visible
timestamp flips during hydration.

Existing calls and return values remain supported.
