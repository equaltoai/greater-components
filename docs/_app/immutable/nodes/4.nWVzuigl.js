import{a,f as i}from"../chunks/D4cnu5Tr.js";import"../chunks/DUGlQOFW.js";import{e as l,s as r,c as o,$ as d,r as s}from"../chunks/CWo3Zl3o.js";import{h}from"../chunks/BzXnuaPr.js";import{C as f}from"../chunks/Bp-7xVB_.js";var g=i('<meta name="description" content="Reactive stores and state helpers exported by Greater Components."/>'),v=i(`<article class="guide-page"><header><p class="eyebrow">API Reference</p> <h1>Stores</h1> <p class="lead">For GraphQL-backed timelines and notifications, the adapters package exports reactive stores
			designed to work with Svelte reactivity.</p></header> <section><h2>Example</h2> <!></section></article>`);function w(n){var e=v();h("1uvy7j8",c=>{var m=g();l(()=>{d.title="Stores API - Greater Components"}),a(c,m)});var t=r(o(e),2),p=r(o(t),2);f(p,{language:"typescript",code:`import { createTimelineStore } from '@equaltoai/greater-components/adapters';

const timeline = createTimelineStore({ adapter, timeline: { type: 'home' } });
timeline.subscribe((state) => console.log(state.items.length));
await timeline.refresh();`}),s(t),s(e),a(n,e)}export{w as component};
