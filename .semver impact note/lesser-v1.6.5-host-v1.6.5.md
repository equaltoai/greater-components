# Minor — pin Lesser v1.6.5 and Lesser Host v1.6.5

Pinned snapshots now target Lesser `v1.6.5` (`a1eb3c6740bd5aca99273130e2b52d3c4c5775ea`)
and Lesser Host `v1.6.5` (`500ce1b24d4e02ce8eddff7797f4d1524898ce84`). Generated
GraphQL/OpenAPI artifacts and Registry checksums are regenerated from those immutable releases.
The Lesser delta adds agent share-grant management endpoints, an optional `X-Lesser-Act-As`
header on 14 operations, additive `agent_attribution.acted_by`, and nullable `actedBy: Actor`
on `Draft`/`Article`. The Lesser Host delta adds the optional `actedBy` caller-attribution
field to the soul-comm send contract and the additive soul instance-recovery agent endpoints.
All changes are additive; no adapter or component API breaks.
