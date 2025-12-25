import"../chunks/DsnmJJEf.js";import{o as F}from"../chunks/Cj87NSi3.js";import{O as Y,I as Z,aw as ee,n as C,D as te,C as ae,x as H,U as N,A as k,w as se,p as re,b as G,s as p,c as d,a as v,e as D,g as A,d as oe,h as e,u as g,r as l,t as ne,j as ie}from"../chunks/fhmmTLCl.js";import{i as L,s as le,a as ce}from"../chunks/Bv8pTBk7.js";import{f as de,b as fe,e as P,s as he}from"../chunks/hw2FEYC7.js";import{h as me}from"../chunks/BZdW_AwW.js";import{c as ue}from"../chunks/B-xWB8BY.js";import{b as B}from"../chunks/DqJesWyk.js";import{p as pe}from"../chunks/D7zOEHG3.js";import{k as ve,T as ye,p as x}from"../chunks/BHh5kNhB.js";import{M as be,a as ge,E as _e,A as Se,F as qe,B as we,L as Ce,G as De,P as Ae,b as Pe,C as xe}from"../chunks/CKpr4yCw.js";import{H as Ve}from"../chunks/8hOL28eU.js";import{S as Ee,I as Oe}from"../chunks/scbBMlZ3.js";import{S as Te}from"../chunks/8sOH8KMw.js";import{U as Ie}from"../chunks/CGiI4vfD.js";function Me(_,s){let y=null,S=C;var b;if(C){y=se;for(var t=te(document.head);t!==null&&(t.nodeType!==ae||t.data!==_);)t=H(t);if(t===null)N(!1);else{var r=H(t);t.remove(),k(r)}}C||(b=document.head.appendChild(Y()));try{Z(()=>s(b),ee)}finally{S&&(N(!0),k(y))}}const Fe=!0,He=!0,et=Object.freeze(Object.defineProperty({__proto__:null,prerender:He,ssr:Fe},Symbol.toStringTag,{value:"Module"}));var Ne=G('<a><!> <span class="svelte-12qhfyh"> </span></a>'),ke=G('<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>');function tt(_,s){re(s,!0);const y=()=>ce(pe,"$page",S),[S,b]=le(),t=g(()=>s.data?.testTheme??null),r=g(()=>s.data?.testDensity??null),J=g(()=>!!(e(t)||e(r))),j=[{href:"/",label:"Overview",icon:Ve},{href:"/chat",label:"Chat Demo",icon:be},{href:"/status",label:"Status Card Demo",icon:ge},{href:"/compose",label:"Compose Demo",icon:_e},{href:"/timeline",label:"Timeline Demo",icon:Se},{href:"/profile",label:"Profile App",icon:Ie},{href:"/artist",label:"Artist Face",icon:qe},{href:"/settings",label:"Settings App",icon:Te},{href:"/search",label:"Search App",icon:Ee},{href:"/notifications",label:"Notifications Demo",icon:we},{href:"/demos/primitives",label:"Primitive Suite",icon:Ce},{href:"/demos/button",label:"Button Patterns",icon:De},{href:"/demos/forms",label:"Form Patterns",icon:Ae},{href:"/demos/layout",label:"Layout Surfaces",icon:Pe},{href:"/demos/interactive",label:"Interactive Suite",icon:xe},{href:"/demos/icons",label:"Icon Gallery",icon:Oe}],z=c=>c==="/"?B||"/":`${B}${c}`;F(()=>(document.body.dataset.playgroundHydrated="true",()=>{delete document.body.dataset.playgroundHydrated})),F(()=>{!e(t)&&!e(r)||(e(t)&&(x.setHighContrastMode(e(t)==="high-contrast"),x.setColorScheme(e(t))),e(r)&&x.setDensity(e(r)))}),Me("12qhfyh",c=>{var q=D(),f=A(q);{var h=o=>{var m=D(),w=A(m);me(w,()=>`<script>
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
		<\/script>`),v(o,m)};L(f,o=>{e(J)&&typeof window>"u"&&o(h)})}v(c,q)}),ve(_,{children:(c,q)=>{var f=ke(),h=d(f),o=p(d(h),2);de(o,21,()=>j,({href:n,label:a,icon:u,external:E})=>n,(n,a)=>{let u=()=>e(a).href,E=()=>e(a).label,K=()=>e(a).icon,O=()=>e(a).external;const Q=g(()=>z(u()));var i=Ne();let T;var I=d(i);ue(I,K,(W,X)=>{X(W,{size:18,"aria-hidden":"true"})});var M=p(I,2),R=d(M,!0);l(M),l(i),ne(()=>{P(i,"href",e(Q)),P(i,"rel",O()?"external":void 0),P(i,"data-sveltekit-reload",O()||void 0),T=he(i,1,"svelte-12qhfyh",null,T,{active:y().url.pathname===u()}),ie(R,E())}),v(n,i)}),l(o);var m=p(o,2),w=p(d(m),2);ye(w,{size:"sm",variant:"outline"}),l(m),l(h);var V=p(h,2),U=d(V);{var $=n=>{var a=D(),u=A(a);fe(u,()=>s.children),v(n,a)};L(U,n=>{s.children&&n($)})}l(V),l(f),v(c,f)},$$slots:{default:!0}}),oe(),b()}export{tt as component,et as universal};
