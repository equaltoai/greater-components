import{B as e,Dt as t,Et as n,I as r,K as i,R as a,St as o,at as s,ft as c,ot as l,st as u,ut as d,xt as f}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{$t as p}from"../chunks/6QSfMQ-W.js";import{t as m}from"../chunks/RYgqtqyS.js";import{t as h}from"../chunks/DjMfVXn_.js";import{n as g}from"../chunks/CbDuAQq-.js";var _=a(`<p class="footer-text svelte-cvvstn">Don't have an account? <a href="#register" class="svelte-cvvstn">Create one</a></p> <p class="footer-terms svelte-cvvstn">By signing in, you agree to our <a href="#terms" class="svelte-cvvstn">Terms of Service</a></p>`,1),v=a(`<section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Interactive Demo</h2> <p class="svelte-cvvstn">Click a provider button to simulate the OAuth flow. ~30% chance of error for demo purposes.</p> <div class="signin-demo svelte-cvvstn"><!></div> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">With Custom Footer</h2> <p class="svelte-cvvstn">Add registration links or terms of service in the footer slot.</p> <div class="signin-demo svelte-cvvstn"><!></div> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Component Props</h2> <table class="props-table svelte-cvvstn"><thead><tr><th class="svelte-cvvstn">Prop</th><th class="svelte-cvvstn">Type</th><th class="svelte-cvvstn">Default</th><th class="svelte-cvvstn">Description</th></tr></thead><tbody><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">title</code></td><td class="svelte-cvvstn">string</td><td class="svelte-cvvstn">"Sign in to continue"</td><td class="svelte-cvvstn">Card heading text</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">description</code></td><td class="svelte-cvvstn">string</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Optional subheading text</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">providers</code></td><td class="svelte-cvvstn">OAuthProvider[]</td><td class="svelte-cvvstn">required</td><td class="svelte-cvvstn">Array of OAuth providers to display</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">onSignIn</code></td><td class="svelte-cvvstn">(providerId: string) => Promise&lt;void&gt;</td><td class="svelte-cvvstn">required</td><td class="svelte-cvvstn">Callback when provider button is clicked</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">loading</code></td><td class="svelte-cvvstn">boolean</td><td class="svelte-cvvstn">false</td><td class="svelte-cvvstn">Whether any sign-in is in progress</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">loadingProvider</code></td><td class="svelte-cvvstn">string | null</td><td class="svelte-cvvstn">null</td><td class="svelte-cvvstn">ID of the provider currently loading</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">error</code></td><td class="svelte-cvvstn">string | null</td><td class="svelte-cvvstn">null</td><td class="svelte-cvvstn">Error message to display</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">onRetry</code></td><td class="svelte-cvvstn">() => void</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Callback when retry button is clicked</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">footer</code></td><td class="svelte-cvvstn">Snippet</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Custom footer content slot</td></tr></tbody></table></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">OAuthProvider Interface</h2> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Accessibility</h2> <ul class="a11y-list svelte-cvvstn"><li class="svelte-cvvstn"><strong>Keyboard:</strong> All buttons are keyboard accessible with Enter/Space activation</li> <li class="svelte-cvvstn"><strong>Focus:</strong> Focus is managed appropriately during loading and error states</li> <li class="svelte-cvvstn"><strong>Screen readers:</strong> Loading states and errors are announced via live regions</li> <li class="svelte-cvvstn"><strong>Disabled state:</strong> Buttons are properly disabled during loading</li></ul></section>`,1);function y(a,y){o(y,!0);let b=[{id:`github`,name:`GitHub`,icon:()=>null},{id:`google`,name:`Google`,icon:()=>null},{id:`mastodon`,name:`Mastodon`,icon:()=>null}],x=c(!1),S=c(null),C=c(null);async function w(e){d(S,e,!0),d(x,!0),d(C,null),await new Promise(e=>setTimeout(e,2e3)),Math.random()>.7?d(C,`Failed to authenticate with ${e}. Please try again.`):alert(`Successfully signed in with ${e}!`),d(x,!1),d(S,null)}function T(){d(C,null)}function E(){d(x,!1),d(S,null),d(C,null)}m(a,{eyebrow:`Auth Components`,title:`OAuth Sign-In Card`,description:`Pre-built sign-in card with OAuth provider buttons, loading states, and error handling for authentication flows.`,actions:t=>{p(t,{variant:`outline`,size:`sm`,onclick:E,children:(t,i)=>{n(),r(t,e(`Reset Demo`))},$$slots:{default:!0}})},children:(e,a)=>{var o=v(),c=l(o),d=u(s(c),4);g(s(d),{title:`Welcome back`,description:`Sign in to your account to continue`,get providers(){return b},onSignIn:w,get loading(){return i(x)},get loadingProvider(){return i(S)},get error(){return i(C)},onRetry:T}),t(d),h(u(d,2),{code:`<script>
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
/>`,language:`svelte`}),t(c);var f=u(c,2),p=u(s(f),4);g(s(p),{title:`Sign in to continue`,get providers(){return b},onSignIn:w,footer:e=>{var t=_();n(2),r(e,t)},$$slots:{footer:!0}}),t(p),h(u(p,2),{code:`<SignInCard 
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
</SignInCard>`,language:`svelte`}),t(f);var m=u(f,4);h(u(s(m),2),{code:`interface OAuthProvider {
  id: string;        // Unique identifier (e.g., 'github')
  name: string;      // Display name (e.g., 'GitHub')
  icon?: Component;  // Svelte icon component
  color?: string;    // Optional brand color
}`,language:`typescript`}),t(m),n(2),r(e,o)},$$slots:{actions:!0,default:!0}}),f()}export{y as component};