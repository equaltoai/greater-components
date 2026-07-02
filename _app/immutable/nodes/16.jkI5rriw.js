import{$ as e,B as t,Dt as n,Et as r,F as i,I as a,K as o,L as s,M as c,P as ee,R as l,St as te,at as u,ct as d,ft as f,k as p,ot as m,st as h,ut as g,xt as _}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{$t as v}from"../chunks/6QSfMQ-W.js";import{t as y}from"../chunks/RYgqtqyS.js";import{a as ne,c as b,i as x,n as S,o as re,r as ie,t as C}from"../chunks/hqkmNCam.js";import{t as w}from"../chunks/DjMfVXn_.js";var T=l(`<!> <!>`,1),ae=l(`<!> <!> <!> <!>`,1),E=l(`<li class="svelte-23dtxz"> </li>`),oe=l(`<section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">01 · Full Chat Interface</p> <h2 class="svelte-23dtxz">Complete chat experience with all components</h2> <p>The chat interface combines <code>Chat.Container</code>, <code>Chat.Header</code>, <code>Chat.Messages</code>, <code>Chat.Suggestions</code>, and <code>Chat.Input</code> to create a full conversational UI. Try sending a message to see the simulated streaming response.</p></header> <div class="chat-demo-container svelte-23dtxz"><!></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">02 · Quick Suggestions</p> <h2 class="svelte-23dtxz">Prompt suggestions for empty state</h2> <p><code>Chat.Suggestions</code> displays clickable prompts to help users get started. Supports
				both <code>pills</code> (horizontal) and <code>cards</code> (grid) variants.</p></header> <div class="suggestions-demo svelte-23dtxz"><div class="suggestions-variant svelte-23dtxz"><h3 class="svelte-23dtxz">Pills Variant (default)</h3> <!></div> <div class="suggestions-variant svelte-23dtxz"><h3 class="svelte-23dtxz">Cards Variant</h3> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">03 · Tool Call Display</p> <h2 class="svelte-23dtxz">AI tool invocations with status indicators</h2> <p><code>Chat.ToolCallDisplay</code> displays tool/function calls during AI responses with collapsible
				results, status indicators, and syntax-highlighted arguments.</p></header> <div class="tool-calls-demo svelte-23dtxz"><div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Pending</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Running</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Complete</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Error</h3> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">04 · Settings Configuration</p> <h2 class="svelte-23dtxz">Chat settings modal with model selection</h2> <p><code>Chat.Settings</code> provides a configuration modal for model selection, temperature, max
				tokens, system prompt, and knowledge base toggles.</p></header> <div class="settings-demo svelte-23dtxz"><div class="settings-preview svelte-23dtxz"><h3 class="svelte-23dtxz">Current Settings</h3> <dl class="settings-list svelte-23dtxz"><dt class="svelte-23dtxz">Model</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Temperature</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Max Tokens</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Streaming</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Knowledge Bases</dt> <dd class="svelte-23dtxz"> </dd></dl> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">05 · Accessibility</p> <h2 class="svelte-23dtxz">ARIA roles + keyboard navigation</h2></header> <ul class="guidance-list svelte-23dtxz"></ul></section>`,1),D=l(`<!> <!>`,1);function O(l,O){te(O,!0);let k=[{id:`tc_1`,tool:`query_knowledge`,args:{query:`PAI documentation`,knowledgeBase:`paytheory`},result:{found:3,snippets:[`PAI is an AI-powered assistant...`,`Scopes define context...`]},status:`complete`},{id:`tc_2`,tool:`search_files`,args:{pattern:`*.svelte`,path:`src/routes`},status:`running`}],A=[{id:`msg_1`,role:`user`,content:`What is PAI?`,timestamp:new Date(Date.now()-3e5),status:`complete`},{id:`msg_2`,role:`assistant`,content:`**PAI** (Penny AI) is an AI-powered development assistant designed to help you build applications faster.

Key features include:
- **Knowledge Base Integration**: Query documentation and code examples
- **Scope Management**: Define context for focused assistance
- **Tool Execution**: Run commands and search files directly
- **Streaming Responses**: Real-time response generation

Would you like me to show you how to create a scope?`,timestamp:new Date(Date.now()-24e4),status:`complete`,toolCalls:[k[0]]},{id:`msg_3`,role:`user`,content:`Yes, show me how to create a scope with file search.`,timestamp:new Date(Date.now()-18e4),status:`complete`},{id:`msg_4`,role:`assistant`,content:`Here's how to create a scope with file search capabilities:

\`\`\`typescript
const scope = createScope({
  name: 'my-project',
  include: ['src/**/*.ts', 'src/**/*.svelte'],
  exclude: ['node_modules', 'dist'],
  knowledgeBases: ['paytheory', 'svelte-docs'],
});
\`\`\`

I'm currently searching for relevant files in your project...`,timestamp:new Date(Date.now()-12e4),status:`complete`,toolCalls:[k[1]]}],j=f(d([...A])),M=f(!1),N=f(``),P=f(`connected`),F=f(!1),I=f(!1),L=f(d({model:`gpt-4`,temperature:.7,maxTokens:4096,streaming:!0,systemPrompt:`You are PAI, a helpful AI development assistant.`,knowledgeBases:[`paytheory`,`svelte-docs`]})),R=[{id:`gpt-4`,name:`GPT-4`},{id:`gpt-4-turbo`,name:`GPT-4 Turbo`},{id:`gpt-3.5-turbo`,name:`GPT-3.5 Turbo`},{id:`claude-3-opus`,name:`Claude 3 Opus`},{id:`claude-3-sonnet`,name:`Claude 3 Sonnet`}],z=[{id:`paytheory`,name:`Pay Theory`,description:`Payment processing documentation`},{id:`svelte-docs`,name:`Svelte Docs`,description:`Svelte framework documentation`},{id:`typescript`,name:`TypeScript`,description:`TypeScript language reference`}],B=[`What is PAI?`,`How do I create a scope?`,`Show me an example workflow`,`What knowledgebases are available?`],V=[`Great question! Here's a quick overview of the available knowledge bases:

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

This will analyze your TypeScript files and generate improvement suggestions.`];async function H(e){g(M,!0),g(N,``),g(P,`connected`);let t={id:`msg_${Date.now()}`,role:`assistant`,content:``,timestamp:new Date,status:`streaming`};g(j,[...o(j),t],!0);let n=e.split(``);for(let e=0;e<n.length;e++)await new Promise(e=>setTimeout(e,15+Math.random()*25)),g(N,o(N)+n[e]),g(j,o(j).map(e=>e.id===t.id?{...e,content:o(N)}:e),!0);g(j,o(j).map(e=>e.id===t.id?{...e,status:`complete`}:e),!0),g(M,!1),g(N,``)}let U={onSubmit:async e=>{let t={id:`msg_${Date.now()}`,role:`user`,content:e,timestamp:new Date,status:`complete`};g(j,[...o(j),t],!0),await H(V[Math.floor(Math.random()*V.length)])},onClear:()=>{g(j,[],!0),g(N,``),g(M,!1)},onSettingsChange:e=>{g(L,e,!0)},onStopStreaming:()=>{g(M,!1)}};function se(e){U.onSubmit?.(e)}function ce(){U.onClear?.()}function W(){g(I,!o(I)),o(I)?g(j,[],!0):g(j,[...A],!0)}function G(){let e={id:`msg_${Date.now()}`,role:`assistant`,content:`Let me search for that information...`,timestamp:new Date,status:`complete`,toolCalls:[{id:`tc_${Date.now()}_1`,tool:`query_knowledge`,args:{query:`component patterns`,limit:5},status:`pending`},{id:`tc_${Date.now()}_2`,tool:`read_file`,args:{path:`src/lib/components/Button.svelte`},status:`running`},{id:`tc_${Date.now()}_3`,tool:`search_files`,args:{pattern:`*.test.ts`},result:{files:[`Button.test.ts`,`Modal.test.ts`],count:2},status:`complete`}]};g(j,[...o(j),e],!0)}let le=['The chat container uses `role="region"` with `aria-label="Chat conversation"` for screen reader navigation.','Messages are announced via `aria-live="polite"` to notify users of new content.',`Keyboard shortcuts: Enter to send, Shift+Enter for newline, Escape to cancel streaming.`,"Connection status is conveyed via both visual indicators and `aria-label` attributes.",`Tool call status changes are announced to assistive technologies.`];var K=D(),q=m(K);y(q,{eyebrow:`AI Interface`,title:`Chat Components`,description:`AI chat interface components for building conversational UIs with streaming responses, tool calls, and configurable settings.`,actions:n=>{var s=T(),c=m(s);v(c,{variant:`outline`,size:`sm`,onclick:W,children:(n,s)=>{r();var c=t();e(()=>i(c,o(I)?`Show Messages`:`Show Empty State`)),a(n,c)},$$slots:{default:!0}}),v(h(c,2),{variant:`outline`,size:`sm`,onclick:G,children:(e,n)=>{r(),a(e,t(`Add Tool Call Demo`))},$$slots:{default:!0}}),a(n,s)},children:(l,te)=>{var d=oe(),f=m(d),_=h(u(f),2);p(u(_),()=>b,(e,t)=>{t(e,{get handlers(){return U},get messages(){return o(j)},get streaming(){return o(M)},get streamContent(){return o(N)},get connectionStatus(){return o(P)},class:`chat-demo`,children:(e,t)=>{var n=ae(),r=m(n);p(r,()=>ie,(e,t)=>{t(e,{title:`PAI Demo`,subtitle:`Powered by Greater Components`,get connectionStatus(){return o(P)},showClearButton:!0,showSettingsButton:!0,onClear:ce,onSettings:()=>g(F,!0)})});var i=h(r,2);p(i,()=>re,(e,t)=>{t(e,{showAvatars:!0})});var c=h(i,2),l=e=>{var t=s();p(m(t),()=>S,(e,t)=>{t(e,{get suggestions(){return B},onSelect:se,variant:`cards`})}),a(e,t)};ee(c,e=>{o(j).length===0&&e(l)}),p(h(c,2),()=>ne,(e,t)=>{t(e,{placeholder:`Ask PAI anything...`,get disabled(){return o(M)},showFileUpload:!1,onSend:e=>U.onSubmit?.(e)})}),a(e,n)},$$slots:{default:!0}})}),n(_),w(h(_,2),{title:`Basic Chat Setup`,description:`Import and configure the chat components`,code:`
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
</Chat.Container>`}),n(f);var y=h(f,2),C=h(u(y),2),T=u(C);p(h(u(T),2),()=>S,(e,t)=>{t(e,{get suggestions(){return B},onSelect:e=>console.log(`Selected:`,e),variant:`pills`})}),n(T);var D=h(T,2);p(h(u(D),2),()=>S,(e,t)=>{t(e,{suggestions:[{text:`What is PAI?`,description:`Learn about the AI assistant`},{text:`Create a scope`,description:`Define context for your project`},{text:`Example workflow`,description:`See automation in action`},{text:`Knowledge bases`,description:`Explore available documentation`}],onSelect:e=>console.log(`Selected:`,e),variant:`cards`})}),n(D),n(C),w(h(C,2),{title:`Suggestions with empty state`,description:`Show suggestions when conversation is empty`,code:`
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
</Chat.Container>`}),n(y);var O=h(y,2),k=h(u(O),2),A=u(k);p(h(u(A),2),()=>x,(e,t)=>{t(e,{toolCall:{id:`demo_pending`,tool:`query_knowledge`,args:{query:`component patterns`,knowledgeBase:`svelte-docs`},status:`pending`}})}),n(A);var I=h(A,2);p(h(u(I),2),()=>x,(e,t)=>{t(e,{toolCall:{id:`demo_running`,tool:`search_files`,args:{pattern:`**/*.svelte`,path:`src/lib`},status:`running`}})}),n(I);var R=h(I,2);p(h(u(R),2),()=>x,(e,t)=>{t(e,{toolCall:{id:`demo_complete`,tool:`read_file`,args:{path:`src/lib/Button.svelte`,limit:50},result:{content:`// Svelte component content
export let variant = "solid";`,lines:50},status:`complete`},showResult:!0,collapsible:!0})}),n(R);var z=h(R,2);p(h(u(z),2),()=>x,(e,t)=>{t(e,{toolCall:{id:`demo_error`,tool:`execute_command`,args:{command:`npm run build`},status:`error`,error:`Command failed with exit code 1`}})}),n(z),n(k),w(h(k,2),{title:`Tool Call Usage`,description:`Display tool calls within messages or standalone`,code:`
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
/>`}),n(O);var V=h(O,2),H=h(u(V),2),W=u(H),G=h(u(W),2),K=h(u(G),2),q=u(K,!0);n(K);var J=h(K,4),ue=u(J,!0);n(J);var Y=h(J,4),de=u(Y,!0);n(Y);var X=h(Y,4),fe=u(X,!0);n(X);var Z=h(X,4),pe=u(Z,!0);n(Z),n(G),v(h(G,2),{onclick:()=>g(F,!0),children:(e,n)=>{r(),a(e,t(`Open Settings`))},$$slots:{default:!0}}),n(W),n(H),w(h(H,2),{title:`Settings Integration`,description:`Add settings button to header and handle changes`,code:`
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
/>`}),n(V);var Q=h(V,2),$=h(u(Q),2);c($,20,()=>le,e=>e,(t,r)=>{var o=E(),s=u(o,!0);n(o),e(()=>i(s,r)),a(t,o)}),n($),n(Q),e(e=>{i(q,o(L).model),i(ue,o(L).temperature),i(de,o(L).maxTokens),i(fe,o(L).streaming?`Enabled`:`Disabled`),i(pe,e)},[()=>o(L).knowledgeBases?.join(`, `)||`None`]),a(l,d)},$$slots:{actions:!0,default:!0}}),p(h(q,2),()=>C,(e,t)=>{t(e,{get settings(){return o(L)},get availableModels(){return R},get availableKnowledgeBases(){return z},onSettingsChange:e=>g(L,e,!0),onSave:e=>{g(L,e,!0),g(F,!1)},onClose:()=>g(F,!1),get open(){return o(F)},set open(e){g(F,e,!0)}})}),a(l,K),_()}export{O as component};