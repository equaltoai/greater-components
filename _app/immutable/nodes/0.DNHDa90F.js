import{a as p,b as G,c as D,s as Y}from"../chunks/bxqCr151.js";import{o as F}from"../chunks/BDlMHaMq.js";import{D as Z,y as ee,al as te,h as w,C as ae,m as H,I as N,o as k,l as se,q as re,p as oe,s as v,c as d,a as ie,g as e,f as P,r as l,u as g,t as ne}from"../chunks/CUHjCY3l.js";import{i as L,s as le,a as ce}from"../chunks/Dsp-4A1p.js";import{e as de,b as fe,d as A,s as he}from"../chunks/BXiGdZtt.js";import{h as me}from"../chunks/evuGRNZE.js";import{c as ue}from"../chunks/hIHf2cdS.js";import{b as B}from"../chunks/5CplnIPY.js";import{p as pe}from"../chunks/R_NJgNq4.js";import{T as ve,p as T}from"../chunks/CziThUO9.js";import{M as ye,a as be,E as ge,A as _e,F as Se,B as qe,L as Ce,G as De,P as we,b as Pe,C as Ae}from"../chunks/DEx3lhZc.js";import{H as Te}from"../chunks/cpjmDYvX.js";import{S as Ve,I as xe}from"../chunks/Dz_Ih4CL.js";import{S as Ee}from"../chunks/CdZnhqpf.js";import{U as Ie}from"../chunks/qudoRDmo.js";import{T as Me}from"../chunks/DB7g05oC.js";function Oe(_,s){let y=null,S=w;var b;if(w){y=se;for(var t=re(document.head);t!==null&&(t.nodeType!==ae||t.data!==_);)t=H(t);if(t===null)N(!1);else{var r=H(t);t.remove(),k(r)}}w||(b=document.head.appendChild(Z()));try{ee(()=>s(b),te)}finally{S&&(N(!0),k(y))}}const Fe=!0,He=!0,tt=Object.freeze(Object.defineProperty({__proto__:null,prerender:He,ssr:Fe},Symbol.toStringTag,{value:"Module"}));var Ne=G('<a><!> <span class="svelte-12qhfyh"> </span></a>'),ke=G('<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>');function at(_,s){oe(s,!0);const y=()=>ce(pe,"$page",S),[S,b]=le(),t=g(()=>s.data?.testTheme??null),r=g(()=>s.data?.testDensity??null),J=g(()=>!!(e(t)||e(r))),z=[{href:"/",label:"Overview",icon:Te},{href:"/chat",label:"Chat Demo",icon:ye},{href:"/status",label:"Status Card Demo",icon:be},{href:"/compose",label:"Compose Demo",icon:ge},{href:"/timeline",label:"Timeline Demo",icon:_e},{href:"/profile",label:"Profile App",icon:Ie},{href:"/artist",label:"Artist Face",icon:Se},{href:"/settings",label:"Settings App",icon:Ee},{href:"/search",label:"Search App",icon:Ve},{href:"/notifications",label:"Notifications Demo",icon:qe},{href:"/demos/primitives",label:"Primitive Suite",icon:Ce},{href:"/demos/button",label:"Button Patterns",icon:De},{href:"/demos/forms",label:"Form Patterns",icon:we},{href:"/demos/layout",label:"Layout Surfaces",icon:Pe},{href:"/demos/interactive",label:"Interactive Suite",icon:Ae},{href:"/demos/icons",label:"Icon Gallery",icon:xe}],j=c=>c==="/"?B||"/":`${B}${c}`;F(()=>(document.body.dataset.playgroundHydrated="true",()=>{delete document.body.dataset.playgroundHydrated})),F(()=>{!e(t)&&!e(r)||(e(t)&&(T.setHighContrastMode(e(t)==="high-contrast"),T.setColorScheme(e(t))),e(r)&&T.setDensity(e(r)))}),Oe("12qhfyh",c=>{var q=D(),f=P(q);{var h=o=>{var m=D(),C=P(m);me(C,()=>`<script>
			(function () {
				const themeValue = ${JSON.stringify(e(t)??null)};
				const densityValue = ${JSON.stringify(e(r)??null)};

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
		<\/script>`),p(o,m)};L(f,o=>{e(J)&&typeof window>"u"&&o(h)})}p(c,q)}),Me(_,{children:(c,q)=>{var f=ke(),h=d(f),o=v(d(h),2);de(o,21,()=>z,({href:i,label:a,icon:u,external:x})=>i,(i,a)=>{let u=()=>e(a).href,x=()=>e(a).label,K=()=>e(a).icon,E=()=>e(a).external;const Q=g(()=>j(u()));var n=Ne();let I;var M=d(n);ue(M,K,(W,X)=>{X(W,{size:18,"aria-hidden":"true"})});var O=v(M,2),R=d(O,!0);l(O),l(n),ne(()=>{A(n,"href",e(Q)),A(n,"rel",E()?"external":void 0),A(n,"data-sveltekit-reload",E()||void 0),I=he(n,1,"svelte-12qhfyh",null,I,{active:y().url.pathname===u()}),Y(R,x())}),p(i,n)}),l(o);var m=v(o,2),C=v(d(m),2);ve(C,{size:"sm",variant:"outline"}),l(m),l(h);var V=v(h,2),U=d(V);{var $=i=>{var a=D(),u=P(a);fe(u,()=>s.children),p(i,a)};L(U,i=>{s.children&&i($)})}l(V),l(f),p(c,f)},$$slots:{default:!0}}),ie(),b()}export{at as component,tt as universal};
