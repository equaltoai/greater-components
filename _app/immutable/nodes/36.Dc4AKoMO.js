import{a as V,b as W}from"../chunks/BTgIKdxS.js";import{p as L,f as R,g as C,c as t,s as e,a as E,h as K,d as k,r as s,R as i}from"../chunks/D-WlePPY.js";import{D as N}from"../chunks/DhBnkOx0.js";import{C as o}from"../chunks/DeXdVqsM.js";import{U as a}from"../chunks/BcdIAkWN.js";import"../chunks/CyXc35a2.js";import{C as G,H as Q}from"../chunks/D2S3-9Bc.js";import{S as X}from"../chunks/4NBDaI4l.js";import{U as Y}from"../chunks/6IuynOD9.js";var Z=W(`<section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Dropdown Variant (Default)</h2> <p class="svelte-1xrxt96">Click the avatar to open a dropdown menu with user info and actions.</p> <div class="demo-area svelte-1xrxt96"><!></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Inline Variant</h2> <p class="svelte-1xrxt96">Displays user info inline with a sign-out button, useful for sidebars or headers.</p> <div class="demo-area inline-demo svelte-1xrxt96"><!></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Avatar Fallback</h2> <p class="svelte-1xrxt96">When no image is provided, displays initials from the user's name.</p> <div class="demo-area svelte-1xrxt96"><!></div></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Size Variants</h2> <p class="svelte-1xrxt96">Three size options for different contexts.</p> <div class="demo-area sizes-row svelte-1xrxt96"><div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">sm</span></div> <div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">md</span></div> <div class="size-item svelte-1xrxt96"><!> <span class="svelte-1xrxt96">lg</span></div></div> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Component Props</h2> <table class="props-table svelte-1xrxt96"><thead><tr><th class="svelte-1xrxt96">Prop</th><th class="svelte-1xrxt96">Type</th><th class="svelte-1xrxt96">Default</th><th class="svelte-1xrxt96">Description</th></tr></thead><tbody><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">user</code></td><td class="svelte-1xrxt96">User</td><td class="svelte-1xrxt96">required</td><td class="svelte-1xrxt96">User object with name, email, and optional imageUrl</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">onSignOut</code></td><td class="svelte-1xrxt96">() => Promise&lt;void&gt;</td><td class="svelte-1xrxt96">required</td><td class="svelte-1xrxt96">Callback when sign out is triggered</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">variant</code></td><td class="svelte-1xrxt96">'dropdown' | 'inline'</td><td class="svelte-1xrxt96">'dropdown'</td><td class="svelte-1xrxt96">Display variant</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">size</code></td><td class="svelte-1xrxt96">'sm' | 'md' | 'lg'</td><td class="svelte-1xrxt96">'md'</td><td class="svelte-1xrxt96">Avatar and button size</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">menuItems</code></td><td class="svelte-1xrxt96">UserMenuItem[]</td><td class="svelte-1xrxt96">[]</td><td class="svelte-1xrxt96">Custom menu items (dropdown variant only)</td></tr><tr><td class="svelte-1xrxt96"><code class="svelte-1xrxt96">loading</code></td><td class="svelte-1xrxt96">boolean</td><td class="svelte-1xrxt96">false</td><td class="svelte-1xrxt96">Whether sign-out is in progress</td></tr></tbody></table></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">UserMenuItem Interface</h2> <!></section> <section class="demo-section svelte-1xrxt96"><h2 class="svelte-1xrxt96">Accessibility</h2> <ul class="a11y-list svelte-1xrxt96"><li class="svelte-1xrxt96"><strong>Keyboard:</strong> Full keyboard navigation for dropdown menu</li> <li class="svelte-1xrxt96"><strong>Focus:</strong> Focus returns to trigger after menu closes</li> <li class="svelte-1xrxt96"><strong>Screen readers:</strong> Avatar has accessible label with user name</li> <li class="svelte-1xrxt96"><strong>Loading:</strong> Sign-out loading state is announced</li></ul></section>`,1);function de(w,y){L(y,!0);const n={name:"Jane Doe",email:"jane@example.com",imageUrl:"https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"},I={name:"John Smith",email:"john@example.com"},b=[{id:"profile",label:"Profile",icon:Y,onClick:()=>alert("Profile clicked")},{id:"settings",label:"Settings",icon:X,onClick:()=>alert("Settings clicked")},{id:"billing",label:"Billing",icon:G,onClick:()=>alert("Billing clicked")},{id:"help",label:"Help & Support",icon:Q,onClick:()=>alert("Help clicked")}];let l=K(!1);async function r(){k(l,!0),await new Promise(c=>setTimeout(c,1500)),alert("Signed out successfully!"),k(l,!1)}const z=`<script>
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
/>`,D=`<UserButton 
  {user}
  onSignOut={handleSignOut}
  variant="inline"
/>`,B=`<UserButton {user} onSignOut={handleSignOut} size="sm" />
<UserButton {user} onSignOut={handleSignOut} size="md" />
<UserButton {user} onSignOut={handleSignOut} size="lg" />`;N(w,{eyebrow:"Auth Components",title:"User Button",description:"Authenticated user avatar with dropdown menu for profile actions and sign-out functionality.",children:(c,ee)=>{var S=Z(),d=R(S),x=e(t(d),4),P=t(x);a(P,{get user(){return n},onSignOut:r,get menuItems(){return b},get loading(){return C(l)}}),s(x);var A=e(x,2);o(A,{code:z,language:"svelte"}),s(d);var v=e(d,2),u=e(t(v),4),j=t(u);a(j,{get user(){return n},onSignOut:r,variant:"inline",get loading(){return C(l)}}),s(u);var q=e(u,2);o(q,{code:D,language:"svelte"}),s(v);var m=e(v,2),_=e(t(m),4),$=t(_);a($,{get user(){return I},onSignOut:r,get menuItems(){return b}}),s(_),s(m);var g=e(m,2),p=e(t(g),4),h=t(p),F=t(h);a(F,{get user(){return n},onSignOut:r,size:"sm"}),i(2),s(h);var f=e(h,2),H=t(f);a(H,{get user(){return n},onSignOut:r,size:"md"}),i(2),s(f);var U=e(f,2),J=t(U);a(J,{get user(){return n},onSignOut:r,size:"lg"}),i(2),s(U),s(p);var M=e(p,2);o(M,{code:B,language:"svelte"}),s(g);var O=e(g,4),T=e(t(O),2);o(T,{code:`interface UserMenuItem {
  id: string;           // Unique identifier
  label: string;        // Display text
  icon?: Component;     // Optional icon component
  onClick?: () => void; // Click handler
  disabled?: boolean;   // Whether item is disabled
  href?: string;        // Optional link URL
}`,language:"typescript"}),s(O),i(2),V(c,S)},$$slots:{default:!0}}),E()}export{de as component};
