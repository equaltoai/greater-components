# Soul five-body hosted genesis contract

Status: Host-owned source contract for P53/G5B-3 + G5B-5 source side.

This contract defines the opt-in hosted genesis declaration schema used by Host
when `HOSTED_GENESIS_DECLARATION_SCHEMA_VERSION=v2` (or
`HOSTED_GENESIS_GUIDANCE_VERSION=v2`) is enabled for the MicroVM-backed hosted
conversation path. With the flag disabled, Host keeps the legacy v1 declaration
extraction and produced-declaration byte shape.

## Stable versions

- `schemaVersion`: `soul-five-body-schema.v2`
- `guidanceVersion`: `soul-five-body-guidance.v2`
- JSON Schema artifact: `docs/contracts/soul-five-body.schema.v2.json`
- Golden example fixture: `docs/contracts/soul-five-body.example.v2.json`

Body should consume these artifacts as the Host-owned source of truth for
G5B-4/G5B-5 prompts/resources. Body must not invent a parallel schema; if a
consumer needs a derived resource, it should pin these versions and render from
this contract.

## Shape

The v2 declaration has five first-class bodies:

1. `identity` — what the agent is, domain/local-id fit, voice, purpose, and the
   single definition of the named cadence.
2. `philosophy` — values, trade-offs, commitments, and decision posture.
3. `discipline` — operating discipline, evidence habits, escalation rules, and
   reference to the named cadence without restating it.
4. `boundaries` — scope limits, safety invariants, handoff triggers, and refusal
   categories.
5. `soul` — load-bearing commitments plus the refusal floor.

Satellites:

- `capabilities` — concrete self-declared capabilities only; every item uses
  `claimLevel: "self-declared"`. Host translates short human-readable provider
  evidence into a canonical 1–64 character lowercase identifier using ASCII
  letters/digits plus `.`, `_`, or `-`; scope is non-empty and bounded to 480
  characters. `lastValidated`, when present, is RFC3339. Capability validation
  metadata (`lastValidated`, `validationRef`, `degradesTo`) is optional and may
  be omitted when Host has no independent validation evidence.
- `transparency` — model/provider uncertainty, operational notes, and explicit
  self-declared notice.

## Independent caps

The schema caps each body summary at 2400 characters, each optional notes array
at eight items, each note/refusal field at 480 characters, and
`soul.refusals` at 3–8 items. These caps are intentionally independent of
capability and transparency satellites so a verbose capability list cannot
crowd out a body.

## Refusal floor

`soul.refusals` has `minItems >= 3`. Each refusal must name all three fields:

- `bypass` — the shortcut or bypass attempt being refused.
- `invariant` — the invariant that would be violated.
- `closestSafePath` — the safe path the agent will offer instead.

Generic refusals such as "unsafe requests", "policy violations", "bad things",
"be safe", or `n/a` fail validation with the stable field code
`soul.refusals.invalid`. Too few refusals fail with `soul.refusals.required`.

## Validation gates before `declaration_ready`

The v2 lane is fail-closed before `declaration_ready`:

- missing identity body → `five_body.identity.required`
- missing philosophy body → `five_body.philosophy.required`
- missing discipline body → `five_body.discipline.required`
- missing boundaries body → `five_body.boundaries.required`
- missing soul body → `five_body.soul.required`
- refusal floor missing → `soul.refusals.required`
- generic or incomplete refusal → `soul.refusals.invalid`
- missing/invalid independent review → `adversarial_review.required`

Host records a deterministic independent review evidence object with the shape
`findings[].finding`, `findings[].refutation`, and `findings[].report`. Unit
tests use a deterministic review pass; live provider canary of model-quality
adversarial review remains operator-owned deploy proof after merge.

## v1 mapping and fallback

With the flag disabled, v1 lanes are unaffected: Host sends the legacy four-area
interviewer prompt, uses the legacy extraction schema, and does not add v2
version fields to produced declarations or session checkpoints.

When v2 is enabled, Host stores both v2 evidence and the current publication
projection fields:

- `fiveBodies.identity.summary` maps to `selfDescription.purpose` when the model
  did not also provide a stronger compatible purpose.
- `fiveBodies.boundaries.summary` maps to `selfDescription.constraints`.
- `fiveBodies.philosophy.summary` maps to `selfDescription.commitments`.
- `fiveBodies.soul.summary` maps to `selfDescription.limitations`.
- `fiveBodies.soul.refusals[]` maps losslessly into Soul `boundaries[]` refusal
  rows by including the bypass, invariant, and closest safe path in the boundary
  statement/rationale.
- `capabilities` and `transparency` remain satellites and continue to populate
  the current registration publication pipeline.

The mapping is additive and lossless for hosted genesis evidence: the v2
`fiveBodies` object remains in the produced declaration evidence while existing
registration publication code can continue consuming `selfDescription`,
`capabilities`, `boundaries`, and `transparency`.

## Interview guidance

The v2 interviewer prompt builds in five phases: identity, philosophy,
discipline, boundaries, soul. Each phase requires a read-back and explicitly
forbids advancing with an empty body. The canonical final affirmation question
is unchanged:

> Do you affirm this declaration as the foundation of your minted soul? If there is anything here you would correct, qualify, or strike before it is inscribed, name it now.

The prompt preserves hosted/off-chain framing, `claimLevel: "self-declared"`
enum hygiene, prompt-injection hardening, and credential/token prohibitions.
