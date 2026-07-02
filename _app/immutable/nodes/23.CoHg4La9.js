import{n as e}from"../chunks/CRQC2527.js";import{$ as t,C as n,Dt as r,Et as i,F as a,I as o,K as s,L as c,M as l,P as u,R as d,St as f,U as p,at as m,ct as h,d as ee,ft as g,h as te,mt as _,ot as v,st as y,ut as b,xt as x}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{B as S,H as ne,R as re,U as C,V as ie,qt as ae,z as w}from"../chunks/6QSfMQ-W.js";import{t as T}from"../chunks/RYgqtqyS.js";import{t as E}from"../chunks/DjMfVXn_.js";var D=e({load:()=>O}),O=(()=>({metadata:{slug:`forms-demo`,title:`Form Components Demo`,description:`Text inputs, selects, switches, checkboxes, radios, and uploads pulled from the production primitives build.`,sections:[`Text inputs`,`Selections`,`Toggles & switches`,`File uploads`]}})),oe=d(`<label class="svelte-109fpqf"><input type="radio" name="audience" class="svelte-109fpqf"/> <span> </span></label>`),se=d(`<li class="svelte-109fpqf"><strong> </strong> <span> </span></li>`),ce=d(`<ul class="file-list svelte-109fpqf"></ul>`),le=d(`<p class="placeholder svelte-109fpqf">No files selected.</p>`),ue=d(`<section class="demo-section svelte-109fpqf"><header><h2>Text Inputs &amp; Validation</h2> <p>Showcases helper text, inline errors, prefix icons, and required indicators.</p></header> <div class="text-inputs svelte-109fpqf"><!> <!></div> <p class="a11y-tip svelte-109fpqf">Accessible pattern: help text is tied via aria-describedby and errors announce with
			role="alert" when invalid.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>TextArea Auto-Resize</h2> <p>Dynamic rows and character counting keep longer bios readable without new dependencies.</p></header> <label class="textarea-label svelte-109fpqf" for="bio-field">Bio</label> <!> <div class="character-meta svelte-109fpqf"><span> </span> <span aria-live="polite"> </span></div> <p class="a11y-tip svelte-109fpqf">Tip: keep aria-live polite for counters so screen readers announce only when values change.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Select &amp; Radio Inputs</h2> <p>Placeholder guidance, disabled options, and a native radio group with keyboard hints.</p></header> <div class="choice-grid svelte-109fpqf"><div class="select-field svelte-109fpqf"><label class="select-label svelte-109fpqf" for="visibility-select">Default visibility</label> <!></div> <fieldset class="radio-group svelte-109fpqf" role="radiogroup" aria-label="Audience"><legend>Audience</legend> <!></fieldset></div> <p class="a11y-tip svelte-109fpqf">Keyboard: Up/Down cycles radios while typing the first letter jumps via native typeahead.
			Disabled select options remain unreachable.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Toggles &amp; Switches</h2> <p>Mixed checkbox and switch controls show indies vs binary preferences.</p></header> <div class="toggle-stack svelte-109fpqf"><!> <!> <!> <!></div> <p class="a11y-tip svelte-109fpqf">Space toggles the focused checkbox or switch; disabled switches remove themselves from the tab
			order.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>File Upload &amp; Drag-and-Drop</h2> <p>Wrap the published FileUpload control with a drag surface for richer UX while keeping drag
				events in user land.</p></header> <div aria-label="Upload files" role="region"><p class="select-label svelte-109fpqf">Attachments</p> <!> <p>Drag files here or use the button. Up to 4 files.</p></div> <!> <!></section>`,1);function k(e,d){f(d,!0);let D=[],O=g(``),k=g(``),A=g(!1),j=_(()=>()=>s(O).trim().length>0&&s(O).trim().length<2),de=_(()=>()=>/.+@.+\..+/.test(s(k))),M=g(`Greater Components ships with strong defaults.`),fe=_(()=>()=>Math.max(0,280-s(M).length)),N=_(()=>()=>Math.min(10,Math.max(4,Math.ceil(s(M).length/60)))),pe=[{value:``,label:`Select a region`},{value:`us`,label:`United States`},{value:`uk`,label:`United Kingdom`},{value:`br`,label:`Brazil`,disabled:!0},{value:`de`,label:`Germany`},{value:`jp`,label:`Japan`}],P=g(``),F=g(`public`),I=g(!0),L=g(!1),R=g(!0),z=g(h([])),B=g(!1);function me(e){b(z,e?Array.from(e):[],!0)}function he(e){e.preventDefault(),b(B,!1);let t=e.dataTransfer?.files;t&&b(z,Array.from(t),!0)}T(e,{eyebrow:`Component Demos`,get title(){return d.data.metadata.title},get description(){return d.data.metadata.description},children:(e,d)=>{var f=ue(),h=v(f),g=y(m(h),2),x=m(g);C(x,{label:`Display name`,required:!0,helpText:`Shown on profiles and mentions.`,get invalid(){return s(j)},errorMessage:`Use at least two characters.`,get value(){return s(O)},set value(e){b(O,e,!0)},suffix:e=>{var t=c(),n=v(t),r=e=>{ae(e,{size:16,"aria-hidden":`true`})},i=_(()=>!s(j)&&s(O).trim().length>=2);u(n,e=>{s(i)&&e(r)}),o(e,t)},$$slots:{suffix:!0}});var T=y(x,2);{let e=_(()=>!s(de)&&s(A));C(T,{label:`Contact email`,type:`email`,placeholder:`you@example.com`,get invalid(){return s(e)},errorMessage:`Enter a valid email so recovery links work.`,onblur:()=>b(A,!0),get value(){return s(k)},set value(e){b(k,e,!0)}})}r(g),E(y(g,4),{title:`TextField usage`,description:`Snippet mirrors the bindings powering this section.`,code:`
<div class="text-inputs">
  <TextField
    label="Display name"
    bind:value={displayName}
    required
    helpText="Shown on profiles and mentions."
    invalid={isDisplayNameInvalid}
    errorMessage="Use at least two characters."
  />
  <TextField
    label="Contact email"
    type="email"
    bind:value={email}
    placeholder="you@example.com"
    invalid={!emailValid && emailTouched}
    errorMessage="Enter a valid email so recovery links work."
  />
</div>`}),r(h);var V=y(h,2),ge=y(m(V),4);ne(ge,{id:`bio-field`,get rows(){return s(N)},maxlength:280,placeholder:`Share what admins should know…`,get value(){return s(M)},set value(e){b(M,e,!0)}});var H=y(ge,2),U=m(H),_e=m(U);r(U);var W=y(U,2),ve=m(W);r(W),r(H),E(y(H,4),{title:`Auto-resize TextArea`,description:`Rows derive from the same derived store used by the live textarea.`,code:`
<label for="bio-field">Bio</label>
<TextArea
  id="bio-field"
  bind:value={bio}
  rows={dynamicRows}
  maxlength={bioLimit}
  placeholder="Share what admins should know…"
/>
<p aria-live="polite">{remaining} characters left</p>`}),r(V);var G=y(V,2),K=y(m(G),2),q=m(K);ie(y(m(q),2),{id:`visibility-select`,placeholder:`Pick visibility`,get options(){return pe},get value(){return s(P)},set value(e){b(P,e,!0)}}),r(q);var J=y(q,2);l(y(m(J),2),16,()=>[`public`,`followers`,`private`],e=>e,(e,i)=>{var c=oe(),l=m(c);te(l);var u,d=y(l,2);let f;var p=m(d,!0);r(d),r(c),t(()=>{u!==(u=i)&&(l.value=(l.__value=i)??``),f=n(d,1,`svelte-109fpqf`,null,f,{active:s(F)===i}),a(p,i)}),ee(D,[],l,()=>s(F),e=>b(F,e)),o(e,c)}),r(J),r(K),E(y(K,4),{title:`Select + radio`,description:`Native radio inputs pair with Greater Select for full coverage.`,code:`
<label for="visibility-select">Default visibility</label>
<Select
  id="visibility-select"
  placeholder="Pick visibility"
  options={countries}
  bind:value={country}
/>
<fieldset role="radiogroup" aria-label="Audience">
  {#each ['public', 'followers', 'private'] as option}
    <label>
      <input
        type="radio"
        name="audience"
        value={option}
        bind:group={radioChoice}
      />
      {option}
    </label>
  {/each}
</fieldset>`}),r(G);var Y=y(G,2),X=y(m(Y),2),Z=m(X);S(Z,{label:`Release newsletter`,get checked(){return s(I)},set checked(e){b(I,e,!0)}});var ye=y(Z,2);S(ye,{label:`Join beta`,get checked(){return s(L)},set checked(e){b(L,e,!0)}});var be=y(ye,2);w(be,{label:`Dark mode`,get checked(){return s(R)},set checked(e){b(R,e,!0)}}),w(y(be,2),{checked:!1,disabled:!0,label:`Switch disabled`}),r(X),E(y(X,4),{title:`Checkbox + Switch`,description:`Live bindings keep snippet parity.`,code:`
<div class="toggle-stack">
  <Checkbox bind:checked={newsletter} label="Release newsletter" />
  <Checkbox bind:checked={betaAccess} label="Join beta" />
  <Switch bind:checked={darkMode} label="Dark mode" />
  <Switch checked={false} disabled label="Switch disabled" />
</div>`}),r(Y);var xe=y(Y,2),Q=y(m(xe),2);let Se;re(y(m(Q),2),{multiple:!0,accept:`image/*`,onchange:me}),i(2),r(Q);var $=y(Q,2),Ce=e=>{var n=ce();l(n,21,()=>s(z),e=>e.name,(e,n)=>{var i=se(),c=m(i),l=m(c,!0);r(c);var u=y(c,2),d=m(u);r(u),r(i),t(e=>{a(l,s(n).name),a(d,`${e??``} KB · ${(s(n).type||`Unknown type`)??``}`)},[()=>Math.round(s(n).size/1024)]),o(e,i)}),r(n),o(e,n)},we=e=>{o(e,le())};u($,e=>{s(z).length>0?e(Ce):e(we,-1)}),E(y($,2),{title:`Drag surface + FileUpload`,description:`Drop zone delegates to FileUpload so uploads continue to flow through the published component.`,code:`
<div class="drop-surface" ondragover={(event) => event.preventDefault()} ondragenter={() => (dropActive = true)} ondragleave={() => (dropActive = false)} ondrop={handleDrop} role="region">
  <p class="select-label">Attachments</p>
  <FileUpload multiple accept="image/*" onchange={(files) => handleFileChange(files)} />
  <p>Drag files here or use the button.</p>
</div>
<ul>
  {#each uploadedFiles as file}
    <li>{file.name}</li>
  {/each}
</ul>`}),r(xe),t(()=>{a(_e,`${s(N)??``} rows`),a(ve,`${s(fe)??``} characters left`),Se=n(Q,1,`drop-surface svelte-109fpqf`,null,Se,{active:s(B)})}),p(`dragover`,Q,e=>e.preventDefault()),p(`dragenter`,Q,()=>b(B,!0)),p(`dragleave`,Q,()=>b(B,!1)),p(`drop`,Q,he),o(e,f)},$$slots:{default:!0}}),x()}export{k as component,D as universal};