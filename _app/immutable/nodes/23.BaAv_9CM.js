import{g as xe,t as G,a as u,h as P,b as X,s as i}from"../chunks/BTgIKdxS.js";import{p as je,h as $,Q as ke,b as we,f as Te,t as Me,c as t,s as e,a as Ce,d as D,R as H,r as o,g as n}from"../chunks/D-WlePPY.js";import{D as Pe}from"../chunks/DhBnkOx0.js";import{C as g}from"../chunks/DeXdVqsM.js";import{B as J}from"../chunks/B3zyJtUo.js";import{p as I,T as L}from"../chunks/CyXc35a2.js";import{S as U}from"../chunks/CFojdhLV.js";const $e=(()=>({metadata:{slug:"interactive-demo",title:"Interactive Components Demo",description:"Menus, context menus, and theming utilities wired to the published primitives package.",sections:["Menus & context menus","Theme switcher variants","Theme provider guidance"]}})),We=Object.freeze(Object.defineProperty({__proto__:null,load:$e},Symbol.toStringTag,{value:"Module"}));var De=X('<div class="context-target svelte-ojylog" role="button" tabindex="0">Right click or press Shift+F10</div>'),Ie=X(`<section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Menu &amp; Keyboard Navigation</h2> <p class="svelte-ojylog">Primary dropdown plus a nested submenu showcase roving tabindex, typeahead, and disabled
				states.</p></header> <div class="menu-stack svelte-ojylog"><!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p></div> <p class="a11y-tip svelte-ojylog">Press Tab to focus the trigger, then use ArrowDown and typeahead letters to move through
			options.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Context Menu Surface</h2> <p class="svelte-ojylog">Right-click or use Shift+F10 to open the same Menu component as a context menu.</p></header> <!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p> <p class="a11y-tip svelte-ojylog">Screen readers surface this as a button; Shift+F10 mirrors contextmenu for keyboard-only
			users.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Switcher Variants</h2> <p class="svelte-ojylog">Compact switcher fits headers, while the full panel exposes density, font, and motion
				controls.</p></header> <div class="theme-grid svelte-ojylog"><div><p class="subhead svelte-ojylog">Compact</p> <!></div> <div><p class="subhead svelte-ojylog">Full</p> <!></div> <div class="preference-card svelte-ojylog" aria-live="polite"><p class="subhead svelte-ojylog">Resolved preferences</p> <dl class="svelte-ojylog"><div><dt class="svelte-ojylog">Color scheme</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Density</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Font size</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Motion</dt> <dd class="svelte-ojylog"> </dd></div></dl> <!></div></div> <p class="a11y-tip svelte-ojylog">The switcher writes to <code>preferencesStore</code>; summarize changes nearby for users who
			miss visual cues.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Provider Setup</h2> <p class="svelte-ojylog">Wrap the entire playground (already done in layout) with ThemeProvider so tokens load before
				paint.</p></header> <p class="a11y-tip svelte-ojylog">Keep the provider close to <code>&lt;body&gt;</code> so color variables initialize before content
			flashes.</p> <!></section>`,1);function qe(Y,h){je(h,!0);const Z=[{id:"profile",label:"Profile overview"},{id:"security",label:"Security settings"},{id:"notifications",label:"Notifications",submenu:[{id:"email",label:"Email alerts"},{id:"push",label:"Push notifications"},{id:"mute",label:"Mute channel",disabled:!0}]},{id:"billing",label:"Billing portal"}],ee=[{id:"reply",label:"Reply"},{id:"boost",label:"Boost"},{id:"share",label:"Share",submenu:[{id:"copy-link",label:"Copy link"},{id:"bookmark",label:"Bookmark"}]},{id:"delete",label:"Delete",disabled:!0}];let B=$("Select a menu item to log it."),F=$("Right click the card or press Shift+F10.");function te(a){D(B,`Selected: ${a.label}`)}function oe(a){D(F,`Context action: ${a.label}`)}let c=$(ke(I.state));function p(){D(c,I.state,!0)}function se(){I.reset(),p()}we(()=>{const a=setInterval(p,750);return()=>clearInterval(a)});const ae=`
<Menu items={primaryMenu} onItemSelect={handleMenuSelect}>
  {#snippet trigger({ open, toggle })}
    <Button aria-expanded={open} onclick={toggle}>
      Account actions
    </Button>
  {/snippet}
</Menu>`,le=`
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
</Menu>`,re=`
<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />`,ie=`
import { ThemeProvider } from '@equaltoai/greater-components-primitives';

<ThemeProvider enableSystemDetection preventFlash>
  <slot />
</ThemeProvider>`;Pe(Y,{eyebrow:"Component Demos",get title(){return h.data.metadata.title},get description(){return h.data.metadata.description},children:(a,Be)=>{var R=Ie(),m=Te(R),y=e(t(m),2),z=t(y);U(z,{get items(){return Z},onItemSelect:te,trigger:(v,l)=>{let d=()=>l?.().open,r=()=>l?.().toggle;J(v,{get"aria-expanded"(){return d()},"aria-haspopup":"true",get onclick(){return r()},children:(s,Fe)=>{H();var Se=G("Account actions");u(s,Se)},$$slots:{default:!0}})},$$slots:{trigger:!0}});var A=e(z,2),ne=t(A,!0);o(A),o(y);var ce=e(y,4);g(ce,{title:"Menu trigger",description:"Trigger snippet receives the menu open state and toggle handler.",code:ae}),o(m);var f=e(m,2),E=e(t(f),2);U(E,{get items(){return ee},onItemSelect:oe,trigger:(v,l)=>{let d=()=>l?.().toggle;var r=De();P("contextmenu",r,s=>{s.preventDefault(),d()()}),P("click",r,function(...s){d()?.apply(this,s)}),P("keydown",r,s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),d()())}),u(v,r)},$$slots:{trigger:!0}});var b=e(E,2),de=t(b,!0);o(b);var pe=e(b,4);g(pe,{title:"Context trigger",description:"Wrap any surface and pair the contextmenu event with the menu toggle.",code:le}),o(f);var _=e(f,2),S=e(t(_),2),x=t(S),ve=e(t(x),2);L(ve,{variant:"compact",onThemeChange:p}),o(x);var j=e(x,2),ue=e(t(j),2);L(ue,{variant:"full",showAdvanced:!0,onThemeChange:p}),o(j);var K=e(j,2),k=e(t(K),2),w=t(k),N=e(t(w),2),ge=t(N,!0);o(N),o(w);var T=e(w,2),O=e(t(T),2),he=t(O,!0);o(O),o(T);var M=e(T,2),W=e(t(M),2),me=t(W,!0);o(W),o(M);var q=e(M,2),Q=e(t(q),2),ye=t(Q,!0);o(Q),o(q),o(k);var fe=e(k,2);J(fe,{size:"sm",variant:"outline",onclick:se,children:(C,v)=>{H();var l=G("Reset preferences");u(C,l)},$$slots:{default:!0}}),o(K),o(S);var be=e(S,4);g(be,{title:"Theme switchers",description:"Both variants consume the same published component.",code:re}),o(_);var V=e(_,2),_e=e(t(V),4);g(_e,{title:"App shell usage",description:"Import from the published primitives build—no local source paths.",code:ie}),o(V),Me(()=>{i(ne,n(B)),i(de,n(F)),i(ge,n(c).resolvedColorScheme),i(he,n(c).density),i(me,n(c).fontSize),i(ye,n(c).motion)}),u(a,R)},$$slots:{default:!0}}),Ce()}xe(["contextmenu","click","keydown"]);export{qe as component,We as universal};
