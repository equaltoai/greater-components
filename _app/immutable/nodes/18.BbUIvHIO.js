import{t as y,a as n,j as X,b as G,s as B,c as M}from"../chunks/BTgIKdxS.js";import{p as ge,h as U,Q as xe,f as _,t as I,g as t,d as p,s as i,c,a as ye,r as o,R as $,u as _e}from"../chunks/D-WlePPY.js";import{i as Y}from"../chunks/COMTHQNu.js";import{e as P}from"../chunks/EAUZg0eb.js";import{c as E}from"../chunks/D4O329PC.js";import{D as $e}from"../chunks/DhBnkOx0.js";import{C as F}from"../chunks/DeXdVqsM.js";import{B as u}from"../chunks/B3zyJtUo.js";import{A as Se}from"../chunks/B2_Sep-X.js";import{C as qe}from"../chunks/sVdH_vDs.js";import{P as Be,L as Ie}from"../chunks/DlnqX5c7.js";import{S as Pe}from"../chunks/DaFBZdGH.js";import{S as ke}from"../chunks/4NBDaI4l.js";import"../chunks/CyXc35a2.js";const ze=(()=>({metadata:{slug:"button-demo",title:"Button Patterns",description:"Comprehensive coverage of Greater button variants, states, and icon affordances rendered from the published primitives package.",sections:["Variants & sizes","Icon placements","Stateful interactions"]}})),He=Object.freeze(Object.defineProperty({__proto__:null,load:ze},Symbol.toStringTag,{value:"Module"}));var Ce=G("<!> <!>",1),we=G("<li> </li>"),De=G(`<section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Variants &amp; Sizes</h2> <p>Solid, outline, and ghost buttons rendered directly from the published primitives package in
				every supported size.</p></header> <div class="button-grid svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Each button remains reachable via Tab order regardless of variant—confirm focus outlines
			meet contrast guidance.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Icon Placements</h2> <p>Prefix/suffix snippets keep icon spacing aligned with the tokens package, and icon-only
				buttons carry aria-labels for assistive tech.</p></header> <div class="icon-demo svelte-ocucxq"></div> <div class="icon-only-row svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Provide aria-labels for icon-only buttons and ensure hover/click targets are at least
			44×44px.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Stateful &amp; Async</h2> <p>Demonstrates button types, disabled/loading states, and a lightweight async simulation for
				user feedback.</p></header> <div class="state-demo svelte-ocucxq"><div><p class="state-label svelte-ocucxq">Async counter</p> <!></div> <div><p class="state-label svelte-ocucxq">Type handling</p> <form class="button-form svelte-ocucxq"><!> <!> <!></form> <ul class="submission-log svelte-ocucxq" aria-live="polite"></ul></div></div> <p class="a11y-tip svelte-ocucxq">Tip: Loading buttons automatically set \`aria-busy\` and remove them from tab order; communicate
			progress textually as well.</p> <!></section>`,1);function Je(Z,k){ge(k,!0);const ee=["solid","outline","ghost"],te=["sm","md","lg"],ae=ee.flatMap(r=>te.map(S=>({id:`${r}-${S}`,label:`${r.charAt(0).toUpperCase()+r.slice(1)} · ${S.toUpperCase()}`,variant:r,size:S}))),se=`
<div class="button-grid">
  {#each buttonVariantData as config (config.id)}
    <Button variant={config.variant} size={config.size}>
      {config.label}
    </Button>
  {/each}
</div>`,ie=[{id:"primary-prefix",label:"Share update",variant:"solid",affix:"prefix",Icon:Pe},{id:"secondary-suffix",label:"Continue",variant:"outline",affix:"suffix",Icon:Se},{id:"success-prefix",label:"Confirm",variant:"solid",affix:"prefix",Icon:qe}],oe=[{id:"settings",label:"Open settings",Icon:ke},{id:"play",label:"Play media",Icon:Be},{id:"refresh",label:"Refresh board",Icon:Ie}],ne=`
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
</div>`;let f=U(0),m=U(!1),h=U(xe(["No submissions yet"]));async function re(){t(m)||(p(m,!0),await new Promise(r=>setTimeout(r,1400)),p(f,t(f)+1),p(m,!1))}function ce(r){r.preventDefault(),p(h,[`Submitted at ${new Date().toLocaleTimeString()}`,...t(h)].slice(0,2),!0)}function le(){p(h,["Form reset via reset button",...t(h)].slice(0,2),!0)}const de=`
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
</form>`;$e(Z,{eyebrow:"Component Demos",get title(){return k.data.metadata.title},get description(){return k.data.metadata.description},children:(r,S)=>{var N=De(),z=_(N),C=i(c(z),2);P(C,21,()=>ae,e=>e.id,(e,a)=>{{let s=_e(()=>`button-${t(a).id}`);u(e,{get variant(){return t(a).variant},get size(){return t(a).size},get"data-testid"(){return t(s)},children:(g,v)=>{$();var l=y();I(()=>B(l,t(a).label)),n(g,l)},$$slots:{default:!0}})}}),o(C);var ue=i(C,4);F(ue,{title:"Mapped button variants",description:"Variants iterate over shared data so snippets and UI stay in sync.",code:se}),o(z);var w=i(z,2),D=i(c(w),2);P(D,21,()=>ie,e=>e.id,(e,a)=>{u(e,{get variant(){return t(a).variant},class:"icon-affix",children:(s,g)=>{var v=Ce(),l=_(v);{var L=d=>{var x=M(),O=_(x);E(O,()=>t(a).Icon,(V,j)=>{j(V,{size:16,"aria-hidden":"true"})}),n(d,x)};Y(l,d=>{t(a).affix==="prefix"&&d(L)})}var q=i(l),he=i(q);{var be=d=>{var x=M(),O=_(x);E(O,()=>t(a).Icon,(V,j)=>{j(V,{size:16,"aria-hidden":"true"})}),n(d,x)};Y(he,d=>{t(a).affix==="suffix"&&d(be)})}I(()=>B(q,` ${t(a).label??""} `)),n(s,v)},$$slots:{default:!0}})}),o(D);var T=i(D,2);P(T,21,()=>oe,e=>e.id,(e,a)=>{u(e,{get"aria-label"(){return t(a).label},class:"icon-only",onclick:()=>alert(`${t(a).label}`),children:(s,g)=>{var v=M(),l=_(v);E(l,()=>t(a).Icon,(L,q)=>{q(L,{size:18,"aria-hidden":"true"})}),n(s,v)},$$slots:{default:!0}})}),o(T);var ve=i(T,4);F(ve,{title:"Icon prefix/suffix",description:"Snippets mirror the same `Button` instances above.",code:ne}),o(w);var Q=i(w,2),A=i(c(Q),2),R=c(A),pe=i(c(R),2);u(pe,{variant:"solid",get loading(){return t(m)},onclick:re,"data-testid":"async-button",children:(e,a)=>{$();var s=y();I(()=>B(s,t(m)?"Saving preference…":`Increase total (${t(f)})`)),n(e,s)},$$slots:{default:!0}}),o(R);var H=i(R,2),b=i(c(H),2),J=c(b);u(J,{type:"submit",variant:"solid",children:(e,a)=>{$();var s=y("Submit");n(e,s)},$$slots:{default:!0}});var K=i(J,2);u(K,{type:"reset",variant:"outline",children:(e,a)=>{$();var s=y("Reset");n(e,s)},$$slots:{default:!0}});var fe=i(K,2);u(fe,{type:"button",variant:"ghost",onclick:()=>p(f,t(f)+1),children:(e,a)=>{$();var s=y("Secondary action");n(e,s)},$$slots:{default:!0}}),o(b);var W=i(b,2);P(W,20,()=>t(h),e=>e,(e,a)=>{var s=we(),g=c(s,!0);o(s),I(()=>B(g,a)),n(e,s)}),o(W),o(H),o(A);var me=i(A,4);F(me,{title:"Stateful interactions",description:"Same code powers the live example—copy to seed async tests.",code:de}),o(Q),X("submit",b,ce),X("reset",b,le),n(r,N)},$$slots:{default:!0}}),ye()}export{Je as component,He as universal};
