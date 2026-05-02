import{n as e}from"../chunks/9qPbz94-.js";import{B as t,F as n,I as r,K as i,L as a,M as o,P as s,Q as c,R as l,Tt as u,U as d,at as f,bt as p,ct as m,ft as h,it as g,k as _,ot as v,rt as y,ut as b,wt as x,yt as S}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{Fn as C,Gt as w,Kt as T,Mn as E,Rn as D,Zt as O,on as k}from"../chunks/CqG1B6Ni.js";import{t as A}from"../chunks/BrMfcLY_.js";import{t as j}from"../chunks/BuX9N8RZ.js";var M=e({load:()=>N}),N=(()=>({metadata:{slug:`button-demo`,title:`Button Patterns`,description:`Comprehensive coverage of Greater button variants, states, and icon affordances rendered from the published primitives package.`,sections:[`Variants & sizes`,`Icon placements`,`Stateful interactions`]}})),P=l(`<!> <!>`,1),F=l(`<li> </li>`),I=l(`<section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Variants &amp; Sizes</h2> <p>Solid, outline, and ghost buttons rendered directly from the published primitives package in
				every supported size.</p></header> <div class="button-grid svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Each button remains reachable via Tab order regardless of variant—confirm focus outlines
			meet contrast guidance.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Icon Placements</h2> <p>Prefix/suffix snippets keep icon spacing aligned with the tokens package, and icon-only
				buttons carry aria-labels for assistive tech.</p></header> <div class="icon-demo svelte-ocucxq"></div> <div class="icon-only-row svelte-ocucxq"></div> <p class="a11y-tip svelte-ocucxq">Tip: Provide aria-labels for icon-only buttons and ensure hover/click targets are at least
			44×44px.</p> <!></section> <section class="demo-section svelte-ocucxq"><header class="svelte-ocucxq"><h2 class="svelte-ocucxq">Stateful &amp; Async</h2> <p>Demonstrates button types, disabled/loading states, and a lightweight async simulation for
				user feedback.</p></header> <div class="state-demo svelte-ocucxq"><div><p class="state-label svelte-ocucxq">Async counter</p> <!></div> <div><p class="state-label svelte-ocucxq">Type handling</p> <form class="button-form svelte-ocucxq"><!> <!> <!></form> <ul class="submission-log svelte-ocucxq" aria-live="polite"></ul></div></div> <p class="a11y-tip svelte-ocucxq">Tip: Loading buttons automatically set \`aria-busy\` and remove them from tab order; communicate
			progress textually as well.</p> <!></section>`,1);function L(e,l){p(l,!0);let M=[`solid`,`outline`,`ghost`],N=[`sm`,`md`,`lg`],L=M.flatMap(e=>N.map(t=>({id:`${e}-${t}`,label:`${e.charAt(0).toUpperCase()+e.slice(1)} · ${t.toUpperCase()}`,variant:e,size:t}))),R=[{id:`primary-prefix`,label:`Share update`,variant:`solid`,affix:`prefix`,Icon:T},{id:`secondary-suffix`,label:`Continue`,variant:`outline`,affix:`suffix`,Icon:C},{id:`success-prefix`,label:`Confirm`,variant:`solid`,affix:`prefix`,Icon:E}],z=[{id:`settings`,label:`Open settings`,Icon:w},{id:`play`,label:`Play media`,Icon:O},{id:`refresh`,label:`Refresh board`,Icon:k}],B=b(0),V=b(!1),H=b(v([`No submissions yet`]));async function U(){i(V)||(m(V,!0),await new Promise(e=>setTimeout(e,1400)),m(B,i(B)+1),m(V,!1))}function W(e){e.preventDefault(),m(H,[`Submitted at ${new Date().toLocaleTimeString()}`,...i(H)].slice(0,2),!0)}function G(){m(H,[`Form reset via reset button`,...i(H)].slice(0,2),!0)}A(e,{eyebrow:`Component Demos`,get title(){return l.data.metadata.title},get description(){return l.data.metadata.description},children:(e,l)=>{var p=I(),v=g(p),b=f(y(v),2);o(b,21,()=>L,e=>e.id,(e,a)=>{{let o=h(()=>`button-${i(a).id}`);D(e,{get variant(){return i(a).variant},get size(){return i(a).size},get"data-testid"(){return i(o)},children:(e,o)=>{x();var s=t();c(()=>n(s,i(a).label)),r(e,s)},$$slots:{default:!0}})}}),u(b),j(f(b,4),{title:`Mapped button variants`,description:`Variants iterate over shared data so snippets and UI stay in sync.`,code:`
<div class="button-grid">
  {#each buttonVariantData as config (config.id)}
    <Button variant={config.variant} size={config.size}>
      {config.label}
    </Button>
  {/each}
</div>`}),u(v);var S=f(v,2),C=f(y(S),2);o(C,21,()=>R,e=>e.id,(e,t)=>{D(e,{get variant(){return i(t).variant},class:`icon-affix`,children:(e,o)=>{var l=P(),u=g(l),d=e=>{var n=a();_(g(n),()=>i(t).Icon,(e,t)=>{t(e,{size:16,"aria-hidden":`true`})}),r(e,n)};s(u,e=>{i(t).affix===`prefix`&&e(d)});var p=f(u),m=f(p),h=e=>{var n=a();_(g(n),()=>i(t).Icon,(e,t)=>{t(e,{size:16,"aria-hidden":`true`})}),r(e,n)};s(m,e=>{i(t).affix===`suffix`&&e(h)}),c(()=>n(p,` ${i(t).label??``} `)),r(e,l)},$$slots:{default:!0}})}),u(C);var w=f(C,2);o(w,21,()=>z,e=>e.id,(e,t)=>{D(e,{get"aria-label"(){return i(t).label},class:`icon-only`,onclick:()=>alert(`${i(t).label}`),children:(e,n)=>{var o=a();_(g(o),()=>i(t).Icon,(e,t)=>{t(e,{size:18,"aria-hidden":`true`})}),r(e,o)},$$slots:{default:!0}})}),u(w),j(f(w,4),{title:`Icon prefix/suffix`,description:"Snippets mirror the same `Button` instances above.",code:`
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
</div>`}),u(S);var T=f(S,2),E=f(y(T),2),O=y(E);D(f(y(O),2),{variant:`solid`,get loading(){return i(V)},onclick:U,"data-testid":`async-button`,children:(e,a)=>{x();var o=t();c(()=>n(o,i(V)?`Saving preference…`:`Increase total (${i(B)})`)),r(e,o)},$$slots:{default:!0}}),u(O);var k=f(O,2),A=f(y(k),2),M=y(A);D(M,{type:`submit`,variant:`solid`,children:(e,n)=>{x(),r(e,t(`Submit`))},$$slots:{default:!0}});var N=f(M,2);D(N,{type:`reset`,variant:`outline`,children:(e,n)=>{x(),r(e,t(`Reset`))},$$slots:{default:!0}}),D(f(N,2),{type:`button`,variant:`ghost`,onclick:()=>m(B,i(B)+1),children:(e,n)=>{x(),r(e,t(`Secondary action`))},$$slots:{default:!0}}),u(A);var K=f(A,2);o(K,20,()=>i(H),e=>e,(e,t)=>{var i=F(),a=y(i,!0);u(i),c(()=>n(a,t)),r(e,i)}),u(K),u(k),u(E),j(f(E,4),{title:`Stateful interactions`,description:`Same code powers the live example—copy to seed async tests.`,code:`
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
</form>`}),u(T),d(`submit`,A,W),d(`reset`,A,G),r(e,p)},$$slots:{default:!0}}),S()}export{L as component,M as universal};