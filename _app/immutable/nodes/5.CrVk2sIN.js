import"../chunks/DsnmJJEf.js";import{p as xe,i as j,L as ge,b as G,x as y,s as i,y as _,t as B,a as n,g as t,d as c,j as p,M as X,c as ye,z as $,h as I,u as _e,e as o,w as U}from"../chunks/By1FN8TE.js";import{i as Y}from"../chunks/BqliM4dK.js";import{h as P}from"../chunks/Ce6awIAQ.js";import{c as E}from"../chunks/BggK_khr.js";import{D as $e}from"../chunks/1ISensnS.js";import{C as F}from"../chunks/DGsFK5CB.js";import{B as u}from"../chunks/CO4DoVo0.js";import{S as Se,A as qe,P as Be,L as Ie}from"../chunks/DcDe26hd.js";import{C as Pe}from"../chunks/bonSSVEm.js";import{S as ke}from"../chunks/OplByP56.js";const ze=(()=>({metadata:{slug:"button-demo",title:"Button Patterns",description:"Comprehensive coverage of Greater button variants, states, and icon affordances rendered from the published primitives package.",sections:["Variants & sizes","Icon placements","Stateful interactions"]}})),Ge=Object.freeze(Object.defineProperty({__proto__:null,load:ze},Symbol.toStringTag,{value:"Module"}));var Ce=G("<!> <!>",1),we=G("<li> </li>"),De=G(`<section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Variants &amp; Sizes</h2> <p>Solid, outline, and ghost buttons rendered directly from the published primitives package in
				every supported size.</p></header> <div class="button-grid svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Each button remains reachable via Tab order regardless of variant—confirm focus outlines
			meet contrast guidance.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Icon Placements</h2> <p>Prefix/suffix snippets keep icon spacing aligned with the tokens package, and icon-only
				buttons carry aria-labels for assistive tech.</p></header> <div class="icon-demo svelte-ocucxq"></div> <div class="icon-only-row svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Provide aria-labels for icon-only buttons and ensure hover/click targets are at least
			44×44px.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Stateful &amp; Async</h2> <p>Demonstrates button types, disabled/loading states, and a lightweight async simulation for
				user feedback.</p></header> <div class="state-demo svelte-ocucxq"><div><p class="state-label svelte-ocucxq">Async counter</p> <!></div> <div><p class="state-label svelte-ocucxq">Type handling</p> <form class="button-form svelte-ocucxq"><!> <!> <!></form> <ul class="submission-log svelte-ocucxq" aria-live="polite"></ul></div></div> <p class="a11y-tip svelte-ocucxq">Tip: Loading buttons automatically set \`aria-busy\` and remove them from tab order; communicate
			progress textually as well.</p> <!></section>`,1);function Ne(Z,k){xe(k,!0);const ee=["solid","outline","ghost"],te=["sm","md","lg"],ae=ee.flatMap(r=>te.map(S=>({id:`${r}-${S}`,label:`${r.charAt(0).toUpperCase()+r.slice(1)} · ${S.toUpperCase()}`,variant:r,size:S}))),se=`
<div class="button-grid">
  {#each buttonVariantData as config (config.id)}
    <Button variant={config.variant} size={config.size}>
      {config.label}
    </Button>
  {/each}
</div>`,ie=[{id:"primary-prefix",label:"Share update",variant:"solid",affix:"prefix",Icon:Se},{id:"secondary-suffix",label:"Continue",variant:"outline",affix:"suffix",Icon:qe},{id:"success-prefix",label:"Confirm",variant:"solid",affix:"prefix",Icon:Pe}],oe=[{id:"settings",label:"Open settings",Icon:ke},{id:"play",label:"Play media",Icon:Be},{id:"refresh",label:"Refresh board",Icon:Ie}],ne=`
<div class="icon-demo">
  {#each iconButtons as button (button.id)}
    <Button variant={button.variant}>
      {#if button.affix === 'prefix'}
        <button.Icon size={16} aria-hidden="true" />
      {/if}
      {button.label}
      {#if button.affix === 'suffix'}
        <button.Icon size={16} aria-hidden="true" />
      {/if}
    </Button>
  {/each}

  {#each iconOnlyButtons as item (item.id)}
    <Button aria-label={item.label} class="icon-only">
      <item.Icon size={18} aria-hidden="true" />
    </Button>
  {/each}
</div>`;let f=j(0),m=j(!1),h=j(ge(["No submissions yet"]));async function re(){t(m)||(p(m,!0),await new Promise(r=>setTimeout(r,1400)),p(f,t(f)+1),p(m,!1))}function ce(r){r.preventDefault(),p(h,[`Submitted at ${new Date().toLocaleTimeString()}`,...t(h)].slice(0,2),!0)}function le(){p(h,["Form reset via reset button",...t(h)].slice(0,2),!0)}const de=`
<form class="button-form" onsubmit={handleSubmit} onreset={handleReset}>
  <Button type="submit" variant="solid">
    Save changes
  </Button>
  <Button type="reset" variant="outline">
    Reset form
  </Button>
  <Button type="button" loading={saving} onclick={simulateAsync}>
    Increment counter ({clickCount})
  </Button>
</form>`;$e(Z,{eyebrow:"Component Demos",get title(){return k.data.metadata.title},get description(){return k.data.metadata.description},children:(r,S)=>{var N=De(),z=y(N),C=i(c(z),2);P(C,21,()=>ae,e=>e.id,(e,a)=>{{let s=_e(()=>`button-${t(a).id}`);u(e,{get variant(){return t(a).variant},get size(){return t(a).size},get"data-testid"(){return t(s)},children:(x,v)=>{$();var l=_();B(()=>I(l,t(a).label)),n(x,l)},$$slots:{default:!0}})}}),o(C);var ue=i(C,4);F(ue,{title:"Mapped button variants",description:"Variants iterate over shared data so snippets and UI stay in sync.",code:se}),o(z);var w=i(z,2),D=i(c(w),2);P(D,21,()=>ie,e=>e.id,(e,a)=>{u(e,{get variant(){return t(a).variant},class:"icon-affix",children:(s,x)=>{var v=Ce(),l=y(v);{var O=d=>{var g=U(),R=y(g);E(R,()=>t(a).Icon,(V,M)=>{M(V,{size:16,"aria-hidden":"true"})}),n(d,g)};Y(l,d=>{t(a).affix==="prefix"&&d(O)})}var q=i(l),he=i(q);{var be=d=>{var g=U(),R=y(g);E(R,()=>t(a).Icon,(V,M)=>{M(V,{size:16,"aria-hidden":"true"})}),n(d,g)};Y(he,d=>{t(a).affix==="suffix"&&d(be)})}B(()=>I(q,` ${t(a).label??""} `)),n(s,v)},$$slots:{default:!0}})}),o(D);var T=i(D,2);P(T,21,()=>oe,e=>e.id,(e,a)=>{u(e,{get"aria-label"(){return t(a).label},class:"icon-only",onclick:()=>alert(`${t(a).label}`),children:(s,x)=>{var v=U(),l=y(v);E(l,()=>t(a).Icon,(O,q)=>{q(O,{size:18,"aria-hidden":"true"})}),n(s,v)},$$slots:{default:!0}})}),o(T);var ve=i(T,4);F(ve,{title:"Icon prefix/suffix",description:"Snippets mirror the same `Button` instances above.",code:ne}),o(w);var H=i(w,2),A=i(c(H),2),L=c(A),pe=i(c(L),2);u(pe,{variant:"solid",get loading(){return t(m)},onclick:re,"data-testid":"async-button",children:(e,a)=>{$();var s=_();B(()=>I(s,t(m)?"Saving preference…":`Increase total (${t(f)})`)),n(e,s)},$$slots:{default:!0}}),o(L);var J=i(L,2),b=i(c(J),2),K=c(b);u(K,{type:"submit",variant:"solid",children:(e,a)=>{$();var s=_("Submit");n(e,s)},$$slots:{default:!0}});var Q=i(K,2);u(Q,{type:"reset",variant:"outline",children:(e,a)=>{$();var s=_("Reset");n(e,s)},$$slots:{default:!0}});var fe=i(Q,2);u(fe,{type:"button",variant:"ghost",onclick:()=>p(f,t(f)+1),children:(e,a)=>{$();var s=_("Secondary action");n(e,s)},$$slots:{default:!0}}),o(b);var W=i(b,2);P(W,20,()=>t(h),e=>e,(e,a)=>{var s=we(),x=c(s,!0);o(s),B(()=>I(x,a)),n(e,s)}),o(W),o(J),o(A);var me=i(A,4);F(me,{title:"Stateful interactions",description:"Same code powers the live example—copy to seed async tests.",code:de}),o(H),X("submit",b,ce),X("reset",b,le),n(r,N)},$$slots:{default:!0}}),ye()}export{Ne as component,Ge as universal};
