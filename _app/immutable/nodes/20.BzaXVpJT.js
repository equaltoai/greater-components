import{a as t,t as h,b as p}from"../chunks/BTgIKdxS.js";import{f as _,s,c as j,R as $,r as b}from"../chunks/D-WlePPY.js";import{c as e}from"../chunks/D4O329PC.js";import{D as ge}from"../chunks/DhBnkOx0.js";import{C as y}from"../chunks/DeXdVqsM.js";import{B}from"../chunks/B3zyJtUo.js";import{C as fe}from"../chunks/W22M3h50.js";import{M as he,E as ze,T as Me}from"../chunks/DZI5cu6z.js";import{L as Pe}from"../chunks/Cjl-Y1eL.js";import{S as je}from"../chunks/4NBDaI4l.js";import{U as be}from"../chunks/6IuynOD9.js";import{I as M}from"../chunks/CyXc35a2.js";import{T as A,C as D,S as Q,R,H as Ie}from"../chunks/BPSDg3Up.js";var Ce=p("<!> <!> <!> <!>",1),xe=p("<!> <!>",1),ke=p("<span>Actions</span> <!>",1),we=p("<!> <span>Profile</span>",1),Se=p("<!> <span>Settings</span>",1),Te=p("<!> <span>Sign Out</span>",1),Ae=p("<!> <!> <!> <!> <!>",1),De=p("<!> <!>",1),Re=p("<!> <!>",1),Ee=p("<!> <!>",1),Be=p("<!> <!>",1),He=p("<!> <!>",1),ye=p("<!> <!>",1),Oe=p("<!> <!>",1),Le=p("<!> <!>",1),Ue=p("<!> <!>",1),qe=p('<button class="icon-button svelte-1491jlz" aria-label="More options"><!></button>'),Ne=p("<!> <span>Edit</span>",1),Je=p("<!> <span>Delete</span>",1),Ke=p("<!> <!> <!> <!>",1),Ve=p("<!> <!>",1),We=p('<section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Basic Menu</h2> <p class="svelte-1491jlz">Simple dropdown menu with items and separator.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">With Icons and Headers</h2> <p class="svelte-1491jlz">Menu items can include icons and be organized with headers.</p> <div class="demo-area svelte-1491jlz"><!></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Placement Options</h2> <p class="svelte-1491jlz">Control where the menu appears relative to the trigger.</p> <div class="placement-grid svelte-1491jlz"><div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div> <div class="placement-item svelte-1491jlz"><!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Icon Button Trigger</h2> <p class="svelte-1491jlz">Common pattern for action menus on cards or list items.</p> <div class="demo-area svelte-1491jlz"><div class="card-example svelte-1491jlz"><span>Post Title</span> <!></div></div> <!></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Keyboard Navigation</h2> <ul class="a11y-list svelte-1491jlz"><li class="svelte-1491jlz"><strong>Enter/Space:</strong> Open menu when trigger is focused, select item when menu is open</li> <li class="svelte-1491jlz"><strong>Arrow Down:</strong> Move focus to next item (loops if enabled)</li> <li class="svelte-1491jlz"><strong>Arrow Up:</strong> Move focus to previous item</li> <li class="svelte-1491jlz"><strong>Escape:</strong> Close menu and return focus to trigger</li> <li class="svelte-1491jlz"><strong>Tab:</strong> Close menu and move to next focusable element</li> <li class="svelte-1491jlz"><strong>Home/End:</strong> Jump to first/last item</li></ul></section> <section class="demo-section svelte-1491jlz"><h2 class="svelte-1491jlz">Compound Component API</h2> <table class="api-table svelte-1491jlz"><thead><tr><th class="svelte-1491jlz">Component</th><th class="svelte-1491jlz">Description</th></tr></thead><tbody><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Root</code></td><td class="svelte-1491jlz">Container managing state, placement, and keyboard navigation</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Trigger</code></td><td class="svelte-1491jlz">Element that toggles the menu open/closed</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Content</code></td><td class="svelte-1491jlz">Positioned container for menu items</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Item</code></td><td class="svelte-1491jlz">Clickable menu option with optional icon and danger variant</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Header</code></td><td class="svelte-1491jlz">Non-interactive section label</td></tr><tr><td class="svelte-1491jlz"><code class="svelte-1491jlz">Menu.Separator</code></td><td class="svelte-1491jlz">Visual divider between item groups</td></tr></tbody></table></section>',1);function it(te){function T(O){alert(`Action: ${O}`)}const oe=`<script>
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
</Menu.Root>`,se=`<Menu.Root>
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
</Menu.Root>`,re=`<Menu.Root placement="bottom-end">
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
-->`,le=`<Menu.Root>
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
</Menu.Root>`;ge(te,{eyebrow:"Primitives",title:"Dropdown Menu",description:"Compound component pattern for building accessible dropdown menus with keyboard navigation, icons, and flexible placement.",children:(O,Fe)=>{var X=We(),L=_(X),U=s(j(L),4),ne=j(U);e(ne,()=>R,(I,C)=>{C(I,{children:(x,E)=>{var g=xe(),f=_(g);e(f,()=>A,(d,c)=>{c(d,{children:(v,w)=>{B(v,{children:(r,i)=>{$();var a=h("Open Menu");t(r,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var k=s(f,2);e(k,()=>D,(d,c)=>{c(d,{children:(v,w)=>{var r=Ce(),i=_(r);e(i,()=>M,(l,n)=>{n(l,{onclick:()=>T("edit"),children:(o,S)=>{$();var z=h("Edit");t(o,z)},$$slots:{default:!0}})});var a=s(i,2);e(a,()=>M,(l,n)=>{n(l,{onclick:()=>T("duplicate"),children:(o,S)=>{$();var z=h("Duplicate");t(o,z)},$$slots:{default:!0}})});var u=s(a,2);e(u,()=>Q,(l,n)=>{n(l,{})});var m=s(u,2);e(m,()=>M,(l,n)=>{n(l,{onclick:()=>T("delete"),variant:"danger",children:(o,S)=>{$();var z=h("Delete");t(o,z)},$$slots:{default:!0}})}),t(v,r)},$$slots:{default:!0}})}),t(x,g)},$$slots:{default:!0}})}),b(U);var ae=s(U,2);y(ae,{code:oe,language:"svelte"}),b(L);var q=s(L,2),N=s(j(q),4),ie=j(N);e(ie,()=>R,(I,C)=>{C(I,{children:(x,E)=>{var g=De(),f=_(g);e(f,()=>A,(d,c)=>{c(d,{children:(v,w)=>{B(v,{children:(r,i)=>{var a=ke(),u=s(_(a),2);fe(u,{size:16}),t(r,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var k=s(f,2);e(k,()=>D,(d,c)=>{c(d,{children:(v,w)=>{var r=Ae(),i=_(r);e(i,()=>Ie,(n,o)=>{o(n,{children:(S,z)=>{$();var P=h("Account");t(S,P)},$$slots:{default:!0}})});var a=s(i,2);e(a,()=>M,(n,o)=>{o(n,{onclick:()=>T("profile"),children:(S,z)=>{var P=we(),H=_(P);be(H,{size:16}),$(2),t(S,P)},$$slots:{default:!0}})});var u=s(a,2);e(u,()=>M,(n,o)=>{o(n,{onclick:()=>T("settings"),children:(S,z)=>{var P=Se(),H=_(P);je(H,{size:16}),$(2),t(S,P)},$$slots:{default:!0}})});var m=s(u,2);e(m,()=>Q,(n,o)=>{o(n,{})});var l=s(m,2);e(l,()=>M,(n,o)=>{o(n,{onclick:()=>T("logout"),variant:"danger",children:(S,z)=>{var P=Te(),H=_(P);Pe(H,{size:16}),$(2),t(S,P)},$$slots:{default:!0}})}),t(v,r)},$$slots:{default:!0}})}),t(x,g)},$$slots:{default:!0}})}),b(N);var de=s(N,2);y(de,{code:se,language:"svelte"}),b(q);var J=s(q,2),K=s(j(J),4),V=j(K),ce=j(V);e(ce,()=>R,(I,C)=>{C(I,{placement:"bottom-start",children:(x,E)=>{var g=Ee(),f=_(g);e(f,()=>A,(d,c)=>{c(d,{children:(v,w)=>{B(v,{variant:"outline",size:"sm",children:(r,i)=>{$();var a=h("bottom-start");t(r,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var k=s(f,2);e(k,()=>D,(d,c)=>{c(d,{children:(v,w)=>{var r=Re(),i=_(r);e(i,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 1");t(l,o)},$$slots:{default:!0}})});var a=s(i,2);e(a,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 2");t(l,o)},$$slots:{default:!0}})}),t(v,r)},$$slots:{default:!0}})}),t(x,g)},$$slots:{default:!0}})}),b(V);var W=s(V,2),ve=j(W);e(ve,()=>R,(I,C)=>{C(I,{placement:"bottom-end",children:(x,E)=>{var g=He(),f=_(g);e(f,()=>A,(d,c)=>{c(d,{children:(v,w)=>{B(v,{variant:"outline",size:"sm",children:(r,i)=>{$();var a=h("bottom-end");t(r,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var k=s(f,2);e(k,()=>D,(d,c)=>{c(d,{children:(v,w)=>{var r=Be(),i=_(r);e(i,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 1");t(l,o)},$$slots:{default:!0}})});var a=s(i,2);e(a,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 2");t(l,o)},$$slots:{default:!0}})}),t(v,r)},$$slots:{default:!0}})}),t(x,g)},$$slots:{default:!0}})}),b(W);var F=s(W,2),ue=j(F);e(ue,()=>R,(I,C)=>{C(I,{placement:"top-start",children:(x,E)=>{var g=Oe(),f=_(g);e(f,()=>A,(d,c)=>{c(d,{children:(v,w)=>{B(v,{variant:"outline",size:"sm",children:(r,i)=>{$();var a=h("top-start");t(r,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var k=s(f,2);e(k,()=>D,(d,c)=>{c(d,{children:(v,w)=>{var r=ye(),i=_(r);e(i,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 1");t(l,o)},$$slots:{default:!0}})});var a=s(i,2);e(a,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 2");t(l,o)},$$slots:{default:!0}})}),t(v,r)},$$slots:{default:!0}})}),t(x,g)},$$slots:{default:!0}})}),b(F);var Y=s(F,2),$e=j(Y);e($e,()=>R,(I,C)=>{C(I,{placement:"top-end",children:(x,E)=>{var g=Ue(),f=_(g);e(f,()=>A,(d,c)=>{c(d,{children:(v,w)=>{B(v,{variant:"outline",size:"sm",children:(r,i)=>{$();var a=h("top-end");t(r,a)},$$slots:{default:!0}})},$$slots:{default:!0}})});var k=s(f,2);e(k,()=>D,(d,c)=>{c(d,{children:(v,w)=>{var r=Le(),i=_(r);e(i,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 1");t(l,o)},$$slots:{default:!0}})});var a=s(i,2);e(a,()=>M,(u,m)=>{m(u,{children:(l,n)=>{$();var o=h("Item 2");t(l,o)},$$slots:{default:!0}})}),t(v,r)},$$slots:{default:!0}})}),t(x,g)},$$slots:{default:!0}})}),b(Y),b(K);var me=s(K,2);y(me,{code:re,language:"svelte"}),b(J);var Z=s(J,2),G=s(j(Z),4),ee=j(G),pe=s(j(ee),2);e(pe,()=>R,(I,C)=>{C(I,{placement:"bottom-end",children:(x,E)=>{var g=Ve(),f=_(g);e(f,()=>A,(d,c)=>{c(d,{children:(v,w)=>{var r=qe(),i=j(r);he(i,{size:20}),b(r),t(v,r)},$$slots:{default:!0}})});var k=s(f,2);e(k,()=>D,(d,c)=>{c(d,{children:(v,w)=>{var r=Ke(),i=_(r);e(i,()=>M,(l,n)=>{n(l,{onclick:()=>T("edit"),children:(o,S)=>{var z=Ne(),P=_(z);ze(P,{size:16}),$(2),t(o,z)},$$slots:{default:!0}})});var a=s(i,2);e(a,()=>M,(l,n)=>{n(l,{onclick:()=>T("share"),children:(o,S)=>{$();var z=h("Share");t(o,z)},$$slots:{default:!0}})});var u=s(a,2);e(u,()=>Q,(l,n)=>{n(l,{})});var m=s(u,2);e(m,()=>M,(l,n)=>{n(l,{onclick:()=>T("delete"),variant:"danger",children:(o,S)=>{var z=Je(),P=_(z);Me(P,{size:16}),$(2),t(o,z)},$$slots:{default:!0}})}),t(v,r)},$$slots:{default:!0}})}),t(x,g)},$$slots:{default:!0}})}),b(ee),b(G);var _e=s(G,2);y(_e,{code:le,language:"svelte"}),b(Z),$(4),t(O,X)},$$slots:{default:!0}})}export{it as component};
