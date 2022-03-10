var ae=Object.defineProperty;var F=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,ne=Object.prototype.propertyIsEnumerable;var Y=(s,e,t)=>e in s?ae(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,K=(s,e)=>{for(var t in e||(e={}))re.call(e,t)&&Y(s,t,e[t]);if(F)for(var t of F(e))ne.call(e,t)&&Y(s,t,e[t]);return s};import{r as $,u as L,a as V,b as O,o as n,c as d,d as v,e as u,w,p as T,f as U,g as i,h as le,i as b,t as N,j as g,k as ie,l as C,F as A,m as M,n as ce,q as D,s as ue,T as de,v as P,x as he,y as _e,z as pe}from"./vendor.725d333d.js";const me=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerpolicy&&(a.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?a.credentials="include":o.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}};me();class B{constructor(e){this.url=e,this.chats=[],this.userInfo={},this.closeUserWS=null,this.loginCallbacks=[t=>{this.userInfo[t]=t}]}async createUser(e,t=void 0){try{this.user=await W(this.url+"/make-user",{id:t,name:e},this.user)}catch{return null}for(const r of this.loginCallbacks)r(this.user);return this.closeUserWS===null&&this.user&&(this.closeUserWS=this.subToUserChanges()),this.closeUserWS!==null&&!this.user&&(this.closeUserWS(),this.closeUserWS=null),this.user}async setUser(e,t){if(this.user=await R(this.url+"/me",{secretId:t,id:e}),this.user.chatIds!==void 0)for(const r of this.user.chatIds)this.chats.push({id:r,messages:[],lastFetch:0});for(const r of this.loginCallbacks)r(this.user);return this.closeUserWS===null&&this.user&&(this.closeUserWS=this.subToUserChanges()),this.closeUserWS!==null&&!this.user&&(this.closeUserWS(),this.closeUserWS=null),this.user}async deleteAccount(){console.log(this.user),await W(this.url+"/delete-account",{},this.user),this.user=void 0;for(const e of this.loginCallbacks)e(this.user)}onUserChange(e){return this.loginCallbacks.push(e),()=>{this.loginCallbacks=this.loginCallbacks.filter(t=>t!==e)}}setLastMessage(e,t){this.lastIndex=t,this.lastMessage=e}async getTopMessages(e,t,r=0){const o=await R(this.url+`/get-top-messages/${e}/${r}/${t}`,this.user);for(const a of o)await this.addUsernameToMessage(a);return o}async addUsernameToMessage(e){if(!e.senderId)return e.username="[unknown]",e;const t=await this.getUserInfo(e.senderId);return e.username=t.name,e}async sendMessage(e,t){await W(this.url+`/get-chat/${e}/post-message`,{chatId:e,message:t},this.user)}async subToUserChanges(){return new Promise((e,t)=>{this.user||t("Not logged in");const r=new URL(this.url,this.url),o=new WebSocket((r.protocol==="https:"?"wss://":"ws://")+new URL(this.url).host+"/ws/user?userId="+this.user.id+"&secret="+this.user.secretId);o.onmessage=async a=>{const c=JSON.parse(a.data);if(c.type==="update"){e(o.close),this.user=c.user;for(const f of this.loginCallbacks)f(this.user)}},o.onerror=t,o.onclose=()=>{window.location.reload()}})}async subToChatMessages(e,t,r){return new Promise((o,a)=>{if(console.log(new URL(this.url)),console.log("initing ws"),!this.user)throw new Error("No user logged in");const c=new URL(this.url,this.url),f=new WebSocket((c.protocol==="https:"?"wss://":"ws://")+c.host+"/ws/chat?userId="+this.user.id+"&secret="+this.user.secretId+"&chatId="+e);f.onmessage=async h=>{const _=JSON.parse(h.data);if(_.type==="error",_.type==="message"){const l=await this.addUsernameToMessage(_.message);t(l)}if(_.type==="messages"){o(f);for(let l of _.messages)l=await this.addUsernameToMessage(l),t(l)}_.type==="metadata"&&r(_.metadata)},f.onerror=h=>{console.log(h),a(h)},f.onclose=h=>{h.code===1006&&(console.log("ws closed"),t({type:"error",message:"Connection to chat '"+e+"' lost"}))}})}async promote(e,t){e.send(JSON.stringify({type:"promote",userId:t}))}async getMoreMessages(e,t){return e.send(JSON.stringify({type:"more",start:t,count:10})),new Promise((r,o)=>{e.addEventListener("message",async a=>{const c=JSON.parse(a.data);if(c.type==="more"){let f=await Promise.all(c.messages.map(h=>this.addUsernameToMessage(h)));r(f)}})})}async createChat(e){try{await W(this.url+"/add-chat",{users:[],id:e},this.user);for(const t of this.loginCallbacks)t(this.user)}catch{alert(`a chat with id '${e}' already exists`)}}async getUserInfo(e,t=!1){if(t||this.userInfo[e]===void 0){const r=await R(this.url+`/get-user/${e}`,this.user);this.userInfo[e]=r}return this.userInfo[e]}}async function W(s,e,t){let r=t?`Bearer ${t.id}:${t.secretId}`:"";return(await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:r},body:JSON.stringify(e)})).json()}async function R(s,e){let t=e?`Bearer ${e.id}:${e.secretId}`:"";return(await fetch(s,{headers:{Authorization:t}})).json()}var S=(s,e)=>{const t=s.__vccOpts||s;for(const[r,o]of e)t[r]=o;return t};const fe={id:"app"},ve={setup(s){const e=new B("https://zchats-backend.glitch.me"),t=$(e.user);L();const r=V();return e.onUserChange(()=>{t.value=K({},e.user),console.log("user changed",t.value)}),r.beforeEach(async(o,a)=>{if(console.log("before each",o,a,t.value),t.value)return!0;if(o.path==="/"||o.path==="/about")try{return await e.setUser(localStorage.getItem("user"),localStorage.getItem("token")),!0}catch{return!0}if(o.path==="/login")try{return await e.setUser(o.query.user,o.query.token),localStorage.setItem("user",o.query.user),localStorage.setItem("token",o.query.token),{path:"/"}}catch(c){return console.log("error",c),{path:"/",query:{error:"Invalid authentication link"}}}if(!t.value&&localStorage.getItem("user"))if(await e.setUser(localStorage.getItem("user"),localStorage.getItem("token")),!t.value)localStorage.removeItem("user"),localStorage.removeItem("token");else return!0;return{path:"/",query:{redirect:o.fullPath}}}),(o,a)=>{const c=O("router-view");return n(),d("div",fe,[v(c,{user:t.value,db:u(e)},null,8,["user","db"])])}}};var ge=S(ve,[["__scopeId","data-v-76c154cc"]]);const ye={},G=s=>(T("data-v-070506be"),s=s(),U(),s),be=G(()=>i("h1",null,"Chat App",-1)),we=G(()=>i("h2",null,"About",-1)),ke=b("back"),Ie=le("<p data-v-070506be> Chats are readable by anyone who knows (or guesses) the chat id. Only promoted users are able to send messages. Any promoted user can see who has viewed the chat and promote any of them to be a messenger. Treat the chat id like a password for the chat. </p><p data-v-070506be> Your account and messages might be deleted at any time for any reason. This site is mostly an educational exercise for me, but if you want to use it feel free. </p><p data-v-070506be> Accounts are on a per-browser basis. There is no sign out and no way to log into another browser. For security&#39;s sake and my laziness in not wanting to do oAuth, you cannot log in on any other device. You can delete your account if you would like (the closest action to logging out) which will remove your name from all messages and will remove you from all chats. If a chat has no messengers left then the chat will be deleted. This action is irreversible. I recommend you delete your account before you log off if you are using a shared computer. </p><p data-v-070506be> If you want a secure and robust chat system, find a different chat system. If you just want an easy way to make a quick group chat (that has no notifications, verification, or guarentees about messages continuing to exist) with an easy join code then this site is for you! </p><details data-v-070506be><summary data-v-070506be>Nerdy Details</summary><h3 data-v-070506be>Authentication</h3><p data-v-070506be> Essentially I use a uuid-v4 as a de facto password for every user, stored in localstorage. This is not secure as if the uuid is leaked then the account is permanently compromised since the uuid password never expires. What I <i data-v-070506be>should</i> do is store a hashed+salted+peppered password for each user and manage all the oAuth stuff with a database. It&#39;s on my list of todos. </p><h3 data-v-070506be>Database</h3><p data-v-070506be> I use node&#39;s fs library to read and write to json files. It isn&#39;t thread safe. It caches the data as it needs to in HashTables and then on every request after the first it will just get the data from memory. The database stores the data object on every assignment. The data object and its children get frozen. This ensures that the json file and the cached data remain in sync. </p><h3 data-v-070506be>API</h3><p data-v-070506be> I wrote an api using express. The api consists of get requests to see messages and user info and post requests to create new messages and register accounts. Anyone can get messages if they know the chat id. Anyone can get user info if they know the user id. Only promoted approved users can post. Authentication for the API is done with bearer tokens. </p><h3 data-v-070506be>Websocket</h3><p data-v-070506be> I use a websocket to allow messages to be updated in real time without needing to constantly poll the server for new messages. The websocket also sends information about metadata changes to anyone who is allowed to send messages to the chat. </p></details>",5),Se=b("back");function $e(s,e){const t=O("router-link");return n(),d("div",null,[be,we,v(t,{to:"/"},{default:w(()=>[ke]),_:1}),Ie,v(t,{to:"/"},{default:w(()=>[Se]),_:1})])}var Ce=S(ye,[["render",$e],["__scopeId","data-v-070506be"]]);const xe=["onSubmit"],Te=["minlength","maxlength","placeholder","value"],Ue={props:{btnText:String,placeholder:String,minlength:String,maxlength:String,defaultValue:String},emits:["submit"],setup(s,{emit:e}){const t=s,{btnText:r,placeholder:o,minlength:a,maxlength:c,defaultValue:f}=N(t);function h(_){const l=_.target.text.value;a.value&&l.length<Number.parseInt(a.value)||c.value&&l.length>Number.parseInt(c.value)||(e("submit",l),_.target.children[0].value="")}return(_,l)=>(n(),d("form",{onSubmit:ie(h,["prevent"])},[i("input",{type:"text",minlength:u(a),maxlength:u(c),name:"text",placeholder:u(o),value:u(f),required:""},null,8,Te),i("button",null,g(u(r)),1)],40,xe))}};var x=S(Ue,[["__scopeId","data-v-3987b34a"]]);const j=s=>(T("data-v-0baeb962"),s=s(),U(),s),Ae={key:0},Me={key:0,class:"error"},je=j(()=>i("h1",null,"Chat App",-1)),qe={key:1},Oe={key:2},Ne=j(()=>i("p",null,[i("b",null," Warning: anything and everything that you post can be deleted or publicly exposed at any time. Use at your own risk. ")],-1)),Pe=b("About/policies"),We=j(()=>i("br",null,null,-1)),Le={key:1},Ve={key:0,class:"error"},Be=b("About/policies"),He=j(()=>i("br",null,null,-1)),Ee={class:"chat-flex"},Re={class:"form"},De=j(()=>i("h3",null,"Postable Chats",-1)),Je={class:"form"},ze=j(()=>i("h3",null,"Viewed Chats",-1)),Fe={props:{db:Object,user:Object},setup(s){const e=s,{db:t,user:r}=N(e),o=V(),a=L();console.log(r.value);async function c(){await t.value.deleteAccount(),localStorage.removeItem("user"),localStorage.removeItem("token"),o.push("/")}async function f(l){console.log("clicked");const p=await t.value.createUser(l);if(!p){o.push({path:"/",query:{error:"connection to chat server could not be made"}}),window.setTimeout(()=>{history.replaceState&&history.replaceState(history.state,"",location.pathname+location.search.replace(/[\?&]error=[^&]+/,"").replace(/^&/,"?")+location.hash)},0);return}localStorage.setItem("user",p.id),localStorage.setItem("token",p.secretId),console.log(localStorage.getItem("user")),a.query.redirect&&o.push(a.query.redirect)}async function h(l){try{await t.value.createChat(l)}catch(p){console.log(p)}console.log(r.value)}async function _(l){o.push(`/chat/${l}`)}return history.replaceState&&history.replaceState(history.state,"",location.pathname+location.search.replace(/[\?&]error=[^&]+/,"").replace(/^&/,"?")+location.hash),(l,p)=>{const k=O("router-link");return!u(r)||u(r).name===void 0?(n(),d("div",Ae,[u(a).query.error?(n(),d("div",Me,g(u(a).query.error),1)):C("",!0),je,u(a).query.redirect?(n(),d("h2",qe," Create an account to go to "+g(u(a).query.redirect),1)):(n(),d("h2",Oe,"Mostly just a tech demo.")),Ne,v(k,{to:"/about"},{default:w(()=>[Pe]),_:1}),We,v(x,{onSubmit:f,placeholder:"username",btnText:"Create Account",class:"form",minlength:"3"})])):(n(),d("div",Le,[u(a).query.error?(n(),d("div",Ve,g(u(a).query.error),1)):C("",!0),i("h1",null,"Hello "+g(u(r).name),1),v(k,{to:"/about"},{default:w(()=>[Be]),_:1}),He,i("button",{onClick:c},"Delete Account"),i("div",Ee,[i("div",Re,[v(x,{onSubmit:h,placeholder:"id",btnText:"Create Chat",minlength:"6"}),De,(n(!0),d(A,null,M([...u(r).chatIds].reverse(),y=>(n(),d("div",{key:y},[v(k,{to:`/chat/${y}`},{default:w(()=>[b(g(y),1)]),_:2},1032,["to"])]))),128))]),i("div",Je,[v(x,{onSubmit:_,placeholder:"id",btnText:"Join Chat",minlength:"6"}),ze,(n(!0),d(A,null,M([...u(r).viewedChats].reverse(),y=>(n(),d("div",{key:y},[v(k,{to:`/chat/${y}`},{default:w(()=>[b(g(y),1)]),_:2},1032,["to"])]))),128))])])]))}}};var Ye=S(Fe,[["__scopeId","data-v-0baeb962"]]);const Ke=s=>(T("data-v-004f20c9"),s=s(),U(),s),Ge=Ke(()=>i("br",null,null,-1)),Qe={props:{user:Object,message:Object},setup(s){return(e,t)=>(n(),d("div",{class:ce(["message",s.message.senderId===s.user.id&&"me"])},[i("b",null,g(s.message.username),1),Ge,b(" "+g(s.message.content),1)],2))}};var Xe=S(Qe,[["__scopeId","data-v-004f20c9"]]);const Q=s=>(T("data-v-76125f52"),s=s(),U(),s),Ze={key:0,class:"posters"},et=Q(()=>i("h3",null,"Posters:",-1)),tt={key:1,class:"viewers"},st=Q(()=>i("h3",null,"Viewers:",-1)),ot=["onClick"],at={props:{user:Object,chatMetadata:Object,db:B},emits:["promote"],setup(s,{emit:e}){const t=s,{db:r,user:o,chatMetadata:a}=N(t),c=D(()=>a.value.users.filter(_=>_!==o.value.id)),f=D(()=>a.value.viewedBy.filter(_=>_!==o.value.id&&!a.value.users.includes(_)));console.log(c.value,f.value);function h(_){e("promote",_)}return(_,l)=>(n(),d("div",null,[u(c).length?(n(),d("div",Ze,[et,(n(!0),d(A,null,M(u(c),p=>(n(),d("div",{class:"poster",key:p.id},g(p.name),1))),128))])):C("",!0),u(f).length?(n(),d("div",tt,[st,(n(!0),d(A,null,M(u(f),p=>(n(),d("div",{class:"viewer",key:p.id},[b(g(p.name)+" - ",1),i("button",{onClick:k=>h(p.id)},"Promote",8,ot)]))),128))])):C("",!0)]))}};var rt=S(at,[["__scopeId","data-v-76125f52"]]);const nt={},X=s=>(T("data-v-4de8df90"),s=s(),U(),s),lt={class:"loader"},it=X(()=>i("div",{class:"left"},null,-1)),ct=X(()=>i("div",{class:"right"},null,-1)),ut=[it,ct];function dt(s,e){return n(),d("div",lt,ut)}var ht=S(nt,[["render",dt],["__scopeId","data-v-4de8df90"]]);const _t=s=>(T("data-v-11ac93be"),s=s(),U(),s),pt={class:"chat-parent"},mt={class:"top"},ft=b("home"),vt={key:2,class:"send"},gt={key:1},yt=_t(()=>i("p",null," You are not allowed to post in this chat. Contact the person who sent you the link to ask for posting privleges. ",-1)),bt=[yt],wt={props:{db:B,user:Object},setup(s){const e=s,t=L(),r=V(),{db:o,user:a}=N(e),c=t.params.id,f=D(()=>_.value.id),h=$([]),_=$({}),l=$(null),p=$(!1),k=$(null),y=$(!0);let J=!1;async function z(){if(!J){J=!0;try{k.value=await o.value.subToChatMessages(c,m=>{m.type&&m.type==="error"&&r.push({path:"/",query:{error:m.message}}),console.log("added message ",m),h.value=[...h.value,m],window.setTimeout(()=>{l.value.scrollTo(0,l.value.scrollHeight,{behavior:"smooth"})},0)},async m=>{console.log("metadata",m),m.viewedBy=await Promise.all(m.viewedBy.map(I=>o.value.getUserInfo(I))),m.users=await Promise.all(m.users.map(I=>o.value.getUserInfo(I))),_.value=m})}catch{console.log("HERE"),r.push(t.path.replace(/\/+$/,"")+"/404")}y.value=!1}}a.value&&z();const Z=o.value.onUserChange(z);function ee(m){m.length<1||o.value.sendMessage(c,m)}ue(()=>{Z(),k.value.close()});function te(){l.value.scrollTo(0,l.value.scrollHeight,{behavior:"smooth"})}function se(){let m=!1;const I=async()=>{if(l.value.scrollTop===0){if(m)return;l.value.scrollTop=1,l.value.style.overflowY="hidden",y.value=!0,m=!0;const H=await o.value.getMoreMessages(k.value,h.value.length);console.log(h.value.length),l.value.style.overflowY="auto",h.value=[...H,...h.value],m=!1,y.value=!1,l.value.scrollTo(0,1,{behavior:"smooth"})}};l.value.addEventListener("scroll",I)}function oe(m){o.value.promote(k.value,m)}return(m,I)=>{const H=O("router-link");return n(),d("div",pt,[i("div",mt,[v(H,{to:"/",class:"link"},{default:w(()=>[ft]),_:1}),u(f)?(n(),d("button",{key:0,onClick:I[0]||(I[0]=E=>p.value=!p.value)},g(p.value?"Hide":"Show Viewers"),1)):C("",!0)]),v(de,{name:"fade"},{default:w(()=>[y.value?(n(),P(ht,{key:0})):C("",!0)]),_:1}),p.value?(n(),P(rt,{key:1,chatMetadata:_.value,user:u(a),db:u(o),onPromote:oe},null,8,["chatMetadata","user","db"])):(n(),d("div",{key:0,class:"messages",ref_key:"messagesDiv",ref:l,onVnodeMounted:I[1]||(I[1]=()=>{te(),se()})},[(n(!0),d(A,null,M(h.value,E=>(n(),P(Xe,{message:E,user:u(a),db:u(o),key:E.id},null,8,["message","user","db"]))),128))],512)),p.value?C("",!0):(n(),d("div",vt,[u(f)?(n(),P(x,{key:0,btnText:"post",placeholder:"message",onSubmit:ee,minlength:"1"})):(n(),d("div",gt,bt))]))])}}};var kt=S(wt,[["__scopeId","data-v-11ac93be"]]);const q=s=>(T("data-v-403bc000"),s=s(),U(),s),It={key:0},St=q(()=>i("h1",null,"Chat not found!",-1)),$t=q(()=>i("h2",null,"Mostly just a tech demo.",-1)),Ct=q(()=>i("p",null,[i("b",null," Warning: anything and everything that you post can be deleted or publicly exposed at any time. Use at your own risk. ")],-1)),xt=b("Back"),Tt=q(()=>i("br",null,null,-1)),Ut={key:1},At=b("back to home"),Mt=q(()=>i("br",null,null,-1)),jt=q(()=>i("h3",null,"Your chats:",-1)),qt={props:{db:B,user:Object},setup(s){const e=s,{db:t,user:r}=N(e),o=V(),a=L();async function c(h){try{await t.value.createChat(h)}catch(_){console.log(_)}console.log(r.value)}async function f(h){o.push(`/chat/${h}`)}return(h,_)=>{const l=O("router-link");return!u(r)||u(r).name===void 0?(n(),d("div",It,[St,$t,Ct,v(l,{to:"/"},{default:w(()=>[xt]),_:1}),Tt,v(x,{onSubmit:h.createUser,placeholder:"username",btnText:"Create Account",class:"form",minlength:"3"},null,8,["onSubmit"])])):(n(),d("div",Ut,[i("h1",null,"Chat "+g(u(a).params.id)+" not found",1),v(l,{to:"/"},{default:w(()=>[At]),_:1}),Mt,v(x,{onSubmit:c,placeholder:"id",btnText:"Create Chat",class:"form",minlength:"6",defaultValue:u(a).params.id},null,8,["defaultValue"]),v(x,{onSubmit:f,placeholder:"id",btnText:"Join Chat",class:"form",minlength:"6"}),jt,(n(!0),d(A,null,M([...u(r).chatIds].reverse(),p=>(n(),d("div",{key:p},[v(l,{to:`/chat/${p}`},{default:w(()=>[b(g(p),1)]),_:2},1032,["to"])]))),128))]))}}};var Ot=S(qt,[["__scopeId","data-v-403bc000"]]);const Nt=[{path:"/",component:Ye},{path:"/about",component:Ce},{path:"/chat/:id",component:kt},{path:"/chat/:id/404",component:Ot}],Pt=he({history:_e(),routes:Nt});pe(ge).use(Pt).mount("#app");
