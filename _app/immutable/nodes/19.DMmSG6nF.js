import{B as e,Dt as t,Et as n,H as r,I as i,K as a,P as o,R as s,V as c,at as l,ft as u,ot as d,st as f,ut as p}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{$t as m,o as h}from"../chunks/6QSfMQ-W.js";import{t as g}from"../chunks/RYgqtqyS.js";import{t as _}from"../chunks/DjMfVXn_.js";var v=s(`<p class="dismissed-message svelte-qqyr26">Alert dismissed! <button class="svelte-qqyr26">Show again</button></p>`),y=s(`<section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Variants</h2> <p class="svelte-qqyr26">Alert supports four semantic variants for different message types.</p> <div class="alert-stack svelte-qqyr26"><!> <!> <!> <!></div> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Dismissible Alerts</h2> <p class="svelte-qqyr26">Add a close button to allow users to dismiss the alert.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Action Buttons</h2> <p class="svelte-qqyr26">Include an action button for user interaction.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Without Title</h2> <p class="svelte-qqyr26">Alerts can be used without a title for simpler messages.</p> <div class="alert-stack svelte-qqyr26"><!> <!></div></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Accessibility</h2> <ul class="a11y-list svelte-qqyr26"><li class="svelte-qqyr26"><strong>Role:</strong> Error and warning variants use <code class="svelte-qqyr26">role="alert"</code>, success and
				info use <code class="svelte-qqyr26">role="status"</code></li> <li class="svelte-qqyr26"><strong>Keyboard:</strong> Dismiss and action buttons are fully keyboard accessible</li> <li class="svelte-qqyr26"><strong>Screen readers:</strong> Alert content is announced appropriately based on variant</li> <li class="svelte-qqyr26"><strong>Focus:</strong> Focus is managed when alerts are dismissed</li></ul></section>`,1),b=s("```svelte <!>",1);function x(s){let c=u(!0);function x(){p(c,!1)}function S(){alert(`Action clicked!`)}function C(){p(c,!0)}n();var w=b();g(f(d(w)),{eyebrow:`Primitives`,title:`Alert Component`,description:`Versatile alert/banner component for displaying error, warning, success, and info messages with optional dismiss and action buttons.`,actions:t=>{m(t,{variant:`outline`,size:`sm`,onclick:C,children:(t,r)=>{n(),i(t,e(`Reset Demos`))},$$slots:{default:!0}})},children:(s,u)=>{var m=y(),g=d(m),b=f(l(g),4),C=l(b);h(C,{variant:`info`,title:`Information`,children:(t,r)=>{n(),i(t,e(`This is an informational message for general notices.`))},$$slots:{default:!0}});var w=f(C,2);h(w,{variant:`success`,title:`Success`,children:(t,r)=>{n(),i(t,e(`Your changes have been saved successfully.`))},$$slots:{default:!0}});var T=f(w,2);h(T,{variant:`warning`,title:`Warning`,children:(t,r)=>{n(),i(t,e(`Please review your input before continuing.`))},$$slots:{default:!0}}),h(f(T,2),{variant:`error`,title:`Error`,children:(t,r)=>{n(),i(t,e(`Something went wrong. Please try again.`))},$$slots:{default:!0}}),t(b),_(f(b,2),{code:`<Alert variant="info" title="Information">
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
</Alert>`,language:`svelte`}),t(g);var E=f(g,2),D=f(l(E),4),O=t=>{h(t,{variant:`info`,title:`Dismissible Alert`,dismissible:!0,onDismiss:x,children:(t,r)=>{n(),i(t,e(`Click the X button to dismiss this alert.`))},$$slots:{default:!0}})},k=e=>{var n=v(),a=f(l(n));t(n),r(`click`,a,()=>p(c,!0)),i(e,n)};o(D,e=>{a(c)?e(O):e(k,-1)}),_(f(D,2),{code:`<Alert 
  variant="info" 
  title="Dismissible Alert" 
  dismissible 
  onDismiss={handleDismiss}
>
  Click the X to dismiss this alert.
</Alert>`,language:`svelte`}),t(E);var A=f(E,2),j=f(l(A),4);h(j,{variant:`warning`,title:`Session Expiring`,actionLabel:`Extend Session`,onAction:S,children:(t,r)=>{n(),i(t,e(`Your session will expire in 5 minutes.`))},$$slots:{default:!0}}),_(f(j,2),{code:`<Alert 
  variant="warning" 
  title="Action Required"
  actionLabel="View Details"
  onAction={handleAction}
>
  Your session will expire soon.
</Alert>`,language:`svelte`}),t(A);var M=f(A,2),N=f(l(M),4),P=l(N);h(P,{variant:`success`,children:(t,r)=>{n(),i(t,e(`File uploaded successfully.`))},$$slots:{default:!0}}),h(f(P,2),{variant:`error`,children:(t,r)=>{n(),i(t,e(`Network connection lost.`))},$$slots:{default:!0}}),t(N),t(M),n(2),i(s,m)},$$slots:{actions:!0,default:!0}}),i(s,w)}c([`click`]);export{x as component};