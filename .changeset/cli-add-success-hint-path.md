---
'@equaltoai/greater-components-cli': patch
---

Honor `--path` in the `greater add` success-message import hint. Previously the printed `import * as Shell from 'src/lib/components/shell';` hardcoded `config.aliases.components` (the components.json default), ignoring the `--path` argument that determined where the files actually landed. The hint now reflects the user-supplied `--path` when present. Reported as host FYI #1 during Project 41 PR-A review (#680).
