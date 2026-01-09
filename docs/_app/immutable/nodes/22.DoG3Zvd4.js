import{f as p,a as i}from"../chunks/CzT4dyct.js";import"../chunks/BftH7mQK.js";import{e as f,s as e,c as r,$ as g,r as a}from"../chunks/DJuQ7L6k.js";import{h}from"../chunks/CuoUuzNj.js";import{C as n}from"../chunks/Bvd2hTFI.js";var y=p('<meta name="description" content="TypeScript configuration and type-safe usage patterns for Greater Components."/>'),v=p(`<article class="guide-page"><header><p class="eyebrow">Guide</p> <h1>TypeScript</h1> <p class="lead">Greater Components ships TypeScript types for components, utilities, and adapters. Use modern
			bundler module resolution and import types alongside values.</p></header> <section><h2>Recommended tsconfig</h2> <!></section> <section><h2>Type imports</h2> <!></section></article>`);function _(m){var t=v();h("1o7wrei",d=>{var u=y();f(()=>{g.title="TypeScript Guide - Greater Components"}),i(d,u)});var o=e(r(t),2),c=e(r(o),2);n(c,{language:"json",title:"tsconfig.json",code:`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`}),a(o);var s=e(o,2),l=e(r(s),2);n(l,{language:"typescript",code:`import { Button, type ButtonProps } from '@equaltoai/greater-components/primitives';
import type { ThemeConfig } from '@equaltoai/greater-components/tokens';`}),a(s),a(t),i(m,t)}export{_ as component};
