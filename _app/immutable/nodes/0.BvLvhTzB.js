import{n as e}from"../chunks/CRQC2527.js";import{$ as t,A as n,C as r,Dt as i,E as a,F as o,I as s,K as c,L as l,M as u,P as d,R as f,St as p,at as m,g as h,gt as g,ht as _,j as v,k as y,mt as b,ot as x,r as S,st as C,xt as w}from"../chunks/BWt3wCjf.js";import{c as T}from"../chunks/CezD1CO-.js";import"../chunks/YnsNBmtB.js";import{t as E}from"../chunks/D48w5iQr.js";/* empty css                */import{At as D,Dt as O,Et as k,Ft as A,Q as j,Qt as M,Rt as N,Tt as P,Vt as F,Yt as I,_t as L,b as R,ct as z,ot as B,pt as V,v as H,vt as U,wt as W,y as G}from"../chunks/6QSfMQ-W.js";var K=e({prerender:()=>!0,ssr:()=>!0}),q=f(`<a><!> <span class="svelte-12qhfyh"> </span></a>`),J=f(`<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>`);function Y(e,f){p(f,!0);let K=()=>g(E,`$page`,Y),[Y,X]=_(),Z=b(()=>f.data?.testTheme??null),Q=b(()=>f.data?.testDensity??null),$=b(()=>!!(c(Z)||c(Q))),ee=[{href:`/`,label:`Overview`,icon:O},{href:`/agent`,label:`Agent Face`,icon:F},{href:`/chat`,label:`Chat Demo`,icon:U},{href:`/status`,label:`Status Card Demo`,icon:L},{href:`/compose`,label:`Compose Demo`,icon:N},{href:`/timeline`,label:`Timeline Demo`,icon:M},{href:`/profile`,label:`Profile App`,icon:j},{href:`/artist`,label:`Artist Face`,icon:A},{href:`/settings`,label:`Settings App`,icon:B},{href:`/search`,label:`Search App`,icon:z},{href:`/notifications`,label:`Notifications Demo`,icon:I},{href:`/demos/primitives`,label:`Primitive Suite`,icon:P},{href:`/demos/button`,label:`Button Patterns`,icon:D},{href:`/demos/forms`,label:`Form Patterns`,icon:V},{href:`/demos/layout`,label:`Layout Surfaces`,icon:W},{href:`/demos/interactive`,label:`Interactive Suite`,icon:F},{href:`/demos/icons`,label:`Icon Gallery`,icon:k}],te=e=>e===`/`?T||`/`:`${T}${e}`;S(()=>(document.body.dataset.playgroundHydrated=`true`,()=>{delete document.body.dataset.playgroundHydrated})),S(()=>{!c(Z)&&!c(Q)||(c(Z)&&(R.setHighContrastMode(c(Z)===`high-contrast`),R.setColorScheme(c(Z))),c(Q)&&R.setDensity(c(Q)))}),a(`12qhfyh`,e=>{var t=l(),n=x(t),r=e=>{var t=l();v(x(t),()=>`<script>
			(function () {
				const themeValue = ${JSON.stringify(c(Z)??null)};
				const densityValue = ${JSON.stringify(c(Q)??null)};

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
		<\/script>`),s(e,t)};d(n,e=>{c($)&&typeof window>`u`&&e(r)}),s(e,t)}),H(e,{children:(e,a)=>{var p=J(),g=m(p),_=C(m(g),2);u(_,21,()=>ee,({href:e,label:t,icon:n,external:r})=>e,(e,n)=>{let a=()=>c(n).href,l=()=>c(n).label,u=()=>c(n).icon,d=()=>c(n).external,f=b(()=>te(a()));var p=q();let g;var _=m(p);y(_,u,(e,t)=>{t(e,{size:18,"aria-hidden":`true`})});var v=C(_,2),x=m(v,!0);i(v),i(p),t(()=>{h(p,`href`,c(f)),h(p,`rel`,d()?`external`:void 0),h(p,`data-sveltekit-reload`,d()||void 0),g=r(p,1,`svelte-12qhfyh`,null,g,{active:K().url.pathname===a()}),o(x,l())}),s(e,p)}),i(_);var v=C(_,2);G(C(m(v),2),{size:`sm`,variant:`outline`}),i(v),i(g);var S=C(g,2),w=m(S),T=e=>{var t=l();n(x(t),()=>f.children),s(e,t)};d(w,e=>{f.children&&e(T)}),i(S),i(p),s(e,p)},$$slots:{default:!0}}),w(),X()}export{Y as component,K as universal};