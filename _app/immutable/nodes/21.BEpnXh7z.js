import{j as q,a as h,c as Ke,b as _,s as m}from"../chunks/bxqCr151.js";import{p as Le,e as d,K as Ee,f as oe,s as a,c as i,d as r,g as e,t as K,u as b,a as Ge,r as l,L as Je}from"../chunks/CUHjCY3l.js";import{i as ne}from"../chunks/Dsp-4A1p.js";import{e as de,s as ce,r as Ve}from"../chunks/BXiGdZtt.js";import{d as Oe,C as pe,F as We,e as Xe}from"../chunks/CziThUO9.js";import{D as He}from"../chunks/GXsK1t_P.js";import{C as g}from"../chunks/Bcc-fEB6.js";import{C as Qe}from"../chunks/CORlyOCd.js";import{T as ve}from"../chunks/yHzhh1LT.js";import{T as Ye}from"../chunks/C1xUrAJj.js";import{S as ue}from"../chunks/BNIkjncQ.js";const Ze=(()=>({metadata:{slug:"forms-demo",title:"Form Components Demo",description:"Text inputs, selects, switches, checkboxes, radios, and uploads pulled from the production primitives build.",sections:["Text inputs","Selections","Toggles & switches","File uploads"]}})),ma=Object.freeze(Object.defineProperty({__proto__:null,load:Ze},Symbol.toStringTag,{value:"Module"}));var ea=_('<label class="svelte-109fpqf"><input type="radio" name="audience" class="svelte-109fpqf"/> <span> </span></label>'),aa=_('<li class="svelte-109fpqf"><strong> </strong> <span> </span></li>'),ta=_('<ul class="file-list svelte-109fpqf"></ul>'),la=_('<p class="placeholder svelte-109fpqf">No files selected.</p>'),ia=_(`<section class="demo-section svelte-109fpqf"><header><h2>Text Inputs &amp; Validation</h2> <p>Showcases helper text, inline errors, prefix icons, and required indicators.</p></header> <div class="text-inputs svelte-109fpqf"><!> <!></div> <p class="a11y-tip svelte-109fpqf">Accessible pattern: help text is tied via aria-describedby and errors announce with
			role="alert" when invalid.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>TextArea Auto-Resize</h2> <p>Dynamic rows and character counting keep longer bios readable without new dependencies.</p></header> <label class="textarea-label svelte-109fpqf" for="bio-field">Bio</label> <!> <div class="character-meta svelte-109fpqf"><span> </span> <span aria-live="polite"> </span></div> <p class="a11y-tip svelte-109fpqf">Tip: keep aria-live polite for counters so screen readers announce only when values change.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Select &amp; Radio Inputs</h2> <p>Placeholder guidance, disabled options, and a native radio group with keyboard hints.</p></header> <div class="choice-grid svelte-109fpqf"><div class="select-field svelte-109fpqf"><label class="select-label svelte-109fpqf" for="visibility-select">Default visibility</label> <!></div> <fieldset class="radio-group svelte-109fpqf" role="radiogroup" aria-label="Audience"><legend>Audience</legend> <!></fieldset></div> <p class="a11y-tip svelte-109fpqf">Keyboard: Up/Down cycles radios while typing the first letter jumps via native typeahead.
			Disabled select options remain unreachable.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>Toggles &amp; Switches</h2> <p>Mixed checkbox and switch controls show indies vs binary preferences.</p></header> <div class="toggle-stack svelte-109fpqf"><!> <!> <!> <!></div> <p class="a11y-tip svelte-109fpqf">Space toggles the focused checkbox or switch; disabled switches remove themselves from the tab
			order.</p> <!></section> <section class="demo-section svelte-109fpqf"><header><h2>File Upload &amp; Drag-and-Drop</h2> <p>Wrap the published FileUpload control with a drag surface for richer UX while keeping drag
				events in user land.</p></header> <div aria-label="Upload files" role="region"><p class="select-label svelte-109fpqf">Attachments</p> <!> <p>Drag files here or use the button. Up to 4 files.</p></div> <!> <!></section>`,1);function ba(he,D){Le(D,!0);const fe=[];let f=d(""),T=d(""),L=d(!1);const E=b(()=>()=>e(f).trim().length>0&&e(f).trim().length<2),me=b(()=>()=>/.+@.+\..+/.test(e(T))),be=`
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
</div>`;let w=d("Greater Components ships with strong defaults.");const G=280,ge=b(()=>()=>Math.max(0,G-e(w).length)),J=b(()=>()=>Math.min(10,Math.max(4,Math.ceil(e(w).length/60)))),_e=`
<label for="bio-field">Bio</label>
<TextArea
  id="bio-field"
  bind:value={bio}
  rows={dynamicRows}
  maxlength={bioLimit}
  placeholder="Share what admins should know…"
/>
<p aria-live="polite">{remaining} characters left</p>`,we=[{value:"",label:"Select a region"},{value:"us",label:"United States"},{value:"uk",label:"United Kingdom"},{value:"br",label:"Brazil",disabled:!0},{value:"de",label:"Germany"},{value:"jp",label:"Japan"}];let V=d(""),A=d("public");const ye=`
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
</fieldset>`;let O=d(!0),W=d(!1),X=d(!0);const xe=`
<div class="toggle-stack">
  <Checkbox bind:checked={newsletter} label="Release newsletter" />
  <Checkbox bind:checked={betaAccess} label="Join beta" />
  <Switch bind:checked={darkMode} label="Dark mode" />
  <Switch checked={false} disabled label="Switch disabled" />
</div>`;let y=d(Ee([])),x=d(!1);function ke(u){r(y,u?Array.from(u):[],!0)}function Se(u){u.preventDefault(),r(x,!1);const C=u.dataTransfer?.files;C&&r(y,Array.from(C),!0)}const qe=`
<div class="drop-surface" ondragover={(event) => event.preventDefault()} ondragenter={() => (dropActive = true)} ondragleave={() => (dropActive = false)} ondrop={handleDrop} role="region">
  <p class="select-label">Attachments</p>
  <FileUpload multiple accept="image/*" onchange={(files) => handleFileChange(files)} />
  <p>Drag files here or use the button.</p>
</div>
<ul>
  {#each uploadedFiles as file}
    <li>{file.name}</li>
  {/each}
</ul>`;He(he,{eyebrow:"Component Demos",get title(){return D.data.metadata.title},get description(){return D.data.metadata.description},children:(u,C)=>{var H=ia(),F=oe(H),U=a(i(F),2),Q=i(U);ve(Q,{label:"Display name",required:!0,helpText:"Shown on profiles and mentions.",get invalid(){return e(E)},errorMessage:"Use at least two characters.",get value(){return e(f)},set value(s){r(f,s,!0)},suffix:s=>{var c=Ke(),o=oe(c);{var v=n=>{Qe(n,{size:16,"aria-hidden":"true"})};ne(o,n=>{!e(E)&&e(f).trim().length>=2&&n(v)})}h(s,c)},$$slots:{suffix:!0}});var De=a(Q,2);{let t=b(()=>!e(me)&&e(L));ve(De,{label:"Contact email",type:"email",placeholder:"you@example.com",get invalid(){return e(t)},errorMessage:"Enter a valid email so recovery links work.",onblur:()=>r(L,!0),get value(){return e(T)},set value(s){r(T,s,!0)}})}l(U);var Te=a(U,4);g(Te,{title:"TextField usage",description:"Snippet mirrors the bindings powering this section.",code:be}),l(F);var M=a(F,2),Y=a(i(M),4);Ye(Y,{id:"bio-field",get rows(){return e(J)},maxlength:G,placeholder:"Share what admins should know…",get value(){return e(w)},set value(t){r(w,t,!0)}});var z=a(Y,2),R=i(z),Ae=i(R);l(R);var Z=a(R,2),Ce=i(Z);l(Z),l(z);var Fe=a(z,4);g(Fe,{title:"Auto-resize TextArea",description:"Rows derive from the same derived store used by the live textarea.",code:_e}),l(M);var N=a(M,2),P=a(i(N),2),$=i(P),Ue=a(i($),2);Oe(Ue,{id:"visibility-select",placeholder:"Pick visibility",get options(){return we},get value(){return e(V)},set value(t){r(V,t,!0)}}),l($);var ee=a($,2),Me=a(i(ee),2);de(Me,16,()=>["public","followers","private"],t=>t,(t,s)=>{var c=ea(),o=i(c);Ve(o);var v,n=a(o,2);let k;var S=i(n,!0);l(n),l(c),K(()=>{v!==(v=s)&&(o.value=(o.__value=s)??""),k=ce(n,1,"svelte-109fpqf",null,k,{active:e(A)===s}),m(S,s)}),Xe(fe,[],o,()=>e(A),B=>r(A,B)),h(t,c)}),l(ee),l(P);var ze=a(P,4);g(ze,{title:"Select + radio",description:"Native radio inputs pair with Greater Select for full coverage.",code:ye}),l(N);var j=a(N,2),I=a(i(j),2),ae=i(I);pe(ae,{label:"Release newsletter",get checked(){return e(O)},set checked(t){r(O,t,!0)}});var te=a(ae,2);pe(te,{label:"Join beta",get checked(){return e(W)},set checked(t){r(W,t,!0)}});var le=a(te,2);ue(le,{label:"Dark mode",get checked(){return e(X)},set checked(t){r(X,t,!0)}});var Re=a(le,2);ue(Re,{checked:!1,disabled:!0,label:"Switch disabled"}),l(I);var Ne=a(I,4);g(Ne,{title:"Checkbox + Switch",description:"Live bindings keep snippet parity.",code:xe}),l(j);var ie=a(j,2),p=a(i(ie),2);let se;var Pe=a(i(p),2);We(Pe,{multiple:!0,accept:"image/*",onchange:ke}),Je(2),l(p);var re=a(p,2);{var $e=t=>{var s=ta();de(s,21,()=>e(y),c=>c.name,(c,o)=>{var v=aa(),n=i(v),k=i(n,!0);l(n);var S=a(n,2),B=i(S);l(S),l(v),K(Be=>{m(k,e(o).name),m(B,`${Be??""} KB · ${(e(o).type||"Unknown type")??""}`)},[()=>Math.round(e(o).size/1024)]),h(c,v)}),l(s),h(t,s)},je=t=>{var s=la();h(t,s)};ne(re,t=>{e(y).length>0?t($e):t(je,!1)})}var Ie=a(re,2);g(Ie,{title:"Drag surface + FileUpload",description:"Drop zone delegates to FileUpload so uploads continue to flow through the published component.",code:qe}),l(ie),K(()=>{m(Ae,`${e(J)??""} rows`),m(Ce,`${e(ge)??""} characters left`),se=ce(p,1,"drop-surface svelte-109fpqf",null,se,{active:e(x)})}),q("dragover",p,t=>t.preventDefault()),q("dragenter",p,()=>r(x,!0)),q("dragleave",p,()=>r(x,!1)),q("drop",p,Se),h(u,H)},$$slots:{default:!0}}),Ge()}export{ba as component,ma as universal};
