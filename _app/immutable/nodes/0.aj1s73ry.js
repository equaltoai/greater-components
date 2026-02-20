import{a as p,b as B,c as C,s as Y}from"../chunks/BTgIKdxS.js";import{L as Z,z as ee,ao as te,ap as ae,i as D,C as se,n as I,D as H,v as N,m as re,y as oe,p as ne,o as L,s as v,a as ie,g as e,f as P,c as d,r as l,u as _,t as le}from"../chunks/D-WlePPY.js";import{i as k,s as ce,a as de}from"../chunks/COMTHQNu.js";import{e as fe,b as he,d as w,s as me}from"../chunks/EAUZg0eb.js";import{h as ue}from"../chunks/CO2IeFyJ.js";import{c as pe}from"../chunks/D4O329PC.js";import{b as z}from"../chunks/BJAEqnvE.js";import{p as ve}from"../chunks/Cv8qH4td.js";import{T as ye,p as T}from"../chunks/CyXc35a2.js";import{M as be,a as _e,E as ge,A as Se,F as Ee,B as qe,L as Ce,G as De,P as Pe,b as we,C as Te}from"../chunks/DpJuQsUc.js";import{H as Ve}from"../chunks/DbSbmSIx.js";import{S as Ae,I as xe}from"../chunks/D-nUao87.js";import{S as Fe}from"../chunks/4NBDaI4l.js";import{U as Me}from"../chunks/6IuynOD9.js";import{T as Oe}from"../chunks/n8s6zUup.js";function Ie(g,s){let y=null,S=D;var b;if(D){y=re;for(var t=oe(document.head);t!==null&&(t.nodeType!==se||t.data!==g);)t=I(t);if(t===null)H(!1);else{var r=I(t);t.remove(),N(r)}}D||(b=document.head.appendChild(Z()));try{ee(()=>s(b),te|ae)}finally{S&&(H(!0),N(y))}}const He=!0,Ne=!0,tt=Object.freeze(Object.defineProperty({__proto__:null,prerender:Ne,ssr:He},Symbol.toStringTag,{value:"Module"}));var Le=B('<a><!> <span class="svelte-12qhfyh"> </span></a>'),ke=B('<div class="app-shell svelte-12qhfyh"><aside class="app-shell__sidebar svelte-12qhfyh" aria-label="Demo navigation"><header class="sidebar-header svelte-12qhfyh"><p class="eyebrow svelte-12qhfyh">Greater Components</p> <h1 class="svelte-12qhfyh">Demo Suite</h1> <p class="svelte-12qhfyh">Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p></header> <nav class="sidebar-nav svelte-12qhfyh"></nav> <section class="sidebar-footer svelte-12qhfyh" aria-labelledby="theme-controls-heading"><h2 id="theme-controls-heading" class="sidebar-footer__heading svelte-12qhfyh">Adaptive themes</h2> <!></section></aside> <main class="app-shell__content svelte-12qhfyh"><!></main></div>');function at(g,s){ne(s,!0);const y=()=>de(ve,"$page",S),[S,b]=ce(),t=_(()=>s.data?.testTheme??null),r=_(()=>s.data?.testDensity??null),G=_(()=>!!(e(t)||e(r))),J=[{href:"/",label:"Overview",icon:Ve},{href:"/chat",label:"Chat Demo",icon:be},{href:"/status",label:"Status Card Demo",icon:_e},{href:"/compose",label:"Compose Demo",icon:ge},{href:"/timeline",label:"Timeline Demo",icon:Se},{href:"/profile",label:"Profile App",icon:Me},{href:"/artist",label:"Artist Face",icon:Ee},{href:"/settings",label:"Settings App",icon:Fe},{href:"/search",label:"Search App",icon:Ae},{href:"/notifications",label:"Notifications Demo",icon:qe},{href:"/demos/primitives",label:"Primitive Suite",icon:Ce},{href:"/demos/button",label:"Button Patterns",icon:De},{href:"/demos/forms",label:"Form Patterns",icon:Pe},{href:"/demos/layout",label:"Layout Surfaces",icon:we},{href:"/demos/interactive",label:"Interactive Suite",icon:Te},{href:"/demos/icons",label:"Icon Gallery",icon:xe}],j=c=>c==="/"?z||"/":`${z}${c}`;L(()=>(document.body.dataset.playgroundHydrated="true",()=>{delete document.body.dataset.playgroundHydrated})),L(()=>{!e(t)&&!e(r)||(e(t)&&(T.setHighContrastMode(e(t)==="high-contrast"),T.setColorScheme(e(t))),e(r)&&T.setDensity(e(r)))}),Ie("12qhfyh",c=>{var E=C(),f=P(E);{var h=o=>{var m=C(),q=P(m);ue(q,()=>`<script>
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
		<\/script>`),p(o,m)};k(f,o=>{e(G)&&typeof window>"u"&&o(h)})}p(c,E)}),Oe(g,{children:(c,E)=>{var f=ke(),h=d(f),o=v(d(h),2);fe(o,21,()=>J,({href:n,label:a,icon:u,external:A})=>n,(n,a)=>{let u=()=>e(a).href,A=()=>e(a).label,$=()=>e(a).icon,x=()=>e(a).external;const K=_(()=>j(u()));var i=Le();let F;var M=d(i);pe(M,$,(W,X)=>{X(W,{size:18,"aria-hidden":"true"})});var O=v(M,2),Q=d(O,!0);l(O),l(i),le(()=>{w(i,"href",e(K)),w(i,"rel",x()?"external":void 0),w(i,"data-sveltekit-reload",x()||void 0),F=me(i,1,"svelte-12qhfyh",null,F,{active:y().url.pathname===u()}),Y(Q,A())}),p(n,i)}),l(o);var m=v(o,2),q=v(d(m),2);ye(q,{size:"sm",variant:"outline"}),l(m),l(h);var V=v(h,2),R=d(V);{var U=n=>{var a=C(),u=P(a);he(u,()=>s.children),p(n,a)};k(R,n=>{s.children&&n(U)})}l(V),l(f),p(c,f)},$$slots:{default:!0}}),ie(),b()}export{at as component,tt as universal};
