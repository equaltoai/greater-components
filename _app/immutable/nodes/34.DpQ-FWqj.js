import{B as e,I as t,K as n,R as r,Tt as i,at as a,bt as o,ct as s,it as c,rt as l,ut as u,wt as d,yt as f}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{Rn as p}from"../chunks/CqG1B6Ni.js";import{t as m}from"../chunks/BrMfcLY_.js";import{t as h}from"../chunks/BuX9N8RZ.js";import{n as g}from"../chunks/Dq0wIi5u.js";var _=r(`<p class="footer-text svelte-cvvstn">Don't have an account? <a href="#register" class="svelte-cvvstn">Create one</a></p> <p class="footer-terms svelte-cvvstn">By signing in, you agree to our <a href="#terms" class="svelte-cvvstn">Terms of Service</a></p>`,1),v=r(`<section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Interactive Demo</h2> <p class="svelte-cvvstn">Click a provider button to simulate the OAuth flow. ~30% chance of error for demo purposes.</p> <div class="signin-demo svelte-cvvstn"><!></div> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">With Custom Footer</h2> <p class="svelte-cvvstn">Add registration links or terms of service in the footer slot.</p> <div class="signin-demo svelte-cvvstn"><!></div> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Component Props</h2> <table class="props-table svelte-cvvstn"><thead><tr><th class="svelte-cvvstn">Prop</th><th class="svelte-cvvstn">Type</th><th class="svelte-cvvstn">Default</th><th class="svelte-cvvstn">Description</th></tr></thead><tbody><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">title</code></td><td class="svelte-cvvstn">string</td><td class="svelte-cvvstn">"Sign in to continue"</td><td class="svelte-cvvstn">Card heading text</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">description</code></td><td class="svelte-cvvstn">string</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Optional subheading text</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">providers</code></td><td class="svelte-cvvstn">OAuthProvider[]</td><td class="svelte-cvvstn">required</td><td class="svelte-cvvstn">Array of OAuth providers to display</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">onSignIn</code></td><td class="svelte-cvvstn">(providerId: string) => Promise&lt;void&gt;</td><td class="svelte-cvvstn">required</td><td class="svelte-cvvstn">Callback when provider button is clicked</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">loading</code></td><td class="svelte-cvvstn">boolean</td><td class="svelte-cvvstn">false</td><td class="svelte-cvvstn">Whether any sign-in is in progress</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">loadingProvider</code></td><td class="svelte-cvvstn">string | null</td><td class="svelte-cvvstn">null</td><td class="svelte-cvvstn">ID of the provider currently loading</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">error</code></td><td class="svelte-cvvstn">string | null</td><td class="svelte-cvvstn">null</td><td class="svelte-cvvstn">Error message to display</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">onRetry</code></td><td class="svelte-cvvstn">() => void</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Callback when retry button is clicked</td></tr><tr><td class="svelte-cvvstn"><code class="svelte-cvvstn">footer</code></td><td class="svelte-cvvstn">Snippet</td><td class="svelte-cvvstn">undefined</td><td class="svelte-cvvstn">Custom footer content slot</td></tr></tbody></table></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">OAuthProvider Interface</h2> <!></section> <section class="demo-section svelte-cvvstn"><h2 class="svelte-cvvstn">Accessibility</h2> <ul class="a11y-list svelte-cvvstn"><li class="svelte-cvvstn"><strong>Keyboard:</strong> All buttons are keyboard accessible with Enter/Space activation</li> <li class="svelte-cvvstn"><strong>Focus:</strong> Focus is managed appropriately during loading and error states</li> <li class="svelte-cvvstn"><strong>Screen readers:</strong> Loading states and errors are announced via live regions</li> <li class="svelte-cvvstn"><strong>Disabled state:</strong> Buttons are properly disabled during loading</li></ul></section>`,1);function y(r,y){o(y,!0);let b=[{id:`github`,name:`GitHub`,icon:()=>null},{id:`google`,name:`Google`,icon:()=>null},{id:`mastodon`,name:`Mastodon`,icon:()=>null}],x=u(!1),S=u(null),C=u(null);async function w(e){s(S,e,!0),s(x,!0),s(C,null),await new Promise(e=>setTimeout(e,2e3)),Math.random()>.7?s(C,`Failed to authenticate with ${e}. Please try again.`):alert(`Successfully signed in with ${e}!`),s(x,!1),s(S,null)}function T(){s(C,null)}function E(){s(x,!1),s(S,null),s(C,null)}m(r,{eyebrow:`Auth Components`,title:`OAuth Sign-In Card`,description:`Pre-built sign-in card with OAuth provider buttons, loading states, and error handling for authentication flows.`,actions:n=>{p(n,{variant:`outline`,size:`sm`,onclick:E,children:(n,r)=>{d(),t(n,e(`Reset Demo`))},$$slots:{default:!0}})},children:(e,r)=>{var o=v(),s=c(o),u=a(l(s),4);g(l(u),{title:`Welcome back`,description:`Sign in to your account to continue`,get providers(){return b},onSignIn:w,get loading(){return n(x)},get loadingProvider(){return n(S)},get error(){return n(C)},onRetry:T}),i(u),h(a(u,2),{code:`<script>
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
/>`,language:`svelte`}),i(s);var f=a(s,2),p=a(l(f),4);g(l(p),{title:`Sign in to continue`,get providers(){return b},onSignIn:w,footer:e=>{var n=_();d(2),t(e,n)},$$slots:{footer:!0}}),i(p),h(a(p,2),{code:`<SignInCard 
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
</SignInCard>`,language:`svelte`}),i(f);var m=a(f,4);h(a(l(m),2),{code:`interface OAuthProvider {
  id: string;        // Unique identifier (e.g., 'github')
  name: string;      // Display name (e.g., 'GitHub')
  icon?: Component;  // Svelte icon component
  color?: string;    // Optional brand color
}`,language:`typescript`}),i(m),d(2),t(e,o)},$$slots:{actions:!0,default:!0}}),f()}export{y as component};