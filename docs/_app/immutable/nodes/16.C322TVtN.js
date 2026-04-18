import{D as e,G as t,T as n,Y as r,q as i,ut as a,v as o,z as s}from"../chunks/Bov5pycq.js";import"../chunks/Cs5QDfgy.js";import"../chunks/Bq1ElFeL.js";import{t as c}from"../chunks/D7myQBsm.js";var l=e(`<meta name="description" content="Accessibility best practices and built-in WCAG support in Greater Components."/>`),u=e(`<article class="guide-page"><header><p class="eyebrow">Guide</p> <h1>Accessibility</h1> <p class="lead">Greater Components is designed to be accessible by default. Components ship with keyboard
			navigation, ARIA attributes, and sensible focus management.</p></header> <section><h2>Keyboard navigation</h2> <p>Interactive components (menus, modals, tabs) include keyboard behavior out of the box. Verify
			that your app wiring doesn’t break focus order and that clickable wrappers include appropriate
			labels.</p></section> <section><h2>Testing with axe</h2> <p>Use the testing helpers package to run accessibility checks in component tests.</p> <!></section></article>`);function d(e){var d=u();o(`1d8i4ob`,e=>{var r=l();s(()=>{t.title=`Accessibility Guide - Greater Components`}),n(e,r)});var f=r(i(d),4);c(r(i(f),4),{language:`typescript`,code:`import { test, expect } from 'vitest';
import { render, axe } from '@equaltoai/greater-components/testing';
import { Button } from '@equaltoai/greater-components/primitives';

test('button has no a11y violations', async () => {
  const { container } = render(Button, { props: { variant: 'solid' } });
  await expect(await axe(container)).toHaveNoViolations();
});`}),a(f),a(d),n(e,d)}export{d as component};