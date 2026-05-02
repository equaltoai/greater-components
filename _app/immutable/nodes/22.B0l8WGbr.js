import{n as e}from"../chunks/9qPbz94-.js";import{C as t,F as n,I as r,K as i,L as a,M as o,P as s,Q as c,R as l,Tt as u,U as d,at as f,bt as p,ct as m,d as ee,ft as h,h as te,it as g,ot as _,rt as v,ut as y,wt as ne,yt as b}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{B as re,H as x,L as ie,Mn as ae,R as S,V as oe,z as C}from"../chunks/CqG1B6Ni.js";import{t as w}from"../chunks/BrMfcLY_.js";import{t as T}from"../chunks/BuX9N8RZ.js";var E=e({load:()=>D}),D=(()=>({metadata:{slug:`forms-demo`,title:`Form Components Demo`,description:`Text inputs, selects, switches, checkboxes, radios, and uploads pulled from the production primitives build.`,sections:[`Text inputs`,`Selections`,`Toggles & switches`,`File uploads`]}})),se=l(`<label class="svelte-109fpqf"><input type="radio" name="audience" class="svelte-109fpqf"/> <span> </span></label>`),ce=l(`<li class="svelte-109fpqf"><strong> </strong> <span> </span></li>`),le=l(`<ul class="file-list svelte-109fpqf"></ul>`),ue=l(`<p class="placeholder svelte-109fpqf">No files selected.</p>`),de=l(`<section class="demo-section svelte-109fpqf"><header><h2>Text Inputs &amp; Validation</h2> <p>Showcases helper text, inline errors, prefix icons, and required indicators.</p></header> <div class="text-inputs svelte-109fpqf"><!> <!></div> <p class="a11y-tip svelte-109fpqf">Accessible pattern: help text is tied via aria-describedby and errors announce with
			role="alert" when invalid.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>TextArea Auto-Resize</h2> <p>Dynamic rows and character counting keep longer bios readable without new dependencies.</p></header> <label class="textarea-label svelte-109fpqf" for="bio-field">Bio</label> <!> <div class="character-meta svelte-109fpqf"><span> </span> <span aria-live="polite"> </span></div> <p class="a11y-tip svelte-109fpqf">Tip: keep aria-live polite for counters so screen readers announce only when values change.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Select &amp; Radio Inputs</h2> <p>Placeholder guidance, disabled options, and a native radio group with keyboard hints.</p></header> <div class="choice-grid svelte-109fpqf"><div class="select-field svelte-109fpqf"><label class="select-label svelte-109fpqf" for="visibility-select">Default visibility</label> <!></div> <fieldset class="radio-group svelte-109fpqf" role="radiogroup" aria-label="Audience"><legend>Audience</legend> <!></fieldset></div> <p class="a11y-tip svelte-109fpqf">Keyboard: Up/Down cycles radios while typing the first letter jumps via native typeahead.
			Disabled select options remain unreachable.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Toggles &amp; Switches</h2> <p>Mixed checkbox and switch controls show indies vs binary preferences.</p></header> <div class="toggle-stack svelte-109fpqf"><!> <!> <!> <!></div> <p class="a11y-tip svelte-109fpqf">Space toggles the focused checkbox or switch; disabled switches remove themselves from the tab
			order.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>File Upload &amp; Drag-and-Drop</h2> <p>Wrap the published FileUpload control with a drag surface for richer UX while keeping drag
				events in user land.</p></header> <div aria-label="Upload files" role="region"><p class="select-label svelte-109fpqf">Attachments</p> <!> <p>Drag files here or use the button. Up to 4 files.</p></div> <!> <!></section>`,1);function O(e,l){p(l,!0);let E=[],D=y(``),O=y(``),k=y(!1),A=h(()=>()=>i(D).trim().length>0&&i(D).trim().length<2),fe=h(()=>()=>/.+@.+\..+/.test(i(O))),j=y(`Greater Components ships with strong defaults.`),pe=h(()=>()=>Math.max(0,280-i(j).length)),M=h(()=>()=>Math.min(10,Math.max(4,Math.ceil(i(j).length/60)))),me=[{value:``,label:`Select a region`},{value:`us`,label:`United States`},{value:`uk`,label:`United Kingdom`},{value:`br`,label:`Brazil`,disabled:!0},{value:`de`,label:`Germany`},{value:`jp`,label:`Japan`}],N=y(``),P=y(`public`),F=y(!0),I=y(!1),L=y(!0),R=y(_([])),z=y(!1);function he(e){m(R,e?Array.from(e):[],!0)}function ge(e){e.preventDefault(),m(z,!1);let t=e.dataTransfer?.files;t&&m(R,Array.from(t),!0)}w(e,{eyebrow:`Component Demos`,get title(){return l.data.metadata.title},get description(){return l.data.metadata.description},children:(e,l)=>{var p=de(),_=g(p),y=f(v(_),2),b=v(y);x(b,{label:`Display name`,required:!0,helpText:`Shown on profiles and mentions.`,get invalid(){return i(A)},errorMessage:`Use at least two characters.`,get value(){return i(D)},set value(e){m(D,e,!0)},suffix:e=>{var t=a(),n=g(t),o=e=>{ae(e,{size:16,"aria-hidden":`true`})},c=h(()=>!i(A)&&i(D).trim().length>=2);s(n,e=>{i(c)&&e(o)}),r(e,t)},$$slots:{suffix:!0}});var w=f(b,2);{let e=h(()=>!i(fe)&&i(k));x(w,{label:`Contact email`,type:`email`,placeholder:`you@example.com`,get invalid(){return i(e)},errorMessage:`Enter a valid email so recovery links work.`,onblur:()=>m(k,!0),get value(){return i(O)},set value(e){m(O,e,!0)}})}u(y),T(f(y,4),{title:`TextField usage`,description:`Snippet mirrors the bindings powering this section.`,code:`
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
</div>`}),u(_);var B=f(_,2),V=f(v(B),4);oe(V,{id:`bio-field`,get rows(){return i(M)},maxlength:280,placeholder:`Share what admins should know…`,get value(){return i(j)},set value(e){m(j,e,!0)}});var H=f(V,2),U=v(H),_e=v(U);u(U);var W=f(U,2),ve=v(W);u(W),u(H),T(f(H,4),{title:`Auto-resize TextArea`,description:`Rows derive from the same derived store used by the live textarea.`,code:`
<label for="bio-field">Bio</label>
<TextArea
  id="bio-field"
  bind:value={bio}
  rows={dynamicRows}
  maxlength={bioLimit}
  placeholder="Share what admins should know…"
/>
<p aria-live="polite">{remaining} characters left</p>`}),u(B);var G=f(B,2),K=f(v(G),2),q=v(K);re(f(v(q),2),{id:`visibility-select`,placeholder:`Pick visibility`,get options(){return me},get value(){return i(N)},set value(e){m(N,e,!0)}}),u(q);var J=f(q,2);o(f(v(J),2),16,()=>[`public`,`followers`,`private`],e=>e,(e,a)=>{var o=se(),s=v(o);te(s);var l,d=f(s,2);let p;var h=v(d,!0);u(d),u(o),c(()=>{l!==(l=a)&&(s.value=(s.__value=a)??``),p=t(d,1,`svelte-109fpqf`,null,p,{active:i(P)===a}),n(h,a)}),ee(E,[],s,()=>i(P),e=>m(P,e)),r(e,o)}),u(J),u(K),T(f(K,4),{title:`Select + radio`,description:`Native radio inputs pair with Greater Select for full coverage.`,code:`
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
</fieldset>`}),u(G);var Y=f(G,2),X=f(v(Y),2),Z=v(X);C(Z,{label:`Release newsletter`,get checked(){return i(F)},set checked(e){m(F,e,!0)}});var ye=f(Z,2);C(ye,{label:`Join beta`,get checked(){return i(I)},set checked(e){m(I,e,!0)}});var be=f(ye,2);S(be,{label:`Dark mode`,get checked(){return i(L)},set checked(e){m(L,e,!0)}}),S(f(be,2),{checked:!1,disabled:!0,label:`Switch disabled`}),u(X),T(f(X,4),{title:`Checkbox + Switch`,description:`Live bindings keep snippet parity.`,code:`
<div class="toggle-stack">
  <Checkbox bind:checked={newsletter} label="Release newsletter" />
  <Checkbox bind:checked={betaAccess} label="Join beta" />
  <Switch bind:checked={darkMode} label="Dark mode" />
  <Switch checked={false} disabled label="Switch disabled" />
</div>`}),u(Y);var xe=f(Y,2),Q=f(v(xe),2);let Se;ie(f(v(Q),2),{multiple:!0,accept:`image/*`,onchange:he}),ne(2),u(Q);var $=f(Q,2),Ce=e=>{var t=le();o(t,21,()=>i(R),e=>e.name,(e,t)=>{var a=ce(),o=v(a),s=v(o,!0);u(o);var l=f(o,2),d=v(l);u(l),u(a),c(e=>{n(s,i(t).name),n(d,`${e??``} KB · ${(i(t).type||`Unknown type`)??``}`)},[()=>Math.round(i(t).size/1024)]),r(e,a)}),u(t),r(e,t)},we=e=>{r(e,ue())};s($,e=>{i(R).length>0?e(Ce):e(we,-1)}),T(f($,2),{title:`Drag surface + FileUpload`,description:`Drop zone delegates to FileUpload so uploads continue to flow through the published component.`,code:`
<div class="drop-surface" ondragover={(event) => event.preventDefault()} ondragenter={() => (dropActive = true)} ondragleave={() => (dropActive = false)} ondrop={handleDrop} role="region">
  <p class="select-label">Attachments</p>
  <FileUpload multiple accept="image/*" onchange={(files) => handleFileChange(files)} />
  <p>Drag files here or use the button.</p>
</div>
<ul>
  {#each uploadedFiles as file}
    <li>{file.name}</li>
  {/each}
</ul>`}),u(xe),c(()=>{n(_e,`${i(M)??``} rows`),n(ve,`${i(pe)??``} characters left`),Se=t(Q,1,`drop-surface svelte-109fpqf`,null,Se,{active:i(z)})}),d(`dragover`,Q,e=>e.preventDefault()),d(`dragenter`,Q,()=>m(z,!0)),d(`dragleave`,Q,()=>m(z,!1)),d(`drop`,Q,ge),r(e,p)},$$slots:{default:!0}}),b()}export{O as component,E as universal};