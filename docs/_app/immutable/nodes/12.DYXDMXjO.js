import{D as e,G as t,H as n,J as r,P as i,S as a,T as o,Y as s,c,lt as l,q as u,ut as d,v as f,w as p,z as m}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as h}from"../chunks/D7myQBsm.js";import{n as g,t as _}from"../chunks/6XEBy_O6.js";import{t as v}from"../chunks/BZWRhQF3.js";var y=e(`<meta name="description" content="Guidance for wiring Greater Components profile surfaces including ProfileHeader, tabbed feeds, and edit modals."/>`),b=e(`<li><strong><code> </code></strong> </li>`),x=e(`<li> </li>`),S=e(`<li><code> </code> </li>`),C=e(`<section><h2>Packages in play</h2> <ul></ul></section> <section><h2>ProfileHeader props</h2> <!> <p>Follow/edit interactions flow through <code>Profile.Root</code> context handlers. In the demo
			we trigger a local modal (<code>#snippet ProfileActionSnippet</code>) rather than remote
			requests.</p></section> <section><h2>Usage snippet</h2> <!></section> <section><h2>Accessibility</h2> <!></section> <section><h2>Performance considerations</h2> <ul></ul></section> <section><h2>Testing references</h2> <ul></ul></section>`,1);function w(e){let w=[{name:`account`,type:`UnifiedAccount`,required:!0,description:`Profile payload (display name, avatar, header, counts) rendered in the header.`},{name:`showBanner`,type:`boolean`,default:`true`,description:`Controls the masthead gradient / cover image.`},{name:`showBio`,type:`boolean`,default:`true`,description:`Toggles the sanitized note/bio region.`},{name:`showFields`,type:`boolean`,default:`true`,description:`Displays metadata fields + verified badges pulled from account.emojis.`},{name:`showCounts`,type:`boolean`,default:`true`,description:"Followers/following/posts summary (wire to `clickableCounts` for interactive stats)."},{name:`clickableCounts`,type:`boolean`,default:`false`,description:`Wraps counts in buttons and wires onFollowersClick/onFollowingClick callbacks.`},{name:`followButton`,type:`Snippet`,description:`Optional slot used for the “Edit profile” button inside the demo.`},{name:`emojiRenderer`,type:`(text: string) => string`,description:`Custom renderer for server-provided emoji; accepts sanitized HTML.`}],T=[{name:`@equaltoai/greater-components-social`,detail:`ProfileHeader, StatusCard, Tabs snippets, and Followers/Following utilities.`},{name:`@equaltoai/greater-components-primitives`,detail:`Button, Avatar, Skeleton, Modal, TextField, and TextArea for edit flows.`},{name:`@equaltoai/greater-components-icons`,detail:`Used inside ProfileHeader actions and pinned cards.`}],E={wcagLevel:`AA`,keyboardNav:!0,screenReader:!0,colorContrast:!0,focusManagement:!0,ariaSupport:!0,reducedMotion:!0,notes:[`Connections lists announce follow state changes via aria-live.`,`Tabs use roving tabindex + arrow key handlers (tested via keyboard automation).`,`Edit profile modal traps focus and labels inputs with visible text.`,'Skeleton state for media gallery uses `role="img"` with `data-index` for deterministic announcements.'],axeScore:100},D=[`Pinned StatusCard instances reuse comfortable density tokens to stay under 30KB hydrated.`,'Media gallery defers image loads with `loading="lazy"` and exposes skeleton placeholders.',`Connections list items are capped to 6 per column to avoid layout thrash on mobile.`,`Profile edit modal relies on local state only; no network calls occur in the demo.`],O=[{label:`packages/testing/tests/demo/profile.spec.ts`,detail:`Keyboard navigation coverage for Tabs plus aria-live assertions on follow toggles.`},{label:`apps/playground/src/routes/profile/+page.svelte`,detail:`Source of snippets listed above and home for pinned status fixtures.`}];f(`1ca68pt`,e=>{var n=y();m(()=>{t.title=`Profile Demo Documentation - Greater Components`}),o(e,n)}),v(e,{eyebrow:`Demo Suite`,title:`Profile application`,description:`End-to-end profile surface with editable bio, pinned statuses, and tabbed feeds. Mirrors the Phase 4 /profile route.`,children:(e,t)=>{var f=C(),m=r(f),v=s(u(m),2);a(v,5,()=>T,e=>e.name,(e,t)=>{var r=b(),a=u(r),c=u(a),l=u(c,!0);d(c),d(a);var f=s(a);d(r),n(()=>{p(l,i(t).name),p(f,` — ${i(t).detail??``}`)}),o(e,r)}),d(v),d(m);var y=s(m,2);g(s(u(y),2),{get props(){return w}}),l(2),d(y);var k=s(y,2);h(s(u(k),2),{language:`svelte`,code:`<script lang="ts">
  import { ProfileHeader, StatusCard } from '@equaltoai/greater-components-social';
  import { Tabs, Button, Modal, TextField, TextArea } from '@equaltoai/greater-components-primitives';
  import { getDemoProfile, getPinnedStatuses } from '$lib/data/fediverse';

  let profile = $state(getDemoProfile());
  let showEditModal = $state(false);

  const tabList = [
    { id: 'posts', label: 'Posts', content: PostsTab },
    { id: 'media', label: 'Media', content: MediaTab },
    { id: 'likes', label: 'Likes', content: LikesTab }
  ] as const;
  let activeTab = $state(tabList[0].id);
<\/script>

<ProfileHeader account={profile} showFields showActions followButton={ProfileActionSnippet} />

<Tabs tabs={tabList} activeTab={activeTab} onTabChange={(id) => activeTab = id} />

<Modal bind:open={showEditModal} title="Edit profile">
  <form class="edit-form">
    <TextField label="Display name" bind:value={profile.displayName} required />
    <TextArea label="Bio" rows={4} bind:value={bioDraft} />
    <div class="modal-footer">
      <Button variant="ghost" onclick={() => showEditModal = false}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Modal>

{#snippet ProfileActionSnippet()}
  <Button size="sm" variant="solid" onclick={() => showEditModal = true}>
    Edit profile
  </Button>
{/snippet}`}),d(k);var A=s(k,2);_(s(u(A),2),c(()=>E)),d(A);var j=s(A,2),M=s(u(j),2);a(M,7,()=>D,(e,t)=>`${t}-${e}`,(e,t)=>{var r=x(),a=u(r,!0);d(r),n(()=>p(a,i(t))),o(e,r)}),d(M),d(j);var N=s(j,2),P=s(u(N),2);a(P,5,()=>O,e=>e.label,(e,t)=>{var r=S(),a=u(r),c=u(a,!0);d(a);var l=s(a);d(r),n(()=>{p(c,i(t).label),p(l,` — ${i(t).detail??``}`)}),o(e,r)}),d(P),d(N),o(e,f)},$$slots:{default:!0}})}export{w as component};