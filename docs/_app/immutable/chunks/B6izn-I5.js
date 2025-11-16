const t=[{name:"Button",slug:"button",type:"primitive",category:"headless",description:"Headless button primitive with keyboard navigation and ARIA support",longDescription:"A fully accessible button component that provides behavior and keyboard navigation without any styling. Built with Svelte 5 runes for optimal reactivity.",features:["Full keyboard navigation","ARIA attributes","Disabled state handling","Loading state support","Custom event handlers","Zero styling (bring your own)"],dependencies:["svelte@^5.0.0"],registryDependencies:[],npm:{package:"@equaltoai/greater-components-headless",version:"1.0.0"},github:{url:"https://github.com/equaltoai/greater-components/tree/main/packages/headless/src/primitives/button.ts",stars:0},examples:[{name:"Basic Usage",description:"Simple button with click handler",code:`<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';

  const button = createButton({
    onClick: () => console.log('clicked')
  });
<\/script>

<button use:button.actions.button>
  Click me
</button>`},{name:"Disabled State",description:"Button with disabled state",code:`<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';

  let disabled = $state(false);

  const button = createButton({
    disabled,
    onClick: () => alert('Button clicked!')
  });
<\/script>

<button use:button.actions.button>
  {button.state.disabled ? 'Disabled' : 'Enabled'}
</button>`}],api:{props:[{name:"onClick",type:"() => void",description:"Function called when button is clicked",required:!1},{name:"disabled",type:"boolean",default:"false",description:"Whether the button is disabled",required:!1}]},tags:["headless","primitive","button","accessibility","interactive"],bundleSize:{minified:"0.42 KB",gzipped:"0.25 KB"},accessibility:{wcag:"AAA",features:["Keyboard navigation","Screen reader support","Focus management"]},status:"stable",version:"1.0.0",lastUpdated:"2025-10-12"},{name:"Modal",slug:"modal",type:"primitive",category:"headless",description:"Headless modal with focus trap, ESC handling, and portal support",longDescription:"A fully-featured modal primitive that handles all the complexity of focus management, keyboard navigation, and backdrop interactions. Portal rendering ensures proper stacking context.",features:["Focus trap within modal","ESC key to close","Click outside to close","Portal rendering","Animation hooks","Nested modal support"],dependencies:["svelte@^5.0.0"],registryDependencies:[],npm:{package:"@equaltoai/greater-components-headless",version:"1.0.0"},github:{url:"https://github.com/equaltoai/greater-components/tree/main/packages/headless/src/primitives/modal.ts"},examples:[{name:"Basic Modal",description:"Simple modal with open/close",code:`<script>
  import { createModal } from '@equaltoai/greater-components-headless/modal';

  let open = $state(false);
  const modal = createModal({ open });
<\/script>

<button onclick={() => open = true}>Open Modal</button>

{#if modal.state.open}
  <div use:modal.actions.overlay>
    <div use:modal.actions.content>
      <h2>Modal Title</h2>
      <p>Modal content here</p>
      <button onclick={() => open = false}>Close</button>
    </div>
  </div>
{/if}`}],api:{props:[{name:"open",type:"boolean",default:"false",description:"Whether modal is open",required:!1},{name:"closeOnEscape",type:"boolean",default:"true",description:"Close modal when ESC is pressed",required:!1},{name:"closeOnClickOutside",type:"boolean",default:"true",description:"Close modal when clicking outside",required:!1}]},tags:["headless","primitive","modal","dialog","overlay","accessibility"],bundleSize:{minified:"1.45 KB",gzipped:"1.19 KB"},accessibility:{wcag:"AAA",features:["Focus trap","ARIA dialog role","ESC key support","Return focus on close"]},status:"stable",version:"1.0.0",lastUpdated:"2025-10-12"},{name:"Timeline",slug:"timeline",type:"compound",category:"activitypub",description:"ActivityPub timeline with virtual scrolling and real-time updates",longDescription:"A complete timeline implementation for ActivityPub feeds. Features virtual scrolling for performance, real-time updates via WebSocket, and a flexible compound component API for customization.",features:["Virtual scrolling for 1000+ items","Real-time updates via WebSocket","Compound component pattern","Loading & error states","Infinite scroll","Customizable item rendering"],dependencies:["svelte@^5.0.0"],registryDependencies:[],npm:{package:"@equaltoai/greater-components-fediverse",version:"1.0.0"},github:{url:"https://github.com/equaltoai/greater-components/tree/main/packages/fediverse/src/components/Timeline"},examples:[{name:"Basic Timeline",description:"Simple timeline with items",code:`<script>
  import * as Timeline from '@equaltoai/greater-components-fediverse/Timeline';
  
  const items = [
    { id: '1', content: 'First post' },
    { id: '2', content: 'Second post' }
  ];

  const handlers = {
    onItemClick: (item) => console.log('Clicked:', item),
    onLoadMore: () => console.log('Load more')
  };
<\/script>

<Timeline.Root {items} {handlers}>
  {#each items as item}
    <Timeline.Item {item} />
  {/each}
  <Timeline.LoadMore />
</Timeline.Root>`}],tags:["activitypub","timeline","feed","compound","virtual-scroll","real-time"],bundleSize:{minified:"4.2 KB",gzipped:"2.1 KB"},accessibility:{wcag:"AA",features:["Keyboard navigation","Screen reader announcements","Focus management"]},status:"stable",version:"1.0.0",lastUpdated:"2025-10-12"},{name:"Auth",slug:"auth",type:"compound",category:"lesser",description:"Complete authentication system with WebAuthn and 2FA",longDescription:"A full-featured authentication system designed for Lesser. Includes login, registration, WebAuthn, OAuth consent, two-factor authentication, and password reset flows.",features:["Email/password login","User registration","WebAuthn support","OAuth2 consent flow","Two-factor authentication (TOTP)","Backup codes","Password reset","Compound component pattern"],dependencies:["svelte@^5.0.0"],registryDependencies:["button"],npm:{package:"@equaltoai/greater-components-fediverse",version:"1.0.0"},github:{url:"https://github.com/equaltoai/greater-components/tree/main/packages/fediverse/src/components/Auth"},examples:[{name:"Login Form",description:"Complete login experience",code:`<script>
  import * as Auth from '@equaltoai/greater-components-fediverse/Auth';
  
  const handlers = {
    onLogin: async ({ email, password, remember }) => {
      const result = await api.login(email, password);
      return result;
    }
  };
<\/script>

<Auth.Root {handlers}>
  <Auth.LoginForm />
</Auth.Root>`}],tags:["auth","authentication","lesser","compound","security","webauthn","2fa"],bundleSize:{minified:"12.5 KB",gzipped:"4.8 KB"},accessibility:{wcag:"AA",features:["Form labels","Error announcements","Keyboard navigation"]},status:"stable",version:"1.0.0",lastUpdated:"2025-10-12"},{name:"GraphQL Adapter",slug:"graphql-adapter",type:"adapter",category:"adapters",description:"GraphQL adapter for Lesser with caching and subscriptions",longDescription:"Production-ready GraphQL client for Lesser's API. Features built-in caching with LRU eviction, request deduplication, WebSocket subscriptions, and pre-built queries/mutations.",features:["LRU cache with TTL","Request deduplication","WebSocket subscriptions","Auto-reconnect","Pre-built queries & mutations","TypeScript types","Statistics & monitoring"],dependencies:[],registryDependencies:[],npm:{package:"@equaltoai/greater-components-fediverse",version:"1.0.0"},github:{url:"https://github.com/equaltoai/greater-components/tree/main/packages/fediverse/src/adapters/graphql"},examples:[{name:"Basic Usage",description:"Initialize client and fetch timeline",code:`import { createGraphQLClient } from '@equaltoai/greater-components-fediverse/adapters/graphql';

const client = createGraphQLClient({
  endpoint: 'https://api.lesser.example.com/graphql',
  token: 'your-auth-token',
  enableCache: true,
  cacheTTL: 300000 // 5 minutes
});

// Fetch timeline (automatically cached)
const timeline = await client.query(GET_TIMELINE, {
  limit: 20,
  type: 'home'
});

// Subscribe to real-time updates
const unsubscribe = client.subscribe(
  TIMELINE_UPDATES,
  (event) => console.log('New activity:', event),
  { type: 'home' }
);`}],tags:["adapter","graphql","lesser","cache","websocket","real-time"],bundleSize:{minified:"7.01 KB",gzipped:"2.23 KB"},accessibility:{wcag:"AAA",features:["N/A - Data layer only"]},status:"stable",version:"1.0.0",lastUpdated:"2025-10-12"}];function a(e){return t.find(i=>i.slug===e)}function o(){return{total:t.length,byType:{primitive:t.filter(e=>e.type==="primitive").length,compound:t.filter(e=>e.type==="compound").length,pattern:t.filter(e=>e.type==="pattern").length,adapter:t.filter(e=>e.type==="adapter").length},byCategory:{headless:t.filter(e=>e.category==="headless").length,activitypub:t.filter(e=>e.category==="activitypub").length,lesser:t.filter(e=>e.category==="lesser").length,adapters:t.filter(e=>e.category==="adapters").length},byStatus:{stable:t.filter(e=>e.status==="stable").length,beta:t.filter(e=>e.status==="beta").length,alpha:t.filter(e=>e.status==="alpha").length,experimental:t.filter(e=>e.status==="experimental").length}}}export{a,t as c,o as g};
