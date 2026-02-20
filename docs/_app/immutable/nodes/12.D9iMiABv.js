import{a as n,f as c,s as l}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as z,f as j,s as t,c as o,$ as G,r as e,n as R,d as w,g as d}from"../chunks/HviJt0eG.js";import{e as y}from"../chunks/D809QS3d.js";import{h as U}from"../chunks/BIESLWc2.js";import{s as K}from"../chunks/CybMBw0E.js";import{D as N}from"../chunks/vGJJHm7z.js";import{P as I,A as O}from"../chunks/D3BlL-1y.js";import{C as W}from"../chunks/D4U67pPq.js";var J=c('<meta name="description" content="Guidance for wiring Greater Components profile surfaces including ProfileHeader, tabbed feeds, and edit modals."/>'),Q=c("<li><strong><code> </code></strong> </li>"),V=c("<li> </li>"),X=c("<li><code> </code> </li>"),Y=c(`<section><h2>Packages in play</h2> <ul></ul></section> <section><h2>ProfileHeader props</h2> <!> <p>Follow/edit interactions flow through <code>Profile.Root</code> context handlers. In the demo
			we trigger a local modal (<code>#snippet ProfileActionSnippet</code>) rather than remote
			requests.</p></section> <section><h2>Usage snippet</h2> <!></section> <section><h2>Accessibility</h2> <!></section> <section><h2>Performance considerations</h2> <ul></ul></section> <section><h2>Testing references</h2> <ul></ul></section>`,1);function le(S){const M=[{name:"account",type:"UnifiedAccount",required:!0,description:"Profile payload (display name, avatar, header, counts) rendered in the header."},{name:"showBanner",type:"boolean",default:"true",description:"Controls the masthead gradient / cover image."},{name:"showBio",type:"boolean",default:"true",description:"Toggles the sanitized note/bio region."},{name:"showFields",type:"boolean",default:"true",description:"Displays metadata fields + verified badges pulled from account.emojis."},{name:"showCounts",type:"boolean",default:"true",description:"Followers/following/posts summary (wire to `clickableCounts` for interactive stats)."},{name:"clickableCounts",type:"boolean",default:"false",description:"Wraps counts in buttons and wires onFollowersClick/onFollowingClick callbacks."},{name:"followButton",type:"Snippet",description:"Optional slot used for the “Edit profile” button inside the demo."},{name:"emojiRenderer",type:"(text: string) => string",description:"Custom renderer for server-provided emoji; accepts sanitized HTML."}],$=[{name:"@equaltoai/greater-components-social",detail:"ProfileHeader, StatusCard, Tabs snippets, and Followers/Following utilities."},{name:"@equaltoai/greater-components-primitives",detail:"Button, Avatar, Skeleton, Modal, TextField, and TextArea for edit flows."},{name:"@equaltoai/greater-components-icons",detail:"Used inside ProfileHeader actions and pinned cards."}],A=`<script lang="ts">
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
{/snippet}`,B={wcagLevel:"AA",keyboardNav:!0,screenReader:!0,colorContrast:!0,focusManagement:!0,ariaSupport:!0,reducedMotion:!0,notes:["Connections lists announce follow state changes via aria-live.","Tabs use roving tabindex + arrow key handlers (tested via keyboard automation).","Edit profile modal traps focus and labels inputs with visible text.",'Skeleton state for media gallery uses `role="img"` with `data-index` for deterministic announcements.'],axeScore:100},F=["Pinned StatusCard instances reuse comfortable density tokens to stay under 30KB hydrated.",'Media gallery defers image loads with `loading="lazy"` and exposes skeleton placeholders.',"Connections list items are capped to 6 per column to avoid layout thrash on mobile.","Profile edit modal relies on local state only; no network calls occur in the demo."],D=[{label:"packages/testing/tests/demo/profile.spec.ts",detail:"Keyboard navigation coverage for Tabs plus aria-live assertions on follow toggles."},{label:"apps/playground/src/routes/profile/+page.svelte",detail:"Source of snippets listed above and home for pinned status fixtures."}];U("1ca68pt",u=>{var P=J();z(()=>{G.title="Profile Demo Documentation - Greater Components"}),n(u,P)}),N(S,{eyebrow:"Demo Suite",title:"Profile application",description:"End-to-end profile surface with editable bio, pinned statuses, and tabbed feeds. Mirrors the Phase 4 /profile route.",children:(u,P)=>{var _=Y(),m=j(_),x=t(o(m),2);y(x,5,()=>$,a=>a.name,(a,s)=>{var i=Q(),r=o(i),p=o(r),h=o(p,!0);e(p),e(r);var L=t(r);e(i),w(()=>{l(h,d(s).name),l(L,` — ${d(s).detail??""}`)}),n(a,i)}),e(x),e(m);var f=t(m,2),E=t(o(f),2);I(E,{get props(){return M}}),R(2),e(f);var b=t(f,2),q=t(o(b),2);W(q,{language:"svelte",code:A}),e(b);var v=t(b,2),H=t(o(v),2);O(H,K(()=>B)),e(v);var g=t(v,2),T=t(o(g),2);y(T,7,()=>F,(a,s)=>`${s}-${a}`,(a,s)=>{var i=V(),r=o(i,!0);e(i),w(()=>l(r,d(s))),n(a,i)}),e(T),e(g);var k=t(g,2),C=t(o(k),2);y(C,5,()=>D,a=>a.label,(a,s)=>{var i=X(),r=o(i),p=o(r,!0);e(r);var h=t(r);e(i),w(()=>{l(p,d(s).label),l(h,` — ${d(s).detail??""}`)}),n(a,i)}),e(C),e(k),n(u,_)},$$slots:{default:!0}})}export{le as component};
