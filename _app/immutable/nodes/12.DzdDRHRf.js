import{I as e,K as t,R as n,Tt as r,at as i,ct as a,it as o,k as s,rt as c,ut as l}from"../chunks/HZEZB441.js";import"../chunks/DW7QIeR-.js";import{t as u}from"../chunks/BrMfcLY_.js";import{t as d}from"../chunks/D4m1vxU5.js";import{t as f}from"../chunks/CDkq3Vl4.js";import{r as p}from"../chunks/BQRZ3Cuv.js";var m=n(`<!> <div class="header-content svelte-18wmpo2"><!> <div class="info svelte-18wmpo2"><!> <!> <!></div> <!> <div class="actions svelte-18wmpo2"><!> <!></div></div> <!>`,1),h=n(`<section class="demo-section"><div class="demo-container svelte-18wmpo2"><div class="profile-wrapper svelte-18wmpo2"><!></div></div> <!></section>`);function g(n){let g=l(!1);u(n,{eyebrow:`Artist Face / Profile`,title:`Artist Profile`,description:`Portfolio-centric profile view with editable sections.`,children:(n,l)=>{var u=h(),_=c(u),v=c(_);s(c(v),()=>f.Root,(n,l)=>{l(n,{get artist(){return p},isOwnProfile:!0,children:(n,l)=>{var u=m(),d=o(u);s(d,()=>f.HeroBanner,(e,t)=>{t(e,{})});var p=i(d,2),h=c(p);s(h,()=>f.Avatar,(e,t)=>{t(e,{})});var _=i(h,2),v=c(_);s(v,()=>f.Name,(e,t)=>{t(e,{})});var y=i(v,2);s(y,()=>f.Badges,(e,t)=>{t(e,{})}),s(i(y,2),()=>f.Statement,(e,t)=>{t(e,{})}),r(_);var b=i(_,2);s(b,()=>f.Stats,(e,t)=>{t(e,{})});var x=i(b,2),S=c(x);s(S,()=>f.Actions,(e,t)=>{t(e,{})}),s(i(S,2),()=>f.Edit,(e,n)=>{n(e,{get isEditing(){return t(g)},set isEditing(e){a(g,e,!0)}})}),r(x),r(p),s(i(p,2),()=>f.Sections,(e,t)=>{t(e,{})}),e(n,u)},$$slots:{default:!0}})}),r(v),r(_),d(i(_,2),{code:`
<ArtistProfile.Root artist={profileData} isOwnProfile={true}>
  <ArtistProfile.HeroBanner />
  <ArtistProfile.Avatar />
  <ArtistProfile.Name />
  <ArtistProfile.Badges />
  <ArtistProfile.Statement />
  <ArtistProfile.Stats />
  <ArtistProfile.Actions />
  <ArtistProfile.Sections />
</ArtistProfile.Root>`,language:`svelte`}),r(u),e(n,u)},$$slots:{default:!0}})}export{g as component};