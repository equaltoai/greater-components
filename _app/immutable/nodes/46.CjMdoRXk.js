import{n as e}from"../chunks/hePW80VL.js";import{$ as t,Dt as n,F as r,I as i,K as a,L as o,M as s,P as c,R as l,St as u,at as d,ct as f,ft as p,k as m,ot as h,st as g,ut as _,xt as v}from"../chunks/xyBo9fw_.js";import"../chunks/xihTtKlq.js";import{c as y,u as b}from"../chunks/DSK2v0zC.js";import{t as x}from"../chunks/Bv4csXnx.js";import{t as S}from"../chunks/C1qIpVBb.js";import{i as C,r as w}from"../chunks/B4dSpF8-.js";var T=e({load:()=>E}),E=(()=>({metadata:{slug:`status-demo`,title:`Status Card Demo`,description:`StatusCard + Status compound demos sourced from the fediverse data helpers showing media, polls, threads, and a11y guidance.`,sections:[`StatusCard showcase`,`Thread preview`,`Accessibility & shortcuts`]}})),D=l(`<p class="muted svelte-1xd49a3">No actions yet.</p>`),O=l(`<li> </li>`),k=l(`<ol class="svelte-1xd49a3"></ol>`),A=l(`<!> <!> <!> <!>`,1),j=l(`<li class="svelte-1xd49a3"><!></li>`),M=l(`<li> </li>`),N=l(`<section class="status-section svelte-1xd49a3"><header><p class="section-eyebrow svelte-1xd49a3">01 · Published StatusCard</p> <h2>Media, content warnings, and polls</h2> <p>All data comes from <code>createStatusShowcase()</code>, mirroring ActivityPub payloads with
				spoiler text, media attachments, and poll metadata. We tap into the published <code>StatusCard</code> component and wire the action callbacks so you can drop in API calls later.</p></header> <div class="status-grid svelte-1xd49a3"><div class="status-card-stack svelte-1xd49a3" role="region" aria-live="polite"><!> <!></div> <div class="status-panel svelte-1xd49a3"><h3>Interaction log</h3> <p class="muted svelte-1xd49a3">Reply/boost/favorite any card to see the optimistic log update.</p> <div class="action-log svelte-1xd49a3" role="log" aria-live="polite"><!></div> <!></div></div></section> <section class="status-section svelte-1xd49a3"><header><p class="section-eyebrow svelte-1xd49a3">02 · Thread preview</p> <h2>Status compound components</h2> <p>The root card reuses the "thread" entry from <code>createStatusShowcase()</code>, while
				replies are provided by <code>createThreadReplies()</code>. We blend <code>StatusCard</code> with <code>Status.*</code> to illustrate how to stitch a thread with consistent action handlers.</p></header> <div class="thread-layout svelte-1xd49a3"><div class="thread-stack svelte-1xd49a3" role="region" aria-labelledby="thread-heading"><h3 id="thread-heading" class="visually-hidden svelte-1xd49a3">Threaded status preview</h3> <!> <ol class="thread-replies svelte-1xd49a3"></ol></div> <!></div></section> <section class="status-section svelte-1xd49a3"><header><p class="section-eyebrow svelte-1xd49a3">03 · Accessibility & guidance</p> <h2>ARIA roles + keyboard cues</h2></header> <div class="a11y-grid svelte-1xd49a3"><ul class="guidance-list svelte-1xd49a3"></ul> <!></div></section>`,1);function P(e,l){u(l,!0);let T=w(),E=T[0],P=T[1]??T[0],F=T.find(e=>e.id===`status-thread-root`)??T[T.length-1],I=C(),L=p(f([])),R={onReply:e=>z(`Reply`,e.account.acct),onBoost:e=>z(`Boost`,e.account.acct),onFavorite:e=>z(`Favorite`,e.account.acct)};function z(e,t){_(L,[`${e} · ${t}`,...a(L)].slice(0,5),!0)}let B=[`Wrap feeds with role="feed" so assistive tech announces streaming updates politely.`,`Document keyboard shortcuts (j/k, g then h, .) near the surface or via help dialogs.`,`Use aria-describedby to point to shortcut hints (“Press boost to announce to followers”).`,`Keep action handlers idempotent and announce optimistic updates via aria-live regions.`];x(e,{eyebrow:`Fediverse Surface`,get title(){return l.data.metadata.title},get description(){return l.data.metadata.description},children:(e,l)=>{var u=N(),f=h(u),p=g(d(f),2),_=d(p),v=d(_);y(v,{get status(){return E},get actionHandlers(){return R}});var x=g(v,2);y(x,{get status(){return P},get actionHandlers(){return R},density:`comfortable`}),n(_);var C=g(_,2),w=g(d(C),4),T=d(w),z=e=>{var t=D();i(e,t)},V=e=>{var o=k();s(o,20,()=>a(L),e=>e,(e,a)=>{var o=O(),s=d(o,!0);n(o),t(()=>r(s,a)),i(e,o)}),n(o),i(e,o)};c(T,e=>{a(L).length===0?e(z):e(V,-1)}),n(w);var H=g(w,2);S(H,{title:`StatusCard snippet`,description:`Data provided by createStatusShowcase()`,code:`
const statuses = createStatusShowcase();
const [spoilerStatus, pollStatus] = statuses;

const handlers: StatusActionHandlers = {
  onReply: (status) => console.log('Reply', status.id),
  onBoost: (status) => console.log('Boost', status.id),
  onFavorite: (status) => console.log('Favorite', status.id)
};

<StatusCard status={spoilerStatus} actionHandlers={handlers} />
<StatusCard status={pollStatus} actionHandlers={handlers} density="comfortable" />`}),n(C),n(p),n(f);var U=g(f,2),W=g(d(U),2),G=d(W),K=g(d(G),2);y(K,{get status(){return F},get actionHandlers(){return R}});var q=g(K,2);s(q,21,()=>I,e=>e.id,(e,t)=>{var r=j(),s=d(r);m(s,()=>b.Root,(e,n)=>{n(e,{get status(){return a(t)},get handlers(){return R},config:{density:`compact`},children:(e,n)=>{var r=A(),s=h(r);m(s,()=>b.Header,(e,t)=>{t(e,{})});var l=g(s,2);m(l,()=>b.Content,(e,t)=>{t(e,{})});var u=g(l,2),d=e=>{var t=o(),n=h(t);m(n,()=>b.Media,(e,t)=>{t(e,{})}),i(e,t)};c(u,e=>{a(t).mediaAttachments?.length&&e(d)});var f=g(u,2);m(f,()=>b.Actions,(e,t)=>{t(e,{})}),i(e,r)},$$slots:{default:!0}})}),n(r),i(e,r)}),n(q),n(G);var J=g(G,2);S(J,{title:`Thread snippet`,description:`createThreadReplies() + Status compound`,code:`
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
{/each}`}),n(W),n(U);var Y=g(U,2),X=g(d(Y),2),Z=d(X);s(Z,20,()=>B,e=>e,(e,a)=>{var o=M(),s=d(o,!0);n(o),t(()=>r(s,a)),i(e,o)}),n(Z);var Q=g(Z,2);S(Q,{title:`Accessibility snippet`,description:`Role + shortcut annotations`,code:`
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
</section>`}),n(X),n(Y),i(e,u)},$$slots:{default:!0}}),v()}export{P as component,T as universal};