import{n as e}from"../chunks/9qPbz94-.js";import{F as t,I as n,K as r,L as i,M as a,P as o,Q as s,R as c,Tt as l,at as u,bt as d,ct as f,it as p,k as m,ot as h,rt as g,ut as _,yt as v}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{t as y}from"../chunks/BrMfcLY_.js";import{t as b}from"../chunks/BuX9N8RZ.js";import{c as x,u as S}from"../chunks/BZjtlogg.js";import{i as C,r as w}from"../chunks/CY9MFrBS.js";var T=e({load:()=>E}),E=(()=>({metadata:{slug:`status-demo`,title:`Status Card Demo`,description:`StatusCard + Status compound demos sourced from the fediverse data helpers showing media, polls, threads, and a11y guidance.`,sections:[`StatusCard showcase`,`Thread preview`,`Accessibility & shortcuts`]}})),D=c(`<p class="muted svelte-1xd49a3">No actions yet.</p>`),O=c(`<li> </li>`),k=c(`<ol class="svelte-1xd49a3"></ol>`),A=c(`<!> <!> <!> <!>`,1),j=c(`<li class="svelte-1xd49a3"><!></li>`),M=c(`<li> </li>`),N=c(`<section class="status-section svelte-1xd49a3"><header><p class="section-eyebrow svelte-1xd49a3">01 · Published StatusCard</p> <h2>Media, content warnings, and polls</h2> <p>All data comes from <code>createStatusShowcase()</code>, mirroring ActivityPub payloads with
				spoiler text, media attachments, and poll metadata. We tap into the published <code>StatusCard</code> component and wire the action callbacks so you can drop in API calls later.</p></header> <div class="status-grid svelte-1xd49a3"><div class="status-card-stack svelte-1xd49a3" role="region" aria-live="polite"><!> <!></div> <div class="status-panel svelte-1xd49a3"><h3>Interaction log</h3> <p class="muted svelte-1xd49a3">Reply/boost/favorite any card to see the optimistic log update.</p> <div class="action-log svelte-1xd49a3" role="log" aria-live="polite"><!></div> <!></div></div></section> <section class="status-section svelte-1xd49a3"><header><p class="section-eyebrow svelte-1xd49a3">02 · Thread preview</p> <h2>Status compound components</h2> <p>The root card reuses the "thread" entry from <code>createStatusShowcase()</code>, while
				replies are provided by <code>createThreadReplies()</code>. We blend <code>StatusCard</code> with <code>Status.*</code> to illustrate how to stitch a thread with consistent action handlers.</p></header> <div class="thread-layout svelte-1xd49a3"><div class="thread-stack svelte-1xd49a3" role="region" aria-labelledby="thread-heading"><h3 id="thread-heading" class="visually-hidden svelte-1xd49a3">Threaded status preview</h3> <!> <ol class="thread-replies svelte-1xd49a3"></ol></div> <!></div></section> <section class="status-section svelte-1xd49a3"><header><p class="section-eyebrow svelte-1xd49a3">03 · Accessibility & guidance</p> <h2>ARIA roles + keyboard cues</h2></header> <div class="a11y-grid svelte-1xd49a3"><ul class="guidance-list svelte-1xd49a3"></ul> <!></div></section>`,1);function P(e,c){d(c,!0);let T=w(),E=T[0],P=T[1]??T[0],F=T.find(e=>e.id===`status-thread-root`)??T[T.length-1],I=C(),L=_(h([])),R={onReply:e=>z(`Reply`,e.account.acct),onBoost:e=>z(`Boost`,e.account.acct),onFavorite:e=>z(`Favorite`,e.account.acct)};function z(e,t){f(L,[`${e} · ${t}`,...r(L)].slice(0,5),!0)}let B=[`Wrap feeds with role="feed" so assistive tech announces streaming updates politely.`,`Document keyboard shortcuts (j/k, g then h, .) near the surface or via help dialogs.`,`Use aria-describedby to point to shortcut hints (“Press boost to announce to followers”).`,`Keep action handlers idempotent and announce optimistic updates via aria-live regions.`];y(e,{eyebrow:`Fediverse Surface`,get title(){return c.data.metadata.title},get description(){return c.data.metadata.description},children:(e,c)=>{var d=N(),f=p(d),h=u(g(f),2),_=g(h),v=g(_);x(v,{get status(){return E},get actionHandlers(){return R}}),x(u(v,2),{get status(){return P},get actionHandlers(){return R},density:`comfortable`}),l(_);var y=u(_,2),C=u(g(y),4),w=g(C),T=e=>{n(e,D())},z=e=>{var i=k();a(i,20,()=>r(L),e=>e,(e,r)=>{var i=O(),a=g(i,!0);l(i),s(()=>t(a,r)),n(e,i)}),l(i),n(e,i)};o(w,e=>{r(L).length===0?e(T):e(z,-1)}),l(C),b(u(C,2),{title:`StatusCard snippet`,description:`Data provided by createStatusShowcase()`,code:`
const statuses = createStatusShowcase();
const [spoilerStatus, pollStatus] = statuses;

const handlers: StatusActionHandlers = {
  onReply: (status) => console.log('Reply', status.id),
  onBoost: (status) => console.log('Boost', status.id),
  onFavorite: (status) => console.log('Favorite', status.id)
};

<StatusCard status={spoilerStatus} actionHandlers={handlers} />
<StatusCard status={pollStatus} actionHandlers={handlers} density="comfortable" />`}),l(y),l(h),l(f);var V=u(f,2),H=u(g(V),2),U=g(H),W=u(g(U),2);x(W,{get status(){return F},get actionHandlers(){return R}});var G=u(W,2);a(G,21,()=>I,e=>e.id,(e,t)=>{var a=j();m(g(a),()=>S.Root,(e,a)=>{a(e,{get status(){return r(t)},get handlers(){return R},config:{density:`compact`},children:(e,a)=>{var s=A(),c=p(s);m(c,()=>S.Header,(e,t)=>{t(e,{})});var l=u(c,2);m(l,()=>S.Content,(e,t)=>{t(e,{})});var d=u(l,2),f=e=>{var t=i();m(p(t),()=>S.Media,(e,t)=>{t(e,{})}),n(e,t)};o(d,e=>{r(t).mediaAttachments?.length&&e(f)}),m(u(d,2),()=>S.Actions,(e,t)=>{t(e,{})}),n(e,s)},$$slots:{default:!0}})}),l(a),n(e,a)}),l(G),l(U),b(u(U,2),{title:`Thread snippet`,description:`createThreadReplies() + Status compound`,code:`
const statuses = createStatusShowcase();
const threadRoot = statuses.find((status) => status.id === 'status-thread-root') ?? statuses.at(-1);
const replies = createThreadReplies();

<StatusCard status={threadRoot} actionHandlers={handlers} />
{#each replies as reply}
  <Status.Root status={reply} handlers={handlers} config={{ density: 'compact' }}>
    <Status.Header />
    <Status.Content />
    {#if reply.mediaAttachments?.length}
      <Status.Media />
    {/if}
    <Status.Actions />
  </Status.Root>
{/each}`}),l(H),l(V);var K=u(V,2),q=u(g(K),2),J=g(q);a(J,20,()=>B,e=>e,(e,r)=>{var i=M(),a=g(i,!0);l(i),s(()=>t(a,r)),n(e,i)}),l(J),b(u(J,2),{title:`Accessibility snippet`,description:`Role + shortcut annotations`,code:`
<section role="feed" aria-live="polite">
  <StatusCard status={threadRoot} actionHandlers={handlers} />
  {#each replies as reply}
    <Status.Root
      status={reply}
      handlers={handlers}
      config={{ density: 'compact' }}
      aria-describedby="thread-shortcuts"
      data-shortcut="j/k"
    >
      <Status.Header />
      <Status.Content />
      <Status.Actions />
    </Status.Root>
  {/each}
</section>`}),l(q),l(K),n(e,d)},$$slots:{default:!0}}),v()}export{P as component,T as universal};