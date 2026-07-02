import{n as e}from"../chunks/CRQC2527.js";import{$ as t,B as n,Dt as r,Et as i,F as a,H as o,I as s,K as c,R as l,St as u,V as d,at as f,ct as p,et as m,ft as h,ot as g,st as _,ut as v,xt as y}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{$t as b,a as x,b as S,y as C}from"../chunks/6QSfMQ-W.js";import{t as w}from"../chunks/RYgqtqyS.js";import{t as T}from"../chunks/DjMfVXn_.js";var E=e({load:()=>D}),D=(()=>({metadata:{slug:`interactive-demo`,title:`Interactive Components Demo`,description:`Menus, context menus, and theming utilities wired to the published primitives package.`,sections:[`Menus & context menus`,`Theme switcher variants`,`Theme provider guidance`]}})),O=l(`<div class="context-target svelte-ojylog" role="button" tabindex="0">Right click or press Shift+F10</div>`),k=l(`<section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Menu &amp; Keyboard Navigation</h2> <p class="svelte-ojylog">Primary dropdown plus a nested submenu showcase roving tabindex, typeahead, and disabled
				states.</p></header> <div class="menu-stack svelte-ojylog"><!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p></div> <p class="a11y-tip svelte-ojylog">Press Tab to focus the trigger, then use ArrowDown and typeahead letters to move through
			options.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Context Menu Surface</h2> <p class="svelte-ojylog">Right-click or use Shift+F10 to open the same Menu component as a context menu.</p></header> <!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p> <p class="a11y-tip svelte-ojylog">Screen readers surface this as a button; Shift+F10 mirrors contextmenu for keyboard-only
			users.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Switcher Variants</h2> <p class="svelte-ojylog">Compact switcher fits headers, while the full panel exposes density, font, and motion
				controls.</p></header> <div class="theme-grid svelte-ojylog"><div><p class="subhead svelte-ojylog">Compact</p> <!></div> <div><p class="subhead svelte-ojylog">Full</p> <!></div> <div class="preference-card svelte-ojylog" aria-live="polite"><p class="subhead svelte-ojylog">Resolved preferences</p> <dl class="svelte-ojylog"><div><dt class="svelte-ojylog">Color scheme</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Density</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Font size</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Motion</dt> <dd class="svelte-ojylog"> </dd></div></dl> <!></div></div> <p class="a11y-tip svelte-ojylog">The switcher writes to <code>preferencesStore</code>; summarize changes nearby for users who
			miss visual cues.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Provider Setup</h2> <p class="svelte-ojylog">Wrap the entire playground (already done in layout) with ThemeProvider so tokens load before
				paint.</p></header> <p class="a11y-tip svelte-ojylog">Keep the provider close to <code>&lt;body&gt;</code> so color variables initialize before content
			flashes.</p> <!></section>`,1);function A(e,l){u(l,!0);let d=[{id:`profile`,label:`Profile overview`},{id:`security`,label:`Security settings`},{id:`notifications`,label:`Notifications`,submenu:[{id:`email`,label:`Email alerts`},{id:`push`,label:`Push notifications`},{id:`mute`,label:`Mute channel`,disabled:!0}]},{id:`billing`,label:`Billing portal`}],E=[{id:`reply`,label:`Reply`},{id:`boost`,label:`Boost`},{id:`share`,label:`Share`,submenu:[{id:`copy-link`,label:`Copy link`},{id:`bookmark`,label:`Bookmark`}]},{id:`delete`,label:`Delete`,disabled:!0}],D=h(`Select a menu item to log it.`),A=h(`Right click the card or press Shift+F10.`);function ee(e){v(D,`Selected: ${e.label}`)}function j(e){v(A,`Context action: ${e.label}`)}let M=h(p(S.state));function N(){v(M,S.state,!0)}function P(){S.reset(),N()}m(()=>{let e=setInterval(N,750);return()=>clearInterval(e)}),w(e,{eyebrow:`Component Demos`,get title(){return l.data.metadata.title},get description(){return l.data.metadata.description},children:(e,l)=>{var u=k(),p=g(u),m=_(f(p),2),h=f(m);x(h,{get items(){return d},onItemSelect:ee,trigger:(e,t)=>{let r=()=>t?.().open,a=()=>t?.().toggle;b(e,{get"aria-expanded"(){return r()},"aria-haspopup":`true`,get onclick(){return a()},children:(e,t)=>{i(),s(e,n(`Account actions`))},$$slots:{default:!0}})},$$slots:{trigger:!0}});var v=_(h,2),y=f(v,!0);r(v),r(m),T(_(m,4),{title:`Menu trigger`,description:`Trigger snippet receives the menu open state and toggle handler.`,code:`
<Menu items={primaryMenu} onItemSelect={handleMenuSelect}>
  {#snippet trigger({ open, toggle })}
    <Button aria-expanded={open} onclick={toggle}>
      Account actions
    </Button>
  {/snippet}
</Menu>`}),r(p);var S=_(p,2),w=_(f(S),2);x(w,{get items(){return E},onItemSelect:j,trigger:(e,t)=>{let n=()=>t?.().toggle;var r=O();o(`contextmenu`,r,e=>{e.preventDefault(),n()()}),o(`click`,r,function(...e){n()?.apply(this,e)}),o(`keydown`,r,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n()())}),s(e,r)},$$slots:{trigger:!0}});var F=_(w,2),I=f(F,!0);r(F),T(_(F,4),{title:`Context trigger`,description:`Wrap any surface and pair the contextmenu event with the menu toggle.`,code:`
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
</Menu>`}),r(S);var L=_(S,2),R=_(f(L),2),z=f(R);C(_(f(z),2),{variant:`compact`,onThemeChange:N}),r(z);var B=_(z,2);C(_(f(B),2),{variant:`full`,showAdvanced:!0,onThemeChange:N}),r(B);var V=_(B,2),H=_(f(V),2),U=f(H),W=_(f(U),2),te=f(W,!0);r(W),r(U);var G=_(U,2),K=_(f(G),2),q=f(K,!0);r(K),r(G);var J=_(G,2),Y=_(f(J),2),X=f(Y,!0);r(Y),r(J);var Z=_(J,2),Q=_(f(Z),2),ne=f(Q,!0);r(Q),r(Z),r(H),b(_(H,2),{size:`sm`,variant:`outline`,onclick:P,children:(e,t)=>{i(),s(e,n(`Reset preferences`))},$$slots:{default:!0}}),r(V),r(R),T(_(R,4),{title:`Theme switchers`,description:`Both variants consume the same published component.`,code:`
<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />`}),r(L);var $=_(L,2);T(_(f($),4),{title:`App shell usage`,description:`Import from the published primitives build—no local source paths.`,code:`
import { ThemeProvider } from '@equaltoai/greater-components-primitives';

<ThemeProvider enableSystemDetection preventFlash>
  <slot />
</ThemeProvider>`}),r($),t(()=>{a(y,c(D)),a(I,c(A)),a(te,c(M).resolvedColorScheme),a(q,c(M).density),a(X,c(M).fontSize),a(ne,c(M).motion)}),s(e,u)},$$slots:{default:!0}}),y()}d([`contextmenu`,`click`,`keydown`]);export{A as component,E as universal};