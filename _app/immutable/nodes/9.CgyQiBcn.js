import"../chunks/DsnmJJEf.js";import{x as xe,p as je,k as P,y as Se,A as ke,b as U,h as we,d as t,s as e,q as G,a as u,t as Te,c as Me,l as $,v as H,r as o,j as n,g as i}from"../chunks/CRFS9uw3.js";import{D as Ce}from"../chunks/WBNmjzQa.js";import{C as g}from"../chunks/CmUtWeOf.js";import{p as D,j as J,T as L,B as Q}from"../chunks/CtNyN7v0.js";const Pe=(()=>({metadata:{slug:"interactive-demo",title:"Interactive Components Demo",description:"Menus, context menus, and theming utilities wired to the published primitives package.",sections:["Menus & context menus","Theme switcher variants","Theme provider guidance"]}})),qe=Object.freeze(Object.defineProperty({__proto__:null,load:Pe},Symbol.toStringTag,{value:"Module"}));var $e=U('<div class="context-target svelte-ojylog" role="button" tabindex="0">Right click or press Shift+F10</div>'),De=U(`<section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Menu &amp; Keyboard Navigation</h2> <p class="svelte-ojylog">Primary dropdown plus a nested submenu showcase roving tabindex, typeahead, and disabled
				states.</p></header> <div class="menu-stack svelte-ojylog"><!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p></div> <p class="a11y-tip svelte-ojylog">Press Tab to focus the trigger, then use ArrowDown and typeahead letters to move through
			options.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Context Menu Surface</h2> <p class="svelte-ojylog">Right-click or use Shift+F10 to open the same Menu component as a context menu.</p></header> <!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p> <p class="a11y-tip svelte-ojylog">Screen readers surface this as a button; Shift+F10 mirrors contextmenu for keyboard-only
			users.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Switcher Variants</h2> <p class="svelte-ojylog">Compact switcher fits headers, while the full panel exposes density, font, and motion
				controls.</p></header> <div class="theme-grid svelte-ojylog"><div><p class="subhead svelte-ojylog">Compact</p> <!></div> <div><p class="subhead svelte-ojylog">Full</p> <!></div> <div class="preference-card svelte-ojylog" aria-live="polite"><p class="subhead svelte-ojylog">Resolved preferences</p> <dl class="svelte-ojylog"><div><dt class="svelte-ojylog">Color scheme</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Density</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Font size</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Motion</dt> <dd class="svelte-ojylog"> </dd></div></dl> <!></div></div> <p class="a11y-tip svelte-ojylog">The switcher writes to <code>preferencesStore</code>; summarize changes nearby for users who
			miss visual cues.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Provider Setup</h2> <p class="svelte-ojylog">Wrap the entire playground (already done in layout) with ThemeProvider so tokens load before
				paint.</p></header> <p class="a11y-tip svelte-ojylog">Keep the provider close to <code>&lt;body&gt;</code> so color variables initialize before content
			flashes.</p> <!></section>`,1);function Ke(X,h){je(h,!0);const Y=[{id:"profile",label:"Profile overview"},{id:"security",label:"Security settings"},{id:"notifications",label:"Notifications",submenu:[{id:"email",label:"Email alerts"},{id:"push",label:"Push notifications"},{id:"mute",label:"Mute channel",disabled:!0}]},{id:"billing",label:"Billing portal"}],Z=[{id:"reply",label:"Reply"},{id:"boost",label:"Boost"},{id:"share",label:"Share",submenu:[{id:"copy-link",label:"Copy link"},{id:"bookmark",label:"Bookmark"}]},{id:"delete",label:"Delete",disabled:!0}];let I=P("Select a menu item to log it."),B=P("Right click the card or press Shift+F10.");function ee(a){$(I,`Selected: ${a.label}`)}function te(a){$(B,`Context action: ${a.label}`)}let c=P(Se(D.state));function v(){$(c,D.state,!0)}function oe(){D.reset(),v()}ke(()=>{const a=setInterval(v,750);return()=>clearInterval(a)});const se=`
<Menu items={primaryMenu} onItemSelect={handleMenuSelect}>
  {#snippet trigger({ open, toggle })}
    <Button aria-expanded={open} onclick={toggle}>
      Account actions
    </Button>
  {/snippet}
</Menu>`,ae=`
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
</Menu>`,le=`
<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />`,re=`
import { ThemeProvider } from '@equaltoai/greater-components-primitives';

<ThemeProvider enableSystemDetection preventFlash>
  <slot />
</ThemeProvider>`;Ce(X,{eyebrow:"Component Demos",get title(){return h.data.metadata.title},get description(){return h.data.metadata.description},children:(a,Ie)=>{var F=De(),m=we(F),y=e(t(m),2),A=t(y);J(A,{get items(){return Y},onItemSelect:ee,trigger:(p,l)=>{let d=()=>l?.().open,r=()=>l?.().toggle;Q(p,{get"aria-expanded"(){return d()},"aria-haspopup":"true",get onclick(){return r()},children:(s,Be)=>{H();var _e=G("Account actions");u(s,_e)},$$slots:{default:!0}})},$$slots:{trigger:!0}});var R=e(A,2),ne=t(R,!0);o(R),o(y);var ie=e(y,4);g(ie,{title:"Menu trigger",description:"Trigger snippet receives the menu open state and toggle handler.",code:se}),o(m);var f=e(m,2),z=e(t(f),2);J(z,{get items(){return Z},onItemSelect:te,trigger:(p,l)=>{let d=()=>l?.().toggle;var r=$e();r.__contextmenu=s=>{s.preventDefault(),d()()},r.__click=function(...s){d()?.apply(this,s)},r.__keydown=s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),d()())},u(p,r)},$$slots:{trigger:!0}});var b=e(z,2),ce=t(b,!0);o(b);var de=e(b,4);g(de,{title:"Context trigger",description:"Wrap any surface and pair the contextmenu event with the menu toggle.",code:ae}),o(f);var _=e(f,2),x=e(t(_),2),j=t(x),ve=e(t(j),2);L(ve,{variant:"compact",onThemeChange:v}),o(j);var S=e(j,2),pe=e(t(S),2);L(pe,{variant:"full",showAdvanced:!0,onThemeChange:v}),o(S);var E=e(S,2),k=e(t(E),2),w=t(k),q=e(t(w),2),ue=t(q,!0);o(q),o(w);var T=e(w,2),K=e(t(T),2),ge=t(K,!0);o(K),o(T);var M=e(T,2),N=e(t(M),2),he=t(N,!0);o(N),o(M);var O=e(M,2),W=e(t(O),2),me=t(W,!0);o(W),o(O),o(k);var ye=e(k,2);Q(ye,{size:"sm",variant:"outline",onclick:oe,children:(C,p)=>{H();var l=G("Reset preferences");u(C,l)},$$slots:{default:!0}}),o(E),o(x);var fe=e(x,4);g(fe,{title:"Theme switchers",description:"Both variants consume the same published component.",code:le}),o(_);var V=e(_,2),be=e(t(V),4);g(be,{title:"App shell usage",description:"Import from the published primitives build—no local source paths.",code:re}),o(V),Te(()=>{n(ne,i(I)),n(ce,i(B)),n(ue,i(c).resolvedColorScheme),n(ge,i(c).density),n(he,i(c).fontSize),n(me,i(c).motion)}),u(a,F)},$$slots:{default:!0}}),Me()}xe(["contextmenu","click","keydown"]);export{Ke as component,qe as universal};
