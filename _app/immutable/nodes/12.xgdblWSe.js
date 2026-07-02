import{Dt as e,I as t,K as n,R as r,at as i,ft as a,k as o,ot as s,st as c,ut as l}from"../chunks/BWt3wCjf.js";import"../chunks/YnsNBmtB.js";import{t as u}from"../chunks/RYgqtqyS.js";import{t as d}from"../chunks/DjMfVXn_.js";import{t as f}from"../chunks/BsLbMfCH.js";import{r as p}from"../chunks/BHJrRB7h.js";var m=r(`<!> <div class="header-content svelte-18wmpo2"><!> <div class="info svelte-18wmpo2"><!> <!> <!></div> <!> <div class="actions svelte-18wmpo2"><!> <!></div></div> <!>`,1),h=r(`<section class="demo-section"><div class="demo-container svelte-18wmpo2"><div class="profile-wrapper svelte-18wmpo2"><!></div></div> <!></section>`);function g(r){let g=a(!1);u(r,{eyebrow:`Artist Face / Profile`,title:`Artist Profile`,description:`Portfolio-centric profile view with editable sections.`,children:(r,a)=>{var u=h(),_=i(u),v=i(_);o(i(v),()=>f.Root,(r,a)=>{a(r,{get artist(){return p},isOwnProfile:!0,children:(r,a)=>{var u=m(),d=s(u);o(d,()=>f.HeroBanner,(e,t)=>{t(e,{})});var p=c(d,2),h=i(p);o(h,()=>f.Avatar,(e,t)=>{t(e,{})});var _=c(h,2),v=i(_);o(v,()=>f.Name,(e,t)=>{t(e,{})});var y=c(v,2);o(y,()=>f.Badges,(e,t)=>{t(e,{})}),o(c(y,2),()=>f.Statement,(e,t)=>{t(e,{})}),e(_);var b=c(_,2);o(b,()=>f.Stats,(e,t)=>{t(e,{})});var x=c(b,2),S=i(x);o(S,()=>f.Actions,(e,t)=>{t(e,{})}),o(c(S,2),()=>f.Edit,(e,t)=>{t(e,{get isEditing(){return n(g)},set isEditing(e){l(g,e,!0)}})}),e(x),e(p),o(c(p,2),()=>f.Sections,(e,t)=>{t(e,{})}),t(r,u)},$$slots:{default:!0}})}),e(v),e(_),d(c(_,2),{code:`
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