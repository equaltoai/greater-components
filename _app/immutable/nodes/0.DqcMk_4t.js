import"../chunks/DsnmJJEf.js";import{p as Q,B as C,b as w,s as d,a as y,c as R,d as h,g as e,u as g,e as T,h as _,aq as W,r as i,t as X,j as Y}from"../chunks/CRFS9uw3.js";import{I as Z,u as ee,h as te,T as se,p as S,f as q,b as ae,s as re}from"../chunks/CtNyN7v0.js";import{i as O,a as oe,c as ne}from"../chunks/DsRRuAWK.js";import{c as ie}from"../chunks/DGnHAPP9.js";import{s as le,b as H}from"../chunks/DXrXLfwe.js";import{B as ce,M as de,E as he,A as fe,U as ue,S as me,a as pe,L as ve,G as be,P as ye,b as ge,C as _e,I as Se}from"../chunks/NnfCy52v.js";import{H as qe}from"../chunks/CDZ8X4eA.js";import{S as we}from"../chunks/CPaO1ZAw.js";const De=!0,Ve=!0,Ne=Object.freeze(Object.defineProperty({__proto__:null,prerender:Ve,ssr:De},Symbol.toStringTag,{value:"Module"})),Pe=()=>{const a=le;return{page:{subscribe:a.page.subscribe},navigating:{subscribe:a.navigating.subscribe},updated:a.updated}},xe={subscribe(a){return Pe().page.subscribe(a)}};var Ae=W(w(`<script>
			{
				preferenceSeedScript;
			}
		<\/script><!>`,1)),Ie=w('<a><!> <span class="svelte-12qhfyh"> </span></a>'),Ce=w('<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>');function Ge(a,l){Q(l,!0);const M=()=>ne(xe,"$page",k),[k,z]=oe(),c=g(()=>()=>l.data?.testTheme??null),f=g(()=>()=>l.data?.testDensity??null),B=g(()=>()=>{if(!e(c)&&!e(f))return"";const t=JSON.stringify(e(c)),u=JSON.stringify(e(f));return`
(function() {
	const themeValue = ${t};
	const densityValue = ${u};

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
		`.trim()}),E=[{href:"/",label:"Overview",icon:qe},{href:"/docs",label:"Documentation",icon:ce,external:!0},{href:"/status",label:"Status Card Demo",icon:de},{href:"/compose",label:"Compose Demo",icon:he},{href:"/timeline",label:"Timeline Demo",icon:fe},{href:"/profile",label:"Profile App",icon:ue},{href:"/settings",label:"Settings App",icon:we},{href:"/search",label:"Search App",icon:me},{href:"/notifications",label:"Notifications Demo",icon:pe},{href:"/demos/primitives",label:"Primitive Suite",icon:ve},{href:"/demos/button",label:"Button Patterns",icon:be},{href:"/demos/forms",label:"Form Patterns",icon:ye},{href:"/demos/layout",label:"Layout Surfaces",icon:ge},{href:"/demos/interactive",label:"Interactive Suite",icon:_e},{href:"/demos/icons",label:"Icon Gallery",icon:Se}],L=t=>t==="/"?H||"/":`${H}${t}`;C(()=>(document.body.dataset.playgroundHydrated="true",()=>{delete document.body.dataset.playgroundHydrated})),C(()=>{!e(c)&&!e(f)||(e(c)&&(S.setHighContrastMode(e(c)==="high-contrast"),S.setColorScheme(e(c))),e(f)&&S.setDensity(e(f)))}),Z("12qhfyh",t=>{var u=T(),m=_(u);{var p=r=>{var v=Ae();d(_(v)),y(r,v)};O(m,r=>{e(B)&&typeof window>"u"&&r(p)})}y(t,u)}),ee(a,{children:(t,u)=>{var m=Ce(),p=h(m),r=d(h(p),2);te(r,21,()=>E,({href:o,label:s,icon:b,external:V})=>o,(o,s)=>{let b=()=>e(s).href,V=()=>e(s).label,j=()=>e(s).icon,P=()=>e(s).external;const F=g(()=>L(b()));var n=Ie();let x;var A=h(n);ie(A,j,($,K)=>{K($,{size:18,"aria-hidden":"true"})});var I=d(A,2),U=h(I,!0);i(I),i(n),X(()=>{q(n,"href",e(F)),q(n,"rel",P()?"external":void 0),q(n,"data-sveltekit-reload",P()||void 0),x=ae(n,1,"svelte-12qhfyh",null,x,{active:M().url.pathname===b()}),Y(U,V())}),y(o,n)}),i(r);var v=d(r,2),N=d(h(v),2);se(N,{size:"sm",variant:"outline"}),i(v),i(p);var D=d(p,2),G=h(D);{var J=o=>{var s=T(),b=_(s);re(b,()=>l.children),y(o,s)};O(G,o=>{l.children&&o(J)})}i(D),i(m),y(t,m)},$$slots:{default:!0}}),R(),z()}export{Ge as component,Ne as universal};
