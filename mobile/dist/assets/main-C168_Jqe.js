const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-B1POE996.js","assets/index-DjC3rGpM.js","assets/index-BJevg_d7.js","assets/index-HK50Ki82.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const _="modulepreload",H=function(t){return"/"+t},k={},y=function(e,a,n){let i=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(a.map(l=>{if(l=H(l),l in k)return;k[l]=!0;const g=l.endsWith(".css"),P=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${P}`))return;const u=document.createElement("link");if(u.rel=g?"stylesheet":_,g||(u.as="script"),u.crossOrigin="",u.href=l,c&&u.setAttribute("nonce",c),document.head.appendChild(u),g)return new Promise((M,A)=>{u.addEventListener("load",M),u.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})},$=localStorage.getItem("api_url")||"https://snobbily-civilisatory-denis.ngrok-free.dev";class z{constructor(){this.accessToken=null,this.refreshToken=null,this.loadTokens()}loadTokens(){this.accessToken=localStorage.getItem("access_token"),this.refreshToken=localStorage.getItem("refresh_token")}saveTokens(e,a){this.accessToken=e,this.refreshToken=a,localStorage.setItem("access_token",e),a&&localStorage.setItem("refresh_token",a)}clearTokens(){this.accessToken=null,this.refreshToken=null,localStorage.removeItem("access_token"),localStorage.removeItem("refresh_token"),localStorage.removeItem("user")}isAuthenticated(){return!!this.accessToken}async request(e,a={}){const n=`${$}${e}`,i={"Content-Type":"application/json","ngrok-skip-browser-warning":"true",...a.headers};this.accessToken&&(i.Authorization=`Bearer ${this.accessToken}`);try{let s=await fetch(n,{...a,headers:i});s.status===401&&this.refreshToken&&await this.refreshAccessToken()&&(i.Authorization=`Bearer ${this.accessToken}`,s=await fetch(n,{...a,headers:i}));const o=await s.json();if(!s.ok)throw new Error(o.error||"Request failed");return o}catch(s){throw console.error("API Error:",s),s}}async refreshAccessToken(){try{const e=await fetch(`${$}/api/v1/auth/refresh`,{method:"POST",headers:{Authorization:`Bearer ${this.refreshToken}`,"Content-Type":"application/json"}});if(e.ok){const a=await e.json();return this.saveTokens(a.access_token,this.refreshToken),!0}}catch(e){console.error("Token refresh failed:",e)}return this.clearTokens(),!1}async login(e,a){const n=await this.request("/api/v1/auth/login",{method:"POST",body:JSON.stringify({email:e,password:a})});return this.saveTokens(n.access_token,n.refresh_token),localStorage.setItem("user",JSON.stringify(n.user)),n}async register(e,a,n){const i=await this.request("/api/v1/auth/register",{method:"POST",body:JSON.stringify({name:e,email:a,password:n})});return this.saveTokens(i.access_token,i.refresh_token),localStorage.setItem("user",JSON.stringify(i.user)),i}async logout(){try{await this.request("/api/v1/auth/logout",{method:"POST"})}finally{this.clearTokens()}}async getMe(){return this.request("/api/v1/auth/me")}async getDashboard(){return this.request("/api/v1/dashboard")}async generateHealthSummary(){return this.request("/api/v1/health-summary/generate",{method:"POST"})}async getPrescriptions(e=1,a=10){return this.request(`/api/v1/prescriptions?page=${e}&per_page=${a}`)}async getPrescription(e){return this.request(`/api/v1/prescriptions/${e}`)}async uploadPrescription(e){return this.request("/api/v1/prescriptions",{method:"POST",body:JSON.stringify({image_base64:e})})}async uploadReport(e){return this.request("/api/v1/reports",{method:"POST",body:JSON.stringify({image:e})})}async deletePrescription(e){return this.request(`/api/v1/prescriptions/${e}`,{method:"DELETE"})}async getHealthReadings(){return this.request("/api/v1/health-readings")}async addHealthReading(e){return this.request("/api/v1/health-readings",{method:"POST",body:JSON.stringify(e)})}async deleteHealthReading(e){return this.request(`/api/v1/health-readings/${e}`,{method:"DELETE"})}async getTimeline(e=1,a=20,n="all"){return this.request(`/api/v1/timeline?page=${e}&per_page=${a}&filter=${n}`)}async sendChatMessage(e,a="en"){return this.request("/api/v1/chat",{method:"POST",body:JSON.stringify({message:e,language:a})})}async registerPushToken(e,a){return this.request("/api/v1/push-tokens",{method:"POST",body:JSON.stringify({token:e,platform:a})})}async getPharmaAssist(){return this.request("/api/v1/pharma-assist")}async compareMedicine(e){return this.request("/api/v1/pharma-assist/compare",{method:"POST",body:JSON.stringify({medicine_name:e})})}}const p=new z;let b,S,x,R,q;async function j(){try{const t=await y(()=>import("./index-B1POE996.js"),__vite__mapDeps([0,1]));b=t.Camera,S=t.CameraResultType,x=t.CameraSource}catch{console.log("Camera plugin not available (running in browser)")}try{R=(await y(()=>import("./index-BJevg_d7.js"),__vite__mapDeps([2,1]))).PushNotifications}catch{console.log("Push plugin not available")}try{q=(await y(()=>import("./index-HK50Ki82.js"),__vite__mapDeps([3,1]))).Preferences}catch{console.log("Preferences plugin not available")}}const m={currentPage:"dashboard",user:null,dashboardData:null,prescriptions:[],timelineEvents:[],isLoading:!1},r={app:null,loading:null,authContainer:null,mainContainer:null,mainContent:null,loginView:null,registerView:null,loginForm:null,registerForm:null,bottomNav:null,toastContainer:null};function N(){r.app=document.getElementById("app"),r.loading=document.getElementById("loading"),r.authContainer=document.getElementById("auth-container"),r.mainContainer=document.getElementById("main-container"),r.mainContent=document.getElementById("main-content"),r.loginView=document.getElementById("login-view"),r.registerView=document.getElementById("register-view"),r.loginForm=document.getElementById("login-form"),r.registerForm=document.getElementById("register-form"),r.bottomNav=document.querySelector(".bottom-nav"),r.toastContainer=document.getElementById("toast-container"),Object.entries(r).forEach(([t,e])=>{!e&&t!=="bottomNav"&&console.error(`Element not found: ${t}`)})}function d(t,e="info"){const a=document.createElement("div");a.className=`toast ${e}`,a.textContent=t,r.toastContainer.appendChild(a),setTimeout(()=>{a.style.animation="slideIn 0.3s ease reverse",setTimeout(()=>a.remove(),300)},3e3)}function v(t){m.currentPage=t,document.querySelectorAll(".nav-item").forEach(e=>{e.classList.toggle("active",e.dataset.page===t)}),D(t)}async function D(t){r.mainContent.style.animation="none",r.mainContent.offsetHeight,r.mainContent.style.animation="pageSlideIn 0.2s ease-out",r.mainContent.innerHTML='<div class="loading-screen"><div class="spinner"></div></div>';try{switch(t){case"dashboard":await T();break;case"scan":E();break;case"pharma":await O();break;case"timeline":await I();break;case"profile":F();break;default:await T()}}catch(e){d(e.message,"error")}}async function T(){app.currentPage="dashboard",document.querySelectorAll(".nav-item").forEach(s=>s.classList.remove("active"));const t=document.querySelector('.nav-item[data-page="dashboard"]');t&&t.classList.add("active");let e;try{e=await p.getDashboard()}catch(s){console.error("Dashboard API Error:",s),e={stats:{medicines:0,tests:0,prescriptions:0,reports:0},recent:[],todays_medication:[]}}m.dashboardData=e;const a=e.todays_medication||[],n={morning:a.filter(s=>(s.timing||"").toLowerCase().match(/morning|breakfast|am/)||!s.timing),afternoon:a.filter(s=>(s.timing||"").toLowerCase().match(/afternoon|lunch|day/)),night:a.filter(s=>(s.timing||"").toLowerCase().match(/night|dinner|bed|evening|pm/))},i=s=>!s||s.length===0?'<div class="med-dot" style="opacity: 0.3;"></div>':s.map(o=>`<div class="med-dot ${o.status==="taken","active"}" style="background: ${o.status==="taken"?"var(--color-neon-mint)":"var(--color-electric-cyan)"}"></div>`).join("");r.mainContent.innerHTML=`
        <header class="dashboard-header animate-fade-in">
            <div>
                <h1 class="greeting">Hello, ${m.user?m.user.name.split(" ")[0]:"User"} 👋</h1>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="icon-btn" style="background: white; border: none; padding: 8px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); color: var(--color-text-primary);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </button>
                <div class="user-avatar" onclick="navigate('profile')" style="margin: 0;">
                    ${m.user&&m.user.photo_url?`<img src="${m.user.photo_url}" />`:m.user?m.user.name.charAt(0):"U"}
                </div>
            </div>
        </header>

        <!-- Stats Row (v1.3) -->
        <div class="dashboard-stats animate-fade-in stagger-1">
            <div class="stat-card-white" onclick="navigate('timeline', 'medicine')">
                <div class="stat-value">${e.stats.medicines}</div>
                <div class="stat-label">Meds</div>
            </div>
            <div class="stat-card-white" onclick="navigate('timeline', 'test')">
                <div class="stat-value">${e.stats.tests}</div>
                <div class="stat-label">Tests</div>
            </div>
            <div class="stat-card-white" onclick="navigate('timeline', 'prescription')">
                <div class="stat-value">${e.stats.prescriptions}</div>
                <div class="stat-label">Rx</div>
            </div>
            <div class="stat-card-white" onclick="navigate('timeline', 'report')">
                <div class="stat-value">${e.stats.reports}</div>
                <div class="stat-label">Reports</div>
            </div>
        </div>

        <!-- Scan Banner -->
        <div class="scan-banner animate-fade-in stagger-2" onclick="app.setScanMode('prescription'); navigate('upload')">
            <div class="scan-banner-content">
                <div class="scan-banner-title">Scan Prescription</div>
                <div class="scan-banner-subtitle">Take a photo or upload from gallery</div>
            </div>
            <div class="scan-banner-icon">
                ➜
            </div>
        </div>

        <!-- Today's Medication Section -->
        <div class="card animate-fade-in-up stagger-3" style="margin-bottom: var(--space-lg);">
            <div class="card-header">
                <h2 class="card-title">Today's Medications</h2>
            </div>
            
            <div class="meds-timeline">
                <div class="med-time-col">
                    <div class="med-time-label">Morning</div>
                    <div class="med-dots">${i(n.morning)}</div>
                </div>
                <div class="med-time-col">
                    <div class="med-time-label">Afternoon</div>
                    <div class="med-dots">${i(n.afternoon)}</div>
                </div>
                <div class="med-time-col">
                    <div class="med-time-label">Night</div>
                    <div class="med-dots">${i(n.night)}</div>
                </div>
            </div>
            
             <div style="padding: 12px; border-top: 1px solid var(--color-bg-elevated);">
                <button class="btn-primary" onclick="app.showChat('What medicines should I take today?')" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                     Ask AI Assistant 🤖
                </button>
            </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="card animate-fade-in-up stagger-4">
             <div class="card-header" style="justify-content: space-between; display: flex;">
                <h2 class="card-title">Recent Activity</h2>
                <button onclick="navigate('timeline')" style="border: none; background: none; color: var(--color-primary); font-size: 13px; font-weight: 600;">View All</button>
            </div>
            ${e.recent.length>0?e.recent.map(s=>{var o;return`
                <div class="list-item" onclick="app.viewPrescription(${s.id})">
                    <div class="list-icon" style="background: ${s.type==="report"?"rgba(79, 172, 254, 0.1)":"rgba(0, 242, 254, 0.1)"}; color: var(--color-primary);">
                        ${s.type==="report"?"📄":"🏥"}
                    </div>
                    <div class="list-content">
                        <div class="list-title">${s.title}</div>
                        <div class="list-subtitle">${s.date||((o=s.upload_date)==null?void 0:o.split("T")[0])||"No date"}</div>
                    </div>
                </div>
            `}).join(""):'<div class="empty-state"><p>No recent activity</p></div>'}
        </div>
    `,window.Chart&&setTimeout(()=>{typeof C=="function"&&C()},100)}function E(){app.scanMode=app.scanMode||"prescription";const t={camera:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>',image:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',clipboard:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',fileText:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',sun:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',eye:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'};r.mainContent.innerHTML=`
            < div class= "scan-container" >
            <h1 class="scan-title">${app.scanMode==="prescription"?"Scan Prescription":"Scan Lab Report"}</h1>
            
            <!--Tab Selector-- >
            <div class="tab-selector">
                <button class="tab-item ${app.scanMode==="prescription"?"active":""}" onclick="app.setScanMode('prescription')">
                    ${t.clipboard} Prescription
                </button>
                <button class="tab-item ${app.scanMode==="report"?"active":""}" onclick="app.setScanMode('report')">
                    ${t.fileText} Lab Report
                </button>
            </div>
            
            <p class="scan-instructions">
                ${app.scanMode==="prescription"?"Take a clear photo of your prescription to extract medicines and dosages.":"Capture your lab report to analyze test results."}
            </p>
            
            <!--Main Scan Button-- >
            <button class="scan-button" id="camera-btn">
                ${t.camera}
            </button>

            <!--Action Buttons-- >
            <div style="display: flex; gap: var(--space-md); width: 100%; max-width: 320px;">
                <button class="btn-primary" id="take-photo-btn" style="flex: 1;">
                    ${t.camera} Take Photo
                </button>
                <button class="btn-secondary" id="pick-photo-btn" style="flex: 1;">
                    ${t.image} Gallery
                </button>
            </div>
            
            <!--Tips Section-- >
            <div class="scan-tips">
                <div class="scan-tips-title">💡 Tips for best results</div>
                <div class="scan-tips-list">
                    <div class="scan-tip">
                        <span class="scan-tip-icon">${t.sun}</span>
                        <span>Good lighting, avoid shadows</span>
                    </div>
                    <div class="scan-tip">
                        <span class="scan-tip-icon">${t.fileText}</span>
                        <span>Place on flat surface</span>
                    </div>
                    <div class="scan-tip">
                        <span class="scan-tip-icon">${t.eye}</span>
                        <span>All text should be visible</span>
                    </div>
                </div>
            </div>
            
            <!--Fallback file input for web-- >
            <input type="file" id="file-input" accept="image/*,.pdf" style="display: none;">
            </div>
    `,document.getElementById("camera-btn").addEventListener("click",()=>f("camera")),document.getElementById("take-photo-btn").addEventListener("click",()=>f("camera")),document.getElementById("pick-photo-btn").addEventListener("click",()=>f("gallery")),document.getElementById("file-input").addEventListener("change",V)}async function f(t){if(b)try{const e=await b.getPhoto({quality:90,allowEditing:!0,resultType:S.Base64,source:t==="camera"?x.Camera:x.Photos});app.scanMode==="report"?await L(e.base64String):await B(e.base64String)}catch(e){e.message!=="User cancelled photos app"&&d("Camera error: "+e.message,"error")}else document.getElementById("file-input").click()}async function V(t){const e=t.target.files[0];if(!e)return;const a=new FileReader;a.onload=async n=>{const i=n.target.result.split(",")[1];app.scanMode==="report"?await L(i):await B(i)},a.readAsDataURL(e)}async function B(t){r.mainContent.innerHTML=`
            < div class= "processing-container" >
            <div class="processing-ring">
                <svg viewBox="0 0 100 100">
                    <circle class="bg" cx="50" cy="50" r="45"></circle>
                    <circle class="progress" cx="50" cy="50" r="45"></circle>
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px;">📤</div>
            </div>
            <h2 class="processing-text">Analyzing Prescription...</h2>
            <p class="processing-subtext">AI is extracting medicines and dosages</p>
        </div >
            `;try{const e=await p.uploadPrescription(t);r.mainContent.innerHTML=`
            < div class="success-container" >
                <div class="success-icon">✅</div>
                <h2 class="success-title">Upload Successful!</h2>
                <p class="success-subtitle">Opening your prescription...</p>
            </div >
            `,setTimeout(()=>{e.id?app.viewPrescription(e.id):v("dashboard")},1500)}catch(e){r.mainContent.innerHTML=`
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
                <div style="font-size: 80px;">❌</div>
                <h2 style="margin-top: var(--space-lg); color: var(--color-soft-crimson);">Upload Failed</h2>
                <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">${e.message}</p>
                <button class="btn-primary" onclick="navigate('scan')" style="margin-top: var(--space-lg);">Try Again</button>
            </div >
            `}}async function L(t){r.mainContent.innerHTML=`
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
            <div class="upload-animation">
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="var(--color-neon-mint)" stroke-width="4" fill="none" stroke-dasharray="251" stroke-dashoffset="251">
                        <animate attributeName="stroke-dashoffset" values="251;0" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <text x="50" y="55" text-anchor="middle" fill="var(--color-neon-mint)" font-size="24">🧪</text>
                </svg>
            </div>
            <h2 style="margin-top: var(--space-lg); animation: pulse 1.5s infinite;">Analyzing Report...</h2>
            <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">Extracting test results</p>
        </div >
            <style>
                @keyframes pulse {0 %, 100 % { opacity: 1; } 50% {opacity: 0.5; } }
            </style>
        `;try{const e=await p.uploadReport(t);r.mainContent.innerHTML=`
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
                <div style="font-size: 80px; animation: bounceIn 0.5s;">✨</div>
                <h2 style="margin-top: var(--space-lg); color: var(--color-neon-mint);">Analysis Complete!</h2>
                <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">Report saved</p>
            </div >
            <style>
                @keyframes bounceIn {0 % { transform: scale(0); } 50% {transform: scale(1.2); } 100% {transform: scale(1); } }
            </style>
        `,setTimeout(()=>{v("dashboard"),d("Report uploaded: "+e.summary.substring(0,30)+"...","success")},1500)}catch(e){r.mainContent.innerHTML=`
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
                <div style="font-size: 80px;">❌</div>
                <h2 style="margin-top: var(--space-lg); color: var(--color-soft-crimson);">Analysis Failed</h2>
                <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">${e.message}</p>
                <button class="btn-primary" onclick="navigate('scan')" style="margin-top: var(--space-lg);">Try Again</button>
            </div >
            `}}async function I(t="all"){app.timelineFilter=t;const e={clipboard:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',fileText:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',thermometer:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>',calendar:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'},a=await p.getTimeline(1,50,t);m.timelineEvents=a.events;const n=`
            < div class="tab-selector" >
            <button class="tab-btn ${t==="all"?"active":""}" onclick="app.filterTimeline('all')">
                ${e.calendar} All
            </button>
            <button class="tab-btn ${t==="prescription"?"active":""}" onclick="app.filterTimeline('prescription')">
                ${e.clipboard} Rx
            </button>
            <button class="tab-btn ${t==="report"?"active":""}" onclick="app.filterTimeline('report')">
                ${e.fileText} Reports
            </button>
            <button class="tab-btn ${t==="test"?"active":""}" onclick="app.filterTimeline('test')">
                ${e.thermometer} Tests
            </button>
        </div >
            `;if(a.events.length===0){r.mainContent.innerHTML=`
            < h1 style = "margin-bottom: var(--space-md);" > Timeline</h1 >
                ${n}
        <div class="empty-state">
            <div style="margin-bottom: 16px; color: var(--color-text-muted); display: flex; justify-content: center;">
                <div style="width: 48px; height: 48px;">${t==="report"?e.fileText.replace('width="20"','width="100%"').replace('height="20"','height="100%"'):t==="test"?e.thermometer.replace('width="20"','width="100%"').replace('height="20"','height="100%"'):e.clipboard.replace('width="20"','width="100%"').replace('height="20"','height="100%"')}</div>
            </div>
            <p>No ${t==="all"?"records":t+"s"} yet</p>
            <p style="font-size: var(--font-size-sm); margin-top: 8px;">Upload prescriptions or reports to see them here</p>
        </div>
        `;return}const i={};a.events.forEach(o=>{const l=(o.date?new Date(o.date):new Date).toLocaleDateString("en-US",{month:"long",year:"numeric"});i[l]||(i[l]=[]),i[l].push(o)});let s=`< h1 style = "margin-bottom: var(--space-md);" > Timeline</h1 > ${n} `;for(const[o,c]of Object.entries(i))s+=`
            < div class="timeline-section" >
                <div class="timeline-header">${o}</div>
                ${c.map(l=>`
                    <div class="timeline-item" onclick="app.${l.type==="report"?"viewReport":"viewPrescription"}(${l.id})">
                        <div class="timeline-dot ${l.type}"></div>
                        <div class="card timeline-card">
                            <div class="timeline-card-header">
                                <span class="list-title">${l.title}</span>
                                <span class="badge ${l.type}">${l.type==="report"?e.fileText:e.clipboard} <span style="position: relative; top: -2px;">${l.type==="report"?"Report":"Rx"}</span></span>
                            </div>
                            <div class="list-subtitle">${l.summary||"No summary"}</div>
                            ${l.type==="prescription"?`
                                <div class="timeline-stats">
                                    <span style="display: inline-flex; align-items: center; gap: 4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> ${l.medicine_count||0} meds</span>
                                    <span style="display: inline-flex; align-items: center; gap: 4px; margin-left: 12px;">${e.thermometer.replace('width="20"','width="14"').replace('height="20"','height="14"')} ${l.test_count||0} tests</span>
                                </div>
                            `:""}
                        </div>
                    </div>
                `).join("")}
            </div >
            `;r.mainContent.innerHTML=s}async function O(){try{const t=await p.getPharmaAssist();let e=`
            < div style = "margin-bottom: var(--space-lg);" >
                <h1 style="margin-bottom: 2px;">Pharma Assist 💊</h1>
                <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Find affordable alternatives</p>
            </div >
            `;t.medicines&&t.medicines.length>0?e+=`
            < div class="card" style = "margin-bottom: var(--space-lg);" >
                    <h2 class="card-title" style="margin-bottom: var(--space-md);">Your Medicines</h2>
                    <p style="margin-bottom: var(--space-md); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Select a medicine to compare prices and find generic alternatives.</p>
                    
                    ${t.medicines.map(a=>`
                        <div class="list-item" onclick="app.compareMedicine('${a.name}')">
                            <div class="list-icon" style="background: rgba(0, 255, 163, 0.1); color: var(--color-neon-mint);">💊</div>
                            <div class="list-content">
                                <div class="list-title">${a.name}</div>
                                <div class="list-subtitle">${a.dosage||""} ${a.frequency||""}</div>
                            </div>
                            <div style="color: var(--color-electric-cyan);">Compare →</div>
                        </div>
                    `).join("")}
                </div >
            `:e+=`
            < div class="empty-state" >
                    <p>No medicines found in your prescriptions.</p>
                    <p>Upload a prescription to get started.</p>
                    <button class="btn-primary" onclick="navigate('scan')" style="margin-top: var(--space-md);">Scan Prescription</button>
                </div >
            `,e+=`
            < div class="card" >
                <h2 class="card-title" style="margin-bottom: var(--space-md);">Search Medicine</h2>
                <form id="pharma-search-form" style="display: flex; gap: var(--space-sm);">
                    <input type="text" id="pharma-search-input" placeholder="e.g. Paracetamol" required style="flex: 1;">
                    <button type="submit" class="btn-primary" style="width: auto; padding: 0 var(--space-lg);">🔍</button>
                </form>
            </div >
            `,r.mainContent.innerHTML=e,document.getElementById("pharma-search-form").addEventListener("submit",a=>{a.preventDefault();const n=document.getElementById("pharma-search-input").value.trim();n&&app.compareMedicine(n)})}catch(t){d("Failed to load medicines: "+t.message,"error"),v("dashboard")}}function F(){const t=m.user||JSON.parse(localStorage.getItem("user")||"{}"),e=(t.name||"U").split(" ").map(a=>a[0]).join("").toUpperCase();r.mainContent.innerHTML=`
            < div class="profile-header" >
            <div class="avatar">${e}</div>
            <div class="profile-name">${t.name||"User"}</div>
            <div class="profile-email">${t.email||""}</div>
        </div >

            <div class="card">
                <div class="menu-item" onclick="app.navigateTo('vitals')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <span>Health Vitals</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                <div class="menu-item" onclick="app.navigateTo('chat')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>AI Assistant</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                <div class="menu-item" onclick="app.openSettings()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>Settings</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                <div class="menu-item logout-btn" onclick="app.logout()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Log Out</span>
                </div>
            </div>
        `}function U(){document.getElementById("show-register").addEventListener("click",t=>{t.preventDefault(),r.loginView.classList.add("hidden"),r.registerView.classList.remove("hidden")}),document.getElementById("show-login").addEventListener("click",t=>{t.preventDefault(),r.registerView.classList.add("hidden"),r.loginView.classList.remove("hidden")}),r.loginForm.addEventListener("submit",async t=>{t.preventDefault();const e=document.getElementById("login-email").value,a=document.getElementById("login-password").value;try{const n=r.loginForm.querySelector("button");n.disabled=!0,n.textContent="Logging in...";const i=await p.login(e,a);m.user=i.user,w(),d(`Welcome back, ${i.user.name} !`,"success")}catch(n){d(n.message,"error")}finally{const n=r.loginForm.querySelector("button");n.disabled=!1,n.textContent="Log In"}}),r.registerForm.addEventListener("submit",async t=>{t.preventDefault();const e=document.getElementById("register-name").value,a=document.getElementById("register-email").value,n=document.getElementById("register-password").value;try{const i=r.registerForm.querySelector("button");i.disabled=!0,i.textContent="Creating account...";const s=await p.register(e,a,n);m.user=s.user,w(),d("Account created successfully!","success")}catch(i){d(i.message,"error")}finally{const i=r.registerForm.querySelector("button");i.disabled=!1,i.textContent="Create Account"}})}function J(){r.bottomNav.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault(),v(t.dataset.page)})})}function h(){r.loading&&r.loading.classList.add("hidden"),r.mainContainer&&r.mainContainer.classList.add("hidden"),r.authContainer&&r.authContainer.classList.remove("hidden")}function w(){r.loading&&r.loading.classList.add("hidden"),r.authContainer&&r.authContainer.classList.add("hidden"),r.mainContainer&&r.mainContainer.classList.remove("hidden"),v("dashboard")}window.app={viewPrescription:async t=>{var e;r.mainContent.innerHTML='<div class="loading-screen"><div class="spinner"></div></div>';try{const a=await p.getPrescription(t);let n=`
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >

            <h1 style="margin-bottom: var(--space-lg);">Prescription #${a.id}</h1>
        `;if((a.patient_summary||a.doctor_summary)&&(n+=`
            < div class="card" style = "border-left: 4px solid var(--color-neon-mint);" >
                <h2 style="margin-bottom: var(--space-md);">📋 AI Summary</h2>
                        ${a.patient_summary?`
                            <div style="padding: var(--space-md); background: rgba(0, 255, 163, 0.1); border-radius: var(--radius-md); margin-bottom: var(--space-sm);">
                                <strong style="color: var(--color-neon-mint);">For Patient:</strong>
                                <p style="margin-top: var(--space-xs); color: var(--color-text-secondary);">${a.patient_summary}</p>
                            </div>
                        `:""}
                        ${a.doctor_summary?`
                            <div style="padding: var(--space-md); background: rgba(0, 229, 255, 0.1); border-radius: var(--radius-md);">
                                <strong style="color: var(--color-electric-cyan);">Clinical Summary:</strong>
                                <p style="margin-top: var(--space-xs); color: var(--color-text-secondary);">${a.doctor_summary}</p>
                            </div>
                        `:""}
                    </div >
            `),a.medicines&&a.medicines.length>0&&(n+=`
            < div class="card" >
                        <h2 style="margin-bottom: var(--space-md);">💊 Medicines (${a.medicines.length})</h2>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; min-width: 500px;">
                                <thead>
                                    <tr style="background: var(--color-bg-elevated);">
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Medicine</th>
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Dosage</th>
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Frequency</th>
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${a.medicines.map(i=>`
                                        <tr>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border); font-weight: 600; color: var(--color-electric-cyan);">${i.name}</td>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border);">${i.dosage||"-"}</td>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border);">${i.frequency||"-"}</td>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border);">${i.duration||"-"}</td>
                                        </tr>
                                        ${i.timing?`
                                            <tr>
                                                <td colspan="4" style="padding: var(--space-xs) var(--space-sm); border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                                                    ⏰ ${i.timing}
                                                </td>
                                            </tr>
                                        `:""}
                                        ${i.instructions?`
                                            <tr>
                                                <td colspan="4" style="padding: var(--space-xs) var(--space-sm); border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                                                    📝 ${i.instructions}
                                                </td>
                                            </tr>
                                        `:""}
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div >
            `),a.tests&&a.tests.length>0&&(n+=`
            < div class="card" >
                <h2 style="margin-bottom: var(--space-md);">🔬 Medical Tests (${a.tests.length})</h2>
                        ${a.tests.map(i=>`
                            <div class="list-item" style="cursor: default;">
                                <div class="list-icon">🧪</div>
                                <div class="list-content">
                                    <div class="list-title">${i.test_name}</div>
                                    ${i.instructions?`<div class="list-subtitle">${i.instructions}</div>`:""}
                                </div>
                                <div style="background: ${i.status==="Completed"?"var(--color-neon-mint)":"#fef3c7"}; 
                                            color: ${i.status==="Completed"?"var(--color-bg-dark)":"#92400e"}; 
                                            padding: 4px 12px; border-radius: 4px; font-size: var(--font-size-sm);">
                                    ${i.status||"Pending"}
                                </div>
                            </div>
                        `).join("")}
                    </div >
            `),a.key_insights&&(n+=`
            < div class="card" >
                        <h2 style="margin-bottom: var(--space-md);">💡 Key Insights</h2>
                        <p style="color: var(--color-text-secondary);">${a.key_insights}</p>
                    </div >
            `),a.image_url){const i=localStorage.getItem("api_url")||"https://snobbily-civilisatory-denis.ngrok-free.dev",s=a.image_url.startsWith("http")?a.image_url:i+a.image_url;n+=`
            < div class="card" >
                        <h2 style="margin-bottom: var(--space-md);">🖼️ Prescription Image</h2>
                        <div style="text-align: center;">
                            <img src="${s}" alt="Prescription" 
                                 style="max-width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <p style="display: none; padding: var(--space-lg); background: var(--color-bg-elevated); border-radius: var(--radius-md);">
                                📄 Image not available
                            </p>
                        </div>
                    </div >
            `}n+=`
            < div class="card" >
                    <h2 style="margin-bottom: var(--space-md);">ℹ️ Details</h2>
                    <div class="list-item" style="cursor: default;">
                        <span style="color: var(--color-text-muted);">Visit Reason</span>
                        <span style="font-weight: 600;">${a.visit_reason||"Not specified"}</span>
                    </div>
                    <div class="list-item" style="cursor: default;">
                        <span style="color: var(--color-text-muted);">Prescription Date</span>
                        <span style="font-weight: 600;">${a.prescription_date||"N/A"}</span>
                    </div>
                    <div class="list-item" style="cursor: default;">
                        <span style="color: var(--color-text-muted);">Upload Date</span>
                        <span style="font-weight: 600;">${((e=a.upload_date)==null?void 0:e.split("T")[0])||"N/A"}</span>
                    </div>
                </div >
            `,n+=`
            < div style = "margin-top: var(--space-lg); margin-bottom: var(--space-xxl);" >
                <button class="btn-secondary" style="background: var(--color-soft-crimson); border-color: var(--color-soft-crimson); color: white;"
                    onclick="app.deletePrescription(${a.id})">
                    🗑️ Delete Prescription
                </button>
                </div >
            `,r.mainContent.innerHTML=n}catch(a){d("Failed to load prescription: "+a.message,"error"),v("dashboard")}},deletePrescription:async t=>{if(confirm("Are you sure you want to delete this prescription? This cannot be undone."))try{await p.deletePrescription(t),d("Prescription deleted","success"),v("dashboard")}catch(e){d("Delete failed: "+e.message,"error")}},navigateTo:t=>{switch(t){case"vitals":app.showVitals();break;case"chat":app.showChat();break;default:d(`${t} feature coming soon!`,"info")}},goBack:()=>{v("dashboard")},filterTimeline:t=>{I(t)},toggleHealthSummary:()=>{const t=document.getElementById("health-summary-content"),e=document.getElementById("health-summary-btn");t.style.display==="none"?(t.style.display="block",e.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Summary'):(t.style.display="none",e.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg> View Summary')},showVitals:async()=>{r.mainContent.innerHTML='<div class="loading-screen"><div class="spinner"></div></div>';try{const t=await p.getHealthReadings();let e=`
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >
                
                <h1 style="margin-bottom: var(--space-lg);">Health Vitals</h1>
                
                <button class="btn-primary" onclick="app.addVital()" style="margin-bottom: var(--space-lg);">
                    + Add Reading
                </button>
        `;t.readings&&t.readings.length>0?e+=t.readings.map(a=>`
            < div class="card" style = "margin-bottom: var(--space-md);" >
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div class="list-title" style="margin-bottom: 8px;">${a.date}</div>

                        ${a.bp_systolic?`
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--color-bg-elevated); padding-bottom: 8px;">
                                    <span style="color: var(--color-text-muted);">Blood Pressure</span>
                                    <span style="color: var(--color-electric-cyan); font-weight: 700;">${a.bp_systolic}/${a.bp_diastolic} <span style="font-size: 0.8em; color: var(--color-text-secondary);">mmHg</span></span>
                                </div>`:""}

                        ${a.sugar_level?`
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--color-text-muted);">Blood Sugar <span style="font-size: 0.8em;">(${a.sugar_type})</span></span>
                                    <span style="color: var(--color-electric-cyan); font-weight: 700;">${a.sugar_level} <span style="font-size: 0.8em; color: var(--color-text-secondary);">mg/dL</span></span>
                                </div>`:""}

                        ${a.notes?`<div class="list-subtitle" style="margin-top: 4px; font-style: italic;">📝 ${a.notes}</div>`:""}
                    </div>
                    <button onclick="app.deleteVital(${a.id})" style="background: none; border: none; color: var(--color-soft-crimson); font-size: 20px; cursor: pointer; margin-left: 12px;">🗑️</button>
                </div>
    </div >
            `).join(""):e+=`
            < div class="empty-state" >
                        <p>No health readings yet</p>
                        <p>Track your blood pressure, weight, glucose, etc.</p>
                    </div >
            `,r.mainContent.innerHTML=e}catch(t){d("Failed to load vitals: "+t.message,"error"),v("dashboard")}},addVital:()=>{const t=`
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.showVitals()" style="padding: 8px 16px;">
                    ← Back
                </button>
            </div >
            
            <h1 style="margin-bottom: var(--space-lg);">Add Health Reading</h1>
            
            <form id="vital-form" class="card">
                <div class="input-group">
                    <label>Reading Type</label>
                    <select id="vital-type" required style="padding: var(--space-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary);">
                        <option value="Blood Pressure">Blood Pressure</option>
                        <option value="Heart Rate">Heart Rate</option>
                        <option value="Weight">Weight</option>
                        <option value="Blood Sugar">Blood Sugar</option>
                        <option value="Temperature">Temperature</option>
                        <option value="Oxygen Level">Oxygen Level</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Value</label>
                    <input type="text" id="vital-value" required placeholder="e.g., 120/80">
                </div>
                <div class="input-group">
                    <label>Unit (optional)</label>
                    <input type="text" id="vital-unit" placeholder="e.g., mmHg, kg, mg/dL">
                </div>
                <div class="input-group">
                    <label>Notes (optional)</label>
                    <input type="text" id="vital-notes" placeholder="Any additional notes">
                </div>
                <button type="submit" class="btn-primary">Save Reading</button>
            </form>
        `;r.mainContent.innerHTML=t,document.getElementById("vital-form").addEventListener("submit",async e=>{e.preventDefault();try{await p.addHealthReading({reading_type:document.getElementById("vital-type").value,value:document.getElementById("vital-value").value,unit:document.getElementById("vital-unit").value,notes:document.getElementById("vital-notes").value}),d("Reading saved!","success"),app.showVitals()}catch(a){d("Failed to save: "+a.message,"error")}})},deleteVital:async t=>{if(confirm("Delete this reading?"))try{await p.deleteHealthReading(t),d("Reading deleted","success"),app.showVitals()}catch(e){d("Delete failed: "+e.message,"error")}},showChat:()=>{let t=[];const e=()=>{let a=`
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >
                
                <h1 style="margin-bottom: var(--space-lg);">AI Assistant</h1>
                
                <div id="chat-messages" style="min-height: 300px; max-height: 50vh; overflow-y: auto; margin-bottom: var(--space-md);">
                    ${t.length===0?`
                        <div class="card" style="text-align: center;">
                            <p style="font-size: 40px; margin-bottom: var(--space-md);">🤖</p>
                            <p>Hello! I'm your AI health assistant.</p>
                            <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-top: var(--space-sm);">Ask me about your prescriptions, medicines, or health questions.</p>
                        </div>
                    `:t.map(n=>`
                        <div class="card" style="margin-bottom: var(--space-sm); ${n.role==="user"?"background: var(--color-electric-cyan-10); margin-left: 20%;":"margin-right: 20%;"}">
                            <div style="font-weight: 600; margin-bottom: 4px; color: ${n.role==="user"?"var(--color-electric-cyan)":"var(--color-neon-mint)"};">
                                ${n.role==="user"?"👤 You":"🤖 AI"}
                            </div>
                            <div style="white-space: pre-wrap;">${n.content}</div>
                        </div>
                    `).join("")}
                </div>
                
                <form id="chat-form" style="display: flex; gap: var(--space-sm);">
                    <input type="text" id="chat-input" placeholder="Ask a question..." required style="flex: 1;">
                    <button type="submit" class="btn-primary" style="padding: var(--space-md) var(--space-lg);">Send</button>
                </form>
        `;r.mainContent.innerHTML=a,document.getElementById("chat-form").addEventListener("submit",async n=>{n.preventDefault();const i=document.getElementById("chat-input"),s=i.value.trim();if(!s)return;t.push({role:"user",content:s}),i.value="",e();const o=document.getElementById("chat-messages");o.innerHTML+='<div class="card" style="margin-right: 20%;"><div class="spinner" style="width: 24px; height: 24px;"></div></div>',o.scrollTop=o.scrollHeight;try{const c=await p.sendChatMessage(s);t.push({role:"assistant",content:c.response})}catch{t.push({role:"assistant",content:"Sorry, I encountered an error. Please try again."})}e(),document.getElementById("chat-messages").scrollTop=document.getElementById("chat-messages").scrollHeight})};e()},openSettings:()=>{const e=`
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
            </div >
            
            <h1 style="margin-bottom: var(--space-lg);">Settings</h1>
            
            <div class="card">
                <div class="menu-item" style="justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: var(--space-md);">
                        <span style="font-size: 24px;">🔔</span>
                        <span>Notifications</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="notification-toggle" ${localStorage.getItem("notifications_enabled")==="true"?"checked":""}>
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="menu-item" onclick="app.showServerConfig()">
                    <span style="font-size: 24px;">🌐</span>
                    <span style="flex: 1;">Server URL</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: var(--color-text-muted);">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                
                <div class="menu-item" style="cursor: default;">
                    <span style="font-size: 24px;">ℹ️</span>
                    <span style="flex: 1;">Version</span>
                    <span style="color: var(--color-text-muted);">1.0.0</span>
                </div>
            </div>
            
            <style>
                .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--color-border); transition: .3s; border-radius: 28px; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .3s; border-radius: 50%; }
                input:checked + .slider { background-color: var(--color-electric-cyan); }
                input:checked + .slider:before { transform: translateX(22px); }
            </style>
        `;r.mainContent.innerHTML=e,document.getElementById("notification-toggle").addEventListener("change",async a=>{const n=a.target.checked;localStorage.setItem("notifications_enabled",n),n&&"Notification"in window?await Notification.requestPermission()==="granted"?d("Notifications enabled!","success"):(a.target.checked=!1,localStorage.setItem("notifications_enabled","false"),d("Notification permission denied","error")):n||d("Notifications disabled","info")})},showServerConfig:()=>{const e=`
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.openSettings()" style="padding: 8px 16px;">
                    ← Back
                </button>
            </div >
            
            <h1 style="margin-bottom: var(--space-lg);">Server Configuration</h1>
            
            <div class="card">
                <div class="input-group">
                    <label>API Server URL</label>
                    <input type="url" id="server-url" value="${localStorage.getItem("api_url")||"https://snobbily-civilisatory-denis.ngrok-free.dev"}" placeholder="https://your-server.com">
                </div>
                <button class="btn-primary" onclick="app.saveServerUrl()">Save</button>
            </div>
            
            <div class="card" style="margin-top: var(--space-md);">
                <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
                    ⚠️ Only change this if you're connecting to a different server.
                    The app will reload after saving.
                </p>
            </div>
        `;r.mainContent.innerHTML=e},saveServerUrl:()=>{const t=document.getElementById("server-url").value.trim();t&&(localStorage.setItem("api_url",t),d("Server URL saved. Reloading...","success"),setTimeout(()=>location.reload(),1500))},compareMedicine:async t=>{var e;r.mainContent.innerHTML='<div class="loading-screen"><div class="spinner"></div><p style="margin-top: 16px;">Finding alternatives...</p></div>';try{const a=await p.compareMedicine(t);let n=`
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="navigate('pharma')" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >
                
                <h1 style="margin-bottom: var(--space-sm);">Comparison Results</h1>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-lg);">Alternatives for <strong>${t}</strong></p>
                
                <div class="card" style="border-left: 4px solid var(--color-electric-cyan);">
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 4px;">GENERIC NAME</div>
                    <div style="font-size: var(--font-size-lg); font-weight: 700;">${((e=a.original)==null?void 0:e.generic_name)||"Generic"}</div>
                    <div style="margin-top: var(--space-md); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                        ${a.note||"These alternatives contain the same active ingredients."}
                    </div>
                </div>
        `;a.alternatives&&a.alternatives.length>0&&(n+=`
            < div class="card" >
                <h2 class="card-title" style="margin-bottom: var(--space-md);">Alternatives</h2>
                        ${a.alternatives.map(i=>`
                            <div class="list-item" style="cursor: default; display: block;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <div style="font-weight: 700; font-size: var(--font-size-lg);">${i.name}</div>
                                    <div style="background: var(--color-neon-mint); color: var(--color-bg-dark); padding: 4px 8px; border-radius: 4px; font-weight: 700;">
                                        ${i.savings||"Save money"}
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: end;">
                                    <div>
                                        <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">${i.manufacturer}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-electric-cyan);">${i.estimated_price}</div>
                                        <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Est. Price</div>
                                    </div>
                                </div>
                                <div style="margin-top: var(--space-md);">
                                    <button class="btn-primary" onclick="app.buyMedicine('${i.name}')" style="background: var(--color-electric-cyan-10); color: var(--color-electric-cyan); border: 1px solid var(--color-electric-cyan);">
                                        🛒 Buy Now via 1mg
                                    </button>
                                </div>
                            </div>
                        `).join("")}
                    </div >
            `),n+=`
            < div class="card" style = "background: var(--color-bg-elevated);" >
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center;">
                    ⚠️ Prices are approximate estimates only. Always consult your doctor or pharmacist before switching brands.
                </p>
                </div >
            `,r.mainContent.innerHTML=n}catch(a){d("Comparison failed: "+a.message,"error"),v("pharma")}},buyMedicine:t=>{const e=`https://www.1mg.com/search/all?name=${encodeURIComponent(t)}`;window.open(e,"_system")},setScanMode:t=>{app.scanMode=t,E()},logout:async()=>{try{await p.logout(),d("Logged out successfully","info"),h()}catch{p.clearTokens(),h()}}};async function W(){if(N(),await j(),U(),J(),p.isAuthenticated())try{const t=await p.getMe();m.user=t,w()}catch{h()}else h()}W();app.generateHealthSummary=async function(t){const e=document.getElementById("health-summary-content");e.innerHTML='<div class="processing-container">Generating summary...</div>';try{const a=await p.generateHealthSummary();e.innerHTML='<div class="summary-text">'+a.summary+'</div><div style="font-size:10px; color:#888; text-align:right">Generated just now</div>'}catch(a){e.innerHTML='<div style="text-align:center; color:red; padding:10px">Failed to generate summary. <button class="btn-secondary" onclick="app.generateHealthSummary(this)">Try Again</button></div>',d(a.message,"error")}};async function C(){const t=document.getElementById("vitals-preview-card");t&&t.remove();const a=document.querySelector(".summary-card")||document.querySelector(".stats-row");if(!a)return;a.insertAdjacentHTML("afterend",`<div id="vitals-preview-card" class="card"><div class="card-header"><h2>Vitals Trends</h2><span class="card-action" onclick="navigate('vitals')">Add Data</span></div><div class="chart-container"><canvas id="bpChart"></canvas></div><div class="chart-container"><canvas id="sugarChart"></canvas></div></div>`);try{let i=[];try{i=await p.getHealthReadings()}catch(s){console.log("API e",s)}if(i&&i.length>0){const s=[...i].sort((c,l)=>new Date(c.date)-new Date(l.date)).slice(-7),o=s.map(c=>{const l=new Date(c.date);return`${l.getDate()}/${l.getMonth()+1}`});new Chart(document.getElementById("bpChart"),{type:"line",data:{labels:o,datasets:[{label:"Systolic",data:s.map(c=>c.bp_systolic),borderColor:"#FF2D55",borderWidth:2,tension:.4,fill:!1},{label:"Diastolic",data:s.map(c=>c.bp_diastolic),borderColor:"#FF9500",borderWidth:2,tension:.4,fill:!1}]},options:{responsive:!0,maintainAspectRatio:!1}}),new Chart(document.getElementById("sugarChart"),{type:"line",data:{labels:o,datasets:[{label:"Sugar",data:s.map(c=>c.sugar_level),borderColor:"#34C759",borderWidth:2,fill:!0,backgroundColor:"rgba(52, 199, 89, 0.1)",tension:.4}]},options:{responsive:!0,maintainAspectRatio:!1}})}else{const s=document.getElementById("vitals-preview-card");if(s){const o=s.querySelectorAll(".chart-container");o[0]&&(o[0].innerHTML='<div class="empty-state">No blood pressure data</div>'),o[1]&&(o[1].innerHTML='<div class="empty-state">No sugar level data</div>')}}}catch(i){console.error("Error loading charts:",i)}}export{y as _};
