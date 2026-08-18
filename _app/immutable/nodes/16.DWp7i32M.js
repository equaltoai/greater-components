import{$ as e,B as t,Dt as n,Et as r,F as i,I as a,K as o,L as s,M as c,P as l,R as u,St as ee,at as d,ct as f,ft as p,k as m,ot as h,st as g,ut as _,xt as v}from"../chunks/xyBo9fw_.js";import"../chunks/xihTtKlq.js";import{en as y}from"../chunks/DnPrlpXk.js";import{t as te}from"../chunks/Bv4csXnx.js";import{a as ne,c as re,i as b,n as x,o as ie,r as ae,t as S}from"../chunks/BtN1gzZq.js";import{t as C}from"../chunks/C1qIpVBb.js";var w=u(`<!> <!>`,1),oe=u(`<!> <!> <!> <!>`,1),se=u(`<li class="svelte-23dtxz"> </li>`),ce=u(`<section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">01 · Full Chat Interface</p> <h2 class="svelte-23dtxz">Complete chat experience with all components</h2> <p>The chat interface combines <code>Chat.Container</code>, <code>Chat.Header</code>, <code>Chat.Messages</code>, <code>Chat.Suggestions</code>, and <code>Chat.Input</code> to create a full conversational UI. Try sending a message to see the simulated streaming response.</p></header> <div class="chat-demo-container svelte-23dtxz"><!></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">02 · Quick Suggestions</p> <h2 class="svelte-23dtxz">Prompt suggestions for empty state</h2> <p><code>Chat.Suggestions</code> displays clickable prompts to help users get started. Supports
				both <code>pills</code> (horizontal) and <code>cards</code> (grid) variants.</p></header> <div class="suggestions-demo svelte-23dtxz"><div class="suggestions-variant svelte-23dtxz"><h3 class="svelte-23dtxz">Pills Variant (default)</h3> <!></div> <div class="suggestions-variant svelte-23dtxz"><h3 class="svelte-23dtxz">Cards Variant</h3> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">03 · Tool Call Display</p> <h2 class="svelte-23dtxz">AI tool invocations with status indicators</h2> <p><code>Chat.ToolCallDisplay</code> displays tool/function calls during AI responses with collapsible
				results, status indicators, and syntax-highlighted arguments.</p></header> <div class="tool-calls-demo svelte-23dtxz"><div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Pending</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Running</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Complete</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Error</h3> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">04 · Settings Configuration</p> <h2 class="svelte-23dtxz">Chat settings modal with model selection</h2> <p><code>Chat.Settings</code> provides a configuration modal for model selection, temperature, max
				tokens, system prompt, and knowledge base toggles.</p></header> <div class="settings-demo svelte-23dtxz"><div class="settings-preview svelte-23dtxz"><h3 class="svelte-23dtxz">Current Settings</h3> <dl class="settings-list svelte-23dtxz"><dt class="svelte-23dtxz">Model</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Temperature</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Max Tokens</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Streaming</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Knowledge Bases</dt> <dd class="svelte-23dtxz"> </dd></dl> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">05 · Accessibility</p> <h2 class="svelte-23dtxz">ARIA roles + keyboard navigation</h2></header> <ul class="guidance-list svelte-23dtxz"></ul></section>`,1),T=u(`<!> <!>`,1);function E(u,E){ee(E,!0);let D=[{id:`tc_1`,tool:`query_knowledge`,args:{query:`PAI documentation`,knowledgeBase:`paytheory`},result:{found:3,snippets:[`PAI is an AI-powered assistant...`,`Scopes define context...`]},status:`complete`},{id:`tc_2`,tool:`search_files`,args:{pattern:`*.svelte`,path:`src/routes`},status:`running`}],O=[{id:`msg_1`,role:`user`,content:`What is PAI?`,timestamp:new Date(Date.now()-3e5),status:`complete`},{id:`msg_2`,role:`assistant`,content:`**PAI** (Penny AI) is an AI-powered development assistant designed to help you build applications faster.

Key features include:
- **Knowledge Base Integration**: Query documentation and code examples
- **Scope Management**: Define context for focused assistance
- **Tool Execution**: Run commands and search files directly
- **Streaming Responses**: Real-time response generation

Would you like me to show you how to create a scope?`,timestamp:new Date(Date.now()-24e4),status:`complete`,toolCalls:[D[0]]},{id:`msg_3`,role:`user`,content:`Yes, show me how to create a scope with file search.`,timestamp:new Date(Date.now()-18e4),status:`complete`},{id:`msg_4`,role:`assistant`,content:`Here's how to create a scope with file search capabilities:

\`\`\`typescript
const scope = createScope({
  name: 'my-project',
  include: ['src/**/*.ts', 'src/**/*.svelte'],
  exclude: ['node_modules', 'dist'],
  knowledgeBases: ['paytheory', 'svelte-docs'],
});
\`\`\`

I'm currently searching for relevant files in your project...`,timestamp:new Date(Date.now()-12e4),status:`complete`,toolCalls:[D[1]]}],k=p(f([...O])),A=p(!1),j=p(``),M=p(`connected`),N=p(!1),P=p(!1),F=p(f({model:`gpt-4`,temperature:.7,maxTokens:4096,streaming:!0,systemPrompt:`You are PAI, a helpful AI development assistant.`,knowledgeBases:[`paytheory`,`svelte-docs`]})),le=[{id:`gpt-4`,name:`GPT-4`},{id:`gpt-4-turbo`,name:`GPT-4 Turbo`},{id:`gpt-3.5-turbo`,name:`GPT-3.5 Turbo`},{id:`claude-3-opus`,name:`Claude 3 Opus`},{id:`claude-3-sonnet`,name:`Claude 3 Sonnet`}],I=[{id:`paytheory`,name:`Pay Theory`,description:`Payment processing documentation`},{id:`svelte-docs`,name:`Svelte Docs`,description:`Svelte framework documentation`},{id:`typescript`,name:`TypeScript`,description:`TypeScript language reference`}],ue=[`What is PAI?`,`How do I create a scope?`,`Show me an example workflow`,`What knowledgebases are available?`],L=[`Great question! Here's a quick overview of the available knowledge bases:

1. **Pay Theory** - Payment processing APIs and integration guides
2. **Svelte Docs** - Component patterns and reactivity
3. **TypeScript** - Type system and language features

Each knowledge base can be enabled in settings to provide contextual assistance.`,`To create a new workflow, you can use the following pattern:

	\`\`\`typescript
	import { createWorkflow } from '@equaltoai/greater-components-social';

	const workflow = createWorkflow({
	  name: 'code-review',
	  steps: [
    { action: 'analyze', target: 'src/**/*.ts' },
    { action: 'suggest', type: 'improvements' },
    { action: 'generate', output: 'report.md' },
  ],
});

await workflow.execute();
\`\`\`

This will analyze your TypeScript files and generate improvement suggestions.`];async function R(e){_(A,!0),_(j,``),_(M,`connected`);let t={id:`msg_${Date.now()}`,role:`assistant`,content:``,timestamp:new Date,status:`streaming`};_(k,[...o(k),t],!0);let n=e.split(``);for(let e=0;e<n.length;e++)await new Promise(e=>setTimeout(e,15+Math.random()*25)),_(j,o(j)+n[e]),_(k,o(k).map(e=>e.id===t.id?{...e,content:o(j)}:e),!0);_(k,o(k).map(e=>e.id===t.id?{...e,status:`complete`}:e),!0),_(A,!1),_(j,``)}let z={onSubmit:async e=>{let t={id:`msg_${Date.now()}`,role:`user`,content:e,timestamp:new Date,status:`complete`};_(k,[...o(k),t],!0);let n=Math.floor(Math.random()*L.length);await R(L[n])},onClear:()=>{_(k,[],!0),_(j,``),_(A,!1)},onSettingsChange:e=>{_(F,e,!0)},onStopStreaming:()=>{_(A,!1)}};function de(e){z.onSubmit?.(e)}function fe(){z.onClear?.()}function B(){_(P,!o(P)),o(P)?_(k,[],!0):_(k,[...O],!0)}function V(){let e={id:`msg_${Date.now()}`,role:`assistant`,content:`Let me search for that information...`,timestamp:new Date,status:`complete`,toolCalls:[{id:`tc_${Date.now()}_1`,tool:`query_knowledge`,args:{query:`component patterns`,limit:5},status:`pending`},{id:`tc_${Date.now()}_2`,tool:`read_file`,args:{path:`src/lib/components/Button.svelte`},status:`running`},{id:`tc_${Date.now()}_3`,tool:`search_files`,args:{pattern:`*.test.ts`},result:{files:[`Button.test.ts`,`Modal.test.ts`],count:2},status:`complete`}]};_(k,[...o(k),e],!0)}let pe=['The chat container uses `role="region"` with `aria-label="Chat conversation"` for screen reader navigation.','Messages are announced via `aria-live="polite"` to notify users of new content.',`Keyboard shortcuts: Enter to send, Shift+Enter for newline, Escape to cancel streaming.`,"Connection status is conveyed via both visual indicators and `aria-label` attributes.",`Tool call status changes are announced to assistive technologies.`];var H=T(),U=h(H);te(U,{eyebrow:`AI Interface`,title:`Chat Components`,description:`AI chat interface components for building conversational UIs with streaming responses, tool calls, and configurable settings.`,actions:n=>{var s=w(),c=h(s);y(c,{variant:`outline`,size:`sm`,onclick:B,children:(n,s)=>{r();var c=t();e(()=>i(c,o(P)?`Show Messages`:`Show Empty State`)),a(n,c)},$$slots:{default:!0}});var l=g(c,2);y(l,{variant:`outline`,size:`sm`,onclick:V,children:(e,n)=>{r();var i=t(`Add Tool Call Demo`);a(e,i)},$$slots:{default:!0}}),a(n,s)},children:(u,ee)=>{var f=ce(),p=h(f),v=g(d(p),2),te=d(v);m(te,()=>re,(e,t)=>{t(e,{get handlers(){return z},get messages(){return o(k)},get streaming(){return o(A)},get streamContent(){return o(j)},get connectionStatus(){return o(M)},class:`chat-demo`,children:(e,t)=>{var n=oe(),r=h(n);m(r,()=>ae,(e,t)=>{t(e,{title:`PAI Demo`,subtitle:`Powered by Greater Components`,get connectionStatus(){return o(M)},showClearButton:!0,showSettingsButton:!0,onClear:fe,onSettings:()=>_(N,!0)})});var i=g(r,2);m(i,()=>ie,(e,t)=>{t(e,{showAvatars:!0})});var c=g(i,2),u=e=>{var t=s(),n=h(t);m(n,()=>x,(e,t)=>{t(e,{get suggestions(){return ue},onSelect:de,variant:`cards`})}),a(e,t)};l(c,e=>{o(k).length===0&&e(u)});var ee=g(c,2);m(ee,()=>ne,(e,t)=>{t(e,{placeholder:`Ask PAI anything...`,get disabled(){return o(A)},showFileUpload:!1,onSend:e=>z.onSubmit?.(e)})}),a(e,n)},$$slots:{default:!0}})}),n(v);var S=g(v,2);C(S,{title:`Basic Chat Setup`,description:`Import and configure the chat components`,code:`
<script>
  import * as Chat from '@equaltoai/greater-components-chat';

  const handlers = {
    onSubmit: async (content) => {
      // Send message to your AI backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      });
      return response.json();
    },
  };
<\/script>

<Chat.Container {handlers}>
  <Chat.Header title="AI Assistant" connectionStatus="connected" />
  <Chat.Messages />
  <Chat.Input onSend={(content) => handlers.onSubmit(content)} />
</Chat.Container>`}),n(p);var w=g(p,2),T=g(d(w),2),E=d(T),D=g(d(E),2);m(D,()=>x,(e,t)=>{t(e,{get suggestions(){return ue},onSelect:e=>console.log(`Selected:`,e),variant:`pills`})}),n(E);var O=g(E,2),P=g(d(O),2);m(P,()=>x,(e,t)=>{t(e,{suggestions:[{text:`What is PAI?`,description:`Learn about the AI assistant`},{text:`Create a scope`,description:`Define context for your project`},{text:`Example workflow`,description:`See automation in action`},{text:`Knowledge bases`,description:`Explore available documentation`}],onSelect:e=>console.log(`Selected:`,e),variant:`cards`})}),n(O),n(T);var le=g(T,2);C(le,{title:`Suggestions with empty state`,description:`Show suggestions when conversation is empty`,code:`
<Chat.Container {handlers}>
  <Chat.Header title="PAI Demo" />
  <Chat.Messages />
  {#if messages.length === 0}
    <Chat.Suggestions
      suggestions={[
        "What is PAI?",
        "How do I create a scope?",
        "Show me an example workflow"
      ]}
      onSelect={(suggestion) => handlers.onSubmit(suggestion)}
    />
  {/if}
  <Chat.Input onSend={(content) => handlers.onSubmit(content)} />
</Chat.Container>`}),n(w);var I=g(w,2),L=g(d(I),2),R=d(L),B=g(d(R),2);m(B,()=>b,(e,t)=>{t(e,{toolCall:{id:`demo_pending`,tool:`query_knowledge`,args:{query:`component patterns`,knowledgeBase:`svelte-docs`},status:`pending`}})}),n(R);var V=g(R,2),H=g(d(V),2);m(H,()=>b,(e,t)=>{t(e,{toolCall:{id:`demo_running`,tool:`search_files`,args:{pattern:`**/*.svelte`,path:`src/lib`},status:`running`}})}),n(V);var U=g(V,2),W=g(d(U),2);m(W,()=>b,(e,t)=>{t(e,{toolCall:{id:`demo_complete`,tool:`read_file`,args:{path:`src/lib/Button.svelte`,limit:50},result:{content:`// Svelte component content
export let variant = "solid";`,lines:50},status:`complete`},showResult:!0,collapsible:!0})}),n(U);var G=g(U,2),me=g(d(G),2);m(me,()=>b,(e,t)=>{t(e,{toolCall:{id:`demo_error`,tool:`execute_command`,args:{command:`npm run build`},status:`error`,error:`Command failed with exit code 1`}})}),n(G),n(L);var he=g(L,2);C(he,{title:`Tool Call Usage`,description:`Display tool calls within messages or standalone`,code:`
<!-- Tool calls are displayed within assistant messages -->
<Chat.Message
  message={{
    id: '1',
    role: 'assistant',
    content: 'Searching for information...',
    timestamp: new Date(),
    status: 'complete',
    toolCalls: [
      {
        id: 'tc_1',
        tool: 'query_knowledge',
        args: { query: 'search term' },
        status: 'running',
      },
      {
        id: 'tc_2',
        tool: 'read_file',
        args: { path: 'src/index.ts' },
        result: { content: '...' },
        status: 'complete',
      },
    ],
  }}
/>

<!-- Or use Chat.ToolCallDisplay directly -->
<Chat.ToolCallDisplay
  toolCall={{
    id: 'tc_1',
    tool: 'search_files',
    args: { pattern: '*.svelte' },
    result: { files: ['Button.svelte'] },
    status: 'complete',
  }}
  showResult={true}
  collapsible={true}
/>`}),n(I);var K=g(I,2),q=g(d(K),2),J=d(q),Y=g(d(J),2),X=g(d(Y),2),ge=d(X,!0);n(X);var Z=g(X,4),_e=d(Z,!0);n(Z);var Q=g(Z,4),ve=d(Q,!0);n(Q);var $=g(Q,4),ye=d($,!0);n($);var be=g($,4),xe=d(be,!0);n(be),n(Y);var Se=g(Y,2);y(Se,{onclick:()=>_(N,!0),children:(e,n)=>{r();var i=t(`Open Settings`);a(e,i)},$$slots:{default:!0}}),n(J),n(q);var Ce=g(q,2);C(Ce,{title:`Settings Integration`,description:`Add settings button to header and handle changes`,code:`
<script>
  import * as Chat from '@equaltoai/greater-components-chat';
  
  let showSettings = $state(false);
  let settings = $state({
    model: 'gpt-4',
    temperature: 0.7,
    streaming: true,
  });
<\/script>

<Chat.Container {handlers}>
  <Chat.Header
    title="PAI Demo"
    showSettingsButton={true}
    onSettings={() => showSettings = true}
  />
  <Chat.Messages />
  <Chat.Input onSend={(content) => handlers.onSubmit(content)} />
</Chat.Container>

<Chat.Settings
  bind:open={showSettings}
  {settings}
  availableModels={[
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'claude-3', name: 'Claude 3' },
  ]}
  onSettingsChange={(s) => settings = s}
/>`}),n(K);var we=g(K,2),Te=g(d(we),2);c(Te,20,()=>pe,e=>e,(t,r)=>{var o=se(),s=d(o,!0);n(o),e(()=>i(s,r)),a(t,o)}),n(Te),n(we),e(e=>{i(ge,o(F).model),i(_e,o(F).temperature),i(ve,o(F).maxTokens),i(ye,o(F).streaming?`Enabled`:`Disabled`),i(xe,e)},[()=>o(F).knowledgeBases?.join(`, `)||`None`]),a(u,f)},$$slots:{actions:!0,default:!0}});var W=g(U,2);m(W,()=>S,(e,t)=>{t(e,{get settings(){return o(F)},get availableModels(){return le},get availableKnowledgeBases(){return I},onSettingsChange:e=>_(F,e,!0),onSave:e=>{_(F,e,!0),_(N,!1)},onClose:()=>_(N,!1),get open(){return o(N)},set open(e){_(N,e,!0)}})}),a(u,H),v()}export{E as component};