import{n as e}from"../chunks/9qPbz94-.js";import{A as t,C as n,E as r,F as i,I as a,K as o,L as s,M as c,P as l,Q as u,R as d,Tt as f,at as p,bt as m,ft as h,g,it as _,j as v,k as y,mt as b,pt as x,r as S,rt as C,yt as w}from"../chunks/HZEZB441.js";import{c as T}from"../chunks/DSQPZYfB.js";import"../chunks/DW7QIeR-.js";import{t as E}from"../chunks/COyCcdNW.js";/* empty css                */import{Cn as D,En as O,Gt as k,Ln as A,Lt as j,Pn as M,Qt as N,b as P,bn as F,dn as I,fn as L,hn as R,ln as z,nn as B,qt as V,rn as H,un as U,v as W,y as G}from"../chunks/CqG1B6Ni.js";var K=e({prerender:()=>!0,ssr:()=>!0}),q=d(`<a><!> <span class="svelte-12qhfyh"> </span></a>`),J=d(`<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>`);function Y(e,d){m(d,!0);let K=()=>b(E,`$page`,Y),[Y,X]=x(),Z=h(()=>d.data?.testTheme??null),Q=h(()=>d.data?.testDensity??null),$=h(()=>!!(o(Z)||o(Q))),ee=[{href:`/`,label:`Overview`,icon:L},{href:`/agent`,label:`Agent Face`,icon:O},{href:`/chat`,label:`Chat Demo`,icon:H},{href:`/status`,label:`Status Card Demo`,icon:B},{href:`/compose`,label:`Compose Demo`,icon:D},{href:`/timeline`,label:`Timeline Demo`,icon:A},{href:`/profile`,label:`Profile App`,icon:j},{href:`/artist`,label:`Artist Face`,icon:F},{href:`/settings`,label:`Settings App`,icon:k},{href:`/search`,label:`Search App`,icon:V},{href:`/notifications`,label:`Notifications Demo`,icon:M},{href:`/demos/primitives`,label:`Primitive Suite`,icon:U},{href:`/demos/button`,label:`Button Patterns`,icon:R},{href:`/demos/forms`,label:`Form Patterns`,icon:N},{href:`/demos/layout`,label:`Layout Surfaces`,icon:z},{href:`/demos/interactive`,label:`Interactive Suite`,icon:O},{href:`/demos/icons`,label:`Icon Gallery`,icon:I}],te=e=>e===`/`?T||`/`:`${T}${e}`;S(()=>(document.body.dataset.playgroundHydrated=`true`,()=>{delete document.body.dataset.playgroundHydrated})),S(()=>{!o(Z)&&!o(Q)||(o(Z)&&(P.setHighContrastMode(o(Z)===`high-contrast`),P.setColorScheme(o(Z))),o(Q)&&P.setDensity(o(Q)))}),r(`12qhfyh`,e=>{var t=s(),n=_(t),r=e=>{var t=s();v(_(t),()=>`<script>
			(function () {
				const themeValue = ${JSON.stringify(o(Z)??null)};
				const densityValue = ${JSON.stringify(o(Q)??null)};

				try {
					const raw = localStorage.getItem('gr-preferences-v1');
					const prefs = raw ? JSON.parse(raw) : {};

					if (themeValue) {
						prefs.colorScheme = themeValue;
						prefs.highContrastMode = themeValue === 'high-contrast';
					}

					if (densityValue) {
						prefs.density = densityValue;
					}

					localStorage.setItem('gr-preferences-v1', JSON.stringify(prefs));
				} catch (error) {
					console.warn('Failed to sync test preferences', error);
				}

				if (themeValue) {
					document.documentElement.setAttribute('data-theme', themeValue);
				}

				if (densityValue) {
					document.documentElement.setAttribute('data-density', densityValue);
				}
			})();
		<\/script>`),a(e,t)};l(n,e=>{o($)&&typeof window>`u`&&e(r)}),a(e,t)}),W(e,{children:(e,r)=>{var m=J(),v=C(m),b=p(C(v),2);c(b,21,()=>ee,({href:e,label:t,icon:n,external:r})=>e,(e,t)=>{let r=()=>o(t).href,s=()=>o(t).label,c=()=>o(t).icon,l=()=>o(t).external,d=h(()=>te(r()));var m=q();let _;var v=C(m);y(v,c,(e,t)=>{t(e,{size:18,"aria-hidden":`true`})});var b=p(v,2),x=C(b,!0);f(b),f(m),u(()=>{g(m,`href`,o(d)),g(m,`rel`,l()?`external`:void 0),g(m,`data-sveltekit-reload`,l()||void 0),_=n(m,1,`svelte-12qhfyh`,null,_,{active:K().url.pathname===r()}),i(x,s())}),a(e,m)}),f(b);var x=p(b,2);G(p(C(x),2),{size:`sm`,variant:`outline`}),f(x),f(v);var S=p(v,2),w=C(S),T=e=>{var n=s();t(_(n),()=>d.children),a(e,n)};l(w,e=>{d.children&&e(T)}),f(S),f(m),a(e,m)},$$slots:{default:!0}}),w(),X()}export{Y as component,K as universal};