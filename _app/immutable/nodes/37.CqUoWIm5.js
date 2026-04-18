import{I as e,K as t,R as n,Tt as r,at as i,bt as a,ct as o,it as s,rt as c,ut as l,wt as u,yt as d}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{Gt as f,Lt as p,Tn as m,pn as h}from"../chunks/CqG1B6Ni.js";import{t as g}from"../chunks/BrMfcLY_.js";import{t as _}from"../chunks/D4m1vxU5.js";import{t as v}from"../chunks/Dq0wIi5u.js";var y=n(`<section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Dropdown Variant (Default)</h2> <p class="svelte-1xrxt96">Click the avatar to open a dropdown menu with user info and actions.</p> <div class="demo-area svelte-1xrxt96"><!></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Inline Variant</h2> <p class="svelte-1xrxt96">Displays user info inline with a sign-out button, useful for sidebars or headers.</p> <div class="demo-area inline-demo svelte-1xrxt96"><!></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Avatar Fallback</h2> <p class="svelte-1xrxt96">When no image is provided, displays initials from the user's name.</p> <div class="demo-area svelte-1xrxt96"><!></div></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Size Variants</h2> <p class="svelte-1xrxt96">Three size options for different contexts.</p> <div class="demo-area sizes-row svelte-1xrxt96"><div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">sm</span></div> <div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">md</span></div> <div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">lg</span></div></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Component Props</h2> <table class="props-table svelte-1xrxt96"><thead><tr><th class="svelte-1xrxt96">Prop</th><th class="svelte-1xrxt96">Type</th><th class="svelte-1xrxt96">Default</th><th class="svelte-1xrxt96">Description</th></tr></thead><tbody><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">user</code></td><td class="svelte-1xrxt96">User</td><td class="svelte-1xrxt96">required</td><td class="svelte-1xrxt96">User object with name, email, and optional imageUrl</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">onSignOut</code></td><td class="svelte-1xrxt96">() => Promise&lt;void&gt;</td><td class="svelte-1xrxt96">required</td><td class="svelte-1xrxt96">Callback when sign out is triggered</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">variant</code></td><td class="svelte-1xrxt96">'dropdown' | 'inline'</td><td class="svelte-1xrxt96">'dropdown'</td><td class="svelte-1xrxt96">Display variant</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">size</code></td><td class="svelte-1xrxt96">'sm' | 'md' | 'lg'</td><td class="svelte-1xrxt96">'md'</td><td class="svelte-1xrxt96">Avatar and button size</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">menuItems</code></td><td class="svelte-1xrxt96">UserMenuItem[]</td><td class="svelte-1xrxt96">[]</td><td class="svelte-1xrxt96">Custom menu items (dropdown variant only)</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">loading</code></td><td class="svelte-1xrxt96">boolean</td><td class="svelte-1xrxt96">false</td><td class="svelte-1xrxt96">Whether sign-out is in progress</td></tr></tbody></table></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">UserMenuItem Interface</h2> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Accessibility</h2> <ul class="a11y-list svelte-1xrxt96"><li class="svelte-1xrxt96"><strong>Keyboard:</strong> Full keyboard navigation for dropdown menu</li> <li class="svelte-1xrxt96"><strong>Focus:</strong> Focus returns to trigger after menu closes</li> <li class="svelte-1xrxt96"><strong>Screen readers:</strong> Avatar has accessible label with user name</li> <li class="svelte-1xrxt96"><strong>Loading:</strong> Sign-out loading state is announced</li></ul></section>`,1);function b(n,b){a(b,!0);let x={name:`Jane Doe`,email:`jane@example.com`,imageUrl:`https://api.dicebear.com/7.x/avataaars/svg?seed=Jane`},S={name:`John Smith`,email:`john@example.com`},C=[{id:`profile`,label:`Profile`,icon:p,onClick:()=>alert(`Profile clicked`)},{id:`settings`,label:`Settings`,icon:f,onClick:()=>alert(`Settings clicked`)},{id:`billing`,label:`Billing`,icon:m,onClick:()=>alert(`Billing clicked`)},{id:`help`,label:`Help & Support`,icon:h,onClick:()=>alert(`Help clicked`)}],w=l(!1);async function T(){o(w,!0),await new Promise(e=>setTimeout(e,1500)),alert(`Signed out successfully!`),o(w,!1)}g(n,{eyebrow:`Auth Components`,title:`User Button`,description:`Authenticated user avatar with dropdown menu for profile actions and sign-out functionality.`,children:(n,a)=>{var o=y(),l=s(o),d=i(c(l),4);v(c(d),{get user(){return x},onSignOut:T,get menuItems(){return C},get loading(){return t(w)}}),r(d),_(i(d,2),{code:`<script>
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
/>`,language:`svelte`}),r(l);var f=i(l,2),p=i(c(f),4);v(c(p),{get user(){return x},onSignOut:T,variant:`inline`,get loading(){return t(w)}}),r(p),_(i(p,2),{code:`<UserButton 
  {user}
  onSignOut={handleSignOut}
  variant="inline"
/>`,language:`svelte`}),r(f);var m=i(f,2),h=i(c(m),4);v(c(h),{get user(){return S},onSignOut:T,get menuItems(){return C}}),r(h),r(m);var g=i(m,2),b=i(c(g),4),E=c(b);v(c(E),{get user(){return x},onSignOut:T,size:`sm`}),u(2),r(E);var D=i(E,2);v(c(D),{get user(){return x},onSignOut:T,size:`md`}),u(2),r(D);var O=i(D,2);v(c(O),{get user(){return x},onSignOut:T,size:`lg`}),u(2),r(O),r(b),_(i(b,2),{code:`<UserButton {user} onSignOut={handleSignOut} size="sm" />
<UserButton {user} onSignOut={handleSignOut} size="md" />
<UserButton {user} onSignOut={handleSignOut} size="lg" />`,language:`svelte`}),r(g);var k=i(g,4);_(i(c(k),2),{code:`interface UserMenuItem {
  id: string;           // Unique identifier
  label: string;        // Display text
  icon?: Component;     // Optional icon component
  onClick?: () => void; // Click handler
  disabled?: boolean;   // Whether item is disabled
  href?: string;        // Optional link URL
}`,language:`typescript`}),r(k),u(2),e(n,o)},$$slots:{default:!0}}),d()}export{b as component};