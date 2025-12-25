import"../chunks/DsnmJJEf.js";import"../chunks/ttMDPgN5.js";import{f as o,a as r,e as m,s as t,c as s,$ as h,r as p}from"../chunks/CAqKBpMZ.js";import{h as l}from"../chunks/BGh-p3ai.js";import{C as f}from"../chunks/BVft0-qW.js";var g=o('<meta name="description" content="Transport, GraphQL adapter, and mappers for Lesser integration."/>'),L=o(`<article class="guide-page"><header><p class="eyebrow">API Reference</p> <h1>Adapters</h1> <p class="lead">The adapters package provides the Lesser GraphQL adapter plus transport primitives, reactive
			stores, and payload mappers.</p></header> <section><h2>LesserGraphQLAdapter</h2> <!></section></article>`);function Q(n){var e=L();l("xq2i6y",c=>{var d=g();m(()=>{h.title="Adapters API - Greater Components"}),r(c,d)});var a=t(s(e),2),i=t(s(a),2);f(i,{language:"typescript",code:`import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';

const adapter = new LesserGraphQLAdapter({
  httpEndpoint: 'https://your-instance.social/graphql',
  wsEndpoint: 'wss://your-instance.social/graphql',
  token: 'your-token',
});`}),p(a),p(e),r(n,e)}export{Q as component};
