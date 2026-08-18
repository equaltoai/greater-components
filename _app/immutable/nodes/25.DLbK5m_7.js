import{n as e}from"../chunks/hePW80VL.js";import{$ as t,B as n,Dt as r,Et as i,F as a,H as o,I as s,K as c,R as l,St as u,V as d,at as f,ct as p,et as m,ft as h,ot as ee,st as g,ut as _,xt as v}from"../chunks/xyBo9fw_.js";import"../chunks/xihTtKlq.js";import{a as y,b,en as x,y as S}from"../chunks/DnPrlpXk.js";import{t as C}from"../chunks/Bv4csXnx.js";import{t as w}from"../chunks/C1qIpVBb.js";var T=e({load:()=>E}),E=(()=>({metadata:{slug:`interactive-demo`,title:`Interactive Components Demo`,description:`Menus, context menus, and theming utilities wired to the published primitives package.`,sections:[`Menus & context menus`,`Theme switcher variants`,`Theme provider guidance`]}})),D=l(`<div class="context-target svelte-ojylog" role="button" tabindex="0">Right click or press Shift+F10</div>`),te=l(`<section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Menu &amp; Keyboard Navigation</h2> <p class="svelte-ojylog">Primary dropdown plus a nested submenu showcase roving tabindex, typeahead, and disabled
				states.</p></header> <div class="menu-stack svelte-ojylog"><!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p></div> <p class="a11y-tip svelte-ojylog">Press Tab to focus the trigger, then use ArrowDown and typeahead letters to move through
			options.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Context Menu Surface</h2> <p class="svelte-ojylog">Right-click or use Shift+F10 to open the same Menu component as a context menu.</p></header> <!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p> <p class="a11y-tip svelte-ojylog">Screen readers surface this as a button; Shift+F10 mirrors contextmenu for keyboard-only
			users.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Switcher Variants</h2> <p class="svelte-ojylog">Compact switcher fits headers, while the full panel exposes density, font, and motion
				controls.</p></header> <div class="theme-grid svelte-ojylog"><div><p class="subhead svelte-ojylog">Compact</p> <!></div> <div><p class="subhead svelte-ojylog">Full</p> <!></div> <div class="preference-card svelte-ojylog" aria-live="polite"><p class="subhead svelte-ojylog">Resolved preferences</p> <dl class="svelte-ojylog"><div><dt class="svelte-ojylog">Color scheme</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Density</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Font size</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Motion</dt> <dd class="svelte-ojylog"> </dd></div></dl> <!></div></div> <p class="a11y-tip svelte-ojylog">The switcher writes to <code>preferencesStore</code>; summarize changes nearby for users who
			miss visual cues.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Provider Setup</h2> <p class="svelte-ojylog">Wrap the entire playground (already done in layout) with ThemeProvider so tokens load before
				paint.</p></header> <p class="a11y-tip svelte-ojylog">Keep the provider close to <code>&lt;body&gt;</code> so color variables initialize before content
			flashes.</p> <!></section>`,1);function O(e,l){u(l,!0);let d=[{id:`profile`,label:`Profile overview`},{id:`security`,label:`Security settings`},{id:`notifications`,label:`Notifications`,submenu:[{id:`email`,label:`Email alerts`},{id:`push`,label:`Push notifications`},{id:`mute`,label:`Mute channel`,disabled:!0}]},{id:`billing`,label:`Billing portal`}],T=[{id:`reply`,label:`Reply`},{id:`boost`,label:`Boost`},{id:`share`,label:`Share`,submenu:[{id:`copy-link`,label:`Copy link`},{id:`bookmark`,label:`Bookmark`}]},{id:`delete`,label:`Delete`,disabled:!0}],E=h(`Select a menu item to log it.`),O=h(`Right click the card or press Shift+F10.`);function ne(e){_(E,`Selected: ${e.label}`)}function k(e){_(O,`Context action: ${e.label}`)}let A=h(p(b.state));function j(){_(A,b.state,!0)}function re(){b.reset(),j()}m(()=>{let e=setInterval(j,750);return()=>clearInterval(e)}),C(e,{eyebrow:`Component Demos`,get title(){return l.data.metadata.title},get description(){return l.data.metadata.description},children:(e,l)=>{var u=te(),p=ee(u),m=g(f(p),2),h=f(m);y(h,{get items(){return d},onItemSelect:ne,trigger:(e,t)=>{let r=()=>t?.().open,a=()=>t?.().toggle;x(e,{get"aria-expanded"(){return r()},"aria-haspopup":`true`,get onclick(){return a()},children:(e,t)=>{i();var r=n(`Account actions`);s(e,r)},$$slots:{default:!0}})},$$slots:{trigger:!0}});var _=g(h,2),v=f(_,!0);r(_),r(m);var b=g(m,4);w(b,{title:`Menu trigger`,description:`Trigger snippet receives the menu open state and toggle handler.`,code:`
<Menu items={primaryMenu} onItemSelect={handleMenuSelect}>
  {#snippet trigger({ open, toggle })}
    <Button aria-expanded={open} onclick={toggle}>
      Account actions
    </Button>
  {/snippet}
</Menu>`}),r(p);var C=g(p,2),M=g(f(C),2);y(M,{get items(){return T},onItemSelect:k,trigger:(e,t)=>{let n=()=>t?.().toggle;var r=D();o(`contextmenu`,r,e=>{e.preventDefault(),n()()}),o(`click`,r,function(...e){n()?.apply(this,e)}),o(`keydown`,r,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n()())}),s(e,r)},$$slots:{trigger:!0}});var N=g(M,2),P=f(N,!0);r(N);var F=g(N,4);w(F,{title:`Context trigger`,description:`Wrap any surface and pair the contextmenu event with the menu toggle.`,code:`
<Menu items={contextMenuItems} onItemSelect={handleContextSelect}>
  {#snippet trigger({ toggle })}
    <div
      class="context-target"
      role="button"
      tabindex="0"
      oncontextmenu={(event) => {
        event.preventDefault();
        toggle();
      }}
      onclick={toggle}
      onkeydown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
    >
      Right click or press Shift+F10
    </div>
  {/snippet}
</Menu>`}),r(C);var I=g(C,2),L=g(f(I),2),R=f(L),ie=g(f(R),2);S(ie,{variant:`compact`,onThemeChange:j}),r(R);var z=g(R,2),ae=g(f(z),2);S(ae,{variant:`full`,showAdvanced:!0,onThemeChange:j}),r(z);var B=g(z,2),V=g(f(B),2),H=f(V),U=g(f(H),2),W=f(U,!0);r(U),r(H);var G=g(H,2),K=g(f(G),2),q=f(K,!0);r(K),r(G);var J=g(G,2),Y=g(f(J),2),oe=f(Y,!0);r(Y),r(J);var X=g(J,2),Z=g(f(X),2),se=f(Z,!0);r(Z),r(X),r(V);var Q=g(V,2);x(Q,{size:`sm`,variant:`outline`,onclick:re,children:(e,t)=>{i();var r=n(`Reset preferences`);s(e,r)},$$slots:{default:!0}}),r(B),r(L);var ce=g(L,4);w(ce,{title:`Theme switchers`,description:`Both variants consume the same published component.`,code:`
<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />`}),r(I);var $=g(I,2),le=g(f($),4);w(le,{title:`App shell usage`,description:`Import from the published primitives build—no local source paths.`,code:`
import { ThemeProvider } from '@equaltoai/greater-components-primitives';

<ThemeProvider enableSystemDetection preventFlash>
  <slot />
</ThemeProvider>`}),r($),t(()=>{a(v,c(E)),a(P,c(O)),a(W,c(A).resolvedColorScheme),a(q,c(A).density),a(oe,c(A).fontSize),a(se,c(A).motion)}),s(e,u)},$$slots:{default:!0}}),v()}d([`contextmenu`,`click`,`keydown`]);export{O as component,T as universal};