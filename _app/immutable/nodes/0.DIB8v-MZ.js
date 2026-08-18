import{n as e}from"../chunks/hePW80VL.js";import{$ as t,A as n,C as r,Dt as i,E as a,F as o,I as s,K as c,L as l,M as u,P as d,R as f,St as p,at as m,g as h,gt as g,ht as _,j as v,k as y,mt as b,ot as x,r as S,st as C,xt as w}from"../chunks/xyBo9fw_.js";import{c as T}from"../chunks/CrzvC-1K.js";import"../chunks/xihTtKlq.js";import{t as E}from"../chunks/DFOiLP8w.js";/* empty css                */import{$ as D,$t as O,Dt as k,Et as A,Ht as j,It as M,Ot as N,Tt as P,Xt as F,b as I,jt as L,lt as R,mt as z,st as B,v as V,vt as H,y as U,yt as W,zt as G}from"../chunks/DnPrlpXk.js";var K=e({prerender:()=>!0,ssr:()=>!0}),q=f(`<a><!> <span class="svelte-12qhfyh"> </span></a>`),J=f(`<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>`);function Y(e,f){p(f,!0);let K=()=>g(E,`$page`,Y),[Y,X]=_(),Z=b(()=>f.data?.testTheme??null),Q=b(()=>f.data?.testDensity??null),$=b(()=>!!(c(Z)||c(Q))),ee=[{href:`/`,label:`Overview`,icon:N},{href:`/agent`,label:`Agent Face`,icon:j},{href:`/chat`,label:`Chat Demo`,icon:W},{href:`/status`,label:`Status Card Demo`,icon:H},{href:`/compose`,label:`Compose Demo`,icon:G},{href:`/timeline`,label:`Timeline Demo`,icon:O},{href:`/profile`,label:`Profile App`,icon:D},{href:`/artist`,label:`Artist Face`,icon:M},{href:`/settings`,label:`Settings App`,icon:B},{href:`/search`,label:`Search App`,icon:R},{href:`/notifications`,label:`Notifications Demo`,icon:F},{href:`/demos/primitives`,label:`Primitive Suite`,icon:A},{href:`/demos/button`,label:`Button Patterns`,icon:L},{href:`/demos/forms`,label:`Form Patterns`,icon:z},{href:`/demos/layout`,label:`Layout Surfaces`,icon:P},{href:`/demos/interactive`,label:`Interactive Suite`,icon:j},{href:`/demos/icons`,label:`Icon Gallery`,icon:k}],te=e=>e===`/`?T||`/`:`${T}${e}`;S(()=>(document.body.dataset.playgroundHydrated=`true`,()=>{delete document.body.dataset.playgroundHydrated})),S(()=>{!c(Z)&&!c(Q)||(c(Z)&&(I.setHighContrastMode(c(Z)===`high-contrast`),I.setColorScheme(c(Z))),c(Q)&&I.setDensity(c(Q)))}),a(`12qhfyh`,e=>{var t=l(),n=x(t),r=e=>{var t=l(),n=x(t);v(n,()=>`<script>
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
		<\/script>`),s(e,t)};d(n,e=>{c($)&&typeof window>`u`&&e(r)}),s(e,t)}),V(e,{children:(e,a)=>{var p=J(),g=m(p),_=C(m(g),2);u(_,21,()=>ee,({href:e,label:t,icon:n,external:r})=>e,(e,n)=>{let a=()=>c(n).href,l=()=>c(n).label,u=()=>c(n).icon,d=()=>c(n).external,f=b(()=>te(a()));var p=q();let g;var _=m(p);y(_,u,(e,t)=>{t(e,{size:18,"aria-hidden":`true`})});var v=C(_,2),x=m(v,!0);i(v),i(p),t(()=>{h(p,`href`,c(f)),h(p,`rel`,d()?`external`:void 0),h(p,`data-sveltekit-reload`,d()||void 0),g=r(p,1,`svelte-12qhfyh`,null,g,{active:K().url.pathname===a()}),o(x,l())}),s(e,p)}),i(_);var v=C(_,2),S=C(m(v),2);U(S,{size:`sm`,variant:`outline`}),i(v),i(g);var w=C(g,2),T=m(w),E=e=>{var t=l(),r=x(t);n(r,()=>f.children),s(e,t)};d(T,e=>{f.children&&e(E)}),i(w),i(p),s(e,p)},$$slots:{default:!0}}),w(),X()}export{Y as component,K as universal};