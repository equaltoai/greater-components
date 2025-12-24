<script lang="ts">
  import {
    getCritiqueCircleContext,
    canModerate,
    canSubmit,
    canCritique,
    canInvite,
    canRemoveMember,
    calculateEstimatedWaitTime,
    formatWaitTime,
    getMemberBadge
  } from '../../../src/components/Community/CritiqueCircle/context';

  const ctx = getCritiqueCircleContext();

  const permissions = {
    moderate: canModerate(ctx),
    submit: canSubmit(ctx),
    critique: canCritique(ctx),
    invite: canInvite(ctx),
    removeMember: canRemoveMember(ctx)
  };

  const waitTime = calculateEstimatedWaitTime(5, 20); // 100 mins
  const formattedWait = formatWaitTime(waitTime);
  const badge = getMemberBadge('moderator');
</script>

<div data-testid="cc-context-consumer">
  <div data-testid="membership">{ctx.membership}</div>
  <div data-testid="can-moderate">{permissions.moderate}</div>
  <div data-testid="can-submit">{permissions.submit}</div>
  <div data-testid="can-critique">{permissions.critique}</div>
  <div data-testid="can-invite">{permissions.invite}</div>
  <div data-testid="can-remove">{permissions.removeMember}</div>
  
  <div data-testid="wait-time">{waitTime}</div>
  <div data-testid="formatted-wait">{formattedWait}</div>
  <div data-testid="badge-label">{badge.label}</div>
  <div data-testid="badge-color">{badge.color}</div>
</div>
