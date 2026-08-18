import{B as e,Dt as t,Et as n,H as r,I as i,K as a,P as o,R as s,V as c,at as l,ft as u,ot as d,st as f,ut as p}from"../chunks/xyBo9fw_.js";import"../chunks/xihTtKlq.js";import{en as m,o as h}from"../chunks/DnPrlpXk.js";import{t as g}from"../chunks/Bv4csXnx.js";import{t as _}from"../chunks/C1qIpVBb.js";var v=s(`<p class="dismissed-message svelte-qqyr26">Alert dismissed! <button class="svelte-qqyr26">Show again</button></p>`),y=s(`<section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Variants</h2> <p class="svelte-qqyr26">Alert supports four semantic variants for different message types.</p> <div class="alert-stack svelte-qqyr26"><!> <!> <!> <!></div> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Dismissible Alerts</h2> <p class="svelte-qqyr26">Add a close button to allow users to dismiss the alert.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Action Buttons</h2> <p class="svelte-qqyr26">Include an action button for user interaction.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Without Title</h2> <p class="svelte-qqyr26">Alerts can be used without a title for simpler messages.</p> <div class="alert-stack svelte-qqyr26"><!> <!></div></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Accessibility</h2> <ul class="a11y-list svelte-qqyr26"><li class="svelte-qqyr26"><strong>Role:</strong> Error and warning variants use <code class="svelte-qqyr26">role="alert"</code>, success and
				info use <code class="svelte-qqyr26">role="status"</code></li> <li class="svelte-qqyr26"><strong>Keyboard:</strong> Dismiss and action buttons are fully keyboard accessible</li> <li class="svelte-qqyr26"><strong>Screen readers:</strong> Alert content is announced appropriately based on variant</li> <li class="svelte-qqyr26"><strong>Focus:</strong> Focus is managed when alerts are dismissed</li></ul></section>`,1),b=s("```svelte <!>",1);function x(s){let c=u(!0);function x(){p(c,!1)}function S(){alert(`Action clicked!`)}function C(){p(c,!0)}n();var w=b(),T=f(d(w));g(T,{eyebrow:`Primitives`,title:`Alert Component`,description:`Versatile alert/banner component for displaying error, warning, success, and info messages with optional dismiss and action buttons.`,actions:t=>{m(t,{variant:`outline`,size:`sm`,onclick:C,children:(t,r)=>{n();var a=e(`Reset Demos`);i(t,a)},$$slots:{default:!0}})},children:(s,u)=>{var m=y(),g=d(m),b=f(l(g),4),C=l(b);h(C,{variant:`info`,title:`Information`,children:(t,r)=>{n();var a=e(`This is an informational message for general notices.`);i(t,a)},$$slots:{default:!0}});var w=f(C,2);h(w,{variant:`success`,title:`Success`,children:(t,r)=>{n();var a=e(`Your changes have been saved successfully.`);i(t,a)},$$slots:{default:!0}});var T=f(w,2);h(T,{variant:`warning`,title:`Warning`,children:(t,r)=>{n();var a=e(`Please review your input before continuing.`);i(t,a)},$$slots:{default:!0}});var E=f(T,2);h(E,{variant:`error`,title:`Error`,children:(t,r)=>{n();var a=e(`Something went wrong. Please try again.`);i(t,a)},$$slots:{default:!0}}),t(b);var D=f(b,2);_(D,{code:`<Alert variant="info" title="Information">
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
</Alert>`,language:`svelte`}),t(g);var O=f(g,2),k=f(l(O),4),A=t=>{h(t,{variant:`info`,title:`Dismissible Alert`,dismissible:!0,onDismiss:x,children:(t,r)=>{n();var a=e(`Click the X button to dismiss this alert.`);i(t,a)},$$slots:{default:!0}})},j=e=>{var n=v(),a=f(l(n));t(n),r(`click`,a,()=>p(c,!0)),i(e,n)};o(k,e=>{a(c)?e(A):e(j,-1)});var M=f(k,2);_(M,{code:`<Alert 
  variant="info" 
  title="Dismissible Alert" 
  dismissible 
  onDismiss={handleDismiss}
>
  Click the X to dismiss this alert.
</Alert>`,language:`svelte`}),t(O);var N=f(O,2),P=f(l(N),4);h(P,{variant:`warning`,title:`Session Expiring`,actionLabel:`Extend Session`,onAction:S,children:(t,r)=>{n();var a=e(`Your session will expire in 5 minutes.`);i(t,a)},$$slots:{default:!0}});var F=f(P,2);_(F,{code:`<Alert 
  variant="warning" 
  title="Action Required"
  actionLabel="View Details"
  onAction={handleAction}
>
  Your session will expire soon.
</Alert>`,language:`svelte`}),t(N);var I=f(N,2),L=f(l(I),4),R=l(L);h(R,{variant:`success`,children:(t,r)=>{n();var a=e(`File uploaded successfully.`);i(t,a)},$$slots:{default:!0}});var z=f(R,2);h(z,{variant:`error`,children:(t,r)=>{n();var a=e(`Network connection lost.`);i(t,a)},$$slots:{default:!0}}),t(L),t(I),n(2),i(s,m)},$$slots:{actions:!0,default:!0}}),i(s,w)}c([`click`]);export{x as component};