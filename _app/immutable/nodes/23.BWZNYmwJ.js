import{h as Se,b as U,t as V,a as u,s as i}from"../chunks/CPFvdcWc.js";import{p as xe,e as P,K as je,b as ke,f as we,s as e,c as t,t as Te,a as Me,d as $,L as G,r as o,g as n}from"../chunks/BBtdsj1g.js";import{D as Ce}from"../chunks/Cn_CQSLX.js";import{C as g}from"../chunks/DmSFjkjm.js";import{B as H}from"../chunks/BDfCaShM.js";import{p as D,T as J}from"../chunks/Bccb2MNk.js";import{S as Q}from"../chunks/ChioFUy2.js";const Pe=(()=>({metadata:{slug:"interactive-demo",title:"Interactive Components Demo",description:"Menus, context menus, and theming utilities wired to the published primitives package.",sections:["Menus & context menus","Theme switcher variants","Theme provider guidance"]}})),Oe=Object.freeze(Object.defineProperty({__proto__:null,load:Pe},Symbol.toStringTag,{value:"Module"}));var $e=U('<div class="context-target svelte-ojylog" role="button" tabindex="0">Right click or press Shift+F10</div>'),De=U(`<section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Menu &amp; Keyboard Navigation</h2> <p class="svelte-ojylog">Primary dropdown plus a nested submenu showcase roving tabindex, typeahead, and disabled
				states.</p></header> <div class="menu-stack svelte-ojylog"><!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p></div> <p class="a11y-tip svelte-ojylog">Press Tab to focus the trigger, then use ArrowDown and typeahead letters to move through
			options.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Context Menu Surface</h2> <p class="svelte-ojylog">Right-click or use Shift+F10 to open the same Menu component as a context menu.</p></header> <!> <p class="status-callout svelte-ojylog" aria-live="polite"> </p> <p class="a11y-tip svelte-ojylog">Screen readers surface this as a button; Shift+F10 mirrors contextmenu for keyboard-only
			users.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Switcher Variants</h2> <p class="svelte-ojylog">Compact switcher fits headers, while the full panel exposes density, font, and motion
				controls.</p></header> <div class="theme-grid svelte-ojylog"><div><p class="subhead svelte-ojylog">Compact</p> <!></div> <div><p class="subhead svelte-ojylog">Full</p> <!></div> <div class="preference-card svelte-ojylog" aria-live="polite"><p class="subhead svelte-ojylog">Resolved preferences</p> <dl class="svelte-ojylog"><div><dt class="svelte-ojylog">Color scheme</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Density</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Font size</dt> <dd class="svelte-ojylog"> </dd></div> <div><dt class="svelte-ojylog">Motion</dt> <dd class="svelte-ojylog"> </dd></div></dl> <!></div></div> <p class="a11y-tip svelte-ojylog">The switcher writes to <code>preferencesStore</code>; summarize changes nearby for users who
			miss visual cues.</p> <!></section> <section class="demo-section svelte-ojylog"><header class="svelte-ojylog"><h2>Theme Provider Setup</h2> <p class="svelte-ojylog">Wrap the entire playground (already done in layout) with ThemeProvider so tokens load before
				paint.</p></header> <p class="a11y-tip svelte-ojylog">Keep the provider close to <code>&lt;body&gt;</code> so color variables initialize before content
			flashes.</p> <!></section>`,1);function We(X,m){xe(m,!0);const Y=[{id:"profile",label:"Profile overview"},{id:"security",label:"Security settings"},{id:"notifications",label:"Notifications",submenu:[{id:"email",label:"Email alerts"},{id:"push",label:"Push notifications"},{id:"mute",label:"Mute channel",disabled:!0}]},{id:"billing",label:"Billing portal"}],Z=[{id:"reply",label:"Reply"},{id:"boost",label:"Boost"},{id:"share",label:"Share",submenu:[{id:"copy-link",label:"Copy link"},{id:"bookmark",label:"Bookmark"}]},{id:"delete",label:"Delete",disabled:!0}];let I=P("Select a menu item to log it."),B=P("Right click the card or press Shift+F10.");function ee(a){$(I,`Selected: ${a.label}`)}function te(a){$(B,`Context action: ${a.label}`)}let c=P(je(D.state));function p(){$(c,D.state,!0)}function oe(){D.reset(),p()}ke(()=>{const a=setInterval(p,750);return()=>clearInterval(a)});const se=`
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
</Menu>`,re=`
<ThemeSwitcher variant="compact" onThemeChange={syncPreferences} />
<ThemeSwitcher variant="full" showAdvanced onThemeChange={syncPreferences} />`,le=`
import { ThemeProvider } from '@equaltoai/greater-components-primitives';

<ThemeProvider enableSystemDetection preventFlash>
  <slot />
</ThemeProvider>`;Ce(X,{eyebrow:"Component Demos",get title(){return m.data.metadata.title},get description(){return m.data.metadata.description},children:(a,Ie)=>{var F=De(),h=we(F),y=e(t(h),2),R=t(y);Q(R,{get items(){return Y},onItemSelect:ee,trigger:(v,r)=>{let d=()=>r?.().open,l=()=>r?.().toggle;H(v,{get"aria-expanded"(){return d()},"aria-haspopup":"true",get onclick(){return l()},children:(s,Be)=>{G();var _e=V("Account actions");u(s,_e)},$$slots:{default:!0}})},$$slots:{trigger:!0}});var z=e(R,2),ie=t(z,!0);o(z),o(y);var ne=e(y,4);g(ne,{title:"Menu trigger",description:"Trigger snippet receives the menu open state and toggle handler.",code:se}),o(h);var f=e(h,2),A=e(t(f),2);Q(A,{get items(){return Z},onItemSelect:te,trigger:(v,r)=>{let d=()=>r?.().toggle;var l=$e();l.__contextmenu=s=>{s.preventDefault(),d()()},l.__click=function(...s){d()?.apply(this,s)},l.__keydown=s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),d()())},u(v,l)},$$slots:{trigger:!0}});var b=e(A,2),ce=t(b,!0);o(b);var de=e(b,4);g(de,{title:"Context trigger",description:"Wrap any surface and pair the contextmenu event with the menu toggle.",code:ae}),o(f);var _=e(f,2),S=e(t(_),2),x=t(S),pe=e(t(x),2);J(pe,{variant:"compact",onThemeChange:p}),o(x);var j=e(x,2),ve=e(t(j),2);J(ve,{variant:"full",showAdvanced:!0,onThemeChange:p}),o(j);var E=e(j,2),k=e(t(E),2),w=t(k),K=e(t(w),2),ue=t(K,!0);o(K),o(w);var T=e(w,2),N=e(t(T),2),ge=t(N,!0);o(N),o(T);var M=e(T,2),O=e(t(M),2),me=t(O,!0);o(O),o(M);var W=e(M,2),q=e(t(W),2),he=t(q,!0);o(q),o(W),o(k);var ye=e(k,2);H(ye,{size:"sm",variant:"outline",onclick:oe,children:(C,v)=>{G();var r=V("Reset preferences");u(C,r)},$$slots:{default:!0}}),o(E),o(S);var fe=e(S,4);g(fe,{title:"Theme switchers",description:"Both variants consume the same published component.",code:re}),o(_);var L=e(_,2),be=e(t(L),4);g(be,{title:"App shell usage",description:"Import from the published primitives build—no local source paths.",code:le}),o(L),Te(()=>{i(ie,n(I)),i(ce,n(B)),i(ue,n(c).resolvedColorScheme),i(ge,n(c).density),i(me,n(c).fontSize),i(he,n(c).motion)}),u(a,F)},$$slots:{default:!0}}),Me()}Se(["contextmenu","click","keydown"]);export{We as component,Oe as universal};
