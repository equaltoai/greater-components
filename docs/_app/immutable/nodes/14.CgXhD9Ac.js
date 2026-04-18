import{D as e,G as t,H as n,J as r,P as i,S as a,T as o,Y as s,c,q as l,ut as u,v as d,w as f,z as p}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as m}from"../chunks/D7myQBsm.js";import{n as h,t as g}from"../chunks/6XEBy_O6.js";import{t as _}from"../chunks/BZWRhQF3.js";var v=e(`<meta name="description" content="Guidance for the preferences and settings surface powering the /settings playground route."/>`),y=e(`<li><strong><code> </code></strong> </li>`),b=e(`<li> </li>`),x=e(`<li><code> </code> </li>`),S=e(`<section><h2>Packages</h2> <ul></ul></section> <section><h2>ThemeSwitcher props</h2> <!></section> <section><h2>Usage snippet</h2> <!></section> <section><h2>Accessibility</h2> <!></section> <section><h2>Performance notes</h2> <ul></ul></section> <section><h2>Testing references</h2> <ul></ul></section>`,1);function C(e){let C=[{name:`variant`,type:`'compact' | 'full'`,default:`'compact'`,description:`Determines whether ThemeSwitcher renders the dropdown (compact) or full control grid.`},{name:`showAdvanced`,type:`boolean`,default:`false`,description:`Toggles density/font/motion controls. Enabled inside the settings app.`},{name:`value`,type:`'light' | 'dark' | 'high-contrast' | 'auto'`,description:`Optional controlled color scheme. When omitted, component syncs with preferencesStore.`},{name:`onThemeChange`,type:`(theme: ColorScheme) => void`,description:`Callback invoked when a new scheme is selected (used to persist to local settings).`}],w=[{name:`@equaltoai/greater-components-primitives`,detail:`ThemeSwitcher, Button, Switch, Select, TextField, TextArea components driving the UI.`},{name:`@equaltoai/greater-components-primitives/preferencesStore`,detail:`Shared store powering ThemeProvider + preview cards.`},{name:`@equaltoai/greater-components-social`,detail:`StatusCard + notification snippets used in the preview column.`},{name:`apps/playground/src/lib/stores/storage.ts`,detail:`LocalStorage helpers (loadPersistedState/persistState) reused by multiple demos.`}],T={wcagLevel:`AA`,keyboardNav:!0,screenReader:!0,colorContrast:!0,focusManagement:!0,ariaSupport:!0,reducedMotion:!0,notes:[`ThemeSwitcher radio buttons/tiles are fully tabbable and reflect current scheme via aria-checked.`,`Digest select + account inputs use explicit <label> controls for screen reader compatibility.`,`Preview column exposes aria-live="polite" so settings changes are announced as state summaries.`,`Saved toast (<code>aria-live</code>) confirms persistence without intrusive modals.`],axeScore:100},E=["All preference writes go through `persistState`, keeping the preview reactive without extra fetches.",`Digest/density selects use native <select> for keyboard + mobile ergonomics.`,`Privacy + notification switches mutate Svelte state only; no timers or network chatter.`,`Preview region recomputes at most once per 800ms via interval throttle inside the route.`],D=[{label:`packages/testing/tests/demo/settings.spec.ts`,detail:`Covers select-based interactions and toast announcements.`},{label:`apps/playground/src/lib/stores/storage.test.ts`,detail:`Unit tests validating serialization/SSR fallbacks for loadPersistedState and persistState.`}];d(`n75x2l`,e=>{var n=v();p(()=>{t.title=`Settings Demo Documentation - Greater Components`}),o(e,n)}),_(e,{eyebrow:`Demo Suite`,title:`Settings experience`,description:`Theme controls, privacy toggles, digest preferences, and account editors stitched together with shared stores.`,children:(e,t)=>{var d=S(),p=r(d),_=s(l(p),2);a(_,5,()=>w,e=>e.name,(e,t)=>{var r=y(),a=l(r),c=l(a),d=l(c,!0);u(c),u(a);var p=s(a);u(r),n(()=>{f(d,i(t).name),f(p,` — ${i(t).detail??``}`)}),o(e,r)}),u(_),u(p);var v=s(p,2);h(s(l(v),2),{get props(){return C}}),u(v);var O=s(v,2);m(s(l(O),2),{language:`svelte`,code:`<script lang="ts">
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
</ThemeProvider>`}),u(O);var k=s(O,2);g(s(l(k),2),c(()=>T)),u(k);var A=s(k,2),j=s(l(A),2);a(j,7,()=>E,(e,t)=>`${t}-${e}`,(e,t)=>{var r=b(),a=l(r,!0);u(r),n(()=>f(a,i(t))),o(e,r)}),u(j),u(A);var M=s(A,2),N=s(l(M),2);a(N,5,()=>D,e=>e.label,(e,t)=>{var r=x(),a=l(r),c=l(a,!0);u(a);var d=s(a);u(r),n(()=>{f(c,i(t).label),f(d,` — ${i(t).detail??``}`)}),o(e,r)}),u(N),u(M),o(e,d)},$$slots:{default:!0}})}export{C as component};