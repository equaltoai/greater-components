import{B as e,Dt as t,Et as n,I as r,R as i,at as a,k as o,ot as s,st as c}from"../chunks/xyBo9fw_.js";import"../chunks/xihTtKlq.js";import{$ as l,Bt as u,F as d,I as f,Kt as p,M as m,N as h,P as g,_t as _,en as v,j as y,rt as b,st as x,xt as S}from"../chunks/DnPrlpXk.js";import{t as C}from"../chunks/Bv4csXnx.js";import{t as w}from"../chunks/C1qIpVBb.js";var ee=i(`<!> <!> <!> <!>`,1),te=i(`<!> <!>`,1),ne=i(`<span>Actions</span> <!>`,1),re=i(`<!> <span>Profile</span>`,1),ie=i(`<!> <span>Settings</span>`,1),ae=i(`<!> <span>Sign Out</span>`,1),T=i(`<!> <!> <!> <!> <!>`,1),E=i(`<!> <!>`,1),D=i(`<!> <!>`,1),oe=i(`<!> <!>`,1),se=i(`<!> <!>`,1),ce=i(`<!> <!>`,1),O=i(`<!> <!>`,1),k=i(`<!> <!>`,1),A=i(`<!> <!>`,1),j=i(`<!> <!>`,1),M=i(`<button class="icon-button svelte-1491jlz" aria-label="More options"><!></button>`),N=i(`<!> <span>Edit</span>`,1),P=i(`<!> <span>Delete</span>`,1),F=i(`<!> <!> <!> <!>`,1),I=i(`<!> <!>`,1),L=i(`<section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Basic Menu</h2> <p class="svelte-1491jlz">Simple dropdown menu with items and separator.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">With Icons and Headers</h2> <p class="svelte-1491jlz">Menu items can include icons and be organized with headers.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Placement Options</h2> <p class="svelte-1491jlz">Control where the menu appears relative to the trigger.</p> <div class="placement-grid svelte-1491jlz"><div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Icon Button Trigger</h2> <p class="svelte-1491jlz">Common pattern for action menus on cards or list items.</p> <div class="demo-area svelte-1491jlz"><div class="card-example svelte-1491jlz"><span>Post Title</span> <!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Keyboard Navigation</h2> <ul class="a11y-list svelte-1491jlz"><li class="svelte-1491jlz"><strong>Enter/Space:</strong> Open menu when trigger is focused, select item when menu is open</li> <li class="svelte-1491jlz"><strong>Arrow Down:</strong> Move focus to next item (loops if enabled)</li> <li class="svelte-1491jlz"><strong>Arrow Up:</strong> Move focus to previous item</li> <li class="svelte-1491jlz"><strong>Escape:</strong> Close menu and return focus to trigger</li> <li class="svelte-1491jlz"><strong>Tab:</strong> Close menu and move to next focusable element</li> <li class="svelte-1491jlz"><strong>Home/End:</strong> Jump to first/last item</li></ul></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Compound Component API</h2> <table class="api-table svelte-1491jlz"><thead><tr><th class="svelte-1491jlz">Component</th><th class="svelte-1491jlz">Description</th></tr></thead><tbody><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Root</code></td><td class="svelte-1491jlz">Container managing state, placement, and keyboard navigation</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Trigger</code></td><td class="svelte-1491jlz">Element that toggles the menu open/closed</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Content</code></td><td class="svelte-1491jlz">Positioned container for menu items</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Item</code></td><td class="svelte-1491jlz">Clickable menu option with optional icon and danger variant</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Header</code></td><td class="svelte-1491jlz">Non-interactive section label</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Separator</code></td><td class="svelte-1491jlz">Visual divider between item groups</td></tr></tbody></table></section>`,1);function R(i){function R(e){alert(`Action: ${e}`)}C(i,{eyebrow:`Primitives`,title:`Dropdown Menu`,description:`Compound component pattern for building accessible dropdown menus with keyboard navigation, icons, and flexible placement.`,children:(i,C)=>{var z=L(),B=s(z),V=c(a(B),4),H=a(V);o(H,()=>f,(t,i)=>{i(t,{children:(t,i)=>{var a=te(),l=s(a);o(l,()=>d,(t,i)=>{i(t,{children:(t,i)=>{v(t,{children:(t,i)=>{n();var a=e(`Open Menu`);r(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>g,(t,i)=>{i(t,{children:(t,i)=>{var a=ee(),l=s(a);o(l,()=>m,(t,i)=>{i(t,{onclick:()=>R(`edit`),children:(t,i)=>{n();var a=e(`Edit`);r(t,a)},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>m,(t,i)=>{i(t,{onclick:()=>R(`duplicate`),children:(t,i)=>{n();var a=e(`Duplicate`);r(t,a)},$$slots:{default:!0}})});var d=c(u,2);o(d,()=>y,(e,t)=>{t(e,{})});var f=c(d,2);o(f,()=>m,(t,i)=>{i(t,{onclick:()=>R(`delete`),variant:`danger`,children:(t,i)=>{n();var a=e(`Delete`);r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(V);var le=c(V,2);w(le,{code:`<script>
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
</Menu.Root>`,language:`svelte`}),t(B);var U=c(B,2),W=c(a(U),4),ue=a(W);o(ue,()=>f,(t,i)=>{i(t,{children:(t,i)=>{var a=E(),u=s(a);o(u,()=>d,(e,t)=>{t(e,{children:(e,t)=>{v(e,{children:(e,t)=>{var n=ne(),i=c(s(n),2);p(i,{size:16}),r(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}})});var f=c(u,2);o(f,()=>g,(t,i)=>{i(t,{children:(t,i)=>{var a=T(),u=s(a);o(u,()=>h,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Account`);r(t,a)},$$slots:{default:!0}})});var d=c(u,2);o(d,()=>m,(e,t)=>{t(e,{onclick:()=>R(`profile`),children:(e,t)=>{var i=re(),a=s(i);l(a,{size:16}),n(2),r(e,i)},$$slots:{default:!0}})});var f=c(d,2);o(f,()=>m,(e,t)=>{t(e,{onclick:()=>R(`settings`),children:(e,t)=>{var i=ie(),a=s(i);x(a,{size:16}),n(2),r(e,i)},$$slots:{default:!0}})});var p=c(f,2);o(p,()=>y,(e,t)=>{t(e,{})});var g=c(p,2);o(g,()=>m,(e,t)=>{t(e,{onclick:()=>R(`logout`),variant:`danger`,children:(e,t)=>{var i=ae(),a=s(i);S(a,{size:16}),n(2),r(e,i)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(W);var de=c(W,2);w(de,{code:`<Menu.Root>
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
</Menu.Root>`,language:`svelte`}),t(U);var G=c(U,2),K=c(a(G),4),q=a(K),fe=a(q);o(fe,()=>f,(t,i)=>{i(t,{placement:`bottom-start`,children:(t,i)=>{var a=oe(),l=s(a);o(l,()=>d,(t,i)=>{i(t,{children:(t,i)=>{v(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n();var a=e(`bottom-start`);r(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>g,(t,i)=>{i(t,{children:(t,i)=>{var a=D(),l=s(a);o(l,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 1`);r(t,a)},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 2`);r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(q);var J=c(q,2),pe=a(J);o(pe,()=>f,(t,i)=>{i(t,{placement:`bottom-end`,children:(t,i)=>{var a=ce(),l=s(a);o(l,()=>d,(t,i)=>{i(t,{children:(t,i)=>{v(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n();var a=e(`bottom-end`);r(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>g,(t,i)=>{i(t,{children:(t,i)=>{var a=se(),l=s(a);o(l,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 1`);r(t,a)},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 2`);r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(J);var Y=c(J,2),me=a(Y);o(me,()=>f,(t,i)=>{i(t,{placement:`top-start`,children:(t,i)=>{var a=k(),l=s(a);o(l,()=>d,(t,i)=>{i(t,{children:(t,i)=>{v(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n();var a=e(`top-start`);r(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>g,(t,i)=>{i(t,{children:(t,i)=>{var a=O(),l=s(a);o(l,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 1`);r(t,a)},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 2`);r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(Y);var X=c(Y,2),he=a(X);o(he,()=>f,(t,i)=>{i(t,{placement:`top-end`,children:(t,i)=>{var a=j(),l=s(a);o(l,()=>d,(t,i)=>{i(t,{children:(t,i)=>{v(t,{variant:`outline`,size:`sm`,children:(t,i)=>{n();var a=e(`top-end`);r(t,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>g,(t,i)=>{i(t,{children:(t,i)=>{var a=A(),l=s(a);o(l,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 1`);r(t,a)},$$slots:{default:!0}})});var u=c(l,2);o(u,()=>m,(t,i)=>{i(t,{children:(t,i)=>{n();var a=e(`Item 2`);r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),t(X),t(K);var ge=c(K,2);w(ge,{code:`<Menu.Root placement="bottom-end">
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
-->`,language:`svelte`}),t(G);var Z=c(G,2),Q=c(a(Z),4),$=a(Q),_e=c(a($),2);o(_e,()=>f,(i,l)=>{l(i,{placement:`bottom-end`,children:(i,l)=>{var f=I(),p=s(f);o(p,()=>d,(e,n)=>{n(e,{children:(e,n)=>{var i=M(),o=a(i);_(o,{size:20}),t(i),r(e,i)},$$slots:{default:!0}})});var h=c(p,2);o(h,()=>g,(t,i)=>{i(t,{children:(t,i)=>{var a=F(),l=s(a);o(l,()=>m,(e,t)=>{t(e,{onclick:()=>R(`edit`),children:(e,t)=>{var i=N(),a=s(i);u(a,{size:16}),n(2),r(e,i)},$$slots:{default:!0}})});var d=c(l,2);o(d,()=>m,(t,i)=>{i(t,{onclick:()=>R(`share`),children:(t,i)=>{n();var a=e(`Share`);r(t,a)},$$slots:{default:!0}})});var f=c(d,2);o(f,()=>y,(e,t)=>{t(e,{})});var p=c(f,2);o(p,()=>m,(e,t)=>{t(e,{onclick:()=>R(`delete`),variant:`danger`,children:(e,t)=>{var i=P(),a=s(i);b(a,{size:16}),n(2),r(e,i)},$$slots:{default:!0}})}),r(t,a)},$$slots:{default:!0}})}),r(i,f)},$$slots:{default:!0}})}),t($),t(Q);var ve=c(Q,2);w(ve,{code:`<Menu.Root>
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
</Menu.Root>`,language:`svelte`}),t(Z),n(4),r(i,z)},$$slots:{default:!0}})}export{R as component};