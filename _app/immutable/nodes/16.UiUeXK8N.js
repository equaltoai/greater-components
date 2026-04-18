import{B as e,F as t,I as n,K as r,L as i,M as a,P as o,Q as s,R as c,Tt as l,at as u,bt as d,ct as f,it as p,k as m,ot as h,rt as g,ut as _,wt as v,yt as y}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{Rn as b}from"../chunks/CqG1B6Ni.js";import{t as x}from"../chunks/BrMfcLY_.js";import{a as ee,c as te,i as S,n as C,o as ne,r as re,t as w}from"../chunks/CJSM_FY3.js";import{t as T}from"../chunks/D4m1vxU5.js";var E=c(`<!> <!>`,1),ie=c(`<!> <!> <!> <!>`,1),ae=c(`<li class="svelte-23dtxz"> </li>`),oe=c(`<section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">01 · Full Chat Interface</p> <h2 class="svelte-23dtxz">Complete chat experience with all components</h2> <p>The chat interface combines <code>Chat.Container</code>, <code>Chat.Header</code>, <code>Chat.Messages</code>, <code>Chat.Suggestions</code>, and <code>Chat.Input</code> to create a full conversational UI. Try sending a message to see the simulated streaming response.</p></header> <div class="chat-demo-container svelte-23dtxz"><!></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">02 · Quick Suggestions</p> <h2 class="svelte-23dtxz">Prompt suggestions for empty state</h2> <p><code>Chat.Suggestions</code> displays clickable prompts to help users get started. Supports
				both <code>pills</code> (horizontal) and <code>cards</code> (grid) variants.</p></header> <div class="suggestions-demo svelte-23dtxz"><div class="suggestions-variant svelte-23dtxz"><h3 class="svelte-23dtxz">Pills Variant (default)</h3> <!></div> <div class="suggestions-variant svelte-23dtxz"><h3 class="svelte-23dtxz">Cards Variant</h3> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">03 · Tool Call Display</p> <h2 class="svelte-23dtxz">AI tool invocations with status indicators</h2> <p><code>Chat.ToolCallDisplay</code> displays tool/function calls during AI responses with collapsible
				results, status indicators, and syntax-highlighted arguments.</p></header> <div class="tool-calls-demo svelte-23dtxz"><div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Pending</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Running</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Complete</h3> <!></div> <div class="tool-call-item svelte-23dtxz"><h3 class="svelte-23dtxz">Error</h3> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">04 · Settings Configuration</p> <h2 class="svelte-23dtxz">Chat settings modal with model selection</h2> <p><code>Chat.Settings</code> provides a configuration modal for model selection, temperature, max
				tokens, system prompt, and knowledge base toggles.</p></header> <div class="settings-demo svelte-23dtxz"><div class="settings-preview svelte-23dtxz"><h3 class="svelte-23dtxz">Current Settings</h3> <dl class="settings-list svelte-23dtxz"><dt class="svelte-23dtxz">Model</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Temperature</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Max Tokens</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Streaming</dt> <dd class="svelte-23dtxz"> </dd> <dt class="svelte-23dtxz">Knowledge Bases</dt> <dd class="svelte-23dtxz"> </dd></dl> <!></div></div> <!></section> <section class="chat-section svelte-23dtxz"><header><p class="section-eyebrow svelte-23dtxz">05 · Accessibility</p> <h2 class="svelte-23dtxz">ARIA roles + keyboard navigation</h2></header> <ul class="guidance-list svelte-23dtxz"></ul></section>`,1),D=c(`<!> <!>`,1);function O(c,O){d(O,!0);let k=[{id:`tc_1`,tool:`query_knowledge`,args:{query:`PAI documentation`,knowledgeBase:`paytheory`},result:{found:3,snippets:[`PAI is an AI-powered assistant...`,`Scopes define context...`]},status:`complete`},{id:`tc_2`,tool:`search_files`,args:{pattern:`*.svelte`,path:`src/routes`},status:`running`}],A=[{id:`msg_1`,role:`user`,content:`What is PAI?`,timestamp:new Date(Date.now()-3e5),status:`complete`},{id:`msg_2`,role:`assistant`,content:`**PAI** (Penny AI) is an AI-powered development assistant designed to help you build applications faster.

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

I'm currently searching for relevant files in your project...`,timestamp:new Date(Date.now()-12e4),status:`complete`,toolCalls:[k[1]]}],j=_(h([...A])),M=_(!1),N=_(``),P=_(`connected`),F=_(!1),I=_(!1),L=_(h({model:`gpt-4`,temperature:.7,maxTokens:4096,streaming:!0,systemPrompt:`You are PAI, a helpful AI development assistant.`,knowledgeBases:[`paytheory`,`svelte-docs`]})),R=[{id:`gpt-4`,name:`GPT-4`},{id:`gpt-4-turbo`,name:`GPT-4 Turbo`},{id:`gpt-3.5-turbo`,name:`GPT-3.5 Turbo`},{id:`claude-3-opus`,name:`Claude 3 Opus`},{id:`claude-3-sonnet`,name:`Claude 3 Sonnet`}],z=[{id:`paytheory`,name:`Pay Theory`,description:`Payment processing documentation`},{id:`svelte-docs`,name:`Svelte Docs`,description:`Svelte framework documentation`},{id:`typescript`,name:`TypeScript`,description:`TypeScript language reference`}],B=[`What is PAI?`,`How do I create a scope?`,`Show me an example workflow`,`What knowledgebases are available?`],V=[`Great question! Here's a quick overview of the available knowledge bases:

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

This will analyze your TypeScript files and generate improvement suggestions.`];async function H(e){f(M,!0),f(N,``),f(P,`connected`);let t={id:`msg_${Date.now()}`,role:`assistant`,content:``,timestamp:new Date,status:`streaming`};f(j,[...r(j),t],!0);let n=e.split(``);for(let e=0;e<n.length;e++)await new Promise(e=>setTimeout(e,15+Math.random()*25)),f(N,r(N)+n[e]),f(j,r(j).map(e=>e.id===t.id?{...e,content:r(N)}:e),!0);f(j,r(j).map(e=>e.id===t.id?{...e,status:`complete`}:e),!0),f(M,!1),f(N,``)}let U={onSubmit:async e=>{let t={id:`msg_${Date.now()}`,role:`user`,content:e,timestamp:new Date,status:`complete`};f(j,[...r(j),t],!0),await H(V[Math.floor(Math.random()*V.length)])},onClear:()=>{f(j,[],!0),f(N,``),f(M,!1)},onSettingsChange:e=>{f(L,e,!0)},onStopStreaming:()=>{f(M,!1)}};function se(e){U.onSubmit?.(e)}function ce(){U.onClear?.()}function W(){f(I,!r(I)),r(I)?f(j,[],!0):f(j,[...A],!0)}function G(){let e={id:`msg_${Date.now()}`,role:`assistant`,content:`Let me search for that information...`,timestamp:new Date,status:`complete`,toolCalls:[{id:`tc_${Date.now()}_1`,tool:`query_knowledge`,args:{query:`component patterns`,limit:5},status:`pending`},{id:`tc_${Date.now()}_2`,tool:`read_file`,args:{path:`src/lib/components/Button.svelte`},status:`running`},{id:`tc_${Date.now()}_3`,tool:`search_files`,args:{pattern:`*.test.ts`},result:{files:[`Button.test.ts`,`Modal.test.ts`],count:2},status:`complete`}]};f(j,[...r(j),e],!0)}let le=['The chat container uses `role="region"` with `aria-label="Chat conversation"` for screen reader navigation.','Messages are announced via `aria-live="polite"` to notify users of new content.',`Keyboard shortcuts: Enter to send, Shift+Enter for newline, Escape to cancel streaming.`,"Connection status is conveyed via both visual indicators and `aria-label` attributes.",`Tool call status changes are announced to assistive technologies.`];var K=D(),q=p(K);x(q,{eyebrow:`AI Interface`,title:`Chat Components`,description:`AI chat interface components for building conversational UIs with streaming responses, tool calls, and configurable settings.`,actions:i=>{var a=E(),o=p(a);b(o,{variant:`outline`,size:`sm`,onclick:W,children:(i,a)=>{v();var o=e();s(()=>t(o,r(I)?`Show Messages`:`Show Empty State`)),n(i,o)},$$slots:{default:!0}}),b(u(o,2),{variant:`outline`,size:`sm`,onclick:G,children:(t,r)=>{v(),n(t,e(`Add Tool Call Demo`))},$$slots:{default:!0}}),n(i,a)},children:(c,d)=>{var h=oe(),_=p(h),y=u(g(_),2);m(g(y),()=>te,(e,t)=>{t(e,{get handlers(){return U},get messages(){return r(j)},get streaming(){return r(M)},get streamContent(){return r(N)},get connectionStatus(){return r(P)},class:`chat-demo`,children:(e,t)=>{var a=ie(),s=p(a);m(s,()=>re,(e,t)=>{t(e,{title:`PAI Demo`,subtitle:`Powered by Greater Components`,get connectionStatus(){return r(P)},showClearButton:!0,showSettingsButton:!0,onClear:ce,onSettings:()=>f(F,!0)})});var c=u(s,2);m(c,()=>ne,(e,t)=>{t(e,{showAvatars:!0})});var l=u(c,2),d=e=>{var t=i();m(p(t),()=>C,(e,t)=>{t(e,{get suggestions(){return B},onSelect:se,variant:`cards`})}),n(e,t)};o(l,e=>{r(j).length===0&&e(d)}),m(u(l,2),()=>ee,(e,t)=>{t(e,{placeholder:`Ask PAI anything...`,get disabled(){return r(M)},showFileUpload:!1,onSend:e=>U.onSubmit?.(e)})}),n(e,a)},$$slots:{default:!0}})}),l(y),T(u(y,2),{title:`Basic Chat Setup`,description:`Import and configure the chat components`,code:`
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
</Chat.Container>`}),l(_);var x=u(_,2),w=u(g(x),2),E=g(w);m(u(g(E),2),()=>C,(e,t)=>{t(e,{get suggestions(){return B},onSelect:e=>console.log(`Selected:`,e),variant:`pills`})}),l(E);var D=u(E,2);m(u(g(D),2),()=>C,(e,t)=>{t(e,{suggestions:[{text:`What is PAI?`,description:`Learn about the AI assistant`},{text:`Create a scope`,description:`Define context for your project`},{text:`Example workflow`,description:`See automation in action`},{text:`Knowledge bases`,description:`Explore available documentation`}],onSelect:e=>console.log(`Selected:`,e),variant:`cards`})}),l(D),l(w),T(u(w,2),{title:`Suggestions with empty state`,description:`Show suggestions when conversation is empty`,code:`
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
</Chat.Container>`}),l(x);var O=u(x,2),k=u(g(O),2),A=g(k);m(u(g(A),2),()=>S,(e,t)=>{t(e,{toolCall:{id:`demo_pending`,tool:`query_knowledge`,args:{query:`component patterns`,knowledgeBase:`svelte-docs`},status:`pending`}})}),l(A);var I=u(A,2);m(u(g(I),2),()=>S,(e,t)=>{t(e,{toolCall:{id:`demo_running`,tool:`search_files`,args:{pattern:`**/*.svelte`,path:`src/lib`},status:`running`}})}),l(I);var R=u(I,2);m(u(g(R),2),()=>S,(e,t)=>{t(e,{toolCall:{id:`demo_complete`,tool:`read_file`,args:{path:`src/lib/Button.svelte`,limit:50},result:{content:`// Svelte component content
export let variant = "solid";`,lines:50},status:`complete`},showResult:!0,collapsible:!0})}),l(R);var z=u(R,2);m(u(g(z),2),()=>S,(e,t)=>{t(e,{toolCall:{id:`demo_error`,tool:`execute_command`,args:{command:`npm run build`},status:`error`,error:`Command failed with exit code 1`}})}),l(z),l(k),T(u(k,2),{title:`Tool Call Usage`,description:`Display tool calls within messages or standalone`,code:`
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
/>`}),l(O);var V=u(O,2),H=u(g(V),2),W=g(H),G=u(g(W),2),K=u(g(G),2),q=g(K,!0);l(K);var J=u(K,4),ue=g(J,!0);l(J);var Y=u(J,4),de=g(Y,!0);l(Y);var X=u(Y,4),fe=g(X,!0);l(X);var Z=u(X,4),pe=g(Z,!0);l(Z),l(G),b(u(G,2),{onclick:()=>f(F,!0),children:(t,r)=>{v(),n(t,e(`Open Settings`))},$$slots:{default:!0}}),l(W),l(H),T(u(H,2),{title:`Settings Integration`,description:`Add settings button to header and handle changes`,code:`
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
/>`}),l(V);var Q=u(V,2),$=u(g(Q),2);a($,20,()=>le,e=>e,(e,r)=>{var i=ae(),a=g(i,!0);l(i),s(()=>t(a,r)),n(e,i)}),l($),l(Q),s(e=>{t(q,r(L).model),t(ue,r(L).temperature),t(de,r(L).maxTokens),t(fe,r(L).streaming?`Enabled`:`Disabled`),t(pe,e)},[()=>r(L).knowledgeBases?.join(`, `)||`None`]),n(c,h)},$$slots:{actions:!0,default:!0}}),m(u(q,2),()=>w,(e,t)=>{t(e,{get settings(){return r(L)},get availableModels(){return R},get availableKnowledgeBases(){return z},onSettingsChange:e=>f(L,e,!0),onSave:e=>{f(L,e,!0),f(F,!1)},onClose:()=>f(F,!1),get open(){return r(F)},set open(e){f(F,e,!0)}})}),n(c,K),y()}export{O as component};