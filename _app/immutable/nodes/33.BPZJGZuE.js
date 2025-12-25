import"../chunks/DsnmJJEf.js";import{p as Y,b as L,g as W,c as _,s as v,a as i,h as t,u as b,i as G,t as z,d as Z,X as y,j as F,r as h,e as Q,m as N,l as c}from"../chunks/fhmmTLCl.js";import{D as rt}from"../chunks/CjITXy4O.js";import{C as U}from"../chunks/CtKsLE06.js";import"../chunks/CKLnk_eO.js";import{p as k,i as H}from"../chunks/Bv8pTBk7.js";import{f as at}from"../chunks/hw2FEYC7.js";import{c as it}from"../chunks/B-xWB8BY.js";import{C as lt,A as ct,B as tt}from"../chunks/BHh5kNhB.js";import{H as vt}from"../chunks/BfmuvKWC.js";import{T as dt}from"../chunks/CP5_GJ5q.js";var ut=L('<div class="auth-sign-in-card__header svelte-1lgacio"><!> <!></div>'),gt=L('<div class="auth-sign-in-card__content svelte-1lgacio"><!> <div class="auth-sign-in-card__providers svelte-1lgacio" role="group" aria-label="Sign in options"></div></div> <!>',1);function V(M,e){Y(e,!0);let X=k(e,"title",3,"Sign in to continue"),O=k(e,"loading",3,!1),R=k(e,"loadingProvider",3,null),$=k(e,"error",3,null),I=k(e,"class",3,"");async function P(g){O()||await e.onSignIn(g.id)}function f(g){return O()&&R()===g}function B(g){return O()&&R()!==null&&R()!==g}const E=b(()=>["auth-sign-in-card",I()].filter(Boolean).join(" "));lt(M,{variant:"elevated",padding:"lg",get class(){return t(E)},header:w=>{var S=ut(),l=_(S);vt(l,{level:2,size:"xl",align:"center",class:"auth-sign-in-card__title",children:(r,a)=>{y();var d=G();z(()=>F(d,X())),i(r,d)},$$slots:{default:!0}});var o=v(l,2);{var m=r=>{dt(r,{size:"sm",color:"secondary",align:"center",class:"auth-sign-in-card__description",children:(a,d)=>{y();var C=G();z(()=>F(C,e.description)),i(a,C)},$$slots:{default:!0}})};H(o,r=>{e.description&&r(m)})}h(S),i(w,S)},children:(w,S)=>{var l=gt(),o=W(l),m=_(o);{var r=n=>{{let s=b(()=>!!e.onRetry),u=b(()=>e.onRetry?"Try again":void 0);ct(n,{variant:"error",get dismissible(){return t(s)},get onDismiss(){return e.onRetry},get actionLabel(){return t(u)},get onAction(){return e.onRetry},class:"auth-sign-in-card__error",children:(A,T)=>{y();var p=G();z(()=>F(p,$())),i(A,p)},$$slots:{default:!0}})}};H(m,n=>{$()&&n(r)})}var a=v(m,2);at(a,21,()=>e.providers,n=>n.id,(n,s)=>{const u=b(()=>f(t(s).id)),A=b(()=>B(t(s).id));{const T=D=>{var q=Q(),x=W(q);{var j=K=>{const et=b(()=>t(s).icon);var J=Q(),st=W(J);it(st,()=>t(et),(nt,ot)=>{ot(nt,{size:20,"aria-hidden":"true"})}),i(K,J)};H(x,K=>{t(s).icon&&!t(u)&&K(j)})}i(D,q)};let p=b(()=>`Sign in with ${t(s).name}`);tt(n,{variant:"outline",size:"lg",class:"auth-sign-in-card__provider-button",get disabled(){return t(A)},get loading(){return t(u)},loadingBehavior:"replace-prefix",onclick:()=>P(t(s)),get"aria-label"(){return t(p)},get"aria-busy"(){return t(u)},prefix:T,children:(D,q)=>{y();var x=G();z(()=>F(x,`Continue with ${t(s).name??""}`)),i(D,x)},$$slots:{prefix:!0,default:!0}})}}),h(a),h(o);var d=v(o,2);{var C=n=>{};H(d,n=>{e.footer&&n(C)})}i(w,l)},$$slots:{header:!0,default:!0}}),Z()}var ht=L(`<p class="footer-text svelte-cvvstn">Don't have an account? <a href="#register" class="svelte-cvvstn">Create one</a></p> <p class="footer-terms svelte-cvvstn">By signing in, you agree to our <a href="#terms" class="svelte-cvvstn">Terms of Service</a></p>`,1),ft=L('<section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Interactive Demo</h2> <p class="svelte-cvvstn">Click a provider button to simulate the OAuth flow. ~30% chance of error for demo purposes.</p> <div class="signin-demo svelte-cvvstn"><!></div> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">With Custom Footer</h2> <p class="svelte-cvvstn">Add registration links or terms of service in the footer slot.</p> <div class="signin-demo svelte-cvvstn"><!></div> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Component Props</h2> <table class="props-table svelte-cvvstn"><thead><tr><th class="svelte-cvvstn">Prop</th><th class="svelte-cvvstn">Type</th><th class="svelte-cvvstn">Default</th><th class="svelte-cvvstn">Description</th></tr></thead><tbody><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">title</code></td><td class="svelte-cvvstn">string</td><td class="svelte-cvvstn">"Sign in to continue"</td><td class="svelte-cvvstn">Card heading text</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">description</code></td><td class="svelte-cvvstn">string</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Optional subheading text</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">providers</code></td><td class="svelte-cvvstn">OAuthProvider[]</td><td class="svelte-cvvstn">required</td><td class="svelte-cvvstn">Array of OAuth providers to display</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">onSignIn</code></td><td class="svelte-cvvstn">(providerId: string) => Promise&lt;void&gt;</td><td class="svelte-cvvstn">required</td><td class="svelte-cvvstn">Callback when provider button is clicked</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">loading</code></td><td class="svelte-cvvstn">boolean</td><td class="svelte-cvvstn">false</td><td class="svelte-cvvstn">Whether any sign-in is in progress</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">loadingProvider</code></td><td class="svelte-cvvstn">string | null</td><td class="svelte-cvvstn">null</td><td class="svelte-cvvstn">ID of the provider currently loading</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">error</code></td><td class="svelte-cvvstn">string | null</td><td class="svelte-cvvstn">null</td><td class="svelte-cvvstn">Error message to display</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">onRetry</code></td><td class="svelte-cvvstn">() => void</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Callback when retry button is clicked</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">footer</code></td><td class="svelte-cvvstn">Snippet</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Custom footer content slot</td></tr></tbody></table></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">OAuthProvider Interface</h2> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Accessibility</h2> <ul class="a11y-list svelte-cvvstn"><li class="svelte-cvvstn"><strong>Keyboard:</strong> All buttons are keyboard accessible with Enter/Space activation</li> <li class="svelte-cvvstn"><strong>Focus:</strong> Focus is managed appropriately during loading and error states</li> <li class="svelte-cvvstn"><strong>Screen readers:</strong> Loading states and errors are announced via live regions</li> <li class="svelte-cvvstn"><strong>Disabled state:</strong> Buttons are properly disabled during loading</li></ul></section>',1);function wt(M,e){Y(e,!0);const $=[{id:"github",name:"GitHub",icon:()=>null},{id:"google",name:"Google",icon:()=>null},{id:"mastodon",name:"Mastodon",icon:()=>null}];let I=N(!1),P=N(null),f=N(null);async function B(l){c(P,l,!0),c(I,!0),c(f,null),await new Promise(o=>setTimeout(o,2e3)),Math.random()>.7?c(f,`Failed to authenticate with ${l}. Please try again.`):alert(`Successfully signed in with ${l}!`),c(I,!1),c(P,null)}function E(){c(f,null)}function g(){c(I,!1),c(P,null),c(f,null)}const w=`<script>
  import { SignInCard } from '@equaltoai/greater-components-auth';
  import { GithubIcon, GoogleIcon } from '@equaltoai/greater-components-icons';

  const providers = [
    { id: 'github', name: 'GitHub', icon: GithubIcon },
    { id: 'google', name: 'Google', icon: GoogleIcon },
  ];

  let loading = $state(false);
  let loadingProvider = $state(null);
  let error = $state(null);

  async function handleSignIn(providerId) {
    loadingProvider = providerId;
    loading = true;
    try {
      await signInWithProvider(providerId);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
      loadingProvider = null;
    }
  }
<\/script>

<SignInCard 
  title="Welcome back"
  description="Sign in to your account"
  {providers}
  onSignIn={handleSignIn}
  {loading}
  {loadingProvider}
  {error}
  onRetry={() => error = null}
/>`,S=`<SignInCard 
  title="Sign in to continue"
  {providers}
  onSignIn={handleSignIn}
>
  {#snippet footer()}
    <p>
      Don't have an account? 
      <a href="/register">Create one</a>
    </p>
  {/snippet}
</SignInCard>`;rt(M,{eyebrow:"Auth Components",title:"OAuth Sign-In Card",description:"Pre-built sign-in card with OAuth provider buttons, loading states, and error handling for authentication flows.",actions:o=>{tt(o,{variant:"outline",size:"sm",onclick:g,children:(m,r)=>{y();var a=G("Reset Demo");i(m,a)},$$slots:{default:!0}})},children:(o,m)=>{var r=ft(),a=W(r),d=v(_(a),4),C=_(d);V(C,{title:"Welcome back",description:"Sign in to your account to continue",get providers(){return $},onSignIn:B,get loading(){return t(I)},get loadingProvider(){return t(P)},get error(){return t(f)},onRetry:E}),h(d);var n=v(d,2);U(n,{code:w,language:"svelte"}),h(a);var s=v(a,2),u=v(_(s),4),A=_(u);V(A,{title:"Sign in to continue",get providers(){return $},onSignIn:B,footer:x=>{var j=ht();y(2),i(x,j)},$$slots:{footer:!0}}),h(u);var T=v(u,2);U(T,{code:S,language:"svelte"}),h(s);var p=v(s,4),D=v(_(p),2);U(D,{code:`interface OAuthProvider {
  id: string;        // Unique identifier (e.g., 'github')
  name: string;      // Display name (e.g., 'GitHub')
  icon?: Component;  // Svelte icon component
  color?: string;    // Optional brand color
}`,language:"typescript"}),h(p),y(2),i(o,r)},$$slots:{actions:!0,default:!0}}),Z()}export{wt as component};
