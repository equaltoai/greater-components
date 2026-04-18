import{B as e,H as t,I as n,K as r,P as i,R as a,Tt as o,V as s,at as c,ct as l,it as u,rt as d,ut as f,wt as p}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{Rn as m,o as h}from"../chunks/CqG1B6Ni.js";import{t as g}from"../chunks/BrMfcLY_.js";import{t as _}from"../chunks/D4m1vxU5.js";var v=a(`<p class="dismissed-message svelte-qqyr26">Alert dismissed! <button class="svelte-qqyr26">Show again</button></p>`),y=a(`<section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Variants</h2> <p class="svelte-qqyr26">Alert supports four semantic variants for different message types.</p> <div class="alert-stack svelte-qqyr26"><!> <!> <!> <!></div> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Dismissible Alerts</h2> <p class="svelte-qqyr26">Add a close button to allow users to dismiss the alert.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Action Buttons</h2> <p class="svelte-qqyr26">Include an action button for user interaction.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Without Title</h2> <p class="svelte-qqyr26">Alerts can be used without a title for simpler messages.</p> <div class="alert-stack svelte-qqyr26"><!> <!></div></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Accessibility</h2> <ul class="a11y-list svelte-qqyr26"><li class="svelte-qqyr26"><strong>Role:</strong> Error and warning variants use <code class="svelte-qqyr26">role="alert"</code>, success and
				info use <code class="svelte-qqyr26">role="status"</code></li> <li class="svelte-qqyr26"><strong>Keyboard:</strong> Dismiss and action buttons are fully keyboard accessible</li> <li class="svelte-qqyr26"><strong>Screen readers:</strong> Alert content is announced appropriately based on variant</li> <li class="svelte-qqyr26"><strong>Focus:</strong> Focus is managed when alerts are dismissed</li></ul></section>`,1),b=a("```svelte <!>",1);function x(a){let s=f(!0);function x(){l(s,!1)}function S(){alert(`Action clicked!`)}function C(){l(s,!0)}p();var w=b();g(c(u(w)),{eyebrow:`Primitives`,title:`Alert Component`,description:`Versatile alert/banner component for displaying error, warning, success, and info messages with optional dismiss and action buttons.`,actions:t=>{m(t,{variant:`outline`,size:`sm`,onclick:C,children:(t,r)=>{p(),n(t,e(`Reset Demos`))},$$slots:{default:!0}})},children:(a,f)=>{var m=y(),g=u(m),b=c(d(g),4),C=d(b);h(C,{variant:`info`,title:`Information`,children:(t,r)=>{p(),n(t,e(`This is an informational message for general notices.`))},$$slots:{default:!0}});var w=c(C,2);h(w,{variant:`success`,title:`Success`,children:(t,r)=>{p(),n(t,e(`Your changes have been saved successfully.`))},$$slots:{default:!0}});var T=c(w,2);h(T,{variant:`warning`,title:`Warning`,children:(t,r)=>{p(),n(t,e(`Please review your input before continuing.`))},$$slots:{default:!0}}),h(c(T,2),{variant:`error`,title:`Error`,children:(t,r)=>{p(),n(t,e(`Something went wrong. Please try again.`))},$$slots:{default:!0}}),o(b),_(c(b,2),{code:`<Alert variant="info" title="Information">
  This is an informational message.
</Alert>

<Alert variant="success" title="Success">
  Your changes have been saved.
</Alert>

<Alert variant="warning" title="Warning">
  Please review before continuing.
</Alert>

<Alert variant="error" title="Error">
  Something went wrong.
</Alert>`,language:`svelte`}),o(g);var E=c(g,2),D=c(d(E),4),O=t=>{h(t,{variant:`info`,title:`Dismissible Alert`,dismissible:!0,onDismiss:x,children:(t,r)=>{p(),n(t,e(`Click the X button to dismiss this alert.`))},$$slots:{default:!0}})},k=e=>{var r=v(),i=c(d(r));o(r),t(`click`,i,()=>l(s,!0)),n(e,r)};i(D,e=>{r(s)?e(O):e(k,-1)}),_(c(D,2),{code:`<Alert 
  variant="info" 
  title="Dismissible Alert" 
  dismissible 
  onDismiss={handleDismiss}
>
  Click the X to dismiss this alert.
</Alert>`,language:`svelte`}),o(E);var A=c(E,2),j=c(d(A),4);h(j,{variant:`warning`,title:`Session Expiring`,actionLabel:`Extend Session`,onAction:S,children:(t,r)=>{p(),n(t,e(`Your session will expire in 5 minutes.`))},$$slots:{default:!0}}),_(c(j,2),{code:`<Alert 
  variant="warning" 
  title="Action Required"
  actionLabel="View Details"
  onAction={handleAction}
>
  Your session will expire soon.
</Alert>`,language:`svelte`}),o(A);var M=c(A,2),N=c(d(M),4),P=d(N);h(P,{variant:`success`,children:(t,r)=>{p(),n(t,e(`File uploaded successfully.`))},$$slots:{default:!0}}),h(c(P,2),{variant:`error`,children:(t,r)=>{p(),n(t,e(`Network connection lost.`))},$$slots:{default:!0}}),o(N),o(M),p(2),n(a,m)},$$slots:{actions:!0,default:!0}}),n(a,w)}s([`click`]);export{x as component};