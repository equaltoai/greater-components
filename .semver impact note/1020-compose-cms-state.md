# Minor — model Lesser CMS draft workflow state in Compose

`ComposeState` additively exposes optional `cmsDraft` identity, lifecycle, revision, review, and
server-computed publication eligibility fields. Existing social-compose consumers do not need to
provide the new state.
