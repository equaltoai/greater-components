import{n as e}from"../chunks/CRQC2527.js";import{$ as t,B as n,Dt as r,Et as i,F as a,I as o,K as s,L as c,M as l,P as u,R as d,St as f,U as p,at as m,ct as h,ft as g,k as _,mt as v,ot as y,st as b,ut as x,xt as S}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{$t as C,Xt as w,ft as T,ot as E,qt as D,st as O,xt as k}from"../chunks/6QSfMQ-W.js";import{t as A}from"../chunks/RYgqtqyS.js";import{t as j}from"../chunks/DjMfVXn_.js";var M=e({load:()=>N}),N=(()=>({metadata:{slug:`button-demo`,title:`Button Patterns`,description:`Comprehensive coverage of Greater button variants, states, and icon affordances rendered from the published primitives package.`,sections:[`Variants & sizes`,`Icon placements`,`Stateful interactions`]}})),P=d(`<!> <!>`,1),F=d(`<li> </li>`),I=d(`<section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Variants &amp; Sizes</h2> <p>Solid, outline, and ghost buttons rendered directly from the published primitives package in
				every supported size.</p></header> <div class="button-grid svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Each button remains reachable via Tab order regardless of variant—confirm focus outlines
			meet contrast guidance.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Icon Placements</h2> <p>Prefix/suffix snippets keep icon spacing aligned with the tokens package, and icon-only
				buttons carry aria-labels for assistive tech.</p></header> <div class="icon-demo svelte-ocucxq"></div> <div class="icon-only-row svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Provide aria-labels for icon-only buttons and ensure hover/click targets are at least
			44×44px.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Stateful &amp; Async</h2> <p>Demonstrates button types, disabled/loading states, and a lightweight async simulation for
				user feedback.</p></header> <div class="state-demo svelte-ocucxq"><div><p class="state-label svelte-ocucxq">Async counter</p> <!></div> <div><p class="state-label svelte-ocucxq">Type handling</p> <form class="button-form svelte-ocucxq"><!> <!> <!></form> <ul class="submission-log svelte-ocucxq" aria-live="polite"></ul></div></div> <p class="a11y-tip svelte-ocucxq">Tip: Loading buttons automatically set \`aria-busy\` and remove them from tab order; communicate
			progress textually as well.</p> <!></section>`,1);function L(e,d){f(d,!0);let M=[`solid`,`outline`,`ghost`],N=[`sm`,`md`,`lg`],L=M.flatMap(e=>N.map(t=>({id:`${e}-${t}`,label:`${e.charAt(0).toUpperCase()+e.slice(1)} · ${t.toUpperCase()}`,variant:e,size:t}))),R=[{id:`primary-prefix`,label:`Share update`,variant:`solid`,affix:`prefix`,Icon:O},{id:`secondary-suffix`,label:`Continue`,variant:`outline`,affix:`suffix`,Icon:w},{id:`success-prefix`,label:`Confirm`,variant:`solid`,affix:`prefix`,Icon:D}],z=[{id:`settings`,label:`Open settings`,Icon:E},{id:`play`,label:`Play media`,Icon:T},{id:`refresh`,label:`Refresh board`,Icon:k}],B=g(0),V=g(!1),H=g(h([`No submissions yet`]));async function U(){s(V)||(x(V,!0),await new Promise(e=>setTimeout(e,1400)),x(B,s(B)+1),x(V,!1))}function W(e){e.preventDefault(),x(H,[`Submitted at ${new Date().toLocaleTimeString()}`,...s(H)].slice(0,2),!0)}function G(){x(H,[`Form reset via reset button`,...s(H)].slice(0,2),!0)}A(e,{eyebrow:`Component Demos`,get title(){return d.data.metadata.title},get description(){return d.data.metadata.description},children:(e,d)=>{var f=I(),h=y(f),g=b(m(h),2);l(g,21,()=>L,e=>e.id,(e,r)=>{{let c=v(()=>`button-${s(r).id}`);C(e,{get variant(){return s(r).variant},get size(){return s(r).size},get"data-testid"(){return s(c)},children:(e,c)=>{i();var l=n();t(()=>a(l,s(r).label)),o(e,l)},$$slots:{default:!0}})}}),r(g),j(b(g,4),{title:`Mapped button variants`,description:`Variants iterate over shared data so snippets and UI stay in sync.`,code:`
<div class="button-grid">
  {#each buttonVariantData as config (config.id)}
    <Button variant={config.variant} size={config.size}>
      {config.label}
    </Button>
  {/each}
</div>`}),r(h);var S=b(h,2),w=b(m(S),2);l(w,21,()=>R,e=>e.id,(e,n)=>{C(e,{get variant(){return s(n).variant},class:`icon-affix`,children:(e,r)=>{var i=P(),l=y(i),d=e=>{var t=c();_(y(t),()=>s(n).Icon,(e,t)=>{t(e,{size:16,"aria-hidden":`true`})}),o(e,t)};u(l,e=>{s(n).affix===`prefix`&&e(d)});var f=b(l),p=b(f),m=e=>{var t=c();_(y(t),()=>s(n).Icon,(e,t)=>{t(e,{size:16,"aria-hidden":`true`})}),o(e,t)};u(p,e=>{s(n).affix===`suffix`&&e(m)}),t(()=>a(f,` ${s(n).label??``} `)),o(e,i)},$$slots:{default:!0}})}),r(w);var T=b(w,2);l(T,21,()=>z,e=>e.id,(e,t)=>{C(e,{get"aria-label"(){return s(t).label},class:`icon-only`,onclick:()=>alert(`${s(t).label}`),children:(e,n)=>{var r=c();_(y(r),()=>s(t).Icon,(e,t)=>{t(e,{size:18,"aria-hidden":`true`})}),o(e,r)},$$slots:{default:!0}})}),r(T),j(b(T,4),{title:`Icon prefix/suffix`,description:"Snippets mirror the same `Button` instances above.",code:`
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
</div>`}),r(S);var E=b(S,2),D=b(m(E),2),O=m(D);C(b(m(O),2),{variant:`solid`,get loading(){return s(V)},onclick:U,"data-testid":`async-button`,children:(e,r)=>{i();var c=n();t(()=>a(c,s(V)?`Saving preference…`:`Increase total (${s(B)})`)),o(e,c)},$$slots:{default:!0}}),r(O);var k=b(O,2),A=b(m(k),2),M=m(A);C(M,{type:`submit`,variant:`solid`,children:(e,t)=>{i(),o(e,n(`Submit`))},$$slots:{default:!0}});var N=b(M,2);C(N,{type:`reset`,variant:`outline`,children:(e,t)=>{i(),o(e,n(`Reset`))},$$slots:{default:!0}}),C(b(N,2),{type:`button`,variant:`ghost`,onclick:()=>x(B,s(B)+1),children:(e,t)=>{i(),o(e,n(`Secondary action`))},$$slots:{default:!0}}),r(A);var K=b(A,2);l(K,20,()=>s(H),e=>e,(e,n)=>{var i=F(),s=m(i,!0);r(i),t(()=>a(s,n)),o(e,i)}),r(K),r(k),r(D),j(b(D,4),{title:`Stateful interactions`,description:`Same code powers the live example—copy to seed async tests.`,code:`
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
</form>`}),r(E),p(`submit`,A,W),p(`reset`,A,G),o(e,f)},$$slots:{default:!0}}),S()}export{L as component,M as universal};