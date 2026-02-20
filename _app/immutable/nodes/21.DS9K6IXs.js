import{j as q,a as f,c as Ee,b as w,s as g}from"../chunks/BTgIKdxS.js";import{p as Ge,h as n,Q as Je,f as oe,d as r,g as e,t as E,c as i,s as a,u as m,a as Ke,r as l,R as Le}from"../chunks/D-WlePPY.js";import{i as ne}from"../chunks/COMTHQNu.js";import{e as de,s as ce,r as Ve}from"../chunks/EAUZg0eb.js";import{d as Oe,C as pe,F as Qe,e as We}from"../chunks/CyXc35a2.js";import{D as Xe}from"../chunks/DhBnkOx0.js";import{C as _}from"../chunks/DeXdVqsM.js";import{C as He}from"../chunks/sVdH_vDs.js";import{T as ve}from"../chunks/DPkrTyWx.js";import{T as Ye}from"../chunks/DgOwtbYP.js";import{S as ue}from"../chunks/RefRh14L.js";const Ze=(()=>({metadata:{slug:"forms-demo",title:"Form Components Demo",description:"Text inputs, selects, switches, checkboxes, radios, and uploads pulled from the production primitives build.",sections:["Text inputs","Selections","Toggles & switches","File uploads"]}})),ma=Object.freeze(Object.defineProperty({__proto__:null,load:Ze},Symbol.toStringTag,{value:"Module"}));var ea=w('<label class="svelte-109fpqf"><input type="radio" name="audience" class="svelte-109fpqf"/> <span> </span></label>'),aa=w('<li class="svelte-109fpqf"><strong> </strong> <span> </span></li>'),ta=w('<ul class="file-list svelte-109fpqf"></ul>'),la=w('<p class="placeholder svelte-109fpqf">No files selected.</p>'),ia=w(`<section class="demo-section svelte-109fpqf"><header><h2>Text Inputs &amp; Validation</h2> <p>Showcases helper text, inline errors, prefix icons, and required indicators.</p></header> <div class="text-inputs svelte-109fpqf"><!> <!></div> <p class="a11y-tip svelte-109fpqf">Accessible pattern: help text is tied via aria-describedby and errors announce with
			role="alert" when invalid.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>TextArea Auto-Resize</h2> <p>Dynamic rows and character counting keep longer bios readable without new dependencies.</p></header> <label class="textarea-label svelte-109fpqf" for="bio-field">Bio</label> <!> <div class="character-meta svelte-109fpqf"><span> </span> <span aria-live="polite"> </span></div> <p class="a11y-tip svelte-109fpqf">Tip: keep aria-live polite for counters so screen readers announce only when values change.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Select &amp; Radio Inputs</h2> <p>Placeholder guidance, disabled options, and a native radio group with keyboard hints.</p></header> <div class="choice-grid svelte-109fpqf"><div class="select-field svelte-109fpqf"><label class="select-label svelte-109fpqf" for="visibility-select">Default visibility</label> <!></div> <fieldset class="radio-group svelte-109fpqf" role="radiogroup" aria-label="Audience"><legend>Audience</legend> <!></fieldset></div> <p class="a11y-tip svelte-109fpqf">Keyboard: Up/Down cycles radios while typing the first letter jumps via native typeahead.
			Disabled select options remain unreachable.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Toggles &amp; Switches</h2> <p>Mixed checkbox and switch controls show indies vs binary preferences.</p></header> <div class="toggle-stack svelte-109fpqf"><!> <!> <!> <!></div> <p class="a11y-tip svelte-109fpqf">Space toggles the focused checkbox or switch; disabled switches remove themselves from the tab
			order.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>File Upload &amp; Drag-and-Drop</h2> <p>Wrap the published FileUpload control with a drag surface for richer UX while keeping drag
				events in user land.</p></header> <div aria-label="Upload files" role="region"><p class="select-label svelte-109fpqf">Attachments</p> <!> <p>Drag files here or use the button. Up to 4 files.</p></div> <!> <!></section>`,1);function ba(he,D){Ge(D,!0);const fe=[];let b=n(""),T=n(""),G=n(!1);const J=m(()=>()=>e(b).trim().length>0&&e(b).trim().length<2),me=m(()=>()=>/.+@.+\..+/.test(e(T))),be=`
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
</div>`;let y=n("Greater Components ships with strong defaults.");const K=280,ge=m(()=>()=>Math.max(0,K-e(y).length)),L=m(()=>()=>Math.min(10,Math.max(4,Math.ceil(e(y).length/60)))),_e=`
<label for="bio-field">Bio</label>
<TextArea
  id="bio-field"
  bind:value={bio}
  rows={dynamicRows}
  maxlength={bioLimit}
  placeholder="Share what admins should know…"
/>
<p aria-live="polite">{remaining} characters left</p>`,we=[{value:"",label:"Select a region"},{value:"us",label:"United States"},{value:"uk",label:"United Kingdom"},{value:"br",label:"Brazil",disabled:!0},{value:"de",label:"Germany"},{value:"jp",label:"Japan"}];let V=n(""),A=n("public");const ye=`
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
</fieldset>`;let O=n(!0),Q=n(!1),W=n(!0);const xe=`
<div class="toggle-stack">
  <Checkbox bind:checked={newsletter} label="Release newsletter" />
  <Checkbox bind:checked={betaAccess} label="Join beta" />
  <Switch bind:checked={darkMode} label="Dark mode" />
  <Switch checked={false} disabled label="Switch disabled" />
</div>`;let x=n(Je([])),k=n(!1);function ke(h){r(x,h?Array.from(h):[],!0)}function Se(h){h.preventDefault(),r(k,!1);const C=h.dataTransfer?.files;C&&r(x,Array.from(C),!0)}const qe=`
<div class="drop-surface" ondragover={(event) => event.preventDefault()} ondragenter={() => (dropActive = true)} ondragleave={() => (dropActive = false)} ondrop={handleDrop} role="region">
  <p class="select-label">Attachments</p>
  <FileUpload multiple accept="image/*" onchange={(files) => handleFileChange(files)} />
  <p>Drag files here or use the button.</p>
</div>
<ul>
  {#each uploadedFiles as file}
    <li>{file.name}</li>
  {/each}
</ul>`;Xe(he,{eyebrow:"Component Demos",get title(){return D.data.metadata.title},get description(){return D.data.metadata.description},children:(h,C)=>{var X=ia(),F=oe(X),U=a(i(F),2),H=i(U);ve(H,{label:"Display name",required:!0,helpText:"Shown on profiles and mentions.",get invalid(){return e(J)},errorMessage:"Use at least two characters.",get value(){return e(b)},set value(s){r(b,s,!0)},suffix:s=>{var d=Ee(),o=oe(d);{var v=u=>{He(u,{size:16,"aria-hidden":"true"})},c=m(()=>!e(J)&&e(b).trim().length>=2);ne(o,u=>{e(c)&&u(v)})}f(s,d)},$$slots:{suffix:!0}});var De=a(H,2);{let t=m(()=>!e(me)&&e(G));ve(De,{label:"Contact email",type:"email",placeholder:"you@example.com",get invalid(){return e(t)},errorMessage:"Enter a valid email so recovery links work.",onblur:()=>r(G,!0),get value(){return e(T)},set value(s){r(T,s,!0)}})}l(U);var Te=a(U,4);_(Te,{title:"TextField usage",description:"Snippet mirrors the bindings powering this section.",code:be}),l(F);var M=a(F,2),Y=a(i(M),4);Ye(Y,{id:"bio-field",get rows(){return e(L)},maxlength:K,placeholder:"Share what admins should know…",get value(){return e(y)},set value(t){r(y,t,!0)}});var R=a(Y,2),z=i(R),Ae=i(z);l(z);var Z=a(z,2),Ce=i(Z);l(Z),l(R);var Fe=a(R,4);_(Fe,{title:"Auto-resize TextArea",description:"Rows derive from the same derived store used by the live textarea.",code:_e}),l(M);var N=a(M,2),P=a(i(N),2),$=i(P),Ue=a(i($),2);Oe(Ue,{id:"visibility-select",placeholder:"Pick visibility",get options(){return we},get value(){return e(V)},set value(t){r(V,t,!0)}}),l($);var ee=a($,2),Me=a(i(ee),2);de(Me,16,()=>["public","followers","private"],t=>t,(t,s)=>{var d=ea(),o=i(d);Ve(o);var v,c=a(o,2);let u;var S=i(c,!0);l(c),l(d),E(()=>{v!==(v=s)&&(o.value=(o.__value=s)??""),u=ce(c,1,"svelte-109fpqf",null,u,{active:e(A)===s}),g(S,s)}),We(fe,[],o,()=>e(A),B=>r(A,B)),f(t,d)}),l(ee),l(P);var Re=a(P,4);_(Re,{title:"Select + radio",description:"Native radio inputs pair with Greater Select for full coverage.",code:ye}),l(N);var j=a(N,2),I=a(i(j),2),ae=i(I);pe(ae,{label:"Release newsletter",get checked(){return e(O)},set checked(t){r(O,t,!0)}});var te=a(ae,2);pe(te,{label:"Join beta",get checked(){return e(Q)},set checked(t){r(Q,t,!0)}});var le=a(te,2);ue(le,{label:"Dark mode",get checked(){return e(W)},set checked(t){r(W,t,!0)}});var ze=a(le,2);ue(ze,{checked:!1,disabled:!0,label:"Switch disabled"}),l(I);var Ne=a(I,4);_(Ne,{title:"Checkbox + Switch",description:"Live bindings keep snippet parity.",code:xe}),l(j);var ie=a(j,2),p=a(i(ie),2);let se;var Pe=a(i(p),2);Qe(Pe,{multiple:!0,accept:"image/*",onchange:ke}),Le(2),l(p);var re=a(p,2);{var $e=t=>{var s=ta();de(s,21,()=>e(x),d=>d.name,(d,o)=>{var v=aa(),c=i(v),u=i(c,!0);l(c);var S=a(c,2),B=i(S);l(S),l(v),E(Be=>{g(u,e(o).name),g(B,`${Be??""} KB · ${(e(o).type||"Unknown type")??""}`)},[()=>Math.round(e(o).size/1024)]),f(d,v)}),l(s),f(t,s)},je=t=>{var s=la();f(t,s)};ne(re,t=>{e(x).length>0?t($e):t(je,!1)})}var Ie=a(re,2);_(Ie,{title:"Drag surface + FileUpload",description:"Drop zone delegates to FileUpload so uploads continue to flow through the published component.",code:qe}),l(ie),E(()=>{g(Ae,`${e(L)??""} rows`),g(Ce,`${e(ge)??""} characters left`),se=ce(p,1,"drop-surface svelte-109fpqf",null,se,{active:e(k)})}),q("dragover",p,t=>t.preventDefault()),q("dragenter",p,()=>r(k,!0)),q("dragleave",p,()=>r(k,!1)),q("drop",p,Se),f(h,X)},$$slots:{default:!0}}),Ke()}export{ba as component,ma as universal};
