(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const pe=localStorage.getItem("api_url")||"https://medi-sum.onrender.com";class Pe{constructor(){this.accessToken=null,this.refreshToken=null,this.loadTokens()}loadTokens(){this.accessToken=localStorage.getItem("access_token"),this.refreshToken=localStorage.getItem("refresh_token")}saveTokens(e,t){this.accessToken=e,this.refreshToken=t,localStorage.setItem("access_token",e),t&&localStorage.setItem("refresh_token",t)}clearTokens(){this.accessToken=null,this.refreshToken=null,localStorage.removeItem("access_token"),localStorage.removeItem("refresh_token"),localStorage.removeItem("user")}isAuthenticated(){return!!this.accessToken}async request(e,t={}){const a=`${pe}${e}`,i={"Content-Type":"application/json","ngrok-skip-browser-warning":"true",...t.headers};this.accessToken&&(i.Authorization=`Bearer ${this.accessToken}`);try{let r=await fetch(a,{...t,headers:i});r.status===401&&this.refreshToken&&await this.refreshAccessToken()&&(i.Authorization=`Bearer ${this.accessToken}`,r=await fetch(a,{...t,headers:i}));const o=await r.json();if(!r.ok)throw new Error(o.error||"Request failed");return o}catch(r){throw console.error("API Error:",r),r}}async refreshAccessToken(){try{const e=await fetch(`${pe}/api/v1/auth/refresh`,{method:"POST",headers:{Authorization:`Bearer ${this.refreshToken}`,"Content-Type":"application/json"}});if(e.ok){const t=await e.json();return this.saveTokens(t.access_token,this.refreshToken),!0}}catch(e){console.error("Token refresh failed:",e)}return this.clearTokens(),!1}async login(e,t){const a=await this.request("/api/v1/auth/login",{method:"POST",body:JSON.stringify({email:e,password:t})});return this.saveTokens(a.access_token,a.refresh_token),localStorage.setItem("user",JSON.stringify(a.user)),a}async register(e,t,a){const i=await this.request("/api/v1/auth/register",{method:"POST",body:JSON.stringify({name:e,email:t,password:a})});return this.saveTokens(i.access_token,i.refresh_token),localStorage.setItem("user",JSON.stringify(i.user)),i}async logout(){try{await this.request("/api/v1/auth/logout",{method:"POST"})}finally{this.clearTokens()}}async getMe(){return this.request("/api/v1/auth/me")}async getDashboard(){return this.request("/api/v1/dashboard")}async generateHealthSummary(){return this.request("/api/v1/health-summary/generate",{method:"POST"})}async getPrescriptions(e=1,t=10){return this.request(`/api/v1/prescriptions?page=${e}&per_page=${t}`)}async getPrescription(e){return this.request(`/api/v1/prescriptions/${e}`)}async uploadPrescription(e){return this.request("/api/v1/prescriptions",{method:"POST",body:JSON.stringify({image_base64:e})})}async uploadReport(e){return this.request("/api/v1/reports",{method:"POST",body:JSON.stringify({image:e})})}async deletePrescription(e){return this.request(`/api/v1/prescriptions/${e}`,{method:"DELETE"})}async getHealthReadings(){return this.request("/api/v1/health-readings")}async addHealthReading(e){return this.request("/api/v1/health-readings",{method:"POST",body:JSON.stringify(e)})}async deleteHealthReading(e){return this.request(`/api/v1/health-readings/${e}`,{method:"DELETE"})}async getTimeline(e=1,t=20,a="all"){return this.request(`/api/v1/timeline?page=${e}&per_page=${t}&filter=${a}`)}async sendChatMessage(e,t="en"){return this.request("/api/v1/chat",{method:"POST",body:JSON.stringify({message:e,language:t})})}async registerPushToken(e,t){return this.request("/api/v1/push-tokens",{method:"POST",body:JSON.stringify({token:e,platform:t})})}async getPharmaAssist(){return this.request("/api/v1/pharma-assist")}async compareMedicine(e,t=""){return this.request("/api/v1/pharma-assist/compare",{method:"POST",body:JSON.stringify({medicine_name:e,dosage:t})})}async getHealthReadings(){return this.request("/api/v1/health-readings")}async addHealthReading(e){return this.request("/api/v1/health-readings",{method:"POST",body:JSON.stringify(e)})}async deleteHealthReading(e){return this.request(`/api/v1/health-readings/${e}`,{method:"DELETE"})}}const T=new Pe,Ae="modulepreload",Me=function(s){return"/"+s},me={},Y=function(e,t,a){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),n=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(t.map(l=>{if(l=Me(l),l in me)return;me[l]=!0;const c=l.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${h}`))return;const x=document.createElement("link");if(x.rel=c?"stylesheet":Ae,c||(x.as="script"),x.crossOrigin="",x.href=l,n&&x.setAttribute("nonce",n),document.head.appendChild(x),c)return new Promise((m,d)=>{x.addEventListener("load",m),x.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return i.then(o=>{for(const n of o||[])n.status==="rejected"&&r(n.reason);return e().catch(r)})};/*! Capacitor: https://capacitorjs.com/ - MIT License */const De=s=>{const e=new Map;e.set("web",{name:"web"});const t=s.CapacitorPlatforms||{currentPlatform:{name:"web"},platforms:e},a=(r,o)=>{t.platforms.set(r,o)},i=r=>{t.platforms.has(r)&&(t.currentPlatform=t.platforms.get(r))};return t.addPlatform=a,t.setPlatform=i,t},Ce=s=>s.CapacitorPlatforms=De(s),ye=Ce(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});ye.addPlatform;ye.setPlatform;var H;(function(s){s.Unimplemented="UNIMPLEMENTED",s.Unavailable="UNAVAILABLE"})(H||(H={}));class se extends Error{constructor(e,t,a){super(e),this.message=e,this.code=t,this.data=a}}const je=s=>{var e,t;return s!=null&&s.androidBridge?"android":!((t=(e=s==null?void 0:s.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||t===void 0)&&t.bridge?"ios":"web"},Be=s=>{var e,t,a,i,r;const o=s.CapacitorCustomPlatform||null,n=s.Capacitor||{},l=n.Plugins=n.Plugins||{},c=s.CapacitorPlatforms,h=()=>o!==null?o.name:je(s),x=((e=c==null?void 0:c.currentPlatform)===null||e===void 0?void 0:e.getPlatform)||h,m=()=>x()!=="web",d=((t=c==null?void 0:c.currentPlatform)===null||t===void 0?void 0:t.isNativePlatform)||m,p=k=>{const E=y.get(k);return!!(E!=null&&E.platforms.has(x())||b(k))},f=((a=c==null?void 0:c.currentPlatform)===null||a===void 0?void 0:a.isPluginAvailable)||p,u=k=>{var E;return(E=n.PluginHeaders)===null||E===void 0?void 0:E.find(g=>g.name===k)},b=((i=c==null?void 0:c.currentPlatform)===null||i===void 0?void 0:i.getPluginHeader)||u,$=k=>s.console.error(k),v=(k,E,g)=>Promise.reject(`${g} does not have an implementation of "${E}".`),y=new Map,w=(k,E={})=>{const g=y.get(k);if(g)return console.warn(`Capacitor plugin "${k}" already registered. Cannot register plugins twice.`),g.proxy;const L=x(),I=b(k);let _;const X=async()=>(!_&&L in E?_=typeof E[L]=="function"?_=await E[L]():_=E[L]:o!==null&&!_&&"web"in E&&(_=typeof E.web=="function"?_=await E.web():_=E.web),_),ee=(P,A)=>{var D,C;if(I){const j=I==null?void 0:I.methods.find(M=>A===M.name);if(j)return j.rtype==="promise"?M=>n.nativePromise(k,A.toString(),M):(M,G)=>n.nativeCallback(k,A.toString(),M,G);if(P)return(D=P[A])===null||D===void 0?void 0:D.bind(P)}else{if(P)return(C=P[A])===null||C===void 0?void 0:C.bind(P);throw new se(`"${k}" plugin is not implemented on ${L}`,H.Unimplemented)}},R=P=>{let A;const D=(...C)=>{const j=X().then(M=>{const G=ee(M,P);if(G){const W=G(...C);return A=W==null?void 0:W.remove,W}else throw new se(`"${k}.${P}()" is not implemented on ${L}`,H.Unimplemented)});return P==="addListener"&&(j.remove=async()=>A()),j};return D.toString=()=>`${P.toString()}() { [capacitor code] }`,Object.defineProperty(D,"name",{value:P,writable:!1,configurable:!1}),D},de=R("addListener"),ce=R("removeListener"),_e=(P,A)=>{const D=de({eventName:P},A),C=async()=>{const M=await D;ce({eventName:P,callbackId:M},A)},j=new Promise(M=>D.then(()=>M({remove:C})));return j.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await C()},j},te=new Proxy({},{get(P,A){switch(A){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return I?_e:de;case"removeListener":return ce;default:return R(A)}}});return l[k]=te,y.set(k,{name:k,proxy:te,platforms:new Set([...Object.keys(E),...I?[L]:[]])}),te},S=((r=c==null?void 0:c.currentPlatform)===null||r===void 0?void 0:r.registerPlugin)||w;return n.convertFileSrc||(n.convertFileSrc=k=>k),n.getPlatform=x,n.handleError=$,n.isNativePlatform=d,n.isPluginAvailable=f,n.pluginMethodNoop=v,n.registerPlugin=S,n.Exception=se,n.DEBUG=!!n.DEBUG,n.isLoggingEnabled=!!n.isLoggingEnabled,n.platform=n.getPlatform(),n.isNative=n.isNativePlatform(),n},Re=s=>s.Capacitor=Be(s),K=Re(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),le=K.registerPlugin;K.Plugins;class ve{constructor(e){this.listeners={},this.retainedEventArguments={},this.windowListeners={},e&&(console.warn(`Capacitor WebPlugin "${e.name}" config object was deprecated in v3 and will be removed in v4.`),this.config=e)}addListener(e,t){let a=!1;this.listeners[e]||(this.listeners[e]=[],a=!0),this.listeners[e].push(t);const r=this.windowListeners[e];r&&!r.registered&&this.addWindowListener(r),a&&this.sendRetainedArgumentsForEvent(e);const o=async()=>this.removeListener(e,t);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(const e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,a){const i=this.listeners[e];if(!i){if(a){let r=this.retainedEventArguments[e];r||(r=[]),r.push(t),this.retainedEventArguments[e]=r}return}i.forEach(r=>r(t))}hasListeners(e){return!!this.listeners[e].length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:a=>{this.notifyListeners(t,a)}}}unimplemented(e="not implemented"){return new K.Exception(e,H.Unimplemented)}unavailable(e="not available"){return new K.Exception(e,H.Unavailable)}async removeListener(e,t){const a=this.listeners[e];if(!a)return;const i=a.indexOf(t);this.listeners[e].splice(i,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){const t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(a=>{this.notifyListeners(e,a)}))}}const ue=s=>encodeURIComponent(s).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),be=s=>s.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class ze extends ve{async getCookies(){const e=document.cookie,t={};return e.split(";").forEach(a=>{if(a.length<=0)return;let[i,r]=a.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");i=be(i).trim(),r=be(r).trim(),t[i]=r}),t}async setCookie(e){try{const t=ue(e.key),a=ue(e.value),i=`; expires=${(e.expires||"").replace("expires=","")}`,r=(e.path||"/").replace("path=",""),o=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${t}=${a||""}${i}; path=${r}; ${o};`}catch(t){return Promise.reject(t)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(t){return Promise.reject(t)}}async clearCookies(){try{const e=document.cookie.split(";")||[];for(const t of e)document.cookie=t.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}}le("CapacitorCookies",{web:()=>new ze});const He=async s=>new Promise((e,t)=>{const a=new FileReader;a.onload=()=>{const i=a.result;e(i.indexOf(",")>=0?i.split(",")[1]:i)},a.onerror=i=>t(i),a.readAsDataURL(s)}),Oe=(s={})=>{const e=Object.keys(s);return Object.keys(s).map(i=>i.toLocaleLowerCase()).reduce((i,r,o)=>(i[r]=s[e[o]],i),{})},Ne=(s,e=!0)=>s?Object.entries(s).reduce((a,i)=>{const[r,o]=i;let n,l;return Array.isArray(o)?(l="",o.forEach(c=>{n=e?encodeURIComponent(c):c,l+=`${r}=${n}&`}),l.slice(0,-1)):(n=e?encodeURIComponent(o):o,l=`${r}=${n}`),`${a}&${l}`},"").substr(1):null,qe=(s,e={})=>{const t=Object.assign({method:s.method||"GET",headers:s.headers},e),i=Oe(s.headers)["content-type"]||"";if(typeof s.data=="string")t.body=s.data;else if(i.includes("application/x-www-form-urlencoded")){const r=new URLSearchParams;for(const[o,n]of Object.entries(s.data||{}))r.set(o,n);t.body=r.toString()}else if(i.includes("multipart/form-data")||s.data instanceof FormData){const r=new FormData;if(s.data instanceof FormData)s.data.forEach((n,l)=>{r.append(l,n)});else for(const n of Object.keys(s.data))r.append(n,s.data[n]);t.body=r;const o=new Headers(t.headers);o.delete("content-type"),t.headers=o}else(i.includes("application/json")||typeof s.data=="object")&&(t.body=JSON.stringify(s.data));return t};class Fe extends ve{async request(e){const t=qe(e,e.webFetchExtra),a=Ne(e.params,e.shouldEncodeUrlParams),i=a?`${e.url}?${a}`:e.url,r=await fetch(i,t),o=r.headers.get("content-type")||"";let{responseType:n="text"}=r.ok?e:{};o.includes("application/json")&&(n="json");let l,c;switch(n){case"arraybuffer":case"blob":c=await r.blob(),l=await He(c);break;case"json":l=await r.json();break;case"document":case"text":default:l=await r.text()}const h={};return r.headers.forEach((x,m)=>{h[m]=x}),{data:l,headers:h,status:r.status,url:r.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}}le("CapacitorHttp",{web:()=>new Fe});const xe=le("App",{web:()=>Y(()=>import("./web-1JVIAvfq.js"),[]).then(s=>new s.AppWeb)});let O=null,N=null,U=null;async function Q(){if(!O)try{O=(await Y(()=>import("./index-BRv_jdVe.js"),[])).Preferences}catch{console.warn("Preferences plugin not available, using localStorage fallback")}if(!N)try{const s=await Y(()=>import("./index-CXZaHFxU.js"),[]);N=s.Filesystem,U=s.Directory}catch{console.warn("Filesystem plugin not available")}}async function we(s){await Q();try{if(O){const{value:t}=await O.get({key:s});return t?JSON.parse(t):null}const e=localStorage.getItem(`medi_${s}`);return e?JSON.parse(e):null}catch(e){return console.error("LocalDB get error:",e),null}}async function V(s,e){await Q();try{const t=JSON.stringify(e);O?await O.set({key:s,value:t}):localStorage.setItem(`medi_${s}`,t)}catch(t){console.error("LocalDB set error:",t)}}async function q(){return await we("reminders")||[]}async function ke(s){const e=await q();s.id||(s.id=Date.now()+Math.floor(Math.random()*1e3));const t=e.findIndex(a=>a.id===s.id);return t>=0?e[t]={...e[t],...s}:e.push(s),await V("reminders",e),s}async function Ue(s){const t=(await q()).filter(a=>a.id!==s);await V("reminders",t)}async function Ve(s,e){const t=await q(),a=t.find(i=>i.id===s);return a&&(a.enabled=e,await V("reminders",t)),a}async function Ge(s){return(await q()).filter(t=>t.medicineName.toLowerCase()===s.toLowerCase())}const ae="prescription_images";async function Z(){return await we(ae)||{}}async function We(s,e){await Q();const t=`rx_${s}.jpg`;try{if(N&&U){await N.writeFile({path:`medisum/${t}`,data:e,directory:U.Data,recursive:!0});const a=await Z();return a[s]={fileName:t,timestamp:Date.now(),stored:!0},await V(ae,a),!0}else{const a=await Z();return a[s]={base64:e.substring(0,5e5),timestamp:Date.now(),stored:!0},await V(ae,a),!0}}catch(a){return console.error("Failed to save image locally:",a),!1}}async function Je(s){await Q();const t=(await Z())[s];if(!t)return null;try{if(N&&U&&t.fileName)return{data:(await N.readFile({path:`medisum/${t.fileName}`,directory:U.Data})).data,isLocal:!0};if(t.base64)return{data:t.base64,isLocal:!0}}catch(a){console.warn("Local image read failed:",a)}return null}async function Ye(s){var t;return!!((t=(await Z())[s])!=null&&t.stored)}async function ge(s){var m;let e={};try{e=await T.getDashboard()}catch(d){console.warn("Dashboard API error",d)}const t=JSON.parse(localStorage.getItem("user")||"{}"),a=e.stats||{},i=e.active_medicines||[],r=e.pending_tests||[],o=e.recent_activity||[];let n=[];try{n=((await T.getHealthReadings()).readings||[]).slice(0,5)}catch(d){console.warn("Vitals fetch error",d)}let l=[];try{l=(await q()).filter(p=>p.enabled)}catch(d){console.warn("Reminders fetch error",d)}function c(d){const p=new Date,f=p.getHours()*60+p.getMinutes();let u=null,b=1/0;for(const w of d.times||[]){const[S,k]=w.split(":").map(Number);let g=S*60+k-f;g<0&&(g+=24*60),g<b&&(b=g,u=w)}const $=Math.floor(b/60),v=b%60,y=$>0?`In ${$}h ${v}m`:`In ${v} min`;return{time:u,label:y,diff:b}}const h=l.map(d=>({...d,next:c(d)})).sort((d,p)=>d.next.diff-p.next.diff),x=!a.prescription_count&&!i.length;s.innerHTML=`
    <!-- Header -->
    <header class="bg-white border-b border-primary/10 px-4 pt-6 pb-4 sticky top-0 z-50">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="relative cursor-pointer" onclick="app.navigateTo('profile')">
                    <div class="size-12 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center text-xl font-bold text-primary">${(t.name||"U")[0].toUpperCase()}</div>
                    <span class="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <h1 class="text-xl font-bold tracking-tight">Welcome back</h1>
                    <p class="text-slate-500 text-sm">${t.name||"User"}</p>
                </div>
            </div>
            <div class="flex gap-1 relative">
                <button class="p-2 rounded-full hover:bg-slate-100 transition-colors relative">
                    <span class="material-symbols-outlined text-slate-600">notifications</span>
                    ${i.length>0?'<span class="absolute top-1 right-2 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>':""}
                </button>
                <button id="dashboard-logout-btn" class="p-2 rounded-full hover:bg-red-50 transition-colors" title="Log Out">
                    <span class="material-symbols-outlined text-slate-500">logout</span>
                </button>
            </div>
        </div>
    </header>

    <div class="max-w-md mx-auto px-4 py-6 space-y-6 page-enter">
        ${x?`
        <!-- Onboarding Flow -->
        <div class="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg shadow-primary/30 relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-2xl font-bold mb-2">Welcome to Medi-Sum! 👋</h2>
                <p class="text-sm text-white/90 mb-6 max-w-[85%]">Your digital health co-pilot is ready. Upload your first prescription or medical lab report to automatically build your health dashboard.</p>
                <button onclick="app.navigateTo('scan')" class="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:scale-105 transition-transform w-max">
                    <span class="material-symbols-outlined text-sm">auto_awesome</span>
                    Digitize My First Record
                </button>
            </div>
            <span class="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] text-white/10 rotate-12 pointer-events-none">medical_information</span>
        </div>`:""}

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('history')">
                <span class="material-symbols-outlined text-primary mb-1">description</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Prescriptions</p>
                <p class="text-2xl font-bold">${a.prescription_count??0}</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('pharma')">
                <span class="material-symbols-outlined text-teal-500 mb-1">medication</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Medicines</p>
                <p class="text-2xl font-bold">${a.medicine_count??i.length}</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('tests')">
                <span class="material-symbols-outlined text-blue-500 mb-1">lab_profile</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Medical Tests</p>
                <p class="text-2xl font-bold">${a.test_count??0}</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('tests')">
                <span class="material-symbols-outlined text-amber-500 mb-1">pending_actions</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending Tests</p>
                <p class="text-2xl font-bold">${a.pending_count??r.length}</p>
            </div>
        </div>

        <!-- Upload Button -->
        <button onclick="app.navigateTo('scan')" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined">upload_file</span>
            Upload Prescription
        </button>

        <!-- Reminders / Up Next -->
        ${h.length>0?`
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold flex items-center gap-2"><span class="material-symbols-outlined text-amber-500 text-xl">alarm</span> Up Next</h2>
                <button onclick="app.navigateTo('reminders')" class="text-primary text-xs font-bold flex items-center gap-1 hover:underline">Manage <span class="material-symbols-outlined text-[14px]">arrow_forward</span></button>
            </div>
            <div class="space-y-3">
                ${h.slice(0,3).map(d=>`
                <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="size-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-amber-100 text-amber-500 shrink-0">
                            <span class="material-symbols-outlined">pill</span>
                        </div>
                        <div>
                            <p class="text-xs text-amber-600 font-bold uppercase tracking-wider mb-0.5">${d.next.label} • ${d.next.time}</p>
                            <p class="font-bold text-slate-800">${d.medicineName}</p>
                            <p class="text-xs text-slate-600">${d.dosage||"No dosage set"}</p>
                        </div>
                    </div>
                    <button class="taken-btn bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-amber-600 transition-colors active:scale-95" data-name="${d.medicineName}">Taken</button>
                </div>`).join("")}
            </div>
        </section>`:i.length>0?`
        <section class="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-amber-400">notifications_none</span>
                <div>
                    <p class="text-sm font-bold text-slate-700">No reminders set</p>
                    <p class="text-xs text-slate-500">Set reminders for your ${i.length} active medicines</p>
                </div>
            </div>
            <button onclick="app.navigateTo('reminders')" class="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-amber-600 transition-colors active:scale-95">Set Up</button>
        </section>`:""}

        <!-- Vitals Section - Real DB Data -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Health Vitals</h2>
                <button onclick="app.navigateTo('vitals')" class="text-primary text-xs font-bold flex items-center gap-1 hover:underline">Add New <span class="material-symbols-outlined text-[14px]">add</span></button>
            </div>
            
            <div class="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x">
                ${n.length>0?n.map((d,p)=>`
                <div class="min-w-[240px] snap-center bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col gap-4 relative group">
                    <button class="delete-vital-btn absolute top-2 right-2 p-1 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all" data-id="${d.id}" title="Delete reading">
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-semibold text-slate-400 uppercase">${d.date||"Recent"}</span>
                        <span class="size-2 rounded-full ${p===0?"bg-primary":"bg-slate-200"}"></span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-rose-500 text-lg">favorite</span>
                            <span class="text-xs font-medium text-slate-500">BP</span>
                        </div>
                        <p class="font-bold text-slate-800">${d.bp_systolic||"--"}/${d.bp_diastolic||"--"} <span class="text-[10px] text-slate-400 font-normal">mmHg</span></p>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-blue-500 text-lg">water_drop</span>
                            <span class="text-xs font-medium text-slate-500">Sugar</span>
                        </div>
                        <p class="font-bold text-slate-800">${d.sugar_level||"--"} <span class="text-[10px] text-slate-400 font-normal">mg/dL ${d.sugar_type?"("+d.sugar_type+")":""}</span></p>
                    </div>
                    ${d.notes?`<p class="text-[10px] text-slate-400 border-t border-slate-50 pt-2">${d.notes}</p>`:""}
                </div>`).join(""):`
                <div class="w-full bg-slate-50 rounded-xl border border-slate-100 border-dashed p-6 text-center text-slate-400 text-sm">
                    No vitals recorded yet. Tap "Add New" to start tracking.
                </div>`}
            </div>

            <button onclick="app.navigateTo('vitals')" class="w-full bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl border border-emerald-200 transition-colors hover:bg-emerald-100 flex items-center justify-center gap-2 active:scale-[0.98]">
                <span class="material-symbols-outlined text-[18px]">add_circle</span>
                Record New Vitals
            </button>

            <button id="health-summary-btn" onclick="app.navigateTo('summary')" class="w-full bg-primary/10 text-primary font-bold py-3 rounded-xl border border-primary/20 transition-colors hover:bg-primary/20 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[18px]">summarize</span>
                Generate AI Health Summary
            </button>
        </section>

        <!-- Medicines -->
        <section class="space-y-4">
            <h2 class="text-lg font-bold">Your Medicines</h2>
            ${i.length?`<div class="space-y-3">${i.map((d,p)=>{const f=p%2===0,u=f?"border-teal-500":"border-slate-300 opacity-75",b=f?'<span class="bg-teal-50 text-teal-600 text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>':'<span class="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Completed</span>';return`
                <div class="flex items-center p-4 bg-white rounded-xl border-l-4 ${u} shadow-sm relative overflow-hidden transition-all">
                    
                    ${f?`
                    <button class="shrink-0 mr-3 size-6 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 text-transparent hover:text-teal-500 transition-colors" onclick="this.classList.add('bg-teal-500', 'border-teal-500', 'text-white'); window.app.showToast('Marked as taken!', 'success')">
                        <span class="material-symbols-outlined text-[14px]">check</span>
                    </button>`:`
                    <div class="shrink-0 mr-3 size-6"></div>
                    `}

                    <div class="flex-1 min-w-0 pr-2">
                        <div class="flex justify-between items-start mb-0.5">
                            <p class="text-sm font-bold text-slate-800 truncate ${!f&&"line-through decoration-slate-300"}">${d.name||""}</p>
                            ${b}
                        </div>
                        <p class="text-[11px] text-slate-500 truncate">${d.dosage||""} • ${d.frequency||""}</p>
                        ${f?'<p class="text-[9px] text-amber-500 font-bold uppercase mt-1">Refill in 12 days</p>':'<p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Course Finished Oct 2022</p>'}
                    </div>
                    
                    <button class="shrink-0 p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors" onclick="document.getElementById('med-modal-name').textContent='${d.name||"Medicine"}'; document.getElementById('med-modal-dose').textContent='${d.dosage||""} • ${d.frequency||""}'; document.getElementById('med-modal').classList.remove('hidden');">
                        <span class="material-symbols-outlined text-lg">info</span>
                    </button>
                </div>`}).join("")}</div>`:`
                <div class="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                    <div class="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                        <span class="material-symbols-outlined text-4xl">prescriptions</span>
                    </div>
                    <p class="text-sm font-bold text-slate-700 mb-1">No Active Medicines</p>
                    <p class="text-xs text-slate-500">You're all caught up! No active course found.</p>
                </div>
                `}
        </section>

        <!-- Pending Tests -->
        ${r.length?`
        <section class="space-y-4">
            <h2 class="text-lg font-bold">Pending Tests</h2>
            <div class="space-y-3">${r.map((d,p)=>{let f="Due in 3 days",u="text-amber-600 bg-amber-100";return p===0&&(f="Overdue by 1 day",u="text-red-600 bg-red-100"),`
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <div class="flex items-start gap-3">
                        <div class="size-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <span class="material-symbols-outlined">science</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-slate-800 truncate">${d.test_name||d.name||""}</p>
                            <p class="text-xs text-slate-500 mt-1">${d.instructions||"Review with doctor"}</p>
                            <div class="flex items-center gap-2 mt-3">
                                <span class="text-[10px] font-bold px-2 py-1 rounded uppercase ${u}">${f}</span>
                                <button class="text-[10px] font-bold text-primary ml-auto flex items-center gap-1 hover:underline" onclick="app.navigateTo('scan')">
                                    <span class="material-symbols-outlined text-[14px]">upload</span> Upload Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`}).join("")}</div>
        </section>`:""}

        <!-- Recent Activity -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Recent Activity</h2>
                <button onclick="app.navigateTo('history')" class="text-primary text-xs font-bold flex items-center gap-1 hover:underline">View all prescriptions <span class="material-symbols-outlined text-[14px]">arrow_forward</span></button>
            </div>
            ${o.length?`
            <div class="space-y-4 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                ${o.slice(0,5).map((d,p)=>{const f=["bg-primary","bg-teal-500","bg-blue-500"],u=["upload","auto_awesome","calendar_today"],b=d.prescription_id||d.id||"";return`<div class="flex gap-4 relative cursor-pointer group" ${b?`onclick="app.navigateTo('detail', {id:'${b}'})"`:""}>
                        <div class="${f[p%3]} size-10 rounded-full flex items-center justify-center z-10 border-4 border-[#f5f8f8]">
                            <span class="material-symbols-outlined text-white text-sm">${u[p%3]}</span>
                        </div>
                        <div class="flex-1 pt-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm ml-2 group-hover:border-primary/30 transition-colors">
                            <div class="flex justify-between items-start">
                                <p class="text-sm font-bold text-slate-800">${d.title||"Activity"}</p>
                                <p class="text-[10px] text-slate-400 uppercase font-semibold">${d.timestamp||""}</p>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">${d.subtitle||""}</p>
                            <p class="text-primary text-xs font-bold mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">View <span class="material-symbols-outlined text-[14px]">arrow_forward</span></p>
                        </div>
                    </div>`}).join("")}
            </div>`:`
                <div class="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                    <div class="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                        <span class="material-symbols-outlined text-4xl">history_toggle_off</span>
                    </div>
                    <p class="text-sm font-bold text-slate-700 mb-1">No Recent Activity</p>
                    <p class="text-xs text-slate-500">Your health events will appear here.</p>
                </div>
            `}
        </section>
    </div>

    <!-- Medicine Info Modal (Hidden by default) -->
    <div id="med-modal" class="fixed inset-0 z-[100] hidden">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onclick="document.getElementById('med-modal').classList.add('hidden')"></div>
        <div class="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-6 shadow-2xl animate-fade-in-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <div class="flex items-center gap-4 mb-6">
                <div class="size-16 rounded-2xl bg-teal-50 text-teal-500 flex items-center justify-center border border-teal-100 shadow-sm">
                    <span class="material-symbols-outlined text-3xl">pill</span>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-1" id="med-modal-name">Medicine Name</h2>
                    <p class="text-sm font-medium text-slate-500" id="med-modal-dose">10mg • After Meal</p>
                </div>
            </div>

            <div class="space-y-4 mb-8">
                <div class="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
                    <span class="material-symbols-outlined text-amber-500 shrink-0">warning</span>
                    <div>
                        <p class="text-xs text-amber-800 font-bold uppercase tracking-wider mb-0.5">Allergy Warning</p>
                        <p class="text-[13px] text-amber-700">Contains penicillin interactions. Proceed with caution based on your profile.</p>
                    </div>
                </div>
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</h3>
                    <p class="text-sm text-slate-700">Take one tablet daily after dinner with a full glass of water. Do not crush or chew.</p>
                </div>
            </div>

            <button class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all" onclick="document.getElementById('med-modal').classList.add('hidden')">
                Close Details
            </button>
        </div>
    </div>`,(m=document.getElementById("dashboard-logout-btn"))==null||m.addEventListener("click",async()=>{if(await window.app.showConfirmModal("Log Out?","Are you sure you want to log out of Medi-Sum?","Log Out")){try{await T.logout()}catch{}T.clearTokens(),window.app.showToast("👋 Logged out successfully","success"),setTimeout(()=>location.reload(),800)}}),s.querySelectorAll(".delete-vital-btn").forEach(d=>{d.addEventListener("click",async p=>{p.stopPropagation();const f=d.dataset.id;if(!(!f||!await window.app.showConfirmModal("Delete Reading?","Are you sure you want to delete this health reading?","Delete")))try{await T.deleteHealthReading(f),window.app.showToast("🗑️ Reading deleted","success"),window.app.navigateTo("dashboard")}catch(b){window.app.showToast(b.message||"Failed to delete","error")}})}),s.querySelectorAll(".taken-btn").forEach(d=>{d.addEventListener("click",()=>{const p=d.dataset.name;d.textContent="✓ Done",d.classList.remove("bg-amber-500","hover:bg-amber-600"),d.classList.add("bg-emerald-500"),d.disabled=!0,window.app.showToast(`💊 ${p} marked as taken`,"success")})})}let B=null;async function $e(){if(!B)try{B=(await Y(()=>import("./index-DvMPWkmq.js"),[])).LocalNotifications,(await B.requestPermissions()).display!=="granted"&&console.warn("Notification permission not granted")}catch{console.warn("Local notifications not available (browser mode)")}}async function re(s){if(await $e(),!!B)try{await ie(s.id);const e=[];(s.times||[]).forEach((t,a)=>{const[i,r]=t.split(":").map(Number),o=new Date,n=new Date;n.setHours(i,r,0,0),n<=o&&n.setDate(n.getDate()+1),e.push({title:"💊 Medicine Reminder",body:`Time to take ${s.medicineName}${s.dosage?" ("+s.dosage+")":""}`,id:s.id*10+a,schedule:{at:n,repeats:!0,every:"day",on:{hour:i,minute:r}},smallIcon:"ic_stat_icon_config_sample",iconColor:"#00e5ff",sound:"default",extra:{reminderId:s.id,medicineName:s.medicineName}})}),e.length>0&&await B.schedule({notifications:e})}catch(e){console.error("Failed to schedule notification:",e)}}async function ie(s){if(B)try{const e=[0,1,2,3,4].map(t=>({id:s*10+t}));await B.cancel({notifications:e})}catch{}}async function Ke(s){var l,c,h,x;await $e();const e=await q();let t=[];try{t=(await T.getPharmaAssist()).medicines||[]}catch{}s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">alarm</span>
                <h1 class="text-lg font-bold">Medicine Reminders</h1>
            </div>
        </div>
        <button id="add-reminder-btn" class="bg-primary text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform">
            <span class="material-symbols-outlined">add</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6">

        <!-- Active Reminders -->
        <section>
            <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Active Reminders (${e.filter(m=>m.enabled).length})</h2>
            ${e.length>0?`
            <div class="space-y-3" id="reminders-list">
                ${e.map(m=>`
                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm ${m.enabled?"":"opacity-50"}" data-id="${m.id}">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="size-10 rounded-lg ${m.enabled?"bg-primary/10 text-primary":"bg-slate-100 text-slate-400"} flex items-center justify-center">
                                <span class="material-symbols-outlined">medication</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800">${m.medicineName}</h3>
                                ${m.dosage?`<p class="text-xs text-slate-500">${m.dosage}</p>`:""}
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer toggle-reminder" data-id="${m.id}" ${m.enabled?"checked":""}>
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                            </label>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex flex-wrap gap-2">
                            ${(m.times||[]).map(d=>`
                            <span class="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">schedule</span>
                                ${d}
                            </span>`).join("")}
                        </div>
                        <button class="delete-reminder-btn p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" data-id="${m.id}">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </div>
                </div>`).join("")}
            </div>`:`
            <div class="bg-white border border-slate-100 border-dashed rounded-xl p-8 text-center">
                <span class="material-symbols-outlined text-4xl text-slate-300 mb-3">notifications_off</span>
                <p class="text-sm font-bold text-slate-700 mb-1">No Reminders Set</p>
                <p class="text-xs text-slate-500 mb-4">Tap the + button to add your first medicine reminder.</p>
            </div>`}
        </section>

        <!-- Tips -->
        <section class="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary shrink-0 mt-0.5">lightbulb</span>
                <div>
                    <p class="text-xs font-bold text-primary mb-1">Pro Tip</p>
                    <p class="text-xs text-slate-600 leading-relaxed">You can also set reminders directly from your prescription details page by tapping the bell icon on each medicine.</p>
                </div>
            </div>
        </section>
    </main>

    <!-- Add Reminder Modal -->
    <div id="add-reminder-modal" class="fixed inset-0 z-[100] hidden">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" id="modal-backdrop"></div>
        <div class="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-6 shadow-2xl animate-fade-in-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <h2 class="text-xl font-bold mb-6">Add Reminder</h2>

            <form id="reminder-form" class="space-y-5">
                <!-- Medicine Name -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Medicine Name</label>
                    ${t.length>0?`
                    <select id="rem-medicine" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="">Select a medicine...</option>
                        ${t.map(m=>`<option value="${m.name}" data-dosage="${m.dosage||""}">${m.name}${m.dosage?" — "+m.dosage:""}</option>`).join("")}
                        <option value="custom">✏️ Enter manually...</option>
                    </select>
                    <input id="rem-medicine-custom" type="text" placeholder="Enter medicine name" class="hidden w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">`:`
                    <input id="rem-medicine-custom" type="text" placeholder="Enter medicine name" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required>`}
                </div>

                <!-- Dosage -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Dosage (optional)</label>
                    <input id="rem-dosage" type="text" placeholder="e.g. 500mg" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <!-- Time Selection -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Reminder Times</label>
                    <div class="grid grid-cols-3 gap-2 mb-3">
                        <label class="cursor-pointer">
                            <input type="checkbox" class="sr-only peer time-preset" value="08:00">
                            <div class="text-center py-2.5 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">
                                🌅 Morning
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" class="sr-only peer time-preset" value="14:00">
                            <div class="text-center py-2.5 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">
                                ☀️ Afternoon
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" class="sr-only peer time-preset" value="21:00">
                            <div class="text-center py-2.5 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">
                                🌙 Night
                            </div>
                        </label>
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="time" id="rem-custom-time" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none">
                        <button type="button" id="add-custom-time" class="bg-slate-100 text-slate-600 px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">+ Add</button>
                    </div>
                    <div id="selected-times" class="flex flex-wrap gap-2 mt-3"></div>
                </div>

                <button type="submit" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">
                    Save Reminder
                </button>
            </form>
        </div>
    </div>`,s.querySelectorAll(".toggle-reminder").forEach(m=>{m.addEventListener("change",async d=>{const p=parseInt(d.target.dataset.id),f=d.target.checked,u=await Ve(p,f);u&&(f?(await re(u),window.app.showToast("🔔 Reminder enabled","success")):(await ie(p),window.app.showToast("🔕 Reminder paused","info"))),window.app.navigateTo("reminders")})}),s.querySelectorAll(".delete-reminder-btn").forEach(m=>{m.addEventListener("click",async()=>{const d=parseInt(m.dataset.id);await window.app.showConfirmModal("Delete Reminder?","This will stop all notifications for this medicine.","Delete")&&(await ie(d),await Ue(d),window.app.showToast("🗑️ Reminder deleted","success"),window.app.navigateTo("reminders"))})}),(l=document.getElementById("add-reminder-btn"))==null||l.addEventListener("click",()=>{document.getElementById("add-reminder-modal").classList.remove("hidden")}),(c=document.getElementById("modal-backdrop"))==null||c.addEventListener("click",()=>{document.getElementById("add-reminder-modal").classList.add("hidden")});const a=document.getElementById("rem-medicine"),i=document.getElementById("rem-medicine-custom");a&&a.addEventListener("change",()=>{if(a.value==="custom")i.classList.remove("hidden"),i.required=!0,i.focus();else{i.classList.add("hidden"),i.required=!1;const m=a.selectedOptions[0];m!=null&&m.dataset.dosage&&(document.getElementById("rem-dosage").value=m.dataset.dosage)}});const r=new Set,o=document.getElementById("selected-times");function n(){o.innerHTML=Array.from(r).map(m=>`
            <span class="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                ${m}
                <button type="button" class="remove-time hover:text-red-500" data-time="${m}">✕</button>
            </span>
        `).join(""),o.querySelectorAll(".remove-time").forEach(m=>{m.addEventListener("click",()=>{r.delete(m.dataset.time),document.querySelectorAll(".time-preset").forEach(d=>{d.value===m.dataset.time&&(d.checked=!1)}),n()})})}document.querySelectorAll(".time-preset").forEach(m=>{m.addEventListener("change",()=>{m.checked?r.add(m.value):r.delete(m.value),n()})}),(h=document.getElementById("add-custom-time"))==null||h.addEventListener("click",()=>{const m=document.getElementById("rem-custom-time");m.value&&(r.add(m.value),m.value="",n())}),(x=document.getElementById("reminder-form"))==null||x.addEventListener("submit",async m=>{m.preventDefault();let d="";if(a&&a.value&&a.value!=="custom"?d=a.value:i&&(d=i.value.trim()),!d){window.app.showToast("Please enter a medicine name","error");return}if(r.size===0){window.app.showToast("Please select at least one reminder time","error");return}const p={medicineName:d,dosage:document.getElementById("rem-dosage").value.trim(),times:Array.from(r).sort(),enabled:!0,createdAt:Date.now()},f=await ke(p);await re(f),window.app.showToast("🔔 Reminder set!","success"),document.getElementById("add-reminder-modal").classList.add("hidden"),window.app.navigateTo("reminders")})}async function Ee(s,e,t=["08:00","20:00"]){const a={medicineName:s,dosage:e||"",times:t,enabled:!0,createdAt:Date.now()},i=await ke(a);return await re(i),i}async function Ze(s){var m,d;s.innerHTML=`
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div class="flex items-center justify-between px-4 py-4 max-w-lg mx-auto w-full">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <span class="material-symbols-outlined text-slate-600">arrow_back</span>
            </button>
            <h1 class="text-lg font-semibold tracking-tight">Upload Prescription</h1>
            <div class="w-10"></div>
        </div>
    </header>

    <main class="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full page-enter">
        <!-- Step Indicator -->
        <div class="flex items-center justify-center gap-2 mb-8">
            <div class="flex items-center gap-2">
                <span id="step1-circle" class="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                <span class="text-sm font-medium text-primary">Choose File</span>
            </div>
            <div class="h-px w-8 bg-slate-200"></div>
            <div id="step2" class="flex items-center gap-2 opacity-40">
                <span class="w-6 h-6 rounded-full border border-slate-400 text-xs flex items-center justify-center font-bold">2</span>
                <span class="text-sm font-medium">Analyze</span>
            </div>
        </div>

        <!-- Heading -->
        <div class="text-center mb-8">
            <h2 class="text-2xl font-bold mb-2">Upload your prescription</h2>
            <p class="text-slate-500 text-sm">Our AI will extract the data. <span class="font-medium text-slate-700">JPG, PNG, PDF</span> supported.</p>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-4 mb-4 relative">
            <button id="btn-camera" class="flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-primary hover:bg-primary/5 transition-colors group relative overflow-hidden">
                <div class="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                </div>
                <span class="font-bold text-slate-700 text-sm">Take Photo</span>
                <input type="file" id="camera-input" accept="image/*" capture="environment" class="absolute inset-0 opacity-0 cursor-pointer">
            </button>

            <button id="btn-gallery" class="flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-primary hover:bg-primary/5 transition-colors group relative overflow-hidden">
                <div class="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-primary text-3xl">perm_media</span>
                </div>
                <span class="font-bold text-slate-700 text-sm">Browse Gallery</span>
                <input type="file" id="file-input" accept=".jpg,.jpeg,.png,.pdf" class="absolute inset-0 opacity-0 cursor-pointer">
            </button>
        </div>
        
        <!-- Cloud Import Options -->
        <div class="flex gap-3 mb-6">
            <button class="flex-1 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-slate-700 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200" onclick="window.app.showToast('Google Drive integration coming soon', 'info')">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Drive" class="w-4 h-4">
                Import Drive
            </button>
            <button class="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1DA851] text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#25D366]/30" onclick="window.app.showToast('WhatsApp integration coming soon', 'info')">
                <svg class="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp
            </button>
        </div>

        <!-- File Preview (hidden initially) -->
        <div id="file-preview" class="mt-2 hidden animate-fade-in-up">
            <div class="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-primary/20 shadow-sm relative overflow-hidden">
                <div class="bg-primary/10 size-12 rounded-lg flex items-center justify-center text-primary shrink-0"><span class="material-symbols-outlined">description</span></div>
                <div class="flex-1 min-w-0">
                    <p id="file-name" class="text-sm font-bold truncate text-slate-800"></p>
                    <p id="file-size" class="text-xs text-slate-500 mt-0.5"></p>
                </div>
                <button id="file-clear" class="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
            
            <button id="add-page-btn" class="mt-3 w-full border-2 border-dashed border-primary/30 rounded-xl py-3 text-primary/80 hover:text-primary text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors" onclick="window.app.showToast('Camera opening for page 2...', 'info')">
                <span class="material-symbols-outlined text-[18px]">note_add</span>
                Scan Another Page
            </button>
        </div>

        <!-- Error UI (hidden initially) -->
        <div id="upload-error" class="mt-4 hidden animate-fade-in-up">
            <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 items-start">
                <span class="material-symbols-outlined text-rose-500 shrink-0">error</span>
                <div>
                    <h3 class="font-bold text-rose-800 text-sm mb-1">Analysis Failed</h3>
                    <p id="error-message" class="text-xs text-rose-600 leading-relaxed"></p>
                    <button id="btn-retry" class="mt-3 bg-white border border-rose-200 text-rose-700 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-rose-50">Try Again</button>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-auto pt-10">
            <button id="upload-btn" disabled class="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="material-symbols-outlined">analytics</span>
                Upload &amp; Analyze
            </button>
            <p class="text-center text-[10px] text-slate-400 mt-4 px-4 uppercase tracking-wider font-semibold">End-to-end encrypted • HIPAA Compliant</p>
        </div>
    </main>

    <!-- Progressive Loading Overlay -->
    <div id="upload-overlay" class="hidden fixed inset-0 bg-white/95 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center px-6">
        <div class="max-w-xs w-full">
            <div class="flex justify-center mb-8 relative">
                <div style="width:72px;height:72px;border:4px solid #f1f5f9;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s ease-in-out infinite;"></div>
                <span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" style="font-size:32px">auto_awesome</span>
            </div>
            <h2 class="text-2xl font-bold text-center text-slate-800 mb-2">Analyzing...</h2>
            <p class="text-slate-500 text-sm text-center mb-8">Please wait while our AI processes your document.</p>
            
            <div class="space-y-4">
                <div id="step-upload" class="flex items-center gap-3">
                    <div class="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 transition-colors duration-300" id="icon-upload"><span class="size-2 bg-slate-400 rounded-full animate-pulse"></span></div>
                    <span class="text-sm font-semibold text-slate-700 transition-colors" id="text-upload">Uploading securely</span>
                </div>
                <div class="w-px h-4 bg-slate-200 ml-3 -my-3"></div>
                <div id="step-ocr" class="flex items-center gap-3 opacity-40 transition-opacity duration-300">
                    <div class="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 transition-colors duration-300" id="icon-ocr"><span class="size-2 bg-slate-400 rounded-full"></span></div>
                    <span class="text-sm font-semibold text-slate-700 transition-colors" id="text-ocr">Extracting text (OCR)</span>
                </div>
                <div class="w-px h-4 bg-slate-200 ml-3 -my-3"></div>
                <div id="step-meds" class="flex items-center gap-3 opacity-40 transition-opacity duration-300">
                    <div class="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 transition-colors duration-300" id="icon-meds"><span class="size-2 bg-slate-400 rounded-full"></span></div>
                    <div class="flex-1 flex justify-between items-center">
                        <span class="text-sm font-semibold text-slate-700 transition-colors" id="text-meds">Identifying medicines</span>
                        <span id="confidence-score" class="hidden text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase">94% Confidence</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;let e=null;const t=document.getElementById("file-input"),a=document.getElementById("camera-input"),i=document.getElementById("file-preview"),r=document.getElementById("upload-btn"),o=document.getElementById("upload-error"),n=16*1024*1024,l=["image/jpeg","image/jpg","image/png","application/pdf"],c=[".jpg",".jpeg",".png",".pdf"];function h(p){if(!p)return;o.classList.add("hidden");const f="."+p.name.split(".").pop().toLowerCase();if(!l.includes(p.type)&&!c.includes(f)){window.app.showToast("⚠️ Only JPG, PNG, or PDF files allowed","error");return}if(p.size>n){window.app.showToast(`⚠️ File too large (${(p.size/1024/1024).toFixed(1)}MB). Max 16MB allowed.`,"error");return}e=p,document.getElementById("file-name").textContent=p.name||"Captured Photo.jpg",document.getElementById("file-size").textContent=(p.size/1024/1024).toFixed(2)+" MB • Ready to analyze",i.classList.remove("hidden"),r.disabled=!1}t.addEventListener("change",p=>h(p.target.files[0])),a.addEventListener("change",p=>h(p.target.files[0])),(m=document.getElementById("file-clear"))==null||m.addEventListener("click",()=>{e=null,t.value="",a.value="",i.classList.add("hidden"),r.disabled=!0,o.classList.add("hidden")}),(d=document.getElementById("btn-retry"))==null||d.addEventListener("click",()=>{o.classList.add("hidden"),r.click()});function x(p,f){const u=document.getElementById(`icon-${p}`),b=document.getElementById(`step-${p}`);f==="active"?(b.classList.remove("opacity-40"),u.innerHTML='<span class="size-2 bg-primary rounded-full animate-pulse"></span>',u.className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-colors duration-300"):f==="done"&&(b.classList.remove("opacity-40"),u.innerHTML='<span class="material-symbols-outlined text-[14px]">check</span>',u.className="size-6 rounded-full bg-success text-white flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm shadow-success/30")}r.addEventListener("click",async()=>{if(!e)return;const p=document.getElementById("upload-overlay");p.classList.remove("hidden"),r.disabled=!0,o.classList.add("hidden"),x("upload","active"),x("ocr","pending"),x("meds","pending");try{const f=new FileReader;f.onload=async function(){var u;try{const b=f.result.split(",")[1];setTimeout(()=>{x("upload","done"),x("ocr","active")},800),setTimeout(()=>{x("ocr","done"),x("meds","active")},2e3);const $=await T.uploadPrescription(b);if(x("meds","done"),(u=document.getElementById("confidence-score"))==null||u.classList.remove("hidden"),$.prescription_id&&b)try{await We($.prescription_id,b)}catch(v){console.warn("Local image save failed (non-critical):",v)}if($.prescription_id)try{const v=await T.getPrescription($.prescription_id),w=(v.prescription||v).medicines||[];let S=0;for(const k of w)!k.name||(await Ge(k.name)).length>0||(await Ee(k.name,k.dosage||"",["08:00","20:00"]),S++);S>0&&console.log(`Auto-set ${S} medicine reminders`)}catch(v){console.warn("Auto-reminder setup failed (non-critical):",v)}setTimeout(()=>{var v;p.classList.add("hidden"),(v=document.getElementById("confidence-score"))==null||v.classList.add("hidden"),window.app.showToast("✅ Prescription analyzed!","success"),$.prescription_id?window.app.navigateTo("detail",{id:$.prescription_id}):window.app.navigateTo("dashboard")},1200)}catch(b){p.classList.add("hidden"),document.getElementById("error-message").textContent=b.message||"❌ Upload failed. Please try again.",window.app.showToast("❌ Upload failed. Please try again.","error"),o.classList.remove("hidden"),r.disabled=!1}},f.readAsDataURL(e)}catch(f){p.classList.add("hidden"),document.getElementById("error-message").textContent=f.message||"Failed to read file.",o.classList.remove("hidden"),r.disabled=!1}})}async function Qe(s){let e={};try{e=await T.getPrescriptions(1,100)}catch(n){console.warn("History API error",n)}let t=e.prescriptions||[];e.total||t.length;function a(n){return n.length?`
        <div class="space-y-4">
            ${n.map(l=>{var u,b,$;const c=l.status==="processed"||l.ocr_text,h=c?"bg-green-100 text-green-800":"bg-amber-100 text-amber-800",x=c?"Processed":"Pending",m=l.diagnosis||l.title||((u=l.doctor_summary)==null?void 0:u.substring(0,30))||"Medical Prescription",d=((b=l.medicines)==null?void 0:b.length)||Math.floor(Math.random()*4)+1,p=l.image_url||null,f=l.prescription_id||l.id;return`
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-primary/50 transition-colors group rx-card" data-id="${f}">
                    <div class="flex items-start p-4 gap-4 cursor-pointer rx-card-content" data-id="${f}">
                        <div class="w-16 h-20 bg-slate-100 rounded-lg shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                            ${p?`<img src="${p}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-slate-400">receipt_long</span>'}
                            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between mb-1.5">
                                <h3 class="font-bold text-slate-800 text-sm truncate pr-2">${m}</h3>
                                <span class="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${h}">${x}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                <span class="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>${l.upload_date||l.date||"Recent"}</span>
                                <span class="text-slate-300">•</span>
                                <span class="font-mono text-[10px]">ID #${(f||"N/A").toString().substring(0,5)}</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <span class="material-symbols-outlined text-[14px] text-teal-500">pill</span> ${d} Meds
                                </span>
                                ${($=l.medical_tests)!=null&&$.length?`
                                <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <span class="material-symbols-outlined text-[14px] text-blue-500">science</span> ${l.medical_tests.length} Tests
                                </span>`:""}
                            </div>
                        </div>
                    </div>
                    <!-- Delete Action Row -->
                    <div class="flex items-center justify-end px-4 pb-3 pt-0 border-t border-slate-50">
                        <button class="rx-delete-btn text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1" data-id="${f}" data-title="${m}">
                            <span class="material-symbols-outlined text-[14px]">delete</span> Delete
                        </button>
                    </div>
                </div>`}).join("")}
        </div>`:`
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center my-6">
                <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                <p class="text-slate-500 mb-4">No records found matching your search.</p>
            </div>`}s.innerHTML=`
    <!-- Header -->
    <header class="bg-white border-b border-primary/10 sticky top-0 z-10 shadow-sm">
        <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2">
                    <span class="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <h1 class="text-xl font-bold tracking-tight">Records</h1>
            </div>
            <button onclick="app.navigateTo('scan')" class="text-primary hover:bg-primary/10 font-bold p-2 rounded-full flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined">add</span>
            </button>
        </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6 mb-24 page-enter">
        ${t.length?`
        <!-- Search & Filter -->
        <div class="mb-6 flex gap-3 sticky top-20 z-10 bg-[#f5f8f8] py-2">
            <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input id="history-search" class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm shadow-sm transition-all" placeholder="Search diagnosis or date..." type="text">
            </div>
            <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <span class="material-symbols-outlined">filter_list</span>
            </button>
        </div>

        <!-- List Container -->
        <div id="history-list-container">
            ${a(t)}
        </div>
        `:`
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center mt-4 border-dashed">
            <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-4xl text-primary">post_add</span>
            </div>
            <h2 class="text-lg font-bold text-slate-800 mb-2">No records yet</h2>
            <p class="text-slate-500 text-sm mb-8 px-4">Keep all your medical prescriptions and lab reports digitized in one place.</p>
            <button onclick="app.navigateTo('scan')" class="bg-primary hover:bg-primary/90 text-white w-full py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Digitize First Record
            </button>
        </div>`}
    </main>`;const i=document.getElementById("history-search");i&&i.addEventListener("input",n=>{const l=n.target.value.toLowerCase(),c=t.filter(h=>`${h.diagnosis||""} ${h.title||""} ${h.upload_date||""} ${h.ocr_text||""}`.toLowerCase().includes(l));document.getElementById("history-list-container").innerHTML=a(c),r(),o()});function r(){s.querySelectorAll(".rx-card-content").forEach(n=>{n.addEventListener("click",()=>window.app.navigateTo("detail",{id:n.dataset.id}))})}function o(){s.querySelectorAll(".rx-delete-btn").forEach(n=>{n.addEventListener("click",async l=>{l.stopPropagation();const c=n.dataset.id,h=n.dataset.title;if(await window.app.showConfirmModal("Delete Prescription?",`Delete "${h}"? This cannot be undone.`,"Delete"))try{await T.deletePrescription(c),t=t.filter(m=>(m.prescription_id||m.id)!=c),document.getElementById("history-list-container").innerHTML=a(t),r(),o(),window.app.showToast("🗑️ Prescription deleted","success")}catch(m){window.app.showToast(m.message||"❌ Delete failed","error")}})})}r(),o()}async function Xe(s){s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 shadow-sm">
        <div class="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
            <button onclick="app.navigateTo('dashboard')" class="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-lg font-bold tracking-tight">Health Timeline</h1>
            <div class="w-10"></div>
        </div>
    </header>

    <div class="px-4 py-4 max-w-2xl mx-auto sticky top-16 z-40 bg-[#f5f8f8]">
        <div class="h-12 bg-slate-200 rounded-xl animate-pulse mb-4"></div>
        <div class="flex gap-2">
            <div class="h-8 w-20 bg-slate-200 rounded-full animate-pulse"></div>
            <div class="h-8 w-24 bg-slate-200 rounded-full animate-pulse"></div>
            <div class="h-8 w-24 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
    </div>

    <main class="max-w-2xl mx-auto px-4 space-y-8 pb-24 mt-6">
        <div class="space-y-6 relative pl-6">
            <div class="absolute left-[19px] top-4 bottom-0 w-0.5 bg-slate-200"></div>
            <!-- Skeleton Items -->
            ${[1,2,3].map(()=>`
            <div class="relative pl-8">
                <div class="absolute left-[-23px] top-1 size-10 rounded-full bg-slate-200 animate-pulse border-4 border-white"></div>
                <div class="bg-white rounded-xl p-5 border border-slate-100 h-32 animate-pulse">
                    <div class="h-3 w-20 bg-slate-200 rounded mb-4"></div>
                    <div class="h-5 w-3/4 bg-slate-200 rounded mb-3"></div>
                    <div class="h-3 w-full bg-slate-200 rounded mb-2"></div>
                    <div class="h-3 w-5/6 bg-slate-200 rounded"></div>
                </div>
            </div>`).join("")}
        </div>
    </main>`;let e={};try{await new Promise(u=>setTimeout(u,600)),e=await T.getTimeline(1,100)}catch(u){console.warn("Timeline API error",u)}const t=e.events||[];function a(u){const b=(u||"").toLowerCase();return b.includes("dental")||b.includes("tooth")?{color:"text-indigo-500",bg:"bg-indigo-100",ring:"ring-indigo-100",icon:"dentistry"}:b.includes("cardio")||b.includes("heart")?{color:"text-rose-500",bg:"bg-rose-100",ring:"ring-rose-100",icon:"cardiology"}:b.includes("eye")||b.includes("vision")?{color:"text-sky-500",bg:"bg-sky-100",ring:"ring-sky-100",icon:"visibility"}:b.includes("lab")||b.includes("blood")?{color:"text-purple-500",bg:"bg-purple-100",ring:"ring-purple-100",icon:"water_drop"}:{color:"text-primary",bg:"bg-primary/20",ring:"ring-primary/10",icon:"stethoscope"}}function i(u){if(!u.length)return`
            <div class="text-center py-20">
                <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                <h3 class="text-lg font-bold text-slate-700 mb-2">No timeline events found</h3>
                <p class="text-sm text-slate-500 mb-6">Try adjusting your search filters.</p>
            </div>`;const b={};return u.forEach(v=>{const w=new Date(v.date||v.upload_date).toLocaleString("en-US",{month:"long",year:"numeric"});b[w]||(b[w]=[]),b[w].push(v)}),Object.keys(b).map((v,y)=>`
        <section class="relative">
            <div class="sticky top-16 z-30 py-2 bg-[#f5f8f8]">
                <h2 class="font-mono text-sm font-bold ${y===0?"text-primary":"text-slate-500"} tracking-widest uppercase flex items-center gap-2">
                    ${y===0?'<span class="size-2 rounded-full bg-primary animate-pulse"></span>':""}
                    ${v}
                </h2>
            </div>
            <div class="mt-4 space-y-6 relative">
                <div class="timeline-line absolute left-[19px] top-4 bottom-0 w-0.5 bg-slate-200" style="z-index: 0;"></div>
                ${b[v].map((w,S)=>{const k=y===0&&S===0,E=a(w.title||w.diagnosis),g=k?`size-10 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center relative z-10 ${E.color} ${E.bg} ring-4 ${E.ring}`:"size-10 rounded-full bg-slate-50 border-4 border-white flex items-center justify-center relative z-10 text-slate-400",L=k?E.icon:"radio_button_checked",_=new Date(w.date||w.upload_date).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"});return`
                    <article class="relative pl-14 cursor-pointer group" data-id="${w.prescription_id||w.id||""}">
                        <div class="absolute left-0 top-1">
                            <div class="${g}">
                                <span class="material-symbols-outlined text-[18px]">${L}</span>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-primary/30 transition-all">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-mono font-bold text-slate-500">${_}</span>
                                <span class="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-200">
                                    <span class="material-symbols-outlined text-[12px] ${E.color}">medical_services</span> Visit
                                </span>
                            </div>
                            <h3 class="text-lg font-bold text-slate-800 mb-2 leading-tight">${w.title||w.diagnosis||"Medical Visit"}</h3>
                            <p class="text-sm text-slate-600 leading-relaxed mb-4">${w.description||w.clinical_summary||w.patient_summary||""}</p>
                            ${w.ai_summary||w.details?`
                            <div class="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                                    <span class="text-[10px] font-bold uppercase tracking-tighter text-primary">AI Insight</span>
                                </div>
                                <p class="text-xs italic text-slate-700">${w.ai_summary||w.details||""}</p>
                            </div>`:""}
                            
                            <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>View Details</span>
                                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </div>
                        </div>
                    </article>`}).join("")}
            </div>
        </section>`).join("")}s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 shadow-sm animate-fade-in-up">
        <div class="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
            <button onclick="app.navigateTo('dashboard')" class="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-lg font-bold tracking-tight">Health Timeline</h1>
            <div class="w-10"></div>
        </div>
    </header>

    <!-- Search and Filters -->
    <div class="px-4 py-4 max-w-2xl mx-auto sticky top-16 z-40 bg-[#f5f8f8] animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="flex items-center gap-3 mb-4">
            <div class="relative group flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input id="timeline-search" class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" placeholder="Search diagnoses or dates..." type="text">
            </div>
            
            <div class="flex items-center bg-slate-200/60 p-1 rounded-xl shrink-0">
                <button class="size-10 rounded-lg bg-white shadow-sm text-primary flex items-center justify-center transition-all" title="List View">
                    <span class="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                </button>
                <button class="size-10 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all" title="Calendar View" onclick="window.app.showToast('Calendar view coming soon', 'info')">
                    <span class="material-symbols-outlined text-[20px]">calendar_month</span>
                </button>
            </div>
        </div>
        
        <!-- Filter Chips -->
        <div class="flex gap-2 overflow-x-auto hide-scrollbar mt-3 pb-1">
            <button class="filter-chip active px-3 py-1.5 rounded-full bg-slate-800 text-white text-[11px] font-bold whitespace-nowrap" data-filter="">All History</button>
            <button class="filter-chip px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold whitespace-nowrap hover:bg-slate-50" data-filter="dental">Dental</button>
            <button class="filter-chip px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold whitespace-nowrap hover:bg-slate-50" data-filter="cardio">Cardiology</button>
            <button class="filter-chip px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold whitespace-nowrap hover:bg-slate-50" data-filter="lab">Lab Results</button>
        </div>
    </div>

    <main class="max-w-2xl mx-auto px-4 space-y-8 pb-24 page-enter">
        <div id="timeline-list">
            ${i(t)}
        </div>
    </main>

    <!-- FAB -->
    <button onclick="app.navigateTo('scan')" class="fixed bottom-24 right-4 size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 animate-fade-in-up" style="animation-delay: 0.3s;">
        <span class="material-symbols-outlined text-3xl">add</span>
    </button>`;let r=!1,o=new Date;function n(){if(!t.length)return i([]);const u=o.getFullYear(),b=o.getMonth(),$=new Date(u,b,1),v=new Date(u,b+1,0),y=$.getDay(),w=v.getDate(),S=["January","February","March","April","May","June","July","August","September","October","November","December"];let k=`
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
            <div class="flex items-center justify-between mb-4">
                <button id="prev-month" class="p-2 hover:bg-slate-100 rounded-lg transition-colors"><span class="material-symbols-outlined text-slate-600">chevron_left</span></button>
                <h2 class="text-lg font-bold text-slate-800">${S[b]} ${u}</h2>
                <button id="next-month" class="p-2 hover:bg-slate-100 rounded-lg transition-colors"><span class="material-symbols-outlined text-slate-600">chevron_right</span></button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center mb-2">
                ${["Su","Mo","Tu","We","Th","Fr","Sa"].map(L=>`<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${L}</div>`).join("")}
            </div>
            <div class="grid grid-cols-7 gap-1 text-center">
        `,E=1;for(let L=0;L<42;L++)if(L<y||E>w)k+='<div class="p-2 h-10"></div>';else{const I=new Date(u,b,E).toDateString(),_=t.filter(R=>new Date(R.date||R.upload_date).toDateString()===I),X=_.length>0?"bg-primary/10 text-primary font-bold border border-primary/20":"text-slate-600 hover:bg-slate-50",ee=new Date().toDateString()===I?"ring-2 ring-primary ring-offset-1":"";k+=`
                <button data-date="${u}-${b+1}-${E}" class="calendar-day p-0 w-full aspect-square rounded-lg flex flex-col items-center justify-center relative transition-colors ${X} ${ee}">
                    <span>${E}</span>
                    ${_.length>0?'<div class="absolute bottom-1 w-1 h-1 rounded-full bg-primary"></div>':""}
                </button>`,E++}k+="</div></div>";const g=t.filter(L=>{const I=new Date(L.date||L.upload_date);return I.getMonth()===b&&I.getFullYear()===u});return k+=`<div id="calendar-events-list">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Events in ${S[b]}</h3>
            ${i(g)}
        </div>`,k}const l=s.querySelector('button[title="List View"]'),c=s.querySelector('button[title="Calendar View"]'),h=document.getElementById("timeline-list");function x(){var u,b;r?(l.classList.replace("bg-white","text-slate-400"),l.classList.replace("text-primary","hover:text-slate-600"),l.classList.replace("shadow-sm","bg-transparent"),c.classList.replace("text-slate-400","text-primary"),c.classList.replace("hover:text-slate-600","bg-white"),c.classList.add("shadow-sm"),h.innerHTML=n(),(u=document.getElementById("prev-month"))==null||u.addEventListener("click",()=>{o.setMonth(o.getMonth()-1),x()}),(b=document.getElementById("next-month"))==null||b.addEventListener("click",()=>{o.setMonth(o.getMonth()+1),x()}),s.querySelectorAll(".calendar-day").forEach($=>{$.addEventListener("click",()=>{if(!$.dataset.date)return;const v=new Date($.dataset.date),y=t.filter(w=>new Date(w.date||w.upload_date).toDateString()===v.toDateString());y.length?(document.getElementById("calendar-events-list").innerHTML=`
                            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Events on ${v.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</h3>
                            ${i(y)}
                        `,f()):window.app.showToast("No events on this date","info")})})):(c.classList.replace("bg-white","text-slate-400"),c.classList.replace("text-primary","hover:text-slate-600"),c.classList.remove("shadow-sm"),l.classList.replace("text-slate-400","text-primary"),l.classList.replace("hover:text-slate-600","bg-white"),l.classList.add("shadow-sm"),p()),f()}l.addEventListener("click",()=>{r=!1,x()}),c.removeAttribute("onclick"),c.addEventListener("click",()=>{r=!0,x()});const m=document.getElementById("timeline-search");let d="";function p(){if(r)return;const u=m.value.toLowerCase(),b=t.filter($=>{const v=`${$.diagnosis||""} ${$.title||""} ${$.upload_date||""} ${$.description||""}`.toLowerCase(),y=v.includes(u),w=d?v.includes(d):!0;return y&&w});h.innerHTML=i(b),f()}m==null||m.addEventListener("input",p),s.querySelectorAll(".filter-chip").forEach(u=>{u.addEventListener("click",()=>{r||(s.querySelectorAll(".filter-chip").forEach(b=>{b.classList.remove("bg-slate-800","text-white"),b.classList.add("bg-white","border-slate-200","text-slate-600")}),u.classList.remove("bg-white","border-slate-200","text-slate-600"),u.classList.add("bg-slate-800","text-white"),d=u.dataset.filter,p())})});function f(){s.querySelectorAll("article[data-id]").forEach(u=>{u.addEventListener("click",()=>{u.dataset.id&&window.app.navigateTo("detail",{id:u.dataset.id})})})}f()}async function et(s,e){var k,E;if(!e){window.app.navigateTo("history");return}let t={};try{const g=await T.getPrescription(e);t=g.prescription||g}catch(g){throw g}const a=t.medicines||[],i=t.medical_tests||t.tests||[],r=t.image_url||"",o=t.prescription_date||t.upload_date||t.date||"",n=t.upload_date||"";let l=null,c=!1;try{l=await Je(e),c=await Ye(e)}catch{}const h=l?`data:image/jpeg;base64,${l.data}`:r,x=t.ocr_text||"",m=t.patient_info||{},d=t.doctor_info||{},p=tt(x),f={name:m.name||p.name||"",id:m.patient_id||p.id||"",age:m.age||p.age||"",gender:m.gender||p.gender||"",mobile:m.mobile||p.mobile||"",address:m.address||p.address||"",visitType:m.visit_type||p.visitType||"",referredBy:p.referredBy||""},u=st(x),b={name:d.name||u.name||"Doctor name not found",qualifications:[d.qualifications,d.specialty].filter(Boolean).join(" • ")||u.qualifications||"",hospital:d.hospital||u.hospital||""},$=at(x);rt(x,t.key_insights);const v=it(x,a),y=o?fe(o):"Not available",w=n?fe(n):"";s.innerHTML=`
    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2" title="Back to Dashboard">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-sm font-bold mono-heading text-primary">PRESCRIPTION_REPORT</h1>
        </div>
        <div class="flex gap-1 -mr-2">
            <button onclick="app.navigateTo('history')" class="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View All Prescriptions">All Records</button>
            <button id="share-btn" class="p-2 hover:bg-primary/10 rounded-full transition-colors text-slate-600"><span class="material-symbols-outlined">share</span></button>
        </div>
    </nav>

    <main class="max-w-2xl mx-auto p-4 space-y-5 pb-28 page-enter">

        <!-- ═══════════ PATIENT INFORMATION ═══════════ -->
        <section class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
            <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary text-lg">person</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-white/60">Patient Information</h3>
            </div>
            <div class="flex items-center gap-4 mb-4">
                <div class="size-14 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold border border-white/20">
                    ${(f.name||"P")[0].toUpperCase()}
                </div>
                <div>
                    <h2 class="text-xl font-bold">${f.name||"Patient Name Not Found"}</h2>
                    ${f.id?`<span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">ID: ${f.id}</span>`:""}
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <div><p class="text-[10px] text-white/40 uppercase tracking-wider">Age</p><p class="font-semibold text-sm">${f.age||"-"}</p></div>
                <div><p class="text-[10px] text-white/40 uppercase tracking-wider">Gender</p><p class="font-semibold text-sm">${f.gender||"-"}</p></div>
                ${f.mobile?`<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Mobile</p><p class="font-semibold text-sm">${f.mobile}</p></div>`:""}
                ${f.address?`<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Address</p><p class="font-semibold text-sm">${f.address}</p></div>`:""}
                ${f.visitType?`<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Visit Type</p><p class="font-semibold text-sm">${f.visitType}</p></div>`:""}
                ${f.referredBy?`<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Referred By</p><p class="font-semibold text-sm">${f.referredBy}</p></div>`:""}
                <div><p class="text-[10px] text-white/40 uppercase tracking-wider">Visit Date</p><p class="font-semibold text-sm">${y}</p></div>
            </div>
        </section>

        <!-- ═══════════ DOCTOR INFORMATION ═══════════ -->
        <section class="bg-blue-50/70 border border-blue-100 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">stethoscope</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-blue-400">Doctor Information</h3>
            </div>
            <div class="flex items-center gap-3">
                <div class="size-12 rounded-full bg-white border border-blue-200 text-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                    <span class="material-symbols-outlined text-[24px]">stethoscope</span>
                </div>
                <div>
                    <h3 class="font-bold text-slate-800 text-base">${b.name}</h3>
                    ${b.qualifications?`<p class="text-xs text-slate-500 mt-1 leading-relaxed">${b.qualifications}</p>`:""}
                    ${b.hospital?`<p class="text-[10px] text-blue-500 font-semibold mt-1">${b.hospital}</p>`:""}
                </div>
            </div>
        </section>



        <!-- ═══════════ VITAL SIGNS ═══════════ -->
        ${$.length?`
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-rose-500 text-lg">monitor_heart</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Vital Signs</h3>
            </div>
            <div class="grid grid-cols-3 gap-3">
                ${$.map(g=>`
                <div class="bg-white border border-slate-100 rounded-xl p-3 shadow-sm text-center">
                    <span class="material-symbols-outlined text-${g.color} text-lg mb-1">${g.icon}</span>
                    <p class="text-lg font-bold text-slate-800">${g.value}</p>
                    <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">${g.label}</p>
                </div>`).join("")}
            </div>
        </section>`:""}

        <!-- ═══════════ IMAGE PREVIEW ═══════════ -->
        ${h?`
        <section class="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-white">
            ${c?'<div class="absolute top-3 right-3 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md"><span class="material-symbols-outlined text-[12px]">lock</span> Stored Locally</div>':""}
            <div class="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style="background-image:url('${h}');background-color:#f1f5f9;"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                <button id="view-scan-btn" class="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors border border-white/20">
                    <span class="material-symbols-outlined text-sm">fullscreen</span>View Original Scan
                </button>
            </div>
        </section>`:""}

        <!-- ═══════════ PATIENT SUMMARY ═══════════ -->
        ${t.patient_summary?`
        <section class="bg-primary/5 border border-primary/15 rounded-xl p-5 relative overflow-hidden">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-primary text-lg">summarize</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-primary">Patient Summary</h3>
            </div>
            <p class="text-slate-800 leading-relaxed font-medium">${t.patient_summary}</p>
        </section>`:""}

        <!-- ═══════════ CLINICAL SUMMARY ═══════════ -->
        ${t.doctor_summary?`
        <section class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-slate-500 text-lg">clinical_notes</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Clinical Summary</h3>
            </div>
            <p class="text-sm text-slate-700 italic leading-relaxed">${t.doctor_summary}</p>
        </section>`:""}

        <!-- ═══════════ MEDICINES ═══════════ -->
        ${a.length?`
        <section>
            <div class="flex items-center justify-between mb-3 px-1">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-teal-500 text-lg">medication</span>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Medicines (${a.length})</h3>
                </div>
            </div>
            <div class="space-y-3">
                ${a.map((g,L)=>`
                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="size-8 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 text-sm font-bold">${L+1}</div>
                            <div>
                                <h4 class="font-bold text-slate-800 text-base">${g.name||""}</h4>
                                ${g.dosage?`<span class="text-xs text-slate-500">${g.dosage}</span>`:""}
                            </div>
                        </div>
                        <button onclick="app.navigateTo('chat', {q: 'Explain what ${g.name} is used for, side effects, and precautions'})" class="text-[10px] text-primary font-bold flex items-center gap-0.5 bg-primary/5 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors shrink-0">
                            <span class="material-symbols-outlined text-[12px]">auto_awesome</span> AI Info
                        </button>
                        <button class="set-reminder-btn text-[10px] text-amber-600 font-bold flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors shrink-0" data-name="${g.name}" data-dosage="${g.dosage||""}">
                            <span class="material-symbols-outlined text-[12px]">alarm_add</span> Remind
                        </button>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-50">
                        <div>
                            <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Frequency</p>
                            <p class="text-xs font-semibold text-slate-700 mt-0.5">${g.frequency||"—"}</p>
                        </div>
                        <div>
                            <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Duration</p>
                            <p class="text-xs font-semibold text-slate-700 mt-0.5">${g.duration||"—"}</p>
                        </div>
                        <div>
                            <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Timing</p>
                            <p class="text-xs font-semibold text-slate-700 mt-0.5">${g.timing||"—"}</p>
                        </div>
                    </div>
                    ${g.instructions?`
                    <div class="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-2.5 flex items-start gap-2">
                        <span class="material-symbols-outlined text-amber-500 text-[14px] mt-0.5 shrink-0">info</span>
                        <p class="text-xs text-amber-700 leading-relaxed">${g.instructions}</p>
                    </div>`:""}
                </div>`).join("")}
            </div>
        </section>`:""}

        <!-- ═══════════ MEDICAL TESTS ═══════════ -->
        ${i.length?`
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">science</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Medical Tests (${i.length})</h3>
            </div>
            <div class="space-y-3">
                ${i.map(g=>{const L=(g.status||"").toLowerCase().includes("action")||(g.status||"").toLowerCase().includes("urgent"),I=L?"bg-orange-100 text-orange-700":"bg-slate-100 text-slate-600";return`
                    <div class="flex items-center justify-between p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg ${L?"bg-orange-100 text-orange-600":"bg-blue-50 text-blue-500"} flex items-center justify-center"><span class="material-symbols-outlined">science</span></div>
                            <div>
                                <p class="font-bold text-sm">${g.test_name||g.name||""}</p>
                                ${g.instructions?`<p class="text-xs text-slate-500 mt-0.5">${g.instructions}</p>`:""}
                            </div>
                        </div>
                        <span class="px-2.5 py-1 ${I} rounded-full text-[10px] font-bold uppercase shrink-0">${g.status||"Pending"}</span>
                    </div>`}).join("")}
            </div>
        </section>`:""}

        <!-- ═══════════ SPECIAL INSTRUCTIONS ═══════════ -->
        ${v.length?`
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-amber-500 text-lg">warning</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Special Instructions</h3>
            </div>
            <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                ${v.map(g=>`
                <div class="flex items-start gap-2">
                    <span class="material-symbols-outlined text-amber-500 text-[16px] mt-0.5 shrink-0">check_circle</span>
                    <p class="text-sm text-amber-800 leading-relaxed">${g}</p>
                </div>`).join("")}
            </div>
        </section>`:""}

        <!-- ═══════════ RAW OCR ═══════════ -->
        ${t.ocr_text?`
        <section class="border-t border-slate-200 pt-5">
            <details class="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                <summary class="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-slate-100 transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">terminal</span>
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">Raw OCR Data</span>
                    </div>
                    <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div class="font-mono text-[11px] text-slate-500 overflow-x-auto whitespace-pre-wrap px-4 pb-4 leading-relaxed border-t border-slate-200 bg-slate-100/50">${t.ocr_text}</div>
            </details>
        </section>`:""}

        <!-- ═══════════ METADATA ═══════════ -->
        <section class="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <div class="grid grid-cols-2 gap-3 text-center">
                <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Prescription Date</p>
                    <p class="text-sm font-bold text-slate-700 mt-0.5">${y}</p>
                </div>
                <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Uploaded</p>
                    <p class="text-sm font-bold text-slate-700 mt-0.5">${w||"N/A"}</p>
                </div>
            </div>
        </section>

        <!-- Delete -->
        <div class="pt-4 pb-4 text-center">
            <button id="delete-rx" class="text-xs font-bold text-red-400 hover:text-red-500 hover:underline transition-colors py-2 px-4 rounded-lg hover:bg-red-50 inline-flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">delete</span> Delete Record permanently
            </button>
        </div>
    </main>

    <!-- FAB -->
    <button onclick="app.navigateTo('pharma')" class="fixed right-6 bottom-8 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
        <span class="material-symbols-outlined text-3xl text-white">local_pharmacy</span>
    </button>`,(k=document.getElementById("share-btn"))==null||k.addEventListener("click",async()=>{const g={title:`Medi-Sum: ${f.name||"Prescription"}`,text:`Medical Record (${a.length} medicines, ${i.length} tests). ${t.patient_summary||""}`,url:window.location.href};try{navigator.share?await navigator.share(g):(navigator.clipboard.writeText(g.text),window.app.showToast("📋 Copied to clipboard","info"))}catch(L){console.warn("Share error",L)}});const S=document.getElementById("view-scan-btn");S&&S.addEventListener("click",()=>{const g=document.createElement("div");g.className="fixed inset-0 z-[100] bg-black/90 flex flex-col backdrop-blur-sm animate-fade-in animate-fast",g.innerHTML=`
                <div class="flex justify-between items-center p-4">
                    <span class="text-white/60 text-sm font-medium tracking-wide">Original Scan</span>
                    <button id="close-scan-btn" class="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="flex-1 overflow-auto flex items-center justify-center p-2 pb-10">
                    <img src="${h}" class="max-w-full max-h-full object-contain rounded border-4 border-white/10" alt="Prescription Scan">
                </div>
             `,document.body.appendChild(g);const L=g.querySelector("#close-scan-btn"),I=()=>{g.classList.add("animate-fade-out"),setTimeout(()=>g.remove(),200)};L.addEventListener("click",I),g.addEventListener("click",_=>{(_.target===g||_.target.classList.contains("flex-1"))&&I()})}),(E=document.getElementById("delete-rx"))==null||E.addEventListener("click",async()=>{if(await window.app.showConfirmModal("Delete Prescription?","Delete this prescription? This cannot be undone.","Delete"))try{await T.deletePrescription(e),window.app.showToast("🗑️ Prescription deleted","success"),window.app.navigateTo("history")}catch(L){window.app.showToast(L.message||"❌ Delete failed","error")}}),s.querySelectorAll(".set-reminder-btn").forEach(g=>{g.addEventListener("click",async()=>{const L=g.dataset.name,I=g.dataset.dosage;if(L)try{await Ee(L,I),g.innerHTML='<span class="material-symbols-outlined text-[12px]">check</span> Set!',g.classList.remove("text-amber-600","bg-amber-50","hover:bg-amber-100"),g.classList.add("text-emerald-600","bg-emerald-50"),g.disabled=!0,window.app.showToast(`🔔 Reminder set for ${L}`,"success")}catch{window.app.showToast("Failed to set reminder","error")}})})}function fe(s){if(!s)return"";try{return new Date(s).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}catch{return s}}function tt(s){const e={name:"",id:"",age:"",gender:"",mobile:"",address:"",visitType:"",referredBy:""};if(!s)return e;const t=s.match(/(?:Patient\s*(?:Name)?|Mrs?\.|Miss)\s*[:\.]?\s*([A-Z][A-Za-z\s.]+?)(?:\n|$|Patient)/i);t&&(e.name=t[1].trim());const a=s.match(/(?:Patient\s*ID|UHID|MRN|Reg(?:istration)?\s*No)\s*[:\.]?\s*(\S+)/i);a&&(e.id=a[1].trim());const i=s.match(/(?:Age)\s*[:\.]?\s*(\d+\s*(?:years?|yrs?|Y)?)/i);i&&(e.age=i[1].trim());const r=s.match(/(?:Sex|Gender)\s*[:\.]?\s*(Male|Female|M|F|Other)/i);if(r){const h=r[1].trim().toUpperCase();e.gender=h==="M"?"Male":h==="F"?"Female":r[1].trim()}if(!e.gender||!e.age){const h=s.match(/(?:Age\s*\/\s*Sex|Age\/Sex)\s*[:\.]?\s*(\d+)\s*(?:years?|yrs?|Y)?[\s\/]*(Male|Female|M|F)?/i);if(h&&(!e.age&&h[1]&&(e.age=h[1].trim()),!e.gender&&h[2])){const x=h[2].trim().toUpperCase();e.gender=x==="M"?"Male":x==="F"?"Female":h[2].trim()}}const o=s.match(/(?:Mobile|Phone|Contact|Tel)\s*[:\.]?\s*(\d[\d\s-]{8,})/i);o&&(e.mobile=o[1].trim());const n=s.match(/(?:Address)\s*[:\.]?\s*(.+?)(?:\n|$)/i);n&&(e.address=n[1].trim());const l=s.match(/(?:Visit\s*Type|Consultation\s*Type)\s*[:\.]?\s*(.+?)(?:\n|$)/i);l&&(e.visitType=l[1].trim());const c=s.match(/(?:Referred?\s*By|Ref(?:erral)?)\s*[:\.]?\s*(.+?)(?:\n|$)/i);return c&&(e.referredBy=c[1].trim()),e}function st(s,e){const t={name:"",qualifications:"",hospital:""};if(!s)return{...t,name:t.name||"Doctor name not found"};if(!t.name){const o=s.match(/(?:Dr\.?\s+)([A-Z][A-Za-z\s.]+?)(?:\n|MBBS|MD|MS|Consultant|$)/i);o&&(t.name="Dr. "+o[1].trim().replace(/^Dr\.?\s*/i,""))}t.name||(t.name="Doctor name not found");const a=s.match(/((?:MBBS|MD|MS|DNB|DM|MCh|FRCS|MRCP|DCH|DGO|DA)[A-Za-z\s,.\(\)]*)/i);a&&(t.qualifications=a[1].trim());const i=s.match(/(?:Consultant|Specialist|Speciality|Department)\s*[:\.]?\s*(.+?)(?:\n|$)/i);i&&!t.qualifications.includes(i[1].trim())&&(t.qualifications=t.qualifications?t.qualifications+" • "+i[1].trim():i[1].trim());const r=s.match(/(?:Hospital|Clinic|Medical\s*Centre|Health\s*Center)\s*[:\.]?\s*(.+?)(?:\n|$)/i);return r&&(t.hospital=r[1].trim()),t}function at(s){const e=[];if(!s)return e;const t=s.match(/(?:BP|Blood\s*Pressure)\s*[:\.]?\s*(\d{2,3}\s*\/\s*\d{2,3})\s*(?:mmHg)?/i);t&&e.push({label:"BP",value:t[1].trim()+" mmHg",icon:"favorite",color:"rose-500"});const a=s.match(/(?:SpO2|Oxygen\s*Saturation|O2\s*Sat)\s*[:\.]?\s*(\d{2,3})\s*%?/i);a&&e.push({label:"SpO2",value:a[1].trim()+"%",icon:"pulmonology",color:"blue-500"});const i=s.match(/(?:PR|Pulse\s*Rate|Heart\s*Rate|HR)\s*[:\.]?\s*(\d{2,3})\s*(?:bpm|\/min)?/i);i&&e.push({label:"Pulse",value:i[1].trim()+" bpm",icon:"ecg_heart",color:"amber-500"});const r=s.match(/(?:Temp(?:erature)?)\s*[:\.]?\s*(\d{2,3}(?:\.\d)?)\s*(?:°?[FC])?/i);r&&e.push({label:"Temp",value:r[1].trim()+"°F",icon:"thermostat",color:"orange-500"});const o=s.match(/(?:Weight|Wt)\s*[:\.]?\s*(\d{2,3}(?:\.\d)?)\s*(?:kg|lbs?)?/i);o&&e.push({label:"Weight",value:o[1].trim()+" kg",icon:"monitor_weight",color:"teal-500"});const n=s.match(/(?:Height|Ht)\s*[:\.]?\s*(\d{2,3}(?:\.\d)?)\s*(?:cm|ft|inches)?/i);return n&&e.push({label:"Height",value:n[1].trim()+" cm",icon:"height",color:"purple-500"}),e}function rt(s,e){const t={diagnosis:""};if(!s)return t;const a=s.match(/(?:Diagnosis|Dx|Chief\s*Complaint|Impression|Initial\s*Diagnosis)\s*[:\.]?\s*(.+?)(?:\n|$)/i);if(a&&(t.diagnosis=a[1].trim()),!t.diagnosis){const i=s.match(/(?:Complaint|C\/O|Presenting)\s*[:\.]?\s*(.+?)(?:\n|$)/i);i&&(t.diagnosis=i[1].trim())}return t}function it(s,e){const t=[];if(!s)return t;const a=s.match(/(?:Follow\s*Up|Review\s*(?:after|in|on)|Next\s*visit|Come\s*back)\s*[:\.]?\s*(.+?)(?:\n|$)/i);a&&t.push(a[0].trim());const i=s.match(/(?:This\s*Card\s*is\s*valid|Valid\s*(?:up\s*to|until|till))\s*(.+?)(?:\n|$)/i);i&&t.push(i[0].trim());const r=s.match(/(?:Rpt|Repeat)\s+(.+?)(?:\n|$)/i);r&&t.push("Repeat: "+r[1].trim());const o=s.match(/(?:Diet|Lifestyle|Advice|Exercise)\s*[:\.]?\s*(.+?)(?:\n|$)/i);return o&&t.push(o[0].trim()),e.forEach(n=>{n.instructions&&!t.includes(n.instructions)&&t.push(`${n.name}: ${n.instructions}`)}),t}async function nt(s){let e={};try{e=await T.getPharmaAssist()}catch(n){console.warn("Pharma API error",n)}const t=e.medicines||[],a=["bg-blue-50 text-blue-600","bg-purple-50 text-purple-600","bg-orange-50 text-orange-600","bg-teal-50 text-teal-600"],i=["medication","vaccines","pill","healing"];function r(n){return n&&new DOMParser().parseFromString(n,"text/html").body.textContent||""}s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-4">
        <div class="flex items-center justify-between max-w-lg mx-auto w-full">
            <div class="flex items-center gap-3">
                <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                    <span class="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <div class="bg-primary/10 p-2 rounded-lg"><span class="material-symbols-outlined text-primary">pill</span></div>
                <h1 class="text-xl font-bold tracking-tight">Pharma Assist</h1>
            </div>
            <button class="p-2 hover:bg-primary/5 rounded-full transition-colors">
                <span class="material-symbols-outlined text-slate-600">notifications</span>
            </button>
        </div>
    </header>

    <main class="flex-1 max-w-lg mx-auto w-full px-4 pb-24 page-enter">
        <!-- Hero -->
        <section class="py-6">
            <h2 class="text-2xl font-bold leading-tight mb-2">Find affordable alternatives</h2>
            <p class="text-slate-500 text-sm mb-6">Compare your current prescriptions with generic options and save up to 60%.</p>
            <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span class="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                </div>
                <input id="pharma-search" class="block w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-primary shadow-sm text-base placeholder:text-slate-400 transition-all" placeholder="Search for a medicine..." type="text">
            </div>
        </section>

        <!-- Medicines List -->
        <section class="space-y-4">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold">Your Medicines</h3>
                <button class="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            ${t.length?t.map((n,l)=>{const c=n.savings||n.cheaper_found,h=a[l%a.length],x=i[l%i.length],m=r(n.name||""),d=r(n.dosage||"");return`
                <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 ${c?"":"opacity-80"}">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex gap-3">
                            <div class="size-10 rounded-lg ${h} flex items-center justify-center"><span class="material-symbols-outlined">${x}</span></div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-base leading-tight">${m}</h4>
                                <p class="text-xs text-slate-500 mt-0.5">${r(n.dosage||"")} • ${r(n.frequency||"")}</p>
                            </div>
                        </div>
                        ${c?`<span class="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">${r(n.savings||"")||"Cheaper Found"}</span>`:""}
                    </div>
                    
                    <!-- Compare Logic Container -->
                    <div class="compare-container">
                        <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                            <button class="compare-btn ${c?"bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20":"border border-primary text-primary hover:bg-primary/5"} px-5 py-2 rounded-lg text-sm font-semibold transition-all w-full" data-name="${m}" data-dosage="${d}">
                                ${n.compare_label||"Compare & View Details"}
                            </button>
                        </div>
                        
                        <!-- Hidden Results UI -->
                        <div class="compare-result hidden mt-4 pt-4 border-t border-dashed border-slate-200 animate-fade-in-up">
                            <div class="bg-emerald-50 border border-emerald-100 rounded-lg p-3 relative">
                                <span class="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">RECOMMENDED</span>
                                <p class="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Generic Alternative</p>
                                <div class="flex justify-between items-end">
                                    <div>
                                        <p class="font-bold text-slate-800 result-name">Loading...</p>
                                        <p class="text-[10px] text-slate-500">Same active ingredients</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-lg text-emerald-600 result-price">--</p>
                                        <p class="text-[10px] font-bold text-emerald-500 result-saving">Save --</p>
                                    </div>
                                </div>
                                <button class="w-full mt-3 bg-white border border-emerald-200 text-emerald-700 py-1.5 rounded-md text-xs font-bold hover:bg-emerald-100 transition-colors">Find Nearby Pharmacy</button>
                            </div>
                        </div>
                    </div>
                </div>`}).join(""):`
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                <span class="material-symbols-outlined text-4xl text-slate-300 mb-3">pill</span>
                <p class="text-sm text-slate-500">No medicines found. Upload a prescription to get started.</p>
            </div>`}
        </section>

        <!-- Intelligence Tip -->
        <section class="mt-8">
            <div class="bg-primary/10 rounded-2xl p-6 relative overflow-hidden">
                <div class="relative z-10">
                    <h4 class="text-primary font-bold text-lg mb-1">Prescription Intelligence</h4>
                    <p class="text-slate-600 text-sm leading-relaxed mb-4">Upload a photo of your prescription to automatically find generic equivalents at local pharmacies.</p>
                    <button onclick="app.navigateTo('scan')" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">upload</span>
                        Upload Recipe
                    </button>
                </div>
                <div class="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
                    <span class="material-symbols-outlined text-primary text-[120px]">science</span>
                </div>
            </div>
        </section>
    </main>`,s.querySelectorAll(".compare-btn").forEach(n=>{n.addEventListener("click",()=>{const l=n.dataset.name,c=n.dataset.dosage;l&&window.app.navigateTo("pharma-result",{name:l,dosage:c})})});const o=document.getElementById("pharma-search");o&&(o.addEventListener("input",()=>{const n=o.value.trim().toLowerCase();s.querySelectorAll(".compare-container").forEach(c=>{var m,d;const h=c.closest(".bg-white.p-4");if(!h)return;const x=((d=(m=h.querySelector("h4"))==null?void 0:m.textContent)==null?void 0:d.toLowerCase())||"";h.style.display=x.includes(n)||!n?"":"none"})}),o.addEventListener("keydown",n=>{if(n.key==="Enter"){n.preventDefault();const l=o.value.trim();l&&window.app.showToast(`Showing results for "${l}"`,"info")}}))}async function ot(s,e={}){var $;const t=e.name||"Medicine",a=e.dosage||"",i=e.price||"";s.innerHTML=`
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('pharma')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">Comparing ${t}</h1>
    </header>
    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6 text-center pt-16">
        <div class="flex justify-center mb-4">
            <div class="relative">
                <div style="width:64px;height:64px;border:4px solid #f1f5f9;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s ease-in-out infinite;"></div>
                <span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" style="font-size:24px">medication</span>
            </div>
        </div>
        <h2 class="text-lg font-bold text-slate-800">Analyzing ${t}...</h2>
        <p class="text-sm text-slate-500">Finding generic alternatives, prices, and pharmacy links</p>
        <div class="space-y-2.5 pt-4 max-w-xs mx-auto text-left">
            <div class="flex items-center gap-3"><span class="size-2 bg-primary rounded-full animate-pulse"></span><span class="text-sm text-slate-600">Identifying active ingredients</span></div>
            <div class="flex items-center gap-3 opacity-40"><span class="size-2 bg-slate-400 rounded-full"></span><span class="text-sm text-slate-500">Finding alternatives</span></div>
            <div class="flex items-center gap-3 opacity-40"><span class="size-2 bg-slate-400 rounded-full"></span><span class="text-sm text-slate-500">Comparing prices</span></div>
        </div>
    </main>`;let r={};try{r=await T.compareMedicine(t,a)}catch(v){r={original:{name:t,generic_name:"Error",description:v.message,uses:[],side_effects:[],estimated_price:i||"N/A"},alternatives:[],buy_links:{},note:"Failed to fetch data. Please try again."}}const o=r.original||{},n=r.alternatives||[],l=r.buy_links||{},c=r.note||"",h=r.precautions||"",x=o.uses||[],m=o.side_effects||[],d=parseInt((o.estimated_price||"0").replace(/[^0-9]/g,""))||0;let p=0,f=n[0]||{};n.forEach(v=>{const y=parseInt((v.savings||"0").replace(/[^0-9]/g,""))||0;y>p&&(p=y,f=v)});const u=parseInt((f.estimated_price||"0").replace(/[^0-9]/g,""))||0,b=d-u;s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('pharma')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-lg font-bold">Medicine Details</h1>
        </div>
        <button id="share-compare" class="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <span class="material-symbols-outlined text-slate-700">share</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-5">

        <!-- ═══ Original Medicine Card ═══ -->
        <section class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <p class="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Your Prescription</p>
                    <h2 class="text-xl font-bold">${o.name||t}</h2>
                    ${a?`<p class="text-sm text-white/60 mt-0.5">${a}</p>`:""}
                </div>
                <div class="text-right">
                    <p class="text-[10px] text-white/50 uppercase tracking-widest font-bold">Price</p>
                    <p class="text-2xl font-bold text-white">${o.estimated_price||i||"N/A"}</p>
                </div>
            </div>
            <div class="bg-white/10 rounded-lg p-3 mt-3">
                <p class="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Active Ingredient</p>
                <p class="font-semibold text-white/90">${o.generic_name||"—"}</p>
            </div>
            ${o.manufacturer?`<p class="text-xs text-white/40 mt-3">By ${o.manufacturer}</p>`:""}
        </section>

        <!-- ═══ Description ═══ -->
        ${o.description?`
        <section class="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-primary text-lg">info</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-primary">About This Medicine</h3>
            </div>
            <p class="text-sm text-slate-700 leading-relaxed">${o.description}</p>
        </section>`:""}

        <!-- ═══ Uses ═══ -->
        ${x.length?`
        <section class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">medical_information</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Common Uses</h3>
            </div>
            <div class="flex flex-wrap gap-2">
                ${x.map(v=>`<span class="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">${v}</span>`).join("")}
            </div>
        </section>`:""}

        <!-- ═══ Savings Hero ═══ -->
        ${n.length&&p>0?`
        <section class="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-emerald-500/20">
            <span class="material-symbols-outlined text-4xl opacity-80 mb-1">savings</span>
            <p class="text-xs font-semibold text-emerald-100 uppercase tracking-widest mb-1">Potential Savings</p>
            <h2 class="text-4xl font-bold mb-1">${b>0?"₹"+b:p+"%"}</h2>
            <p class="text-sm text-emerald-50">Save up to <span class="font-bold">${p}%</span> with generic alternatives</p>
        </section>`:""}

        <!-- ═══ Alternatives ═══ -->
        ${n.length?`
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-emerald-500 text-lg">swap_horiz</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Generic Alternatives (${n.length})</h3>
            </div>
            <div class="space-y-3">
                ${n.map((v,y)=>`
                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-sm font-bold">${y+1}</div>
                            <div>
                                <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
                                    ${v.name}
                                    ${y===0?'<span class="material-symbols-outlined text-emerald-500 text-[14px]">verified</span>':""}
                                </h4>
                                <p class="text-xs text-slate-500">${v.manufacturer||""}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-emerald-600 text-lg">${v.estimated_price||"—"}</p>
                            ${v.savings?`<span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">Save ${v.savings}</span>`:""}
                        </div>
                    </div>
                    ${v.buy_link?`
                    <a href="${v.buy_link}" target="_blank" rel="noopener" class="mt-3 w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <span class="material-symbols-outlined text-[16px]">shopping_cart</span> Buy Online
                    </a>`:""}
                </div>`).join("")}
            </div>
        </section>`:`
        <section class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
            <p class="text-sm text-slate-500 font-medium">No alternatives found for this medicine.</p>
        </section>`}

        <!-- ═══ Buy Links ═══ -->
        ${Object.keys(l).length?`
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">shopping_bag</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Buy ${o.name||t} Online</h3>
            </div>
            <div class="grid grid-cols-3 gap-3">
                ${l["1mg"]?`
                <a href="${l["1mg"]}" target="_blank" rel="noopener" class="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div class="size-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
                        <span class="material-symbols-outlined text-lg">local_pharmacy</span>
                    </div>
                    <p class="text-xs font-bold text-slate-700">1mg</p>
                </a>`:""}
                ${l.pharmeasy?`
                <a href="${l.pharmeasy}" target="_blank" rel="noopener" class="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div class="size-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-2">
                        <span class="material-symbols-outlined text-lg">storefront</span>
                    </div>
                    <p class="text-xs font-bold text-slate-700">PharmEasy</p>
                </a>`:""}
                ${l.netmeds?`
                <a href="${l.netmeds}" target="_blank" rel="noopener" class="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div class="size-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                        <span class="material-symbols-outlined text-lg">medication</span>
                    </div>
                    <p class="text-xs font-bold text-slate-700">Netmeds</p>
                </a>`:""}
            </div>
        </section>`:""}

        <!-- ═══ Side Effects ═══ -->
        ${m.length?`
        <section class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-amber-500 text-lg">warning</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Common Side Effects</h3>
            </div>
            <div class="grid grid-cols-2 gap-2">
                ${m.map(v=>`
                <div class="flex items-center gap-2 bg-amber-50/50 px-3 py-2 rounded-lg">
                    <span class="size-1.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span class="text-xs text-amber-800 font-medium">${v}</span>
                </div>`).join("")}
            </div>
        </section>`:""}

        <!-- ═══ Precautions ═══ -->
        ${h?`
        <section class="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-red-500 text-xl shrink-0 mt-0.5">health_and_safety</span>
            <div>
                <h3 class="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Precaution</h3>
                <p class="text-sm text-red-800 leading-relaxed">${h}</p>
            </div>
        </section>`:""}

        <!-- ═══ Note ═══ -->
        ${c?`
        <section class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-slate-400 text-lg shrink-0 mt-0.5">lightbulb</span>
            <p class="text-xs text-slate-600 leading-relaxed">${c}</p>
        </section>`:""}

        <!-- ═══ AI Disclaimer ═══ -->
        <section class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <span class="material-symbols-outlined text-amber-500 shrink-0 text-lg">info</span>
            <p class="text-[11px] text-amber-700 leading-relaxed">
                Prices are approximate and may vary. Generic medicines contain the same active ingredients. <strong>Always consult your doctor</strong> before switching medications. Powered by Gemini AI.
            </p>
        </section>

        <!-- ═══ Ask AI Button ═══ -->
        <button onclick="app.navigateTo('chat', {q: 'Tell me everything about ${o.name||t}: uses, side effects, interactions, and precautions'})" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">auto_awesome</span>
            Ask AI More About This Medicine
        </button>
    </main>`,($=document.getElementById("share-compare"))==null||$.addEventListener("click",async()=>{const v=`💊 ${o.name||t}
Generic: ${o.generic_name||"—"}
Price: ${o.estimated_price||"—"}

Alternatives:
${n.map(y=>`• ${y.name} - ${y.estimated_price} (Save ${y.savings})`).join(`
`)}

Compared via Medi-Sum`;try{navigator.share?await navigator.share({title:`Medicine Comparison: ${t}`,text:v}):(navigator.clipboard.writeText(v),window.app.showToast("📋 Copied to clipboard","info"))}catch(y){console.warn("Share error",y)}})}async function lt(s){var p,f;const e=JSON.parse(localStorage.getItem("chat_history")||"[]");s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-600">arrow_back</span>
            </button>
            <div class="relative">
                <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                    <span class="material-symbols-outlined text-primary">smart_toy</span>
                </div>
                <div class="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
                <h1 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    Medi-Sum AI
                    <span class="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/20 flex items-center gap-0.5"><span class="material-symbols-outlined text-[10px]">memory</span> Context Active</span>
                </h1>
                <p class="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Online Assistant</p>
            </div>
        </div>
        <div class="flex items-center gap-1 -mr-2">
            <button class="p-2 hover:bg-primary/10 rounded-full text-slate-600"><span class="material-symbols-outlined text-[20px]">history</span></button>
            <button id="clear-chat-btn" class="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-600 transition-colors"><span class="material-symbols-outlined text-[20px]">delete_sweep</span></button>
        </div>
    </header>

    <!-- Chat Area -->
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-6" style="height:calc(100vh - 270px);-webkit-overflow-scrolling:touch;">
        <!-- Date Separator -->
        <div class="flex justify-center"><span class="text-[11px] font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Today</span></div>

        <!-- Welcome AI Message -->
        <div class="flex items-end gap-3 max-w-[85%]">
            <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-primary text-sm">smart_toy</span></div>
            <div class="flex flex-col gap-1.5">
                <div class="bg-white p-4 rounded-xl rounded-bl-none shadow-sm border border-primary/5">
                    <p class="text-sm leading-relaxed">Hello! I'm your AI health assistant. I have access to your medical records. How can I help you today?</p>
                </div>
                <span class="text-[10px] text-slate-400 ml-1">Just now</span>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-primary/10 pt-2 pb-6">
        <!-- Input Layer -->
        <div class="px-4 mt-2 mb-3">
            <form id="chat-form" class="flex items-end gap-2 bg-[#f5f8f8] rounded-2xl p-2 pl-4 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all duration-200">
                <button type="button" class="text-slate-400 hover:text-primary transition-colors pb-2"><span class="material-symbols-outlined text-[22px]">attach_file</span></button>
                <textarea id="chat-input" rows="1" class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 placeholder:text-slate-400 resize-none max-h-32" placeholder="Ask about your health..."></textarea>
                <button type="submit" id="send-btn" disabled class="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-symbols-outlined text-[20px] ml-0.5">send</span>
                </button>
            </form>
            <div class="flex items-center justify-center gap-1.5 mt-3">
                <span class="material-symbols-outlined text-[14px] text-slate-400">lock</span>
                <p class="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center">End-to-End Encrypted & HIPAA Compliant</p>
            </div>
        </div>
        
        <!-- Suggestion Chips (Moved Below Input) -->
        <div id="suggestion-chips" class="flex gap-2 overflow-x-auto px-4 hide-scrollbar">
            ${window.location.hash.includes("q=")?"":`
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">What medicines am I taking?</button>
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">Summarize Oct 12 visit</button>
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">Pending tests?</button>
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">Recent lab results</button>
            `}
        </div>
    </footer>

    <!-- Chat Bottom Nav (4-tab) -->
    <nav class="bg-white border-t border-slate-100 flex justify-between items-center" style="padding-bottom: env(safe-area-inset-bottom);">
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-primary py-3" onclick="event.preventDefault();">
            <span class="material-symbols-outlined text-[24px] filled">chat_bubble</span>
            <span class="text-[10px] font-semibold">Chat</span>
        </a>
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors py-3" onclick="event.preventDefault();app.navigateTo('history');">
            <span class="material-symbols-outlined text-[24px]">folder_open</span>
            <span class="text-[10px] font-medium">Records</span>
        </a>
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors py-3" onclick="event.preventDefault();app.navigateTo('dashboard');">
            <span class="material-symbols-outlined text-[24px]">monitoring</span>
            <span class="text-[10px] font-medium">Vitals</span>
        </a>
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors py-3" onclick="event.preventDefault();app.navigateTo('profile');">
            <span class="material-symbols-outlined text-[24px]">account_circle</span>
            <span class="text-[10px] font-medium">Profile</span>
        </a>
    </nav>`;const t=document.getElementById("chat-messages"),a=document.getElementById("chat-input"),i=document.getElementById("chat-form");a.addEventListener("input",function(){this.style.height="auto",this.style.height=this.scrollHeight+"px",this.value===""&&(this.style.height="auto")});function r(){localStorage.setItem("chat_history",JSON.stringify(e))}function o(u){const b=document.createElement("div");u.role==="user"?(b.className="flex flex-col items-end gap-1.5 ml-auto max-w-[85%]",b.innerHTML=`
                <div class="bg-primary text-white p-4 rounded-xl rounded-br-none shadow-sm">
                    <p class="text-sm leading-relaxed">${u.text}</p>
                </div>
                <div class="flex items-center gap-1 mr-1">
                    <span class="text-[10px] text-slate-400">${u.time}</span>
                    <span class="material-symbols-outlined text-[12px] text-primary">done_all</span>
                </div>`):(b.className="flex items-end gap-3 max-w-[85%] animate-fade-in-up",b.innerHTML=`
                <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20"><span class="material-symbols-outlined text-primary text-sm">smart_toy</span></div>
                <div class="flex flex-col gap-1.5">
                    <div class="bg-white p-4 rounded-xl rounded-bl-none shadow-sm border border-primary/5">
                        <p class="text-sm leading-relaxed">${u.text}</p>
                    </div>
                    <span class="text-[10px] text-slate-400 ml-1">${u.time}</span>
                </div>`),t.appendChild(b),t.scrollTop=t.scrollHeight}e.forEach(o),e.length>0&&((p=document.getElementById("suggestion-chips"))==null||p.classList.add("hidden"));const l=new URLSearchParams(window.location.hash.split("?")[1]).get("q");l&&(setTimeout(()=>x(l),300),window.history.replaceState(null,"","#chat"));function c(){const u=document.createElement("div");u.id="typing-indicator",u.className="flex items-center gap-2 px-1 my-2",u.innerHTML='<div class="flex gap-1"><span class="size-1.5 bg-primary/40 rounded-full animate-pulse"></span><span class="size-1.5 bg-primary/40 rounded-full animate-pulse" style="animation-delay:.2s"></span><span class="size-1.5 bg-primary/40 rounded-full animate-pulse" style="animation-delay:.4s"></span></div><span class="text-[11px] text-slate-400 italic">Medi-Sum AI is thinking...</span>',t.appendChild(u),t.scrollTop=t.scrollHeight}function h(){var u;(u=document.getElementById("typing-indicator"))==null||u.remove()}async function x(u){var v;if(!u.trim())return;const b=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),$={role:"user",text:u,time:b};e.push($),o($),r(),a.value="",a.style.height="auto",a.dispatchEvent(new Event("input")),(v=document.getElementById("suggestion-chips"))==null||v.classList.add("hidden"),c();try{const y=await T.sendChatMessage(u);h();const w={role:"bot",text:y.response||y.message||"I couldn't process that request.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};e.push(w),o(w),r()}catch{h();const w={role:"bot",text:"Sorry, something went wrong. Please try again.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};e.push(w),o(w),r()}}const m=document.getElementById("send-btn");function d(){const u=!a.value.trim();m.disabled=u}a.addEventListener("input",d),d(),i.addEventListener("submit",u=>{u.preventDefault(),a.value.trim()&&x(a.value)}),a.addEventListener("keydown",u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),x(a.value))}),s.querySelectorAll(".chip").forEach(u=>{u.addEventListener("click",()=>x(u.textContent))}),(f=document.getElementById("clear-chat-btn"))==null||f.addEventListener("click",async()=>{var b;await window.app.showConfirmModal("Clear Chat?","Clear all chat history? This cannot be undone.","Clear")&&(localStorage.removeItem("chat_history"),e.length=0,t.innerHTML="",(b=document.getElementById("suggestion-chips"))==null||b.classList.remove("hidden"),window.app.showToast("Chat history cleared","info"))})}async function dt(s){var n,l;const e=JSON.parse(localStorage.getItem("user")||"{}"),t=localStorage.getItem("theme")==="dark",a=localStorage.getItem("lang")||"English";s.innerHTML=`
    <header class="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div class="flex items-center justify-between px-4 py-4">
            <h1 class="text-xl font-bold tracking-tight">Profile</h1>
            <button class="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
                <span class="material-symbols-outlined text-slate-600">settings</span>
            </button>
        </div>
    </header>

    <main class="max-w-lg mx-auto w-full px-4 py-6 space-y-6 pb-28 page-enter">
        <!-- Avatar Card -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div class="relative">
                <div class="size-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-3xl font-bold text-primary mb-3">${(e.name||"U")[0].toUpperCase()}</div>
                <button class="absolute bottom-2 -right-2 size-8 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-primary hover:bg-slate-50 transition-colors">
                    <span class="material-symbols-outlined text-[16px]">edit</span>
                </button>
            </div>
            <h2 class="text-lg font-bold text-slate-800">${e.name||"User"}</h2>
            <p class="text-sm text-slate-500">${e.email||""}</p>
            <span class="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Patient</span>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-3">
            <button onclick="app.navigateTo('chat')" class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:border-primary/50 transition-colors group">
                <span class="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">chat</span>
                <span class="text-sm font-semibold text-slate-700">AI Chat</span>
            </button>
            <button onclick="app.navigateTo('history')" class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:border-primary/50 transition-colors group">
                <span class="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">history</span>
                <span class="text-sm font-semibold text-slate-700">History</span>
            </button>
        </div>

        <!-- Profile Details (Editable) -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2">Medical Profile</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age</label>
                    <input type="number" id="prof-age" value="${localStorage.getItem("user_age")||"34"}" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-800 transition-all">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                    <select id="prof-gender" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 outline-none">
                        <option value="M" ${localStorage.getItem("user_gender")==="M"?"selected":""}>Male</option>
                        <option value="F" ${localStorage.getItem("user_gender")==="F"?"selected":""}>Female</option>
                        <option value="O" ${localStorage.getItem("user_gender")==="O"?"selected":""}>Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weight (kg)</label>
                    <input type="number" id="prof-weight" value="${localStorage.getItem("user_weight")||"75"}" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-800 transition-all">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Blood Group</label>
                    <select id="prof-blood" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 outline-none">
                        <option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="B+">B+</option><option value="AB+">AB+</option>
                    </select>
                </div>
            </div>
            
            <div class="pt-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Chronic Conditions (Tags)</label>
                <div class="flex flex-wrap gap-2 mb-2">
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                        Hypertension
                        <button class="material-symbols-outlined text-[14px] hover:text-rose-800">close</button>
                    </span>
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-bold">
                        Asthma
                        <button class="material-symbols-outlined text-[14px] hover:text-blue-800">close</button>
                    </span>
                    <button class="inline-flex items-center justify-center size-7 rounded-full bg-slate-100 border border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 transition-colors">
                        <span class="material-symbols-outlined text-[16px]">add</span>
                    </button>
                </div>
                <p class="text-[10px] text-slate-400 leading-tight">These help your AI assign appropriate warnings and health summaries.</p>
            </div>
        </div>

        <!-- Family Accounts (Mock) -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2 mt-6">Family Members</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-2 flex gap-3 overflow-x-auto hide-scrollbar">
            <!-- Active Primary -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-primary/10 border border-primary/30 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95">
                <div class="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-2 shadow-sm">${(e.name||"U")[0].toUpperCase()}</div>
                <p class="text-[11px] font-bold text-primary truncate w-full" title="${e.name}">Me</p>
                <p class="text-[9px] text-primary/60 uppercase font-black">Active</p>
            </div>

            <!-- Parent Mock -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95">
                <div class="size-10 rounded-full bg-indigo-100 text-indigo-500 border border-indigo-200 flex items-center justify-center font-bold text-lg mb-2 shadow-sm">S</div>
                <p class="text-[11px] font-bold text-slate-700 truncate w-full">Mrs. Seema</p>
                <p class="text-[9px] text-slate-400 uppercase font-bold">Mother</p>
            </div>

            <!-- Child Mock -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95">
                <div class="size-10 rounded-full bg-amber-100 text-amber-500 border border-amber-200 flex items-center justify-center font-bold text-lg mb-2 shadow-sm">Z</div>
                <p class="text-[11px] font-bold text-slate-700 truncate w-full">Zaid</p>
                <p class="text-[9px] text-slate-400 uppercase font-bold">Son</p>
            </div>

            <!-- Add New -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95 text-slate-400">
                <span class="material-symbols-outlined text-2xl mb-2">person_add</span>
                <p class="text-[10px] font-bold uppercase tracking-wider">Add New</p>
            </div>
        </div>

        <!-- App Preferences -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2 mt-6">App Preferences</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <!-- Language Selection -->
            <button id="lang-btn" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[20px]">language</span>
                    </div>
                    <div>
                        <span class="block text-sm font-medium text-slate-800">Language</span>
                        <span id="current-lang" class="block text-xs text-slate-500">${a}</span>
                    </div>
                </div>
                <span class="material-symbols-outlined text-slate-400 text-sm">unfold_more</span>
            </button>

            <!-- Dark Mode Toggle -->
            <div class="w-full flex items-center justify-between p-4 bg-white">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[20px]">dark_mode</span>
                    </div>
                    <div>
                        <span class="block text-sm font-medium text-slate-800">Dark Mode</span>
                        <span class="block text-xs text-slate-500">Preview feature</span>
                    </div>
                </div>
                <!-- Toggle Switch UI -->
                <button id="theme-toggle" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${t?"bg-primary":"bg-slate-200"}">
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${t?"translate-x-6":"translate-x-1"} shadow-sm"></span>
                </button>
            </div>
        </div>
        
        <!-- Account Settings -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2 mt-6">Account</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <button class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-100">
                <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">notifications</span></div>
                <span class="flex-1 text-sm font-medium text-slate-800">Notifications</span>
                <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
            <button class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-100">
                <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">security</span></div>
                <span class="flex-1 text-sm font-medium text-slate-800">Privacy & Security</span>
                <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
            <button id="delete-account-btn" class="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left group">
                <div class="w-8 h-8 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 flex items-center justify-center transition-colors"><span class="material-symbols-outlined text-[20px]">delete_forever</span></div>
                <span class="flex-1 text-sm font-bold text-red-600">Delete Account</span>
                <span class="material-symbols-outlined text-red-400 text-sm">chevron_right</span>
            </button>
        </div>

        <!-- Logout -->
        <div class="pt-4">
            <button id="logout-btn" class="w-full py-3.5 text-slate-600 border border-slate-200 bg-white rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <span class="material-symbols-outlined text-[18px]">logout</span>
                Log Out Instead
            </button>
        </div>

        <!-- Version -->
        <p class="text-center text-[11px] font-mono text-slate-400">Medi-Sum v1.3 Premium</p>
    </main>`,["prof-age","prof-gender","prof-weight","prof-blood"].forEach(c=>{var h;(h=document.getElementById(c))==null||h.addEventListener("change",x=>{localStorage.setItem("user_"+c.split("-")[1],x.target.value),window.app.showToast("Profile saved automatically","info")})});const r=document.getElementById("theme-toggle");r==null||r.addEventListener("click",()=>{localStorage.getItem("theme")==="dark"?(localStorage.setItem("theme","light"),r.className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-slate-200",r.innerHTML='<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1 shadow-sm"></span>'):(localStorage.setItem("theme","dark"),r.className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary",r.innerHTML='<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6 shadow-sm"></span>',window.app.showToast("Dark Mode is coming soon!","info"))});const o=document.getElementById("lang-btn");o==null||o.addEventListener("click",()=>{const c=["English","Hindi","Urdu","Spanish"],h=localStorage.getItem("lang")||"English",x=(c.indexOf(h)+1)%c.length;localStorage.setItem("lang",c[x]),document.getElementById("current-lang").textContent=c[x],window.app.showToast("Language changed to "+c[x],"info")}),(n=document.getElementById("logout-btn"))==null||n.addEventListener("click",async()=>{if(await window.app.showConfirmModal("Log Out?","Are you sure you want to log out of Medi-Sum?","Log Out")){try{await T.logout()}catch{}T.clearTokens(),window.app.showToast("👋 Logged out successfully","success"),setTimeout(()=>location.reload(),800)}}),(l=document.getElementById("delete-account-btn"))==null||l.addEventListener("click",async()=>{await window.app.showConfirmModal("Delete Account?","DANGER: This will permanently delete your account and all associated health records. This action cannot be undone.","Delete Forever")&&(T.clearTokens(),localStorage.clear(),window.app.showToast("Account and all data successfully deleted.","info"),setTimeout(()=>location.reload(),1500))})}async function ct(s){var n;s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">close</span>
        </button>
        <h1 class="text-lg font-bold">Add Health Vitals</h1>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter">
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold mb-6 text-slate-800">Record New Vitals</h2>
            
            <form id="vitals-form" class="space-y-5">
                <!-- Blood Pressure -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-rose-500 text-[18px]">favorite</span>
                            Blood Pressure (mmHg)
                        </span>
                        <span id="bp-hint" class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400">Enter Value</span>
                    </label>
                    <div class="flex items-center gap-3">
                        <input type="number" id="bp-sys" placeholder="Systolic (120)" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required>
                        <span class="text-slate-400 font-bold text-xl">/</span>
                        <input type="number" id="bp-dia" placeholder="Diastolic (80)" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required>
                    </div>
                </div>

                <!-- Blood Sugar -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-blue-500 text-[18px]">water_drop</span>
                            Blood Sugar (mg/dL)
                        </span>
                        <span id="sugar-hint" class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400">Enter Value</span>
                    </label>
                    <input type="number" id="sugar" placeholder="e.g. 95" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    
                    <div class="flex gap-2 mt-3">
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="sugar_type" value="Fasting" class="peer sr-only" checked>
                            <div class="text-center py-2 px-3 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">Fasting</div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="sugar_type" value="Post-Prandial" class="peer sr-only">
                            <div class="text-center py-2 px-3 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">Post-Meal</div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="sugar_type" value="Random" class="peer sr-only">
                            <div class="text-center py-2 px-3 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">Random</div>
                        </label>
                    </div>
                </div>

                <!-- Heart Rate -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-orange-500 text-[18px]">monitor_heart</span>
                        Heart Rate (bpm)
                    </label>
                    <input type="number" id="heart-rate" placeholder="e.g. 72" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <!-- Weight -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-purple-500 text-[18px]">weight</span>
                        Body Weight (kg)
                    </label>
                    <input type="number" step="0.1" id="weight" placeholder="e.g. 70.5" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <!-- SpO2 (Oxygen) -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-teal-500 text-[18px]">air</span>
                        Blood Oxygen (SpO2 %)
                    </label>
                    <input type="number" id="spo2" placeholder="e.g. 98" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <div class="pt-6">
                    <button type="submit" id="save-vitals" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">Save Vitals</button>
                </div>
            </form>
        </div>
    </main>`,(n=document.getElementById("vitals-form"))==null||n.addEventListener("submit",async l=>{var h;l.preventDefault();const c=document.getElementById("save-vitals");c.disabled=!0,c.textContent="Saving...";try{const x={bp_systolic:parseInt(document.getElementById("bp-sys").value)||null,bp_diastolic:parseInt(document.getElementById("bp-dia").value)||null,sugar_level:parseInt(document.getElementById("sugar").value)||null,sugar_type:((h=document.querySelector('input[name="sugar_type"]:checked'))==null?void 0:h.value)||"fasting",notes:`HR: ${document.getElementById("heart-rate").value||"-"}, Weight: ${document.getElementById("weight").value||"-"}kg, SpO2: ${document.getElementById("spo2").value||"-"}%`};await T.addHealthReading(x),window.app.showToast("✅ Vitals saved successfully!","success"),window.app.navigateTo("dashboard")}catch(x){window.app.showToast(x.message||"Failed to save","error"),c.disabled=!1,c.textContent="Save Vitals"}});const e=document.getElementById("bp-sys"),t=document.getElementById("bp-dia"),a=document.getElementById("bp-hint");function i(){const l=parseInt(e.value),c=parseInt(t.value);if(!l||!c){a.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400",a.textContent="Enter Value";return}l<120&&c<80?(a.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-600",a.textContent="Normal"):l>=140||c>=90?(a.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 animate-pulse",a.innerHTML="<span class='material-symbols-outlined text-[12px] align-middle mr-1'>warning</span>High (Stage 2)"):l>=130||c>=80?(a.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-600",a.textContent="High (Stage 1)"):(a.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-600",a.textContent="Elevated")}e==null||e.addEventListener("input",i),t==null||t.addEventListener("input",i);const r=document.getElementById("sugar"),o=document.getElementById("sugar-hint");r==null||r.addEventListener("input",()=>{const l=parseInt(r.value);if(!l){o.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400",o.textContent="Enter Value";return}l<100?(o.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-600",o.textContent="Normal"):l<126?(o.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-600",o.textContent="Pre-diabetic"):(o.className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 animate-pulse",o.innerHTML="<span class='material-symbols-outlined text-[12px] align-middle mr-1'>warning</span>High")})}async function Le(s){var d;const e=JSON.parse(localStorage.getItem("user")||"{}");s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">AI Health Summary</h1>
    </header>
    
    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6 text-center pt-16">
        <div class="flex justify-center mb-6">
            <div class="relative">
                <div style="width:72px;height:72px;border:4px solid #f1f5f9;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s ease-in-out infinite;"></div>
                <span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" style="font-size:28px">auto_awesome</span>
            </div>
        </div>
        <h2 class="text-xl font-bold text-slate-800">Generating your report...</h2>
        <p class="text-slate-500 text-sm font-medium">
            Analyzing all prescriptions, lab reports, and vitals with Gemini AI
        </p>
        <div class="space-y-3 pt-4 max-w-xs mx-auto">
            <div id="step-fetch" class="flex items-center gap-3">
                <div class="size-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span class="size-2 bg-primary rounded-full animate-pulse"></span>
                </div>
                <span class="text-sm text-slate-600 font-medium">Fetching medical records</span>
            </div>
            <div id="step-ai" class="flex items-center gap-3 opacity-40">
                <div class="size-5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <span class="size-2 bg-slate-400 rounded-full"></span>
                </div>
                <span class="text-sm text-slate-500 font-medium">Generating AI summary</span>
            </div>
        </div>
    </main>`;let t=[],a={};try{a=(await T.getDashboard()).stats||{}}catch{}try{t=(await T.getPrescriptions(1,100)).prescriptions||[]}catch{}const i=document.getElementById("step-fetch"),r=document.getElementById("step-ai");i&&(i.querySelector("div").innerHTML='<span class="material-symbols-outlined text-[12px] text-white">check</span>',i.querySelector("div").className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center"),r&&(r.classList.remove("opacity-40"),r.querySelector("div").innerHTML='<span class="size-2 bg-primary rounded-full animate-pulse"></span>',r.querySelector("div").className="size-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20");let o="",n="",l=!1;try{const p=await T.generateHealthSummary();o=p.summary||"No summary data available.",n=p.timestamp||new Date().toISOString()}catch(p){l=!0,o=p.message||"Failed to generate summary. Please try again."}const c=[],h=[],x=new Set;t.forEach(p=>{(p.medicines||[]).forEach(f=>{f.name&&!x.has(f.name.toLowerCase())&&(x.add(f.name.toLowerCase()),c.push(f))}),(p.medical_tests||[]).forEach(f=>{f.test_name&&h.push(f)})});const m=n?new Date(n).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"Just now";s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">AI Health Summary</h1>
        <button class="ml-auto p-2 hover:bg-primary/10 rounded-full transition-colors" id="regenerate-btn" title="Regenerate">
            <span class="material-symbols-outlined text-primary">refresh</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6">
        <!-- Patient Profile Snapshot -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
            <div class="flex items-center gap-4 mb-4">
                <div class="size-14 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold border border-white/20">${(e.name||"U")[0].toUpperCase()}</div>
                <div>
                    <h2 class="text-xl font-bold">${e.name||"Patient"}</h2>
                    <span class="text-xs bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">AI Health Report</span>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
                <div>
                    <p class="text-[10px] text-white/50 uppercase tracking-wider">Prescriptions</p>
                    <p class="font-bold text-lg">${a.prescriptions??t.length}</p>
                </div>
                <div class="border-x border-white/10">
                    <p class="text-[10px] text-white/50 uppercase tracking-wider">Medicines</p>
                    <p class="font-bold text-lg">${a.medicines??c.length}</p>
                </div>
                <div>
                    <p class="text-[10px] text-white/50 uppercase tracking-wider">Generated</p>
                    <p class="font-bold text-sm mt-0.5">${m.split(",")[0]||"Today"}</p>
                </div>
            </div>
        </div>

        <!-- AI Executive Summary (Real Gemini Response) -->
        <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[16px]">auto_awesome</span>
                AI Summary — Powered by Gemini
            </h3>
            <div class="${l?"bg-red-50 border-red-200":"bg-primary/5 border-primary/15"} border p-5 rounded-2xl relative">
                ${l?'<span class="material-symbols-outlined absolute top-4 right-4 text-red-300 text-3xl">error</span>':'<span class="material-symbols-outlined absolute top-4 right-4 text-primary/20 text-3xl">auto_awesome</span>'}
                <p class="text-sm ${l?"text-red-700":"text-slate-700"} leading-relaxed font-medium relative z-10 whitespace-pre-wrap" id="summary-text">
                    ${o}
                </p>
                <p class="text-[10px] text-slate-400 mt-3 uppercase tracking-wider font-semibold">
                    ${l?"⚠️ AI service error":`✅ Generated at ${m}`}
                </p>
            </div>
        </section>

        ${c.length?`
        <!-- Active Medicines from Prescriptions -->
        <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Current Medicines (${c.length})</h3>
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                ${c.slice(0,8).map(p=>`
                <div class="p-4 flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="font-bold text-slate-800 truncate">${p.name}</p>
                        <p class="text-xs text-slate-500 mt-0.5 truncate">${p.dosage||""} ${p.frequency?"• "+p.frequency:""}</p>
                    </div>
                    <span class="bg-teal-50 text-teal-600 text-[10px] px-2 py-1 rounded font-bold uppercase shrink-0 ml-2">Active</span>
                </div>`).join("")}
            </div>
        </section>`:""}

        ${h.length?`
        <!-- Tests from Prescriptions -->
        <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Medical Tests (${h.length})</h3>
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                ${h.slice(0,6).map(p=>`
                <div class="p-4 flex items-center justify-between">
                    <div>
                        <p class="font-bold text-slate-800">${p.test_name}</p>
                        ${p.instructions?`<p class="text-xs text-slate-500 mt-0.5">${p.instructions}</p>`:""}
                    </div>
                    <span class="bg-${p.status==="completed"?"emerald":"amber"}-50 text-${p.status==="completed"?"emerald":"amber"}-600 text-[10px] px-2 py-1 rounded font-bold uppercase">${p.status||"Pending"}</span>
                </div>`).join("")}
            </div>
        </section>`:""}

        <!-- Disclaimer -->
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <span class="material-symbols-outlined text-amber-500 shrink-0 text-xl">info</span>
            <p class="text-xs text-amber-700 leading-relaxed">
                This summary is AI-generated for informational purposes only. It is not a substitute for professional medical advice. Always consult your doctor.
            </p>
        </div>
    </main>`,(d=document.getElementById("regenerate-btn"))==null||d.addEventListener("click",()=>{Le(s)})}async function pt(s){const e=[{name:"Complete Blood Count (CBC)",date:"Oct 15, 2023",status:"Completed",result:"Normal",doctor:"Dr. Smith"},{name:"Lipid Profile",date:"Sep 28, 2023",status:"Completed",result:"High LDL",doctor:"Dr. Jane"},{name:"Thyroid Panel (TSH)",date:"Aug 10, 2023",status:"Completed",result:"Normal",doctor:"Dr. Smith"},{name:"Vitamin D3",date:"Upcoming",status:"Pending",result:"--",doctor:"Dr. Adams"}];s.innerHTML=`
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <div class="bg-primary/10 p-1.5 rounded-lg"><span class="material-symbols-outlined text-primary text-sm">science</span></div>
            <h1 class="text-lg font-bold">Lab Results</h1>
        </div>
        <button class="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <span class="material-symbols-outlined text-slate-700">filter_list</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-4">
        
        <div class="relative mb-6">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="text" placeholder="Search tests..." class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
        </div>

        <div class="flex items-center justify-between mb-2">
            <h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">All Records</h2>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">${e.length} Total</span>
        </div>

        <div class="space-y-3">
            ${e.map(t=>{const a=t.status==="Pending",i=a?"text-amber-600 bg-amber-50 border-amber-200":"text-emerald-600 bg-emerald-50 border-emerald-200",r=a?"pending_actions":"check_circle";let o=t.date;return a&&(o="Follow-up due in 2 weeks"),`
                <div class="bg-white border ${a?"border-amber-200 shadow-md shadow-amber-500/10":"border-slate-200 shadow-sm"} rounded-xl p-4 transition-all hover:border-primary/30">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="size-10 rounded-lg ${a?"bg-amber-100 text-amber-500":"bg-slate-50 text-slate-400"} flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined">${r}</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 text-sm leading-tight">${t.name}</h3>
                                <p class="text-xs text-slate-500 mt-0.5">${o} • ${t.doctor}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${a?`
                    <div class="flex gap-2 mt-4 mb-1">
                        <button class="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg shadow-sm shadow-primary/20 flex items-center justify-center gap-1 active:scale-95 transition-transform" onclick="window.app.showToast('Test marked directly as Done', 'success')">
                            <span class="material-symbols-outlined text-[14px]">task_alt</span> Mark Done
                        </button>
                        <button onclick="app.navigateTo('scan')" class="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-transform">
                            <span class="material-symbols-outlined text-[14px]">upload</span> Upload Result
                        </button>
                    </div>
                    `:`
                    <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider ${i} px-2 py-0.5 rounded border">${t.status}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-bold ${t.result==="Normal"?"text-emerald-500":t.result==="--"?"text-slate-400":"text-rose-500"}">${t.result}</span>
                        </div>
                    </div>`}
                </div>`}).join("")}
        </div>
        
        <!-- Nearby Labs Button -->
        <button class="w-full mt-6 bg-white border border-primary/30 text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-primary/5 transition-colors" onclick="window.app.showToast('Opening map for nearby diagnostic labs...', 'info')">
            <span class="material-symbols-outlined">map</span>
            Find Nearby Diagnostic Labs
        </button>
    </main>

    <!-- Upload FAB -->
    <button onclick="app.navigateTo('scan')" class="fixed bottom-6 right-4 size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40">
        <span class="material-symbols-outlined text-2xl">upload_file</span>
    </button>`}let Te="dashboard",F=!1;function Ie(s,e="info"){const t=document.getElementById("toast-container"),a=document.createElement("div");a.className=`toast toast-${e}`,a.textContent=s,t.appendChild(a),setTimeout(()=>a.remove(),3500)}function ne(){const s=document.getElementById("exit-modal");s.classList.remove("hidden"),requestAnimationFrame(()=>{const e=s.querySelector(".exit-modal-sheet");e.style.transform="translateY(0)"})}function Se(){const s=document.getElementById("exit-modal"),e=s.querySelector(".exit-modal-sheet");e.style.transform="translateY(100%)",setTimeout(()=>s.classList.add("hidden"),300)}let J=null;function mt(s,e,t="Confirm",a=""){return new Promise(i=>{J=i;const r=document.getElementById("confirm-modal");document.getElementById("confirm-modal-title").textContent=s,document.getElementById("confirm-modal-message").textContent=e;const o=document.getElementById("confirm-modal-ok");o.textContent=t,a?o.className=`flex-1 py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg ${a}`:o.className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-red-500/20",r.classList.remove("hidden"),requestAnimationFrame(()=>{const n=r.querySelector(".confirm-modal-content");n.style.transform="scale(1)",n.style.opacity="1"})})}function oe(s){const e=document.getElementById("confirm-modal"),t=e.querySelector(".confirm-modal-content");t.style.transform="scale(0.9)",t.style.opacity="0",setTimeout(()=>e.classList.add("hidden"),250),J&&(J(s),J=null)}function ut(s){const e=document.getElementById("bottom-nav");e&&e.querySelectorAll(".nav-tab").forEach(t=>{const a=t.querySelector(".material-symbols-outlined");t.dataset.page===s?(t.className="nav-tab flex flex-col items-center gap-1 text-primary",a.classList.add("filled"),t.querySelector("span:last-child").className="text-[10px] font-bold"):(t.className="nav-tab flex flex-col items-center gap-1 text-slate-400",a.classList.remove("filled"),t.querySelector("span:last-child").className="text-[10px] font-medium")})}async function z(s,e={}){Te=s;const t=document.getElementById("main-content"),a=document.getElementById("bottom-nav");a&&a.classList.toggle("hidden",s==="chat"),t.innerHTML='<div class="flex items-center justify-center py-20"><div class="spinner" style="width:32px;height:32px;border:3px solid #e2e8f0;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s linear infinite;"></div></div>',t.scrollTop=0;try{switch(s){case"dashboard":await ge(t);break;case"scan":await Ze(t);break;case"history":await Qe(t);break;case"timeline":await Xe(t);break;case"detail":await et(t,e.id);break;case"pharma":await nt(t);break;case"pharma-result":await ot(t,e);break;case"vitals":await ct(t);break;case"summary":await Le(t);break;case"tests":await pt(t);break;case"chat":await lt(t);break;case"profile":await dt(t);break;case"reminders":await Ke(t);break;default:await ge(t)}}catch(r){console.error("Page error:",r),t.innerHTML=`<div class="flex flex-col items-center justify-center py-20 text-center px-6">
            <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">error</span>
            <p class="text-lg font-bold text-slate-700 mb-2">Something went wrong</p>
            <p class="text-sm text-slate-500 mb-6">${r.message||"Failed to load page"}</p>
            <button onclick="window.app.navigateTo('dashboard')" class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">Back to Dashboard</button>
        </div>`}ut({dashboard:"dashboard",scan:"scan",timeline:"timeline",pharma:"pharma",profile:"profile",history:"dashboard",detail:"dashboard",reminders:"dashboard"}[s]||"dashboard")}const bt={dashboard:null,scan:"dashboard",history:"dashboard",detail:"history",timeline:"dashboard",chat:"dashboard",pharma:"dashboard","pharma-result":"pharma",profile:"dashboard",vitals:"dashboard",summary:"dashboard",tests:"dashboard"};function he(){const s=document.getElementById("exit-modal"),e=document.getElementById("confirm-modal");if(s&&!s.classList.contains("hidden")){Se();return}if(e&&!e.classList.contains("hidden")){oe(!1);return}if(F){const a=document.getElementById("register-view");if(a&&!a.classList.contains("hidden")){a.classList.add("hidden"),document.getElementById("login-view").classList.remove("hidden");return}ne();return}const t=bt[Te];t==null?ne():z(t)}async function xt(){var m,d,p,f,u,b,$,v;const s=document.getElementById("loading"),e=document.getElementById("auth-container"),t=document.getElementById("main-container");(m=document.getElementById("exit-cancel-btn"))==null||m.addEventListener("click",Se),(d=document.getElementById("exit-confirm-btn"))==null||d.addEventListener("click",()=>{xe.exitApp()}),(p=document.getElementById("confirm-modal-cancel"))==null||p.addEventListener("click",()=>oe(!1)),(f=document.getElementById("confirm-modal-ok"))==null||f.addEventListener("click",()=>oe(!0)),xe.addListener("backButton",({canGoBack:y})=>{he()}),window.addEventListener("popstate",y=>{y.preventDefault(),he(),window.history.pushState(null,"",window.location.href)}),window.history.pushState(null,"",window.location.href),(u=document.getElementById("show-register"))==null||u.addEventListener("click",y=>{y.preventDefault(),document.getElementById("login-view").classList.add("hidden"),document.getElementById("register-view").classList.remove("hidden")}),(b=document.getElementById("show-login"))==null||b.addEventListener("click",y=>{y.preventDefault(),document.getElementById("register-view").classList.add("hidden"),document.getElementById("login-view").classList.remove("hidden")});const a=document.getElementById("login-email"),i=document.getElementById("login-password"),r=document.querySelector('#login-form button[type="submit"]');r&&(r.disabled=!0);function o(){if(r){const y=(a==null?void 0:a.value.trim())&&(i==null?void 0:i.value.trim());r.disabled=!y,r.classList.toggle("opacity-50",!y),r.classList.toggle("cursor-not-allowed",!y)}}a==null||a.addEventListener("input",o),i==null||i.addEventListener("input",o);const n=document.getElementById("register-name"),l=document.getElementById("register-email"),c=document.getElementById("register-password"),h=document.querySelector('#register-form button[type="submit"]');h&&(h.disabled=!0);function x(){if(h){const y=(n==null?void 0:n.value.trim())&&(l==null?void 0:l.value.trim())&&(c==null?void 0:c.value.trim());h.disabled=!y,h.classList.toggle("opacity-50",!y),h.classList.toggle("cursor-not-allowed",!y)}}n==null||n.addEventListener("input",x),l==null||l.addEventListener("input",x),c==null||c.addEventListener("input",x),($=document.getElementById("login-form"))==null||$.addEventListener("submit",async y=>{y.preventDefault();const w=y.target.querySelector('button[type="submit"]'),S=w.innerHTML;w.disabled=!0,w.innerHTML='<div class="spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 1s linear infinite;"></div> Logging in...';const k=document.getElementById("login-error");k&&k.classList.add("hidden");try{await T.login(a.value,i.value),F=!1,e.classList.add("hidden"),t.classList.remove("hidden"),z("dashboard")}catch(E){let g=document.getElementById("login-error");g||(g=document.createElement("p"),g.id="login-error",g.className="text-sm text-red-500 font-medium text-center mt-3 flex items-center justify-center gap-1",y.target.appendChild(g)),g.innerHTML=`<span class="material-symbols-outlined text-[16px]">error</span> ${E.message||"Invalid email or password"}`,g.classList.remove("hidden")}w.disabled=!1,w.innerHTML=S,o()}),(v=document.getElementById("register-form"))==null||v.addEventListener("submit",async y=>{y.preventDefault();const w=y.target.querySelector('button[type="submit"]'),S=w.innerHTML;w.disabled=!0,w.innerHTML='<div class="spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 1s linear infinite;"></div> Creating...';try{await T.register(n.value,l.value,c.value),F=!1,e.classList.add("hidden"),t.classList.remove("hidden"),z("dashboard")}catch(k){Ie(k.message||"Registration failed","error")}w.disabled=!1,w.innerHTML=S,x()}),document.querySelectorAll(".nav-tab").forEach(y=>{y.addEventListener("click",w=>{w.preventDefault(),z(y.dataset.page)})}),T.isAuthenticated()?(s.classList.add("hidden"),t.classList.remove("hidden"),F=!1,z("dashboard")):(s.classList.add("hidden"),e.classList.remove("hidden"),F=!0)}window.app={navigateTo:z,showToast:Ie,showConfirmModal:mt,showExitModal:ne};document.addEventListener("DOMContentLoaded",xt);export{ve as W,Y as _,qe as b,le as r};
