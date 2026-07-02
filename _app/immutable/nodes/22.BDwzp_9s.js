import{B as e,Dt as t,Et as n,I as r,R as i,at as a,k as o,ot as s,st as c}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{$t as l,F as u,Gt as d,I as f,M as p,N as m,P as h,Q as g,bt as _,gt as v,j as y,nt as b,ot as x,zt as S}from"../chunks/6QSfMQ-W.js";import{t as C}from"../chunks/RYgqtqyS.js";import{t as w}from"../chunks/DjMfVXn_.js";var ee=i(`<!> <!> <!> <!>`,1),te=i(`<!> <!>`,1),ne=i(`<span>Actions</span> <!>`,1),re=i(`<!> <span>Profile</span>`,1),ie=i(`<!> <span>Settings</span>`,1),ae=i(`<!> <span>Sign Out</span>`,1),oe=i(`<!> <!> <!> <!> <!>`,1),se=i(`<!> <!>`,1),T=i(`<!> <!>`,1),E=i(`<!> <!>`,1),D=i(`<!> <!>`,1),O=i(`<!> <!>`,1),k=i(`<!> <!>`,1),A=i(`<!> <!>`,1),j=i(`<!> <!>`,1),M=i(`<!> <!>`,1),N=i(`<button class="icon-button svelte-1491jlz" aria-label="More options"><!></button>`),P=i(`<!> <span>Edit</span>`,1),F=i(`<!> <span>Delete</span>`,1),I=i(`<!> <!> <!> <!>`,1),L=i(`<!> <!>`,1),R=i(`<section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Basic Menu</h2> <p class="svelte-1491jlz">Simple dropdown menu with items and separator.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">With Icons and Headers</h2> <p class="svelte-1491jlz">Menu items can include icons and be organized with headers.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Placement Options</h2> <p class="svelte-1491jlz">Control where the menu appears relative to the trigger.</p> <div class="placement-grid svelte-1491jlz"><div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Icon Button Trigger</h2> <p class="svelte-1491jlz">Common pattern for action menus on cards or list items.</p> <div class="demo-area svelte-1491jlz"><div class="card-example svelte-1491jlz"><span>Post Title</span> <!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Keyboard Navigation</h2> <ul class="a11y-list svelte-1491jlz"><li class="svelte-1491jlz"><strong>Enter/Space:</strong> Open menu when trigger is focused, select item when menu is open</li> <li class="svelte-1491jlz"><strong>Arrow Down:</strong> Move focus to next item (loops if enabled)</li> <li class="svelte-1491jlz"><strong>Arrow Up:</strong> Move focus to previous item</li> <li class="svelte-1491jlz"><strong>Escape:</strong> Close menu and return focus to trigger</li> <li class="svelte-1491jlz"><strong>Tab:</strong> Close menu and move to next focusable element</li> <li class="svelte-1491jlz"><strong>Home/End:</strong> Jump to first/last item</li></ul></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Compound Component API</h2> <table class="api-table svelte-1491jlz"><thead><tr><th class="svelte-1491jlz">Component</th><th class="svelte-1491jlz">Description</th></tr></thead><tbody><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Root</code></td><td class="svelte-1491jlz">Container managing state, placement, and keyboard navigation</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Trigger</code></td><td class="svelte-1491jlz">Element that toggles the menu open/closed</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Content</code></td><td class="svelte-1491jlz">Positioned container for menu items</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Item</code></td><td class="svelte-1491jlz">Clickable menu option with optional icon and danger variant</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Header</code></td><td class="svelte-1491jlz">Non-interactive section label</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Separator</code></td><td class="svelte-1491jlz">Visual divider between item groups</td></tr></tbody></table></section>`,1);function z(i){function z(e){alert(`Action: ${e}`)}C(i,{eyebrow:`Primitives`,title:`Dropdown Menu`,description:`Compound component pattern for building accessible dropdown menus with keyboard navigation, icons, and flexible placement.`,children:(i,C)=>{var B=R(),V=s(B),H=c(a(V),4);o(a(H),()=>f,(t,i)=>{i(t,{children:(t,i)=>{var a=te(),d=s(a);o(d,()=>u,(t,i)=>{i(t,{children:(t,i)=>{l(t,{children:(t,i)=>{n(),r(t,e(`Open Menu`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(c(d,2),()=>h,(t,i)=>{i(t,{children:(t,i)=>{var a=ee(),l=s(a);o(l,()=>p,(t,i)=>{i(t,{onclick:()=>z(`edit`),children:(t,i)=>{n(),r(t,e(`Edit`))},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>p,(t,i)=>{i(t,{onclick:()=>z(`duplicate`),children:(t,i)=>{n(),r(t,e(`Duplicate`))},$$slots:{default:!0}})});var d=c(u,2);o(d,()=>y,(e,t)=>{t(e,{})}),o(c(d,2),()=>p,(t,i)=>{i(t,{onclick:()=>z(`delete`),variant:`danger`,children:(t,i)=>{n(),r(t,e(`Delete`))},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(H),w(c(H,2),{code:`<script>
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
</Menu.Root>`,language:`svelte`}),t(V);var U=c(V,2),W=c(a(U),4);o(a(W),()=>f,(t,i)=>{i(t,{children:(t,i)=>{var a=se(),f=s(a);o(f,()=>u,(e,t)=>{t(e,{children:(e,t)=>{l(e,{children:(e,t)=>{var n=ne();d(c(s(n),2),{size:16}),r(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(c(f,2),()=>h,(t,i)=>{i(t,{children:(t,i)=>{var a=oe(),l=s(a);o(l,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Account`))},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>p,(e,t)=>{t(e,{onclick:()=>z(`profile`),children:(e,t)=>{var i=re();g(s(i),{size:16}),n(2),r(e,i)},$$slots:{default:!0}})});var d=c(u,2);o(d,()=>p,(e,t)=>{t(e,{onclick:()=>z(`settings`),children:(e,t)=>{var i=ie();x(s(i),{size:16}),n(2),r(e,i)},$$slots:{default:!0}})});var f=c(d,2);o(f,()=>y,(e,t)=>{t(e,{})}),o(c(f,2),()=>p,(e,t)=>{t(e,{onclick:()=>z(`logout`),variant:`danger`,children:(e,t)=>{var i=ae();_(s(i),{size:16}),n(2),r(e,i)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(W),w(c(W,2),{code:`<Menu.Root>
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
</Menu.Root>`,language:`svelte`}),t(U);var G=c(U,2),K=c(a(G),4),q=a(K);o(a(q),()=>f,(t,i)=>{i(t,{placement:`bottom-start`,children:(t,i)=>{var a=E(),d=s(a);o(d,()=>u,(t,i)=>{i(t,{children:(t,i)=>{l(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n(),r(t,e(`bottom-start`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(c(d,2),()=>h,(t,i)=>{i(t,{children:(t,i)=>{var a=T(),l=s(a);o(l,()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 1`))},$$slots:{default:!0}})}),o(c(l,2),()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 2`))},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(q);var J=c(q,2);o(a(J),()=>f,(t,i)=>{i(t,{placement:`bottom-end`,children:(t,i)=>{var a=O(),d=s(a);o(d,()=>u,(t,i)=>{i(t,{children:(t,i)=>{l(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n(),r(t,e(`bottom-end`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(c(d,2),()=>h,(t,i)=>{i(t,{children:(t,i)=>{var a=D(),l=s(a);o(l,()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 1`))},$$slots:{default:!0}})}),o(c(l,2),()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 2`))},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(J);var Y=c(J,2);o(a(Y),()=>f,(t,i)=>{i(t,{placement:`top-start`,children:(t,i)=>{var a=A(),d=s(a);o(d,()=>u,(t,i)=>{i(t,{children:(t,i)=>{l(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n(),r(t,e(`top-start`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(c(d,2),()=>h,(t,i)=>{i(t,{children:(t,i)=>{var a=k(),l=s(a);o(l,()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 1`))},$$slots:{default:!0}})}),o(c(l,2),()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 2`))},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(Y);var X=c(Y,2);o(a(X),()=>f,(t,i)=>{i(t,{placement:`top-end`,children:(t,i)=>{var a=M(),d=s(a);o(d,()=>u,(t,i)=>{i(t,{children:(t,i)=>{l(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n(),r(t,e(`top-end`))},$$slots:{default:!0}})},$$slots:{default:!0}})}),o(c(d,2),()=>h,(t,i)=>{i(t,{children:(t,i)=>{var a=j(),l=s(a);o(l,()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 1`))},$$slots:{default:!0}})}),o(c(l,2),()=>p,(t,i)=>{i(t,{children:(t,i)=>{n(),r(t,e(`Item 2`))},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(X),t(K),w(c(K,2),{code:`<Menu.Root placement="bottom-end">
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
-->`,language:`svelte`}),t(G);var Z=c(G,2),Q=c(a(Z),4),$=a(Q);o(c(a($),2),()=>f,(i,l)=>{l(i,{placement:`bottom-end`,children:(i,l)=>{var d=L(),f=s(d);o(f,()=>u,(e,n)=>{n(e,{children:(e,n)=>{var i=N();v(a(i),{size:20}),t(i),r(e,i)},$$slots:{default:!0}})}),o(c(f,2),()=>h,(t,i)=>{i(t,{children:(t,i)=>{var a=I(),l=s(a);o(l,()=>p,(e,t)=>{t(e,{onclick:()=>z(`edit`),children:(e,t)=>{var i=P();S(s(i),{size:16}),n(2),r(e,i)},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>p,(t,i)=>{i(t,{onclick:()=>z(`share`),children:(t,i)=>{n(),r(t,e(`Share`))},$$slots:{default:!0}})});var d=c(u,2);o(d,()=>y,(e,t)=>{t(e,{})}),o(c(d,2),()=>p,(e,t)=>{t(e,{onclick:()=>z(`delete`),variant:`danger`,children:(e,t)=>{var i=F();b(s(i),{size:16}),n(2),r(e,i)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(i,d)},$$slots:{default:!0}})}),t($),t(Q),w(c(Q,2),{code:`<Menu.Root>
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
</Menu.Root>`,language:`svelte`}),t(Z),n(4),r(i,B)},$$slots:{default:!0}})}export{z as component};