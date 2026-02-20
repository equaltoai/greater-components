import{g as G,t as o,a as i,b as $,h as H}from"../chunks/BTgIKdxS.js";import{s as t,f as S,c as l,d as q,h as J,R as a,r as c,g as M}from"../chunks/D-WlePPY.js";import{i as O}from"../chunks/COMTHQNu.js";import{D as Q}from"../chunks/DhBnkOx0.js";import{C as h}from"../chunks/DeXdVqsM.js";import{B as Z}from"../chunks/B3zyJtUo.js";import{A as n}from"../chunks/CyXc35a2.js";var ee=$('<p class="dismissed-message svelte-qqyr26">Alert dismissed! <button class="svelte-qqyr26">Show again</button></p>'),se=$(`<section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Variants</h2> <p class="svelte-qqyr26">Alert supports four semantic variants for different message types.</p> <div class="alert-stack svelte-qqyr26"><!> <!> <!> <!></div> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Dismissible Alerts</h2> <p class="svelte-qqyr26">Add a close button to allow users to dismiss the alert.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Action Buttons</h2> <p class="svelte-qqyr26">Include an action button for user interaction.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Without Title</h2> <p class="svelte-qqyr26">Alerts can be used without a title for simpler messages.</p> <div class="alert-stack svelte-qqyr26"><!> <!></div></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Accessibility</h2> <ul class="a11y-list svelte-qqyr26"><li class="svelte-qqyr26"><strong>Role:</strong> Error and warning variants use <code class="svelte-qqyr26">role="alert"</code>, success and
				info use <code class="svelte-qqyr26">role="status"</code></li> <li class="svelte-qqyr26"><strong>Keyboard:</strong> Dismiss and action buttons are fully keyboard accessible</li> <li class="svelte-qqyr26"><strong>Screen readers:</strong> Alert content is announced appropriately based on variant</li> <li class="svelte-qqyr26"><strong>Focus:</strong> Focus is managed when alerts are dismissed</li></ul></section>`,1),te=$("```svelte <!>",1);function ve(E){let v=J(!0);function R(){q(v,!1)}function Y(){alert("Action clicked!")}function B(){q(v,!0)}const F=`<Alert variant="info" title="Information">
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
</Alert>`,I=`<Alert 
  variant="info" 
  title="Dismissible Alert" 
  dismissible 
  onDismiss={handleDismiss}
>
  Click the X to dismiss this alert.
</Alert>`,T=`<Alert 
  variant="warning" 
  title="Action Required"
  actionLabel="View Details"
  onAction={handleAction}
>
  Your session will expire soon.
</Alert>`;a();var y=te(),V=t(S(y));Q(V,{eyebrow:"Primitives",title:"Alert Component",description:"Versatile alert/banner component for displaying error, warning, success, and info messages with optional dismiss and action buttons.",actions:u=>{Z(u,{variant:"outline",size:"sm",onclick:B,children:(b,m)=>{a();var d=o("Reset Demos");i(b,d)},$$slots:{default:!0}})},children:(u,b)=>{var m=se(),d=S(m),f=t(l(d),4),A=l(f);n(A,{variant:"info",title:"Information",children:(e,r)=>{a();var s=o("This is an informational message for general notices.");i(e,s)},$$slots:{default:!0}});var _=t(A,2);n(_,{variant:"success",title:"Success",children:(e,r)=>{a();var s=o("Your changes have been saved successfully.");i(e,s)},$$slots:{default:!0}});var w=t(_,2);n(w,{variant:"warning",title:"Warning",children:(e,r)=>{a();var s=o("Please review your input before continuing.");i(e,s)},$$slots:{default:!0}});var W=t(w,2);n(W,{variant:"error",title:"Error",children:(e,r)=>{a();var s=o("Something went wrong. Please try again.");i(e,s)},$$slots:{default:!0}}),c(f);var L=t(f,2);h(L,{code:F,language:"svelte"}),c(d);var g=t(d,2),x=t(l(g),4);{var X=e=>{n(e,{variant:"info",title:"Dismissible Alert",dismissible:!0,onDismiss:R,children:(r,s)=>{a();var j=o("Click the X button to dismiss this alert.");i(r,j)},$$slots:{default:!0}})},z=e=>{var r=ee(),s=t(l(r));c(r),H("click",s,()=>q(v,!0)),i(e,r)};O(x,e=>{M(v)?e(X):e(z,!1)})}var K=t(x,2);h(K,{code:I,language:"svelte"}),c(g);var p=t(g,2),P=t(l(p),4);n(P,{variant:"warning",title:"Session Expiring",actionLabel:"Extend Session",onAction:Y,children:(e,r)=>{a();var s=o("Your session will expire in 5 minutes.");i(e,s)},$$slots:{default:!0}});var N=t(P,2);h(N,{code:T,language:"svelte"}),c(p);var D=t(p,2),k=t(l(D),4),C=l(k);n(C,{variant:"success",children:(e,r)=>{a();var s=o("File uploaded successfully.");i(e,s)},$$slots:{default:!0}});var U=t(C,2);n(U,{variant:"error",children:(e,r)=>{a();var s=o("Network connection lost.");i(e,s)},$$slots:{default:!0}}),c(k),c(D),a(2),i(u,m)},$$slots:{actions:!0,default:!0}}),i(E,y)}G(["click"]);export{ve as component};
