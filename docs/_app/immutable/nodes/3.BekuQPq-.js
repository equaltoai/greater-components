import{D as e,G as t,T as n,Y as r,q as i,ut as a,v as o,z as s}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as c}from"../chunks/D7myQBsm.js";var l=e(`<meta name="description" content="Transport, GraphQL adapter, and mappers for Lesser integration."/>`),u=e(`<article class="guide-page"><header><p class="eyebrow">API Reference</p> <h1>Adapters</h1> <p class="lead">The adapters package provides the Lesser GraphQL adapter plus transport primitives, reactive
			stores, and payload mappers.</p></header> <section><h2>LesserGraphQLAdapter</h2> <!></section></article>`);function d(e){var d=u();o(`xq2i6y`,e=>{var r=l();s(()=>{t.title=`Adapters API - Greater Components`}),n(e,r)});var f=r(i(d),2);c(r(i(f),2),{language:`typescript`,code:`import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';

const adapter = new LesserGraphQLAdapter({
  httpEndpoint: 'https://your-instance.social/graphql',
  wsEndpoint: 'wss://your-instance.social/graphql',
  token: 'your-token',
});`}),a(f),a(d),n(e,d)}export{d as component};