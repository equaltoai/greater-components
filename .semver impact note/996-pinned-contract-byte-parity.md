# Patch — enforce pinned contract byte parity

The staging validation path now resolves each recorded Lesser and Lesser Host release tag to its pinned commit and compares the complete mirrored contract file sets byte-for-byte, including the Lesser schema alias and Lesser Host v3 schemas/fixtures. Greater-owned pin, audit-baseline, and upstream-gap files are explicitly allowlisted; every other missing, extra, or changed snapshot file fails closed.

Runtime behavior, component APIs, the theming contract, and current pinned snapshot bytes are unchanged.
