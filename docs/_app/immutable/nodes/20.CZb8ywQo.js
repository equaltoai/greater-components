import"../chunks/DsnmJJEf.js";import"../chunks/ttMDPgN5.js";import{f as p,a as i,e as f,s as e,c as r,$ as g,r as a}from"../chunks/CAqKBpMZ.js";import{h}from"../chunks/BGh-p3ai.js";import{C as n}from"../chunks/BVft0-qW.js";var y=p('<meta name="description" content="TypeScript configuration and type-safe usage patterns for Greater Components."/>'),v=p(`<article class="guide-page"><header><p class="eyebrow">Guide</p> <h1>TypeScript</h1> <p class="lead">Greater Components ships TypeScript types for components, utilities, and adapters. Use modern
			bundler module resolution and import types alongside values.</p></header> <section><h2>Recommended tsconfig</h2> <!></section> <section><h2>Type imports</h2> <!></section></article>`);function _(m){var t=v();h("1o7wrei",d=>{var u=y();f(()=>{g.title="TypeScript Guide - Greater Components"}),i(d,u)});var o=e(r(t),2),c=e(r(o),2);n(c,{language:"json",title:"tsconfig.json",code:`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`}),a(o);var s=e(o,2),l=e(r(s),2);n(l,{language:"typescript",code:`import { Button, type ButtonProps } from '@equaltoai/greater-components/primitives';
import type { ThemeConfig } from '@equaltoai/greater-components/tokens';`}),a(s),a(t),i(m,t)}export{_ as component};
