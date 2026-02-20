import{a as n,f as p,s as c}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as M,f as N,s as t,c as s,$ as O,r as e,d as w,g as l}from"../chunks/HviJt0eG.js";import{e as y}from"../chunks/D809QS3d.js";import{h as R}from"../chunks/BIESLWc2.js";import{s as z}from"../chunks/CybMBw0E.js";import{D as F}from"../chunks/vGJJHm7z.js";import{P as I,A as W}from"../chunks/D3BlL-1y.js";import{C as j}from"../chunks/D4U67pPq.js";var H=p('<meta name="description" content="Guidance for the preferences and settings surface powering the /settings playground route."/>'),J=p("<li><strong><code> </code></strong> </li>"),Q=p("<li> </li>"),V=p("<li><code> </code> </li>"),X=p("<section><h2>Packages</h2> <ul></ul></section> <section><h2>ThemeSwitcher props</h2> <!></section> <section><h2>Usage snippet</h2> <!></section> <section><h2>Accessibility</h2> <!></section> <section><h2>Performance notes</h2> <ul></ul></section> <section><h2>Testing references</h2> <ul></ul></section>",1);function ne(k){const C=[{name:"variant",type:"'compact' | 'full'",default:"'compact'",description:"Determines whether ThemeSwitcher renders the dropdown (compact) or full control grid."},{name:"showAdvanced",type:"boolean",default:"false",description:"Toggles density/font/motion controls. Enabled inside the settings app."},{name:"value",type:"'light' | 'dark' | 'high-contrast' | 'auto'",description:"Optional controlled color scheme. When omitted, component syncs with preferencesStore."},{name:"onThemeChange",type:"(theme: ColorScheme) => void",description:"Callback invoked when a new scheme is selected (used to persist to local settings)."}],A=[{name:"@equaltoai/greater-components-primitives",detail:"ThemeSwitcher, Button, Switch, Select, TextField, TextArea components driving the UI."},{name:"@equaltoai/greater-components-primitives/preferencesStore",detail:"Shared store powering ThemeProvider + preview cards."},{name:"@equaltoai/greater-components-social",detail:"StatusCard + notification snippets used in the preview column."},{name:"apps/playground/src/lib/stores/storage.ts",detail:"LocalStorage helpers (loadPersistedState/persistState) reused by multiple demos."}],D=`<script lang="ts">
  import {
    Button,
    ThemeProvider,
    ThemeSwitcher,
    Select,
    Switch,
    preferencesStore
  } from '@equaltoai/greater-components-primitives';
  import { loadPersistedState, persistState } from '$lib/stores/storage';

  const settingsStorageKey = 'playground-settings-demo';
  let settings = $state(loadPersistedState(settingsStorageKey, defaultSettings));

  function updateSettings(section, partial) {
    settings = { ...settings, [section]: { ...settings[section], ...partial } };
    persistState(settingsStorageKey, settings);
  }
<\/script>

<ThemeProvider>
  <ThemeSwitcher
    variant="full"
    showAdvanced
    value={settings.appearance.theme}
    onThemeChange={(theme) => updateSettings('appearance', { theme })}
  />

  <label for="density-select">Density</label>
  <Select
    id="density-select"
    options={densityOptions}
    value={settings.appearance.density}
    onchange={(value) => updateSettings('appearance', { density: value })}
  />

  <div class="toggle-row">
    <span>Email alerts</span>
    <Switch checked={settings.notifications.email} onclick={() => toggleNotification('email')} />
  </div>
</ThemeProvider>`,q={wcagLevel:"AA",keyboardNav:!0,screenReader:!0,colorContrast:!0,focusManagement:!0,ariaSupport:!0,reducedMotion:!0,notes:["ThemeSwitcher radio buttons/tiles are fully tabbable and reflect current scheme via aria-checked.","Digest select + account inputs use explicit <label> controls for screen reader compatibility.",'Preview column exposes aria-live="polite" so settings changes are announced as state summaries.',"Saved toast (<code>aria-live</code>) confirms persistence without intrusive modals."],axeScore:100},E=["All preference writes go through `persistState`, keeping the preview reactive without extra fetches.","Digest/density selects use native <select> for keyboard + mobile ergonomics.","Privacy + notification switches mutate Svelte state only; no timers or network chatter.","Preview region recomputes at most once per 800ms via interval throttle inside the route."],K=[{label:"packages/testing/tests/demo/settings.spec.ts",detail:"Covers select-based interactions and toast announcements."},{label:"apps/playground/src/lib/stores/storage.test.ts",detail:"Unit tests validating serialization/SSR fallbacks for loadPersistedState and persistState."}];R("n75x2l",m=>{var b=H();M(()=>{O.title="Settings Demo Documentation - Greater Components"}),n(m,b)}),F(k,{eyebrow:"Demo Suite",title:"Settings experience",description:"Theme controls, privacy toggles, digest preferences, and account editors stitched together with shared stores.",children:(m,b)=>{var _=X(),g=N(_),P=t(s(g),2);y(P,5,()=>A,a=>a.name,(a,r)=>{var o=J(),i=s(o),d=s(i),S=s(d,!0);e(d),e(i);var L=t(i);e(o),w(()=>{c(S,l(r).name),c(L,` — ${l(r).detail??""}`)}),n(a,o)}),e(P),e(g);var h=t(g,2),U=t(s(h),2);I(U,{get props(){return C}}),e(h);var u=t(h,2),B=t(s(u),2);j(B,{language:"svelte",code:D}),e(u);var v=t(u,2),G=t(s(v),2);W(G,z(()=>q)),e(v);var f=t(v,2),T=t(s(f),2);y(T,7,()=>E,(a,r)=>`${r}-${a}`,(a,r)=>{var o=Q(),i=s(o,!0);e(o),w(()=>c(i,l(r))),n(a,o)}),e(T),e(f);var x=t(f,2),$=t(s(x),2);y($,5,()=>K,a=>a.label,(a,r)=>{var o=V(),i=s(o),d=s(i,!0);e(i);var S=t(i);e(o),w(()=>{c(d,l(r).label),c(S,` — ${l(r).detail??""}`)}),n(a,o)}),e($),e(x),n(m,_)},$$slots:{default:!0}})}export{ne as component};
