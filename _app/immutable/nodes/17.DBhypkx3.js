import{h as G,t as o,a as i,b as $}from"../chunks/DBDgAjGS.js";import{s as t,f as S,c as l,d as q,e as H,L as a,r as c,g as J}from"../chunks/vA_cQ2fL.js";import{i as M}from"../chunks/C30VAfc1.js";import{D as O}from"../chunks/CXNFqa8o.js";import{C as h}from"../chunks/cIIzT7Tw.js";import{B as Q}from"../chunks/otYOiuC7.js";import{A as n}from"../chunks/CNDJdjj3.js";var Z=$('<p class="dismissed-message svelte-qqyr26">Alert dismissed! <button class="svelte-qqyr26">Show again</button></p>'),ee=$(`<section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Variants</h2> <p class="svelte-qqyr26">Alert supports four semantic variants for different message types.</p> <div class="alert-stack svelte-qqyr26"><!> <!> <!> <!></div> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Dismissible Alerts</h2> <p class="svelte-qqyr26">Add a close button to allow users to dismiss the alert.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Action Buttons</h2> <p class="svelte-qqyr26">Include an action button for user interaction.</p> <!> <!></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Without Title</h2> <p class="svelte-qqyr26">Alerts can be used without a title for simpler messages.</p> <div class="alert-stack svelte-qqyr26"><!> <!></div></section> <section class="demo-section svelte-qqyr26"><h2 class="svelte-qqyr26">Accessibility</h2> <ul class="a11y-list svelte-qqyr26"><li class="svelte-qqyr26"><strong>Role:</strong> Error and warning variants use <code class="svelte-qqyr26">role="alert"</code>, success and
				info use <code class="svelte-qqyr26">role="status"</code></li> <li class="svelte-qqyr26"><strong>Keyboard:</strong> Dismiss and action buttons are fully keyboard accessible</li> <li class="svelte-qqyr26"><strong>Screen readers:</strong> Alert content is announced appropriately based on variant</li> <li class="svelte-qqyr26"><strong>Focus:</strong> Focus is managed when alerts are dismissed</li></ul></section>`,1),se=$("```svelte <!>",1);function de(E){let v=H(!0);function Y(){q(v,!1)}function B(){alert("Action clicked!")}function F(){q(v,!0)}const I=`<Alert variant="info" title="Information">
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
</Alert>`,L=`<Alert 
  variant="info" 
  title="Dismissible Alert" 
  dismissible 
  onDismiss={handleDismiss}
>
  Click the X to dismiss this alert.
</Alert>`,R=`<Alert 
  variant="warning" 
  title="Action Required"
  actionLabel="View Details"
  onAction={handleAction}
>
  Your session will expire soon.
</Alert>`;a();var y=se(),T=t(S(y));O(T,{eyebrow:"Primitives",title:"Alert Component",description:"Versatile alert/banner component for displaying error, warning, success, and info messages with optional dismiss and action buttons.",actions:u=>{Q(u,{variant:"outline",size:"sm",onclick:F,children:(b,m)=>{a();var d=o("Reset Demos");i(b,d)},$$slots:{default:!0}})},children:(u,b)=>{var m=ee(),d=S(m),f=t(l(d),4),_=l(f);n(_,{variant:"info",title:"Information",children:(e,r)=>{a();var s=o("This is an informational message for general notices.");i(e,s)},$$slots:{default:!0}});var A=t(_,2);n(A,{variant:"success",title:"Success",children:(e,r)=>{a();var s=o("Your changes have been saved successfully.");i(e,s)},$$slots:{default:!0}});var w=t(A,2);n(w,{variant:"warning",title:"Warning",children:(e,r)=>{a();var s=o("Please review your input before continuing.");i(e,s)},$$slots:{default:!0}});var V=t(w,2);n(V,{variant:"error",title:"Error",children:(e,r)=>{a();var s=o("Something went wrong. Please try again.");i(e,s)},$$slots:{default:!0}}),c(f);var W=t(f,2);h(W,{code:I,language:"svelte"}),c(d);var g=t(d,2),x=t(l(g),4);{var X=e=>{n(e,{variant:"info",title:"Dismissible Alert",dismissible:!0,onDismiss:Y,children:(r,s)=>{a();var j=o("Click the X button to dismiss this alert.");i(r,j)},$$slots:{default:!0}})},z=e=>{var r=Z(),s=t(l(r));s.__click=()=>q(v,!0),c(r),i(e,r)};M(x,e=>{J(v)?e(X):e(z,!1)})}var K=t(x,2);h(K,{code:L,language:"svelte"}),c(g);var p=t(g,2),P=t(l(p),4);n(P,{variant:"warning",title:"Session Expiring",actionLabel:"Extend Session",onAction:B,children:(e,r)=>{a();var s=o("Your session will expire in 5 minutes.");i(e,s)},$$slots:{default:!0}});var N=t(P,2);h(N,{code:R,language:"svelte"}),c(p);var D=t(p,2),k=t(l(D),4),C=l(k);n(C,{variant:"success",children:(e,r)=>{a();var s=o("File uploaded successfully.");i(e,s)},$$slots:{default:!0}});var U=t(C,2);n(U,{variant:"error",children:(e,r)=>{a();var s=o("Network connection lost.");i(e,s)},$$slots:{default:!0}}),c(k),c(D),a(2),i(u,m)},$$slots:{actions:!0,default:!0}}),i(E,y)}G(["click"]);export{de as component};
