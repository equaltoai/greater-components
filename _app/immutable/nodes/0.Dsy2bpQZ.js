import"../chunks/DsnmJJEf.js";import{o as I}from"../chunks/C0tbzERM.js";import{p as Q,b as w,s as d,a as y,c as R,d as h,g as e,u as g,w as T,x as _,K as W,e as i,t as X,h as Y}from"../chunks/By1FN8TE.js";import{i as O,s as Z,a as ee}from"../chunks/BqliM4dK.js";import{h as te,j as se,p as S,d as q,s as ae,f as re}from"../chunks/Ce6awIAQ.js";import{c as oe}from"../chunks/BggK_khr.js";import{h as ne,T as ie}from"../chunks/Dg4RgKDs.js";import{s as le,b as H}from"../chunks/DrL1dLql.js";import{B as ce,M as de,E as he,A as fe,U as me,S as ue,a as pe,L as ve,G as be,P as ye,b as ge,C as _e,I as Se}from"../chunks/Di3meMJm.js";import{H as qe}from"../chunks/brcAoMT5.js";import{S as we}from"../chunks/OplByP56.js";const De=!0,Ve=!0,Je=Object.freeze(Object.defineProperty({__proto__:null,prerender:Ve,ssr:De},Symbol.toStringTag,{value:"Module"})),xe=()=>{const a=le;return{page:{subscribe:a.page.subscribe},navigating:{subscribe:a.navigating.subscribe},updated:a.updated}},Pe={subscribe(a){return xe().page.subscribe(a)}};var Ae=W(w(`<script>
			{
				preferenceSeedScript;
			}
		<\/script><!>`,1)),Ce=w('<a><!> <span class="svelte-12qhfyh"> </span></a>'),Ie=w('<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>');function je(a,l){Q(l,!0);const M=()=>ee(Pe,"$page",k),[k,z]=Z(),c=g(()=>()=>l.data?.testTheme??null),f=g(()=>()=>l.data?.testDensity??null),E=g(()=>()=>{if(!e(c)&&!e(f))return"";const t=JSON.stringify(e(c)),m=JSON.stringify(e(f));return`
(function() {
	const themeValue = ${t};
	const densityValue = ${m};

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
		`.trim()}),L=[{href:"/",label:"Overview",icon:qe},{href:"/docs",label:"Documentation",icon:ce,external:!0},{href:"/status",label:"Status Card Demo",icon:de},{href:"/compose",label:"Compose Demo",icon:he},{href:"/timeline",label:"Timeline Demo",icon:fe},{href:"/profile",label:"Profile App",icon:me},{href:"/settings",label:"Settings App",icon:we},{href:"/search",label:"Search App",icon:ue},{href:"/notifications",label:"Notifications Demo",icon:pe},{href:"/demos/primitives",label:"Primitive Suite",icon:ve},{href:"/demos/button",label:"Button Patterns",icon:be},{href:"/demos/forms",label:"Form Patterns",icon:ye},{href:"/demos/layout",label:"Layout Surfaces",icon:ge},{href:"/demos/interactive",label:"Interactive Suite",icon:_e},{href:"/demos/icons",label:"Icon Gallery",icon:Se}],N=t=>t==="/"?H||"/":`${H}${t}`;I(()=>(document.body.dataset.playgroundHydrated="true",()=>{delete document.body.dataset.playgroundHydrated})),I(()=>{!e(c)&&!e(f)||(e(c)&&(S.setHighContrastMode(e(c)==="high-contrast"),S.setColorScheme(e(c))),e(f)&&S.setDensity(e(f)))}),ne("12qhfyh",t=>{var m=T(),u=_(m);{var p=r=>{var v=Ae();d(_(v)),y(r,v)};O(u,r=>{e(E)&&typeof window>"u"&&r(p)})}y(t,m)}),ie(a,{children:(t,m)=>{var u=Ie(),p=h(u),r=d(h(p),2);te(r,21,()=>L,({href:o,label:s,icon:b,external:V})=>o,(o,s)=>{let b=()=>e(s).href,V=()=>e(s).label,j=()=>e(s).icon,x=()=>e(s).external;const F=g(()=>N(b()));var n=Ce();let P;var A=h(n);oe(A,j,($,K)=>{K($,{size:18,"aria-hidden":"true"})});var C=d(A,2),U=h(C,!0);i(C),i(n),X(()=>{q(n,"href",e(F)),q(n,"rel",x()?"external":void 0),q(n,"data-sveltekit-reload",x()||void 0),P=ae(n,1,"svelte-12qhfyh",null,P,{active:M().url.pathname===b()}),Y(U,V())}),y(o,n)}),i(r);var v=d(r,2),B=d(h(v),2);se(B,{size:"sm",variant:"outline"}),i(v),i(p);var D=d(p,2),G=h(D);{var J=o=>{var s=T(),b=_(s);re(b,()=>l.children),y(o,s)};O(G,o=>{l.children&&o(J)})}i(D),i(u),y(t,u)},$$slots:{default:!0}}),R(),z()}export{je as component,Je as universal};
