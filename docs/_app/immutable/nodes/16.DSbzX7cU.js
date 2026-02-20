import{a,f as r}from"../chunks/BykCGqtP.js";import"../chunks/YKgMSjAh.js";import{e as l,s as o,c as i,$ as d,r as s}from"../chunks/HviJt0eG.js";import{h as b}from"../chunks/BIESLWc2.js";import{C as h}from"../chunks/D4U67pPq.js";var u=r('<meta name="description" content="Accessibility best practices and built-in WCAG support in Greater Components."/>'),f=r(`<article class="guide-page"><header><p class="eyebrow">Guide</p> <h1>Accessibility</h1> <p class="lead">Greater Components is designed to be accessible by default. Components ship with keyboard
			navigation, ARIA attributes, and sensible focus management.</p></header> <section><h2>Keyboard navigation</h2> <p>Interactive components (menus, modals, tabs) include keyboard behavior out of the box. Verify
			that your app wiring doesn’t break focus order and that clickable wrappers include appropriate
			labels.</p></section> <section><h2>Testing with axe</h2> <p>Use the testing helpers package to run accessibility checks in component tests.</p> <!></section></article>`);function C(n){var e=f();b("1d8i4ob",p=>{var m=u();l(()=>{d.title="Accessibility Guide - Greater Components"}),a(p,m)});var t=o(i(e),4),c=o(i(t),4);h(c,{language:"typescript",code:`import { test, expect } from 'vitest';
import { render, axe } from '@equaltoai/greater-components/testing';
import { Button } from '@equaltoai/greater-components/primitives';

test('button has no a11y violations', async () => {
  const { container } = render(Button, { props: { variant: 'solid' } });
  await expect(await axe(container)).toHaveNoViolations();
});`}),s(t),s(e),a(n,e)}export{C as component};
