import{n as e}from"../chunks/9qPbz94-.js";import{$ as t,B as n,F as r,H as i,I as a,K as o,Q as s,R as c,Tt as l,V as u,at as d,bt as f,ct as p,it as m,ot as h,rt as g,ut as _,wt as v,yt as y}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{Rn as b,a as x,b as S,y as C}from"../chunks/CqG1B6Ni.js";import{t as w}from"../chunks/BrMfcLY_.js";import{t as T}from"../chunks/BuX9N8RZ.js";var E=e({load:()=>D}),D=(()=>({metadata:{slug:`interactive-demo`,title:`Interactive Components Demo`,description:`Menus, context menus, and theming utilities wired to the published primitives package.`,sections:[`Menus & context menus`,`Theme switcher variants`,`Theme provider guidance`]}})),O=c(`<div class="context-target svelte-ojylog" role="button" tabindex="0">Right click or press Shift+F10</div>`),ee=c(`<section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Menu &amp; Keyboard Navigation</h2> <p class="svelte-ojylog">Primary dropdown plus a nested submenu showcase roving tabindex, typeahead, and disabled
				states.</p></header> <div class="menu-stack svelte-ojylog"><!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p></div> <p class="a11y-tip svelte-ojylog">Press Tab to focus the trigger, then use ArrowDown and typeahead letters to move through
			options.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Context Menu Surface</h2> <p class="svelte-ojylog">Right-click or use Shift+F10 to open the same Menu component as a context menu.</p></header> <!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p> <p class="a11y-tip svelte-ojylog">Screen readers surface this as a button; Shift+F10 mirrors contextmenu for keyboard-only
			users.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Switcher Variants</h2> <p class="svelte-ojylog">Compact switcher fits headers, while the full panel exposes density, font, and motion
				controls.</p></header> <div class="theme-grid svelte-ojylog"><div><p class="subhead svelte-ojylog">Compact</p> <!></div> <div><p class="subhead svelte-ojylog">Full</p> <!></div> <div class="preference-card svelte-ojylog" aria-live="polite"><p class="subhead svelte-ojylog">Resolved preferences</p> <dl class="svelte-ojylog"><div><dt class="svelte-ojylog">Color scheme</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Density</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Font size</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Motion</dt> <dd class="svelte-ojylog"> </dd></div></dl> <!></div></div> <p class="a11y-tip svelte-ojylog">The switcher writes to <code>preferencesStore</code>; summarize changes nearby for users who
			miss visual cues.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Provider Setup</h2> <p class="svelte-ojylog">Wrap the entire playground (already done in layout) with ThemeProvider so tokens load before
				paint.</p></header> <p class="a11y-tip svelte-ojylog">Keep the provider close to <code>&lt;body&gt;</code> so color variables initialize before content
			flashes.</p> <!></section>`,1);function k(e,c){f(c,!0);let u=[{id:`profile`,label:`Profile overview`},{id:`security`,label:`Security settings`},{id:`notifications`,label:`Notifications`,submenu:[{id:`email`,label:`Email alerts`},{id:`push`,label:`Push notifications`},{id:`mute`,label:`Mute channel`,disabled:!0}]},{id:`billing`,label:`Billing portal`}],E=[{id:`reply`,label:`Reply`},{id:`boost`,label:`Boost`},{id:`share`,label:`Share`,submenu:[{id:`copy-link`,label:`Copy link`},{id:`bookmark`,label:`Bookmark`}]},{id:`delete`,label:`Delete`,disabled:!0}],D=_(`Select a menu item to log it.`),k=_(`Right click the card or press Shift+F10.`);function A(e){p(D,`Selected: ${e.label}`)}function j(e){p(k,`Context action: ${e.label}`)}let M=_(h(S.state));function N(){p(M,S.state,!0)}function P(){S.reset(),N()}t(()=>{let e=setInterval(N,750);return()=>clearInterval(e)}),w(e,{eyebrow:`Component Demos`,get title(){return c.data.metadata.title},get description(){return c.data.metadata.description},children:(e,t)=>{var c=ee(),f=m(c),p=d(g(f),2),h=g(p);x(h,{get items(){return u},onItemSelect:A,trigger:(e,t)=>{let r=()=>t?.().open,i=()=>t?.().toggle;b(e,{get"aria-expanded"(){return r()},"aria-haspopup":`true`,get onclick(){return i()},children:(e,t)=>{v(),a(e,n(`Account actions`))},$$slots:{default:!0}})},$$slots:{trigger:!0}});var _=d(h,2),y=g(_,!0);l(_),l(p),T(d(p,4),{title:`Menu trigger`,description:`Trigger snippet receives the menu open state and toggle handler.`,code:`
<Menu items={primaryMenu} onItemSelect={handleMenuSelect}>
  {#snippet trigger({ open, toggle })}
    <Button aria-expanded={open} onclick={toggle}>
      Account actions
    </Button>
  {/snippet}
</Menu>`}),l(f);var S=d(f,2),w=d(g(S),2);x(w,{get items(){return E},onItemSelect:j,trigger:(e,t)=>{let n=()=>t?.().toggle;var r=O();i(`contextmenu`,r,e=>{e.preventDefault(),n()()}),i(`click`,r,function(...e){n()?.apply(this,e)}),i(`keydown`,r,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n()())}),a(e,r)},$$slots:{trigger:!0}});var F=d(w,2),te=g(F,!0);l(F),T(d(F,4),{title:`Context trigger`,description:`Wrap any surface and pair the contextmenu event with the menu toggle.`,code:`
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
</Menu>`}),l(S);var I=d(S,2),L=d(g(I),2),R=g(L);C(d(g(R),2),{variant:`compact`,onThemeChange:N}),l(R);var z=d(R,2);C(d(g(z),2),{variant:`full`,showAdvanced:!0,onThemeChange:N}),l(z);var B=d(z,2),V=d(g(B),2),H=g(V),U=d(g(H),2),W=g(U,!0);l(U),l(H);var G=d(H,2),K=d(g(G),2),q=g(K,!0);l(K),l(G);var J=d(G,2),Y=d(g(J),2),X=g(Y,!0);l(Y),l(J);var Z=d(J,2),Q=d(g(Z),2),ne=g(Q,!0);l(Q),l(Z),l(V),b(d(V,2),{size:`sm`,variant:`outline`,onclick:P,children:(e,t)=>{v(),a(e,n(`Reset preferences`))},$$slots:{default:!0}}),l(B),l(L),T(d(L,4),{title:`Theme switchers`,description:`Both variants consume the same published component.`,code:`
<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />`}),l(I);var $=d(I,2);T(d(g($),4),{title:`App shell usage`,description:`Import from the published primitives build—no local source paths.`,code:`
import { ThemeProvider } from '@equaltoai/greater-components-primitives';

<ThemeProvider enableSystemDetection preventFlash>
  <slot />
</ThemeProvider>`}),l($),s(()=>{r(y,o(D)),r(te,o(k)),r(W,o(M).resolvedColorScheme),r(q,o(M).density),r(X,o(M).fontSize),r(ne,o(M).motion)}),a(e,c)},$$slots:{default:!0}}),y()}u([`contextmenu`,`click`,`keydown`]);export{k as component,E as universal};