import{D as e,G as t,T as n,Y as r,q as i,ut as a,v as o,z as s}from"../chunks/Fh0I5CkL.js";import"../chunks/xihTtKlq.js";import"../chunks/ClL9uNOJ.js";import{t as c}from"../chunks/D00RY0FZ.js";var l=e(`<meta name="description" content="TypeScript configuration and type-safe usage patterns for Greater Components."/>`),u=e(`<article class="guide-page"><header><p class="eyebrow">Guide</p> <h1>TypeScript</h1> <p class="lead">Greater Components ships TypeScript types for components, utilities, and adapters. Use modern
			bundler module resolution and import types alongside values.</p></header> <section><h2>Recommended tsconfig</h2> <!></section> <section><h2>Type imports</h2> <!></section></article>`);function d(e){var d=u();o(`1o7wrei`,e=>{var r=l();s(()=>{t.title=`TypeScript Guide - Greater Components`}),n(e,r)});var f=r(i(d),2),p=r(i(f),2);c(p,{language:`json`,title:`tsconfig.json`,code:`{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["svelte"]
  }
}`}),a(f);var m=r(f,2),h=r(i(m),2);c(h,{language:`typescript`,code:`import { Button, type ButtonProps } from '@equaltoai/greater-components/primitives';
import type { ThemeConfig } from '@equaltoai/greater-components/tokens';`}),a(m),a(d),n(e,d)}export{d as component};