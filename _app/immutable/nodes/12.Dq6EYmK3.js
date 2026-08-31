import{Dt as e,I as t,K as n,R as r,at as i,ft as a,k as o,ot as s,st as c,ut as l}from"../chunks/xyBo9fw_.js";import"../chunks/xihTtKlq.js";import{t as u}from"../chunks/Bv4csXnx.js";import{t as d}from"../chunks/C1qIpVBb.js";import{t as f}from"../chunks/BMoWj0v_.js";import{r as p}from"../chunks/DI09e6sK.js";var m=r(`<!> <div class="header-content svelte-18wmpo2"><!> <div class="info svelte-18wmpo2"><!> <!> <!></div> <!> <div class="actions svelte-18wmpo2"><!> <!></div></div> <!>`,1),h=r(`<section class="demo-section"><div class="demo-container svelte-18wmpo2"><div class="profile-wrapper svelte-18wmpo2"><!></div></div> <!></section>`);function g(r){let g=a(!1);u(r,{eyebrow:`Artist Face / Profile`,title:`Artist Profile`,description:`Portfolio-centric profile view with editable sections.`,children:(r,a)=>{var u=h(),_=i(u),v=i(_),y=i(v);o(y,()=>f.Root,(r,a)=>{a(r,{get artist(){return p},isOwnProfile:!0,children:(r,a)=>{var u=m(),d=s(u);o(d,()=>f.HeroBanner,(e,t)=>{t(e,{})});var p=c(d,2),h=i(p);o(h,()=>f.Avatar,(e,t)=>{t(e,{})});var _=c(h,2),v=i(_);o(v,()=>f.Name,(e,t)=>{t(e,{})});var y=c(v,2);o(y,()=>f.Badges,(e,t)=>{t(e,{})});var b=c(y,2);o(b,()=>f.Statement,(e,t)=>{t(e,{})}),e(_);var x=c(_,2);o(x,()=>f.Stats,(e,t)=>{t(e,{})});var S=c(x,2),C=i(S);o(C,()=>f.Actions,(e,t)=>{t(e,{})});var w=c(C,2);o(w,()=>f.Edit,(e,t)=>{t(e,{get isEditing(){return n(g)},set isEditing(e){l(g,e,!0)}})}),e(S),e(p);var T=c(p,2);o(T,()=>f.Sections,(e,t)=>{t(e,{})}),t(r,u)},$$slots:{default:!0}})}),e(v),e(_);var b=c(_,2);d(b,{code:`
<ArtistProfile.Root artist={profileData} isOwnProfile={true}>
  <ArtistProfile.HeroBanner />
  <ArtistProfile.Avatar />
  <ArtistProfile.Name />
  <ArtistProfile.Badges />
  <ArtistProfile.Statement />
  <ArtistProfile.Stats />
  <ArtistProfile.Actions />
  <ArtistProfile.Sections />
</ArtistProfile.Root>`,language:`svelte`}),e(u),t(r,u)},$$slots:{default:!0}})}export{g as component};