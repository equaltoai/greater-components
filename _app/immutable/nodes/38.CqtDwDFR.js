import{Dt as e,Et as t,I as n,K as r,R as i,St as a,at as o,ft as s,ot as c,st as l,ut as u,xt as d}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{Bt as f,Ot as p,Q as m,ot as h}from"../chunks/6QSfMQ-W.js";import{t as g}from"../chunks/RYgqtqyS.js";import{t as _}from"../chunks/DjMfVXn_.js";import{t as v}from"../chunks/CbDuAQq-.js";var y=i(`<section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Dropdown Variant (Default)</h2> <p class="svelte-1xrxt96">Click the avatar to open a dropdown menu with user info and actions.</p> <div class="demo-area svelte-1xrxt96"><!></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Inline Variant</h2> <p class="svelte-1xrxt96">Displays user info inline with a sign-out button, useful for sidebars or headers.</p> <div class="demo-area inline-demo svelte-1xrxt96"><!></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Avatar Fallback</h2> <p class="svelte-1xrxt96">When no image is provided, displays initials from the user's name.</p> <div class="demo-area svelte-1xrxt96"><!></div></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Size Variants</h2> <p class="svelte-1xrxt96">Three size options for different contexts.</p> <div class="demo-area sizes-row svelte-1xrxt96"><div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">sm</span></div> <div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">md</span></div> <div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">lg</span></div></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Component Props</h2> <table class="props-table svelte-1xrxt96"><thead><tr><th class="svelte-1xrxt96">Prop</th><th class="svelte-1xrxt96">Type</th><th class="svelte-1xrxt96">Default</th><th class="svelte-1xrxt96">Description</th></tr></thead><tbody><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">user</code></td><td class="svelte-1xrxt96">User</td><td class="svelte-1xrxt96">required</td><td class="svelte-1xrxt96">User object with name, email, and optional imageUrl</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">onSignOut</code></td><td class="svelte-1xrxt96">() => Promise&lt;void&gt;</td><td class="svelte-1xrxt96">required</td><td class="svelte-1xrxt96">Callback when sign out is triggered</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">variant</code></td><td class="svelte-1xrxt96">'dropdown' | 'inline'</td><td class="svelte-1xrxt96">'dropdown'</td><td class="svelte-1xrxt96">Display variant</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">size</code></td><td class="svelte-1xrxt96">'sm' | 'md' | 'lg'</td><td class="svelte-1xrxt96">'md'</td><td class="svelte-1xrxt96">Avatar and button size</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">menuItems</code></td><td class="svelte-1xrxt96">UserMenuItem[]</td><td class="svelte-1xrxt96">[]</td><td class="svelte-1xrxt96">Custom menu items (dropdown variant only)</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">loading</code></td><td class="svelte-1xrxt96">boolean</td><td class="svelte-1xrxt96">false</td><td class="svelte-1xrxt96">Whether sign-out is in progress</td></tr></tbody></table></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">UserMenuItem Interface</h2> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Accessibility</h2> <ul class="a11y-list svelte-1xrxt96"><li class="svelte-1xrxt96"><strong>Keyboard:</strong> Full keyboard navigation for dropdown menu</li> <li class="svelte-1xrxt96"><strong>Focus:</strong> Focus returns to trigger after menu closes</li> <li class="svelte-1xrxt96"><strong>Screen readers:</strong> Avatar has accessible label with user name</li> <li class="svelte-1xrxt96"><strong>Loading:</strong> Sign-out loading state is announced</li></ul></section>`,1);function b(i,b){a(b,!0);let x={name:`Jane Doe`,email:`jane@example.com`,imageUrl:`https://api.dicebear.com/7.x/avataaars/svg?seed=Jane`},S={name:`John Smith`,email:`john@example.com`},C=[{id:`profile`,label:`Profile`,icon:m,onClick:()=>alert(`Profile clicked`)},{id:`settings`,label:`Settings`,icon:h,onClick:()=>alert(`Settings clicked`)},{id:`billing`,label:`Billing`,icon:f,onClick:()=>alert(`Billing clicked`)},{id:`help`,label:`Help & Support`,icon:p,onClick:()=>alert(`Help clicked`)}],w=s(!1);async function T(){u(w,!0),await new Promise(e=>setTimeout(e,1500)),alert(`Signed out successfully!`),u(w,!1)}g(i,{eyebrow:`Auth Components`,title:`User Button`,description:`Authenticated user avatar with dropdown menu for profile actions and sign-out functionality.`,children:(i,a)=>{var s=y(),u=c(s),d=l(o(u),4);v(o(d),{get user(){return x},onSignOut:T,get menuItems(){return C},get loading(){return r(w)}}),e(d),_(l(d,2),{code:`<script>
  import { UserButton } from '@equaltoai/greater-components-auth';
  import { UserIcon, SettingsIcon } from '@equaltoai/greater-components-icons';

  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    imageUrl: 'https://example.com/avatar.jpg'
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon, onClick: () => goto('/profile') },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, onClick: () => goto('/settings') },
  ];

  async function handleSignOut() {
    await signOut();
  }
<\/script>

<UserButton 
  {user}
  onSignOut={handleSignOut}
  {menuItems}
/>`,language:`svelte`}),e(u);var f=l(u,2),p=l(o(f),4);v(o(p),{get user(){return x},onSignOut:T,variant:`inline`,get loading(){return r(w)}}),e(p),_(l(p,2),{code:`<UserButton 
  {user}
  onSignOut={handleSignOut}
  variant="inline"
/>`,language:`svelte`}),e(f);var m=l(f,2),h=l(o(m),4);v(o(h),{get user(){return S},onSignOut:T,get menuItems(){return C}}),e(h),e(m);var g=l(m,2),b=l(o(g),4),E=o(b);v(o(E),{get user(){return x},onSignOut:T,size:`sm`}),t(2),e(E);var D=l(E,2);v(o(D),{get user(){return x},onSignOut:T,size:`md`}),t(2),e(D);var O=l(D,2);v(o(O),{get user(){return x},onSignOut:T,size:`lg`}),t(2),e(O),e(b),_(l(b,2),{code:`<UserButton {user} onSignOut={handleSignOut} size="sm" />
<UserButton {user} onSignOut={handleSignOut} size="md" />
<UserButton {user} onSignOut={handleSignOut} size="lg" />`,language:`svelte`}),e(g);var k=l(g,4);_(l(o(k),2),{code:`interface UserMenuItem {
  id: string;           // Unique identifier
  label: string;        // Display text
  icon?: Component;     // Optional icon component
  onClick?: () => void; // Click handler
  disabled?: boolean;   // Whether item is disabled
  href?: string;        // Optional link URL
}`,language:`typescript`}),e(k),t(2),n(i,s)},$$slots:{default:!0}}),d()}export{b as component};