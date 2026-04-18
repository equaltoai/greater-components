import{B as e,I as t,R as n,Tt as r,at as i,it as a,k as o,rt as s,wt as c}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{A as l,An as u,F as d,Gt as f,Lt as p,M as m,N as h,P as g,Rn as _,Vt as v,an as y,j as b,tn as x,wn as S}from"../chunks/CqG1B6Ni.js";import{t as C}from"../chunks/BrMfcLY_.js";import{t as w}from"../chunks/D4m1vxU5.js";var T=n(`<!> <!> <!> <!>`,1),E=n(`<!> <!>`,1),ee=n(`<span>Actions</span> <!>`,1),te=n(`<!> <span>Profile</span>`,1),ne=n(`<!> <span>Settings</span>`,1),re=n(`<!> <span>Sign Out</span>`,1),ie=n(`<!> <!> <!> <!> <!>`,1),ae=n(`<!> <!>`,1),oe=n(`<!> <!>`,1),se=n(`<!> <!>`,1),D=n(`<!> <!>`,1),O=n(`<!> <!>`,1),k=n(`<!> <!>`,1),A=n(`<!> <!>`,1),j=n(`<!> <!>`,1),M=n(`<!> <!>`,1),N=n(`<button class="icon-button svelte-1491jlz" aria-label="More options"><!></button>`),P=n(`<!> <span>Edit</span>`,1),F=n(`<!> <span>Delete</span>`,1),I=n(`<!> <!> <!> <!>`,1),L=n(`<!> <!>`,1),R=n(`<section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Basic Menu</h2> <p class="svelte-1491jlz">Simple dropdown menu with items and separator.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">With Icons and Headers</h2> <p class="svelte-1491jlz">Menu items can include icons and be organized with headers.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Placement Options</h2> <p class="svelte-1491jlz">Control where the menu appears relative to the trigger.</p> <div class="placement-grid svelte-1491jlz"><div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Icon Button Trigger</h2> <p class="svelte-1491jlz">Common pattern for action menus on cards or list items.</p> <div class="demo-area svelte-1491jlz"><div class="card-example svelte-1491jlz"><span>Post Title</span> <!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Keyboard Navigation</h2> <ul class="a11y-list svelte-1491jlz"><li class="svelte-1491jlz"><strong>Enter/Space:</strong> Open menu when trigger is focused, select item when menu is open</li> <li class="svelte-1491jlz"><strong>Arrow Down:</strong> Move focus to next item (loops if enabled)</li> <li class="svelte-1491jlz"><strong>Arrow Up:</strong> Move focus to previous item</li> <li class="svelte-1491jlz"><strong>Escape:</strong> Close menu and return focus to trigger</li> <li class="svelte-1491jlz"><strong>Tab:</strong> Close menu and move to next focusable element</li> <li class="svelte-1491jlz"><strong>Home/End:</strong> Jump to first/last item</li></ul></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Compound Component API</h2> <table class="api-table svelte-1491jlz"><thead><tr><th class="svelte-1491jlz">Component</th><th class="svelte-1491jlz">Description</th></tr></thead><tbody><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Root</code></td><td class="svelte-1491jlz">Container managing state, placement, and keyboard navigation</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Trigger</code></td><td class="svelte-1491jlz">Element that toggles the menu open/closed</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Content</code></td><td class="svelte-1491jlz">Positioned container for menu items</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Item</code></td><td class="svelte-1491jlz">Clickable menu option with optional icon and danger variant</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Header</code></td><td class="svelte-1491jlz">Non-interactive section label</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Separator</code></td><td class="svelte-1491jlz">Visual divider between item groups</td></tr></tbody></table></section>`,1);function z(n){function z(e){alert(`Action: ${e}`)}C(n,{eyebrow:`Primitives`,title:`Dropdown Menu`,description:`Compound component pattern for building accessible dropdown menus with keyboard navigation, icons, and flexible placement.`,children:(n,C)=>{var B=R(),V=a(B),H=i(s(V),4);o(s(H),()=>d,(n,r)=>{r(n,{children:(n,r)=>{var s=E(),u=a(s);o(u,()=>g,(n,r)=>{r(n,{children:(n,r)=>{_(n,{children:(n,r)=>{c(),t(n,e(`Open Menu`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(i(u,2),()=>h,(n,r)=>{r(n,{children:(n,r)=>{var s=T(),u=a(s);o(u,()=>b,(n,r)=>{r(n,{onclick:()=>z(`edit`),children:(n,r)=>{c(),t(n,e(`Edit`))},$$slots:{default:!0}})});var d=i(u,2);o(d,()=>b,(n,r)=>{r(n,{onclick:()=>z(`duplicate`),children:(n,r)=>{c(),t(n,e(`Duplicate`))},$$slots:{default:!0}})});var f=i(d,2);o(f,()=>l,(e,t)=>{t(e,{})}),o(i(f,2),()=>b,(n,r)=>{r(n,{onclick:()=>z(`delete`),variant:`danger`,children:(n,r)=>{c(),t(n,e(`Delete`))},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),r(H),w(i(H,2),{code:`<script>
  import * as Menu from '@equaltoai/greater-components-primitives/components/Menu/index';
  import { Button } from '@equaltoai/greater-components-primitives';
<\/script>

<Menu.Root>
  <Menu.Trigger>
    <Button>Open Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onclick={() => handleAction('edit')}>Edit</Menu.Item>
    <Menu.Item onclick={() => handleAction('duplicate')}>Duplicate</Menu.Item>
    <Menu.Separator />
    <Menu.Item onclick={() => handleAction('delete')} variant="danger">Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>`,language:`svelte`}),r(V);var U=i(V,2),W=i(s(U),4);o(s(W),()=>d,(n,r)=>{r(n,{children:(n,r)=>{var s=ae(),d=a(s);o(d,()=>g,(e,n)=>{n(e,{children:(e,n)=>{_(e,{children:(e,n)=>{var r=ee();u(i(a(r),2),{size:16}),t(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(i(d,2),()=>h,(n,r)=>{r(n,{children:(n,r)=>{var s=ie(),u=a(s);o(u,()=>m,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Account`))},$$slots:{default:!0}})});var d=i(u,2);o(d,()=>b,(e,n)=>{n(e,{onclick:()=>z(`profile`),children:(e,n)=>{var r=te();p(a(r),{size:16}),c(2),t(e,r)},$$slots:{default:!0}})});var h=i(d,2);o(h,()=>b,(e,n)=>{n(e,{onclick:()=>z(`settings`),children:(e,n)=>{var r=ne();f(a(r),{size:16}),c(2),t(e,r)},$$slots:{default:!0}})});var g=i(h,2);o(g,()=>l,(e,t)=>{t(e,{})}),o(i(g,2),()=>b,(e,n)=>{n(e,{onclick:()=>z(`logout`),variant:`danger`,children:(e,n)=>{var r=re();y(a(r),{size:16}),c(2),t(e,r)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),r(W),w(i(W,2),{code:`<Menu.Root>
  <Menu.Trigger>
    <Button>
      Actions
      <ChevronDownIcon size={16} />
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Header>Account</Menu.Header>
    <Menu.Item onclick={handleProfile}>
      <UserIcon size={16} />
      Profile
    </Menu.Item>
    <Menu.Item onclick={handleSettings}>
      <SettingsIcon size={16} />
      Settings
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item onclick={handleLogout} variant="danger">
      <LogOutIcon size={16} />
      Sign Out
    </Menu.Item>
  </Menu.Content>
</Menu.Root>`,language:`svelte`}),r(U);var G=i(U,2),K=i(s(G),4),q=s(K);o(s(q),()=>d,(n,r)=>{r(n,{placement:`bottom-start`,children:(n,r)=>{var s=se(),l=a(s);o(l,()=>g,(n,r)=>{r(n,{children:(n,r)=>{_(n,{variant:`outline`,size:`sm`,children:(n,r)=>{c(),t(n,e(`bottom-start`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(i(l,2),()=>h,(n,r)=>{r(n,{children:(n,r)=>{var s=oe(),l=a(s);o(l,()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 1`))},$$slots:{default:!0}})}),o(i(l,2),()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 2`))},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),r(q);var J=i(q,2);o(s(J),()=>d,(n,r)=>{r(n,{placement:`bottom-end`,children:(n,r)=>{var s=O(),l=a(s);o(l,()=>g,(n,r)=>{r(n,{children:(n,r)=>{_(n,{variant:`outline`,size:`sm`,children:(n,r)=>{c(),t(n,e(`bottom-end`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(i(l,2),()=>h,(n,r)=>{r(n,{children:(n,r)=>{var s=D(),l=a(s);o(l,()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 1`))},$$slots:{default:!0}})}),o(i(l,2),()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 2`))},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),r(J);var Y=i(J,2);o(s(Y),()=>d,(n,r)=>{r(n,{placement:`top-start`,children:(n,r)=>{var s=A(),l=a(s);o(l,()=>g,(n,r)=>{r(n,{children:(n,r)=>{_(n,{variant:`outline`,size:`sm`,children:(n,r)=>{c(),t(n,e(`top-start`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(i(l,2),()=>h,(n,r)=>{r(n,{children:(n,r)=>{var s=k(),l=a(s);o(l,()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 1`))},$$slots:{default:!0}})}),o(i(l,2),()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 2`))},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),r(Y);var X=i(Y,2);o(s(X),()=>d,(n,r)=>{r(n,{placement:`top-end`,children:(n,r)=>{var s=M(),l=a(s);o(l,()=>g,(n,r)=>{r(n,{children:(n,r)=>{_(n,{variant:`outline`,size:`sm`,children:(n,r)=>{c(),t(n,e(`top-end`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(i(l,2),()=>h,(n,r)=>{r(n,{children:(n,r)=>{var s=j(),l=a(s);o(l,()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 1`))},$$slots:{default:!0}})}),o(i(l,2),()=>b,(n,r)=>{r(n,{children:(n,r)=>{c(),t(n,e(`Item 2`))},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),r(X),r(K),w(i(K,2),{code:`<Menu.Root placement="bottom-end">
  <Menu.Trigger>...</Menu.Trigger>
  <Menu.Content>...</Menu.Content>
</Menu.Root>

<!-- Available placements:
  - bottom-start (default)
  - bottom-end
  - top-start
  - top-end
  - left-start
  - left-end
  - right-start
  - right-end
-->`,language:`svelte`}),r(G);var Z=i(G,2),Q=i(s(Z),4),$=s(Q);o(i(s($),2),()=>d,(n,u)=>{u(n,{placement:`bottom-end`,children:(n,u)=>{var d=L(),f=a(d);o(f,()=>g,(e,n)=>{n(e,{children:(e,n)=>{var i=N();x(s(i),{size:20}),r(i),t(e,i)},$$slots:{default:!0}})}),o(i(f,2),()=>h,(n,r)=>{r(n,{children:(n,r)=>{var s=I(),u=a(s);o(u,()=>b,(e,n)=>{n(e,{onclick:()=>z(`edit`),children:(e,n)=>{var r=P();S(a(r),{size:16}),c(2),t(e,r)},$$slots:{default:!0}})});var d=i(u,2);o(d,()=>b,(n,r)=>{r(n,{onclick:()=>z(`share`),children:(n,r)=>{c(),t(n,e(`Share`))},$$slots:{default:!0}})});var f=i(d,2);o(f,()=>l,(e,t)=>{t(e,{})}),o(i(f,2),()=>b,(e,n)=>{n(e,{onclick:()=>z(`delete`),variant:`danger`,children:(e,n)=>{var r=F();v(a(r),{size:16}),c(2),t(e,r)},$$slots:{default:!0}})}),t(n,s)},$$slots:{default:!0}})}),t(n,d)},$$slots:{default:!0}})}),r($),r(Q),w(i(Q,2),{code:`<Menu.Root>
  <Menu.Trigger>
    <button class="icon-button" aria-label="More options">
      <MoreHorizontalIcon size={20} />
    </button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item>Edit</Menu.Item>
    <Menu.Item>Share</Menu.Item>
    <Menu.Item variant="danger">Delete</Menu.Item>
  </Menu.Content>
</Menu.Root>`,language:`svelte`}),r(Z),c(4),t(n,B)},$$slots:{default:!0}})}export{z as component};