import{b as h,a as $}from"../chunks/CPFvdcWc.js";import{s as i,c as s,f as F,d as j,g as k,e as q,r as a}from"../chunks/BBtdsj1g.js";import{c as r}from"../chunks/B9pSXMd2.js";import{D as z}from"../chunks/Cn_CQSLX.js";import{C as G}from"../chunks/DmSFjkjm.js";import{A as o}from"../chunks/DWpTJH0B.js";import{p as I}from"../chunks/CuHcE9Vg.js";var J=h('<!> <div class="header-content svelte-18wmpo2"><!> <div class="info svelte-18wmpo2"><!> <!> <!></div> <!> <div class="actions svelte-18wmpo2"><!> <!></div></div> <!>',1),K=h('<section class="demo-section"><div class="demo-container svelte-18wmpo2"><div class="profile-wrapper svelte-18wmpo2"><!></div></div> <!></section>');function Z(E){let f=q(!1);const S=`
<ArtistProfile.Root artist={profileData} isOwnProfile={true}>
  <ArtistProfile.HeroBanner />
  <ArtistProfile.Avatar />
  <ArtistProfile.Name />
  <ArtistProfile.Badges />
  <ArtistProfile.Statement />
  <ArtistProfile.Stats />
  <ArtistProfile.Actions />
  <ArtistProfile.Sections />
</ArtistProfile.Root>`;z(E,{eyebrow:"Artist Face / Profile",title:"Artist Profile",description:"Portfolio-centric profile view with editable sections.",children:(b,L)=>{var n=K(),l=s(n),c=s(l),B=s(c);r(B,()=>o.Root,(x,R)=>{R(x,{get artist(){return I},isOwnProfile:!0,children:(C,M)=>{var m=J(),p=F(m);r(p,()=>o.HeroBanner,(t,e)=>{e(t,{})});var d=i(p,2),_=s(d);r(_,()=>o.Avatar,(t,e)=>{e(t,{})});var v=i(_,2),P=s(v);r(P,()=>o.Name,(t,e)=>{e(t,{})});var A=i(P,2);r(A,()=>o.Badges,(t,e)=>{e(t,{})});var H=i(A,2);r(H,()=>o.Statement,(t,e)=>{e(t,{})}),a(v);var g=i(v,2);r(g,()=>o.Stats,(t,e)=>{e(t,{})});var u=i(g,2),w=s(u);r(w,()=>o.Actions,(t,e)=>{e(t,{})});var N=i(w,2);r(N,()=>o.Edit,(t,e)=>{e(t,{get isEditing(){return k(f)},set isEditing(y){j(f,y,!0)}})}),a(u),a(d);var O=i(d,2);r(O,()=>o.Sections,(t,e)=>{e(t,{})}),$(C,m)},$$slots:{default:!0}})}),a(c),a(l);var D=i(l,2);G(D,{code:S,language:"svelte"}),a(n),$(b,n)},$$slots:{default:!0}})}export{Z as component};
