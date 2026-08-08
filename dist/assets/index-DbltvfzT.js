var Gc=Object.defineProperty;var Hc=(s,e,t)=>e in s?Gc(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var go=(s,e,t)=>Hc(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const Vc=[{name:"Floresta Encantada",floor:2775578,light:8965188,fog:1718810,ambient:4482611,seed:1001,terrain:"forest",sky:4880954},{name:"Castelo Abandonado",floor:3815992,light:16737826,fog:1710618,ambient:5592405,seed:1002,terrain:"castle",sky:2763322},{name:"Vila Medieval",floor:5917226,light:16764006,fog:2763290,ambient:6706500,seed:1003,terrain:"village",sky:6719658},{name:"Deserto Escaldante",floor:9075274,light:16755251,fog:4868650,ambient:8943428,seed:1004,terrain:"desert",sky:8952234},{name:"Caverna de Cristais",floor:2763338,light:6711039,fog:657962,ambient:4473958,seed:1005,terrain:"crystal",sky:1710650},{name:"Montanha Nevada",floor:9079450,light:13426175,fog:5921386,ambient:7833753,seed:1006,terrain:"snow",sky:10070715},{name:"Pantano Sombrio",floor:2767386,light:8956484,fog:1714698,ambient:4478259,seed:1007,terrain:"swamp",sky:3820074},{name:"Ruinas Antigas",floor:4868666,light:14527078,fog:2763290,ambient:5592388,seed:1008,terrain:"ruins",sky:6974042},{name:"Ilha Vulcanica",floor:2759194,light:16729088,fog:1706506,ambient:5583650,seed:1009,terrain:"volcanic",sky:3807754},{name:"Cidade Futurista",floor:1714746,light:52479,fog:662058,ambient:3364198,seed:1010,terrain:"tech",sky:1714762},{name:"Porto Pirata",floor:4864538,light:16755268,fog:2763290,ambient:6706483,seed:1011,terrain:"pirate",sky:5605546},{name:"Templo Esquecido",floor:3815978,light:16768324,fog:1710602,ambient:5596740,seed:1012,terrain:"temple",sky:5921354},{name:"Mina Subterranea",floor:2763290,light:16763904,fog:657920,ambient:4473907,seed:1013,terrain:"mine",sky:1710602},{name:"Arena de Gladiadores",floor:5917242,light:16746564,fog:2763290,ambient:6706500,seed:1014,terrain:"arena",sky:6719658},{name:"Laboratorio Secreto",floor:2767418,light:4521932,fog:662042,ambient:3364181,seed:1015,terrain:"lab",sky:1714730},{name:"Fortaleza Congelada",floor:4872810,light:11193599,fog:2767434,ambient:5596791,seed:1016,terrain:"fortress",sky:8030874},{name:"Floresta de Bambu",floor:2771482,light:8969540,fog:1718794,ambient:4482611,seed:1017,terrain:"bamboo",sky:5929546},{name:"Penhasco dos Ventos",floor:5921354,light:13421738,fog:3815978,ambient:6710869,seed:1018,terrain:"canyon",sky:7838139},{name:"Cidade Submersa",floor:1714746,light:4491434,fog:662058,ambient:3359829,seed:1019,terrain:"underwater",sky:1718874},{name:"Vale dos Dragoes",floor:3807770,light:16737826,fog:2755082,ambient:6702114,seed:1020,terrain:"dragon",sky:4860442},{name:"Tundra Gelada",floor:6978170,light:12312063,fog:4872794,ambient:6715255,seed:1021,terrain:"snow",sky:9083562},{name:"Selva Tropical",floor:1722890,light:6736947,fog:1714698,ambient:3368482,seed:1022,terrain:"jungle",sky:4880954},{name:"Cemiterio Amaldicoado",floor:1710618,light:8930474,fog:657946,ambient:4469589,seed:1023,terrain:"cemetery",sky:2759226},{name:"Torre do Mago",floor:2759226,light:11158783,fog:657946,ambient:4469606,seed:1024,terrain:"crystal",sky:2759242},{name:"Reino nas Nuvens",floor:8026762,light:16777164,fog:6974074,ambient:8947865,seed:1025,terrain:"cloud",sky:11184844},{name:"Planicie Dourada",floor:6969898,light:16763972,fog:3815962,ambient:7824964,seed:1026,terrain:"desert",sky:7838139},{name:"Canyon Rochoso",floor:5913130,light:14518340,fog:2759178,ambient:6706500,seed:1027,terrain:"canyon",sky:6719658},{name:"Palacio Real",floor:4864586,light:16764040,fog:2759210,ambient:5588053,seed:1028,terrain:"palace",sky:5596842},{name:"Dimensao Sombria",floor:657946,light:6693546,fog:328968,ambient:3351108,seed:1029,terrain:"dark",sky:657946},{name:"Planeta Alienigena",floor:1718826,light:2293674,fog:662026,ambient:3364164,seed:1030,terrain:"alien",sky:666138}];function Wc(s=3){return[...Vc].sort(()=>Math.random()-.5).slice(0,s)}class Xc{constructor(){this.menuEl=document.getElementById("menu"),this.lobbyEl=document.getElementById("lobby"),this.mapVoteEl=document.getElementById("map-vote"),this.shopEl=document.getElementById("shop"),this.btnSingle=document.getElementById("btn-singleplayer"),this.btnMulti=document.getElementById("btn-multiplayer"),this.btnStart=document.getElementById("btn-start-game"),this.btnBack=document.getElementById("btn-back-menu"),this.playersList=document.getElementById("players-list"),this.mapOptionsEl=document.getElementById("map-options"),this.selectedMap=null,this._mapVoteCallback=null,this._shopCallback=null,this.shopPurchases={},this.ownedItems=new Set,this.reviveCount=0,this.readBalances(),this.setupShop()}getPlayerName(){return document.getElementById("player-name").value.trim()||"Jogador"}onSingleplayer(e){this.btnSingle.addEventListener("click",()=>{const t=this.getPlayerName();this.hide(),this.showMapVote(n=>{this.showShop(i=>{e(t,n,i)})})})}onMultiplayer(e){this.btnMulti.addEventListener("click",e)}onStartGame(e){this.btnStart.addEventListener("click",e)}onBackToMenu(e){this.btnBack.addEventListener("click",e)}show(){this.menuEl.style.display="flex"}hide(){this.menuEl.style.display="none"}showMapVote(e){this._mapVoteCallback=e,this.selectedMap=null,this.mapVoteEl.style.display="flex",this.lobbyEl&&(this.lobbyEl.style.display="none"),this.mapOptionsEl.innerHTML="",Wc(3).forEach((n,i)=>{const a=document.createElement("div");a.className="map-card";const o=document.createElement("div");o.className="map-preview",o.style.background=`linear-gradient(135deg, #${n.sky.toString(16).padStart(6,"0")}, #${n.floor.toString(16).padStart(6,"0")})`,a.appendChild(o);const r=document.createElement("div");r.className="map-name",r.textContent=n.name,a.appendChild(r),a.addEventListener("click",()=>{this.mapOptionsEl.querySelectorAll(".map-card").forEach(c=>c.classList.remove("selected")),a.classList.add("selected"),this.selectedMap=n,setTimeout(()=>{this.hideMapVote(),this._mapVoteCallback&&this._mapVoteCallback(n)},500)}),this.mapOptionsEl.appendChild(a)})}hideMapVote(){this.mapVoteEl.style.display="none"}showShop(e){this._shopCallback=e,this.loadPurchases(),this.readBalances(),this.updateShopBalance(),this.shopEl.style.display="flex",this.shopEl.querySelectorAll(".shop-item").forEach(t=>{t.classList.toggle("bought",this.isOwned(t.dataset.item))}),this.updateShopCart()}hideShop(){this.shopEl.style.display="none"}setupShop(){document.getElementById("btn-convert-tokens").addEventListener("click",()=>{if(this.readBalances(),!Number.isSafeInteger(this.money)||this.money<1e3){this.showConvertError("Você precisa de $1.000 para comprar 1 token.");return}const e=this.money-1e3,t=this.tokens+1;this.money=e,this.tokens=t,localStorage.setItem("capiquake_money",e),localStorage.setItem("capiquake_tokens",t),this.clearConvertError(),this.updateShopBalance()}),this.shopEl.querySelectorAll(".shop-item").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.item;if(this.isOwned(t))return;const n=Number.parseInt(e.dataset.cost,10),i=e.dataset.currency;if(this.readBalances(),!(!Number.isSafeInteger(n)||n<=0)&&!(i==="money"&&(this.money===null||this.money<n))&&!(i==="tokens"&&(this.tokens===null||this.tokens<n))){if(i==="money")this.money-=n,localStorage.setItem("capiquake_money",this.money);else if(i==="tokens")this.tokens-=n,localStorage.setItem("capiquake_tokens",this.tokens);else return;t==="revive"?this.reviveCount=Math.min(this.reviveCount+1,3):this.ownedItems.add(t),this.savePurchases(),this.shopPurchases=this.buildPurchases(),e.classList.toggle("bought",this.isOwned(t)),this.updateShopBalance(),this.updateShopCart()}})}),document.getElementById("btn-start-game-shop").addEventListener("click",()=>{this.shopPurchases=this.buildPurchases(),this.hideShop(),this._shopCallback&&this._shopCallback(this.shopPurchases)})}loadPurchases(){this.ownedItems=new Set,this.reviveCount=0;try{const e=JSON.parse(localStorage.getItem("capiquake_purchases")||"{}");Array.isArray(e.items)&&(this.ownedItems=new Set(e.items.filter(t=>typeof t=="string"))),Number.isSafeInteger(e.revive)&&e.revive>0&&(this.reviveCount=Math.min(e.revive,3))}catch{this.ownedItems=new Set,this.reviveCount=0}this.shopPurchases=this.buildPurchases()}savePurchases(){try{localStorage.setItem("capiquake_purchases",JSON.stringify({items:Array.from(this.ownedItems),revive:this.reviveCount}))}catch{}}isOwned(e){return e==="revive"?this.reviveCount>=3:this.ownedItems.has(e)}buildPurchases(){const e={};for(const t of this.ownedItems)this.applyItem(e,t);return this.reviveCount>0&&(e.revive=this.reviveCount),e}applyItem(e,t){switch(t){case"minigun":e.weapons=e.weapons||{},e.weapons.minigun=!0;break;case"ak47":e.weapons=e.weapons||{},e.weapons.ak47=!0;break;case"armor25":e.armor=(e.armor||0)+25;break;case"armor50":e.armor=(e.armor||0)+50;break;case"speedBoost":e.speedBoost=!0;break;case"healthBoost":e.healthBoost=!0;break;case"ammo-bazuca":e.ammoBazuca=100;break;case"ammo-chicken":e.ammoChicken=10;break;case"ammo-sniper":e.ammoSniper=10;break;case"armor-leather":e.armorType="leather";break;case"armor-gold":e.armorType="gold";break;case"armor-iron":e.armorType="iron";break;case"armor-diamond":e.armorType="diamond";break;case"armor-void":e.armorType="void";break;case"void-explosion":e.voidExplosion=!0;break;case"teleport":e.teleport=!0;break;case"speed-rush":e.speedRush=!0;break;case"enchant-fire":e.enchantFire=!0;break;case"enchant-ice":e.enchantIce=!0;break;case"enchant-lightning":e.enchantLightning=!0;break;case"skin-void":e.skinVoid=!0;break;case"skin-flame":e.skinFlame=!0;break;case"skin-steam":e.skinSteam=!0;break;case"weapon-skin-void":e.weaponSkinVoid=!0;break;case"weapon-skin-gold":e.weaponSkinGold=!0;break;case"weapon-skin-cryogenic":e.weaponSkinCryogenic=!0;break}}updateShopCart(){const e=document.getElementById("shop-cart");if(!e)return;const t=Object.keys(this.shopPurchases);e.textContent=t.length>0?"Comprado: "+t.join(", "):""}readBalances(){this.tokens=this.readBalance("capiquake_tokens"),this.money=this.readBalance("capiquake_money")}readBalance(e){const t=localStorage.getItem(e),n=Number.parseInt(t,10);return t!==null&&Number.isSafeInteger(n)&&n>=0?n:0}showConvertError(e){const t=document.getElementById("shop-convert-error");t&&(t.textContent=e,t.hidden=!1)}clearConvertError(){const e=document.getElementById("shop-convert-error");e&&(e.hidden=!0)}updateShopBalance(){document.getElementById("shop-tokens").textContent="TOKENS: "+this.tokens,document.getElementById("shop-money").textContent="R$: "+this.money}showLobby(){this.menuEl.style.display="none",this.lobbyEl.style.display="flex"}hideLobby(){this.lobbyEl.style.display="none"}updatePlayersList(e){this.playersList.replaceChildren(),e.forEach(t=>{const n=document.createElement("div");n.className="player-entry",n.textContent=t.name,this.playersList.appendChild(n)})}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $s="164",qc=0,wo=1,Yc=2,Zc=0,$r=1,jc=2,mn=3,kn=0,zt=1,Lt=2,Pn=0,Mi=1,xo=2,_o=3,vo=4,Kc=5,Yn=100,$c=101,Jc=102,Qc=103,el=104,tl=200,nl=201,il=202,al=203,Fs=204,zs=205,sl=206,ol=207,rl=208,cl=209,ll=210,hl=211,dl=212,ul=213,pl=214,fl=0,ml=1,gl=2,La=3,wl=4,xl=5,_l=6,vl=7,Xa=0,yl=1,Ml=2,In=0,Sl=1,bl=2,El=3,Tl=4,Al=5,Rl=6,Cl=7,Jr=300,Ai=301,Ri=302,Gs=303,Hs=304,qa=306,Vs=1e3,Kn=1001,Ws=1002,jt=1003,Pl=1004,Qi=1005,tn=1006,ns=1007,$n=1008,Nn=1009,Il=1010,Dl=1011,Qr=1012,ec=1013,Ci=1014,Rn=1015,Ya=1016,tc=1017,nc=1018,Zi=1020,Ll=35902,kl=1021,Nl=1022,cn=1023,Ul=1024,Bl=1025,Si=1026,Yi=1027,Ol=1028,ic=1029,Fl=1030,ac=1031,sc=1033,is=33776,as=33777,ss=33778,os=33779,yo=35840,Mo=35841,So=35842,bo=35843,Eo=36196,To=37492,Ao=37496,Ro=37808,Co=37809,Po=37810,Io=37811,Do=37812,Lo=37813,ko=37814,No=37815,Uo=37816,Bo=37817,Oo=37818,Fo=37819,zo=37820,Go=37821,rs=36492,Ho=36494,Vo=36495,zl=36283,Wo=36284,Xo=36285,qo=36286,Gl=3200,Hl=3201,Za=0,Vl=1,An="",sn="srgb",Bn="srgb-linear",Js="display-p3",ja="display-p3-linear",ka="linear",it="srgb",Na="rec709",Ua="p3",ei=7680,Yo=519,Wl=512,Xl=513,ql=514,oc=515,Yl=516,Zl=517,jl=518,Kl=519,Xs=35044,Zo="300 es",xn=2e3,Ba=2001;class Ii{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const a=i.indexOf(t);a!==-1&&i.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let a=0,o=i.length;a<o;a++)i[a].call(this,e);e.target=null}}}const At=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ca=Math.PI/180,qs=180/Math.PI;function Dn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(At[s&255]+At[s>>8&255]+At[s>>16&255]+At[s>>24&255]+"-"+At[e&255]+At[e>>8&255]+"-"+At[e>>16&15|64]+At[e>>24&255]+"-"+At[t&63|128]+At[t>>8&255]+"-"+At[t>>16&255]+At[t>>24&255]+At[n&255]+At[n>>8&255]+At[n>>16&255]+At[n>>24&255]).toLowerCase()}function Ot(s,e,t){return Math.max(e,Math.min(t,s))}function $l(s,e){return(s%e+e)%e}function cs(s,e,t){return(1-t)*s+t*e}function rn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function et(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Re{constructor(e=0,t=0){Re.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),a=this.x-e.x,o=this.y-e.y;return this.x=a*n-o*i+e.x,this.y=a*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(e,t,n,i,a,o,r,c,h){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,a,o,r,c,h)}set(e,t,n,i,a,o,r,c,h){const d=this.elements;return d[0]=e,d[1]=i,d[2]=r,d[3]=t,d[4]=a,d[5]=c,d[6]=n,d[7]=o,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,a=this.elements,o=n[0],r=n[3],c=n[6],h=n[1],d=n[4],u=n[7],p=n[2],m=n[5],x=n[8],_=i[0],w=i[3],g=i[6],S=i[1],v=i[4],E=i[7],I=i[2],C=i[5],P=i[8];return a[0]=o*_+r*S+c*I,a[3]=o*w+r*v+c*C,a[6]=o*g+r*E+c*P,a[1]=h*_+d*S+u*I,a[4]=h*w+d*v+u*C,a[7]=h*g+d*E+u*P,a[2]=p*_+m*S+x*I,a[5]=p*w+m*v+x*C,a[8]=p*g+m*E+x*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],a=e[3],o=e[4],r=e[5],c=e[6],h=e[7],d=e[8];return t*o*d-t*r*h-n*a*d+n*r*c+i*a*h-i*o*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],a=e[3],o=e[4],r=e[5],c=e[6],h=e[7],d=e[8],u=d*o-r*h,p=r*c-d*a,m=h*a-o*c,x=t*u+n*p+i*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=u*_,e[1]=(i*h-d*n)*_,e[2]=(r*n-i*o)*_,e[3]=p*_,e[4]=(d*t-i*c)*_,e[5]=(i*a-r*t)*_,e[6]=m*_,e[7]=(n*c-h*t)*_,e[8]=(o*t-n*a)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,a,o,r){const c=Math.cos(a),h=Math.sin(a);return this.set(n*c,n*h,-n*(c*o+h*r)+o+e,-i*h,i*c,-i*(-h*o+c*r)+r+t,0,0,1),this}scale(e,t){return this.premultiply(ls.makeScale(e,t)),this}rotate(e){return this.premultiply(ls.makeRotation(-e)),this}translate(e,t){return this.premultiply(ls.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ls=new Ne;function rc(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Oa(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Jl(){const s=Oa("canvas");return s.style.display="block",s}const jo={};function cc(s){s in jo||(jo[s]=!0,console.warn(s))}const Ko=new Ne().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),$o=new Ne().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ea={[Bn]:{transfer:ka,primaries:Na,toReference:s=>s,fromReference:s=>s},[sn]:{transfer:it,primaries:Na,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[ja]:{transfer:ka,primaries:Ua,toReference:s=>s.applyMatrix3($o),fromReference:s=>s.applyMatrix3(Ko)},[Js]:{transfer:it,primaries:Ua,toReference:s=>s.convertSRGBToLinear().applyMatrix3($o),fromReference:s=>s.applyMatrix3(Ko).convertLinearToSRGB()}},Ql=new Set([Bn,ja]),tt={enabled:!0,_workingColorSpace:Bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Ql.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=ea[e].toReference,i=ea[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return ea[s].primaries},getTransfer:function(s){return s===An?ka:ea[s].transfer}};function bi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function hs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ti;class eh{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ti===void 0&&(ti=Oa("canvas")),ti.width=e.width,ti.height=e.height;const n=ti.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ti}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Oa("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),a=i.data;for(let o=0;o<a.length;o++)a[o]=bi(a[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(bi(t[n]/255)*255):t[n]=bi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let th=0;class lc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=Dn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let a;if(Array.isArray(i)){a=[];for(let o=0,r=i.length;o<r;o++)i[o].isDataTexture?a.push(ds(i[o].image)):a.push(ds(i[o]))}else a=ds(i);n.url=a}return t||(e.images[this.uuid]=n),n}}function ds(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?eh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let nh=0;class kt extends Ii{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,n=Kn,i=Kn,a=tn,o=$n,r=cn,c=Nn,h=kt.DEFAULT_ANISOTROPY,d=An){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:nh++}),this.uuid=Dn(),this.name="",this.source=new lc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=h,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Re(0,0),this.repeat=new Re(1,1),this.center=new Re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Jr)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vs:e.x=e.x-Math.floor(e.x);break;case Kn:e.x=e.x<0?0:1;break;case Ws:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vs:e.y=e.y-Math.floor(e.y);break;case Kn:e.y=e.y<0?0:1;break;case Ws:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=Jr;kt.DEFAULT_ANISOTROPY=1;class ct{constructor(e=0,t=0,n=0,i=1){ct.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,a=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*a,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*a,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*a,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*a,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,a;const c=e.elements,h=c[0],d=c[4],u=c[8],p=c[1],m=c[5],x=c[9],_=c[2],w=c[6],g=c[10];if(Math.abs(d-p)<.01&&Math.abs(u-_)<.01&&Math.abs(x-w)<.01){if(Math.abs(d+p)<.1&&Math.abs(u+_)<.1&&Math.abs(x+w)<.1&&Math.abs(h+m+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(h+1)/2,E=(m+1)/2,I=(g+1)/2,C=(d+p)/4,P=(u+_)/4,k=(x+w)/4;return v>E&&v>I?v<.01?(n=0,i=.707106781,a=.707106781):(n=Math.sqrt(v),i=C/n,a=P/n):E>I?E<.01?(n=.707106781,i=0,a=.707106781):(i=Math.sqrt(E),n=C/i,a=k/i):I<.01?(n=.707106781,i=.707106781,a=0):(a=Math.sqrt(I),n=P/a,i=k/a),this.set(n,i,a,t),this}let S=Math.sqrt((w-x)*(w-x)+(u-_)*(u-_)+(p-d)*(p-d));return Math.abs(S)<.001&&(S=1),this.x=(w-x)/S,this.y=(u-_)/S,this.z=(p-d)/S,this.w=Math.acos((h+m+g-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ih extends Ii{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:tn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new kt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let r=0;r<o;r++)this.textures[r]=a.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,a=this.textures.length;i<a;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new lc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qn extends ih{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class hc extends kt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=jt,this.minFilter=jt,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ah extends kt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=jt,this.minFilter=jt,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ji{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,a,o,r){let c=n[i+0],h=n[i+1],d=n[i+2],u=n[i+3];const p=a[o+0],m=a[o+1],x=a[o+2],_=a[o+3];if(r===0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(r===1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=_;return}if(u!==_||c!==p||h!==m||d!==x){let w=1-r;const g=c*p+h*m+d*x+u*_,S=g>=0?1:-1,v=1-g*g;if(v>Number.EPSILON){const I=Math.sqrt(v),C=Math.atan2(I,g*S);w=Math.sin(w*C)/I,r=Math.sin(r*C)/I}const E=r*S;if(c=c*w+p*E,h=h*w+m*E,d=d*w+x*E,u=u*w+_*E,w===1-r){const I=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=I,h*=I,d*=I,u*=I}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,a,o){const r=n[i],c=n[i+1],h=n[i+2],d=n[i+3],u=a[o],p=a[o+1],m=a[o+2],x=a[o+3];return e[t]=r*x+d*u+c*m-h*p,e[t+1]=c*x+d*p+h*u-r*m,e[t+2]=h*x+d*m+r*p-c*u,e[t+3]=d*x-r*u-c*p-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,a=e._z,o=e._order,r=Math.cos,c=Math.sin,h=r(n/2),d=r(i/2),u=r(a/2),p=c(n/2),m=c(i/2),x=c(a/2);switch(o){case"XYZ":this._x=p*d*u+h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u-p*m*x;break;case"YXZ":this._x=p*d*u+h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u+p*m*x;break;case"ZXY":this._x=p*d*u-h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u-p*m*x;break;case"ZYX":this._x=p*d*u-h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u+p*m*x;break;case"YZX":this._x=p*d*u+h*m*x,this._y=h*m*u+p*d*x,this._z=h*d*x-p*m*u,this._w=h*d*u-p*m*x;break;case"XZY":this._x=p*d*u-h*m*x,this._y=h*m*u-p*d*x,this._z=h*d*x+p*m*u,this._w=h*d*u+p*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],a=t[8],o=t[1],r=t[5],c=t[9],h=t[2],d=t[6],u=t[10],p=n+r+u;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(a-h)*m,this._z=(o-i)*m}else if(n>r&&n>u){const m=2*Math.sqrt(1+n-r-u);this._w=(d-c)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(a+h)/m}else if(r>u){const m=2*Math.sqrt(1+r-n-u);this._w=(a-h)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-n-r);this._w=(o-i)/m,this._x=(a+h)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ot(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,a=e._z,o=e._w,r=t._x,c=t._y,h=t._z,d=t._w;return this._x=n*d+o*r+i*h-a*c,this._y=i*d+o*c+a*r-n*h,this._z=a*d+o*h+n*c-i*r,this._w=o*d-n*r-i*c-a*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,a=this._z,o=this._w;let r=o*e._w+n*e._x+i*e._y+a*e._z;if(r<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,r=-r):this.copy(e),r>=1)return this._w=o,this._x=n,this._y=i,this._z=a,this;const c=1-r*r;if(c<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*a+t*this._z,this.normalize(),this}const h=Math.sqrt(c),d=Math.atan2(h,r),u=Math.sin((1-t)*d)/h,p=Math.sin(t*d)/h;return this._w=o*u+this._w*p,this._x=n*u+this._x*p,this._y=i*u+this._y*p,this._z=a*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,n=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Jo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Jo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*i,this.y=a[1]*t+a[4]*n+a[7]*i,this.z=a[2]*t+a[5]*n+a[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,a=e.elements,o=1/(a[3]*t+a[7]*n+a[11]*i+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*i+a[12])*o,this.y=(a[1]*t+a[5]*n+a[9]*i+a[13])*o,this.z=(a[2]*t+a[6]*n+a[10]*i+a[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,a=e.x,o=e.y,r=e.z,c=e.w,h=2*(o*i-r*n),d=2*(r*t-a*i),u=2*(a*n-o*t);return this.x=t+c*h+o*u-r*d,this.y=n+c*d+r*h-a*u,this.z=i+c*u+a*d-o*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i,this.y=a[1]*t+a[5]*n+a[9]*i,this.z=a[2]*t+a[6]*n+a[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,a=e.z,o=t.x,r=t.y,c=t.z;return this.x=i*c-a*r,this.y=a*o-n*c,this.z=n*r-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return us.copy(this).projectOnVector(e),this.sub(us)}reflect(e){return this.sub(us.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const us=new N,Jo=new ji;class Ki{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Kt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Kt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Kt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)e.isMesh===!0?e.getVertexPosition(o,Kt):Kt.fromBufferAttribute(a,o),Kt.applyMatrix4(e.matrixWorld),this.expandByPoint(Kt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ta.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ta.copy(n.boundingBox)),ta.applyMatrix4(e.matrixWorld),this.union(ta)}const i=e.children;for(let a=0,o=i.length;a<o;a++)this.expandByObject(i[a],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Kt),Kt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ui),na.subVectors(this.max,Ui),ni.subVectors(e.a,Ui),ii.subVectors(e.b,Ui),ai.subVectors(e.c,Ui),yn.subVectors(ii,ni),Mn.subVectors(ai,ii),Fn.subVectors(ni,ai);let t=[0,-yn.z,yn.y,0,-Mn.z,Mn.y,0,-Fn.z,Fn.y,yn.z,0,-yn.x,Mn.z,0,-Mn.x,Fn.z,0,-Fn.x,-yn.y,yn.x,0,-Mn.y,Mn.x,0,-Fn.y,Fn.x,0];return!ps(t,ni,ii,ai,na)||(t=[1,0,0,0,1,0,0,0,1],!ps(t,ni,ii,ai,na))?!1:(ia.crossVectors(yn,Mn),t=[ia.x,ia.y,ia.z],ps(t,ni,ii,ai,na))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Kt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Kt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const hn=[new N,new N,new N,new N,new N,new N,new N,new N],Kt=new N,ta=new Ki,ni=new N,ii=new N,ai=new N,yn=new N,Mn=new N,Fn=new N,Ui=new N,na=new N,ia=new N,zn=new N;function ps(s,e,t,n,i){for(let a=0,o=s.length-3;a<=o;a+=3){zn.fromArray(s,a);const r=i.x*Math.abs(zn.x)+i.y*Math.abs(zn.y)+i.z*Math.abs(zn.z),c=e.dot(zn),h=t.dot(zn),d=n.dot(zn);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>r)return!1}return!0}const sh=new Ki,Bi=new N,fs=new N;class Ka{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):sh.setFromPoints(e).getCenter(n);let i=0;for(let a=0,o=e.length;a<o;a++)i=Math.max(i,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bi.subVectors(e,this.center);const t=Bi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Bi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bi.copy(e.center).add(fs)),this.expandByPoint(Bi.copy(e.center).sub(fs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new N,ms=new N,aa=new N,Sn=new N,gs=new N,sa=new N,ws=new N;class Qs{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(dn.copy(this.origin).addScaledVector(this.direction,t),dn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ms.copy(e).add(t).multiplyScalar(.5),aa.copy(t).sub(e).normalize(),Sn.copy(this.origin).sub(ms);const a=e.distanceTo(t)*.5,o=-this.direction.dot(aa),r=Sn.dot(this.direction),c=-Sn.dot(aa),h=Sn.lengthSq(),d=Math.abs(1-o*o);let u,p,m,x;if(d>0)if(u=o*c-r,p=o*r-c,x=a*d,u>=0)if(p>=-x)if(p<=x){const _=1/d;u*=_,p*=_,m=u*(u+o*p+2*r)+p*(o*u+p+2*c)+h}else p=a,u=Math.max(0,-(o*p+r)),m=-u*u+p*(p+2*c)+h;else p=-a,u=Math.max(0,-(o*p+r)),m=-u*u+p*(p+2*c)+h;else p<=-x?(u=Math.max(0,-(-o*a+r)),p=u>0?-a:Math.min(Math.max(-a,-c),a),m=-u*u+p*(p+2*c)+h):p<=x?(u=0,p=Math.min(Math.max(-a,-c),a),m=p*(p+2*c)+h):(u=Math.max(0,-(o*a+r)),p=u>0?a:Math.min(Math.max(-a,-c),a),m=-u*u+p*(p+2*c)+h);else p=o>0?-a:a,u=Math.max(0,-(o*p+r)),m=-u*u+p*(p+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ms).addScaledVector(aa,p),m}intersectSphere(e,t){dn.subVectors(e.center,this.origin);const n=dn.dot(this.direction),i=dn.dot(dn)-n*n,a=e.radius*e.radius;if(i>a)return null;const o=Math.sqrt(a-i),r=n-o,c=n+o;return c<0?null:r<0?this.at(c,t):this.at(r,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,a,o,r,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,p=this.origin;return h>=0?(n=(e.min.x-p.x)*h,i=(e.max.x-p.x)*h):(n=(e.max.x-p.x)*h,i=(e.min.x-p.x)*h),d>=0?(a=(e.min.y-p.y)*d,o=(e.max.y-p.y)*d):(a=(e.max.y-p.y)*d,o=(e.min.y-p.y)*d),n>o||a>i||((a>n||isNaN(n))&&(n=a),(o<i||isNaN(i))&&(i=o),u>=0?(r=(e.min.z-p.z)*u,c=(e.max.z-p.z)*u):(r=(e.max.z-p.z)*u,c=(e.min.z-p.z)*u),n>c||r>i)||((r>n||n!==n)&&(n=r),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,dn)!==null}intersectTriangle(e,t,n,i,a){gs.subVectors(t,e),sa.subVectors(n,e),ws.crossVectors(gs,sa);let o=this.direction.dot(ws),r;if(o>0){if(i)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Sn.subVectors(this.origin,e);const c=r*this.direction.dot(sa.crossVectors(Sn,sa));if(c<0)return null;const h=r*this.direction.dot(gs.cross(Sn));if(h<0||c+h>o)return null;const d=-r*Sn.dot(ws);return d<0?null:this.at(d/o,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class st{constructor(e,t,n,i,a,o,r,c,h,d,u,p,m,x,_,w){st.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,a,o,r,c,h,d,u,p,m,x,_,w)}set(e,t,n,i,a,o,r,c,h,d,u,p,m,x,_,w){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=a,g[5]=o,g[9]=r,g[13]=c,g[2]=h,g[6]=d,g[10]=u,g[14]=p,g[3]=m,g[7]=x,g[11]=_,g[15]=w,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new st().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/si.setFromMatrixColumn(e,0).length(),a=1/si.setFromMatrixColumn(e,1).length(),o=1/si.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,a=e.z,o=Math.cos(n),r=Math.sin(n),c=Math.cos(i),h=Math.sin(i),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const p=o*d,m=o*u,x=r*d,_=r*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=m+x*h,t[5]=p-_*h,t[9]=-r*c,t[2]=_-p*h,t[6]=x+m*h,t[10]=o*c}else if(e.order==="YXZ"){const p=c*d,m=c*u,x=h*d,_=h*u;t[0]=p+_*r,t[4]=x*r-m,t[8]=o*h,t[1]=o*u,t[5]=o*d,t[9]=-r,t[2]=m*r-x,t[6]=_+p*r,t[10]=o*c}else if(e.order==="ZXY"){const p=c*d,m=c*u,x=h*d,_=h*u;t[0]=p-_*r,t[4]=-o*u,t[8]=x+m*r,t[1]=m+x*r,t[5]=o*d,t[9]=_-p*r,t[2]=-o*h,t[6]=r,t[10]=o*c}else if(e.order==="ZYX"){const p=o*d,m=o*u,x=r*d,_=r*u;t[0]=c*d,t[4]=x*h-m,t[8]=p*h+_,t[1]=c*u,t[5]=_*h+p,t[9]=m*h-x,t[2]=-h,t[6]=r*c,t[10]=o*c}else if(e.order==="YZX"){const p=o*c,m=o*h,x=r*c,_=r*h;t[0]=c*d,t[4]=_-p*u,t[8]=x*u+m,t[1]=u,t[5]=o*d,t[9]=-r*d,t[2]=-h*d,t[6]=m*u+x,t[10]=p-_*u}else if(e.order==="XZY"){const p=o*c,m=o*h,x=r*c,_=r*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=p*u+_,t[5]=o*d,t[9]=m*u-x,t[2]=x*u-m,t[6]=r*d,t[10]=_*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(oh,e,rh)}lookAt(e,t,n){const i=this.elements;return Ht.subVectors(e,t),Ht.lengthSq()===0&&(Ht.z=1),Ht.normalize(),bn.crossVectors(n,Ht),bn.lengthSq()===0&&(Math.abs(n.z)===1?Ht.x+=1e-4:Ht.z+=1e-4,Ht.normalize(),bn.crossVectors(n,Ht)),bn.normalize(),oa.crossVectors(Ht,bn),i[0]=bn.x,i[4]=oa.x,i[8]=Ht.x,i[1]=bn.y,i[5]=oa.y,i[9]=Ht.y,i[2]=bn.z,i[6]=oa.z,i[10]=Ht.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,a=this.elements,o=n[0],r=n[4],c=n[8],h=n[12],d=n[1],u=n[5],p=n[9],m=n[13],x=n[2],_=n[6],w=n[10],g=n[14],S=n[3],v=n[7],E=n[11],I=n[15],C=i[0],P=i[4],k=i[8],b=i[12],M=i[1],U=i[5],O=i[9],L=i[13],H=i[2],q=i[6],ee=i[10],ne=i[14],Y=i[3],oe=i[7],se=i[11],ve=i[15];return a[0]=o*C+r*M+c*H+h*Y,a[4]=o*P+r*U+c*q+h*oe,a[8]=o*k+r*O+c*ee+h*se,a[12]=o*b+r*L+c*ne+h*ve,a[1]=d*C+u*M+p*H+m*Y,a[5]=d*P+u*U+p*q+m*oe,a[9]=d*k+u*O+p*ee+m*se,a[13]=d*b+u*L+p*ne+m*ve,a[2]=x*C+_*M+w*H+g*Y,a[6]=x*P+_*U+w*q+g*oe,a[10]=x*k+_*O+w*ee+g*se,a[14]=x*b+_*L+w*ne+g*ve,a[3]=S*C+v*M+E*H+I*Y,a[7]=S*P+v*U+E*q+I*oe,a[11]=S*k+v*O+E*ee+I*se,a[15]=S*b+v*L+E*ne+I*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],a=e[12],o=e[1],r=e[5],c=e[9],h=e[13],d=e[2],u=e[6],p=e[10],m=e[14],x=e[3],_=e[7],w=e[11],g=e[15];return x*(+a*c*u-i*h*u-a*r*p+n*h*p+i*r*m-n*c*m)+_*(+t*c*m-t*h*p+a*o*p-i*o*m+i*h*d-a*c*d)+w*(+t*h*u-t*r*m-a*o*u+n*o*m+a*r*d-n*h*d)+g*(-i*r*d-t*c*u+t*r*p+i*o*u-n*o*p+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],a=e[3],o=e[4],r=e[5],c=e[6],h=e[7],d=e[8],u=e[9],p=e[10],m=e[11],x=e[12],_=e[13],w=e[14],g=e[15],S=u*w*h-_*p*h+_*c*m-r*w*m-u*c*g+r*p*g,v=x*p*h-d*w*h-x*c*m+o*w*m+d*c*g-o*p*g,E=d*_*h-x*u*h+x*r*m-o*_*m-d*r*g+o*u*g,I=x*u*c-d*_*c-x*r*p+o*_*p+d*r*w-o*u*w,C=t*S+n*v+i*E+a*I;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/C;return e[0]=S*P,e[1]=(_*p*a-u*w*a-_*i*m+n*w*m+u*i*g-n*p*g)*P,e[2]=(r*w*a-_*c*a+_*i*h-n*w*h-r*i*g+n*c*g)*P,e[3]=(u*c*a-r*p*a-u*i*h+n*p*h+r*i*m-n*c*m)*P,e[4]=v*P,e[5]=(d*w*a-x*p*a+x*i*m-t*w*m-d*i*g+t*p*g)*P,e[6]=(x*c*a-o*w*a-x*i*h+t*w*h+o*i*g-t*c*g)*P,e[7]=(o*p*a-d*c*a+d*i*h-t*p*h-o*i*m+t*c*m)*P,e[8]=E*P,e[9]=(x*u*a-d*_*a-x*n*m+t*_*m+d*n*g-t*u*g)*P,e[10]=(o*_*a-x*r*a+x*n*h-t*_*h-o*n*g+t*r*g)*P,e[11]=(d*r*a-o*u*a-d*n*h+t*u*h+o*n*m-t*r*m)*P,e[12]=I*P,e[13]=(d*_*i-x*u*i+x*n*p-t*_*p-d*n*w+t*u*w)*P,e[14]=(x*r*i-o*_*i-x*n*c+t*_*c+o*n*w-t*r*w)*P,e[15]=(o*u*i-d*r*i+d*n*c-t*u*c-o*n*p+t*r*p)*P,this}scale(e){const t=this.elements,n=e.x,i=e.y,a=e.z;return t[0]*=n,t[4]*=i,t[8]*=a,t[1]*=n,t[5]*=i,t[9]*=a,t[2]*=n,t[6]*=i,t[10]*=a,t[3]*=n,t[7]*=i,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),a=1-n,o=e.x,r=e.y,c=e.z,h=a*o,d=a*r;return this.set(h*o+n,h*r-i*c,h*c+i*r,0,h*r+i*c,d*r+n,d*c-i*o,0,h*c-i*r,d*c+i*o,a*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,a,o){return this.set(1,n,a,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,a=t._x,o=t._y,r=t._z,c=t._w,h=a+a,d=o+o,u=r+r,p=a*h,m=a*d,x=a*u,_=o*d,w=o*u,g=r*u,S=c*h,v=c*d,E=c*u,I=n.x,C=n.y,P=n.z;return i[0]=(1-(_+g))*I,i[1]=(m+E)*I,i[2]=(x-v)*I,i[3]=0,i[4]=(m-E)*C,i[5]=(1-(p+g))*C,i[6]=(w+S)*C,i[7]=0,i[8]=(x+v)*P,i[9]=(w-S)*P,i[10]=(1-(p+_))*P,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let a=si.set(i[0],i[1],i[2]).length();const o=si.set(i[4],i[5],i[6]).length(),r=si.set(i[8],i[9],i[10]).length();this.determinant()<0&&(a=-a),e.x=i[12],e.y=i[13],e.z=i[14],$t.copy(this);const h=1/a,d=1/o,u=1/r;return $t.elements[0]*=h,$t.elements[1]*=h,$t.elements[2]*=h,$t.elements[4]*=d,$t.elements[5]*=d,$t.elements[6]*=d,$t.elements[8]*=u,$t.elements[9]*=u,$t.elements[10]*=u,t.setFromRotationMatrix($t),n.x=a,n.y=o,n.z=r,this}makePerspective(e,t,n,i,a,o,r=xn){const c=this.elements,h=2*a/(t-e),d=2*a/(n-i),u=(t+e)/(t-e),p=(n+i)/(n-i);let m,x;if(r===xn)m=-(o+a)/(o-a),x=-2*o*a/(o-a);else if(r===Ba)m=-o/(o-a),x=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,a,o,r=xn){const c=this.elements,h=1/(t-e),d=1/(n-i),u=1/(o-a),p=(t+e)*h,m=(n+i)*d;let x,_;if(r===xn)x=(o+a)*u,_=-2*u;else if(r===Ba)x=a*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=_,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const si=new N,$t=new st,oh=new N(0,0,0),rh=new N(1,1,1),bn=new N,oa=new N,Ht=new N,Qo=new st,er=new ji;class Wt{constructor(e=0,t=0,n=0,i=Wt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,a=i[0],o=i[4],r=i[8],c=i[1],h=i[5],d=i[9],u=i[2],p=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(Ot(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ot(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ot(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ot(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(Ot(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(r,m));break;case"XZY":this._z=Math.asin(-Ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Qo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return er.setFromEuler(this),this.setFromQuaternion(er,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Wt.DEFAULT_ORDER="XYZ";class eo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ch=0;const tr=new N,oi=new ji,un=new st,ra=new N,Oi=new N,lh=new N,hh=new ji,nr=new N(1,0,0),ir=new N(0,1,0),ar=new N(0,0,1),sr={type:"added"},dh={type:"removed"},ri={type:"childadded",child:null},xs={type:"childremoved",child:null};class yt extends Ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ch++}),this.uuid=Dn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=yt.DEFAULT_UP.clone();const e=new N,t=new Wt,n=new ji,i=new N(1,1,1);function a(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new st},normalMatrix:{value:new Ne}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new eo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return oi.setFromAxisAngle(e,t),this.quaternion.multiply(oi),this}rotateOnWorldAxis(e,t){return oi.setFromAxisAngle(e,t),this.quaternion.premultiply(oi),this}rotateX(e){return this.rotateOnAxis(nr,e)}rotateY(e){return this.rotateOnAxis(ir,e)}rotateZ(e){return this.rotateOnAxis(ar,e)}translateOnAxis(e,t){return tr.copy(e).applyQuaternion(this.quaternion),this.position.add(tr.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(nr,e)}translateY(e){return this.translateOnAxis(ir,e)}translateZ(e){return this.translateOnAxis(ar,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(un.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ra.copy(e):ra.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Oi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?un.lookAt(Oi,ra,this.up):un.lookAt(ra,Oi,this.up),this.quaternion.setFromRotationMatrix(un),i&&(un.extractRotation(i.matrixWorld),oi.setFromRotationMatrix(un),this.quaternion.premultiply(oi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(sr),ri.child=e,this.dispatchEvent(ri),ri.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dh),xs.child=e,this.dispatchEvent(xs),xs.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),un.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),un.multiply(e.parent.matrixWorld)),e.applyMatrix4(un),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(sr),ri.child=e,this.dispatchEvent(ri),ri.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let a=0,o=i.length;a<o;a++)i[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Oi,e,lh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Oi,hh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const a=t[n];(a.matrixWorldAutoUpdate===!0||e===!0)&&a.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let a=0,o=i.length;a<o;a++){const r=i[a];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function a(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=a(e.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];a(e.shapes,u)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,h=this.material.length;c<h;c++)r.push(a(e.materials,this.material[c]));i.material=r}else i.material=a(e.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];i.animations.push(a(e.animations,c))}}if(t){const r=o(e.geometries),c=o(e.materials),h=o(e.textures),d=o(e.images),u=o(e.shapes),p=o(e.skeletons),m=o(e.animations),x=o(e.nodes);r.length>0&&(n.geometries=r),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=i,n;function o(r){const c=[];for(const h in r){const d=r[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}yt.DEFAULT_UP=new N(0,1,0);yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Jt=new N,pn=new N,_s=new N,fn=new N,ci=new N,li=new N,or=new N,vs=new N,ys=new N,Ms=new N;class Zt{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Jt.subVectors(e,t),i.cross(Jt);const a=i.lengthSq();return a>0?i.multiplyScalar(1/Math.sqrt(a)):i.set(0,0,0)}static getBarycoord(e,t,n,i,a){Jt.subVectors(i,t),pn.subVectors(n,t),_s.subVectors(e,t);const o=Jt.dot(Jt),r=Jt.dot(pn),c=Jt.dot(_s),h=pn.dot(pn),d=pn.dot(_s),u=o*h-r*r;if(u===0)return a.set(0,0,0),null;const p=1/u,m=(h*c-r*d)*p,x=(o*d-r*c)*p;return a.set(1-m-x,x,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,fn)===null?!1:fn.x>=0&&fn.y>=0&&fn.x+fn.y<=1}static getInterpolation(e,t,n,i,a,o,r,c){return this.getBarycoord(e,t,n,i,fn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,fn.x),c.addScaledVector(o,fn.y),c.addScaledVector(r,fn.z),c)}static isFrontFacing(e,t,n,i){return Jt.subVectors(n,t),pn.subVectors(e,t),Jt.cross(pn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jt.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),Jt.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Zt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Zt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,a){return Zt.getInterpolation(e,this.a,this.b,this.c,t,n,i,a)}containsPoint(e){return Zt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Zt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,a=this.c;let o,r;ci.subVectors(i,n),li.subVectors(a,n),vs.subVectors(e,n);const c=ci.dot(vs),h=li.dot(vs);if(c<=0&&h<=0)return t.copy(n);ys.subVectors(e,i);const d=ci.dot(ys),u=li.dot(ys);if(d>=0&&u<=d)return t.copy(i);const p=c*u-d*h;if(p<=0&&c>=0&&d<=0)return o=c/(c-d),t.copy(n).addScaledVector(ci,o);Ms.subVectors(e,a);const m=ci.dot(Ms),x=li.dot(Ms);if(x>=0&&m<=x)return t.copy(a);const _=m*h-c*x;if(_<=0&&h>=0&&x<=0)return r=h/(h-x),t.copy(n).addScaledVector(li,r);const w=d*x-m*u;if(w<=0&&u-d>=0&&m-x>=0)return or.subVectors(a,i),r=(u-d)/(u-d+(m-x)),t.copy(i).addScaledVector(or,r);const g=1/(w+_+p);return o=_*g,r=p*g,t.copy(n).addScaledVector(ci,o).addScaledVector(li,r)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const dc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},En={h:0,s:0,l:0},ca={h:0,s:0,l:0};function Ss(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ce{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=sn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=tt.workingColorSpace){if(e=$l(e,1),t=Ot(t,0,1),n=Ot(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,o=2*n-a;this.r=Ss(o,a,e+1/3),this.g=Ss(o,a,e),this.b=Ss(o,a,e-1/3)}return tt.toWorkingColorSpace(this,i),this}setStyle(e,t=sn){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const o=i[1],r=i[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=i[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=sn){const n=dc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=bi(e.r),this.g=bi(e.g),this.b=bi(e.b),this}copyLinearToSRGB(e){return this.r=hs(e.r),this.g=hs(e.g),this.b=hs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=sn){return tt.fromWorkingColorSpace(Rt.copy(this),e),Math.round(Ot(Rt.r*255,0,255))*65536+Math.round(Ot(Rt.g*255,0,255))*256+Math.round(Ot(Rt.b*255,0,255))}getHexString(e=sn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(Rt.copy(this),t);const n=Rt.r,i=Rt.g,a=Rt.b,o=Math.max(n,i,a),r=Math.min(n,i,a);let c,h;const d=(r+o)/2;if(r===o)c=0,h=0;else{const u=o-r;switch(h=d<=.5?u/(o+r):u/(2-o-r),o){case n:c=(i-a)/u+(i<a?6:0);break;case i:c=(a-n)/u+2;break;case a:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(Rt.copy(this),t),e.r=Rt.r,e.g=Rt.g,e.b=Rt.b,e}getStyle(e=sn){tt.fromWorkingColorSpace(Rt.copy(this),e);const t=Rt.r,n=Rt.g,i=Rt.b;return e!==sn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(En),this.setHSL(En.h+e,En.s+t,En.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(En),e.getHSL(ca);const n=cs(En.h,ca.h,t),i=cs(En.s,ca.s,t),a=cs(En.l,ca.l,t);return this.setHSL(n,i,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*i,this.g=a[1]*t+a[4]*n+a[7]*i,this.b=a[2]*t+a[5]*n+a[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rt=new Ce;Ce.NAMES=dc;let uh=0;class _n extends Ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:uh++}),this.uuid=Dn(),this.name="",this.type="Material",this.blending=Mi,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fs,this.blendDst=zs,this.blendEquation=Yn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ce(0,0,0),this.blendAlpha=0,this.depthFunc=La,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ei,this.stencilZFail=ei,this.stencilZPass=ei,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Mi&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fs&&(n.blendSrc=this.blendSrc),this.blendDst!==zs&&(n.blendDst=this.blendDst),this.blendEquation!==Yn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==La&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Yo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ei&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ei&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ei&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(a){const o=[];for(const r in a){const c=a[r];delete c.metadata,o.push(c)}return o}if(t){const a=i(e.textures),o=i(e.images);a.length>0&&(n.textures=a),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let a=0;a!==i;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class We extends _n{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=Xa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pt=new N,la=new Re;class nn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Xs,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Rn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return cc("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,a=this.itemSize;i<a;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)la.fromBufferAttribute(this,t),la.applyMatrix3(e),this.setXY(t,la.x,la.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix3(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=rn(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=rn(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=rn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=rn(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,a){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array),a=et(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xs&&(e.usage=this.usage),e}}class uc extends nn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class pc extends nn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ot extends nn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ph=0;const qt=new st,bs=new yt,hi=new N,Vt=new Ki,Fi=new Ki,xt=new N;class Ut extends Ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ph++}),this.uuid=Dn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(rc(e)?pc:uc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Ne().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return qt.makeRotationFromQuaternion(e),this.applyMatrix4(qt),this}rotateX(e){return qt.makeRotationX(e),this.applyMatrix4(qt),this}rotateY(e){return qt.makeRotationY(e),this.applyMatrix4(qt),this}rotateZ(e){return qt.makeRotationZ(e),this.applyMatrix4(qt),this}translate(e,t,n){return qt.makeTranslation(e,t,n),this.applyMatrix4(qt),this}scale(e,t,n){return qt.makeScale(e,t,n),this.applyMatrix4(qt),this}lookAt(e){return bs.lookAt(e),bs.updateMatrix(),this.applyMatrix4(bs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hi).negate(),this.translate(hi.x,hi.y,hi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const a=e[n];t.push(a.x,a.y,a.z||0)}return this.setAttribute("position",new ot(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ki);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const a=t[n];Vt.setFromBufferAttribute(a),this.morphTargetsRelative?(xt.addVectors(this.boundingBox.min,Vt.min),this.boundingBox.expandByPoint(xt),xt.addVectors(this.boundingBox.max,Vt.max),this.boundingBox.expandByPoint(xt)):(this.boundingBox.expandByPoint(Vt.min),this.boundingBox.expandByPoint(Vt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ka);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const n=this.boundingSphere.center;if(Vt.setFromBufferAttribute(e),t)for(let a=0,o=t.length;a<o;a++){const r=t[a];Fi.setFromBufferAttribute(r),this.morphTargetsRelative?(xt.addVectors(Vt.min,Fi.min),Vt.expandByPoint(xt),xt.addVectors(Vt.max,Fi.max),Vt.expandByPoint(xt)):(Vt.expandByPoint(Fi.min),Vt.expandByPoint(Fi.max))}Vt.getCenter(n);let i=0;for(let a=0,o=e.count;a<o;a++)xt.fromBufferAttribute(e,a),i=Math.max(i,n.distanceToSquared(xt));if(t)for(let a=0,o=t.length;a<o;a++){const r=t[a],c=this.morphTargetsRelative;for(let h=0,d=r.count;h<d;h++)xt.fromBufferAttribute(r,h),c&&(hi.fromBufferAttribute(e,h),xt.add(hi)),i=Math.max(i,n.distanceToSquared(xt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let k=0;k<n.count;k++)r[k]=new N,c[k]=new N;const h=new N,d=new N,u=new N,p=new Re,m=new Re,x=new Re,_=new N,w=new N;function g(k,b,M){h.fromBufferAttribute(n,k),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),p.fromBufferAttribute(a,k),m.fromBufferAttribute(a,b),x.fromBufferAttribute(a,M),d.sub(h),u.sub(h),m.sub(p),x.sub(p);const U=1/(m.x*x.y-x.x*m.y);isFinite(U)&&(_.copy(d).multiplyScalar(x.y).addScaledVector(u,-m.y).multiplyScalar(U),w.copy(u).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(U),r[k].add(_),r[b].add(_),r[M].add(_),c[k].add(w),c[b].add(w),c[M].add(w))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let k=0,b=S.length;k<b;++k){const M=S[k],U=M.start,O=M.count;for(let L=U,H=U+O;L<H;L+=3)g(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const v=new N,E=new N,I=new N,C=new N;function P(k){I.fromBufferAttribute(i,k),C.copy(I);const b=r[k];v.copy(b),v.sub(I.multiplyScalar(I.dot(b))).normalize(),E.crossVectors(C,b);const U=E.dot(c[k])<0?-1:1;o.setXYZW(k,v.x,v.y,v.z,U)}for(let k=0,b=S.length;k<b;++k){const M=S[k],U=M.start,O=M.count;for(let L=U,H=U+O;L<H;L+=3)P(e.getX(L+0)),P(e.getX(L+1)),P(e.getX(L+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new nn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const i=new N,a=new N,o=new N,r=new N,c=new N,h=new N,d=new N,u=new N;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),_=e.getX(p+1),w=e.getX(p+2);i.fromBufferAttribute(t,x),a.fromBufferAttribute(t,_),o.fromBufferAttribute(t,w),d.subVectors(o,a),u.subVectors(i,a),d.cross(u),r.fromBufferAttribute(n,x),c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,w),r.add(d),c.add(d),h.add(d),n.setXYZ(x,r.x,r.y,r.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(w,h.x,h.y,h.z)}else for(let p=0,m=t.count;p<m;p+=3)i.fromBufferAttribute(t,p+0),a.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),d.subVectors(o,a),u.subVectors(i,a),d.cross(u),n.setXYZ(p+0,d.x,d.y,d.z),n.setXYZ(p+1,d.x,d.y,d.z),n.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)xt.fromBufferAttribute(e,t),xt.normalize(),e.setXYZ(t,xt.x,xt.y,xt.z)}toNonIndexed(){function e(r,c){const h=r.array,d=r.itemSize,u=r.normalized,p=new h.constructor(c.length*d);let m=0,x=0;for(let _=0,w=c.length;_<w;_++){r.isInterleavedBufferAttribute?m=c[_]*r.data.stride+r.offset:m=c[_]*d;for(let g=0;g<d;g++)p[x++]=h[m++]}return new nn(p,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ut,n=this.index.array,i=this.attributes;for(const r in i){const c=i[r],h=e(c,n);t.setAttribute(r,h)}const a=this.morphAttributes;for(const r in a){const c=[],h=a[r];for(let d=0,u=h.length;d<u;d++){const p=h[d],m=e(p,n);c.push(m)}t.morphAttributes[r]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const h=o[r];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const h=n[c];e.data.attributes[c]=h.toJSON(e.data)}const i={};let a=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,p=h.length;u<p;u++){const m=h[u];d.push(m.toJSON(e.data))}d.length>0&&(i[c]=d,a=!0)}a&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(e.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const h in i){const d=i[h];this.setAttribute(h,d.clone(t))}const a=e.morphAttributes;for(const h in a){const d=[],u=a[h];for(let p=0,m=u.length;p<m;p++)d.push(u[p].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let h=0,d=o.length;h<d;h++){const u=o[h];this.addGroup(u.start,u.count,u.materialIndex)}const r=e.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const rr=new st,Gn=new Qs,ha=new Ka,cr=new N,di=new N,ui=new N,pi=new N,Es=new N,da=new N,ua=new Re,pa=new Re,fa=new Re,lr=new N,hr=new N,dr=new N,ma=new N,ga=new N;class l extends yt{constructor(e=new Ut,t=new We){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=i.length;a<o;a++){const r=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,a=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const r=this.morphTargetInfluences;if(a&&r){da.set(0,0,0);for(let c=0,h=a.length;c<h;c++){const d=r[c],u=a[c];d!==0&&(Es.fromBufferAttribute(u,e),o?da.addScaledVector(Es,d):da.addScaledVector(Es.sub(t),d))}t.add(da)}return t}raycast(e,t){const n=this.geometry,i=this.material,a=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ha.copy(n.boundingSphere),ha.applyMatrix4(a),Gn.copy(e.ray).recast(e.near),!(ha.containsPoint(Gn.origin)===!1&&(Gn.intersectSphere(ha,cr)===null||Gn.origin.distanceToSquared(cr)>(e.far-e.near)**2))&&(rr.copy(a).invert(),Gn.copy(e.ray).applyMatrix4(rr),!(n.boundingBox!==null&&Gn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Gn)))}_computeIntersections(e,t,n){let i;const a=this.geometry,o=this.material,r=a.index,c=a.attributes.position,h=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,p=a.groups,m=a.drawRange;if(r!==null)if(Array.isArray(o))for(let x=0,_=p.length;x<_;x++){const w=p[x],g=o[w.materialIndex],S=Math.max(w.start,m.start),v=Math.min(r.count,Math.min(w.start+w.count,m.start+m.count));for(let E=S,I=v;E<I;E+=3){const C=r.getX(E),P=r.getX(E+1),k=r.getX(E+2);i=wa(this,g,e,n,h,d,u,C,P,k),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=w.materialIndex,t.push(i))}}else{const x=Math.max(0,m.start),_=Math.min(r.count,m.start+m.count);for(let w=x,g=_;w<g;w+=3){const S=r.getX(w),v=r.getX(w+1),E=r.getX(w+2);i=wa(this,o,e,n,h,d,u,S,v,E),i&&(i.faceIndex=Math.floor(w/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,_=p.length;x<_;x++){const w=p[x],g=o[w.materialIndex],S=Math.max(w.start,m.start),v=Math.min(c.count,Math.min(w.start+w.count,m.start+m.count));for(let E=S,I=v;E<I;E+=3){const C=E,P=E+1,k=E+2;i=wa(this,g,e,n,h,d,u,C,P,k),i&&(i.faceIndex=Math.floor(E/3),i.face.materialIndex=w.materialIndex,t.push(i))}}else{const x=Math.max(0,m.start),_=Math.min(c.count,m.start+m.count);for(let w=x,g=_;w<g;w+=3){const S=w,v=w+1,E=w+2;i=wa(this,o,e,n,h,d,u,S,v,E),i&&(i.faceIndex=Math.floor(w/3),t.push(i))}}}}function fh(s,e,t,n,i,a,o,r){let c;if(e.side===zt?c=n.intersectTriangle(o,a,i,!0,r):c=n.intersectTriangle(i,a,o,e.side===kn,r),c===null)return null;ga.copy(r),ga.applyMatrix4(s.matrixWorld);const h=t.ray.origin.distanceTo(ga);return h<t.near||h>t.far?null:{distance:h,point:ga.clone(),object:s}}function wa(s,e,t,n,i,a,o,r,c,h){s.getVertexPosition(r,di),s.getVertexPosition(c,ui),s.getVertexPosition(h,pi);const d=fh(s,e,t,n,di,ui,pi,ma);if(d){i&&(ua.fromBufferAttribute(i,r),pa.fromBufferAttribute(i,c),fa.fromBufferAttribute(i,h),d.uv=Zt.getInterpolation(ma,di,ui,pi,ua,pa,fa,new Re)),a&&(ua.fromBufferAttribute(a,r),pa.fromBufferAttribute(a,c),fa.fromBufferAttribute(a,h),d.uv1=Zt.getInterpolation(ma,di,ui,pi,ua,pa,fa,new Re)),o&&(lr.fromBufferAttribute(o,r),hr.fromBufferAttribute(o,c),dr.fromBufferAttribute(o,h),d.normal=Zt.getInterpolation(ma,di,ui,pi,lr,hr,dr,new N),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a:r,b:c,c:h,normal:new N,materialIndex:0};Zt.getNormal(di,ui,pi,u.normal),d.face=u}return d}class Z extends Ut{constructor(e=1,t=1,n=1,i=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:a,depthSegments:o};const r=this;i=Math.floor(i),a=Math.floor(a),o=Math.floor(o);const c=[],h=[],d=[],u=[];let p=0,m=0;x("z","y","x",-1,-1,n,t,e,o,a,0),x("z","y","x",1,-1,n,t,-e,o,a,1),x("x","z","y",1,1,e,n,t,i,o,2),x("x","z","y",1,-1,e,n,-t,i,o,3),x("x","y","z",1,-1,e,t,n,i,a,4),x("x","y","z",-1,-1,e,t,-n,i,a,5),this.setIndex(c),this.setAttribute("position",new ot(h,3)),this.setAttribute("normal",new ot(d,3)),this.setAttribute("uv",new ot(u,2));function x(_,w,g,S,v,E,I,C,P,k,b){const M=E/P,U=I/k,O=E/2,L=I/2,H=C/2,q=P+1,ee=k+1;let ne=0,Y=0;const oe=new N;for(let se=0;se<ee;se++){const ve=se*U-L;for(let Ve=0;Ve<q;Ve++){const $e=Ve*M-O;oe[_]=$e*S,oe[w]=ve*v,oe[g]=H,h.push(oe.x,oe.y,oe.z),oe[_]=0,oe[w]=0,oe[g]=C>0?1:-1,d.push(oe.x,oe.y,oe.z),u.push(Ve/P),u.push(1-se/k),ne+=1}}for(let se=0;se<k;se++)for(let ve=0;ve<P;ve++){const Ve=p+ve+q*se,$e=p+ve+q*(se+1),K=p+(ve+1)+q*(se+1),re=p+(ve+1)+q*se;c.push(Ve,$e,re),c.push($e,K,re),Y+=6}r.addGroup(m,Y,b),m+=Y,p+=ne}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Z(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Pi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function It(s){const e={};for(let t=0;t<s.length;t++){const n=Pi(s[t]);for(const i in n)e[i]=n[i]}return e}function mh(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function fc(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const gh={clone:Pi,merge:It};var wh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Un extends _n{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wh,this.fragmentShader=xh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Pi(e.uniforms),this.uniformsGroups=mh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class mc extends yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=xn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Tn=new N,ur=new Re,pr=new Re;class Ft extends mc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=qs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ca*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return qs*2*Math.atan(Math.tan(Ca*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Tn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Tn.x,Tn.y).multiplyScalar(-e/Tn.z),Tn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Tn.x,Tn.y).multiplyScalar(-e/Tn.z)}getViewSize(e,t){return this.getViewBounds(e,ur,pr),t.subVectors(pr,ur)}setViewOffset(e,t,n,i,a,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ca*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,a=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,h=o.fullHeight;a+=o.offsetX*i/c,t-=o.offsetY*n/h,i*=o.width/c,n*=o.height/h}const r=this.filmOffset;r!==0&&(a+=e*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const fi=-90,mi=1;class _h extends yt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ft(fi,mi,e,t);i.layers=this.layers,this.add(i);const a=new Ft(fi,mi,e,t);a.layers=this.layers,this.add(a);const o=new Ft(fi,mi,e,t);o.layers=this.layers,this.add(o);const r=new Ft(fi,mi,e,t);r.layers=this.layers,this.add(r);const c=new Ft(fi,mi,e,t);c.layers=this.layers,this.add(c);const h=new Ft(fi,mi,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,a,o,r,c]=t;for(const h of t)this.remove(h);if(e===xn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ba)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,c,h,d]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,a),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,r),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,h),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,d),e.setRenderTarget(u,p,m),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class gc extends kt{constructor(e,t,n,i,a,o,r,c,h,d){e=e!==void 0?e:[],t=t!==void 0?t:Ai,super(e,t,n,i,a,o,r,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vh extends Qn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new gc(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:tn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Z(5,5,5),a=new Un({name:"CubemapFromEquirect",uniforms:Pi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:zt,blending:Pn});a.uniforms.tEquirect.value=t;const o=new l(i,a),r=t.minFilter;return t.minFilter===$n&&(t.minFilter=tn),new _h(1,10,this).update(e,o),t.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const a=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(a)}}const Ts=new N,yh=new N,Mh=new Ne;class Xn{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ts.subVectors(n,t).cross(yh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ts),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/i;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Mh.getNormalMatrix(e),i=this.coplanarPoint(Ts).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hn=new Ka,xa=new N;class to{constructor(e=new Xn,t=new Xn,n=new Xn,i=new Xn,a=new Xn,o=new Xn){this.planes=[e,t,n,i,a,o]}set(e,t,n,i,a,o){const r=this.planes;return r[0].copy(e),r[1].copy(t),r[2].copy(n),r[3].copy(i),r[4].copy(a),r[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=xn){const n=this.planes,i=e.elements,a=i[0],o=i[1],r=i[2],c=i[3],h=i[4],d=i[5],u=i[6],p=i[7],m=i[8],x=i[9],_=i[10],w=i[11],g=i[12],S=i[13],v=i[14],E=i[15];if(n[0].setComponents(c-a,p-h,w-m,E-g).normalize(),n[1].setComponents(c+a,p+h,w+m,E+g).normalize(),n[2].setComponents(c+o,p+d,w+x,E+S).normalize(),n[3].setComponents(c-o,p-d,w-x,E-S).normalize(),n[4].setComponents(c-r,p-u,w-_,E-v).normalize(),t===xn)n[5].setComponents(c+r,p+u,w+_,E+v).normalize();else if(t===Ba)n[5].setComponents(r,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hn)}intersectsSprite(e){return Hn.center.set(0,0,0),Hn.radius=.7071067811865476,Hn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(xa.x=i.normal.x>0?e.max.x:e.min.x,xa.y=i.normal.y>0?e.max.y:e.min.y,xa.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(xa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function wc(){let s=null,e=!1,t=null,n=null;function i(a,o){t(a,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){s=a}}}function Sh(s){const e=new WeakMap;function t(r,c){const h=r.array,d=r.usage,u=h.byteLength,p=s.createBuffer();s.bindBuffer(c,p),s.bufferData(c,h,d),r.onUploadCallback();let m;if(h instanceof Float32Array)m=s.FLOAT;else if(h instanceof Uint16Array)r.isFloat16BufferAttribute?m=s.HALF_FLOAT:m=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)m=s.SHORT;else if(h instanceof Uint32Array)m=s.UNSIGNED_INT;else if(h instanceof Int32Array)m=s.INT;else if(h instanceof Int8Array)m=s.BYTE;else if(h instanceof Uint8Array)m=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)m=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:r.version,size:u}}function n(r,c,h){const d=c.array,u=c._updateRange,p=c.updateRanges;if(s.bindBuffer(h,r),u.count===-1&&p.length===0&&s.bufferSubData(h,0,d),p.length!==0){for(let m=0,x=p.length;m<x;m++){const _=p[m];s.bufferSubData(h,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}u.count!==-1&&(s.bufferSubData(h,u.offset*d.BYTES_PER_ELEMENT,d,u.offset,u.count),u.count=-1),c.onUploadCallback()}function i(r){return r.isInterleavedBufferAttribute&&(r=r.data),e.get(r)}function a(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=e.get(r);c&&(s.deleteBuffer(c.buffer),e.delete(r))}function o(r,c){if(r.isGLBufferAttribute){const d=e.get(r);(!d||d.version<r.version)&&e.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}r.isInterleavedBufferAttribute&&(r=r.data);const h=e.get(r);if(h===void 0)e.set(r,t(r,c));else if(h.version<r.version){if(h.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,r,c),h.version=r.version}}return{get:i,remove:a,update:o}}class St extends Ut{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const a=e/2,o=t/2,r=Math.floor(n),c=Math.floor(i),h=r+1,d=c+1,u=e/r,p=t/c,m=[],x=[],_=[],w=[];for(let g=0;g<d;g++){const S=g*p-o;for(let v=0;v<h;v++){const E=v*u-a;x.push(E,-S,0),_.push(0,0,1),w.push(v/r),w.push(1-g/c)}}for(let g=0;g<c;g++)for(let S=0;S<r;S++){const v=S+h*g,E=S+h*(g+1),I=S+1+h*(g+1),C=S+1+h*g;m.push(v,E,C),m.push(E,I,C)}this.setIndex(m),this.setAttribute("position",new ot(x,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(w,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new St(e.width,e.height,e.widthSegments,e.heightSegments)}}var bh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Eh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Th=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ah=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ch=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ph=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ih=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Dh=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,kh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Nh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Uh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Bh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Oh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Fh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,zh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Wh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,qh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Yh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,jh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Kh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$h=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ed="gl_FragColor = linearToOutputTexel( gl_FragColor );",td=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,nd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,id=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ad=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,sd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,od=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,rd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ld=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ud=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,md=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,gd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,wd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_d=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,yd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Md=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Sd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,bd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ed=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Td=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ad=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Pd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Id=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Dd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ld=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ud=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Bd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Od=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Fd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		#endif
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,zd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Gd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Hd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Vd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,qd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Yd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Kd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$d=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Jd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Qd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,e0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,t0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,n0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,i0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,a0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,s0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,o0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,r0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,c0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,l0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,h0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,d0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,u0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,p0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,f0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,m0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,g0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,w0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,x0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,M0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const S0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,b0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,R0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,P0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,I0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,D0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,k0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,U0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,B0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,O0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,z0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,G0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,H0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,W0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,X0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,q0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Y0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Z0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,K0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,J0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Q0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eu=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tu=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ke={alphahash_fragment:bh,alphahash_pars_fragment:Eh,alphamap_fragment:Th,alphamap_pars_fragment:Ah,alphatest_fragment:Rh,alphatest_pars_fragment:Ch,aomap_fragment:Ph,aomap_pars_fragment:Ih,batching_pars_vertex:Dh,batching_vertex:Lh,begin_vertex:kh,beginnormal_vertex:Nh,bsdfs:Uh,iridescence_fragment:Bh,bumpmap_pars_fragment:Oh,clipping_planes_fragment:Fh,clipping_planes_pars_fragment:zh,clipping_planes_pars_vertex:Gh,clipping_planes_vertex:Hh,color_fragment:Vh,color_pars_fragment:Wh,color_pars_vertex:Xh,color_vertex:qh,common:Yh,cube_uv_reflection_fragment:Zh,defaultnormal_vertex:jh,displacementmap_pars_vertex:Kh,displacementmap_vertex:$h,emissivemap_fragment:Jh,emissivemap_pars_fragment:Qh,colorspace_fragment:ed,colorspace_pars_fragment:td,envmap_fragment:nd,envmap_common_pars_fragment:id,envmap_pars_fragment:ad,envmap_pars_vertex:sd,envmap_physical_pars_fragment:gd,envmap_vertex:od,fog_vertex:rd,fog_pars_vertex:cd,fog_fragment:ld,fog_pars_fragment:hd,gradientmap_pars_fragment:dd,lightmap_pars_fragment:ud,lights_lambert_fragment:pd,lights_lambert_pars_fragment:fd,lights_pars_begin:md,lights_toon_fragment:wd,lights_toon_pars_fragment:xd,lights_phong_fragment:_d,lights_phong_pars_fragment:vd,lights_physical_fragment:yd,lights_physical_pars_fragment:Md,lights_fragment_begin:Sd,lights_fragment_maps:bd,lights_fragment_end:Ed,logdepthbuf_fragment:Td,logdepthbuf_pars_fragment:Ad,logdepthbuf_pars_vertex:Rd,logdepthbuf_vertex:Cd,map_fragment:Pd,map_pars_fragment:Id,map_particle_fragment:Dd,map_particle_pars_fragment:Ld,metalnessmap_fragment:kd,metalnessmap_pars_fragment:Nd,morphinstance_vertex:Ud,morphcolor_vertex:Bd,morphnormal_vertex:Od,morphtarget_pars_vertex:Fd,morphtarget_vertex:zd,normal_fragment_begin:Gd,normal_fragment_maps:Hd,normal_pars_fragment:Vd,normal_pars_vertex:Wd,normal_vertex:Xd,normalmap_pars_fragment:qd,clearcoat_normal_fragment_begin:Yd,clearcoat_normal_fragment_maps:Zd,clearcoat_pars_fragment:jd,iridescence_pars_fragment:Kd,opaque_fragment:$d,packing:Jd,premultiplied_alpha_fragment:Qd,project_vertex:e0,dithering_fragment:t0,dithering_pars_fragment:n0,roughnessmap_fragment:i0,roughnessmap_pars_fragment:a0,shadowmap_pars_fragment:s0,shadowmap_pars_vertex:o0,shadowmap_vertex:r0,shadowmask_pars_fragment:c0,skinbase_vertex:l0,skinning_pars_vertex:h0,skinning_vertex:d0,skinnormal_vertex:u0,specularmap_fragment:p0,specularmap_pars_fragment:f0,tonemapping_fragment:m0,tonemapping_pars_fragment:g0,transmission_fragment:w0,transmission_pars_fragment:x0,uv_pars_fragment:_0,uv_pars_vertex:v0,uv_vertex:y0,worldpos_vertex:M0,background_vert:S0,background_frag:b0,backgroundCube_vert:E0,backgroundCube_frag:T0,cube_vert:A0,cube_frag:R0,depth_vert:C0,depth_frag:P0,distanceRGBA_vert:I0,distanceRGBA_frag:D0,equirect_vert:L0,equirect_frag:k0,linedashed_vert:N0,linedashed_frag:U0,meshbasic_vert:B0,meshbasic_frag:O0,meshlambert_vert:F0,meshlambert_frag:z0,meshmatcap_vert:G0,meshmatcap_frag:H0,meshnormal_vert:V0,meshnormal_frag:W0,meshphong_vert:X0,meshphong_frag:q0,meshphysical_vert:Y0,meshphysical_frag:Z0,meshtoon_vert:j0,meshtoon_frag:K0,points_vert:$0,points_frag:J0,shadow_vert:Q0,shadow_frag:eu,sprite_vert:tu,sprite_frag:nu},de={common:{diffuse:{value:new Ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new Re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Ce(16777215)},opacity:{value:1},center:{value:new Re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},on={basic:{uniforms:It([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:It([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ce(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:It([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ce(0)},specular:{value:new Ce(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:It([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:It([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Ce(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:It([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:It([de.points,de.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:It([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:It([de.common,de.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:It([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:It([de.sprite,de.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:It([de.common,de.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:It([de.lights,de.fog,{color:{value:new Ce(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};on.physical={uniforms:It([on.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new Re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new Re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Ce(0)},specularColor:{value:new Ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new Re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const _a={r:0,b:0,g:0},Vn=new Wt,iu=new st;function au(s,e,t,n,i,a,o){const r=new Ce(0);let c=a===!0?0:1,h,d,u=null,p=0,m=null;function x(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?t:e).get(v)),v}function _(S){let v=!1;const E=x(S);E===null?g(r,c):E&&E.isColor&&(g(E,1),v=!0);const I=s.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||v)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil)}function w(S,v){const E=x(v);E&&(E.isCubeTexture||E.mapping===qa)?(d===void 0&&(d=new l(new Z(1,1,1),new Un({name:"BackgroundCubeMaterial",uniforms:Pi(on.backgroundCube.uniforms),vertexShader:on.backgroundCube.vertexShader,fragmentShader:on.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(I,C,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(d)),Vn.copy(v.backgroundRotation),Vn.x*=-1,Vn.y*=-1,Vn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Vn.y*=-1,Vn.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(iu.makeRotationFromEuler(Vn)),d.material.toneMapped=tt.getTransfer(E.colorSpace)!==it,(u!==E||p!==E.version||m!==s.toneMapping)&&(d.material.needsUpdate=!0,u=E,p=E.version,m=s.toneMapping),d.layers.enableAll(),S.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new l(new St(2,2),new Un({name:"BackgroundMaterial",uniforms:Pi(on.background.uniforms),vertexShader:on.background.vertexShader,fragmentShader:on.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=tt.getTransfer(E.colorSpace)!==it,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||p!==E.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,u=E,p=E.version,m=s.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null))}function g(S,v){S.getRGB(_a,fc(s)),n.buffers.color.setClear(_a.r,_a.g,_a.b,v,o)}return{getClearColor:function(){return r},setClearColor:function(S,v=1){r.set(S),c=v,g(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,g(r,c)},render:_,addToRenderList:w}}function su(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=p(null);let a=i,o=!1;function r(M,U,O,L,H){let q=!1;const ee=u(L,O,U);a!==ee&&(a=ee,h(a.object)),q=m(M,L,O,H),q&&x(M,L,O,H),H!==null&&e.update(H,s.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,E(M,U,O,L),H!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return s.createVertexArray()}function h(M){return s.bindVertexArray(M)}function d(M){return s.deleteVertexArray(M)}function u(M,U,O){const L=O.wireframe===!0;let H=n[M.id];H===void 0&&(H={},n[M.id]=H);let q=H[U.id];q===void 0&&(q={},H[U.id]=q);let ee=q[L];return ee===void 0&&(ee=p(c()),q[L]=ee),ee}function p(M){const U=[],O=[],L=[];for(let H=0;H<t;H++)U[H]=0,O[H]=0,L[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:O,attributeDivisors:L,object:M,attributes:{},index:null}}function m(M,U,O,L){const H=a.attributes,q=U.attributes;let ee=0;const ne=O.getAttributes();for(const Y in ne)if(ne[Y].location>=0){const se=H[Y];let ve=q[Y];if(ve===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(ve=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(ve=M.instanceColor)),se===void 0||se.attribute!==ve||ve&&se.data!==ve.data)return!0;ee++}return a.attributesNum!==ee||a.index!==L}function x(M,U,O,L){const H={},q=U.attributes;let ee=0;const ne=O.getAttributes();for(const Y in ne)if(ne[Y].location>=0){let se=q[Y];se===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(se=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(se=M.instanceColor));const ve={};ve.attribute=se,se&&se.data&&(ve.data=se.data),H[Y]=ve,ee++}a.attributes=H,a.attributesNum=ee,a.index=L}function _(){const M=a.newAttributes;for(let U=0,O=M.length;U<O;U++)M[U]=0}function w(M){g(M,0)}function g(M,U){const O=a.newAttributes,L=a.enabledAttributes,H=a.attributeDivisors;O[M]=1,L[M]===0&&(s.enableVertexAttribArray(M),L[M]=1),H[M]!==U&&(s.vertexAttribDivisor(M,U),H[M]=U)}function S(){const M=a.newAttributes,U=a.enabledAttributes;for(let O=0,L=U.length;O<L;O++)U[O]!==M[O]&&(s.disableVertexAttribArray(O),U[O]=0)}function v(M,U,O,L,H,q,ee){ee===!0?s.vertexAttribIPointer(M,U,O,H,q):s.vertexAttribPointer(M,U,O,L,H,q)}function E(M,U,O,L){_();const H=L.attributes,q=O.getAttributes(),ee=U.defaultAttributeValues;for(const ne in q){const Y=q[ne];if(Y.location>=0){let oe=H[ne];if(oe===void 0&&(ne==="instanceMatrix"&&M.instanceMatrix&&(oe=M.instanceMatrix),ne==="instanceColor"&&M.instanceColor&&(oe=M.instanceColor)),oe!==void 0){const se=oe.normalized,ve=oe.itemSize,Ve=e.get(oe);if(Ve===void 0)continue;const $e=Ve.buffer,K=Ve.type,re=Ve.bytesPerElement,xe=K===s.INT||K===s.UNSIGNED_INT||oe.gpuType===ec;if(oe.isInterleavedBufferAttribute){const he=oe.data,Fe=he.stride,ze=oe.offset;if(he.isInstancedInterleavedBuffer){for(let G=0;G<Y.locationSize;G++)g(Y.location+G,he.meshPerAttribute);M.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let G=0;G<Y.locationSize;G++)w(Y.location+G);s.bindBuffer(s.ARRAY_BUFFER,$e);for(let G=0;G<Y.locationSize;G++)v(Y.location+G,ve/Y.locationSize,K,se,Fe*re,(ze+ve/Y.locationSize*G)*re,xe)}else{if(oe.isInstancedBufferAttribute){for(let he=0;he<Y.locationSize;he++)g(Y.location+he,oe.meshPerAttribute);M.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let he=0;he<Y.locationSize;he++)w(Y.location+he);s.bindBuffer(s.ARRAY_BUFFER,$e);for(let he=0;he<Y.locationSize;he++)v(Y.location+he,ve/Y.locationSize,K,se,ve*re,ve/Y.locationSize*he*re,xe)}}else if(ee!==void 0){const se=ee[ne];if(se!==void 0)switch(se.length){case 2:s.vertexAttrib2fv(Y.location,se);break;case 3:s.vertexAttrib3fv(Y.location,se);break;case 4:s.vertexAttrib4fv(Y.location,se);break;default:s.vertexAttrib1fv(Y.location,se)}}}}S()}function I(){k();for(const M in n){const U=n[M];for(const O in U){const L=U[O];for(const H in L)d(L[H].object),delete L[H];delete U[O]}delete n[M]}}function C(M){if(n[M.id]===void 0)return;const U=n[M.id];for(const O in U){const L=U[O];for(const H in L)d(L[H].object),delete L[H];delete U[O]}delete n[M.id]}function P(M){for(const U in n){const O=n[U];if(O[M.id]===void 0)continue;const L=O[M.id];for(const H in L)d(L[H].object),delete L[H];delete O[M.id]}}function k(){b(),o=!0,a!==i&&(a=i,h(a.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:r,reset:k,resetDefaultState:b,dispose:I,releaseStatesOfGeometry:C,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:w,disableUnusedAttributes:S}}function ou(s,e,t){let n;function i(h){n=h}function a(h,d){s.drawArrays(n,h,d),t.update(d,n,1)}function o(h,d,u){u!==0&&(s.drawArraysInstanced(n,h,d,u),t.update(d,n,u))}function r(h,d,u){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<u;m++)this.render(h[m],d[m]);else{p.multiDrawArraysWEBGL(n,h,0,d,0,u);let m=0;for(let x=0;x<u;x++)m+=d[x];t.update(m,n,1)}}function c(h,d,u,p){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<h.length;x++)o(h[x],d[x],p[x]);else{m.multiDrawArraysInstancedWEBGL(n,h,0,d,0,p,0,u);let x=0;for(let _=0;_<u;_++)x+=d[_];for(let _=0;_<p.length;_++)t.update(x,n,p[_])}}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function ru(s,e,t,n){let i;function a(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(C){return!(C!==cn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(C){const P=C===Ya&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Nn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Rn&&!P)}function c(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const d=c(h);d!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",d,"instead."),h=d);const u=t.logarithmicDepthBuffer===!0,p=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),_=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),w=s.getParameter(s.MAX_VERTEX_ATTRIBS),g=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=m>0,I=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:h,logarithmicDepthBuffer:u,maxTextures:p,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:_,maxAttributes:w,maxVertexUniforms:g,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:E,maxSamples:I}}function cu(s){const e=this;let t=null,n=0,i=!1,a=!1;const o=new Xn,r=new Ne,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const m=u.length!==0||p||n!==0||i;return i=p,n=u.length,m},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,p){t=d(u,p,0)},this.setState=function(u,p,m){const x=u.clippingPlanes,_=u.clipIntersection,w=u.clipShadows,g=s.get(u);if(!i||x===null||x.length===0||a&&!w)a?d(null):h();else{const S=a?0:n,v=S*4;let E=g.clippingState||null;c.value=E,E=d(x,p,v,m);for(let I=0;I!==v;++I)E[I]=t[I];g.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,p,m,x){const _=u!==null?u.length:0;let w=null;if(_!==0){if(w=c.value,x!==!0||w===null){const g=m+_*4,S=p.matrixWorldInverse;r.getNormalMatrix(S),(w===null||w.length<g)&&(w=new Float32Array(g));for(let v=0,E=m;v!==_;++v,E+=4)o.copy(u[v]).applyMatrix4(S,r),o.normal.toArray(w,E),w[E+3]=o.constant}c.value=w,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,w}}function lu(s){let e=new WeakMap;function t(o,r){return r===Gs?o.mapping=Ai:r===Hs&&(o.mapping=Ri),o}function n(o){if(o&&o.isTexture){const r=o.mapping;if(r===Gs||r===Hs)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const h=new vh(c.height);return h.fromEquirectangularTexture(s,o),e.set(o,h),o.addEventListener("dispose",i),t(h.texture,o.mapping)}else return null}}return o}function i(o){const r=o.target;r.removeEventListener("dispose",i);const c=e.get(r);c!==void 0&&(e.delete(r),c.dispose())}function a(){e=new WeakMap}return{get:n,dispose:a}}class xc extends mc{constructor(e=-1,t=1,n=1,i=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let a=n-e,o=n+e,r=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,o=a+h*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const yi=4,fr=[.125,.215,.35,.446,.526,.582],Zn=20,As=new xc,mr=new Ce;let Rs=null,Cs=0,Ps=0,Is=!1;const qn=(1+Math.sqrt(5))/2,gi=1/qn,gr=[new N(-qn,gi,0),new N(qn,gi,0),new N(-gi,0,qn),new N(gi,0,qn),new N(0,qn,-gi),new N(0,qn,gi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class wr{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Rs=this._renderer.getRenderTarget(),Cs=this._renderer.getActiveCubeFace(),Ps=this._renderer.getActiveMipmapLevel(),Is=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,n,i,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vr(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_r(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Rs,Cs,Ps),this._renderer.xr.enabled=Is,e.scissorTest=!1,va(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ai||e.mapping===Ri?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Rs=this._renderer.getRenderTarget(),Cs=this._renderer.getActiveCubeFace(),Ps=this._renderer.getActiveMipmapLevel(),Is=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:tn,minFilter:tn,generateMipmaps:!1,type:Ya,format:cn,colorSpace:Bn,depthBuffer:!1},i=xr(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xr(e,t,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=hu(a)),this._blurMaterial=du(a,e,t)}return i}_compileMaterial(e){const t=new l(this._lodPlanes[0],e);this._renderer.compile(t,As)}_sceneToCubeUV(e,t,n,i){const r=new Ft(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(mr),d.toneMapping=In,d.autoClear=!1;const m=new We({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1}),x=new l(new Z,m);let _=!1;const w=e.background;w?w.isColor&&(m.color.copy(w),e.background=null,_=!0):(m.color.copy(mr),_=!0);for(let g=0;g<6;g++){const S=g%3;S===0?(r.up.set(0,c[g],0),r.lookAt(h[g],0,0)):S===1?(r.up.set(0,0,c[g]),r.lookAt(0,h[g],0)):(r.up.set(0,c[g],0),r.lookAt(0,0,h[g]));const v=this._cubeSize;va(i,S*v,g>2?v:0,v,v),d.setRenderTarget(i),_&&d.render(x,r),d.render(e,r)}x.geometry.dispose(),x.material.dispose(),d.toneMapping=p,d.autoClear=u,e.background=w}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ai||e.mapping===Ri;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=vr()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_r());const a=i?this._cubemapMaterial:this._equirectMaterial,o=new l(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=e;const c=this._cubeSize;va(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,As)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let a=1;a<i;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),r=gr[(i-a-1)%gr.length];this._blur(e,a-1,a,o,r)}t.autoClear=n}_blur(e,t,n,i,a){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",a),this._halfBlur(o,e,n,n,i,"longitudinal",a)}_halfBlur(e,t,n,i,a,o,r){const c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new l(this._lodPlanes[i],h),p=h.uniforms,m=this._sizeLods[n]-1,x=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Zn-1),_=a/x,w=isFinite(a)?1+Math.floor(d*_):Zn;w>Zn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${w} samples when the maximum is set to ${Zn}`);const g=[];let S=0;for(let P=0;P<Zn;++P){const k=P/_,b=Math.exp(-k*k/2);g.push(b),P===0?S+=b:P<w&&(S+=2*b)}for(let P=0;P<g.length;P++)g[P]=g[P]/S;p.envMap.value=e.texture,p.samples.value=w,p.weights.value=g,p.latitudinal.value=o==="latitudinal",r&&(p.poleAxis.value=r);const{_lodMax:v}=this;p.dTheta.value=x,p.mipInt.value=v-n;const E=this._sizeLods[i],I=3*E*(i>v-yi?i-v+yi:0),C=4*(this._cubeSize-E);va(t,I,C,3*E,2*E),c.setRenderTarget(t),c.render(u,As)}}function hu(s){const e=[],t=[],n=[];let i=s;const a=s-yi+1+fr.length;for(let o=0;o<a;o++){const r=Math.pow(2,i);t.push(r);let c=1/r;o>s-yi?c=fr[o-s+yi-1]:o===0&&(c=0),n.push(c);const h=1/(r-2),d=-h,u=1+h,p=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,x=6,_=3,w=2,g=1,S=new Float32Array(_*x*m),v=new Float32Array(w*x*m),E=new Float32Array(g*x*m);for(let C=0;C<m;C++){const P=C%3*2/3-1,k=C>2?0:-1,b=[P,k,0,P+2/3,k,0,P+2/3,k+1,0,P,k,0,P+2/3,k+1,0,P,k+1,0];S.set(b,_*x*C),v.set(p,w*x*C);const M=[C,C,C,C,C,C];E.set(M,g*x*C)}const I=new Ut;I.setAttribute("position",new nn(S,_)),I.setAttribute("uv",new nn(v,w)),I.setAttribute("faceIndex",new nn(E,g)),e.push(I),i>yi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function xr(s,e,t){const n=new Qn(s,e,t);return n.texture.mapping=qa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function va(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function du(s,e,t){const n=new Float32Array(Zn),i=new N(0,1,0);return new Un({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function _r(){return new Un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function vr(){return new Un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function no(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function uu(s){let e=new WeakMap,t=null;function n(r){if(r&&r.isTexture){const c=r.mapping,h=c===Gs||c===Hs,d=c===Ai||c===Ri;if(h||d){let u=e.get(r);const p=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==p)return t===null&&(t=new wr(s)),u=h?t.fromEquirectangular(r,u):t.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,e.set(r,u),u.texture;if(u!==void 0)return u.texture;{const m=r.image;return h&&m&&m.height>0||d&&m&&i(m)?(t===null&&(t=new wr(s)),u=h?t.fromEquirectangular(r):t.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,e.set(r,u),r.addEventListener("dispose",a),u.texture):null}}}return r}function i(r){let c=0;const h=6;for(let d=0;d<h;d++)r[d]!==void 0&&c++;return c===h}function a(r){const c=r.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function pu(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function fu(s,e,t,n){const i={},a=new WeakMap;function o(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);for(const x in p.morphAttributes){const _=p.morphAttributes[x];for(let w=0,g=_.length;w<g;w++)e.remove(_[w])}p.removeEventListener("dispose",o),delete i[p.id];const m=a.get(p);m&&(e.remove(m),a.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function r(u,p){return i[p.id]===!0||(p.addEventListener("dispose",o),i[p.id]=!0,t.memory.geometries++),p}function c(u){const p=u.attributes;for(const x in p)e.update(p[x],s.ARRAY_BUFFER);const m=u.morphAttributes;for(const x in m){const _=m[x];for(let w=0,g=_.length;w<g;w++)e.update(_[w],s.ARRAY_BUFFER)}}function h(u){const p=[],m=u.index,x=u.attributes.position;let _=0;if(m!==null){const S=m.array;_=m.version;for(let v=0,E=S.length;v<E;v+=3){const I=S[v+0],C=S[v+1],P=S[v+2];p.push(I,C,C,P,P,I)}}else if(x!==void 0){const S=x.array;_=x.version;for(let v=0,E=S.length/3-1;v<E;v+=3){const I=v+0,C=v+1,P=v+2;p.push(I,C,C,P,P,I)}}else return;const w=new(rc(p)?pc:uc)(p,1);w.version=_;const g=a.get(u);g&&e.remove(g),a.set(u,w)}function d(u){const p=a.get(u);if(p){const m=u.index;m!==null&&p.version<m.version&&h(u)}else h(u);return a.get(u)}return{get:r,update:c,getWireframeAttribute:d}}function mu(s,e,t){let n;function i(p){n=p}let a,o;function r(p){a=p.type,o=p.bytesPerElement}function c(p,m){s.drawElements(n,m,a,p*o),t.update(m,n,1)}function h(p,m,x){x!==0&&(s.drawElementsInstanced(n,m,a,p*o,x),t.update(m,n,x))}function d(p,m,x){if(x===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let w=0;w<x;w++)this.render(p[w]/o,m[w]);else{_.multiDrawElementsWEBGL(n,m,0,a,p,0,x);let w=0;for(let g=0;g<x;g++)w+=m[g];t.update(w,n,1)}}function u(p,m,x,_){if(x===0)return;const w=e.get("WEBGL_multi_draw");if(w===null)for(let g=0;g<p.length;g++)h(p[g]/o,m[g],_[g]);else{w.multiDrawElementsInstancedWEBGL(n,m,0,a,p,0,_,0,x);let g=0;for(let S=0;S<x;S++)g+=m[S];for(let S=0;S<_.length;S++)t.update(g,n,_[S])}}this.setMode=i,this.setIndex=r,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function gu(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,o,r){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=r*(a/3);break;case s.LINES:t.lines+=r*(a/2);break;case s.LINE_STRIP:t.lines+=r*(a-1);break;case s.LINE_LOOP:t.lines+=r*a;break;case s.POINTS:t.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function wu(s,e,t){const n=new WeakMap,i=new ct;function a(o,r,c){const h=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=d!==void 0?d.length:0;let p=n.get(r);if(p===void 0||p.count!==u){let M=function(){k.dispose(),n.delete(r),r.removeEventListener("dispose",M)};var m=M;p!==void 0&&p.texture.dispose();const x=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,w=r.morphAttributes.color!==void 0,g=r.morphAttributes.position||[],S=r.morphAttributes.normal||[],v=r.morphAttributes.color||[];let E=0;x===!0&&(E=1),_===!0&&(E=2),w===!0&&(E=3);let I=r.attributes.position.count*E,C=1;I>e.maxTextureSize&&(C=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const P=new Float32Array(I*C*4*u),k=new hc(P,I,C,u);k.type=Rn,k.needsUpdate=!0;const b=E*4;for(let U=0;U<u;U++){const O=g[U],L=S[U],H=v[U],q=I*C*4*U;for(let ee=0;ee<O.count;ee++){const ne=ee*b;x===!0&&(i.fromBufferAttribute(O,ee),P[q+ne+0]=i.x,P[q+ne+1]=i.y,P[q+ne+2]=i.z,P[q+ne+3]=0),_===!0&&(i.fromBufferAttribute(L,ee),P[q+ne+4]=i.x,P[q+ne+5]=i.y,P[q+ne+6]=i.z,P[q+ne+7]=0),w===!0&&(i.fromBufferAttribute(H,ee),P[q+ne+8]=i.x,P[q+ne+9]=i.y,P[q+ne+10]=i.z,P[q+ne+11]=H.itemSize===4?i.w:1)}}p={count:u,texture:k,size:new Re(I,C)},n.set(r,p),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let x=0;for(let w=0;w<h.length;w++)x+=h[w];const _=r.morphTargetsRelative?1:1-x;c.getUniforms().setValue(s,"morphTargetBaseInfluence",_),c.getUniforms().setValue(s,"morphTargetInfluences",h)}c.getUniforms().setValue(s,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",p.size)}return{update:a}}function xu(s,e,t,n){let i=new WeakMap;function a(c){const h=n.render.frame,d=c.geometry,u=e.get(c,d);if(i.get(u)!==h&&(e.update(u),i.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),i.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;i.get(p)!==h&&(p.update(),i.set(p,h))}return u}function o(){i=new WeakMap}function r(c){const h=c.target;h.removeEventListener("dispose",r),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}class _c extends kt{constructor(e,t,n,i,a,o,r,c,h,d){if(d=d!==void 0?d:Si,d!==Si&&d!==Yi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===Si&&(n=Ci),n===void 0&&d===Yi&&(n=Zi),super(null,i,a,o,r,c,d,n,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=r!==void 0?r:jt,this.minFilter=c!==void 0?c:jt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const vc=new kt,yc=new _c(1,1);yc.compareFunction=oc;const Mc=new hc,Sc=new ah,bc=new gc,yr=[],Mr=[],Sr=new Float32Array(16),br=new Float32Array(9),Er=new Float32Array(4);function Di(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let a=yr[i];if(a===void 0&&(a=new Float32Array(i),yr[i]=a),e!==0){n.toArray(a,0);for(let o=1,r=0;o!==e;++o)r+=t,s[o].toArray(a,r)}return a}function gt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function wt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function $a(s,e){let t=Mr[e];t===void 0&&(t=new Int32Array(e),Mr[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function _u(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function vu(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;s.uniform2fv(this.addr,e),wt(t,e)}}function yu(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(gt(t,e))return;s.uniform3fv(this.addr,e),wt(t,e)}}function Mu(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;s.uniform4fv(this.addr,e),wt(t,e)}}function Su(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(gt(t,n))return;Er.set(n),s.uniformMatrix2fv(this.addr,!1,Er),wt(t,n)}}function bu(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(gt(t,n))return;br.set(n),s.uniformMatrix3fv(this.addr,!1,br),wt(t,n)}}function Eu(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(gt(t,n))return;Sr.set(n),s.uniformMatrix4fv(this.addr,!1,Sr),wt(t,n)}}function Tu(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Au(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;s.uniform2iv(this.addr,e),wt(t,e)}}function Ru(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;s.uniform3iv(this.addr,e),wt(t,e)}}function Cu(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;s.uniform4iv(this.addr,e),wt(t,e)}}function Pu(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Iu(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;s.uniform2uiv(this.addr,e),wt(t,e)}}function Du(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;s.uniform3uiv(this.addr,e),wt(t,e)}}function Lu(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;s.uniform4uiv(this.addr,e),wt(t,e)}}function ku(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const a=this.type===s.SAMPLER_2D_SHADOW?yc:vc;t.setTexture2D(e||a,i)}function Nu(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Sc,i)}function Uu(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||bc,i)}function Bu(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Mc,i)}function Ou(s){switch(s){case 5126:return _u;case 35664:return vu;case 35665:return yu;case 35666:return Mu;case 35674:return Su;case 35675:return bu;case 35676:return Eu;case 5124:case 35670:return Tu;case 35667:case 35671:return Au;case 35668:case 35672:return Ru;case 35669:case 35673:return Cu;case 5125:return Pu;case 36294:return Iu;case 36295:return Du;case 36296:return Lu;case 35678:case 36198:case 36298:case 36306:case 35682:return ku;case 35679:case 36299:case 36307:return Nu;case 35680:case 36300:case 36308:case 36293:return Uu;case 36289:case 36303:case 36311:case 36292:return Bu}}function Fu(s,e){s.uniform1fv(this.addr,e)}function zu(s,e){const t=Di(e,this.size,2);s.uniform2fv(this.addr,t)}function Gu(s,e){const t=Di(e,this.size,3);s.uniform3fv(this.addr,t)}function Hu(s,e){const t=Di(e,this.size,4);s.uniform4fv(this.addr,t)}function Vu(s,e){const t=Di(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Wu(s,e){const t=Di(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Xu(s,e){const t=Di(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function qu(s,e){s.uniform1iv(this.addr,e)}function Yu(s,e){s.uniform2iv(this.addr,e)}function Zu(s,e){s.uniform3iv(this.addr,e)}function ju(s,e){s.uniform4iv(this.addr,e)}function Ku(s,e){s.uniform1uiv(this.addr,e)}function $u(s,e){s.uniform2uiv(this.addr,e)}function Ju(s,e){s.uniform3uiv(this.addr,e)}function Qu(s,e){s.uniform4uiv(this.addr,e)}function ep(s,e,t){const n=this.cache,i=e.length,a=$a(t,i);gt(n,a)||(s.uniform1iv(this.addr,a),wt(n,a));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||vc,a[o])}function tp(s,e,t){const n=this.cache,i=e.length,a=$a(t,i);gt(n,a)||(s.uniform1iv(this.addr,a),wt(n,a));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Sc,a[o])}function np(s,e,t){const n=this.cache,i=e.length,a=$a(t,i);gt(n,a)||(s.uniform1iv(this.addr,a),wt(n,a));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||bc,a[o])}function ip(s,e,t){const n=this.cache,i=e.length,a=$a(t,i);gt(n,a)||(s.uniform1iv(this.addr,a),wt(n,a));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Mc,a[o])}function ap(s){switch(s){case 5126:return Fu;case 35664:return zu;case 35665:return Gu;case 35666:return Hu;case 35674:return Vu;case 35675:return Wu;case 35676:return Xu;case 5124:case 35670:return qu;case 35667:case 35671:return Yu;case 35668:case 35672:return Zu;case 35669:case 35673:return ju;case 5125:return Ku;case 36294:return $u;case 36295:return Ju;case 36296:return Qu;case 35678:case 36198:case 36298:case 36306:case 35682:return ep;case 35679:case 36299:case 36307:return tp;case 35680:case 36300:case 36308:case 36293:return np;case 36289:case 36303:case 36311:case 36292:return ip}}class sp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ou(t.type)}}class op{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ap(t.type)}}class rp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let a=0,o=i.length;a!==o;++a){const r=i[a];r.setValue(e,t[r.id],n)}}}const Ds=/(\w+)(\])?(\[|\.)?/g;function Tr(s,e){s.seq.push(e),s.map[e.id]=e}function cp(s,e,t){const n=s.name,i=n.length;for(Ds.lastIndex=0;;){const a=Ds.exec(n),o=Ds.lastIndex;let r=a[1];const c=a[2]==="]",h=a[3];if(c&&(r=r|0),h===void 0||h==="["&&o+2===i){Tr(t,h===void 0?new sp(r,s,e):new op(r,s,e));break}else{let u=t.map[r];u===void 0&&(u=new rp(r),Tr(t,u)),t=u}}}class Pa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const a=e.getActiveUniform(t,i),o=e.getUniformLocation(t,a.name);cp(a,o,this)}}setValue(e,t,n,i){const a=this.map[t];a!==void 0&&a.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let a=0,o=t.length;a!==o;++a){const r=t[a],c=n[r.id];c.needsUpdate!==!1&&r.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,a=e.length;i!==a;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Ar(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const lp=37297;let hp=0;function dp(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let o=i;o<a;o++){const r=o+1;n.push(`${r===e?">":" "} ${r}: ${t[o]}`)}return n.join(`
`)}function up(s){const e=tt.getPrimaries(tt.workingColorSpace),t=tt.getPrimaries(s);let n;switch(e===t?n="":e===Ua&&t===Na?n="LinearDisplayP3ToLinearSRGB":e===Na&&t===Ua&&(n="LinearSRGBToLinearDisplayP3"),s){case Bn:case ja:return[n,"LinearTransferOETF"];case sn:case Js:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Rr(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const a=/ERROR: 0:(\d+)/.exec(i);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+i+`

`+dp(s.getShaderSource(e),o)}else return i}function pp(s,e){const t=up(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function fp(s,e){let t;switch(e){case Sl:t="Linear";break;case bl:t="Reinhard";break;case El:t="OptimizedCineon";break;case Tl:t="ACESFilmic";break;case Rl:t="AgX";break;case Cl:t="Neutral";break;case Al:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function mp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xi).join(`
`)}function gp(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function wp(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const a=s.getActiveAttrib(e,i),o=a.name;let r=1;a.type===s.FLOAT_MAT2&&(r=2),a.type===s.FLOAT_MAT3&&(r=3),a.type===s.FLOAT_MAT4&&(r=4),t[o]={type:a.type,location:s.getAttribLocation(e,o),locationSize:r}}return t}function Xi(s){return s!==""}function Cr(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Pr(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const xp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ys(s){return s.replace(xp,vp)}const _p=new Map;function vp(s,e){let t=ke[e];if(t===void 0){const n=_p.get(e);if(n!==void 0)t=ke[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ys(t)}const yp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ir(s){return s.replace(yp,Mp)}function Mp(s,e,t,n){let i="";for(let a=parseInt(e);a<parseInt(t);a++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return i}function Dr(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Sp(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===$r?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===jc?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===mn&&(e="SHADOWMAP_TYPE_VSM"),e}function bp(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ai:case Ri:e="ENVMAP_TYPE_CUBE";break;case qa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ep(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ri:e="ENVMAP_MODE_REFRACTION";break}return e}function Tp(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Xa:e="ENVMAP_BLENDING_MULTIPLY";break;case yl:e="ENVMAP_BLENDING_MIX";break;case Ml:e="ENVMAP_BLENDING_ADD";break}return e}function Ap(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Rp(s,e,t,n){const i=s.getContext(),a=t.defines;let o=t.vertexShader,r=t.fragmentShader;const c=Sp(t),h=bp(t),d=Ep(t),u=Tp(t),p=Ap(t),m=mp(t),x=gp(a),_=i.createProgram();let w,g,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(w=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Xi).join(`
`),w.length>0&&(w+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Xi).join(`
`),g.length>0&&(g+=`
`)):(w=[Dr(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xi).join(`
`),g=[Dr(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==In?"#define TONE_MAPPING":"",t.toneMapping!==In?ke.tonemapping_pars_fragment:"",t.toneMapping!==In?fp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,pp("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xi).join(`
`)),o=Ys(o),o=Cr(o,t),o=Pr(o,t),r=Ys(r),r=Cr(r,t),r=Pr(r,t),o=Ir(o),r=Ir(r),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,w=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+w,g=["#define varying in",t.glslVersion===Zo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Zo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const v=S+w+o,E=S+g+r,I=Ar(i,i.VERTEX_SHADER,v),C=Ar(i,i.FRAGMENT_SHADER,E);i.attachShader(_,I),i.attachShader(_,C),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function P(U){if(s.debug.checkShaderErrors){const O=i.getProgramInfoLog(_).trim(),L=i.getShaderInfoLog(I).trim(),H=i.getShaderInfoLog(C).trim();let q=!0,ee=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,I,C);else{const ne=Rr(i,I,"vertex"),Y=Rr(i,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+O+`
`+ne+`
`+Y)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(L===""||H==="")&&(ee=!1);ee&&(U.diagnostics={runnable:q,programLog:O,vertexShader:{log:L,prefix:w},fragmentShader:{log:H,prefix:g}})}i.deleteShader(I),i.deleteShader(C),k=new Pa(i,_),b=wp(i,_)}let k;this.getUniforms=function(){return k===void 0&&P(this),k};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(_,lp)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=hp++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=I,this.fragmentShader=C,this}let Cp=0;class Pp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),a=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Ip(e),t.set(e,n)),n}}class Ip{constructor(e){this.id=Cp++,this.code=e,this.usedTimes=0}}function Dp(s,e,t,n,i,a,o){const r=new eo,c=new Pp,h=new Set,d=[],u=i.logarithmicDepthBuffer,p=i.vertexTextures;let m=i.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return h.add(b),b===0?"uv":`uv${b}`}function w(b,M,U,O,L){const H=O.fog,q=L.geometry,ee=b.isMeshStandardMaterial?O.environment:null,ne=(b.isMeshStandardMaterial?t:e).get(b.envMap||ee),Y=ne&&ne.mapping===qa?ne.image.height:null,oe=x[b.type];b.precision!==null&&(m=i.getMaxPrecision(b.precision),m!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const se=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ve=se!==void 0?se.length:0;let Ve=0;q.morphAttributes.position!==void 0&&(Ve=1),q.morphAttributes.normal!==void 0&&(Ve=2),q.morphAttributes.color!==void 0&&(Ve=3);let $e,K,re,xe;if(oe){const Je=on[oe];$e=Je.vertexShader,K=Je.fragmentShader}else $e=b.vertexShader,K=b.fragmentShader,c.update(b),re=c.getVertexShaderID(b),xe=c.getFragmentShaderID(b);const he=s.getRenderTarget(),Fe=L.isInstancedMesh===!0,ze=L.isBatchedMesh===!0,G=!!b.map,je=!!b.matcap,Me=!!ne,Qe=!!b.aoMap,Ee=!!b.lightMap,Ge=!!b.bumpMap,De=!!b.normalMap,qe=!!b.displacementMap,lt=!!b.emissiveMap,D=!!b.metalnessMap,T=!!b.roughnessMap,j=b.anisotropy>0,Q=b.clearcoat>0,ie=b.dispersion>0,ae=b.iridescence>0,be=b.sheen>0,me=b.transmission>0,fe=j&&!!b.anisotropyMap,Ue=Q&&!!b.clearcoatMap,le=Q&&!!b.clearcoatNormalMap,Se=Q&&!!b.clearcoatRoughnessMap,Ye=ae&&!!b.iridescenceMap,Te=ae&&!!b.iridescenceThicknessMap,we=be&&!!b.sheenColorMap,Be=be&&!!b.sheenRoughnessMap,Xe=!!b.specularMap,dt=!!b.specularColorMap,Oe=!!b.specularIntensityMap,B=me&&!!b.transmissionMap,te=me&&!!b.thicknessMap,$=!!b.gradientMap,ue=!!b.alphaMap,ge=b.alphaTest>0,Ze=!!b.alphaHash,nt=!!b.extensions;let ht=In;b.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(ht=s.toneMapping);const bt={shaderID:oe,shaderType:b.type,shaderName:b.name,vertexShader:$e,fragmentShader:K,defines:b.defines,customVertexShaderID:re,customFragmentShaderID:xe,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:ze,instancing:Fe,instancingColor:Fe&&L.instanceColor!==null,instancingMorph:Fe&&L.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:he===null?s.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:Bn,alphaToCoverage:!!b.alphaToCoverage,map:G,matcap:je,envMap:Me,envMapMode:Me&&ne.mapping,envMapCubeUVHeight:Y,aoMap:Qe,lightMap:Ee,bumpMap:Ge,normalMap:De,displacementMap:p&&qe,emissiveMap:lt,normalMapObjectSpace:De&&b.normalMapType===Vl,normalMapTangentSpace:De&&b.normalMapType===Za,metalnessMap:D,roughnessMap:T,anisotropy:j,anisotropyMap:fe,clearcoat:Q,clearcoatMap:Ue,clearcoatNormalMap:le,clearcoatRoughnessMap:Se,dispersion:ie,iridescence:ae,iridescenceMap:Ye,iridescenceThicknessMap:Te,sheen:be,sheenColorMap:we,sheenRoughnessMap:Be,specularMap:Xe,specularColorMap:dt,specularIntensityMap:Oe,transmission:me,transmissionMap:B,thicknessMap:te,gradientMap:$,opaque:b.transparent===!1&&b.blending===Mi&&b.alphaToCoverage===!1,alphaMap:ue,alphaTest:ge,alphaHash:Ze,combine:b.combine,mapUv:G&&_(b.map.channel),aoMapUv:Qe&&_(b.aoMap.channel),lightMapUv:Ee&&_(b.lightMap.channel),bumpMapUv:Ge&&_(b.bumpMap.channel),normalMapUv:De&&_(b.normalMap.channel),displacementMapUv:qe&&_(b.displacementMap.channel),emissiveMapUv:lt&&_(b.emissiveMap.channel),metalnessMapUv:D&&_(b.metalnessMap.channel),roughnessMapUv:T&&_(b.roughnessMap.channel),anisotropyMapUv:fe&&_(b.anisotropyMap.channel),clearcoatMapUv:Ue&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:le&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ye&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:we&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Be&&_(b.sheenRoughnessMap.channel),specularMapUv:Xe&&_(b.specularMap.channel),specularColorMapUv:dt&&_(b.specularColorMap.channel),specularIntensityMapUv:Oe&&_(b.specularIntensityMap.channel),transmissionMapUv:B&&_(b.transmissionMap.channel),thicknessMapUv:te&&_(b.thicknessMap.channel),alphaMapUv:ue&&_(b.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(De||j),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!q.attributes.uv&&(G||ue),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:L.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Ve,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&U.length>0,shadowMapType:s.shadowMap.type,toneMapping:ht,useLegacyLights:s._useLegacyLights,decodeVideoTexture:G&&b.map.isVideoTexture===!0&&tt.getTransfer(b.map.colorSpace)===it,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Lt,flipSided:b.side===zt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:nt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:nt&&b.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return bt.vertexUv1s=h.has(1),bt.vertexUv2s=h.has(2),bt.vertexUv3s=h.has(3),h.clear(),bt}function g(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const U in b.defines)M.push(U),M.push(b.defines[U]);return b.isRawShaderMaterial===!1&&(S(M,b),v(M,b),M.push(s.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function S(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function v(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.skinning&&r.enable(4),M.morphTargets&&r.enable(5),M.morphNormals&&r.enable(6),M.morphColors&&r.enable(7),M.premultipliedAlpha&&r.enable(8),M.shadowMapEnabled&&r.enable(9),M.useLegacyLights&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.alphaToCoverage&&r.enable(20),b.push(r.mask)}function E(b){const M=x[b.type];let U;if(M){const O=on[M];U=gh.clone(O.uniforms)}else U=b.uniforms;return U}function I(b,M){let U;for(let O=0,L=d.length;O<L;O++){const H=d[O];if(H.cacheKey===M){U=H,++U.usedTimes;break}}return U===void 0&&(U=new Rp(s,M,b,a),d.push(U)),U}function C(b){if(--b.usedTimes===0){const M=d.indexOf(b);d[M]=d[d.length-1],d.pop(),b.destroy()}}function P(b){c.remove(b)}function k(){c.dispose()}return{getParameters:w,getProgramCacheKey:g,getUniforms:E,acquireProgram:I,releaseProgram:C,releaseShaderCache:P,programs:d,dispose:k}}function Lp(){let s=new WeakMap;function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function t(a){s.delete(a)}function n(a,o,r){s.get(a)[o]=r}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function kp(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Lr(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function kr(){const s=[];let e=0;const t=[],n=[],i=[];function a(){e=0,t.length=0,n.length=0,i.length=0}function o(u,p,m,x,_,w){let g=s[e];return g===void 0?(g={id:u.id,object:u,geometry:p,material:m,groupOrder:x,renderOrder:u.renderOrder,z:_,group:w},s[e]=g):(g.id=u.id,g.object=u,g.geometry=p,g.material=m,g.groupOrder=x,g.renderOrder=u.renderOrder,g.z=_,g.group=w),e++,g}function r(u,p,m,x,_,w){const g=o(u,p,m,x,_,w);m.transmission>0?n.push(g):m.transparent===!0?i.push(g):t.push(g)}function c(u,p,m,x,_,w){const g=o(u,p,m,x,_,w);m.transmission>0?n.unshift(g):m.transparent===!0?i.unshift(g):t.unshift(g)}function h(u,p){t.length>1&&t.sort(u||kp),n.length>1&&n.sort(p||Lr),i.length>1&&i.sort(p||Lr)}function d(){for(let u=e,p=s.length;u<p;u++){const m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:a,push:r,unshift:c,finish:d,sort:h}}function Np(){let s=new WeakMap;function e(n,i){const a=s.get(n);let o;return a===void 0?(o=new kr,s.set(n,[o])):i>=a.length?(o=new kr,a.push(o)):o=a[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function Up(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Ce};break;case"SpotLight":t={position:new N,direction:new N,color:new Ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Ce,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Ce,groundColor:new Ce};break;case"RectAreaLight":t={color:new Ce,position:new N,halfWidth:new N,halfHeight:new N};break}return s[e.id]=t,t}}}function Bp(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Op=0;function Fp(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function zp(s){const e=new Up,t=Bp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new N);const i=new N,a=new st,o=new st;function r(h,d){let u=0,p=0,m=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let x=0,_=0,w=0,g=0,S=0,v=0,E=0,I=0,C=0,P=0,k=0;h.sort(Fp);const b=d===!0?Math.PI:1;for(let U=0,O=h.length;U<O;U++){const L=h[U],H=L.color,q=L.intensity,ee=L.distance,ne=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=H.r*q*b,p+=H.g*q*b,m+=H.b*q*b;else if(L.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(L.sh.coefficients[Y],q);k++}else if(L.isDirectionalLight){const Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity*b),L.castShadow){const oe=L.shadow,se=t.get(L);se.shadowBias=oe.bias,se.shadowNormalBias=oe.normalBias,se.shadowRadius=oe.radius,se.shadowMapSize=oe.mapSize,n.directionalShadow[x]=se,n.directionalShadowMap[x]=ne,n.directionalShadowMatrix[x]=L.shadow.matrix,v++}n.directional[x]=Y,x++}else if(L.isSpotLight){const Y=e.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(H).multiplyScalar(q*b),Y.distance=ee,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,n.spot[w]=Y;const oe=L.shadow;if(L.map&&(n.spotLightMap[C]=L.map,C++,oe.updateMatrices(L),L.castShadow&&P++),n.spotLightMatrix[w]=oe.matrix,L.castShadow){const se=t.get(L);se.shadowBias=oe.bias,se.shadowNormalBias=oe.normalBias,se.shadowRadius=oe.radius,se.shadowMapSize=oe.mapSize,n.spotShadow[w]=se,n.spotShadowMap[w]=ne,I++}w++}else if(L.isRectAreaLight){const Y=e.get(L);Y.color.copy(H).multiplyScalar(q),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),n.rectArea[g]=Y,g++}else if(L.isPointLight){const Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity*b),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){const oe=L.shadow,se=t.get(L);se.shadowBias=oe.bias,se.shadowNormalBias=oe.normalBias,se.shadowRadius=oe.radius,se.shadowMapSize=oe.mapSize,se.shadowCameraNear=oe.camera.near,se.shadowCameraFar=oe.camera.far,n.pointShadow[_]=se,n.pointShadowMap[_]=ne,n.pointShadowMatrix[_]=L.shadow.matrix,E++}n.point[_]=Y,_++}else if(L.isHemisphereLight){const Y=e.get(L);Y.skyColor.copy(L.color).multiplyScalar(q*b),Y.groundColor.copy(L.groundColor).multiplyScalar(q*b),n.hemi[S]=Y,S++}}g>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=p,n.ambient[2]=m;const M=n.hash;(M.directionalLength!==x||M.pointLength!==_||M.spotLength!==w||M.rectAreaLength!==g||M.hemiLength!==S||M.numDirectionalShadows!==v||M.numPointShadows!==E||M.numSpotShadows!==I||M.numSpotMaps!==C||M.numLightProbes!==k)&&(n.directional.length=x,n.spot.length=w,n.rectArea.length=g,n.point.length=_,n.hemi.length=S,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=I,n.spotShadowMap.length=I,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=I+C-P,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=k,M.directionalLength=x,M.pointLength=_,M.spotLength=w,M.rectAreaLength=g,M.hemiLength=S,M.numDirectionalShadows=v,M.numPointShadows=E,M.numSpotShadows=I,M.numSpotMaps=C,M.numLightProbes=k,n.version=Op++)}function c(h,d){let u=0,p=0,m=0,x=0,_=0;const w=d.matrixWorldInverse;for(let g=0,S=h.length;g<S;g++){const v=h[g];if(v.isDirectionalLight){const E=n.directional[u];E.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(w),u++}else if(v.isSpotLight){const E=n.spot[m];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(w),E.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(w),m++}else if(v.isRectAreaLight){const E=n.rectArea[x];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(w),o.identity(),a.copy(v.matrixWorld),a.premultiply(w),o.extractRotation(a),E.halfWidth.set(v.width*.5,0,0),E.halfHeight.set(0,v.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){const E=n.point[p];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(w),p++}else if(v.isHemisphereLight){const E=n.hemi[_];E.direction.setFromMatrixPosition(v.matrixWorld),E.direction.transformDirection(w),_++}}}return{setup:r,setupView:c,state:n}}function Nr(s){const e=new zp(s),t=[],n=[];function i(d){h.camera=d,t.length=0,n.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function r(d){e.setup(t,d)}function c(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:h,setupLights:r,setupLightsView:c,pushLight:a,pushShadow:o}}function Gp(s){let e=new WeakMap;function t(i,a=0){const o=e.get(i);let r;return o===void 0?(r=new Nr(s),e.set(i,[r])):a>=o.length?(r=new Nr(s),o.push(r)):r=o[a],r}function n(){e=new WeakMap}return{get:t,dispose:n}}class Hp extends _n{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Vp extends _n{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Wp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function qp(s,e,t){let n=new to;const i=new Re,a=new Re,o=new ct,r=new Hp({depthPacking:Hl}),c=new Vp,h={},d=t.maxTextureSize,u={[kn]:zt,[zt]:kn,[Lt]:Lt},p=new Un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Re},radius:{value:4}},vertexShader:Wp,fragmentShader:Xp}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new Ut;x.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new l(x,p),w=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$r;let g=this.type;this.render=function(C,P,k){if(w.enabled===!1||w.autoUpdate===!1&&w.needsUpdate===!1||C.length===0)return;const b=s.getRenderTarget(),M=s.getActiveCubeFace(),U=s.getActiveMipmapLevel(),O=s.state;O.setBlending(Pn),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const L=g!==mn&&this.type===mn,H=g===mn&&this.type!==mn;for(let q=0,ee=C.length;q<ee;q++){const ne=C[q],Y=ne.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;i.copy(Y.mapSize);const oe=Y.getFrameExtents();if(i.multiply(oe),a.copy(Y.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(a.x=Math.floor(d/oe.x),i.x=a.x*oe.x,Y.mapSize.x=a.x),i.y>d&&(a.y=Math.floor(d/oe.y),i.y=a.y*oe.y,Y.mapSize.y=a.y)),Y.map===null||L===!0||H===!0){const ve=this.type!==mn?{minFilter:jt,magFilter:jt}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Qn(i.x,i.y,ve),Y.map.texture.name=ne.name+".shadowMap",Y.camera.updateProjectionMatrix()}s.setRenderTarget(Y.map),s.clear();const se=Y.getViewportCount();for(let ve=0;ve<se;ve++){const Ve=Y.getViewport(ve);o.set(a.x*Ve.x,a.y*Ve.y,a.x*Ve.z,a.y*Ve.w),O.viewport(o),Y.updateMatrices(ne,ve),n=Y.getFrustum(),E(P,k,Y.camera,ne,this.type)}Y.isPointLightShadow!==!0&&this.type===mn&&S(Y,k),Y.needsUpdate=!1}g=this.type,w.needsUpdate=!1,s.setRenderTarget(b,M,U)};function S(C,P){const k=e.update(_);p.defines.VSM_SAMPLES!==C.blurSamples&&(p.defines.VSM_SAMPLES=C.blurSamples,m.defines.VSM_SAMPLES=C.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Qn(i.x,i.y)),p.uniforms.shadow_pass.value=C.map.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,s.setRenderTarget(C.mapPass),s.clear(),s.renderBufferDirect(P,null,k,p,_,null),m.uniforms.shadow_pass.value=C.mapPass.texture,m.uniforms.resolution.value=C.mapSize,m.uniforms.radius.value=C.radius,s.setRenderTarget(C.map),s.clear(),s.renderBufferDirect(P,null,k,m,_,null)}function v(C,P,k,b){let M=null;const U=k.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(U!==void 0)M=U;else if(M=k.isPointLight===!0?c:r,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const O=M.uuid,L=P.uuid;let H=h[O];H===void 0&&(H={},h[O]=H);let q=H[L];q===void 0&&(q=M.clone(),H[L]=q,P.addEventListener("dispose",I)),M=q}if(M.visible=P.visible,M.wireframe=P.wireframe,b===mn?M.side=P.shadowSide!==null?P.shadowSide:P.side:M.side=P.shadowSide!==null?P.shadowSide:u[P.side],M.alphaMap=P.alphaMap,M.alphaTest=P.alphaTest,M.map=P.map,M.clipShadows=P.clipShadows,M.clippingPlanes=P.clippingPlanes,M.clipIntersection=P.clipIntersection,M.displacementMap=P.displacementMap,M.displacementScale=P.displacementScale,M.displacementBias=P.displacementBias,M.wireframeLinewidth=P.wireframeLinewidth,M.linewidth=P.linewidth,k.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const O=s.properties.get(M);O.light=k}return M}function E(C,P,k,b,M){if(C.visible===!1)return;if(C.layers.test(P.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&M===mn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,C.matrixWorld);const L=e.update(C),H=C.material;if(Array.isArray(H)){const q=L.groups;for(let ee=0,ne=q.length;ee<ne;ee++){const Y=q[ee],oe=H[Y.materialIndex];if(oe&&oe.visible){const se=v(C,oe,b,M);C.onBeforeShadow(s,C,P,k,L,se,Y),s.renderBufferDirect(k,null,L,se,C,Y),C.onAfterShadow(s,C,P,k,L,se,Y)}}}else if(H.visible){const q=v(C,H,b,M);C.onBeforeShadow(s,C,P,k,L,q,null),s.renderBufferDirect(k,null,L,q,C,null),C.onAfterShadow(s,C,P,k,L,q,null)}}const O=C.children;for(let L=0,H=O.length;L<H;L++)E(O[L],P,k,b,M)}function I(C){C.target.removeEventListener("dispose",I);for(const k in h){const b=h[k],M=C.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}function Yp(s){function e(){let B=!1;const te=new ct;let $=null;const ue=new ct(0,0,0,0);return{setMask:function(ge){$!==ge&&!B&&(s.colorMask(ge,ge,ge,ge),$=ge)},setLocked:function(ge){B=ge},setClear:function(ge,Ze,nt,ht,bt){bt===!0&&(ge*=ht,Ze*=ht,nt*=ht),te.set(ge,Ze,nt,ht),ue.equals(te)===!1&&(s.clearColor(ge,Ze,nt,ht),ue.copy(te))},reset:function(){B=!1,$=null,ue.set(-1,0,0,0)}}}function t(){let B=!1,te=null,$=null,ue=null;return{setTest:function(ge){ge?xe(s.DEPTH_TEST):he(s.DEPTH_TEST)},setMask:function(ge){te!==ge&&!B&&(s.depthMask(ge),te=ge)},setFunc:function(ge){if($!==ge){switch(ge){case fl:s.depthFunc(s.NEVER);break;case ml:s.depthFunc(s.ALWAYS);break;case gl:s.depthFunc(s.LESS);break;case La:s.depthFunc(s.LEQUAL);break;case wl:s.depthFunc(s.EQUAL);break;case xl:s.depthFunc(s.GEQUAL);break;case _l:s.depthFunc(s.GREATER);break;case vl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}$=ge}},setLocked:function(ge){B=ge},setClear:function(ge){ue!==ge&&(s.clearDepth(ge),ue=ge)},reset:function(){B=!1,te=null,$=null,ue=null}}}function n(){let B=!1,te=null,$=null,ue=null,ge=null,Ze=null,nt=null,ht=null,bt=null;return{setTest:function(Je){B||(Je?xe(s.STENCIL_TEST):he(s.STENCIL_TEST))},setMask:function(Je){te!==Je&&!B&&(s.stencilMask(Je),te=Je)},setFunc:function(Je,an,Ct){($!==Je||ue!==an||ge!==Ct)&&(s.stencilFunc(Je,an,Ct),$=Je,ue=an,ge=Ct)},setOp:function(Je,an,Ct){(Ze!==Je||nt!==an||ht!==Ct)&&(s.stencilOp(Je,an,Ct),Ze=Je,nt=an,ht=Ct)},setLocked:function(Je){B=Je},setClear:function(Je){bt!==Je&&(s.clearStencil(Je),bt=Je)},reset:function(){B=!1,te=null,$=null,ue=null,ge=null,Ze=null,nt=null,ht=null,bt=null}}}const i=new e,a=new t,o=new n,r=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,p=[],m=null,x=!1,_=null,w=null,g=null,S=null,v=null,E=null,I=null,C=new Ce(0,0,0),P=0,k=!1,b=null,M=null,U=null,O=null,L=null;const H=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,ee=0;const ne=s.getParameter(s.VERSION);ne.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(ne)[1]),q=ee>=1):ne.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),q=ee>=2);let Y=null,oe={};const se=s.getParameter(s.SCISSOR_BOX),ve=s.getParameter(s.VIEWPORT),Ve=new ct().fromArray(se),$e=new ct().fromArray(ve);function K(B,te,$,ue){const ge=new Uint8Array(4),Ze=s.createTexture();s.bindTexture(B,Ze),s.texParameteri(B,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(B,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let nt=0;nt<$;nt++)B===s.TEXTURE_3D||B===s.TEXTURE_2D_ARRAY?s.texImage3D(te,0,s.RGBA,1,1,ue,0,s.RGBA,s.UNSIGNED_BYTE,ge):s.texImage2D(te+nt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ge);return Ze}const re={};re[s.TEXTURE_2D]=K(s.TEXTURE_2D,s.TEXTURE_2D,1),re[s.TEXTURE_CUBE_MAP]=K(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[s.TEXTURE_2D_ARRAY]=K(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),re[s.TEXTURE_3D]=K(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),a.setClear(1),o.setClear(0),xe(s.DEPTH_TEST),a.setFunc(La),Ge(!1),De(wo),xe(s.CULL_FACE),Qe(Pn);function xe(B){h[B]!==!0&&(s.enable(B),h[B]=!0)}function he(B){h[B]!==!1&&(s.disable(B),h[B]=!1)}function Fe(B,te){return d[B]!==te?(s.bindFramebuffer(B,te),d[B]=te,B===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=te),B===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=te),!0):!1}function ze(B,te){let $=p,ue=!1;if(B){$=u.get(te),$===void 0&&($=[],u.set(te,$));const ge=B.textures;if($.length!==ge.length||$[0]!==s.COLOR_ATTACHMENT0){for(let Ze=0,nt=ge.length;Ze<nt;Ze++)$[Ze]=s.COLOR_ATTACHMENT0+Ze;$.length=ge.length,ue=!0}}else $[0]!==s.BACK&&($[0]=s.BACK,ue=!0);ue&&s.drawBuffers($)}function G(B){return m!==B?(s.useProgram(B),m=B,!0):!1}const je={[Yn]:s.FUNC_ADD,[$c]:s.FUNC_SUBTRACT,[Jc]:s.FUNC_REVERSE_SUBTRACT};je[Qc]=s.MIN,je[el]=s.MAX;const Me={[tl]:s.ZERO,[nl]:s.ONE,[il]:s.SRC_COLOR,[Fs]:s.SRC_ALPHA,[ll]:s.SRC_ALPHA_SATURATE,[rl]:s.DST_COLOR,[sl]:s.DST_ALPHA,[al]:s.ONE_MINUS_SRC_COLOR,[zs]:s.ONE_MINUS_SRC_ALPHA,[cl]:s.ONE_MINUS_DST_COLOR,[ol]:s.ONE_MINUS_DST_ALPHA,[hl]:s.CONSTANT_COLOR,[dl]:s.ONE_MINUS_CONSTANT_COLOR,[ul]:s.CONSTANT_ALPHA,[pl]:s.ONE_MINUS_CONSTANT_ALPHA};function Qe(B,te,$,ue,ge,Ze,nt,ht,bt,Je){if(B===Pn){x===!0&&(he(s.BLEND),x=!1);return}if(x===!1&&(xe(s.BLEND),x=!0),B!==Kc){if(B!==_||Je!==k){if((w!==Yn||v!==Yn)&&(s.blendEquation(s.FUNC_ADD),w=Yn,v=Yn),Je)switch(B){case Mi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case xo:s.blendFunc(s.ONE,s.ONE);break;case _o:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case vo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Mi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case xo:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case _o:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case vo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}g=null,S=null,E=null,I=null,C.set(0,0,0),P=0,_=B,k=Je}return}ge=ge||te,Ze=Ze||$,nt=nt||ue,(te!==w||ge!==v)&&(s.blendEquationSeparate(je[te],je[ge]),w=te,v=ge),($!==g||ue!==S||Ze!==E||nt!==I)&&(s.blendFuncSeparate(Me[$],Me[ue],Me[Ze],Me[nt]),g=$,S=ue,E=Ze,I=nt),(ht.equals(C)===!1||bt!==P)&&(s.blendColor(ht.r,ht.g,ht.b,bt),C.copy(ht),P=bt),_=B,k=!1}function Ee(B,te){B.side===Lt?he(s.CULL_FACE):xe(s.CULL_FACE);let $=B.side===zt;te&&($=!$),Ge($),B.blending===Mi&&B.transparent===!1?Qe(Pn):Qe(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),i.setMask(B.colorWrite);const ue=B.stencilWrite;o.setTest(ue),ue&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),lt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?xe(s.SAMPLE_ALPHA_TO_COVERAGE):he(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(B){b!==B&&(B?s.frontFace(s.CW):s.frontFace(s.CCW),b=B)}function De(B){B!==qc?(xe(s.CULL_FACE),B!==M&&(B===wo?s.cullFace(s.BACK):B===Yc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):he(s.CULL_FACE),M=B}function qe(B){B!==U&&(q&&s.lineWidth(B),U=B)}function lt(B,te,$){B?(xe(s.POLYGON_OFFSET_FILL),(O!==te||L!==$)&&(s.polygonOffset(te,$),O=te,L=$)):he(s.POLYGON_OFFSET_FILL)}function D(B){B?xe(s.SCISSOR_TEST):he(s.SCISSOR_TEST)}function T(B){B===void 0&&(B=s.TEXTURE0+H-1),Y!==B&&(s.activeTexture(B),Y=B)}function j(B,te,$){$===void 0&&(Y===null?$=s.TEXTURE0+H-1:$=Y);let ue=oe[$];ue===void 0&&(ue={type:void 0,texture:void 0},oe[$]=ue),(ue.type!==B||ue.texture!==te)&&(Y!==$&&(s.activeTexture($),Y=$),s.bindTexture(B,te||re[B]),ue.type=B,ue.texture=te)}function Q(){const B=oe[Y];B!==void 0&&B.type!==void 0&&(s.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ie(){try{s.compressedTexImage2D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ae(){try{s.compressedTexImage3D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function be(){try{s.texSubImage2D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function me(){try{s.texSubImage3D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function fe(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ue(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function le(){try{s.texStorage2D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Se(){try{s.texStorage3D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ye(){try{s.texImage2D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Te(){try{s.texImage3D.apply(s,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function we(B){Ve.equals(B)===!1&&(s.scissor(B.x,B.y,B.z,B.w),Ve.copy(B))}function Be(B){$e.equals(B)===!1&&(s.viewport(B.x,B.y,B.z,B.w),$e.copy(B))}function Xe(B,te){let $=c.get(te);$===void 0&&($=new WeakMap,c.set(te,$));let ue=$.get(B);ue===void 0&&(ue=s.getUniformBlockIndex(te,B.name),$.set(B,ue))}function dt(B,te){const ue=c.get(te).get(B);r.get(te)!==ue&&(s.uniformBlockBinding(te,ue,B.__bindingPointIndex),r.set(te,ue))}function Oe(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},Y=null,oe={},d={},u=new WeakMap,p=[],m=null,x=!1,_=null,w=null,g=null,S=null,v=null,E=null,I=null,C=new Ce(0,0,0),P=0,k=!1,b=null,M=null,U=null,O=null,L=null,Ve.set(0,0,s.canvas.width,s.canvas.height),$e.set(0,0,s.canvas.width,s.canvas.height),i.reset(),a.reset(),o.reset()}return{buffers:{color:i,depth:a,stencil:o},enable:xe,disable:he,bindFramebuffer:Fe,drawBuffers:ze,useProgram:G,setBlending:Qe,setMaterial:Ee,setFlipSided:Ge,setCullFace:De,setLineWidth:qe,setPolygonOffset:lt,setScissorTest:D,activeTexture:T,bindTexture:j,unbindTexture:Q,compressedTexImage2D:ie,compressedTexImage3D:ae,texImage2D:Ye,texImage3D:Te,updateUBOMapping:Xe,uniformBlockBinding:dt,texStorage2D:le,texStorage3D:Se,texSubImage2D:be,texSubImage3D:me,compressedTexSubImage2D:fe,compressedTexSubImage3D:Ue,scissor:we,viewport:Be,reset:Oe}}function Zp(s,e,t,n,i,a,o){const r=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Re,d=new WeakMap;let u;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(D,T){return m?new OffscreenCanvas(D,T):Oa("canvas")}function _(D,T,j){let Q=1;const ie=lt(D);if((ie.width>j||ie.height>j)&&(Q=j/Math.max(ie.width,ie.height)),Q<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ae=Math.floor(Q*ie.width),be=Math.floor(Q*ie.height);u===void 0&&(u=x(ae,be));const me=T?x(ae,be):u;return me.width=ae,me.height=be,me.getContext("2d").drawImage(D,0,0,ae,be),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+ae+"x"+be+")."),me}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),D;return D}function w(D){return D.generateMipmaps&&D.minFilter!==jt&&D.minFilter!==tn}function g(D){s.generateMipmap(D)}function S(D,T,j,Q,ie=!1){if(D!==null){if(s[D]!==void 0)return s[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ae=T;if(T===s.RED&&(j===s.FLOAT&&(ae=s.R32F),j===s.HALF_FLOAT&&(ae=s.R16F),j===s.UNSIGNED_BYTE&&(ae=s.R8)),T===s.RED_INTEGER&&(j===s.UNSIGNED_BYTE&&(ae=s.R8UI),j===s.UNSIGNED_SHORT&&(ae=s.R16UI),j===s.UNSIGNED_INT&&(ae=s.R32UI),j===s.BYTE&&(ae=s.R8I),j===s.SHORT&&(ae=s.R16I),j===s.INT&&(ae=s.R32I)),T===s.RG&&(j===s.FLOAT&&(ae=s.RG32F),j===s.HALF_FLOAT&&(ae=s.RG16F),j===s.UNSIGNED_BYTE&&(ae=s.RG8)),T===s.RG_INTEGER&&(j===s.UNSIGNED_BYTE&&(ae=s.RG8UI),j===s.UNSIGNED_SHORT&&(ae=s.RG16UI),j===s.UNSIGNED_INT&&(ae=s.RG32UI),j===s.BYTE&&(ae=s.RG8I),j===s.SHORT&&(ae=s.RG16I),j===s.INT&&(ae=s.RG32I)),T===s.RGB&&j===s.UNSIGNED_INT_5_9_9_9_REV&&(ae=s.RGB9_E5),T===s.RGBA){const be=ie?ka:tt.getTransfer(Q);j===s.FLOAT&&(ae=s.RGBA32F),j===s.HALF_FLOAT&&(ae=s.RGBA16F),j===s.UNSIGNED_BYTE&&(ae=be===it?s.SRGB8_ALPHA8:s.RGBA8),j===s.UNSIGNED_SHORT_4_4_4_4&&(ae=s.RGBA4),j===s.UNSIGNED_SHORT_5_5_5_1&&(ae=s.RGB5_A1)}return(ae===s.R16F||ae===s.R32F||ae===s.RG16F||ae===s.RG32F||ae===s.RGBA16F||ae===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function v(D,T){return w(D)===!0||D.isFramebufferTexture&&D.minFilter!==jt&&D.minFilter!==tn?Math.log2(Math.max(T.width,T.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?T.mipmaps.length:1}function E(D){const T=D.target;T.removeEventListener("dispose",E),C(T),T.isVideoTexture&&d.delete(T)}function I(D){const T=D.target;T.removeEventListener("dispose",I),k(T)}function C(D){const T=n.get(D);if(T.__webglInit===void 0)return;const j=D.source,Q=p.get(j);if(Q){const ie=Q[T.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&P(D),Object.keys(Q).length===0&&p.delete(j)}n.remove(D)}function P(D){const T=n.get(D);s.deleteTexture(T.__webglTexture);const j=D.source,Q=p.get(j);delete Q[T.__cacheKey],o.memory.textures--}function k(D){const T=n.get(D);if(D.depthTexture&&D.depthTexture.dispose(),D.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(T.__webglFramebuffer[Q]))for(let ie=0;ie<T.__webglFramebuffer[Q].length;ie++)s.deleteFramebuffer(T.__webglFramebuffer[Q][ie]);else s.deleteFramebuffer(T.__webglFramebuffer[Q]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[Q])}else{if(Array.isArray(T.__webglFramebuffer))for(let Q=0;Q<T.__webglFramebuffer.length;Q++)s.deleteFramebuffer(T.__webglFramebuffer[Q]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let Q=0;Q<T.__webglColorRenderbuffer.length;Q++)T.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[Q]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const j=D.textures;for(let Q=0,ie=j.length;Q<ie;Q++){const ae=n.get(j[Q]);ae.__webglTexture&&(s.deleteTexture(ae.__webglTexture),o.memory.textures--),n.remove(j[Q])}n.remove(D)}let b=0;function M(){b=0}function U(){const D=b;return D>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+i.maxTextures),b+=1,D}function O(D){const T=[];return T.push(D.wrapS),T.push(D.wrapT),T.push(D.wrapR||0),T.push(D.magFilter),T.push(D.minFilter),T.push(D.anisotropy),T.push(D.internalFormat),T.push(D.format),T.push(D.type),T.push(D.generateMipmaps),T.push(D.premultiplyAlpha),T.push(D.flipY),T.push(D.unpackAlignment),T.push(D.colorSpace),T.join()}function L(D,T){const j=n.get(D);if(D.isVideoTexture&&De(D),D.isRenderTargetTexture===!1&&D.version>0&&j.__version!==D.version){const Q=D.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ve(j,D,T);return}}t.bindTexture(s.TEXTURE_2D,j.__webglTexture,s.TEXTURE0+T)}function H(D,T){const j=n.get(D);if(D.version>0&&j.__version!==D.version){Ve(j,D,T);return}t.bindTexture(s.TEXTURE_2D_ARRAY,j.__webglTexture,s.TEXTURE0+T)}function q(D,T){const j=n.get(D);if(D.version>0&&j.__version!==D.version){Ve(j,D,T);return}t.bindTexture(s.TEXTURE_3D,j.__webglTexture,s.TEXTURE0+T)}function ee(D,T){const j=n.get(D);if(D.version>0&&j.__version!==D.version){$e(j,D,T);return}t.bindTexture(s.TEXTURE_CUBE_MAP,j.__webglTexture,s.TEXTURE0+T)}const ne={[Vs]:s.REPEAT,[Kn]:s.CLAMP_TO_EDGE,[Ws]:s.MIRRORED_REPEAT},Y={[jt]:s.NEAREST,[Pl]:s.NEAREST_MIPMAP_NEAREST,[Qi]:s.NEAREST_MIPMAP_LINEAR,[tn]:s.LINEAR,[ns]:s.LINEAR_MIPMAP_NEAREST,[$n]:s.LINEAR_MIPMAP_LINEAR},oe={[Wl]:s.NEVER,[Kl]:s.ALWAYS,[Xl]:s.LESS,[oc]:s.LEQUAL,[ql]:s.EQUAL,[jl]:s.GEQUAL,[Yl]:s.GREATER,[Zl]:s.NOTEQUAL};function se(D,T){if(T.type===Rn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===tn||T.magFilter===ns||T.magFilter===Qi||T.magFilter===$n||T.minFilter===tn||T.minFilter===ns||T.minFilter===Qi||T.minFilter===$n)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(D,s.TEXTURE_WRAP_S,ne[T.wrapS]),s.texParameteri(D,s.TEXTURE_WRAP_T,ne[T.wrapT]),(D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY)&&s.texParameteri(D,s.TEXTURE_WRAP_R,ne[T.wrapR]),s.texParameteri(D,s.TEXTURE_MAG_FILTER,Y[T.magFilter]),s.texParameteri(D,s.TEXTURE_MIN_FILTER,Y[T.minFilter]),T.compareFunction&&(s.texParameteri(D,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(D,s.TEXTURE_COMPARE_FUNC,oe[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===jt||T.minFilter!==Qi&&T.minFilter!==$n||T.type===Rn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");s.texParameterf(D,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function ve(D,T){let j=!1;D.__webglInit===void 0&&(D.__webglInit=!0,T.addEventListener("dispose",E));const Q=T.source;let ie=p.get(Q);ie===void 0&&(ie={},p.set(Q,ie));const ae=O(T);if(ae!==D.__cacheKey){ie[ae]===void 0&&(ie[ae]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,j=!0),ie[ae].usedTimes++;const be=ie[D.__cacheKey];be!==void 0&&(ie[D.__cacheKey].usedTimes--,be.usedTimes===0&&P(T)),D.__cacheKey=ae,D.__webglTexture=ie[ae].texture}return j}function Ve(D,T,j){let Q=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(Q=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(Q=s.TEXTURE_3D);const ie=ve(D,T),ae=T.source;t.bindTexture(Q,D.__webglTexture,s.TEXTURE0+j);const be=n.get(ae);if(ae.version!==be.__version||ie===!0){t.activeTexture(s.TEXTURE0+j);const me=tt.getPrimaries(tt.workingColorSpace),fe=T.colorSpace===An?null:tt.getPrimaries(T.colorSpace),Ue=T.colorSpace===An||me===fe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ue);let le=_(T.image,!1,i.maxTextureSize);le=qe(T,le);const Se=a.convert(T.format,T.colorSpace),Ye=a.convert(T.type);let Te=S(T.internalFormat,Se,Ye,T.colorSpace,T.isVideoTexture);se(Q,T);let we;const Be=T.mipmaps,Xe=T.isVideoTexture!==!0,dt=be.__version===void 0||ie===!0,Oe=ae.dataReady,B=v(T,le);if(T.isDepthTexture)Te=s.DEPTH_COMPONENT16,T.type===Rn?Te=s.DEPTH_COMPONENT32F:T.type===Ci?Te=s.DEPTH_COMPONENT24:T.type===Zi&&(Te=s.DEPTH24_STENCIL8),dt&&(Xe?t.texStorage2D(s.TEXTURE_2D,1,Te,le.width,le.height):t.texImage2D(s.TEXTURE_2D,0,Te,le.width,le.height,0,Se,Ye,null));else if(T.isDataTexture)if(Be.length>0){Xe&&dt&&t.texStorage2D(s.TEXTURE_2D,B,Te,Be[0].width,Be[0].height);for(let te=0,$=Be.length;te<$;te++)we=Be[te],Xe?Oe&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,we.width,we.height,Se,Ye,we.data):t.texImage2D(s.TEXTURE_2D,te,Te,we.width,we.height,0,Se,Ye,we.data);T.generateMipmaps=!1}else Xe?(dt&&t.texStorage2D(s.TEXTURE_2D,B,Te,le.width,le.height),Oe&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,le.width,le.height,Se,Ye,le.data)):t.texImage2D(s.TEXTURE_2D,0,Te,le.width,le.height,0,Se,Ye,le.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Xe&&dt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,B,Te,Be[0].width,Be[0].height,le.depth);for(let te=0,$=Be.length;te<$;te++)we=Be[te],T.format!==cn?Se!==null?Xe?Oe&&t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,we.width,we.height,le.depth,Se,we.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,te,Te,we.width,we.height,le.depth,0,we.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?Oe&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,we.width,we.height,le.depth,Se,Ye,we.data):t.texImage3D(s.TEXTURE_2D_ARRAY,te,Te,we.width,we.height,le.depth,0,Se,Ye,we.data)}else{Xe&&dt&&t.texStorage2D(s.TEXTURE_2D,B,Te,Be[0].width,Be[0].height);for(let te=0,$=Be.length;te<$;te++)we=Be[te],T.format!==cn?Se!==null?Xe?Oe&&t.compressedTexSubImage2D(s.TEXTURE_2D,te,0,0,we.width,we.height,Se,we.data):t.compressedTexImage2D(s.TEXTURE_2D,te,Te,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?Oe&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,we.width,we.height,Se,Ye,we.data):t.texImage2D(s.TEXTURE_2D,te,Te,we.width,we.height,0,Se,Ye,we.data)}else if(T.isDataArrayTexture)Xe?(dt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,B,Te,le.width,le.height,le.depth),Oe&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,Se,Ye,le.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,Te,le.width,le.height,le.depth,0,Se,Ye,le.data);else if(T.isData3DTexture)Xe?(dt&&t.texStorage3D(s.TEXTURE_3D,B,Te,le.width,le.height,le.depth),Oe&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,Se,Ye,le.data)):t.texImage3D(s.TEXTURE_3D,0,Te,le.width,le.height,le.depth,0,Se,Ye,le.data);else if(T.isFramebufferTexture){if(dt)if(Xe)t.texStorage2D(s.TEXTURE_2D,B,Te,le.width,le.height);else{let te=le.width,$=le.height;for(let ue=0;ue<B;ue++)t.texImage2D(s.TEXTURE_2D,ue,Te,te,$,0,Se,Ye,null),te>>=1,$>>=1}}else if(Be.length>0){if(Xe&&dt){const te=lt(Be[0]);t.texStorage2D(s.TEXTURE_2D,B,Te,te.width,te.height)}for(let te=0,$=Be.length;te<$;te++)we=Be[te],Xe?Oe&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,Se,Ye,we):t.texImage2D(s.TEXTURE_2D,te,Te,Se,Ye,we);T.generateMipmaps=!1}else if(Xe){if(dt){const te=lt(le);t.texStorage2D(s.TEXTURE_2D,B,Te,te.width,te.height)}Oe&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Se,Ye,le)}else t.texImage2D(s.TEXTURE_2D,0,Te,Se,Ye,le);w(T)&&g(Q),be.__version=ae.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function $e(D,T,j){if(T.image.length!==6)return;const Q=ve(D,T),ie=T.source;t.bindTexture(s.TEXTURE_CUBE_MAP,D.__webglTexture,s.TEXTURE0+j);const ae=n.get(ie);if(ie.version!==ae.__version||Q===!0){t.activeTexture(s.TEXTURE0+j);const be=tt.getPrimaries(tt.workingColorSpace),me=T.colorSpace===An?null:tt.getPrimaries(T.colorSpace),fe=T.colorSpace===An||be===me?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);const Ue=T.isCompressedTexture||T.image[0].isCompressedTexture,le=T.image[0]&&T.image[0].isDataTexture,Se=[];for(let $=0;$<6;$++)!Ue&&!le?Se[$]=_(T.image[$],!0,i.maxCubemapSize):Se[$]=le?T.image[$].image:T.image[$],Se[$]=qe(T,Se[$]);const Ye=Se[0],Te=a.convert(T.format,T.colorSpace),we=a.convert(T.type),Be=S(T.internalFormat,Te,we,T.colorSpace),Xe=T.isVideoTexture!==!0,dt=ae.__version===void 0||Q===!0,Oe=ie.dataReady;let B=v(T,Ye);se(s.TEXTURE_CUBE_MAP,T);let te;if(Ue){Xe&&dt&&t.texStorage2D(s.TEXTURE_CUBE_MAP,B,Be,Ye.width,Ye.height);for(let $=0;$<6;$++){te=Se[$].mipmaps;for(let ue=0;ue<te.length;ue++){const ge=te[ue];T.format!==cn?Te!==null?Xe?Oe&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,0,0,ge.width,ge.height,Te,ge.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,Be,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xe?Oe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,0,0,ge.width,ge.height,Te,we,ge.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,Be,ge.width,ge.height,0,Te,we,ge.data)}}}else{if(te=T.mipmaps,Xe&&dt){te.length>0&&B++;const $=lt(Se[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,B,Be,$.width,$.height)}for(let $=0;$<6;$++)if(le){Xe?Oe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Se[$].width,Se[$].height,Te,we,Se[$].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Be,Se[$].width,Se[$].height,0,Te,we,Se[$].data);for(let ue=0;ue<te.length;ue++){const Ze=te[ue].image[$].image;Xe?Oe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,0,0,Ze.width,Ze.height,Te,we,Ze.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,Be,Ze.width,Ze.height,0,Te,we,Ze.data)}}else{Xe?Oe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Te,we,Se[$]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Be,Te,we,Se[$]);for(let ue=0;ue<te.length;ue++){const ge=te[ue];Xe?Oe&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,0,0,Te,we,ge.image[$]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,Be,Te,we,ge.image[$])}}}w(T)&&g(s.TEXTURE_CUBE_MAP),ae.__version=ie.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function K(D,T,j,Q,ie,ae){const be=a.convert(j.format,j.colorSpace),me=a.convert(j.type),fe=S(j.internalFormat,be,me,j.colorSpace);if(!n.get(T).__hasExternalTextures){const le=Math.max(1,T.width>>ae),Se=Math.max(1,T.height>>ae);ie===s.TEXTURE_3D||ie===s.TEXTURE_2D_ARRAY?t.texImage3D(ie,ae,fe,le,Se,T.depth,0,be,me,null):t.texImage2D(ie,ae,fe,le,Se,0,be,me,null)}t.bindFramebuffer(s.FRAMEBUFFER,D),Ge(T)?r.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,ie,n.get(j).__webglTexture,0,Ee(T)):(ie===s.TEXTURE_2D||ie>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Q,ie,n.get(j).__webglTexture,ae),t.bindFramebuffer(s.FRAMEBUFFER,null)}function re(D,T,j){if(s.bindRenderbuffer(s.RENDERBUFFER,D),T.depthBuffer&&!T.stencilBuffer){let Q=s.DEPTH_COMPONENT24;if(j||Ge(T)){const ie=T.depthTexture;ie&&ie.isDepthTexture&&(ie.type===Rn?Q=s.DEPTH_COMPONENT32F:ie.type===Ci&&(Q=s.DEPTH_COMPONENT24));const ae=Ee(T);Ge(T)?r.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ae,Q,T.width,T.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,ae,Q,T.width,T.height)}else s.renderbufferStorage(s.RENDERBUFFER,Q,T.width,T.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,D)}else if(T.depthBuffer&&T.stencilBuffer){const Q=Ee(T);j&&Ge(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Q,s.DEPTH24_STENCIL8,T.width,T.height):Ge(T)?r.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Q,s.DEPTH24_STENCIL8,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,D)}else{const Q=T.textures;for(let ie=0;ie<Q.length;ie++){const ae=Q[ie],be=a.convert(ae.format,ae.colorSpace),me=a.convert(ae.type),fe=S(ae.internalFormat,be,me,ae.colorSpace),Ue=Ee(T);j&&Ge(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ue,fe,T.width,T.height):Ge(T)?r.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ue,fe,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,fe,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function xe(D,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,D),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),L(T.depthTexture,0);const Q=n.get(T.depthTexture).__webglTexture,ie=Ee(T);if(T.depthTexture.format===Si)Ge(T)?r.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0);else if(T.depthTexture.format===Yi)Ge(T)?r.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0,ie):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function he(D){const T=n.get(D),j=D.isWebGLCubeRenderTarget===!0;if(D.depthTexture&&!T.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");xe(T.__webglFramebuffer,D)}else if(j){T.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[Q]),T.__webglDepthbuffer[Q]=s.createRenderbuffer(),re(T.__webglDepthbuffer[Q],D,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=s.createRenderbuffer(),re(T.__webglDepthbuffer,D,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function Fe(D,T,j){const Q=n.get(D);T!==void 0&&K(Q.__webglFramebuffer,D,D.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),j!==void 0&&he(D)}function ze(D){const T=D.texture,j=n.get(D),Q=n.get(T);D.addEventListener("dispose",I);const ie=D.textures,ae=D.isWebGLCubeRenderTarget===!0,be=ie.length>1;if(be||(Q.__webglTexture===void 0&&(Q.__webglTexture=s.createTexture()),Q.__version=T.version,o.memory.textures++),ae){j.__webglFramebuffer=[];for(let me=0;me<6;me++)if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer[me]=[];for(let fe=0;fe<T.mipmaps.length;fe++)j.__webglFramebuffer[me][fe]=s.createFramebuffer()}else j.__webglFramebuffer[me]=s.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer=[];for(let me=0;me<T.mipmaps.length;me++)j.__webglFramebuffer[me]=s.createFramebuffer()}else j.__webglFramebuffer=s.createFramebuffer();if(be)for(let me=0,fe=ie.length;me<fe;me++){const Ue=n.get(ie[me]);Ue.__webglTexture===void 0&&(Ue.__webglTexture=s.createTexture(),o.memory.textures++)}if(D.samples>0&&Ge(D)===!1){j.__webglMultisampledFramebuffer=s.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let me=0;me<ie.length;me++){const fe=ie[me];j.__webglColorRenderbuffer[me]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,j.__webglColorRenderbuffer[me]);const Ue=a.convert(fe.format,fe.colorSpace),le=a.convert(fe.type),Se=S(fe.internalFormat,Ue,le,fe.colorSpace,D.isXRRenderTarget===!0),Ye=Ee(D);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ye,Se,D.width,D.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.RENDERBUFFER,j.__webglColorRenderbuffer[me])}s.bindRenderbuffer(s.RENDERBUFFER,null),D.depthBuffer&&(j.__webglDepthRenderbuffer=s.createRenderbuffer(),re(j.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ae){t.bindTexture(s.TEXTURE_CUBE_MAP,Q.__webglTexture),se(s.TEXTURE_CUBE_MAP,T);for(let me=0;me<6;me++)if(T.mipmaps&&T.mipmaps.length>0)for(let fe=0;fe<T.mipmaps.length;fe++)K(j.__webglFramebuffer[me][fe],D,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+me,fe);else K(j.__webglFramebuffer[me],D,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);w(T)&&g(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(be){for(let me=0,fe=ie.length;me<fe;me++){const Ue=ie[me],le=n.get(Ue);t.bindTexture(s.TEXTURE_2D,le.__webglTexture),se(s.TEXTURE_2D,Ue),K(j.__webglFramebuffer,D,Ue,s.COLOR_ATTACHMENT0+me,s.TEXTURE_2D,0),w(Ue)&&g(s.TEXTURE_2D)}t.unbindTexture()}else{let me=s.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(me=D.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(me,Q.__webglTexture),se(me,T),T.mipmaps&&T.mipmaps.length>0)for(let fe=0;fe<T.mipmaps.length;fe++)K(j.__webglFramebuffer[fe],D,T,s.COLOR_ATTACHMENT0,me,fe);else K(j.__webglFramebuffer,D,T,s.COLOR_ATTACHMENT0,me,0);w(T)&&g(me),t.unbindTexture()}D.depthBuffer&&he(D)}function G(D){const T=D.textures;for(let j=0,Q=T.length;j<Q;j++){const ie=T[j];if(w(ie)){const ae=D.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,be=n.get(ie).__webglTexture;t.bindTexture(ae,be),g(ae),t.unbindTexture()}}}const je=[],Me=[];function Qe(D){if(D.samples>0){if(Ge(D)===!1){const T=D.textures,j=D.width,Q=D.height;let ie=s.COLOR_BUFFER_BIT;const ae=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,be=n.get(D),me=T.length>1;if(me)for(let fe=0;fe<T.length;fe++)t.bindFramebuffer(s.FRAMEBUFFER,be.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,be.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,be.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,be.__webglFramebuffer);for(let fe=0;fe<T.length;fe++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ie|=s.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ie|=s.STENCIL_BUFFER_BIT)),me){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,be.__webglColorRenderbuffer[fe]);const Ue=n.get(T[fe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ue,0)}s.blitFramebuffer(0,0,j,Q,0,0,j,Q,ie,s.NEAREST),c===!0&&(je.length=0,Me.length=0,je.push(s.COLOR_ATTACHMENT0+fe),D.depthBuffer&&D.resolveDepthBuffer===!1&&(je.push(ae),Me.push(ae),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Me)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,je))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),me)for(let fe=0;fe<T.length;fe++){t.bindFramebuffer(s.FRAMEBUFFER,be.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,be.__webglColorRenderbuffer[fe]);const Ue=n.get(T[fe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,be.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,Ue,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,be.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const T=D.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function Ee(D){return Math.min(i.maxSamples,D.samples)}function Ge(D){const T=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function De(D){const T=o.render.frame;d.get(D)!==T&&(d.set(D,T),D.update())}function qe(D,T){const j=D.colorSpace,Q=D.format,ie=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||j!==Bn&&j!==An&&(tt.getTransfer(j)===it?(Q!==cn||ie!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),T}function lt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(h.width=D.naturalWidth||D.width,h.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(h.width=D.displayWidth,h.height=D.displayHeight):(h.width=D.width,h.height=D.height),h}this.allocateTextureUnit=U,this.resetTextureUnits=M,this.setTexture2D=L,this.setTexture2DArray=H,this.setTexture3D=q,this.setTextureCube=ee,this.rebindTextures=Fe,this.setupRenderTarget=ze,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=Qe,this.setupDepthRenderbuffer=he,this.setupFrameBufferTexture=K,this.useMultisampledRTT=Ge}function jp(s,e){function t(n,i=An){let a;const o=tt.getTransfer(i);if(n===Nn)return s.UNSIGNED_BYTE;if(n===tc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===nc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Ll)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Il)return s.BYTE;if(n===Dl)return s.SHORT;if(n===Qr)return s.UNSIGNED_SHORT;if(n===ec)return s.INT;if(n===Ci)return s.UNSIGNED_INT;if(n===Rn)return s.FLOAT;if(n===Ya)return s.HALF_FLOAT;if(n===kl)return s.ALPHA;if(n===Nl)return s.RGB;if(n===cn)return s.RGBA;if(n===Ul)return s.LUMINANCE;if(n===Bl)return s.LUMINANCE_ALPHA;if(n===Si)return s.DEPTH_COMPONENT;if(n===Yi)return s.DEPTH_STENCIL;if(n===Ol)return s.RED;if(n===ic)return s.RED_INTEGER;if(n===Fl)return s.RG;if(n===ac)return s.RG_INTEGER;if(n===sc)return s.RGBA_INTEGER;if(n===is||n===as||n===ss||n===os)if(o===it)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===is)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===as)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ss)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===os)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===is)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===as)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ss)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===os)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===yo||n===Mo||n===So||n===bo)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===yo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Mo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===So)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===bo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Eo||n===To||n===Ao)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Eo||n===To)return o===it?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Ao)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ro||n===Co||n===Po||n===Io||n===Do||n===Lo||n===ko||n===No||n===Uo||n===Bo||n===Oo||n===Fo||n===zo||n===Go)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===Ro)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Co)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Po)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Io)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Do)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Lo)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ko)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===No)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Uo)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bo)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Oo)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fo)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===zo)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Go)return o===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rs||n===Ho||n===Vo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===rs)return o===it?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ho)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Vo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===zl||n===Wo||n===Xo||n===qo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===rs)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Wo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===qo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Zi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class Kp extends Ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class z extends yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $p={type:"move"};class Ls{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new z,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new z,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new z,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,a=null,o=null;const r=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){o=!0;for(const _ of e.hand.values()){const w=t.getJointPose(_,n),g=this._getHandJoint(h,_);w!==null&&(g.matrix.fromArray(w.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=w.radius),g.visible=w!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],p=d.position.distanceTo(u.position),m=.02,x=.005;h.inputState.pinching&&p>m+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=m-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&a!==null&&(i=a),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent($p)))}return r!==null&&(r.visible=i!==null),c!==null&&(c.visible=a!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new z;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Jp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class ef{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new kt,a=e.properties.get(i);a.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}render(e,t){if(this.texture!==null){if(this.mesh===null){const n=t.cameras[0].viewport,i=new Un({vertexShader:Jp,fragmentShader:Qp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new l(new St(20,20),i)}e.render(this.mesh,t)}}reset(){this.texture=null,this.mesh=null}}class tf extends Ii{constructor(e,t){super();const n=this;let i=null,a=1,o=null,r="local-floor",c=1,h=null,d=null,u=null,p=null,m=null,x=null;const _=new ef,w=t.getContextAttributes();let g=null,S=null;const v=[],E=[],I=new Re;let C=null;const P=new Ft;P.layers.enable(1),P.viewport=new ct;const k=new Ft;k.layers.enable(2),k.viewport=new ct;const b=[P,k],M=new Kp;M.layers.enable(1),M.layers.enable(2);let U=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let re=v[K];return re===void 0&&(re=new Ls,v[K]=re),re.getTargetRaySpace()},this.getControllerGrip=function(K){let re=v[K];return re===void 0&&(re=new Ls,v[K]=re),re.getGripSpace()},this.getHand=function(K){let re=v[K];return re===void 0&&(re=new Ls,v[K]=re),re.getHandSpace()};function L(K){const re=E.indexOf(K.inputSource);if(re===-1)return;const xe=v[re];xe!==void 0&&(xe.update(K.inputSource,K.frame,h||o),xe.dispatchEvent({type:K.type,data:K.inputSource}))}function H(){i.removeEventListener("select",L),i.removeEventListener("selectstart",L),i.removeEventListener("selectend",L),i.removeEventListener("squeeze",L),i.removeEventListener("squeezestart",L),i.removeEventListener("squeezeend",L),i.removeEventListener("end",H),i.removeEventListener("inputsourceschange",q);for(let K=0;K<v.length;K++){const re=E[K];re!==null&&(E[K]=null,v[K].disconnect(re))}U=null,O=null,_.reset(),e.setRenderTarget(g),m=null,p=null,u=null,i=null,S=null,$e.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(K){h=K},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return u},this.getFrame=function(){return x},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(g=e.getRenderTarget(),i.addEventListener("select",L),i.addEventListener("selectstart",L),i.addEventListener("selectend",L),i.addEventListener("squeeze",L),i.addEventListener("squeezestart",L),i.addEventListener("squeezeend",L),i.addEventListener("end",H),i.addEventListener("inputsourceschange",q),w.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(I),i.renderState.layers===void 0){const re={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new Qn(m.framebufferWidth,m.framebufferHeight,{format:cn,type:Nn,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil})}else{let re=null,xe=null,he=null;w.depth&&(he=w.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=w.stencil?Yi:Si,xe=w.stencil?Zi:Ci);const Fe={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:a};u=new XRWebGLBinding(i,t),p=u.createProjectionLayer(Fe),i.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),S=new Qn(p.textureWidth,p.textureHeight,{format:cn,type:Nn,depthTexture:new _c(p.textureWidth,p.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await i.requestReferenceSpace(r),$e.setContext(i),$e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function q(K){for(let re=0;re<K.removed.length;re++){const xe=K.removed[re],he=E.indexOf(xe);he>=0&&(E[he]=null,v[he].disconnect(xe))}for(let re=0;re<K.added.length;re++){const xe=K.added[re];let he=E.indexOf(xe);if(he===-1){for(let ze=0;ze<v.length;ze++)if(ze>=E.length){E.push(xe),he=ze;break}else if(E[ze]===null){E[ze]=xe,he=ze;break}if(he===-1)break}const Fe=v[he];Fe&&Fe.connect(xe)}}const ee=new N,ne=new N;function Y(K,re,xe){ee.setFromMatrixPosition(re.matrixWorld),ne.setFromMatrixPosition(xe.matrixWorld);const he=ee.distanceTo(ne),Fe=re.projectionMatrix.elements,ze=xe.projectionMatrix.elements,G=Fe[14]/(Fe[10]-1),je=Fe[14]/(Fe[10]+1),Me=(Fe[9]+1)/Fe[5],Qe=(Fe[9]-1)/Fe[5],Ee=(Fe[8]-1)/Fe[0],Ge=(ze[8]+1)/ze[0],De=G*Ee,qe=G*Ge,lt=he/(-Ee+Ge),D=lt*-Ee;re.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(D),K.translateZ(lt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert();const T=G+lt,j=je+lt,Q=De-D,ie=qe+(he-D),ae=Me*je/j*T,be=Qe*je/j*T;K.projectionMatrix.makePerspective(Q,ie,ae,be,T,j),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}function oe(K,re){re===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(re.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;_.texture!==null&&(K.near=_.depthNear,K.far=_.depthFar),M.near=k.near=P.near=K.near,M.far=k.far=P.far=K.far,(U!==M.near||O!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),U=M.near,O=M.far,P.near=U,P.far=O,k.near=U,k.far=O,P.updateProjectionMatrix(),k.updateProjectionMatrix(),K.updateProjectionMatrix());const re=K.parent,xe=M.cameras;oe(M,re);for(let he=0;he<xe.length;he++)oe(xe[he],re);xe.length===2?Y(M,P,k):M.projectionMatrix.copy(P.projectionMatrix),se(K,M,re)};function se(K,re,xe){xe===null?K.matrix.copy(re.matrixWorld):(K.matrix.copy(xe.matrixWorld),K.matrix.invert(),K.matrix.multiply(re.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=qs*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function(K){c=K,p!==null&&(p.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return _.texture!==null};let ve=null;function Ve(K,re){if(d=re.getViewerPose(h||o),x=re,d!==null){const xe=d.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let he=!1;xe.length!==M.cameras.length&&(M.cameras.length=0,he=!0);for(let ze=0;ze<xe.length;ze++){const G=xe[ze];let je=null;if(m!==null)je=m.getViewport(G);else{const Qe=u.getViewSubImage(p,G);je=Qe.viewport,ze===0&&(e.setRenderTargetTextures(S,Qe.colorTexture,p.ignoreDepthValues?void 0:Qe.depthStencilTexture),e.setRenderTarget(S))}let Me=b[ze];Me===void 0&&(Me=new Ft,Me.layers.enable(ze),Me.viewport=new ct,b[ze]=Me),Me.matrix.fromArray(G.transform.matrix),Me.matrix.decompose(Me.position,Me.quaternion,Me.scale),Me.projectionMatrix.fromArray(G.projectionMatrix),Me.projectionMatrixInverse.copy(Me.projectionMatrix).invert(),Me.viewport.set(je.x,je.y,je.width,je.height),ze===0&&(M.matrix.copy(Me.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),he===!0&&M.cameras.push(Me)}const Fe=i.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")){const ze=u.getDepthInformation(xe[0]);ze&&ze.isValid&&ze.texture&&_.init(e,ze,i.renderState)}}for(let xe=0;xe<v.length;xe++){const he=E[xe],Fe=v[xe];he!==null&&Fe!==void 0&&Fe.update(he,re,h||o)}_.render(e,M),ve&&ve(K,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),x=null}const $e=new wc;$e.setAnimationLoop(Ve),this.setAnimationLoop=function(K){ve=K},this.dispose=function(){}}}const Wn=new Wt,nf=new st;function af(s,e){function t(w,g){w.matrixAutoUpdate===!0&&w.updateMatrix(),g.value.copy(w.matrix)}function n(w,g){g.color.getRGB(w.fogColor.value,fc(s)),g.isFog?(w.fogNear.value=g.near,w.fogFar.value=g.far):g.isFogExp2&&(w.fogDensity.value=g.density)}function i(w,g,S,v,E){g.isMeshBasicMaterial||g.isMeshLambertMaterial?a(w,g):g.isMeshToonMaterial?(a(w,g),u(w,g)):g.isMeshPhongMaterial?(a(w,g),d(w,g)):g.isMeshStandardMaterial?(a(w,g),p(w,g),g.isMeshPhysicalMaterial&&m(w,g,E)):g.isMeshMatcapMaterial?(a(w,g),x(w,g)):g.isMeshDepthMaterial?a(w,g):g.isMeshDistanceMaterial?(a(w,g),_(w,g)):g.isMeshNormalMaterial?a(w,g):g.isLineBasicMaterial?(o(w,g),g.isLineDashedMaterial&&r(w,g)):g.isPointsMaterial?c(w,g,S,v):g.isSpriteMaterial?h(w,g):g.isShadowMaterial?(w.color.value.copy(g.color),w.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function a(w,g){w.opacity.value=g.opacity,g.color&&w.diffuse.value.copy(g.color),g.emissive&&w.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(w.map.value=g.map,t(g.map,w.mapTransform)),g.alphaMap&&(w.alphaMap.value=g.alphaMap,t(g.alphaMap,w.alphaMapTransform)),g.bumpMap&&(w.bumpMap.value=g.bumpMap,t(g.bumpMap,w.bumpMapTransform),w.bumpScale.value=g.bumpScale,g.side===zt&&(w.bumpScale.value*=-1)),g.normalMap&&(w.normalMap.value=g.normalMap,t(g.normalMap,w.normalMapTransform),w.normalScale.value.copy(g.normalScale),g.side===zt&&w.normalScale.value.negate()),g.displacementMap&&(w.displacementMap.value=g.displacementMap,t(g.displacementMap,w.displacementMapTransform),w.displacementScale.value=g.displacementScale,w.displacementBias.value=g.displacementBias),g.emissiveMap&&(w.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,w.emissiveMapTransform)),g.specularMap&&(w.specularMap.value=g.specularMap,t(g.specularMap,w.specularMapTransform)),g.alphaTest>0&&(w.alphaTest.value=g.alphaTest);const S=e.get(g),v=S.envMap,E=S.envMapRotation;if(v&&(w.envMap.value=v,Wn.copy(E),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),w.envMapRotation.value.setFromMatrix4(nf.makeRotationFromEuler(Wn)),w.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,w.reflectivity.value=g.reflectivity,w.ior.value=g.ior,w.refractionRatio.value=g.refractionRatio),g.lightMap){w.lightMap.value=g.lightMap;const I=s._useLegacyLights===!0?Math.PI:1;w.lightMapIntensity.value=g.lightMapIntensity*I,t(g.lightMap,w.lightMapTransform)}g.aoMap&&(w.aoMap.value=g.aoMap,w.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,w.aoMapTransform))}function o(w,g){w.diffuse.value.copy(g.color),w.opacity.value=g.opacity,g.map&&(w.map.value=g.map,t(g.map,w.mapTransform))}function r(w,g){w.dashSize.value=g.dashSize,w.totalSize.value=g.dashSize+g.gapSize,w.scale.value=g.scale}function c(w,g,S,v){w.diffuse.value.copy(g.color),w.opacity.value=g.opacity,w.size.value=g.size*S,w.scale.value=v*.5,g.map&&(w.map.value=g.map,t(g.map,w.uvTransform)),g.alphaMap&&(w.alphaMap.value=g.alphaMap,t(g.alphaMap,w.alphaMapTransform)),g.alphaTest>0&&(w.alphaTest.value=g.alphaTest)}function h(w,g){w.diffuse.value.copy(g.color),w.opacity.value=g.opacity,w.rotation.value=g.rotation,g.map&&(w.map.value=g.map,t(g.map,w.mapTransform)),g.alphaMap&&(w.alphaMap.value=g.alphaMap,t(g.alphaMap,w.alphaMapTransform)),g.alphaTest>0&&(w.alphaTest.value=g.alphaTest)}function d(w,g){w.specular.value.copy(g.specular),w.shininess.value=Math.max(g.shininess,1e-4)}function u(w,g){g.gradientMap&&(w.gradientMap.value=g.gradientMap)}function p(w,g){w.metalness.value=g.metalness,g.metalnessMap&&(w.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,w.metalnessMapTransform)),w.roughness.value=g.roughness,g.roughnessMap&&(w.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,w.roughnessMapTransform)),g.envMap&&(w.envMapIntensity.value=g.envMapIntensity)}function m(w,g,S){w.ior.value=g.ior,g.sheen>0&&(w.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),w.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(w.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,w.sheenColorMapTransform)),g.sheenRoughnessMap&&(w.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,w.sheenRoughnessMapTransform))),g.clearcoat>0&&(w.clearcoat.value=g.clearcoat,w.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(w.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,w.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(w.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,w.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(w.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,w.clearcoatNormalMapTransform),w.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===zt&&w.clearcoatNormalScale.value.negate())),g.dispersion>0&&(w.dispersion.value=g.dispersion),g.iridescence>0&&(w.iridescence.value=g.iridescence,w.iridescenceIOR.value=g.iridescenceIOR,w.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],w.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(w.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,w.iridescenceMapTransform)),g.iridescenceThicknessMap&&(w.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,w.iridescenceThicknessMapTransform))),g.transmission>0&&(w.transmission.value=g.transmission,w.transmissionSamplerMap.value=S.texture,w.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(w.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,w.transmissionMapTransform)),w.thickness.value=g.thickness,g.thicknessMap&&(w.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,w.thicknessMapTransform)),w.attenuationDistance.value=g.attenuationDistance,w.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(w.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(w.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,w.anisotropyMapTransform))),w.specularIntensity.value=g.specularIntensity,w.specularColor.value.copy(g.specularColor),g.specularColorMap&&(w.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,w.specularColorMapTransform)),g.specularIntensityMap&&(w.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,w.specularIntensityMapTransform))}function x(w,g){g.matcap&&(w.matcap.value=g.matcap)}function _(w,g){const S=e.get(g).light;w.referencePosition.value.setFromMatrixPosition(S.matrixWorld),w.nearDistance.value=S.shadow.camera.near,w.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function sf(s,e,t,n){let i={},a={},o=[];const r=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,v){const E=v.program;n.uniformBlockBinding(S,E)}function h(S,v){let E=i[S.id];E===void 0&&(x(S),E=d(S),i[S.id]=E,S.addEventListener("dispose",w));const I=v.program;n.updateUBOMapping(S,I);const C=e.render.frame;a[S.id]!==C&&(p(S),a[S.id]=C)}function d(S){const v=u();S.__bindingPointIndex=v;const E=s.createBuffer(),I=S.__size,C=S.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,I,C),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,E),E}function u(){for(let S=0;S<r;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(S){const v=i[S.id],E=S.uniforms,I=S.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let C=0,P=E.length;C<P;C++){const k=Array.isArray(E[C])?E[C]:[E[C]];for(let b=0,M=k.length;b<M;b++){const U=k[b];if(m(U,C,b,I)===!0){const O=U.__offset,L=Array.isArray(U.value)?U.value:[U.value];let H=0;for(let q=0;q<L.length;q++){const ee=L[q],ne=_(ee);typeof ee=="number"||typeof ee=="boolean"?(U.__data[0]=ee,s.bufferSubData(s.UNIFORM_BUFFER,O+H,U.__data)):ee.isMatrix3?(U.__data[0]=ee.elements[0],U.__data[1]=ee.elements[1],U.__data[2]=ee.elements[2],U.__data[3]=0,U.__data[4]=ee.elements[3],U.__data[5]=ee.elements[4],U.__data[6]=ee.elements[5],U.__data[7]=0,U.__data[8]=ee.elements[6],U.__data[9]=ee.elements[7],U.__data[10]=ee.elements[8],U.__data[11]=0):(ee.toArray(U.__data,H),H+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,O,U.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(S,v,E,I){const C=S.value,P=v+"_"+E;if(I[P]===void 0)return typeof C=="number"||typeof C=="boolean"?I[P]=C:I[P]=C.clone(),!0;{const k=I[P];if(typeof C=="number"||typeof C=="boolean"){if(k!==C)return I[P]=C,!0}else if(k.equals(C)===!1)return k.copy(C),!0}return!1}function x(S){const v=S.uniforms;let E=0;const I=16;for(let P=0,k=v.length;P<k;P++){const b=Array.isArray(v[P])?v[P]:[v[P]];for(let M=0,U=b.length;M<U;M++){const O=b[M],L=Array.isArray(O.value)?O.value:[O.value];for(let H=0,q=L.length;H<q;H++){const ee=L[H],ne=_(ee),Y=E%I;Y!==0&&I-Y<ne.boundary&&(E+=I-Y),O.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=E,E+=ne.storage}}}const C=E%I;return C>0&&(E+=I-C),S.__size=E,S.__cache={},this}function _(S){const v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),v}function w(S){const v=S.target;v.removeEventListener("dispose",w);const E=o.indexOf(v.__bindingPointIndex);o.splice(E,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete a[v.id]}function g(){for(const S in i)s.deleteBuffer(i[S]);o=[],i={},a={}}return{bind:c,update:h,dispose:g}}class Ec{constructor(e={}){const{canvas:t=Jl(),context:n=null,depth:i=!0,stencil:a=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const m=new Uint32Array(4),x=new Int32Array(4);let _=null,w=null;const g=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=sn,this._useLegacyLights=!1,this.toneMapping=In,this.toneMappingExposure=1;const v=this;let E=!1,I=0,C=0,P=null,k=-1,b=null;const M=new ct,U=new ct;let O=null;const L=new Ce(0);let H=0,q=t.width,ee=t.height,ne=1,Y=null,oe=null;const se=new ct(0,0,q,ee),ve=new ct(0,0,q,ee);let Ve=!1;const $e=new to;let K=!1,re=!1;const xe=new st,he=new N,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ze(){return P===null?ne:1}let G=n;function je(R,F){return t.getContext(R,F)}try{const R={alpha:!0,depth:i,stencil:a,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${$s}`),t.addEventListener("webglcontextlost",B,!1),t.addEventListener("webglcontextrestored",te,!1),t.addEventListener("webglcontextcreationerror",$,!1),G===null){const F="webgl2";if(G=je(F,R),G===null)throw je(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Me,Qe,Ee,Ge,De,qe,lt,D,T,j,Q,ie,ae,be,me,fe,Ue,le,Se,Ye,Te,we,Be,Xe;function dt(){Me=new pu(G),Me.init(),we=new jp(G,Me),Qe=new ru(G,Me,e,we),Ee=new Yp(G),Ge=new gu(G),De=new Lp,qe=new Zp(G,Me,Ee,De,Qe,we,Ge),lt=new lu(v),D=new uu(v),T=new Sh(G),Be=new su(G,T),j=new fu(G,T,Ge,Be),Q=new xu(G,j,T,Ge),Se=new wu(G,Qe,qe),fe=new cu(De),ie=new Dp(v,lt,D,Me,Qe,Be,fe),ae=new af(v,De),be=new Np,me=new Gp(Me),le=new au(v,lt,D,Ee,Q,p,c),Ue=new qp(v,Q,Qe),Xe=new sf(G,Ge,Qe,Ee),Ye=new ou(G,Me,Ge),Te=new mu(G,Me,Ge),Ge.programs=ie.programs,v.capabilities=Qe,v.extensions=Me,v.properties=De,v.renderLists=be,v.shadowMap=Ue,v.state=Ee,v.info=Ge}dt();const Oe=new tf(v,G);this.xr=Oe,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const R=Me.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Me.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(R){R!==void 0&&(ne=R,this.setSize(q,ee,!1))},this.getSize=function(R){return R.set(q,ee)},this.setSize=function(R,F,X=!0){if(Oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=R,ee=F,t.width=Math.floor(R*ne),t.height=Math.floor(F*ne),X===!0&&(t.style.width=R+"px",t.style.height=F+"px"),this.setViewport(0,0,R,F)},this.getDrawingBufferSize=function(R){return R.set(q*ne,ee*ne).floor()},this.setDrawingBufferSize=function(R,F,X){q=R,ee=F,ne=X,t.width=Math.floor(R*X),t.height=Math.floor(F*X),this.setViewport(0,0,R,F)},this.getCurrentViewport=function(R){return R.copy(M)},this.getViewport=function(R){return R.copy(se)},this.setViewport=function(R,F,X,V){R.isVector4?se.set(R.x,R.y,R.z,R.w):se.set(R,F,X,V),Ee.viewport(M.copy(se).multiplyScalar(ne).round())},this.getScissor=function(R){return R.copy(ve)},this.setScissor=function(R,F,X,V){R.isVector4?ve.set(R.x,R.y,R.z,R.w):ve.set(R,F,X,V),Ee.scissor(U.copy(ve).multiplyScalar(ne).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(R){Ee.setScissorTest(Ve=R)},this.setOpaqueSort=function(R){Y=R},this.setTransparentSort=function(R){oe=R},this.getClearColor=function(R){return R.copy(le.getClearColor())},this.setClearColor=function(){le.setClearColor.apply(le,arguments)},this.getClearAlpha=function(){return le.getClearAlpha()},this.setClearAlpha=function(){le.setClearAlpha.apply(le,arguments)},this.clear=function(R=!0,F=!0,X=!0){let V=0;if(R){let W=!1;if(P!==null){const pe=P.texture.format;W=pe===sc||pe===ac||pe===ic}if(W){const pe=P.texture.type,_e=pe===Nn||pe===Ci||pe===Qr||pe===Zi||pe===tc||pe===nc,ye=le.getClearColor(),Ae=le.getClearAlpha(),Pe=ye.r,Le=ye.g,He=ye.b;_e?(m[0]=Pe,m[1]=Le,m[2]=He,m[3]=Ae,G.clearBufferuiv(G.COLOR,0,m)):(x[0]=Pe,x[1]=Le,x[2]=He,x[3]=Ae,G.clearBufferiv(G.COLOR,0,x))}else V|=G.COLOR_BUFFER_BIT}F&&(V|=G.DEPTH_BUFFER_BIT),X&&(V|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",B,!1),t.removeEventListener("webglcontextrestored",te,!1),t.removeEventListener("webglcontextcreationerror",$,!1),be.dispose(),me.dispose(),De.dispose(),lt.dispose(),D.dispose(),Q.dispose(),Be.dispose(),Xe.dispose(),ie.dispose(),Oe.dispose(),Oe.removeEventListener("sessionstart",Je),Oe.removeEventListener("sessionend",an),Ct.stop()};function B(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function te(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const R=Ge.autoReset,F=Ue.enabled,X=Ue.autoUpdate,V=Ue.needsUpdate,W=Ue.type;dt(),Ge.autoReset=R,Ue.enabled=F,Ue.autoUpdate=X,Ue.needsUpdate=V,Ue.type=W}function $(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ue(R){const F=R.target;F.removeEventListener("dispose",ue),ge(F)}function ge(R){Ze(R),De.remove(R)}function Ze(R){const F=De.get(R).programs;F!==void 0&&(F.forEach(function(X){ie.releaseProgram(X)}),R.isShaderMaterial&&ie.releaseShaderCache(R))}this.renderBufferDirect=function(R,F,X,V,W,pe){F===null&&(F=Fe);const _e=W.isMesh&&W.matrixWorld.determinant()<0,ye=Bc(R,F,X,V,W);Ee.setMaterial(V,_e);let Ae=X.index,Pe=1;if(V.wireframe===!0){if(Ae=j.getWireframeAttribute(X),Ae===void 0)return;Pe=2}const Le=X.drawRange,He=X.attributes.position;let ut=Le.start*Pe,Et=(Le.start+Le.count)*Pe;pe!==null&&(ut=Math.max(ut,pe.start*Pe),Et=Math.min(Et,(pe.start+pe.count)*Pe)),Ae!==null?(ut=Math.max(ut,0),Et=Math.min(Et,Ae.count)):He!=null&&(ut=Math.max(ut,0),Et=Math.min(Et,He.count));const Gt=Et-ut;if(Gt<0||Gt===1/0)return;Be.setup(W,V,ye,X,Ae);let ln,Ke=Ye;if(Ae!==null&&(ln=T.get(Ae),Ke=Te,Ke.setIndex(ln)),W.isMesh)V.wireframe===!0?(Ee.setLineWidth(V.wireframeLinewidth*ze()),Ke.setMode(G.LINES)):Ke.setMode(G.TRIANGLES);else if(W.isLine){let Ie=V.linewidth;Ie===void 0&&(Ie=1),Ee.setLineWidth(Ie*ze()),W.isLineSegments?Ke.setMode(G.LINES):W.isLineLoop?Ke.setMode(G.LINE_LOOP):Ke.setMode(G.LINE_STRIP)}else W.isPoints?Ke.setMode(G.POINTS):W.isSprite&&Ke.setMode(G.TRIANGLES);if(W.isBatchedMesh)W._multiDrawInstances!==null?Ke.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances):Ke.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else if(W.isInstancedMesh)Ke.renderInstances(ut,Gt,W.count);else if(X.isInstancedBufferGeometry){const Ie=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,ki=Math.min(X.instanceCount,Ie);Ke.renderInstances(ut,Gt,ki)}else Ke.render(ut,Gt)};function nt(R,F,X){R.transparent===!0&&R.side===Lt&&R.forceSinglePass===!1?(R.side=zt,R.needsUpdate=!0,Ji(R,F,X),R.side=kn,R.needsUpdate=!0,Ji(R,F,X),R.side=Lt):Ji(R,F,X)}this.compile=function(R,F,X=null){X===null&&(X=R),w=me.get(X),w.init(F),S.push(w),X.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),R!==X&&R.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights(v._useLegacyLights);const V=new Set;return R.traverse(function(W){const pe=W.material;if(pe)if(Array.isArray(pe))for(let _e=0;_e<pe.length;_e++){const ye=pe[_e];nt(ye,X,W),V.add(ye)}else nt(pe,X,W),V.add(pe)}),S.pop(),w=null,V},this.compileAsync=function(R,F,X=null){const V=this.compile(R,F,X);return new Promise(W=>{function pe(){if(V.forEach(function(_e){De.get(_e).currentProgram.isReady()&&V.delete(_e)}),V.size===0){W(R);return}setTimeout(pe,10)}Me.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let ht=null;function bt(R){ht&&ht(R)}function Je(){Ct.stop()}function an(){Ct.start()}const Ct=new wc;Ct.setAnimationLoop(bt),typeof self<"u"&&Ct.setContext(self),this.setAnimationLoop=function(R){ht=R,Oe.setAnimationLoop(R),R===null?Ct.stop():Ct.start()},Oe.addEventListener("sessionstart",Je),Oe.addEventListener("sessionend",an),this.render=function(R,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Oe.enabled===!0&&Oe.isPresenting===!0&&(Oe.cameraAutoUpdate===!0&&Oe.updateCamera(F),F=Oe.getCamera()),R.isScene===!0&&R.onBeforeRender(v,R,F,P),w=me.get(R,S.length),w.init(F),S.push(w),xe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$e.setFromProjectionMatrix(xe),re=this.localClippingEnabled,K=fe.init(this.clippingPlanes,re),_=be.get(R,g.length),_.init(),g.push(_),ro(R,F,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(Y,oe);const X=Oe.enabled===!1||Oe.isPresenting===!1||Oe.hasDepthSensing()===!1;X&&le.addToRenderList(_,R),this.info.render.frame++,K===!0&&fe.beginShadows();const V=w.state.shadowsArray;Ue.render(V,R,F),K===!0&&fe.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=_.opaque,pe=_.transmissive;if(w.setupLights(v._useLegacyLights),F.isArrayCamera){const _e=F.cameras;if(pe.length>0)for(let ye=0,Ae=_e.length;ye<Ae;ye++){const Pe=_e[ye];lo(W,pe,R,Pe)}X&&le.render(R);for(let ye=0,Ae=_e.length;ye<Ae;ye++){const Pe=_e[ye];co(_,R,Pe,Pe.viewport)}}else pe.length>0&&lo(W,pe,R,F),X&&le.render(R),co(_,R,F);P!==null&&(qe.updateMultisampleRenderTarget(P),qe.updateRenderTargetMipmap(P)),R.isScene===!0&&R.onAfterRender(v,R,F),Be.resetDefaultState(),k=-1,b=null,S.pop(),S.length>0?(w=S[S.length-1],K===!0&&fe.setGlobalState(v.clippingPlanes,w.state.camera)):w=null,g.pop(),g.length>0?_=g[g.length-1]:_=null};function ro(R,F,X,V){if(R.visible===!1)return;if(R.layers.test(F.layers)){if(R.isGroup)X=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(F);else if(R.isLight)w.pushLight(R),R.castShadow&&w.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||$e.intersectsSprite(R)){V&&he.setFromMatrixPosition(R.matrixWorld).applyMatrix4(xe);const _e=Q.update(R),ye=R.material;ye.visible&&_.push(R,_e,ye,X,he.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||$e.intersectsObject(R))){const _e=Q.update(R),ye=R.material;if(V&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),he.copy(R.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),he.copy(_e.boundingSphere.center)),he.applyMatrix4(R.matrixWorld).applyMatrix4(xe)),Array.isArray(ye)){const Ae=_e.groups;for(let Pe=0,Le=Ae.length;Pe<Le;Pe++){const He=Ae[Pe],ut=ye[He.materialIndex];ut&&ut.visible&&_.push(R,_e,ut,X,he.z,He)}}else ye.visible&&_.push(R,_e,ye,X,he.z,null)}}const pe=R.children;for(let _e=0,ye=pe.length;_e<ye;_e++)ro(pe[_e],F,X,V)}function co(R,F,X,V){const W=R.opaque,pe=R.transmissive,_e=R.transparent;w.setupLightsView(X),K===!0&&fe.setGlobalState(v.clippingPlanes,X),V&&Ee.viewport(M.copy(V)),W.length>0&&$i(W,F,X),pe.length>0&&$i(pe,F,X),_e.length>0&&$i(_e,F,X),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function lo(R,F,X,V){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;w.state.transmissionRenderTarget[V.id]===void 0&&(w.state.transmissionRenderTarget[V.id]=new Qn(1,1,{generateMipmaps:!0,type:Me.has("EXT_color_buffer_half_float")||Me.has("EXT_color_buffer_float")?Ya:Nn,minFilter:$n,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1}));const pe=w.state.transmissionRenderTarget[V.id],_e=V.viewport||M;pe.setSize(_e.z,_e.w);const ye=v.getRenderTarget();v.setRenderTarget(pe),v.getClearColor(L),H=v.getClearAlpha(),H<1&&v.setClearColor(16777215,.5),v.clear();const Ae=v.toneMapping;v.toneMapping=In;const Pe=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),w.setupLightsView(V),K===!0&&fe.setGlobalState(v.clippingPlanes,V),$i(R,X,V),qe.updateMultisampleRenderTarget(pe),qe.updateRenderTargetMipmap(pe),Me.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let He=0,ut=F.length;He<ut;He++){const Et=F[He],Gt=Et.object,ln=Et.geometry,Ke=Et.material,Ie=Et.group;if(Ke.side===Lt&&Gt.layers.test(V.layers)){const ki=Ke.side;Ke.side=zt,Ke.needsUpdate=!0,ho(Gt,X,V,ln,Ke,Ie),Ke.side=ki,Ke.needsUpdate=!0,Le=!0}}Le===!0&&(qe.updateMultisampleRenderTarget(pe),qe.updateRenderTargetMipmap(pe))}v.setRenderTarget(ye),v.setClearColor(L,H),Pe!==void 0&&(V.viewport=Pe),v.toneMapping=Ae}function $i(R,F,X){const V=F.isScene===!0?F.overrideMaterial:null;for(let W=0,pe=R.length;W<pe;W++){const _e=R[W],ye=_e.object,Ae=_e.geometry,Pe=V===null?_e.material:V,Le=_e.group;ye.layers.test(X.layers)&&ho(ye,F,X,Ae,Pe,Le)}}function ho(R,F,X,V,W,pe){R.onBeforeRender(v,F,X,V,W,pe),R.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),W.onBeforeRender(v,F,X,V,R,pe),W.transparent===!0&&W.side===Lt&&W.forceSinglePass===!1?(W.side=zt,W.needsUpdate=!0,v.renderBufferDirect(X,F,V,W,R,pe),W.side=kn,W.needsUpdate=!0,v.renderBufferDirect(X,F,V,W,R,pe),W.side=Lt):v.renderBufferDirect(X,F,V,W,R,pe),R.onAfterRender(v,F,X,V,W,pe)}function Ji(R,F,X){F.isScene!==!0&&(F=Fe);const V=De.get(R),W=w.state.lights,pe=w.state.shadowsArray,_e=W.state.version,ye=ie.getParameters(R,W.state,pe,F,X),Ae=ie.getProgramCacheKey(ye);let Pe=V.programs;V.environment=R.isMeshStandardMaterial?F.environment:null,V.fog=F.fog,V.envMap=(R.isMeshStandardMaterial?D:lt).get(R.envMap||V.environment),V.envMapRotation=V.environment!==null&&R.envMap===null?F.environmentRotation:R.envMapRotation,Pe===void 0&&(R.addEventListener("dispose",ue),Pe=new Map,V.programs=Pe);let Le=Pe.get(Ae);if(Le!==void 0){if(V.currentProgram===Le&&V.lightsStateVersion===_e)return po(R,ye),Le}else ye.uniforms=ie.getUniforms(R),R.onBuild(X,ye,v),R.onBeforeCompile(ye,v),Le=ie.acquireProgram(ye,Ae),Pe.set(Ae,Le),V.uniforms=ye.uniforms;const He=V.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(He.clippingPlanes=fe.uniform),po(R,ye),V.needsLights=Fc(R),V.lightsStateVersion=_e,V.needsLights&&(He.ambientLightColor.value=W.state.ambient,He.lightProbe.value=W.state.probe,He.directionalLights.value=W.state.directional,He.directionalLightShadows.value=W.state.directionalShadow,He.spotLights.value=W.state.spot,He.spotLightShadows.value=W.state.spotShadow,He.rectAreaLights.value=W.state.rectArea,He.ltc_1.value=W.state.rectAreaLTC1,He.ltc_2.value=W.state.rectAreaLTC2,He.pointLights.value=W.state.point,He.pointLightShadows.value=W.state.pointShadow,He.hemisphereLights.value=W.state.hemi,He.directionalShadowMap.value=W.state.directionalShadowMap,He.directionalShadowMatrix.value=W.state.directionalShadowMatrix,He.spotShadowMap.value=W.state.spotShadowMap,He.spotLightMatrix.value=W.state.spotLightMatrix,He.spotLightMap.value=W.state.spotLightMap,He.pointShadowMap.value=W.state.pointShadowMap,He.pointShadowMatrix.value=W.state.pointShadowMatrix),V.currentProgram=Le,V.uniformsList=null,Le}function uo(R){if(R.uniformsList===null){const F=R.currentProgram.getUniforms();R.uniformsList=Pa.seqWithValue(F.seq,R.uniforms)}return R.uniformsList}function po(R,F){const X=De.get(R);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function Bc(R,F,X,V,W){F.isScene!==!0&&(F=Fe),qe.resetTextureUnits();const pe=F.fog,_e=V.isMeshStandardMaterial?F.environment:null,ye=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Bn,Ae=(V.isMeshStandardMaterial?D:lt).get(V.envMap||_e),Pe=V.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Le=!!X.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),He=!!X.morphAttributes.position,ut=!!X.morphAttributes.normal,Et=!!X.morphAttributes.color;let Gt=In;V.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Gt=v.toneMapping);const ln=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Ke=ln!==void 0?ln.length:0,Ie=De.get(V),ki=w.state.lights;if(K===!0&&(re===!0||R!==b)){const Xt=R===b&&V.id===k;fe.setState(V,R,Xt)}let rt=!1;V.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==ki.state.version||Ie.outputColorSpace!==ye||W.isBatchedMesh&&Ie.batching===!1||!W.isBatchedMesh&&Ie.batching===!0||W.isInstancedMesh&&Ie.instancing===!1||!W.isInstancedMesh&&Ie.instancing===!0||W.isSkinnedMesh&&Ie.skinning===!1||!W.isSkinnedMesh&&Ie.skinning===!0||W.isInstancedMesh&&Ie.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Ie.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Ie.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Ie.instancingMorph===!1&&W.morphTexture!==null||Ie.envMap!==Ae||V.fog===!0&&Ie.fog!==pe||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==fe.numPlanes||Ie.numIntersection!==fe.numIntersection)||Ie.vertexAlphas!==Pe||Ie.vertexTangents!==Le||Ie.morphTargets!==He||Ie.morphNormals!==ut||Ie.morphColors!==Et||Ie.toneMapping!==Gt||Ie.morphTargetsCount!==Ke)&&(rt=!0):(rt=!0,Ie.__version=V.version);let On=Ie.currentProgram;rt===!0&&(On=Ji(V,F,W));let fo=!1,Ni=!1,Qa=!1;const Tt=On.getUniforms(),vn=Ie.uniforms;if(Ee.useProgram(On.program)&&(fo=!0,Ni=!0,Qa=!0),V.id!==k&&(k=V.id,Ni=!0),fo||b!==R){Tt.setValue(G,"projectionMatrix",R.projectionMatrix),Tt.setValue(G,"viewMatrix",R.matrixWorldInverse);const Xt=Tt.map.cameraPosition;Xt!==void 0&&Xt.setValue(G,he.setFromMatrixPosition(R.matrixWorld)),Qe.logarithmicDepthBuffer&&Tt.setValue(G,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Tt.setValue(G,"isOrthographic",R.isOrthographicCamera===!0),b!==R&&(b=R,Ni=!0,Qa=!0)}if(W.isSkinnedMesh){Tt.setOptional(G,W,"bindMatrix"),Tt.setOptional(G,W,"bindMatrixInverse");const Xt=W.skeleton;Xt&&(Xt.boneTexture===null&&Xt.computeBoneTexture(),Tt.setValue(G,"boneTexture",Xt.boneTexture,qe))}W.isBatchedMesh&&(Tt.setOptional(G,W,"batchingTexture"),Tt.setValue(G,"batchingTexture",W._matricesTexture,qe));const es=X.morphAttributes;if((es.position!==void 0||es.normal!==void 0||es.color!==void 0)&&Se.update(W,X,On),(Ni||Ie.receiveShadow!==W.receiveShadow)&&(Ie.receiveShadow=W.receiveShadow,Tt.setValue(G,"receiveShadow",W.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(vn.envMap.value=Ae,vn.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&F.environment!==null&&(vn.envMapIntensity.value=F.environmentIntensity),Ni&&(Tt.setValue(G,"toneMappingExposure",v.toneMappingExposure),Ie.needsLights&&Oc(vn,Qa),pe&&V.fog===!0&&ae.refreshFogUniforms(vn,pe),ae.refreshMaterialUniforms(vn,V,ne,ee,w.state.transmissionRenderTarget[R.id]),Pa.upload(G,uo(Ie),vn,qe)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Pa.upload(G,uo(Ie),vn,qe),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Tt.setValue(G,"center",W.center),Tt.setValue(G,"modelViewMatrix",W.modelViewMatrix),Tt.setValue(G,"normalMatrix",W.normalMatrix),Tt.setValue(G,"modelMatrix",W.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Xt=V.uniformsGroups;for(let ts=0,zc=Xt.length;ts<zc;ts++){const mo=Xt[ts];Xe.update(mo,On),Xe.bind(mo,On)}}return On}function Oc(R,F){R.ambientLightColor.needsUpdate=F,R.lightProbe.needsUpdate=F,R.directionalLights.needsUpdate=F,R.directionalLightShadows.needsUpdate=F,R.pointLights.needsUpdate=F,R.pointLightShadows.needsUpdate=F,R.spotLights.needsUpdate=F,R.spotLightShadows.needsUpdate=F,R.rectAreaLights.needsUpdate=F,R.hemisphereLights.needsUpdate=F}function Fc(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(R,F,X){De.get(R.texture).__webglTexture=F,De.get(R.depthTexture).__webglTexture=X;const V=De.get(R);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=X===void 0,V.__autoAllocateDepthBuffer||Me.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,F){const X=De.get(R);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(R,F=0,X=0){P=R,I=F,C=X;let V=!0,W=null,pe=!1,_e=!1;if(R){const Ae=De.get(R);Ae.__useDefaultFramebuffer!==void 0?(Ee.bindFramebuffer(G.FRAMEBUFFER,null),V=!1):Ae.__webglFramebuffer===void 0?qe.setupRenderTarget(R):Ae.__hasExternalTextures&&qe.rebindTextures(R,De.get(R.texture).__webglTexture,De.get(R.depthTexture).__webglTexture);const Pe=R.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(_e=!0);const Le=De.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Le[F])?W=Le[F][X]:W=Le[F],pe=!0):R.samples>0&&qe.useMultisampledRTT(R)===!1?W=De.get(R).__webglMultisampledFramebuffer:Array.isArray(Le)?W=Le[X]:W=Le,M.copy(R.viewport),U.copy(R.scissor),O=R.scissorTest}else M.copy(se).multiplyScalar(ne).floor(),U.copy(ve).multiplyScalar(ne).floor(),O=Ve;if(Ee.bindFramebuffer(G.FRAMEBUFFER,W)&&V&&Ee.drawBuffers(R,W),Ee.viewport(M),Ee.scissor(U),Ee.setScissorTest(O),pe){const Ae=De.get(R.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ae.__webglTexture,X)}else if(_e){const Ae=De.get(R.texture),Pe=F||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ae.__webglTexture,X||0,Pe)}k=-1},this.readRenderTargetPixels=function(R,F,X,V,W,pe,_e){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=De.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&_e!==void 0&&(ye=ye[_e]),ye){Ee.bindFramebuffer(G.FRAMEBUFFER,ye);try{const Ae=R.texture,Pe=Ae.format,Le=Ae.type;if(!Qe.textureFormatReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Qe.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=R.width-V&&X>=0&&X<=R.height-W&&G.readPixels(F,X,V,W,we.convert(Pe),we.convert(Le),pe)}finally{const Ae=P!==null?De.get(P).__webglFramebuffer:null;Ee.bindFramebuffer(G.FRAMEBUFFER,Ae)}}},this.copyFramebufferToTexture=function(R,F,X=0){const V=Math.pow(2,-X),W=Math.floor(F.image.width*V),pe=Math.floor(F.image.height*V);qe.setTexture2D(F,0),G.copyTexSubImage2D(G.TEXTURE_2D,X,0,0,R.x,R.y,W,pe),Ee.unbindTexture()},this.copyTextureToTexture=function(R,F,X,V=0){const W=F.image.width,pe=F.image.height,_e=we.convert(X.format),ye=we.convert(X.type);qe.setTexture2D(X,0),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,X.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,X.unpackAlignment),F.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,V,R.x,R.y,W,pe,_e,ye,F.image.data):F.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,V,R.x,R.y,F.mipmaps[0].width,F.mipmaps[0].height,_e,F.mipmaps[0].data):G.texSubImage2D(G.TEXTURE_2D,V,R.x,R.y,_e,ye,F.image),V===0&&X.generateMipmaps&&G.generateMipmap(G.TEXTURE_2D),Ee.unbindTexture()},this.copyTextureToTexture3D=function(R,F,X,V,W=0){const pe=R.max.x-R.min.x,_e=R.max.y-R.min.y,ye=R.max.z-R.min.z,Ae=we.convert(V.format),Pe=we.convert(V.type);let Le;if(V.isData3DTexture)qe.setTexture3D(V,0),Le=G.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)qe.setTexture2DArray(V,0),Le=G.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,V.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,V.unpackAlignment);const He=G.getParameter(G.UNPACK_ROW_LENGTH),ut=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Et=G.getParameter(G.UNPACK_SKIP_PIXELS),Gt=G.getParameter(G.UNPACK_SKIP_ROWS),ln=G.getParameter(G.UNPACK_SKIP_IMAGES),Ke=X.isCompressedTexture?X.mipmaps[W]:X.image;G.pixelStorei(G.UNPACK_ROW_LENGTH,Ke.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Ke.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,R.min.x),G.pixelStorei(G.UNPACK_SKIP_ROWS,R.min.y),G.pixelStorei(G.UNPACK_SKIP_IMAGES,R.min.z),X.isDataTexture||X.isData3DTexture?G.texSubImage3D(Le,W,F.x,F.y,F.z,pe,_e,ye,Ae,Pe,Ke.data):V.isCompressedArrayTexture?G.compressedTexSubImage3D(Le,W,F.x,F.y,F.z,pe,_e,ye,Ae,Ke.data):G.texSubImage3D(Le,W,F.x,F.y,F.z,pe,_e,ye,Ae,Pe,Ke),G.pixelStorei(G.UNPACK_ROW_LENGTH,He),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ut),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Et),G.pixelStorei(G.UNPACK_SKIP_ROWS,Gt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,ln),W===0&&V.generateMipmaps&&G.generateMipmap(Le),Ee.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?qe.setTextureCube(R,0):R.isData3DTexture?qe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?qe.setTexture2DArray(R,0):qe.setTexture2D(R,0),Ee.unbindTexture()},this.resetState=function(){I=0,C=0,P=null,Ee.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Js?"display-p3":"srgb",t.unpackColorSpace=tt.workingColorSpace===ja?"display-p3":"srgb"}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class io{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ce(e),this.near=t,this.far=n}clone(){return new io(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Tc extends yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wt,this.environmentIntensity=1,this.environmentRotation=new Wt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class of{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Xs,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Dn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return cc("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,a=this.stride;i<a;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Pt=new N;class Fa{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=rn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=rn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=rn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=rn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),i=et(i,this.array),a=et(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=a,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[i+a])}return new nn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Fa(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[i+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Cn extends _n{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let wi;const zi=new N,xi=new N,_i=new N,vi=new Re,Gi=new Re,Ac=new st,ya=new N,Hi=new N,Ma=new N,Ur=new Re,ks=new Re,Br=new Re;class Jn extends yt{constructor(e=new Cn){if(super(),this.isSprite=!0,this.type="Sprite",wi===void 0){wi=new Ut;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new of(t,5);wi.setIndex([0,1,2,0,2,3]),wi.setAttribute("position",new Fa(n,3,0,!1)),wi.setAttribute("uv",new Fa(n,2,3,!1))}this.geometry=wi,this.material=e,this.center=new Re(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),xi.setFromMatrixScale(this.matrixWorld),Ac.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),_i.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&xi.multiplyScalar(-_i.z);const n=this.material.rotation;let i,a;n!==0&&(a=Math.cos(n),i=Math.sin(n));const o=this.center;Sa(ya.set(-.5,-.5,0),_i,o,xi,i,a),Sa(Hi.set(.5,-.5,0),_i,o,xi,i,a),Sa(Ma.set(.5,.5,0),_i,o,xi,i,a),Ur.set(0,0),ks.set(1,0),Br.set(1,1);let r=e.ray.intersectTriangle(ya,Hi,Ma,!1,zi);if(r===null&&(Sa(Hi.set(-.5,.5,0),_i,o,xi,i,a),ks.set(0,1),r=e.ray.intersectTriangle(ya,Ma,Hi,!1,zi),r===null))return;const c=e.ray.origin.distanceTo(zi);c<e.near||c>e.far||t.push({distance:c,point:zi.clone(),uv:Zt.getInterpolation(zi,ya,Hi,Ma,Ur,ks,Br,new Re),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Sa(s,e,t,n,i,a){vi.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Gi.x=a*vi.x-i*vi.y,Gi.y=i*vi.x+a*vi.y):Gi.copy(vi),s.copy(e),s.x+=Gi.x,s.y+=Gi.y,s.applyMatrix4(Ac)}class Rc extends _n{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ce(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const za=new N,Ga=new N,Or=new st,Vi=new Qs,ba=new Ka,Ns=new N,Fr=new N;class rf extends yt{constructor(e=new Ut,t=new Rc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,a=t.count;i<a;i++)za.fromBufferAttribute(t,i-1),Ga.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=za.distanceTo(Ga);e.setAttribute("lineDistance",new ot(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,a=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ba.copy(n.boundingSphere),ba.applyMatrix4(i),ba.radius+=a,e.ray.intersectsSphere(ba)===!1)return;Or.copy(i).invert(),Vi.copy(e.ray).applyMatrix4(Or);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,h=this.isLineSegments?2:1,d=n.index,p=n.attributes.position;if(d!==null){const m=Math.max(0,o.start),x=Math.min(d.count,o.start+o.count);for(let _=m,w=x-1;_<w;_+=h){const g=d.getX(_),S=d.getX(_+1),v=Ea(this,e,Vi,c,g,S);v&&t.push(v)}if(this.isLineLoop){const _=d.getX(x-1),w=d.getX(m),g=Ea(this,e,Vi,c,_,w);g&&t.push(g)}}else{const m=Math.max(0,o.start),x=Math.min(p.count,o.start+o.count);for(let _=m,w=x-1;_<w;_+=h){const g=Ea(this,e,Vi,c,_,_+1);g&&t.push(g)}if(this.isLineLoop){const _=Ea(this,e,Vi,c,x-1,m);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=i.length;a<o;a++){const r=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}function Ea(s,e,t,n,i,a){const o=s.geometry.attributes.position;if(za.fromBufferAttribute(o,i),Ga.fromBufferAttribute(o,a),t.distanceSqToSegment(za,Ga,Ns,Fr)>n)return;Ns.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ns);if(!(c<e.near||c>e.far))return{distance:c,point:Fr.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,object:s}}const zr=new N,Gr=new N;class cf extends rf{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,a=t.count;i<a;i+=2)zr.fromBufferAttribute(t,i),Gr.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+zr.distanceTo(Gr);e.setAttribute("lineDistance",new ot(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Yt extends kt{constructor(e,t,n,i,a,o,r,c,h){super(e,t,n,i,a,o,r,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class wn extends Ut{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const a=[],o=[],r=[],c=[],h=new N,d=new Re;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){const m=n+u/t*i;h.x=e*Math.cos(m),h.y=e*Math.sin(m),o.push(h.x,h.y,h.z),r.push(0,0,1),d.x=(o[p]/e+1)/2,d.y=(o[p+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new ot(o,3)),this.setAttribute("normal",new ot(r,3)),this.setAttribute("uv",new ot(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class A extends Ut{constructor(e=1,t=1,n=1,i=32,a=1,o=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:a,openEnded:o,thetaStart:r,thetaLength:c};const h=this;i=Math.floor(i),a=Math.floor(a);const d=[],u=[],p=[],m=[];let x=0;const _=[],w=n/2;let g=0;S(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new ot(u,3)),this.setAttribute("normal",new ot(p,3)),this.setAttribute("uv",new ot(m,2));function S(){const E=new N,I=new N;let C=0;const P=(t-e)/n;for(let k=0;k<=a;k++){const b=[],M=k/a,U=M*(t-e)+e;for(let O=0;O<=i;O++){const L=O/i,H=L*c+r,q=Math.sin(H),ee=Math.cos(H);I.x=U*q,I.y=-M*n+w,I.z=U*ee,u.push(I.x,I.y,I.z),E.set(q,P,ee).normalize(),p.push(E.x,E.y,E.z),m.push(L,1-M),b.push(x++)}_.push(b)}for(let k=0;k<i;k++)for(let b=0;b<a;b++){const M=_[b][k],U=_[b+1][k],O=_[b+1][k+1],L=_[b][k+1];d.push(M,U,L),d.push(U,O,L),C+=6}h.addGroup(g,C,0),g+=C}function v(E){const I=x,C=new Re,P=new N;let k=0;const b=E===!0?e:t,M=E===!0?1:-1;for(let O=1;O<=i;O++)u.push(0,w*M,0),p.push(0,M,0),m.push(.5,.5),x++;const U=x;for(let O=0;O<=i;O++){const H=O/i*c+r,q=Math.cos(H),ee=Math.sin(H);P.x=b*ee,P.y=w*M,P.z=b*q,u.push(P.x,P.y,P.z),p.push(0,M,0),C.x=q*.5+.5,C.y=ee*.5*M+.5,m.push(C.x,C.y),x++}for(let O=0;O<i;O++){const L=I+O,H=U+O;E===!0?d.push(H,H+1,L):d.push(H+1,H,L),k+=3}h.addGroup(g,k,E===!0?1:2),g+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new A(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ce extends A{constructor(e=1,t=1,n=32,i=1,a=!1,o=0,r=Math.PI*2){super(0,e,t,n,i,a,o,r),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:r}}static fromJSON(e){return new ce(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Li extends Ut{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const a=[],o=[];r(i),h(n),d(),this.setAttribute("position",new ot(a,3)),this.setAttribute("normal",new ot(a.slice(),3)),this.setAttribute("uv",new ot(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function r(S){const v=new N,E=new N,I=new N;for(let C=0;C<t.length;C+=3)m(t[C+0],v),m(t[C+1],E),m(t[C+2],I),c(v,E,I,S)}function c(S,v,E,I){const C=I+1,P=[];for(let k=0;k<=C;k++){P[k]=[];const b=S.clone().lerp(E,k/C),M=v.clone().lerp(E,k/C),U=C-k;for(let O=0;O<=U;O++)O===0&&k===C?P[k][O]=b:P[k][O]=b.clone().lerp(M,O/U)}for(let k=0;k<C;k++)for(let b=0;b<2*(C-k)-1;b++){const M=Math.floor(b/2);b%2===0?(p(P[k][M+1]),p(P[k+1][M]),p(P[k][M])):(p(P[k][M+1]),p(P[k+1][M+1]),p(P[k+1][M]))}}function h(S){const v=new N;for(let E=0;E<a.length;E+=3)v.x=a[E+0],v.y=a[E+1],v.z=a[E+2],v.normalize().multiplyScalar(S),a[E+0]=v.x,a[E+1]=v.y,a[E+2]=v.z}function d(){const S=new N;for(let v=0;v<a.length;v+=3){S.x=a[v+0],S.y=a[v+1],S.z=a[v+2];const E=w(S)/2/Math.PI+.5,I=g(S)/Math.PI+.5;o.push(E,1-I)}x(),u()}function u(){for(let S=0;S<o.length;S+=6){const v=o[S+0],E=o[S+2],I=o[S+4],C=Math.max(v,E,I),P=Math.min(v,E,I);C>.9&&P<.1&&(v<.2&&(o[S+0]+=1),E<.2&&(o[S+2]+=1),I<.2&&(o[S+4]+=1))}}function p(S){a.push(S.x,S.y,S.z)}function m(S,v){const E=S*3;v.x=e[E+0],v.y=e[E+1],v.z=e[E+2]}function x(){const S=new N,v=new N,E=new N,I=new N,C=new Re,P=new Re,k=new Re;for(let b=0,M=0;b<a.length;b+=9,M+=6){S.set(a[b+0],a[b+1],a[b+2]),v.set(a[b+3],a[b+4],a[b+5]),E.set(a[b+6],a[b+7],a[b+8]),C.set(o[M+0],o[M+1]),P.set(o[M+2],o[M+3]),k.set(o[M+4],o[M+5]),I.copy(S).add(v).add(E).divideScalar(3);const U=w(I);_(C,M+0,S,U),_(P,M+2,v,U),_(k,M+4,E,U)}}function _(S,v,E,I){I<0&&S.x===1&&(o[v]=S.x-1),E.x===0&&E.z===0&&(o[v]=I/2/Math.PI+.5)}function w(S){return Math.atan2(S.z,-S.x)}function g(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Li(e.vertices,e.indices,e.radius,e.details)}}class qi extends Li{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,a=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(a,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new qi(e.radius,e.detail)}}const Ta=new N,Aa=new N,Us=new N,Ra=new Zt;class lf extends Ut{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),a=Math.cos(Ca*t),o=e.getIndex(),r=e.getAttribute("position"),c=o?o.count:r.count,h=[0,0,0],d=["a","b","c"],u=new Array(3),p={},m=[];for(let x=0;x<c;x+=3){o?(h[0]=o.getX(x),h[1]=o.getX(x+1),h[2]=o.getX(x+2)):(h[0]=x,h[1]=x+1,h[2]=x+2);const{a:_,b:w,c:g}=Ra;if(_.fromBufferAttribute(r,h[0]),w.fromBufferAttribute(r,h[1]),g.fromBufferAttribute(r,h[2]),Ra.getNormal(Us),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(w.x*i)},${Math.round(w.y*i)},${Math.round(w.z*i)}`,u[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let S=0;S<3;S++){const v=(S+1)%3,E=u[S],I=u[v],C=Ra[d[S]],P=Ra[d[v]],k=`${E}_${I}`,b=`${I}_${E}`;b in p&&p[b]?(Us.dot(p[b].normal)<=a&&(m.push(C.x,C.y,C.z),m.push(P.x,P.y,P.z)),p[b]=null):k in p||(p[k]={index0:h[S],index1:h[v],normal:Us.clone()})}}for(const x in p)if(p[x]){const{index0:_,index1:w}=p[x];Ta.fromBufferAttribute(r,_),Aa.fromBufferAttribute(r,w),m.push(Ta.x,Ta.y,Ta.z),m.push(Aa.x,Aa.y,Aa.z)}this.setAttribute("position",new ot(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Ei extends Li{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ei(e.radius,e.detail)}}class Ja extends Li{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ja(e.radius,e.detail)}}class y extends Ut{constructor(e=1,t=32,n=16,i=0,a=Math.PI*2,o=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:a,thetaStart:o,thetaLength:r},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+r,Math.PI);let h=0;const d=[],u=new N,p=new N,m=[],x=[],_=[],w=[];for(let g=0;g<=n;g++){const S=[],v=g/n;let E=0;g===0&&o===0?E=.5/t:g===n&&c===Math.PI&&(E=-.5/t);for(let I=0;I<=t;I++){const C=I/t;u.x=-e*Math.cos(i+C*a)*Math.sin(o+v*r),u.y=e*Math.cos(o+v*r),u.z=e*Math.sin(i+C*a)*Math.sin(o+v*r),x.push(u.x,u.y,u.z),p.copy(u).normalize(),_.push(p.x,p.y,p.z),w.push(C+E,1-v),S.push(h++)}d.push(S)}for(let g=0;g<n;g++)for(let S=0;S<t;S++){const v=d[g][S+1],E=d[g][S],I=d[g+1][S],C=d[g+1][S+1];(g!==0||o>0)&&m.push(v,E,C),(g!==n-1||c<Math.PI)&&m.push(E,I,C)}this.setIndex(m),this.setAttribute("position",new ot(x,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(w,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new y(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ao extends Li{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ao(e.radius,e.detail)}}class vt extends Ut{constructor(e=1,t=.4,n=12,i=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:a},n=Math.floor(n),i=Math.floor(i);const o=[],r=[],c=[],h=[],d=new N,u=new N,p=new N;for(let m=0;m<=n;m++)for(let x=0;x<=i;x++){const _=x/i*a,w=m/n*Math.PI*2;u.x=(e+t*Math.cos(w))*Math.cos(_),u.y=(e+t*Math.cos(w))*Math.sin(_),u.z=t*Math.sin(w),r.push(u.x,u.y,u.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),p.subVectors(u,d).normalize(),c.push(p.x,p.y,p.z),h.push(x/i),h.push(m/n)}for(let m=1;m<=n;m++)for(let x=1;x<=i;x++){const _=(i+1)*m+x-1,w=(i+1)*(m-1)+x-1,g=(i+1)*(m-1)+x,S=(i+1)*m+x;o.push(_,w,S),o.push(w,g,S)}this.setIndex(o),this.setAttribute("position",new ot(r,3)),this.setAttribute("normal",new ot(c,3)),this.setAttribute("uv",new ot(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vt(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class hf extends _n{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ce(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Za,this.normalScale=new Re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Bt extends _n{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ce(16777215),this.specular=new Ce(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Za,this.normalScale=new Re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=Xa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class f extends _n{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Za,this.normalScale=new Re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=Xa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class so extends yt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ce(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Bs=new st,Hr=new N,Vr=new N;class Cc{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Re(512,512),this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new to,this._frameExtents=new Re(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Hr.setFromMatrixPosition(e.matrixWorld),t.position.copy(Hr),Vr.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vr),t.updateMatrixWorld(),Bs.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bs),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Bs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Wr=new st,Wi=new N,Os=new N;class df extends Cc{constructor(){super(new Ft(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Re(4,2),this._viewportCount=6,this._viewports=[new ct(2,1,1,1),new ct(0,1,1,1),new ct(3,1,1,1),new ct(1,1,1,1),new ct(3,0,1,1),new ct(1,0,1,1)],this._cubeDirections=[new N(1,0,0),new N(-1,0,0),new N(0,0,1),new N(0,0,-1),new N(0,1,0),new N(0,-1,0)],this._cubeUps=[new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,0,1),new N(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,a=e.distance||n.far;a!==n.far&&(n.far=a,n.updateProjectionMatrix()),Wi.setFromMatrixPosition(e.matrixWorld),n.position.copy(Wi),Os.copy(n.position),Os.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Os),n.updateMatrixWorld(),i.makeTranslation(-Wi.x,-Wi.y,-Wi.z),Wr.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wr)}}class gn extends so{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new df}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class uf extends Cc{constructor(){super(new xc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ha extends so{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(yt.DEFAULT_UP),this.updateMatrix(),this.target=new yt,this.shadow=new uf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Pc extends so{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Xr=new st;class pf{constructor(e,t,n=0,i=1/0){this.ray=new Qs(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new eo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Xr.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xr),this}intersectObject(e,t=!0,n=[]){return Zs(e,this,n,t),n.sort(qr),n}intersectObjects(e,t=!0,n=[]){for(let i=0,a=e.length;i<a;i++)Zs(e[i],this,n,t);return n.sort(qr),n}}function qr(s,e){return s.distance-e.distance}function Zs(s,e,t,n){if(s.layers.test(e.layers)&&s.raycast(e,t),n===!0){const i=s.children;for(let a=0,o=i.length;a<o;a++)Zs(i[a],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$s}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$s);class ff{constructor(e){const t=e?e.sky||e.fog:4876938,n=e?e.ambient:6710886;this.scene=new Tc,this.scene.background=new Ce(t),this.scene.fog=new io(t,40,140),this.camera=new Ft(90,window.innerWidth/window.innerHeight,.1,200),this.camera.position.set(0,1.7,0),this.renderer=new Ec({antialias:!1}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Zc,document.body.appendChild(this.renderer.domElement),this.domElement=this.renderer.domElement,this.setupLighting(n),this.handleResize()}setupLighting(e){const t=new Pc(e,1.4);this.scene.add(t);const n=new Ha(16777215,.7);n.position.set(30,50,20),n.castShadow=!0,this.scene.add(n);const i=new Ha(8939076,.3);i.position.set(-20,30,-10),this.scene.add(i)}handleResize(){window.addEventListener("resize",()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)})}render(){this.renderer.render(this.scene,this.camera)}destroy(){document.body.removeChild(this.renderer.domElement),this.renderer.dispose()}}const J=new(window.AudioContext||window.webkitAudioContext);class at{static resume(){J.state==="suspended"&&J.resume()}static animalDeath(){at.resume();const e=J.createOscillator(),t=J.createGain(),n=J.createWaveShaper();n.curve=at.makeDistortionCurve(200),e.connect(n),n.connect(t),t.connect(J.destination);const i=J.currentTime;e.type="sawtooth",e.frequency.setValueAtTime(800,i),e.frequency.exponentialRampToValueAtTime(100,i+.3),t.gain.setValueAtTime(.6,i),t.gain.exponentialRampToValueAtTime(.01,i+.4),e.start(i),e.stop(i+.4);const a=J.sampleRate*.2,o=J.createBuffer(1,a,J.sampleRate),r=o.getChannelData(0);for(let d=0;d<a;d++)r[d]=(Math.random()*2-1)*(1-d/a);const c=J.createBufferSource();c.buffer=o;const h=J.createGain();h.gain.setValueAtTime(.3,i),h.gain.exponentialRampToValueAtTime(.01,i+.2),c.connect(h),h.connect(J.destination),c.start(i)}static gunshot(){at.resume();const e=J.currentTime,t=J.sampleRate*.15,n=J.createBuffer(1,t,J.sampleRate),i=n.getChannelData(0);for(let h=0;h<t;h++)i[h]=(Math.random()*2-1)*Math.exp(-h/(t*.1));const a=J.createBufferSource();a.buffer=n;const o=J.createGain();o.gain.setValueAtTime(.5,e),o.gain.exponentialRampToValueAtTime(.01,e+.15),a.connect(o),o.connect(J.destination),a.start(e);const r=J.createOscillator(),c=J.createGain();r.type="sine",r.frequency.setValueAtTime(150,e),r.frequency.exponentialRampToValueAtTime(30,e+.1),c.gain.setValueAtTime(.4,e),c.gain.exponentialRampToValueAtTime(.01,e+.1),r.connect(c),c.connect(J.destination),r.start(e),r.stop(e+.1)}static bambooHit(){at.resume();const e=J.currentTime,t=J.createOscillator(),n=J.createGain();t.type="sine",t.frequency.setValueAtTime(200,e),t.frequency.exponentialRampToValueAtTime(60,e+.08),n.gain.setValueAtTime(.5,e),n.gain.exponentialRampToValueAtTime(.01,e+.1),t.connect(n),n.connect(J.destination),t.start(e),t.stop(e+.1);const i=J.createOscillator(),a=J.createGain();i.type="triangle",i.frequency.setValueAtTime(800,e),i.frequency.exponentialRampToValueAtTime(400,e+.15),a.gain.setValueAtTime(.25,e),a.gain.exponentialRampToValueAtTime(.01,e+.15),i.connect(a),a.connect(J.destination),i.start(e),i.stop(e+.15);const o=J.sampleRate*.06,r=J.createBuffer(1,o,J.sampleRate),c=r.getChannelData(0);for(let u=0;u<o;u++)c[u]=(Math.random()*2-1)*Math.exp(-u/(o*.15));const h=J.createBufferSource();h.buffer=r;const d=J.createGain();d.gain.setValueAtTime(.3,e),d.gain.exponentialRampToValueAtTime(.01,e+.06),h.connect(d),d.connect(J.destination),h.start(e)}static knifeSlash(){at.resume();const e=J.currentTime,t=J.sampleRate*.12,n=J.createBuffer(1,t,J.sampleRate),i=n.getChannelData(0);for(let c=0;c<t;c++){const h=Math.sin(c/t*Math.PI);i[c]=(Math.random()*2-1)*h}const a=J.createBufferSource();a.buffer=n;const o=J.createBiquadFilter();o.type="highpass",o.frequency.setValueAtTime(2e3,e),o.frequency.linearRampToValueAtTime(6e3,e+.1);const r=J.createGain();r.gain.setValueAtTime(.4,e),r.gain.exponentialRampToValueAtTime(.01,e+.12),a.connect(o),o.connect(r),r.connect(J.destination),a.start(e)}static makeDistortionCurve(e){const n=new Float32Array(44100);for(let i=0;i<44100;i++){const a=i*2/44100-1;n[i]=(Math.PI+e)*a/(Math.PI+e*Math.abs(a))}return n}static animalScream(){at.resume();const e=J.currentTime,t=J.createOscillator(),n=J.createGain(),i=J.createWaveShaper();i.curve=at.makeDistortionCurve(400),t.type="sawtooth",t.frequency.setValueAtTime(1200,e),t.frequency.exponentialRampToValueAtTime(2e3,e+.1),t.frequency.exponentialRampToValueAtTime(600,e+.5),t.frequency.exponentialRampToValueAtTime(200,e+.8),n.gain.setValueAtTime(.8,e),n.gain.linearRampToValueAtTime(.9,e+.1),n.gain.exponentialRampToValueAtTime(.01,e+.8),t.connect(i),i.connect(n),n.connect(J.destination),t.start(e),t.stop(e+.8);const a=J.createOscillator(),o=J.createGain();a.type="square",a.frequency.setValueAtTime(80,e),a.frequency.linearRampToValueAtTime(50,e+.6),o.gain.setValueAtTime(.4,e),o.gain.exponentialRampToValueAtTime(.01,e+.6),a.connect(o),o.connect(J.destination),a.start(e),a.stop(e+.6);const r=J.sampleRate*.4,c=J.createBuffer(1,r,J.sampleRate),h=c.getChannelData(0);for(let x=0;x<r;x++)h[x]=(Math.random()*2-1)*(1-x/r)*.8;const d=J.createBufferSource();d.buffer=c;const u=J.createGain();u.gain.setValueAtTime(.5,e),u.gain.exponentialRampToValueAtTime(.01,e+.4),d.connect(u),u.connect(J.destination),d.start(e);const p=J.createOscillator(),m=J.createGain();p.type="sawtooth",p.frequency.setValueAtTime(1400,e+.05),p.frequency.exponentialRampToValueAtTime(800,e+.5),p.frequency.exponentialRampToValueAtTime(150,e+.8),m.gain.setValueAtTime(.6,e+.05),m.gain.exponentialRampToValueAtTime(.01,e+.7),p.connect(m),m.connect(J.destination),p.start(e+.05),p.stop(e+.8)}static crossbowShoot(){at.resume();const e=J.currentTime,t=J.createOscillator(),n=J.createGain();t.type="triangle",t.frequency.setValueAtTime(400,e),t.frequency.exponentialRampToValueAtTime(80,e+.2),n.gain.setValueAtTime(.4,e),n.gain.exponentialRampToValueAtTime(.01,e+.2),t.connect(n),n.connect(J.destination),t.start(e),t.stop(e+.2);const i=J.createOscillator(),a=J.createGain();i.type="sine",i.frequency.setValueAtTime(1200,e),i.frequency.exponentialRampToValueAtTime(300,e+.15),a.gain.setValueAtTime(.2,e),a.gain.exponentialRampToValueAtTime(.01,e+.15),i.connect(a),a.connect(J.destination),i.start(e),i.stop(e+.15)}static chestOpen(){at.resume();const e=J.currentTime,t=J.createOscillator(),n=J.createGain();t.type="sine",t.frequency.setValueAtTime(300,e),t.frequency.exponentialRampToValueAtTime(900,e+.15),n.gain.setValueAtTime(.3,e),n.gain.exponentialRampToValueAtTime(.01,e+.2),t.connect(n),n.connect(J.destination),t.start(e),t.stop(e+.2);const i=J.createOscillator(),a=J.createGain();i.type="square",i.frequency.setValueAtTime(2e3,e+.1),i.frequency.exponentialRampToValueAtTime(4e3,e+.15),a.gain.setValueAtTime(.15,e+.1),a.gain.exponentialRampToValueAtTime(.01,e+.2),i.connect(a),a.connect(J.destination),i.start(e+.1),i.stop(e+.2)}static playerHurt(){at.resume();const e=J.currentTime,t=J.createOscillator(),n=J.createGain();t.type="sine",t.frequency.setValueAtTime(100,e),t.frequency.exponentialRampToValueAtTime(40,e+.15),n.gain.setValueAtTime(.5,e),n.gain.exponentialRampToValueAtTime(.01,e+.15),t.connect(n),n.connect(J.destination),t.start(e),t.stop(e+.15);const i=J.sampleRate*.1,a=J.createBuffer(1,i,J.sampleRate),o=a.getChannelData(0);for(let h=0;h<i;h++)o[h]=(Math.random()*2-1)*Math.exp(-h/(i*.2));const r=J.createBufferSource();r.buffer=a;const c=J.createGain();c.gain.setValueAtTime(.3,e),c.gain.exponentialRampToValueAtTime(.01,e+.1),r.connect(c),c.connect(J.destination),r.start(e)}static panting(){at.resume();const e=J.currentTime,t=J.sampleRate*.3,n=J.createBuffer(1,t,J.sampleRate),i=n.getChannelData(0);for(let c=0;c<t;c++){const h=Math.sin(c/t*Math.PI);i[c]=(Math.random()*2-1)*h}const a=J.createBufferSource();a.buffer=n;const o=J.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(800,e),o.Q.setValueAtTime(2,e);const r=J.createGain();r.gain.setValueAtTime(.2,e),r.gain.linearRampToValueAtTime(.3,e+.1),r.gain.exponentialRampToValueAtTime(.01,e+.3),a.connect(o),o.connect(r),r.connect(J.destination),a.start(e)}static winMusic(){at.resume();const e=J.currentTime;[523,659,784,1047,1319,1568].forEach((a,o)=>{const r=J.createOscillator(),c=J.createGain();r.type="square",r.frequency.setValueAtTime(a,e+o*.15),c.gain.setValueAtTime(.2,e+o*.15),c.gain.exponentialRampToValueAtTime(.01,e+o*.15+.4),r.connect(c),c.connect(J.destination),r.start(e+o*.15),r.stop(e+o*.15+.4)});const n=J.createOscillator(),i=J.createGain();n.type="sine",n.frequency.setValueAtTime(262,e),n.frequency.setValueAtTime(330,e+.5),n.frequency.setValueAtTime(392,e+.8),i.gain.setValueAtTime(.3,e),i.gain.exponentialRampToValueAtTime(.01,e+1.2),n.connect(i),i.connect(J.destination),n.start(e),n.stop(e+1.2)}static loseMusic(){at.resume();const e=J.currentTime;[440,392,349,311,262,220].forEach((a,o)=>{const r=J.createOscillator(),c=J.createGain();r.type="sine",r.frequency.setValueAtTime(a,e+o*.3),c.gain.setValueAtTime(.2,e+o*.3),c.gain.exponentialRampToValueAtTime(.01,e+o*.3+.5),r.connect(c),c.connect(J.destination),r.start(e+o*.3),r.stop(e+o*.3+.5)});const n=J.createOscillator(),i=J.createGain();n.type="sawtooth",n.frequency.setValueAtTime(110,e),n.frequency.exponentialRampToValueAtTime(80,e+2),i.gain.setValueAtTime(.15,e),i.gain.exponentialRampToValueAtTime(.01,e+2),n.connect(i),i.connect(J.destination),n.start(e),n.stop(e+2)}}class mf{constructor(e,t,n,i){this.camera=e,this.domElement=t,this.scene=n,this.arena=i,this.velocity=new N,this.direction=new N,this.moveSpeed=15,this.jumpSpeed=9,this.gravity=22,this.onGround=!0,this.locked=!1,this.shootCallbacks=[],this.thirdPerson=!1,this.playerPos=e.position.clone(),this.cameraAnchor=this.playerPos,this.playerPosInitialized=!1,this.worldUp=new N(0,1,0),this.keys={forward:!1,backward:!1,left:!1,right:!1,jump:!1,sprint:!1},this.mouseHeld=!1,this.euler=new Wt(0,0,0,"YXZ"),this.sensitivity=.002,this.speedMultiplier=1,this.stamina=100,this.maxStamina=100,this.staminaDrain=20,this.staminaRegen=12,this.exhausted=!1,this.pantTimer=0,this.setupControls()}setupControls(){this.domElement.addEventListener("click",()=>{this.locked||this.domElement.requestPointerLock()}),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===this.domElement}),document.addEventListener("mousemove",e=>{this.locked&&(this.euler.setFromQuaternion(this.camera.quaternion),this.euler.y-=e.movementX*this.sensitivity,this.euler.x-=e.movementY*this.sensitivity,this.euler.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.euler.x)),this.camera.quaternion.setFromEuler(this.euler))}),document.addEventListener("keydown",e=>{this.setKey(e.code,!0)}),document.addEventListener("keyup",e=>{this.setKey(e.code,!1)}),document.addEventListener("keydown",e=>{e.code==="F3"&&(e.preventDefault(),this.toggleCamera())}),document.addEventListener("mousedown",e=>{this.locked&&e.button===0&&(this.mouseHeld=!0,this.shootCallbacks.forEach(t=>t()))}),document.addEventListener("mouseup",e=>{e.button===0&&(this.mouseHeld=!1)})}setKey(e,t){switch(e){case"KeyW":this.keys.forward=t;break;case"KeyS":this.keys.backward=t;break;case"KeyA":this.keys.left=t;break;case"KeyD":this.keys.right=t;break;case"Space":this.keys.jump=t;break;case"ShiftLeft":case"ShiftRight":this.keys.sprint=t;break}}onShoot(e){this.shootCallbacks.push(e)}update(e){if(this.playerPosInitialized||(this.playerPos.copy(this.camera.position),this.playerPosInitialized=!0),!this.locked)return;this.direction.set(0,0,0),this.keys.forward&&(this.direction.z-=1),this.keys.backward&&(this.direction.z+=1),this.keys.left&&(this.direction.x-=1),this.keys.right&&(this.direction.x+=1),this.direction.normalize();const t=new N(0,0,-1).applyQuaternion(this.camera.quaternion);t.y=0,t.normalize();const n=new N(1,0,0).applyQuaternion(this.camera.quaternion);n.y=0,n.normalize();const i=this.keys.sprint&&this.stamina>0&&!this.exhausted&&this.direction.length()>0;i?(this.stamina-=this.staminaDrain*e,this.stamina<=0&&(this.stamina=0,this.exhausted=!0)):(this.stamina+=this.staminaRegen*e,this.stamina>=this.maxStamina&&(this.stamina=this.maxStamina),this.exhausted&&this.stamina>30&&(this.exhausted=!1)),this.exhausted&&(this.pantTimer-=e,this.pantTimer<=0&&(this.pantTimer=1.5,at.panting()));const a=this.moveSpeed*(i?1.7:1),o=(t.x*-this.direction.z+n.x*this.direction.x)*a,r=(t.z*-this.direction.z+n.z*this.direction.x)*a;this.velocity.x=o,this.velocity.z=r,this.keys.jump&&this.onGround&&(this.velocity.y=this.jumpSpeed,this.onGround=!1),this.velocity.y-=this.gravity*e;const c=.4,h=this.playerPos.x+this.velocity.x*e,d=this.playerPos.z+this.velocity.z*e;this.arena&&this.arena.isPassable?(this.arena.isPassable(h+c,this.playerPos.z)&&this.arena.isPassable(h-c,this.playerPos.z)&&(this.playerPos.x=h),this.arena.isPassable(this.playerPos.x,d+c)&&this.arena.isPassable(this.playerPos.x,d-c)&&(this.playerPos.z=d)):(this.playerPos.x=h,this.playerPos.z=d),this.playerPos.y+=this.velocity.y*e,this.playerPos.y<=1.7&&(this.playerPos.y=1.7,this.velocity.y=0,this.onGround=!0),this._applyCameraTransform()}_applyCameraTransform(){if(this.playerPosInitialized||(this.playerPos.copy(this.camera.position),this.playerPosInitialized=!0),this.thirdPerson){this.euler.setFromQuaternion(this.camera.quaternion);const e=new N(0,.5,3).applyAxisAngle(this.worldUp,this.euler.y);this.camera.position.copy(this.playerPos).add(e)}else this.camera.position.copy(this.playerPos)}toggleCamera(){return this.thirdPerson=!this.thirdPerson,this._applyCameraTransform(),this.thirdPerson}isThirdPerson(){return this.thirdPerson}getPosition(){return this.playerPos.clone()}setSpeedMultiplier(e){this.speedMultiplier=e,this.moveSpeed=12}lock(){this.domElement.requestPointerLock()}unlock(){document.pointerLockElement&&document.exitPointerLock()}}const _t=4,Qt=50,en=50;function Ic(s){let e=s;return function(){return e=e*1664525+1013904223&4294967295,(e>>>0)/4294967295}}function gf(s){const e=Ic(s),t=[];for(let r=0;r<en;r++){const c=[];for(let h=0;h<Qt;h++)r===0||r===en-1||h===0||h===Qt-1?c.push(0):c.push(1);t.push(c)}const n=[],i=12,a=8;for(let r=0;r<i;r++){let c=0;for(;c<50;){const h=Math.floor(e()*(en-12))+6,d=Math.floor(e()*(Qt-12))+6;let u=!1;for(const p of n){const m=h-p.r,x=d-p.c;if(Math.sqrt(m*m+x*x)<a){u=!0;break}}if(!u){n.push({r:h,c:d,id:r});break}c++}}const o=4;for(const r of n)for(let c=-o;c<=o;c++)for(let h=-o;h<=o;h++)if(c*c+h*h<=o*o){const d=r.r+c,u=r.c+h;d>0&&d<en-1&&u>0&&u<Qt-1&&(t[d][u]=r.id+3)}return t}class wf{constructor(e,t){this.scene=e,this.rooms={},this.activatedRooms=new Set,this.roomActivationCallbacks=[],this.doors=[],this.theme=t||{floor:2960680,light:16737826,fog:657930,ambient:4473924,seed:1e3,terrain:"ruins",sky:2763322},this.rng=Ic(this.theme.seed||1e3),this.map=gf(this.theme.seed||1e3),this.buildGround(),this.buildBoundary(),this.buildTerrain(),this.findRooms()}getMapWidth(){return Qt*_t}getMapHeight(){return en*_t}worldToGrid(e,t){const n=Math.floor(e/_t);return{row:Math.floor(t/_t),col:n}}isWall(e,t){const{row:n,col:i}=this.worldToGrid(e,t);return n<0||n>=en||i<0||i>=Qt?!0:this.map[n][i]===0}isPassable(e,t){return!this.isWall(e,t)}onRoomActivation(e){this.roomActivationCallbacks.push(e)}findRooms(){for(let e=0;e<en;e++)for(let t=0;t<Qt;t++){const n=this.map[e][t];if(n>=3){const i=n-3;this.rooms[i]||(this.rooms[i]=[]),this.rooms[i].push({x:t*_t+_t/2,z:e*_t+_t/2})}}}getRoomSpawnPoints(e){return this.rooms[e]||[]}getRandomSpawnInRoom(e){const t=this.rooms[e];return!t||t.length===0?{x:10,z:10}:t[Math.floor(Math.random()*t.length)]}getRandomSpawnPoint(){const e=Object.values(this.rooms).flat();return e.length===0?{x:10,z:10}:e[Math.floor(Math.random()*e.length)]}getPlayerStart(){const e=Math.floor(Qt/2)*_t+_t/2,t=Math.floor(en/2)*_t+_t/2;return{x:e,z:t}}updateDoors(e){if(this.activatedRooms.size<Object.keys(this.rooms).length)for(const t of Object.keys(this.rooms).map(Number)){if(this.activatedRooms.has(t))continue;const n=this.rooms[t];for(const i of n){const a=e.x-i.x,o=e.z-i.z;if(Math.sqrt(a*a+o*o)<20){this.activatedRooms.add(t);for(const r of this.roomActivationCallbacks)r(t);break}}}}isRoomActive(e){return this.activatedRooms.has(e)}getRoomIds(){return Object.keys(this.rooms).map(Number)}buildGround(){const e=Qt*_t,t=en*_t,n=new St(e,t),i=new f({color:this.theme.floor}),a=new l(n,i);a.rotation.x=-Math.PI/2,a.position.set(e/2,0,t/2),a.receiveShadow=!0,this.scene.add(a);const o=new f({color:this.theme.floor+526344,transparent:!0,opacity:.3});for(let r=0;r<20;r++){const c=2+this.rng()*(e-4),h=2+this.rng()*(t-4),d=3+this.rng()*8,u=new St(d,d),p=new l(u,o);p.rotation.x=-Math.PI/2,p.rotation.z=this.rng()*Math.PI,p.position.set(c,.01,h),this.scene.add(p)}}buildBoundary(){const e=Qt*_t,t=en*_t,n=3,i=new f({color:this.theme.floor-657930,transparent:!0,opacity:.7}),a=[{pos:[e/2,n/2,0],size:[e,n,1]},{pos:[e/2,n/2,t],size:[e,n,1]},{pos:[0,n/2,t/2],size:[1,n,t]},{pos:[e,n/2,t/2],size:[1,n,t]}];for(const o of a){const r=new Z(...o.size),c=new l(r,i);c.position.set(...o.pos),this.scene.add(c)}}buildTerrain(){const e=this.theme.terrain||"ruins",t=Qt*_t,n=en*_t;switch(e){case"forest":this.buildForest(t,n);break;case"desert":this.buildDesert(t,n);break;case"snow":this.buildSnow(t,n);break;case"ruins":this.buildRuins(t,n);break;case"crystal":this.buildCrystal(t,n);break;case"volcanic":this.buildVolcanic(t,n);break;case"swamp":this.buildSwamp(t,n);break;case"canyon":this.buildCanyon(t,n);break;case"village":this.buildVillage(t,n);break;case"tech":this.buildTech(t,n);break;case"cave":this.buildCave(t,n);break;case"arena":this.buildArenaDecor(t,n);break;case"cloud":this.buildCloud(t,n);break;case"pirate":this.buildPirate(t,n);break;case"castle":this.buildCastle(t,n);break;case"temple":this.buildTemple(t,n);break;case"cemetery":this.buildCemetery(t,n);break;case"underwater":this.buildUnderwater(t,n);break;case"palace":this.buildPalace(t,n);break;case"dark":this.buildDark(t,n);break;case"alien":this.buildAlien(t,n);break;case"jungle":this.buildJungle(t,n);break;case"bamboo":this.buildBamboo(t,n);break;case"mine":this.buildMine(t,n);break;case"lab":this.buildLab(t,n);break;case"fortress":this.buildFortress(t,n);break;case"dragon":this.buildDragon(t,n);break;default:this.buildRuins(t,n);break}this.buildLights(t,n)}buildLights(e,t){const n=12+Math.floor(this.rng()*6);for(let a=0;a<n;a++){const o=10+this.rng()*(e-20),r=10+this.rng()*(t-20),c=new gn(this.theme.light,1.5,30);c.position.set(o,4,r),this.scene.add(c)}const i=new Ha(this.theme.light,.8);i.position.set(e/2,30,t/3),i.castShadow=!0,this.scene.add(i)}buildForest(e,t){const n=60+Math.floor(this.rng()*30);for(let i=0;i<n;i++){const a=8+this.rng()*(e-16),o=8+this.rng()*(t-16);this.createTree(a,o)}for(let i=0;i<30;i++){const a=4+this.rng()*(e-8),o=4+this.rng()*(t-8);this.createBush(a,o)}for(let i=0;i<15;i++){const a=4+this.rng()*(e-8),o=4+this.rng()*(t-8);this.createRock(a,o,.5+this.rng()*1)}}buildDesert(e,t){for(let n=0;n<25;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,1+this.rng()*2.5)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createCactus(i,a)}for(let n=0;n<8;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createDune(i,a)}}buildSnow(e,t){for(let n=0;n<30;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createPineTree(i,a)}for(let n=0;n<20;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,.8+this.rng()*1.5,11189196)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createSnowMound(i,a)}}buildRuins(e,t){for(let n=0;n<20;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createBrokenPillar(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,.5+this.rng()*1.5,5921354)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRuinWall(i,a)}}buildCrystal(e,t){for(let n=0;n<40;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createCrystal(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,1+this.rng()*2,3816026)}}buildVolcanic(e,t){for(let n=0;n<20;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,1.5+this.rng()*3,2759194)}for(let n=0;n<12;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createLavaPool(i,a)}}buildSwamp(e,t){for(let n=0;n<25;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createDeadTree(i,a)}for(let n=0;n<20;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createSwampPool(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createBush(i,a,3824170)}}buildCanyon(e,t){for(let n=0;n<30;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,2+this.rng()*4,6965818)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createArch(i,a)}}buildVillage(e,t){for(let n=0;n<15;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createHouse(i,a)}for(let n=0;n<20;n++){const i=4+this.rng()*(e-8),a=4+this.rng()*(t-8);this.createTree(i,a)}}buildTech(e,t){for(let n=0;n<20;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createTechPillar(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createTechPanel(i,a)}}buildCave(e,t){for(let n=0;n<30;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,1+this.rng()*3,3815978)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createStalagmite(i,a)}}buildArenaDecor(e,t){for(let n=0;n<16;n++){const i=n/16*Math.PI*2,a=Math.min(e,t)*.4,o=e/2+Math.cos(i)*a,r=t/2+Math.sin(i)*a;this.createBrokenPillar(o,r)}for(let n=0;n<10;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createRock(i,a,.5+this.rng()*1,5917242)}}buildCloud(e,t){for(let n=0;n<30;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createCloudPillar(i,a)}for(let n=0;n<20;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createFloatingRock(i,a)}}createTree(e,t){const n=new z,i=3+this.rng()*2,a=new A(.2,.35,i,6),o=new f({color:4861976}),r=new l(a,o);r.position.y=i/2,r.castShadow=!0,n.add(r);const c=2+this.rng()*2,h=new y(1.5+this.rng(),6,5),d=new f({color:2779674+Math.floor(this.rng()*1052672)}),u=new l(h,d);u.position.y=i+c*.3,u.scale.y=c/2,u.castShadow=!0,n.add(u),n.position.set(e,0,t),this.scene.add(n)}createPineTree(e,t){const n=new z,i=2+this.rng()*1.5,a=new A(.15,.25,i,5),o=new f({color:3809296}),r=new l(a,o);r.position.y=i/2,n.add(r);for(let c=0;c<3;c++){const h=2-c*.4,d=1.5-c*.3,u=new ce(d,h,6),p=new f({color:1722922}),m=new l(u,p);m.position.y=i+c*1.2+h/2,m.castShadow=!0,n.add(m)}n.position.set(e,0,t),this.scene.add(n)}createBush(e,t,n){const i=new y(.6+this.rng()*.4,5,4),a=new f({color:n||2775578}),o=new l(i,a);o.position.set(e,.4,t),o.scale.y=.7,o.castShadow=!0,this.scene.add(o)}createRock(e,t,n,i){const a=new qi(n||1,0),o=new f({color:i||5921370}),r=new l(a,o);r.position.set(e,n*.4,t),r.rotation.set(this.rng()*.5,this.rng()*Math.PI,this.rng()*.3),r.scale.y=.6+this.rng()*.4,r.castShadow=!0,this.scene.add(r)}createCactus(e,t){const n=new z,i=2+this.rng()*2,a=new A(.25,.3,i,8),o=new f({color:2779690}),r=new l(a,o);if(r.position.y=i/2,n.add(r),this.rng()>.4){const c=1+this.rng(),h=new A(.15,.18,c,6),d=new l(h,o);d.position.set(.4,i*.5,0),d.rotation.z=-.8,n.add(d)}n.position.set(e,0,t),this.scene.add(n)}createDune(e,t){const n=4+this.rng()*6,i=new y(n,8,6),a=new f({color:10127962}),o=new l(i,a);o.position.set(e,-n*.6,t),o.scale.y=.3,this.scene.add(o)}createBrokenPillar(e,t){const n=2+this.rng()*4,i=new A(.4,.5,n,8),a=new f({color:6974042}),o=new l(i,a);o.position.set(e,n/2,t),o.castShadow=!0,this.scene.add(o);const r=new A(.7,.7,.3,8),c=new l(r,a);c.position.set(e,.15,t),this.scene.add(c)}createRuinWall(e,t){const n=3+this.rng()*4,i=1.5+this.rng()*2.5,a=new Z(n,i,.6),o=new f({color:5921354}),r=new l(a,o);r.position.set(e,i/2,t),r.rotation.y=this.rng()*Math.PI,r.castShadow=!0,this.scene.add(r)}createCrystal(e,t){const n=1+this.rng()*3,i=new ce(.3+this.rng()*.4,n,5),a=this.rng(),o=new Ce().setHSL(a,.7,.5),r=new Bt({color:o,emissive:o,emissiveIntensity:.3,transparent:!0,opacity:.8}),c=new l(i,r);c.position.set(e,n/2,t),c.rotation.set(this.rng()*.3,0,this.rng()*.3),this.scene.add(c);const h=new gn(o,.5,8);h.position.set(e,n,t),this.scene.add(h)}createLavaPool(e,t){const n=2+this.rng()*3,i=new wn(n,8),a=new We({color:16729088}),o=new l(i,a);o.rotation.x=-Math.PI/2,o.position.set(e,.02,t),this.scene.add(o);const r=new gn(16729088,1,12);r.position.set(e,1,t),this.scene.add(r)}createDeadTree(e,t){const n=new z,i=3+this.rng()*2,a=new A(.1,.3,i,5),o=new f({color:3811866}),r=new l(a,o);r.position.y=i/2,r.rotation.z=(this.rng()-.5)*.3,r.castShadow=!0,n.add(r);for(let c=0;c<3;c++){const h=new A(.03,.06,1+this.rng()),d=new l(h,o);d.position.set((this.rng()-.5)*.5,i*(.5+this.rng()*.4),0),d.rotation.z=(this.rng()-.5)*1.2,n.add(d)}n.position.set(e,0,t),this.scene.add(n)}createSwampPool(e,t){const n=1.5+this.rng()*2.5,i=new wn(n,8),a=new f({color:2767386,transparent:!0,opacity:.8}),o=new l(i,a);o.rotation.x=-Math.PI/2,o.position.set(e,.02,t),this.scene.add(o)}createArch(e,t){const n=new z,i=5+this.rng()*3,a=new f({color:6965818}),o=new Z(.8,i,.8),r=new l(o,a);r.position.set(-2,i/2,0),n.add(r);const c=new Z(.8,i,.8),h=new l(c,a);h.position.set(2,i/2,0),n.add(h);const d=new Z(5,.8,.8),u=new l(d,a);u.position.set(0,i,0),n.add(u),n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI,this.scene.add(n)}createHouse(e,t){const n=new z,i=3+this.rng()*2,a=2.5+this.rng()*1.5,o=3+this.rng()*2,r=new f({color:9075290}),c=new Z(i,a,o),h=new l(c,r);h.position.y=a/2,h.castShadow=!0,n.add(h);const d=new f({color:6957594}),u=new ce(Math.max(i,o)*.7,2,4),p=new l(u,d);p.position.y=a+1,p.rotation.y=Math.PI/4,p.castShadow=!0,n.add(p),n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI*2,this.scene.add(n)}createTechPillar(e,t){const n=4+this.rng()*4,i=new Z(.6,n,.6),a=new Bt({color:2767434,emissive:1122867,emissiveIntensity:.2}),o=new l(i,a);o.position.set(e,n/2,t),o.castShadow=!0,this.scene.add(o);const r=new vt(.5,.05,6,8),c=new We({color:52479}),h=new l(r,c);h.position.set(e,n*.7,t),h.rotation.x=Math.PI/2,this.scene.add(h)}createTechPanel(e,t){const n=new Z(2+this.rng()*2,1.5,.1),i=new Bt({color:1714746,emissive:17510,emissiveIntensity:.4}),a=new l(n,i);a.position.set(e,1.5,t),a.rotation.y=this.rng()*Math.PI,this.scene.add(a)}createStalagmite(e,t){const n=2+this.rng()*4,i=new ce(.4+this.rng()*.5,n,6),a=new f({color:4868666}),o=new l(i,a);o.position.set(e,n/2,t),o.castShadow=!0,this.scene.add(o)}createSnowMound(e,t){const n=2+this.rng()*3,i=new y(n,6,5),a=new f({color:14540270}),o=new l(i,a);o.position.set(e,-n*.5,t),o.scale.y=.4,this.scene.add(o)}createCloudPillar(e,t){const n=3+this.rng()*5,i=new A(.5,.8,n,8),a=new f({color:12303308}),o=new l(i,a);o.position.set(e,n/2,t),o.castShadow=!0,this.scene.add(o)}createFloatingRock(e,t){const n=1+this.rng()*2,i=new qi(n,0),a=new f({color:9079450}),o=new l(i,a);o.position.set(e,3+this.rng()*4,t),o.rotation.set(this.rng(),this.rng(),this.rng()),o.castShadow=!0,this.scene.add(o)}buildPirate(e,t){for(let n=0;n<5;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createShip(i,a)}for(let n=0;n<12;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createDock(i,a)}for(let n=0;n<20;n++){const i=6+this.rng()*(e-12),a=6+this.rng()*(t-12);this.createBarrel(i,a)}for(let n=0;n<8;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createWaterPool(i,a)}for(let n=0;n<6;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createCrate(i,a)}}createShip(e,t){const n=new z,i=new f({color:5913114}),a=new l(new Z(3,2,8),i);a.position.y=1.5,a.castShadow=!0,n.add(a);const o=new f({color:4861976}),r=new l(new A(.15,.2,7,6),o);r.position.y=5.5,n.add(r);const c=new f({color:15658700,side:Lt}),h=new l(new St(2.5,3),c);h.position.set(0,5,.3),n.add(h);const d=new We({color:1118481,side:Lt}),u=new l(new St(1,.7),d);u.position.set(0,8.5,0),n.add(u),n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI*2,this.scene.add(n)}createDock(e,t){const n=new z,i=new f({color:6967344}),a=new l(new Z(4,.2,2),i);a.position.y=.5,n.add(a);const o=new f({color:4861976}),r=new l(new A(.1,.12,1.5,5),o);r.position.set(-1.8,.3,0),n.add(r);const c=new l(new A(.1,.12,1.5,5),o);c.position.set(1.8,.3,0),n.add(c),n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI,this.scene.add(n)}createBarrel(e,t){const n=new f({color:6965802}),i=new l(new A(.4,.4,1,8),n);i.position.set(e,.5,t),i.castShadow=!0,this.scene.add(i);const a=new f({color:3815994}),o=new l(new vt(.4,.03,4,8),a);o.position.set(e,.8,t),o.rotation.x=Math.PI/2,this.scene.add(o)}createWaterPool(e,t){const n=3+this.rng()*4,i=new wn(n,10),a=new Bt({color:2254506,transparent:!0,opacity:.6}),o=new l(i,a);o.rotation.x=-Math.PI/2,o.position.set(e,.02,t),this.scene.add(o)}createCrate(e,t){const n=new f({color:8022586}),i=new l(new Z(1.2,1.2,1.2),n);i.position.set(e,.6,t),i.rotation.y=this.rng()*.5,i.castShadow=!0,this.scene.add(i)}buildCastle(e,t){for(let n=0;n<8;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createTower(i,a)}for(let n=0;n<12;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createCastleWall(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,.5+this.rng()*1.5,4868682)}}createTower(e,t){const n=new z,i=6+this.rng()*4,a=new f({color:5921370}),o=new l(new A(1.5,1.8,i,8),a);o.position.y=i/2,o.castShadow=!0,n.add(o);const r=new f({color:4868682}),c=new l(new A(1.8,1.5,.6,8),r);c.position.y=i+.3,n.add(c);const h=new f({color:3807770}),d=new l(new ce(1.6,2.5,8),h);d.position.y=i+1.8,n.add(d),n.position.set(e,0,t),this.scene.add(n)}createCastleWall(e,t){const n=5+this.rng()*6,i=3+this.rng()*2,a=new f({color:5921370}),o=new l(new Z(n,i,1),a);o.position.set(e,i/2,t),o.rotation.y=this.rng()*Math.PI,o.castShadow=!0,this.scene.add(o);for(let r=0;r<4;r++){const c=new l(new Z(.6,.8,1),a);c.position.set(e+(r-1.5)*1.5,i+.4,t),this.scene.add(c)}}buildTemple(e,t){for(let n=0;n<20;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createTemplePillar(i,a)}for(let n=0;n<6;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createAltar(i,a)}for(let n=0;n<8;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createStatue(i,a)}}createTemplePillar(e,t){const n=5+this.rng()*3,i=new f({color:9079402}),a=new l(new A(.5,.6,n,10),i);a.position.set(e,n/2,t),a.castShadow=!0,this.scene.add(a);const o=new f({color:10132090}),r=new l(new Z(1.4,.4,1.4),o);r.position.set(e,n+.2,t),this.scene.add(r)}createAltar(e,t){const n=new z,i=new f({color:8026730}),a=new l(new Z(3,.5,2),i);a.position.y=.25,n.add(a);const o=new l(new Z(2.5,.3,1.5),i);o.position.y=.65,n.add(o);const r=new gn(16768324,.8,8);r.position.y=1.5,n.add(r),n.position.set(e,0,t),this.scene.add(n)}createStatue(e,t){const n=new z,i=new f({color:6974042}),a=new l(new Z(1.2,.6,1.2),i);a.position.y=.3,n.add(a);const o=new l(new Z(.6,2,.5),i);o.position.y=1.6,n.add(o);const r=new l(new y(.35,6,5),i);r.position.y=2.95,n.add(r),n.position.set(e,0,t),this.scene.add(n)}buildCemetery(e,t){for(let n=0;n<35;n++){const i=6+this.rng()*(e-12),a=6+this.rng()*(t-12);this.createTombstone(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createDeadTree(i,a)}for(let n=0;n<5;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createCrypt(i,a)}}createTombstone(e,t){const n=new f({color:5921370}),i=1+this.rng()*.8,a=new l(new Z(.6,i,.15),n);if(a.position.set(e,i/2,t),a.rotation.z=(this.rng()-.5)*.2,a.castShadow=!0,this.scene.add(a),this.rng()>.5){const o=new l(new Z(.4,.1,.1),n);o.position.set(e,i+.1,t),this.scene.add(o)}}createCrypt(e,t){const n=new z,i=new f({color:4868682}),a=new l(new Z(3,1.5,3),i);a.position.y=.75,a.castShadow=!0,n.add(a);const o=new f({color:3815994}),r=new l(new ce(2.5,1.5,4),o);r.position.y=2.25,r.rotation.y=Math.PI/4,n.add(r),n.position.set(e,0,t),this.scene.add(n)}buildUnderwater(e,t){for(let n=0;n<30;n++){const i=6+this.rng()*(e-12),a=6+this.rng()*(t-12);this.createCoral(i,a)}for(let n=0;n<20;n++){const i=6+this.rng()*(e-12),a=6+this.rng()*(t-12);this.createSeaweed(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRuinWall(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createBubbleColumn(i,a)}}createCoral(e,t){const n=[16729190,16746564,16755234,11158783,4500223],i=n[Math.floor(this.rng()*n.length)],a=1+this.rng()*2,o=new ce(.3+this.rng()*.5,a,5+Math.floor(this.rng()*4)),r=new f({color:i}),c=new l(o,r);c.position.set(e,a/2,t),c.castShadow=!0,this.scene.add(c)}createSeaweed(e,t){const n=new z,i=new f({color:2779706}),a=2+Math.floor(this.rng()*3);for(let o=0;o<a;o++){const r=2+this.rng()*3,c=new l(new Z(.1,r,.3),i);c.position.set((this.rng()-.5)*.5,r/2,(this.rng()-.5)*.5),c.rotation.z=(this.rng()-.5)*.3,n.add(c)}n.position.set(e,0,t),this.scene.add(n)}createBubbleColumn(e,t){const n=new We({color:8965375,transparent:!0,opacity:.4});for(let i=0;i<5;i++){const a=.1+this.rng()*.2,o=new l(new y(a,5,4),n);o.position.set(e+(this.rng()-.5)*.5,1+i*1.2+this.rng(),t+(this.rng()-.5)*.5),this.scene.add(o)}}buildPalace(e,t){for(let n=0;n<20;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createMarblePillar(i,a)}for(let n=0;n<6;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createFountain(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createGardenBush(i,a)}for(let n=0;n<5;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createBanner(i,a)}}createMarblePillar(e,t){const n=5+this.rng()*3,i=new Bt({color:15658717}),a=new l(new A(.4,.5,n,10),i);a.position.set(e,n/2,t),a.castShadow=!0,this.scene.add(a);const o=new Bt({color:14527010,emissive:4465152,emissiveIntensity:.2}),r=new l(new Z(1.2,.3,1.2),o);r.position.set(e,n+.15,t),this.scene.add(r)}createFountain(e,t){const n=new z,i=new f({color:13421755}),a=new l(new A(2,2.2,.8,12),i);a.position.y=.4,n.add(a);const o=new l(new A(.3,.4,2,8),i);o.position.y=1.4,n.add(o);const r=new Bt({color:4491468,transparent:!0,opacity:.5}),c=new l(new wn(1.8,10),r);c.rotation.x=-Math.PI/2,c.position.y=.7,n.add(c),n.position.set(e,0,t),this.scene.add(n)}createGardenBush(e,t){const n=new f({color:2779690}),i=new l(new y(1+this.rng()*.5,6,5),n);if(i.position.set(e,.8,t),i.scale.set(1.2,.8,1.2),i.castShadow=!0,this.scene.add(i),this.rng()>.5){const a=new We({color:16729224});for(let o=0;o<3;o++){const r=new l(new y(.1,4,3),a);r.position.set(e+(this.rng()-.5)*.8,1.2,t+(this.rng()-.5)*.8),this.scene.add(r)}}}createBanner(e,t){const n=new z,i=new f({color:14527010}),a=new l(new A(.08,.08,5,6),i);a.position.y=2.5,n.add(a);const o=[13369344,17578,6946952],r=new f({color:o[Math.floor(this.rng()*o.length)],side:Lt}),c=new l(new St(1.2,2),r);c.position.set(.7,3.8,0),n.add(c),n.position.set(e,0,t),this.scene.add(n)}buildDark(e,t){for(let n=0;n<25;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createDarkSpire(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createPortal(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createFloatingRock(i,a)}}createDarkSpire(e,t){const n=4+this.rng()*6,i=new f({color:1710634}),a=new l(new ce(.5+this.rng()*.5,n,5),i);a.position.set(e,n/2,t),a.castShadow=!0,this.scene.add(a);const o=new gn(6693546,.5,6);o.position.set(e,n,t),this.scene.add(o)}createPortal(e,t){const n=new We({color:6693580,transparent:!0,opacity:.6}),i=new l(new vt(1.5,.2,8,12),n);i.position.set(e,2.5,t),i.rotation.x=Math.PI/2*this.rng(),this.scene.add(i);const a=new gn(8930559,1,10);a.position.set(e,2.5,t),this.scene.add(a)}buildAlien(e,t){for(let n=0;n<25;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createAlienPlant(i,a)}for(let n=0;n<12;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createAlienStructure(i,a)}for(let n=0;n<8;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createGlowPool(i,a)}}createAlienPlant(e,t){const n=new z,i=this.rng(),a=new Ce().setHSL(i,.8,.4),o=new Bt({color:a,emissive:a,emissiveIntensity:.2}),r=2+this.rng()*3,c=new l(new A(.1,.15,r,5),o);c.position.y=r/2,n.add(c);const h=new l(new y(.4+this.rng()*.3,6,5),o);h.position.y=r,n.add(h),n.position.set(e,0,t),this.scene.add(n)}createAlienStructure(e,t){const n=new z,i=new Bt({color:2771514,emissive:1127202,emissiveIntensity:.3}),a=3+this.rng()*4,o=Math.floor(this.rng()*3);let r;o===0?r=new Ja(1.5+this.rng()):o===1?r=new ao(1.5+this.rng()):r=new Ei(1+this.rng());const c=new l(r,i);c.position.y=a/2,c.rotation.set(this.rng(),this.rng(),this.rng()),n.add(c),n.position.set(e,0,t),this.scene.add(n)}createGlowPool(e,t){const n=2+this.rng()*3,i=this.rng(),a=new Ce().setHSL(i,.9,.4),o=new We({color:a,transparent:!0,opacity:.5}),r=new l(new wn(n,8),o);r.rotation.x=-Math.PI/2,r.position.set(e,.03,t),this.scene.add(r);const c=new gn(a,.8,10);c.position.set(e,.5,t),this.scene.add(c)}buildJungle(e,t){const n=50+Math.floor(this.rng()*30);for(let i=0;i<n;i++){const a=6+this.rng()*(e-12),o=6+this.rng()*(t-12);this.createJungleTree(a,o)}for(let i=0;i<25;i++){const a=4+this.rng()*(e-8),o=4+this.rng()*(t-8);this.createBush(a,o,1726986)}for(let i=0;i<15;i++){const a=6+this.rng()*(e-12),o=6+this.rng()*(t-12);this.createVine(a,o)}}createJungleTree(e,t){const n=new z,i=5+this.rng()*4,a=new f({color:3811856}),o=new l(new A(.3,.5,i,6),a);o.position.y=i/2,o.castShadow=!0,n.add(o);const r=new f({color:678410});for(let c=0;c<3;c++){const h=2+this.rng()*1.5,d=new l(new y(h,6,5),r);d.position.set((this.rng()-.5)*2,i+this.rng()*2,(this.rng()-.5)*2),d.castShadow=!0,n.add(d)}n.position.set(e,0,t),this.scene.add(n)}createVine(e,t){const n=new f({color:2775578}),i=4+this.rng()*5,a=new l(new A(.03,.03,i,4),n);a.position.set(e,i/2+2,t),a.rotation.z=(this.rng()-.5)*.3,this.scene.add(a)}buildBamboo(e,t){const n=80+Math.floor(this.rng()*40);for(let i=0;i<n;i++){const a=6+this.rng()*(e-12),o=6+this.rng()*(t-12);this.createBamboo(a,o)}for(let i=0;i<10;i++){const a=6+this.rng()*(e-12),o=6+this.rng()*(t-12);this.createRock(a,o,.8+this.rng()*1.5,6974058)}for(let i=0;i<5;i++){const a=10+this.rng()*(e-20),o=10+this.rng()*(t-20);this.createWaterPool(a,o)}}createBamboo(e,t){const n=5+this.rng()*5,i=new f({color:4885034}),a=new l(new A(.1,.12,n,6),i);a.position.set(e,n/2,t),a.castShadow=!0,this.scene.add(a);const o=new f({color:3832346});for(let r=0;r<2;r++){const c=new l(new St(.8,.2),o);c.position.set(e+(this.rng()-.5)*.4,n*.7+r*1.5,t),c.rotation.z=(this.rng()-.5)*.8,this.scene.add(c)}}buildMine(e,t){for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createMineSupport(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createMineCart(i,a)}for(let n=0;n<20;n++){const i=6+this.rng()*(e-12),a=6+this.rng()*(t-12);this.createRock(i,a,.5+this.rng()*2,3815978)}for(let n=0;n<15;n++){const i=6+this.rng()*(e-12),a=6+this.rng()*(t-12);this.createStalagmite(i,a)}}createMineSupport(e,t){const n=new z,i=new f({color:5914656}),a=new l(new Z(.3,3.5,.3),i);a.position.set(-1.5,1.75,0),n.add(a);const o=new l(new Z(.3,3.5,.3),i);o.position.set(1.5,1.75,0),n.add(o);const r=new l(new Z(3.5,.3,.3),i);r.position.set(0,3.5,0),n.add(r),n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI,this.scene.add(n)}createMineCart(e,t){const n=new z,i=new f({color:4868682}),a=new l(new Z(1.2,.6,1.8),i);a.position.y=.6,n.add(a);const o=new f({color:3815994});[[-.5,.2,-.7],[.5,.2,-.7],[-.5,.2,.7],[.5,.2,.7]].forEach(([c,h,d])=>{const u=new l(new A(.2,.2,.1,8),o);u.position.set(c,h,d),u.rotation.z=Math.PI/2,n.add(u)});const r=new f({color:5921338});for(let c=0;c<3;c++){const h=new l(new qi(.2,0),r);h.position.set((this.rng()-.5)*.6,1,(this.rng()-.5)*.8),n.add(h)}n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI,this.scene.add(n)}buildLab(e,t){for(let n=0;n<15;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createLabTable(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createTechPillar(i,a)}for(let n=0;n<8;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createTank(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createTechPanel(i,a)}}createLabTable(e,t){const n=new z,i=new f({color:6974074}),a=new l(new Z(2,.1,1.2),i);a.position.y=1,n.add(a);const o=new f({color:4868698});[[-.8,.5,-.5],[.8,.5,-.5],[-.8,.5,.5],[.8,.5,.5]].forEach(([h,d,u])=>{const p=new l(new Z(.1,1,.1),o);p.position.set(h,d,u),n.add(p)});const r=new Bt({color:4521864,transparent:!0,opacity:.5}),c=new l(new A(.1,.12,.4,6),r);c.position.set(0,1.25,0),n.add(c),n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI,this.scene.add(n)}createTank(e,t){const n=new z,i=new Bt({color:4500138,transparent:!0,opacity:.3}),a=new l(new A(.8,.8,3,10),i);a.position.y=1.5,n.add(a);const o=new We({color:2293606,transparent:!0,opacity:.4}),r=new l(new A(.7,.7,2,10),o);r.position.y=1.2,n.add(r);const c=new gn(2293606,.5,6);c.position.y=1.5,n.add(c),n.position.set(e,0,t),this.scene.add(n)}buildFortress(e,t){for(let n=0;n<8;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createIceTower(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createIceWall(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createSnowMound(i,a)}}createIceTower(e,t){const n=new z,i=6+this.rng()*4,a=new Bt({color:8960989,transparent:!0,opacity:.8}),o=new l(new A(1.2,1.5,i,8),a);o.position.y=i/2,o.castShadow=!0,n.add(o);const r=new Bt({color:11197951,transparent:!0,opacity:.7}),c=new l(new ce(1.3,2,6),r);c.position.y=i+1,n.add(c),n.position.set(e,0,t),this.scene.add(n)}createIceWall(e,t){const n=4+this.rng()*5,i=2.5+this.rng()*2,a=new Bt({color:8039099,transparent:!0,opacity:.7}),o=new l(new Z(n,i,.8),a);o.position.set(e,i/2,t),o.rotation.y=this.rng()*Math.PI,o.castShadow=!0,this.scene.add(o)}buildDragon(e,t){for(let n=0;n<8;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createDragonBones(i,a)}for(let n=0;n<10;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createLavaPool(i,a)}for(let n=0;n<15;n++){const i=8+this.rng()*(e-16),a=8+this.rng()*(t-16);this.createRock(i,a,1.5+this.rng()*3,3811866)}for(let n=0;n<6;n++){const i=10+this.rng()*(e-20),a=10+this.rng()*(t-20);this.createNest(i,a)}}createDragonBones(e,t){const n=new z,i=new f({color:14540219}),a=4+this.rng()*4,o=new l(new A(.2,.15,a,5),i);o.rotation.z=Math.PI/2,o.position.y=1,n.add(o);for(let c=0;c<5;c++){const h=new l(new A(.06,.04,1.5+this.rng()),i);h.position.set((c-2)*.8,1,0),h.rotation.z=Math.PI/2+(this.rng()-.5)*.5,n.add(h)}const r=new l(new Z(1,.6,1.2),i);r.position.set(a/2,1,0),n.add(r),n.position.set(e,0,t),n.rotation.y=this.rng()*Math.PI*2,this.scene.add(n)}createNest(e,t){const n=new z,i=new f({color:4864538}),a=new l(new A(2,2.5,.8,8),i);a.position.y=.4,n.add(a);const o=new f({color:14535833});for(let r=0;r<3;r++){const c=new l(new y(.3,6,5),o);c.position.set((this.rng()-.5)*1.2,.9,(this.rng()-.5)*1.2),c.scale.y=1.3,n.add(c)}n.position.set(e,0,t),this.scene.add(n)}}let xf=0;const Wa=class Wa{constructor(e,t,n,i,a){this.scene=e,this.arena=a,this.id=xf++,this.type=i,this.alive=!0,this.config=Wa.TYPES[i],this.speed=this.config.speed*(.8+Math.random()*.4),this.chaseSpeed=this.config.chaseSpeed||this.speed*2,this.wanderTimer=0,this.wanderDir=new N(Math.random()-.5,0,Math.random()-.5).normalize(),this.chasing=!1,this.points=this.config.points,this.health=this.config.health,this.attackDamage=this.config.attackDamage,this.attackRange=this.config.attackRange||2.5,this.attackCooldown=0,this.detectionRange=this.config.detectionRange||16,this.hitRadius=this.config.hitRadius||1,this.hitHeight=this.config.hitHeight||.5,this.isProtectedAlly=!1,this.dropMoney=0,this.dropTokens=0,this.mesh=this.config.createMesh(),this.mesh.position.set(t,0,n),e.add(this.mesh)}update(e,t){if(!this.alive)return null;this.attackCooldown-=e;const n=this.mesh.position,i=n.distanceTo(t);if(i<this.detectionRange){this.chasing=!0;const h=t.clone().sub(n).normalize();h.y=0,this.wanderDir.copy(h)}else this.chasing=!1;this.chasing||(this.wanderTimer-=e,this.wanderTimer<=0&&(this.wanderDir.set(Math.random()-.5,0,Math.random()-.5).normalize(),this.wanderTimer=2+Math.random()*3));const a=this.chasing?this.chaseSpeed:this.speed,o=n.x+this.wanderDir.x*a*e,r=n.z+this.wanderDir.z*a*e;this.arena&&!this.arena.isPassable(o,r)?(this.wanderDir.negate(),this.wanderTimer=0):(n.x=o,n.z=r);const c=Math.atan2(this.wanderDir.x,this.wanderDir.z);return this.mesh.rotation.y=c,this.type==="tucano"||this.type==="arara"||this.type==="harpia"||this.type==="urubu"||this.type==="gaviao"||this.type==="coruja"||this.type==="aguia"||this.type==="falcao"||this.type==="condor"||this.type==="grifo"||this.type==="fenix"||this.type==="pegasus"||this.type==="anjo"?this.mesh.position.y=2+Math.sin(performance.now()*.004)*.3:this.mesh.position.y=Math.sin(performance.now()*.005*a)*.03,i<this.attackRange&&this.attackCooldown<=0?(this.attackCooldown=6,this.spawnAttackHitbox(),this.attackDamage):null}spawnAttackHitbox(){const e=this.mesh.position.clone(),t=new N(Math.sin(this.mesh.rotation.y),0,Math.cos(this.mesh.rotation.y));e.add(t.multiplyScalar(1.2)),e.y+=.8;const n=new y(.6,6,4),i=new We({color:16720384,transparent:!0,opacity:.5}),a=new l(n,i);a.position.copy(e),this.scene.add(a),setTimeout(()=>{this.scene.remove(a),n.dispose(),i.dispose()},300)}takeDamage(e){return this.health-=e,this.health<=0?(this.die(),!0):(this.spawnBloodSmall(),!1)}die(){this.alive=!1,at.animalScream(),this.spawnBlood(),this.dropMoney=81+Math.floor(Math.random()*233),this.dropTokens=Math.random()<.02?1+Math.floor(Math.random()*5):0;const e=this.mesh.position.clone(),t=this.mesh.rotation.y;this.mesh.scale.set(1,.1,1),this.mesh.position.y=0,setTimeout(()=>{this.scene.remove(this.mesh),this.spawnSkeleton(e,t),this.spawnBBQ(e)},1e3)}getDropMoney(){const e=this.dropMoney;return this.dropMoney=0,e}getDropTokens(){const e=this.dropTokens;return this.dropTokens=0,e}spawnBBQ(e){const t=new z,n=new f({color:2236962}),i=new f({color:6963232}),a=new We({color:16729088}),o=new f({color:9067050}),r=new l(new A(.42,.3,.35,10,1,!0),n);r.position.y=.18,t.add(r);const c=new l(new A(.38,.38,.06,10),a);c.position.y=.35,t.add(c);for(let v=0;v<3;v++){const E=new l(new A(.05,.05,.7,5),i);E.rotation.z=Math.PI/2,E.rotation.y=v*Math.PI/3,E.position.y=.1,t.add(E)}const h=new l(new A(.02,.02,1.4,5).rotateZ(Math.PI/2),new f({color:10066329}));h.position.y=.75,t.add(h);const d=new l(new y(.28,8,6).scale(1,.85,1.3),o);d.position.y=.75,t.add(d);const u=new l(new y(.13,6,5),o);u.position.set(0,.75,.42),t.add(u);const p=new A(.035,.035,.3,4),m=new l(p,o);m.position.set(.2,.6,.1),m.rotation.z=.5,t.add(m);const x=m.clone();x.position.set(-.2,.6,.1),x.rotation.z=-.5,t.add(x);const _=new l(new ce(.12,.4,6),new We({color:16746496,transparent:!0,opacity:.7}));_.position.y=.55,t.add(_),t.position.set(e.x,0,e.z),this.scene.add(t);const w=[];for(let v=0;v<12;v++){const E=new l(new y(.02,3,2),new We({color:16733440,transparent:!0}));E.position.copy(t.position).add(new N((Math.random()-.5)*.4,.4+Math.random()*.4,(Math.random()-.5)*.4)),this.scene.add(E),w.push({mesh:E,vel:new N((Math.random()-.5)*1.2,1.2+Math.random()*1.5,(Math.random()-.5)*1.2),life:0})}const g=1.6,S=()=>{let v=!1;const E=.016;for(const I of w)I.life>=g||(v=!0,I.life+=E,I.vel.y+=.4*E,I.mesh.position.x+=I.vel.x*E,I.mesh.position.y+=I.vel.y*E,I.mesh.position.z+=I.vel.z*E,I.mesh.material.opacity=Math.max(0,1-I.life/g));if(v)requestAnimationFrame(S);else for(const I of w)this.scene.remove(I.mesh),I.mesh.geometry.dispose(),I.mesh.material.dispose()};requestAnimationFrame(S),setTimeout(()=>{this.scene.remove(t),t.traverse(v=>{v.geometry&&v.geometry.dispose(),v.material&&v.material.dispose()})},6e3)}spawnSkeleton(e,t){const n=new z,i=new f({color:14540219}),a=new f({color:13421738}),o=["jacare","anta","sucuri","onca","dinossauro","urso","pirarucu","jiboia","mapinguari","lobisomem"].includes(this.type),r=["tucano","arara","harpia","urubu","gaviao","coruja","sagui","micoleao"].includes(this.type),c=o?1.4:r?.5:1,h=new l(new A(.03*c,.03*c,1.2*c,4),i);h.rotation.z=Math.PI/2,n.add(h);const d=new l(new y(.14*c,5,4),i);d.position.set(0,0,.7*c),d.scale.y=.6,n.add(d);const u=o?5:r?2:3;for(let p=0;p<u;p++){const m=new l(new A(.012*c,.012*c,.4*c,4),a);m.position.set(0,0,-.2*c+p*.25*c),m.rotation.z=Math.PI/2,m.rotation.y=.3,n.add(m)}if(!r){const p=new A(.015*c,.015*c,.35*c,4);[[-.25,0,-.3],[.25,0,-.3],[-.25,0,.3],[.25,0,.3]].forEach(([m,x,_])=>{const w=new l(p,i);w.position.set(m*c,x,_*c),w.rotation.z=Math.PI/2+(Math.random()-.5)*.5,n.add(w)})}n.position.set(e.x,.05,e.z),n.rotation.y=t,this.scene.add(n)}spawnBloodSmall(){const e=this.mesh.position.clone();e.y+=.5;const t=[];for(let o=0;o<8;o++){const r=.05+Math.random()*.08,c=new y(r/2,4,3),h=.3+Math.random()*.4,d=new We({color:new Ce(h,0,0)}),u=new l(c,d);u.position.copy(e);const p=new N((Math.random()-.5)*5,Math.random()*4+1,(Math.random()-.5)*5);this.scene.add(u),t.push({mesh:u,vel:p,life:0})}const n=15,i=.8,a=()=>{let o=!1;const r=.016;for(const c of t)c.life>=i||(o=!0,c.life+=r,c.vel.y-=n*r,c.mesh.position.x+=c.vel.x*r,c.mesh.position.y+=c.vel.y*r,c.mesh.position.z+=c.vel.z*r,c.mesh.position.y<.02&&(c.mesh.position.y=.02,c.vel.y=0),c.mesh.material.opacity=1-c.life/i,c.mesh.material.transparent=!0);if(o)requestAnimationFrame(a);else for(const c of t)this.scene.remove(c.mesh),c.mesh.geometry.dispose(),c.mesh.material.dispose()};requestAnimationFrame(a)}spawnBlood(){const e=this.mesh.position.clone();e.y+=.5;const t=15,n=[];for(let r=0;r<t;r++){const c=.06+Math.random()*.1,h=new y(c/2,4,3),d=.3+Math.random()*.4,u=new We({color:new Ce(d,0,0)}),p=new l(h,u);p.position.copy(e);const m=new N((Math.random()-.5)*6,Math.random()*5+1,(Math.random()-.5)*6);this.scene.add(p),n.push({mesh:p,vel:m,life:0})}const i=15,a=1.2,o=()=>{let r=!1;const c=.016;for(const h of n)h.life>=a||(r=!0,h.life+=c,h.vel.y-=i*c,h.mesh.position.x+=h.vel.x*c,h.mesh.position.y+=h.vel.y*c,h.mesh.position.z+=h.vel.z*c,h.mesh.position.y<.02&&(h.mesh.position.y=.02,h.vel.y=0,h.vel.x*=.5,h.vel.z*=.5),h.mesh.material.opacity=1-h.life/a,h.mesh.material.transparent=!0);if(r)requestAnimationFrame(o);else for(const h of n)this.scene.remove(h.mesh),h.mesh.geometry.dispose(),h.mesh.material.dispose()};requestAnimationFrame(o)}};go(Wa,"TYPES",{jacare:{name:"Jacaré",speed:1.5,chaseSpeed:5,points:3,health:60,attackDamage:15,attackRange:3,detectionRange:14,createMesh(){const e=new z,t=new f({color:3820074}),n=new f({color:2767386}),i=new f({color:8030810}),a=new f({color:4872762}),o=new f({color:15658734});for(let g=0;g<5;g++){const S=.28-g*.03,v=new l(new y(S,8,6),g%2===0?t:n);v.scale.set(1,.6,1.15),v.position.set(0,.32,-.8+g*.42),v.castShadow=!0,e.add(v)}const r=new l(new y(.24,8,4),i);r.scale.set(.9,.5,1.6),r.position.set(0,.16,.1),e.add(r);const c=new l(new y(.5,8,6).scale(.45,.28,.6),a);c.position.set(0,.32,1.15),c.castShadow=!0,e.add(c);const h=new l(new Z(.55,.22,.8),a);h.position.set(0,.3,1.7),e.add(h);const d=new l(new Z(.5,.12,.7),n);d.position.set(0,.22,1.55),e.add(d);for(let g=-1;g<=1;g+=2){const S=new l(new ce(.025,.09,4),o);S.position.set(g*.12,.28,1.85),e.add(S)}const u=new y(.06,4,4),p=new f({color:16776960}),m=new l(u,p);m.position.set(-.22,.48,1.3),e.add(m);const x=m.clone();x.position.set(.22,.48,1.3),e.add(x);for(let g=0;g<4;g++){const S=new l(new y(.06,4,3),n);S.position.set(0,.52,.3+g*.35),S.scale.set(1,.8,.7),e.add(S)}for(let g=0;g<4;g++){const S=.16-g*.03,v=new l(new y(S,6,4),g%2===0?t:n);v.scale.set(1,.8,1.4),v.position.set(0,.24,-1.9-g*.3),e.add(v)}const _=new A(.1,.1,.22,6),w=new f({color:2767386});return[[-.32,.11,.75],[.32,.11,.75],[-.32,.11,-.5],[.32,.11,-.5]].forEach(([g,S,v])=>{const E=new l(_,w);E.position.set(g,S,v),e.add(E)}),e}},tucano:{name:"Tucano",speed:3,chaseSpeed:8,points:5,health:20,attackDamage:8,attackRange:2,detectionRange:20,createMesh(){const e=new z,t=new f({color:1315860}),n=new f({color:2763306}),i=new f({color:16768307}),a=new f({color:16746496}),o=new f({color:13369344}),r=new l(new y(.32,8,6).scale(1,1.05,1.3),t);r.position.y=3.5,r.castShadow=!0,e.add(r);const c=new l(new y(.22,6,5),i);c.position.set(0,3.4,.2),e.add(c);const h=new l(new y(.17,6,5),t);h.position.set(0,3.7,.5),e.add(h);const d=new l(new y(.08,5,4),new f({color:16768324}));d.scale.set(1,.8,.6),d.position.set(0,3.75,.62),e.add(d);const u=new l(new ce(.08,.55,6).rotateX(Math.PI/2),a);u.position.set(0,3.7,.8),e.add(u);const p=new l(new ce(.06,.35,6).rotateX(Math.PI/2),a);p.position.set(0,3.7,1.1),e.add(p);const m=new l(new ce(.05,.2,6).rotateX(Math.PI/2),o);m.position.set(0,3.7,1.35),e.add(m);const x=new l(new y(.05,4,4),new f({color:16777215}));x.position.set(-.13,3.78,.6),e.add(x);const _=new l(new y(.025,4,3),new f({color:0}));_.position.set(-.13,3.78,.66),e.add(_);const w=x.clone();w.position.set(.13,3.78,.6),e.add(w);const g=_.clone();g.position.set(.13,3.78,.66),e.add(g);const S=new y(.5,8,6).scale(.75,.06,.4),v=new l(S,n);v.position.set(-.42,3.5,0),e.add(v);const E=v.clone();E.position.set(.42,3.5,0),e.add(E);const I=new y(.5,8,6).scale(.3,.05,.3),C=new l(I,t);C.position.set(-.62,3.5,0),e.add(C);const P=C.clone();P.position.set(.62,3.5,0),e.add(P);const k=new l(new y(.5,8,6).scale(.12,.06,.5),o);return k.position.set(0,3.45,-.55),e.add(k),e}},anta:{name:"Anta",speed:2,chaseSpeed:6,points:2,health:80,attackDamage:10,attackRange:3,detectionRange:12,createMesh(){const e=new z,t=new y(.5,8,6).scale(1.4,1.2,2.5),n=new f({color:4864554}),i=new l(t,n);i.position.y=1,i.castShadow=!0,e.add(i);const a=new y(.5,8,6).scale(.7,.7,1),o=new f({color:5917242}),r=new l(a,o);r.position.set(0,1.2,1.5),r.castShadow=!0,e.add(r);const c=new A(.12,.08,.6,5),h=new f({color:5917242}),d=new l(c,h);d.position.set(0,1.1,2.1),d.rotation.x=Math.PI/4,e.add(d);const u=new y(.15,4,4),p=new f({color:4864554}),m=new l(u,p);m.position.set(-.35,1.6,1.3),e.add(m);const x=m.clone();x.position.set(.35,1.6,1.3),e.add(x);const _=new A(.15,.15,.7,6),w=new f({color:3811866});return[[-.45,.35,-.8],[.45,.35,-.8],[-.45,.35,.8],[.45,.35,.8]].forEach(([g,S,v])=>{const E=new l(_,w);E.position.set(g,S,v),E.castShadow=!0,e.add(E)}),e}},queixada:{name:"Queixada",speed:3,chaseSpeed:8,points:2,health:35,attackDamage:12,attackRange:2.5,detectionRange:15,createMesh(){const e=new z,t=new y(.5,8,6).scale(.8,.6,1.4),n=new f({color:2763306}),i=new l(t,n);i.position.y=.5,i.castShadow=!0,e.add(i);const a=new y(.5,8,6).scale(.5,.5,.6),o=new f({color:3815994}),r=new l(a,o);r.position.set(0,.55,.9),r.castShadow=!0,e.add(r);const c=new y(.5,8,6).scale(.35,.15,.3),h=new f({color:13421772}),d=new l(c,h);d.position.set(0,.4,1.1),e.add(d);const u=new y(.5,8,6).scale(.25,.2,.2),p=new f({color:5583667}),m=new l(u,p);m.position.set(0,.5,1.25),e.add(m);const x=new A(.075,.075,.35,6),_=new f({color:1710618});return[[-.25,.17,-.4],[.25,.17,-.4],[-.25,.17,.4],[.25,.17,.4]].forEach(([w,g,S])=>{const v=new l(x,_);v.position.set(w,g,S),e.add(v)}),e}},arara:{name:"Arara",speed:4,chaseSpeed:10,points:4,health:15,attackDamage:6,attackRange:2,detectionRange:22,createMesh(){const e=new z,t=new y(.25,6,5),n=new f({color:17612}),i=new l(t,n);i.position.y=4,i.castShadow=!0,e.add(i);const a=new y(.15,5,4),o=new f({color:17612}),r=new l(a,o);r.position.set(0,4.2,.2),e.add(r);const c=new ce(.08,.2,4),h=new f({color:2236962}),d=new l(c,h);d.position.set(0,4.15,.35),d.rotation.x=Math.PI/2,e.add(d);const u=new y(.5,8,6).scale(.2,.1,.05),p=new f({color:16777164}),m=new l(u,p);m.position.set(0,4.2,.32),e.add(m);const x=new y(.5,8,6).scale(1.2,.04,.4),_=new f({color:17612}),w=new l(x,_);w.position.set(-.7,4,0),e.add(w);const g=w.clone();g.position.set(.7,4,0),e.add(g);const S=new y(.5,8,6).scale(.4,.03,.3),v=new f({color:16763904}),E=new l(S,v);E.position.set(-1.2,4,0),e.add(E);const I=E.clone();I.position.set(1.2,4,0),e.add(I);const C=new y(.5,8,6).scale(.08,.03,1),P=new f({color:13369344}),k=new l(C,P);return k.position.set(0,3.9,-.7),e.add(k),e}},sucuri:{name:"Sucuri",speed:1.5,chaseSpeed:4,points:6,health:100,attackDamage:20,attackRange:3,detectionRange:10,createMesh(){const e=new z,t=10,n=new f({color:2771482}),i=new f({color:1718794});for(let p=0;p<t;p++){const m=.15-p*.008,x=new y(m,5,4),_=p%2===0?n:i,w=new l(x,_);w.position.set(Math.sin(p*.5)*.3,.15,-p*.28),w.scale.set(1,.7,1.3),e.add(w)}const a=new y(.5,8,6).scale(.2,.12,.3),o=new f({color:3824170}),r=new l(a,o);r.position.set(0,.15,.3),e.add(r);const c=new y(.04,4,4),h=new f({color:11184640}),d=new l(c,h);d.position.set(-.08,.22,.35),e.add(d);const u=d.clone();return u.position.set(.08,.22,.35),e.add(u),e}},onca:{name:"Onca-Pintada",speed:4,chaseSpeed:12,points:8,health:120,attackDamage:25,attackRange:3,detectionRange:20,hitRadius:1.6,hitHeight:.8,createMesh(){const e=new z,t=new f({color:13408563}),n=new f({color:9067034}),i=new f({color:15786160}),a=new f({color:3811850}),o=new l(new y(.5,8,6).scale(.9,.75,1.3),t);o.position.y=.8,o.castShadow=!0,e.add(o);const r=new l(new y(.5,8,6).scale(.75,.7,.6),n);r.position.set(0,.8,-.75),e.add(r);const c=new l(new y(.5,8,6).scale(.7,.3,1),i);c.position.set(0,.5,.1),e.add(c);const h=new l(new A(.22,.26,.35,8),t);h.position.set(0,1.05,.85),h.rotation.x=.3,e.add(h);const d=new l(new y(.5,8,6).scale(.55,.5,.55),t);d.position.set(0,1.15,1.15),e.add(d);const u=new l(new y(.5,8,6).scale(.32,.22,.3),t);u.position.set(0,1.05,1.5),e.add(u);const p=new l(new y(.05,4,3),new f({color:1706506}));p.position.set(0,1.05,1.68),e.add(p);const m=new ce(.07,.14,4),x=new l(m,n);x.position.set(-.25,1.5,1.15),e.add(x);const _=x.clone();_.position.set(.25,1.5,1.15),e.add(_);const w=new y(.05,4,4),g=new f({color:16777028}),S=new l(w,g);S.position.set(-.24,1.3,1.45),e.add(S);const v=S.clone();v.position.set(.24,1.3,1.45),e.add(v);const E=[[.15,.95,.1],[.35,.9,-.2],[-.2,.85,.3],[-.35,.95,-.3],[.25,1,-.5],[-.1,.9,-.55]];for(const[U,O,L]of E){const H=new l(new y(.06,4,3),a);H.scale.set(1,.7,1),H.position.set(U,O,L),e.add(H)}const I=new l(new A(.06,.04,1.1,6),t);I.position.set(0,.85,-1.35),I.rotation.x=.3,e.add(I);const C=new l(new vt(.06,.012,4,6),a);C.position.set(0,.72,-1.55),C.rotation.x=Math.PI/2,e.add(C);const P=C.clone();P.position.set(0,.6,-1.75),e.add(P);const k=new l(new y(.06,4,3),n);k.position.set(0,.55,-1.85),e.add(k);const b=new A(.11,.09,.6,6),M=new f({color:12290082});return[[-.3,.3,-.6],[.3,.3,-.6],[-.3,.3,.5],[.3,.3,.5]].forEach(U=>{const O=new l(b,M);O.position.set(...U),O.castShadow=!0,e.add(O)}),e}},dinossauro:{name:"Dinossauro",speed:8,chaseSpeed:14,points:4,health:180,attackDamage:12,attackRange:3.5,detectionRange:18,hitRadius:2.2,hitHeight:2.1,createMesh(){const e=new z;e.scale.setScalar(1.6);const t=new f({color:1985835}),n=new f({color:1324318}),i=new f({color:4160842}),a=new f({color:15658734}),o=new l(new y(.5,8,6).scale(1.1,.9,1),t);o.position.y=1.1,o.castShadow=!0,e.add(o);const r=new l(new y(.5,8,6).scale(.95,.95,.9),t);r.position.set(0,1.35,.9),r.castShadow=!0,e.add(r);const c=new l(new y(.5,8,6).scale(.85,.4,1.4),i);c.position.set(0,.85,.4),e.add(c);const h=new l(new A(.3,.42,.9,8),t);h.position.set(0,2,1.2),h.rotation.x=-.5,e.add(h);const d=new l(new A(.22,.3,.6,8),n);d.position.set(0,2.55,1.55),d.rotation.x=-.35,e.add(d);const u=new l(new y(.5,8,6).scale(.45,.38,.6),t);u.position.set(0,2.85,1.9),e.add(u);const p=new l(new Z(.55,.25,.8),n);p.position.set(0,2.6,2.1),e.add(p);for(let U=-2;U<=2;U++){const O=new l(new ce(.035,.14,4),a);O.position.set(U*.1,2.55,2.3),O.rotation.x=Math.PI,e.add(O)}for(let U=-1;U<=1;U++){const O=new l(new ce(.035,.12,4),a);O.position.set(U*.1,2.68,2.28),e.add(O)}const m=new y(.06,4,4),x=new f({color:16763904}),_=new l(m,x);_.position.set(-.22,2.95,2.15),e.add(_);const w=_.clone();w.position.set(.22,2.95,2.15),e.add(w);const g=new l(new y(.05,4,3),n);g.position.set(0,2.8,2.45),e.add(g);const S=new f({color:2779962});for(let U=0;U<6;U++){const O=new l(new ce(.09,.35,4),S);O.position.set(0,1.55+U*.12,-.3+U*.38),e.add(O)}for(let U=0;U<6;U++){const O=.34-U*.045,L=new l(new y(O,6,4),U%2===0?t:n);L.scale.set(1,.8,1.4),L.position.set(0,.95-U*.06,-1.1-U*.34),e.add(L)}const v=new l(new y(.08,5,4),n);v.position.set(0,.6,-3.2),e.add(v);const E=new A(.22,.16,.9,7),I=new f({color:1324318}),C=new f({color:14209208}),P=new ce(.05,.16,4);[[-.45,.45,.65],[.45,.45,.65],[-.45,.45,-.6],[.45,.45,-.6]].forEach(([U,O,L])=>{const H=new l(E,I);H.position.set(U,O,L),H.castShadow=!0,e.add(H);for(let q=-1;q<=1;q+=2){const ee=new l(P,C);ee.position.set(U+q*.1,.06,L),ee.rotation.x=Math.PI,e.add(ee)}});const k=new A(.07,.06,.4,5),b=new l(k,n);b.position.set(-.35,1.5,1.2),b.rotation.z=.5,e.add(b);const M=b.clone();return M.position.set(.35,1.5,1.2),M.rotation.z=-.5,e.add(M),e}},loboguara:{name:"Lobo-Guara",speed:5,chaseSpeed:11,points:6,health:70,attackDamage:15,attackRange:2.5,detectionRange:22,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.6,1.4),new f({color:11158528}));t.position.y=1.2,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.4,.4,.5),new f({color:11158528}));n.position.set(0,1.4,.8),e.add(n);const i=new l(new ce(.075,.3,6).rotateX(Math.PI/2),new f({color:2236962}));i.position.set(0,1.3,1.1),e.add(i);const a=new A(.06,.06,1,6),o=new f({color:1118481});return[[-.2,.5,-.4],[.2,.5,-.4],[-.2,.5,.4],[.2,.5,.4]].forEach(r=>{const c=new l(a,o);c.position.set(...r),e.add(c)}),e}},micoleao:{name:"Mico-Leao",speed:5,chaseSpeed:9,points:4,health:20,attackDamage:6,attackRange:2,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.25,.25,.5),new f({color:16746496}));t.position.y=.8,e.add(t);const n=new l(new y(.15,5,4),new f({color:16755234}));n.position.set(0,.95,.3),e.add(n);const i=new l(new y(.2,5,4),new f({color:16763972}));i.position.set(0,.95,.3),i.scale.set(1.3,1.3,.8),e.add(i);const a=new l(new A(.03,.02,.6,4),new f({color:16746496}));return a.position.set(0,.9,-.5),a.rotation.x=-.5,e.add(a),e}},tamandua:{name:"Tamandua",speed:1.5,chaseSpeed:4,points:3,health:90,attackDamage:18,attackRange:3.5,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.8,.7,2),new f({color:3815994}));t.position.y=.8,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.82,.4,.8),new f({color:15658734}));n.position.set(0,.8,.3),e.add(n);const i=new l(new y(.5,8,6).scale(.3,.3,1),new f({color:3815994}));i.position.set(0,.9,1.5),e.add(i);const a=new l(new y(.5,8,6).scale(.5,.6,1.5),new f({color:3815994}));return a.position.set(0,1,-1.5),e.add(a),e}},tatu:{name:"Tatu-Bola",speed:2,chaseSpeed:5,points:2,health:60,attackDamage:8,attackRange:2,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.5,8,6),new f({color:6969930}));t.position.y=.5,t.scale.set(1,.7,1.3),t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.2,.3),new f({color:5917242}));n.position.set(0,.4,.7),e.add(n);const i=new A(.05,.05,.25,6),a=new f({color:4864554});return[[-.25,.12,-.3],[.25,.12,-.3],[-.25,.12,.3],[.25,.12,.3]].forEach(o=>{e.add(new l(i,a).translateX(o[0]).translateY(o[1]).translateZ(o[2]))}),e}},preguica:{name:"Preguica",speed:.5,chaseSpeed:1.5,points:1,health:40,attackDamage:4,attackRange:2,detectionRange:6,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.4,.7),new f({color:6969914}));t.position.y=1.5,e.add(t);const n=new l(new y(.2,5,4),new f({color:8022602}));n.position.set(0,1.7,.35),e.add(n);const i=new A(.05,.05,.7,6),a=new f({color:5917226}),o=new l(i,a);o.position.set(-.3,1.2,0),e.add(o);const r=new l(i,a);return r.position.set(.3,1.2,0),e.add(r),e}},pirarucu:{name:"Pirarucu",speed:2,chaseSpeed:6,points:5,health:80,attackDamage:12,attackRange:3,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.8,2.5),new f({color:4872778}));t.position.y=.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.05,.6,.5),new f({color:6961706}));n.position.set(0,.5,-1.4),e.add(n);const i=new l(new y(.5,8,6).scale(.4,.5,.5),new f({color:3820090}));return i.position.set(0,.5,1.4),e.add(i),e}},boto:{name:"Boto-Rosa",speed:3,chaseSpeed:7,points:4,health:60,attackDamage:10,attackRange:2.5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.5,2),new f({color:14518425}));t.position.y=.5,t.castShadow=!0,e.add(t);const n=new l(new ce(.075,.7,6).rotateX(Math.PI/2),new f({color:13399944}));n.position.set(0,.5,1.2),e.add(n);const i=new l(new y(.5,8,6).scale(.05,.4,.4),new f({color:13399944}));i.position.set(0,.9,0),e.add(i);const a=new l(new y(.5,8,6).scale(.6,.05,.3),new f({color:14518425}));return a.position.set(0,.5,-1.2),e.add(a),e}},harpia:{name:"Harpia",speed:4,chaseSpeed:12,points:7,health:50,attackDamage:20,attackRange:3,detectionRange:25,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.4,.7),new f({color:4473924}));t.position.y=4,t.castShadow=!0,e.add(t);const n=new l(new y(.2,5,4),new f({color:15658734}));n.position.set(0,4.3,.3),e.add(n);const i=new l(new ce(.06,.15,4),new f({color:2236962}));i.position.set(0,4.25,.5),i.rotation.x=Math.PI/2,e.add(i);const a=new y(.5,8,6).scale(1.8,.05,.5),o=new f({color:3355443}),r=new l(a,o);r.position.set(-1,4,0),e.add(r);const c=new l(a,o);c.position.set(1,4,0),e.add(c);const h=new l(new y(.5,8,6).scale(.3,.2,.05),new f({color:3355443}));return h.position.set(0,4.5,.2),e.add(h),e}},sagui:{name:"Sagui",speed:5,chaseSpeed:9,points:3,health:15,attackDamage:5,attackRange:2,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.2,.2,.35),new f({color:4868682}));t.position.y=.7,e.add(t);const n=new l(new y(.12,5,4),new f({color:5921370}));n.position.set(0,.85,.2),e.add(n);const i=new f({color:16777215}),a=new l(new y(.06,4,3),i);a.position.set(-.12,.95,.2),e.add(a);const o=a.clone();o.position.set(.12,.95,.2),e.add(o);const r=new l(new A(.02,.015,.5,4),new f({color:3815994}));return r.position.set(0,.7,-.4),r.rotation.x=-.5,e.add(r),e}},gamba:{name:"Gamba",speed:2.5,chaseSpeed:5,points:1,health:25,attackDamage:4,attackRange:2,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.3,.7),new f({color:5592405}));t.position.y=.4,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.2,.3),new f({color:13421772}));n.position.set(0,.45,.45),e.add(n);const i=new l(new ce(.03,.08,6).rotateX(Math.PI/2),new f({color:16737928}));i.position.set(0,.42,.62),e.add(i);const a=new l(new A(.03,.02,.7,4),new f({color:14535884}));return a.position.set(0,.35,-.6),a.rotation.x=.3,e.add(a),e}},paca:{name:"Paca",speed:3,chaseSpeed:7,points:2,health:35,attackDamage:7,attackRange:2,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.4,.9),new f({color:6965802}));t.position.y=.4,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.35,.3,.35),new f({color:8018490}));n.position.set(0,.45,.55),e.add(n);for(let i=0;i<4;i++){const a=new l(new y(.04,4,3),new f({color:14540236}));a.position.set((Math.random()-.5)*.4,.45,(Math.random()-.5)*.6),e.add(a)}return e}},cutia:{name:"Cutia",speed:4,chaseSpeed:9,points:2,health:25,attackDamage:5,attackRange:2,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.3,.6),new f({color:9067050}));t.position.y=.35,e.add(t);const n=new l(new y(.5,8,6).scale(.2,.2,.25),new f({color:10119738}));n.position.set(0,.4,.4),e.add(n);const i=new A(.04,.04,.25,6),a=new f({color:6965786});return[[-.1,.12,-.2],[.1,.12,-.2],[-.1,.12,.15],[.1,.12,.15]].forEach(o=>{e.add(new l(i,a).translateX(o[0]).translateY(o[1]).translateZ(o[2]))}),e}},veado:{name:"Veado-Campeiro",speed:5,chaseSpeed:10,points:3,health:45,attackDamage:10,attackRange:2.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.6,1.4),new f({color:10123850}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.3,.35,.4),new f({color:11176538}));n.position.set(0,1.4,.8),e.add(n);const i=new l(new A(.02,.02,.4,4),new f({color:5917242}));i.position.set(-.1,1.7,.8),i.rotation.z=.3,e.add(i);const a=i.clone();a.position.set(.1,1.7,.8),a.rotation.z=-.3,e.add(a);const o=new A(.05,.05,.8,6),r=new f({color:8018490});return[[-.2,.4,-.4],[.2,.4,-.4],[-.2,.4,.4],[.2,.4,.4]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},jaguatirica:{name:"Jaguatirica",speed:4.5,chaseSpeed:11,points:5,health:55,attackDamage:14,attackRange:2.5,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.45,1.2),new f({color:12290099}));t.position.y=.6,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.35,.3,.35),new f({color:13408580}));n.position.set(0,.75,.7),e.add(n);const i=new A(.06,.06,.45,6),a=new f({color:11171618});[[-.18,.22,-.35],[.18,.22,-.35],[-.18,.22,.35],[.18,.22,.35]].forEach(r=>{e.add(new l(i,a).translateX(r[0]).translateY(r[1]).translateZ(r[2]))});const o=new l(new A(.04,.03,.8,4),new f({color:12290099}));return o.position.set(0,.6,-.9),o.rotation.x=.3,e.add(o),e}},piranha:{name:"Piranha",speed:4,chaseSpeed:10,points:2,health:10,attackDamage:8,attackRange:2,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.15,.3,.4),new f({color:4872810}));t.position.y=.4,e.add(t);const n=new l(new y(.5,8,6).scale(.14,.12,.25),new f({color:13382451}));n.position.set(0,.3,0),e.add(n);const i=new l(new y(.5,8,6).scale(.1,.08,.1),new f({color:15658734}));return i.position.set(0,.35,.22),e.add(i),e}},caititu:{name:"Caititu",speed:3,chaseSpeed:7,points:2,health:40,attackDamage:10,attackRange:2.5,detectionRange:13,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.5,1),new f({color:3815994}));t.position.y=.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.62,.15,.2),new f({color:13421738}));n.position.set(0,.6,.3),e.add(n);const i=new l(new y(.5,8,6).scale(.4,.35,.4),new f({color:4868682}));i.position.set(0,.55,.65),e.add(i);const a=new l(new y(.5,8,6).scale(.2,.15,.15),new f({color:5583667}));return a.position.set(0,.45,.85),e.add(a),e}},bugio:{name:"Bugio",speed:2.5,chaseSpeed:6,points:3,health:45,attackDamage:8,attackRange:2.5,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.4,.6),new f({color:2759178}));t.position.y=.9,e.add(t);const n=new l(new y(.2,5,4),new f({color:3811866}));n.position.set(0,1.15,.3),e.add(n);const i=new l(new y(.12,4,3),new f({color:1706496}));i.position.set(0,1,.4),e.add(i);const a=new l(new A(.03,.02,.8,4),new f({color:2759178}));return a.position.set(0,.8,-.5),a.rotation.x=-.8,e.add(a),e}},coruja:{name:"Coruja",speed:2,chaseSpeed:5,points:2,health:20,attackDamage:6,attackRange:2,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.35,.3),new f({color:9075290}));t.position.y=.4,e.add(t);const n=new l(new y(.18,5,4),new f({color:10127978}));n.position.set(0,.7,.05),e.add(n);const i=new y(.06,4,4),a=new f({color:16776960}),o=new l(i,a);o.position.set(-.08,.72,.15),e.add(o);const r=o.clone();return r.position.set(.08,.72,.15),e.add(r),e}},urubu:{name:"Urubu-Rei",speed:3,chaseSpeed:8,points:3,health:30,attackDamage:8,attackRange:2.5,detectionRange:22,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.3,.5),new f({color:1118481}));t.position.y=3.5,e.add(t);const n=new l(new y(.14,5,4),new f({color:16737792}));n.position.set(0,3.7,.25),e.add(n);const i=new y(.5,8,6).scale(1.4,.04,.4),a=new f({color:2236962});return e.add(new l(i,a).translateY(3.5)),e}},gaviao:{name:"Gaviao-Real",speed:4.5,chaseSpeed:12,points:6,health:40,attackDamage:16,attackRange:3,detectionRange:25,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.3,.5),new f({color:5592405}));t.position.y=4.2,e.add(t);const n=new l(new y(.15,5,4),new f({color:15658734}));n.position.set(0,4.45,.2),e.add(n);const i=new l(new ce(.05,.12,4),new f({color:3355443}));i.position.set(0,4.4,.35),i.rotation.x=Math.PI/2,e.add(i);const a=new y(.5,8,6).scale(1.6,.04,.4);return e.add(new l(a,new f({color:4473924})).translateY(4.2)),e}},tartaruga:{name:"Tartaruga",speed:.8,chaseSpeed:2,points:1,health:100,attackDamage:4,attackRange:2,detectionRange:8,createMesh(){const e=new z,t=new l(new y(.5,6,5),new f({color:4872762}));t.position.y=.35,t.scale.y=.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.15,.12,.25),new f({color:5925450}));n.position.set(0,.3,.55),e.add(n);const i=new A(.06,.06,.08,6),a=new f({color:5925450});return[[-.35,.1,.2],[.35,.1,.2],[-.35,.1,-.2],[.35,.1,-.2]].forEach(o=>{e.add(new l(i,a).translateX(o[0]).translateY(o[1]).translateZ(o[2]))}),e}},cobracoral:{name:"Cobra-Coral",speed:2.5,chaseSpeed:6,points:4,health:15,attackDamage:25,attackRange:2,detectionRange:8,createMesh(){const e=new z,t=[16711680,1118481,16776960,1118481];for(let n=0;n<8;n++){const i=new l(new y(.08,5,4),new f({color:t[n%4]}));i.position.set(Math.sin(n*.4)*.15,.08,-n*.2),i.scale.set(1,.7,1.2),e.add(i)}return e}},cascavel:{name:"Cascavel",speed:2,chaseSpeed:5,points:4,health:25,attackDamage:20,attackRange:2.5,detectionRange:10,createMesh(){const e=new z,t=new f({color:6969914});for(let a=0;a<7;a++){const o=new l(new y(.1,5,4),t);o.position.set(Math.sin(a*.5)*.2,.1,-a*.22),o.scale.set(1,.6,1.2),e.add(o)}const n=new l(new y(.5,8,6).scale(.15,.08,.2),new f({color:8022602}));n.position.set(0,.1,.2),e.add(n);const i=new l(new y(.06,4,3),new f({color:11184742}));return i.position.set(Math.sin(3.5)*.2,.1,-7*.22),e.add(i),e}},jiboia:{name:"Jiboia",speed:1.5,chaseSpeed:4,points:5,health:80,attackDamage:16,attackRange:3,detectionRange:10,createMesh(){const e=new z,t=new f({color:6965818}),n=new f({color:9071178});for(let a=0;a<12;a++){const o=new l(new y(.12-a*.005,5,4),a%2===0?t:n);o.position.set(Math.sin(a*.4)*.25,.12,-a*.25),o.scale.set(1,.6,1.2),e.add(o)}const i=new l(new y(.5,8,6).scale(.18,.1,.25),new f({color:5913130}));return i.position.set(0,.12,.25),e.add(i),e}},sapo:{name:"Sapo-Cururu",speed:1.5,chaseSpeed:4,points:1,health:20,attackDamage:3,attackRange:2,detectionRange:8,createMesh(){const e=new z,t=new l(new y(.25,6,5),new f({color:4872746}));t.position.y=.2,t.scale.set(1,.7,1.1),e.add(t);const n=new y(.06,4,4),i=new f({color:11184640}),a=new l(n,i);a.position.set(-.12,.35,.15),e.add(a);const o=a.clone();o.position.set(.12,.35,.15),e.add(o);const r=new A(.075,.075,.06,6),c=new f({color:3820058});return e.add(new l(r,c).translateX(-.2).translateY(.05).translateZ(-.15)),e.add(new l(r,c).translateX(.2).translateY(.05).translateZ(-.15)),e}},perereca:{name:"Perereca",speed:4,chaseSpeed:8,points:1,health:10,attackDamage:2,attackRange:2,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.15,5,4),new f({color:2271778}));t.position.y=.15,e.add(t);const n=new y(.05,4,3),i=new f({color:16711680}),a=new l(n,i);a.position.set(-.08,.25,.08),e.add(a);const o=a.clone();return o.position.set(.08,.25,.08),e.add(o),e}},macacoaranha:{name:"Macaco-Aranha",speed:4,chaseSpeed:9,points:3,health:35,attackDamage:8,attackRange:2.5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.35,.5),new f({color:2763306}));t.position.y=1,e.add(t);const n=new l(new y(.17,5,4),new f({color:3815994}));n.position.set(0,1.25,.25),e.add(n);const i=new A(.03,.03,.7,4),a=new f({color:2763306}),o=new l(i,a);o.position.set(-.25,.8,0),o.rotation.z=.5,e.add(o);const r=new l(i,a);r.position.set(.25,.8,0),r.rotation.z=-.5,e.add(r);const c=new l(new A(.03,.02,1,4),new f({color:2763306}));return c.position.set(0,1,-.5),c.rotation.x=-1,e.add(c),e}},quati:{name:"Quati",speed:3.5,chaseSpeed:7,points:2,health:30,attackDamage:7,attackRange:2,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.25,.7),new f({color:6965802}));t.position.y=.4,e.add(t);const n=new l(new y(.5,8,6).scale(.2,.18,.25),new f({color:8018490}));n.position.set(0,.45,.45),e.add(n);const i=new l(new ce(.05,.15,6).rotateX(Math.PI/2),new f({color:3355443}));i.position.set(0,.43,.6),e.add(i);const a=new l(new A(.04,.03,.8,4),new f({color:6965802}));return a.position.set(0,.6,-.5),a.rotation.x=-1,e.add(a),e}},cervo:{name:"Cervo-do-Pantanal",speed:4,chaseSpeed:9,points:4,health:70,attackDamage:12,attackRange:3,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.8,.7,1.6),new f({color:8018490}));t.position.y=1.1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.4,.4,.5),new f({color:9071178}));n.position.set(0,1.5,.9),e.add(n);const i=new f({color:5917242});for(let r=-1;r<=1;r+=2){const c=new l(new A(.025,.025,.5,4),i);c.position.set(r*.15,1.85,.9),c.rotation.z=r*.4,e.add(c);const h=new l(new A(.02,.02,.3,4),i);h.position.set(r*.25,2,.9),h.rotation.z=r*.8,e.add(h)}const a=new A(.06,.06,.9,6),o=new f({color:5913130});return[[-.28,.45,-.5],[.28,.45,-.5],[-.28,.45,.5],[.28,.45,.5]].forEach(r=>{e.add(new l(a,o).translateX(r[0]).translateY(r[1]).translateZ(r[2]))}),e}},iara:{name:"Iara",speed:3,chaseSpeed:7,points:5,health:50,attackDamage:12,attackRange:3,detectionRange:15,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.5,.8),new f({color:4500104}));t.position.y=.5,e.add(t);const n=new l(new y(.2,5,4),new f({color:6737066}));n.position.set(0,.85,.3),e.add(n);const i=new l(new y(.5,8,6).scale(.5,.1,.5),new f({color:3385975}));i.position.set(0,.3,-.6),e.add(i);const a=new l(new y(.5,8,6).scale(.35,.3,.2),new f({color:1722906}));return a.position.set(0,1,.2),e.add(a),e}},saci:{name:"Saci",speed:6,chaseSpeed:13,points:7,health:30,attackDamage:10,attackRange:2.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.6,.25),new f({color:3811866}));t.position.y=1,e.add(t);const n=new l(new y(.18,5,4),new f({color:4864554}));n.position.set(0,1.5,0),e.add(n);const i=new l(new ce(.15,.3,6),new f({color:13369344}));i.position.set(0,1.8,0),e.add(i);const a=new l(new A(.06,.06,.7,6),new f({color:3811866}));a.position.set(0,.35,0),e.add(a);const o=new l(new A(.02,.02,.2,4),new f({color:5913114}));return o.position.set(.15,1.4,.12),o.rotation.z=-.5,e.add(o),e}},curupira:{name:"Curupira",speed:5,chaseSpeed:11,points:6,health:65,attackDamage:14,attackRange:3,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.7,.3),new f({color:5913114}));t.position.y=.9,e.add(t);const n=new l(new y(.2,5,4),new f({color:6965802}));n.position.set(0,1.5,0),e.add(n);const i=new l(new y(.25,5,4),new f({color:16724736}));i.position.set(0,1.6,-.05),i.scale.y=1.3,e.add(i);const a=new A(.06,.06,.5,6),o=new f({color:5913114}),r=new l(a,o);r.position.set(-.12,.25,0),e.add(r);const c=new l(a,o);return c.position.set(.12,.25,0),e.add(c),e}},boiuna:{name:"Boiuna",speed:2,chaseSpeed:5,points:8,health:130,attackDamage:22,attackRange:3.5,detectionRange:12,createMesh(){const e=new z,t=new f({color:1710634});for(let o=0;o<14;o++){const r=.2-o*.008,c=new l(new y(r,5,4),t);c.position.set(Math.sin(o*.4)*.4,.2,-o*.3),c.scale.set(1,.7,1.3),e.add(c)}const n=new l(new y(.5,8,6).scale(.3,.2,.4),new f({color:2763322}));n.position.set(0,.25,.4),e.add(n);const i=new y(.06,4,3),a=new f({color:16729088});return e.add(new l(i,a).translateX(-.1).translateY(.35).translateZ(.5)),e.add(new l(i,a).translateX(.1).translateY(.35).translateZ(.5)),e}},mapinguari:{name:"Mapinguari",speed:2,chaseSpeed:5,points:9,health:150,attackDamage:28,attackRange:3.5,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1.2,1.8,.9),new f({color:4864538}));t.position.y=1.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(1.3,1,1),new f({color:3811850}));n.position.y=2,e.add(n);const i=new l(new y(.4,5,4),new f({color:5917226}));i.position.set(0,2.8,.2),e.add(i);const a=new l(new y(.08,4,3),new f({color:16711680}));a.position.set(0,2.9,.5),e.add(a);const o=new A(.15,.15,.8,6),r=new f({color:3811850});return e.add(new l(o,r).translateX(-.35).translateY(.4)),e.add(new l(o,r).translateX(.35).translateY(.4)),e}},lobisomem:{name:"Lobisomem",speed:5,chaseSpeed:13,points:8,health:100,attackDamage:22,attackRange:3,detectionRange:22,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,1,.5),new f({color:3815994}));t.position.y=1.3,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.4,.4,.5),new f({color:4868682}));n.position.set(0,2,.2),e.add(n);const i=new l(new ce(.1,.3,6).rotateX(Math.PI/2),new f({color:3815994}));i.position.set(0,1.9,.5),e.add(i);const a=new ce(.08,.2,4),o=new f({color:4868682});e.add(new l(a,o).translateX(-.15).translateY(2.3).translateZ(.1)),e.add(new l(a,o).translateX(.15).translateY(2.3).translateZ(.1));const r=new A(.075,.075,.9,6),c=new f({color:3815994});[[-.2,.45,0],[.2,.45,0]].forEach(d=>{e.add(new l(r,c).translateX(d[0]).translateY(d[1]).translateZ(d[2]))});const h=new A(.06,.06,.7,6);return e.add(new l(h,c).translateX(-.45).translateY(1.2)),e.add(new l(h,c).translateX(.45).translateY(1.2)),e}},urso:{name:"Urso",speed:7,chaseSpeed:14,points:5,health:220,attackDamage:14,attackRange:3,detectionRange:18,hitRadius:1.6,hitHeight:1,createMesh(){const e=new z,t=new f({color:3809029}),n=new f({color:2757891}),i=new f({color:5913114}),a=new l(new y(.5,8,6).scale(1.25,1,1.15),t);a.position.y=1.1,a.castShadow=!0,e.add(a);const o=new l(new y(.5,8,6).scale(.8,.55,.9),t);o.position.set(0,1.55,-.35),e.add(o);const r=new l(new y(.5,8,6).scale(.85,.8,.8),t);r.position.set(0,1.15,.6),r.castShadow=!0,e.add(r);const c=new l(new y(.5,8,6).scale(.8,.4,.9),i);c.position.set(0,.75,.1),e.add(c);const h=new l(new y(.5,8,6).scale(.55,.5,.55),t);h.position.set(0,1.75,1),e.add(h);const d=new l(new y(.5,8,6).scale(.3,.24,.3),i);d.position.set(0,1.65,1.38),e.add(d);const u=new l(new y(.07,5,4),new f({color:656645}));u.position.set(0,1.68,1.56),e.add(u);const p=new y(.055,4,4),m=new f({color:2228224}),x=new l(p,m);x.position.set(-.26,1.88,1.18),e.add(x);const _=x.clone();_.position.set(.26,1.88,1.18),e.add(_);const w=new y(.12,5,4),g=new l(w,n);g.position.set(-.32,2.2,.95),e.add(g);const S=g.clone();S.position.set(.32,2.2,.95),e.add(S);const v=new A(.24,.2,.85,7),E=new f({color:2757891}),I=new ce(.045,.15,4),C=new f({color:15261900});[[-.45,.42,.55],[.45,.42,.55],[-.5,.42,-.5],[.5,.42,-.5]].forEach(k=>{const b=new l(v,E);b.position.set(...k),b.castShadow=!0,e.add(b);for(let M=-1;M<=1;M+=2){const U=new l(I,C);U.position.set(k[0]+M*.14,.06,k[2]),U.rotation.x=Math.PI,e.add(U)}});const P=new l(new y(.13,5,4),n);return P.position.set(0,1.05,-.95),e.add(P),e}},leao:{name:"Leão",speed:5,chaseSpeed:12,points:7,health:100,attackDamage:20,attackRange:3,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,.6,1.2),new f({color:13148208}));t.position.y=.9,t.castShadow=!0,e.add(t);const n=new l(new y(.45,6,5),new f({color:9127187}));n.position.set(0,1.3,.4),e.add(n);const i=new l(new y(.3,6,5),new f({color:13148208}));i.position.set(0,1.3,.6),e.add(i);const a=new l(new A(.03,.03,.8,4),new f({color:13148208}));a.position.set(0,.9,-.9),a.rotation.x=.5,e.add(a);const o=new A(.075,.075,.5,6),r=new f({color:11567136});return[[-.25,.35,.4],[.25,.35,.4],[-.25,.35,-.4],[.25,.35,-.4]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},tigre:{name:"Tigre",speed:5,chaseSpeed:13,points:7,health:100,attackDamage:22,attackRange:3,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.55,1.3),new f({color:14708752}));t.position.y=.9,t.castShadow=!0,e.add(t);const n=new l(new y(.3,6,5),new f({color:14708752}));n.position.set(0,1.2,.6),e.add(n);const i=new l(new y(.5,8,6).scale(.62,.08,.1),new f({color:1710618}));i.position.set(0,1,.2),e.add(i);const a=i.clone();a.position.z=-.1,e.add(a);const o=i.clone();o.position.z=-.4,e.add(o);const r=new l(new A(.04,.03,.9,4),new f({color:14708752}));r.position.set(0,.9,-.9),r.rotation.x=.6,e.add(r);const c=new A(.07,.07,.5,6),h=new f({color:12607488});return[[-.2,.35,.4],[.2,.35,.4],[-.2,.35,-.4],[.2,.35,-.4]].forEach(d=>{e.add(new l(c,h).translateX(d[0]).translateY(d[1]).translateZ(d[2]))}),e}},elefante:{name:"Elefante",speed:2,chaseSpeed:5,points:8,health:200,attackDamage:25,attackRange:4,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1.4,1.2,1.8),new f({color:8026746}));t.position.y=1.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,6,5),new f({color:9079434}));n.position.set(0,2,.9),e.add(n);const i=new l(new A(.1,.06,1,5),new f({color:8026746}));i.position.set(0,1.4,1.3),i.rotation.x=.3,e.add(i);const a=new y(.5,8,6).scale(.05,.6,.5),o=new f({color:6974058});e.add(new l(a,o).translateX(-.55).translateY(2).translateZ(.7)),e.add(new l(a,o).translateX(.55).translateY(2).translateZ(.7));const r=new A(.2,.2,1,6),c=new f({color:6974058});return[[-.45,.5,.5],[.45,.5,.5],[-.45,.5,-.5],[.45,.5,-.5]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},gorila:{name:"Gorila",speed:3,chaseSpeed:7,points:7,health:140,attackDamage:22,attackRange:3,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1,1,.8),new f({color:2763306}));t.position.y=1.3,t.castShadow=!0,e.add(t);const n=new l(new y(.35,6,5),new f({color:2763306}));n.position.set(0,2.1,.1),e.add(n);const i=new l(new y(.5,8,6).scale(.25,.2,.1),new f({color:1710618}));i.position.set(0,2,.35),e.add(i);const a=new A(.1,.1,.9,6),o=new f({color:2763306});e.add(new l(a,o).translateX(-.6).translateY(1)),e.add(new l(a,o).translateX(.6).translateY(1));const r=new A(.125,.125,.6,6);return[[-.3,.3,0],[.3,.3,0]].forEach(c=>{e.add(new l(r,o).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},rinoceronte:{name:"Rinoceronte",speed:3,chaseSpeed:8,points:7,health:180,attackDamage:24,attackRange:3.5,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1,.9,1.6),new f({color:6974058}));t.position.y=1.1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.5,.5,.6),new f({color:6974058}));n.position.set(0,1.2,1),e.add(n);const i=new l(new ce(.08,.4,5),new f({color:13421738}));i.position.set(0,1.6,1.2),e.add(i);const a=new A(.15,.15,.7,6),o=new f({color:5921370});return[[-.35,.35,.5],[.35,.35,.5],[-.35,.35,-.5],[.35,.35,-.5]].forEach(r=>{e.add(new l(a,o).translateX(r[0]).translateY(r[1]).translateZ(r[2]))}),e}},hipopotamo:{name:"Hipopótamo",speed:2,chaseSpeed:6,points:7,health:180,attackDamage:22,attackRange:3.5,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1.2,.9,1.5),new f({color:6969962}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.6,.5,.7),new f({color:8022650}));n.position.set(0,1.1,.9),e.add(n);const i=new l(new y(.5,8,6).scale(.5,.3,.3),new f({color:10119802}));i.position.set(0,.9,1.2),e.add(i);const a=new A(.18,.18,.6,6),o=new f({color:5917274});return[[-.4,.3,.4],[.4,.3,.4],[-.4,.3,-.4],[.4,.3,-.4]].forEach(r=>{e.add(new l(a,o).translateX(r[0]).translateY(r[1]).translateZ(r[2]))}),e}},crocodilo:{name:"Crocodilo",speed:2,chaseSpeed:7,points:6,health:100,attackDamage:20,attackRange:3.5,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.35,2),new f({color:3824170}));t.position.y=.3,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.4,.25,.9),new f({color:4876858}));n.position.set(0,.3,1.3),e.add(n);const i=new l(new y(.5,8,6).scale(.3,.2,1.2),new f({color:3824170}));i.position.set(0,.25,-1.5),e.add(i);const a=new A(.075,.075,.2,6),o=new f({color:2771482});return[[-.3,.1,.6],[.3,.1,.6],[-.3,.1,-.4],[.3,.1,-.4]].forEach(r=>{e.add(new l(a,o).translateX(r[0]).translateY(r[1]).translateZ(r[2]))}),e}},tubarao:{name:"Tubarão",speed:4,chaseSpeed:10,points:7,health:100,attackDamage:22,attackRange:3,detectionRange:22,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.4,1.8),new f({color:4872810}));t.position.y=.5,t.castShadow=!0,e.add(t);const n=new l(new ce(.2,.6,5),new f({color:5925498}));n.position.set(0,.5,1.1),n.rotation.x=-Math.PI/2,e.add(n);const i=new l(new y(.5,8,6).scale(.05,.4,.3),new f({color:4872810}));i.position.set(0,.9,0),e.add(i);const a=new l(new y(.5,8,6).scale(.05,.35,.25),new f({color:4872810}));return a.position.set(0,.7,-.9),e.add(a),e}},aguia:{name:"Águia",speed:5,chaseSpeed:12,points:6,health:50,attackDamage:14,attackRange:3,detectionRange:24,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.25,.6),new f({color:3811866}));t.position.y=3.5,t.castShadow=!0,e.add(t);const n=new l(new y(.15,5,4),new f({color:16777215}));n.position.set(0,3.7,.3),e.add(n);const i=new l(new ce(.05,.15,4),new f({color:14526976}));i.position.set(0,3.65,.45),i.rotation.x=-Math.PI/2,e.add(i);const a=new y(.5,8,6).scale(.8,.05,.4),o=new f({color:3811866});return e.add(new l(a,o).translateX(-.5).translateY(3.5)),e.add(new l(a,o).translateX(.5).translateY(3.5)),e}},falcao:{name:"Falcão",speed:6,chaseSpeed:14,points:6,health:40,attackDamage:12,attackRange:2.5,detectionRange:26,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.2,.2,.5),new f({color:5917242}));t.position.y=3.5,t.castShadow=!0,e.add(t);const n=new l(new y(.12,5,4),new f({color:4864554}));n.position.set(0,3.65,.25),e.add(n);const i=new l(new ce(.04,.1,4),new f({color:3355443}));i.position.set(0,3.6,.38),i.rotation.x=-Math.PI/2,e.add(i);const a=new y(.5,8,6).scale(.7,.04,.3),o=new f({color:5917242});return e.add(new l(a,o).translateX(-.45).translateY(3.5)),e.add(new l(a,o).translateX(.45).translateY(3.5)),e}},lobo:{name:"Lobo",speed:11,chaseSpeed:16,points:3,health:120,attackDamage:10,attackRange:2.5,detectionRange:24,hitRadius:1.3,hitHeight:.8,createMesh(){const e=new z,t=new f({color:9080982}),n=new f({color:5659746}),i=new f({color:14212578}),a=new l(new y(.5,8,6).scale(.55,.5,.95),t);a.position.y=.75,a.castShadow=!0,e.add(a);const o=new l(new y(.5,8,6).scale(.4,.35,.5),i);o.position.set(0,.7,.55),e.add(o);const r=new l(new A(.14,.17,.3,6),t);r.position.set(0,1,.6),r.rotation.x=.2,e.add(r);const c=new l(new y(.5,8,6).scale(.4,.33,.45),t);c.position.set(0,1.15,.85),e.add(c);const h=new l(new y(.5,8,6).scale(.2,.16,.35),t);h.position.set(0,1.05,1.25),e.add(h);const d=new l(new y(.04,4,3),new f({color:1052688}));d.position.set(0,1.06,1.44),e.add(d);const u=new y(.045,4,4),p=new f({color:16768307}),m=new l(u,p);m.position.set(-.18,1.26,1.05),e.add(m);const x=m.clone();x.position.set(.18,1.26,1.05),e.add(x);const _=new ce(.07,.22,4),w=new l(_,n);w.position.set(-.14,1.45,.85),e.add(w);const g=w.clone();g.position.set(.14,1.45,.85),e.add(g);const S=new l(new A(.07,.05,.7,6),n);S.position.set(0,.85,-.9),S.rotation.x=-.5,e.add(S);const v=new l(new y(.09,5,4),n);v.position.set(0,.6,-1.25),e.add(v);const E=new A(.06,.05,.55,5),I=new f({color:5659746});return[[-.18,.28,.4],[.18,.28,.4],[-.18,.28,-.35],[.18,.28,-.35]].forEach(C=>{const P=new l(E,I);P.position.set(...C),P.castShadow=!0,e.add(P)}),e}},raposa:{name:"Raposa",speed:5,chaseSpeed:11,points:4,health:40,attackDamage:8,attackRange:2,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.3,.7),new f({color:13656080}));t.position.y=.6,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.22,.3),new f({color:13656080}));n.position.set(0,.75,.45),e.add(n);const i=new l(new ce(.03,.1,6).rotateX(Math.PI/2),new f({color:1118481}));i.position.set(0,.72,.62),e.add(i);const a=new l(new y(.5,8,6).scale(.15,.15,.5),new f({color:16777215}));a.position.set(0,.7,-.6),e.add(a);const o=new ce(.05,.15,4),r=new f({color:13656080});return e.add(new l(o,r).translateX(-.08).translateY(.95).translateZ(.4)),e.add(new l(o,r).translateX(.08).translateY(.95).translateZ(.4)),e}},coiote:{name:"Coiote",speed:5,chaseSpeed:10,points:4,health:50,attackDamage:10,attackRange:2.5,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.35,.8),new f({color:9075290}));t.position.y=.65,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.25,.3),new f({color:10127978}));n.position.set(0,.8,.5),e.add(n);const i=new l(new ce(.05,.18,6).rotateX(Math.PI/2),new f({color:8022602}));i.position.set(0,.75,.68),e.add(i);const a=new ce(.05,.14,4),o=new f({color:10127978});e.add(new l(a,o).translateX(-.09).translateY(1).translateZ(.45)),e.add(new l(a,o).translateX(.09).translateY(1).translateZ(.45));const r=new A(.045,.045,.35,6),c=new f({color:8022602});return[[-.12,.28,.25],[.12,.28,.25],[-.12,.28,-.25],[.12,.28,-.25]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},hiena:{name:"Hiena",speed:4,chaseSpeed:10,points:5,health:70,attackDamage:14,attackRange:2.5,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.4,.9),new f({color:9075274}));t.position.y=.75,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.3,.28,.35),new f({color:8022586}));n.position.set(0,.9,.5),e.add(n);const i=new l(new y(.5,8,6).scale(.15,.2,.5),new f({color:3815978}));i.position.set(0,1,.1),e.add(i);const a=new y(.06,4,3),o=new f({color:3815978});e.add(new l(a,o).translateX(-.12).translateY(1.1).translateZ(.5)),e.add(new l(a,o).translateX(.12).translateY(1.1).translateZ(.5));const r=new A(.05,.05,.4,6),c=new f({color:6969914});return[[-.13,.3,.3],[.13,.3,.3],[-.13,.3,-.3],[.13,.3,-.3]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},leopardo:{name:"Leopardo",speed:5,chaseSpeed:12,points:6,health:80,attackDamage:16,attackRange:2.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.35,1),new f({color:13672496}));t.position.y=.75,t.castShadow=!0,e.add(t);const n=new l(new y(.2,5,4),new f({color:13672496}));n.position.set(0,.9,.5),e.add(n);const i=new l(new y(.04,3,3),new f({color:2763274}));i.position.set(.15,.8,.2),e.add(i);const a=i.clone();a.position.set(-.1,.85,-.1),e.add(a);const o=i.clone();o.position.set(.1,.8,-.3),e.add(o);const r=new l(new A(.04,.03,.8,4),new f({color:13672496}));r.position.set(0,.8,-.8),r.rotation.x=.4,e.add(r);const c=new A(.05,.05,.4,6),h=new f({color:11567136});return[[-.13,.3,.3],[.13,.3,.3],[-.13,.3,-.3],[.13,.3,-.3]].forEach(d=>{e.add(new l(c,h).translateX(d[0]).translateY(d[1]).translateZ(d[2]))}),e}},pantera:{name:"Pantera",speed:5,chaseSpeed:13,points:6,health:80,attackDamage:18,attackRange:2.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.35,1),new f({color:1710618}));t.position.y=.75,t.castShadow=!0,e.add(t);const n=new l(new y(.2,5,4),new f({color:1710618}));n.position.set(0,.9,.5),e.add(n);const i=new y(.03,3,3),a=new f({color:4521796});e.add(new l(i,a).translateX(-.08).translateY(.93).translateZ(.65)),e.add(new l(i,a).translateX(.08).translateY(.93).translateZ(.65));const o=new l(new A(.04,.03,.9,4),new f({color:1710618}));o.position.set(0,.8,-.8),o.rotation.x=.5,e.add(o);const r=new A(.05,.05,.4,6),c=new f({color:657930});return[[-.13,.3,.3],[.13,.3,.3],[-.13,.3,-.3],[.13,.3,-.3]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},bufalo:{name:"Búfalo",speed:3,chaseSpeed:8,points:6,health:150,attackDamage:20,attackRange:3.5,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1,.8,1.4),new f({color:2763306}));t.position.y=1.1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.5,.5,.5),new f({color:2763306}));n.position.set(0,1.2,.8),e.add(n);const i=new A(.04,.03,.4,4),a=new f({color:9079402});e.add(new l(i,a).translateX(-.3).translateY(1.5).translateZ(.8).rotateZ(.4)),e.add(new l(i,a).translateX(.3).translateY(1.5).translateZ(.8).rotateZ(-.4));const o=new A(.12,.12,.7,5),r=new f({color:1710618});return[[-.35,.35,.4],[.35,.35,.4],[-.35,.35,-.4],[.35,.35,-.4]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},bisonte:{name:"Bisonte",speed:3,chaseSpeed:8,points:6,health:160,attackDamage:20,attackRange:3.5,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1,.9,1.4),new f({color:3811866}));t.position.y=1.2,t.castShadow=!0,e.add(t);const n=new l(new y(.4,5,4),new f({color:4864554}));n.position.set(0,1.8,.3),e.add(n);const i=new l(new y(.5,8,6).scale(.5,.5,.4),new f({color:3811866}));i.position.set(0,1.1,.8),e.add(i);const a=new ce(.04,.2,4),o=new f({color:9079402});e.add(new l(a,o).translateX(-.25).translateY(1.4).translateZ(.8)),e.add(new l(a,o).translateX(.25).translateY(1.4).translateZ(.8));const r=new A(.12,.12,.7,5),c=new f({color:2759178});return[[-.35,.35,.4],[.35,.35,.4],[-.35,.35,-.4],[.35,.35,-.4]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},javali:{name:"Javali",speed:4,chaseSpeed:9,points:5,health:80,attackDamage:14,attackRange:2.5,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.45,.9),new f({color:4864554}));t.position.y=.6,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.35,.35,.4),new f({color:5917242}));n.position.set(0,.65,.55),e.add(n);const i=new ce(.02,.12,3),a=new f({color:15658700});e.add(new l(i,a).translateX(-.12).translateY(.55).translateZ(.75)),e.add(new l(i,a).translateX(.12).translateY(.55).translateZ(.75));const o=new A(.05,.05,.3,6),r=new f({color:3811866});return[[-.15,.2,.25],[.15,.2,.25],[-.15,.2,-.25],[.15,.2,-.25]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},alce:{name:"Alce",speed:3,chaseSpeed:8,points:6,health:130,attackDamage:16,attackRange:3.5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,.7,1.2),new f({color:4864538}));t.position.y=1.3,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.3,.4,.35),new f({color:5917226}));n.position.set(0,1.9,.5),e.add(n);const i=new y(.5,8,6).scale(.5,.05,.3),a=new f({color:9075274});e.add(new l(i,a).translateX(-.2).translateY(2.2).translateZ(.5)),e.add(new l(i,a).translateX(.2).translateY(2.2).translateZ(.5));const o=new A(.08,.08,.9,5),r=new f({color:3811850});return[[-.25,.45,.35],[.25,.45,.35],[-.25,.45,-.35],[.25,.45,-.35]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},rena:{name:"Rena",speed:4,chaseSpeed:9,points:5,health:100,attackDamage:12,attackRange:3,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.5,1),new f({color:6965802}));t.position.y=1.1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.3,.3),new f({color:8018490}));n.position.set(0,1.5,.4),e.add(n);const i=new A(.02,.02,.35,4),a=new f({color:10127962});e.add(new l(i,a).translateX(-.12).translateY(1.8).translateZ(.4)),e.add(new l(i,a).translateX(.12).translateY(1.8).translateZ(.4));const o=new A(.06,.06,.7,5),r=new f({color:5913114});return[[-.18,.4,.3],[.18,.4,.3],[-.18,.4,-.3],[.18,.4,-.3]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},camelo:{name:"Camelo",speed:3,chaseSpeed:7,points:5,health:120,attackDamage:12,attackRange:3,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.6,1.2),new f({color:13148256}));t.position.y=1.5,t.castShadow=!0,e.add(t);const n=new l(new y(.25,5,4),new f({color:12095568}));n.position.set(0,2,0),e.add(n);const i=new l(new A(.12,.12,.7,5),new f({color:13148256}));i.position.set(0,2,.5),i.rotation.x=-.4,e.add(i);const a=new l(new y(.5,8,6).scale(.2,.2,.3),new f({color:13148256}));a.position.set(0,2.4,.7),e.add(a);const o=new A(.07,.07,1,5),r=new f({color:11567168});return[[-.2,.6,.35],[.2,.6,.35],[-.2,.6,-.35],[.2,.6,-.35]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},girafa:{name:"Girafa",speed:3,chaseSpeed:8,points:6,health:130,attackDamage:14,attackRange:4,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.5,1),new f({color:13672512}));t.position.y=1.8,t.castShadow=!0,e.add(t);const n=new l(new A(.12,.15,1.2,5),new f({color:13672512}));n.position.set(0,2.8,.3),e.add(n);const i=new l(new y(.5,8,6).scale(.2,.2,.3),new f({color:13672512}));i.position.set(0,3.5,.3),e.add(i);const a=new A(.02,.02,.15,4),o=new f({color:9071146});e.add(new l(a,o).translateX(-.06).translateY(3.7).translateZ(.3)),e.add(new l(a,o).translateX(.06).translateY(3.7).translateZ(.3));const r=new A(.07,.07,1.2,5),c=new f({color:11567152});return[[-.2,.7,.3],[.2,.7,.3],[-.2,.7,-.3],[.2,.7,-.3]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},zebra:{name:"Zebra",speed:4,chaseSpeed:10,points:4,health:70,attackDamage:10,attackRange:2.5,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.45,1),new f({color:16777215}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.52,.08,.1),new f({color:1118481}));n.position.set(0,1.1,.3),e.add(n);const i=n.clone();i.position.z=0,e.add(i);const a=n.clone();a.position.z=-.3,e.add(a);const o=new l(new y(.5,8,6).scale(.2,.25,.3),new f({color:16777215}));o.position.set(0,1.3,.55),e.add(o);const r=new A(.06,.06,.6,5),c=new f({color:15658734});return[[-.18,.4,.3],[.18,.4,.3],[-.18,.4,-.3],[.18,.4,-.3]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},gnu:{name:"Gnu",speed:4,chaseSpeed:9,points:5,health:90,attackDamage:14,attackRange:3,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.55,1.1),new f({color:3815994}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.3,.35,.35),new f({color:3815994}));n.position.set(0,1.1,.6),e.add(n);const i=new A(.03,.02,.25,4),a=new f({color:6974026});e.add(new l(i,a).translateX(-.12).translateY(1.4).translateZ(.6).rotateZ(.3)),e.add(new l(i,a).translateX(.12).translateY(1.4).translateZ(.6).rotateZ(-.3));const o=new l(new y(.5,8,6).scale(.1,.15,.08),new f({color:2763306}));o.position.set(0,.9,.7),e.add(o);const r=new A(.07,.07,.6,5),c=new f({color:2763306});return[[-.2,.35,.35],[.2,.35,.35],[-.2,.35,-.35],[.2,.35,-.35]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},antilope:{name:"Antílope",speed:5,chaseSpeed:12,points:4,health:60,attackDamage:8,attackRange:2.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.4,.9),new f({color:11567168}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.2,.22,.25),new f({color:11567168}));n.position.set(0,1.3,.45),e.add(n);const i=new A(.02,.015,.35,4),a=new f({color:4868666});e.add(new l(i,a).translateX(-.06).translateY(1.6).translateZ(.45)),e.add(new l(i,a).translateX(.06).translateY(1.6).translateZ(.45));const o=new A(.05,.05,.6,5),r=new f({color:9461808});return[[-.13,.4,.25],[.13,.4,.25],[-.13,.4,-.25],[.13,.4,-.25]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},gazela:{name:"Gazela",speed:6,chaseSpeed:14,points:4,health:40,attackDamage:6,attackRange:2,detectionRange:22,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.35,.8),new f({color:13148256}));t.position.y=.9,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.18,.2,.22),new f({color:13148256}));n.position.set(0,1.2,.4),e.add(n);const i=new A(.015,.01,.3,4),a=new f({color:3815978});e.add(new l(i,a).translateX(-.05).translateY(1.45).translateZ(.4)),e.add(new l(i,a).translateX(.05).translateY(1.45).translateZ(.4));const o=new A(.04,.04,.55,5),r=new f({color:11042880});return[[-.1,.35,.25],[.1,.35,.25],[-.1,.35,-.25],[.1,.35,-.25]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},canguru:{name:"Canguru",speed:4,chaseSpeed:10,points:5,health:80,attackDamage:14,attackRange:3,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.7,.5),new f({color:9068608}));t.position.y=1.2,t.castShadow=!0,e.add(t);const n=new l(new y(.2,5,4),new f({color:10121296}));n.position.set(0,1.8,.1),e.add(n);const i=new ce(.05,.18,4),a=new f({color:10121296});e.add(new l(i,a).translateX(-.1).translateY(2.05).translateZ(.1)),e.add(new l(i,a).translateX(.1).translateY(2.05).translateZ(.1));const o=new l(new A(.06,.04,.8,5),new f({color:9068608}));o.position.set(0,.8,-.5),o.rotation.x=.8,e.add(o);const r=new A(.075,.075,.5,6),c=new f({color:8015920});return e.add(new l(r,c).translateX(-.15).translateY(.5)),e.add(new l(r,c).translateX(.15).translateY(.5)),e}},koala:{name:"Koala",speed:2,chaseSpeed:4,points:3,health:35,attackDamage:5,attackRange:2,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.3,6,5),new f({color:8026746}));t.position.y=.6,t.castShadow=!0,e.add(t);const n=new l(new y(.22,6,5),new f({color:8026746}));n.position.set(0,1,.1),e.add(n);const i=new y(.1,5,4),a=new f({color:10132122});e.add(new l(i,a).translateX(-.18).translateY(1.15)),e.add(new l(i,a).translateX(.18).translateY(1.15));const o=new l(new y(.06,4,3),new f({color:1710618}));return o.position.set(0,.95,.25),e.add(o),e}},ornitorrinco:{name:"Ornitorrinco",speed:3,chaseSpeed:6,points:4,health:50,attackDamage:8,attackRange:2,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.25,.8),new f({color:5913114}));t.position.y=.3,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.06,.3),new f({color:4868650}));n.position.set(0,.28,.55),e.add(n);const i=new l(new y(.5,8,6).scale(.25,.06,.35),new f({color:5913114}));i.position.set(0,.25,-.55),e.add(i);const a=new A(.06,.06,.08,6),o=new f({color:4868650});return[[-.15,.1,.2],[.15,.1,.2],[-.15,.1,-.2],[.15,.1,-.2]].forEach(r=>{e.add(new l(a,o).translateX(r[0]).translateY(r[1]).translateZ(r[2]))}),e}},wombat:{name:"Wombat",speed:3,chaseSpeed:5,points:3,health:50,attackDamage:6,attackRange:2,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.3,.6),new f({color:5917242}));t.position.y=.35,t.castShadow=!0,e.add(t);const n=new l(new y(.18,5,4),new f({color:5917242}));n.position.set(0,.5,.3),e.add(n);const i=new l(new y(.05,3,3),new f({color:2759178}));i.position.set(0,.47,.45),e.add(i);const a=new A(.05,.05,.15,6),o=new f({color:4864554});return[[-.13,.1,.15],[.13,.1,.15],[-.13,.1,-.15],[.13,.1,-.15]].forEach(r=>{e.add(new l(a,o).translateX(r[0]).translateY(r[1]).translateZ(r[2]))}),e}},diabo_tasmania:{name:"Diabo da Tasmânia",speed:5,chaseSpeed:10,points:5,health:60,attackDamage:12,attackRange:2,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.3,.5),new f({color:1710618}));t.position.y=.4,t.castShadow=!0,e.add(t);const n=new l(new y(.18,5,4),new f({color:1710618}));n.position.set(0,.55,.25),e.add(n);const i=new l(new y(.5,8,6).scale(.15,.08,.1),new f({color:11149344}));i.position.set(0,.48,.4),e.add(i);const a=new ce(.05,.1,4),o=new f({color:11153456});return e.add(new l(a,o).translateX(-.1).translateY(.72).translateZ(.2)),e.add(new l(a,o).translateX(.1).translateY(.72).translateZ(.2)),e}},dragao_komodo:{name:"Dragão de Komodo",speed:3,chaseSpeed:7,points:6,health:100,attackDamage:18,attackRange:3,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.3,1.4),new f({color:4872762}));t.position.y=.35,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.2,.4),new f({color:5925450}));n.position.set(0,.35,.8),e.add(n);const i=new l(new y(.5,8,6).scale(.03,.02,.15),new f({color:14495792}));i.position.set(0,.32,1.05),e.add(i);const a=new l(new y(.5,8,6).scale(.2,.15,.8),new f({color:4872762}));a.position.set(0,.3,-1),e.add(a);const o=new A(.06,.06,.18,6),r=new f({color:3820074});return[[-.25,.12,.4],[.25,.12,.4],[-.25,.12,-.3],[.25,.12,-.3]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},panda:{name:"Panda",speed:2,chaseSpeed:5,points:5,health:100,attackDamage:14,attackRange:3,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,.7,.8),new f({color:16777215}));t.position.y=.9,t.castShadow=!0,e.add(t);const n=new l(new y(.3,6,5),new f({color:16777215}));n.position.set(0,1.5,.2),e.add(n);const i=new y(.08,4,3),a=new f({color:1118481});e.add(new l(i,a).translateX(-.12).translateY(1.55).translateZ(.4)),e.add(new l(i,a).translateX(.12).translateY(1.55).translateZ(.4));const o=new A(.12,.12,.5,5),r=new f({color:1118481});return[[-.22,.35,.2],[.22,.35,.2],[-.22,.35,-.2],[.22,.35,-.2]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},urso_polar:{name:"Urso Polar",speed:3,chaseSpeed:7,points:7,health:150,attackDamage:20,attackRange:3.5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1,.9,1.3),new f({color:15790312}));t.position.y=1.1,t.castShadow=!0,e.add(t);const n=new l(new y(.35,6,5),new f({color:15790312}));n.position.set(0,1.6,.5),e.add(n);const i=new l(new y(.06,4,3),new f({color:1710618}));i.position.set(0,1.55,.82),e.add(i);const a=new y(.08,4,3),o=new f({color:14737624});e.add(new l(a,o).translateX(-.2).translateY(1.9).translateZ(.4)),e.add(new l(a,o).translateX(.2).translateY(1.9).translateZ(.4));const r=new A(.125,.125,.6,6),c=new f({color:14737624});return[[-.3,.35,.35],[.3,.35,.35],[-.3,.35,-.35],[.3,.35,-.35]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},morsa:{name:"Morsa",speed:2,chaseSpeed:4,points:5,health:120,attackDamage:14,attackRange:3,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.8,.6,1.2),new f({color:8018506}));t.position.y=.5,t.castShadow=!0,e.add(t);const n=new l(new y(.3,6,5),new f({color:9071194}));n.position.set(0,.8,.5),e.add(n);const i=new A(.03,.02,.3,4),a=new f({color:15658700});e.add(new l(i,a).translateX(-.1).translateY(.5).translateZ(.7)),e.add(new l(i,a).translateX(.1).translateY(.5).translateZ(.7));const o=new A(.1,.1,.06,6),r=new f({color:5913130});return e.add(new l(o,r).translateX(-.4).translateY(.2).translateZ(.2)),e.add(new l(o,r).translateX(.4).translateY(.2).translateZ(.2)),e}},foca:{name:"Foca",speed:3,chaseSpeed:6,points:3,health:40,attackDamage:6,attackRange:2,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.3,.9),new f({color:6974074}));t.position.y=.3,t.castShadow=!0,e.add(t);const n=new l(new y(.18,5,4),new f({color:8026762}));n.position.set(0,.4,.45),e.add(n);const i=new l(new y(.04,3,3),new f({color:1710618}));i.position.set(0,.4,.6),e.add(i);const a=new A(.075,.075,.04,6),o=new f({color:5921386});return e.add(new l(a,o).translateX(-.25).translateY(.18).translateZ(.1)),e.add(new l(a,o).translateX(.25).translateY(.18).translateZ(.1)),e}},pinguim:{name:"Pinguim",speed:2,chaseSpeed:4,points:3,health:35,attackDamage:4,attackRange:2,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.5,.25),new f({color:1710618}));t.position.y=.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.2,.35,.1),new f({color:16777215}));n.position.set(0,.5,.1),e.add(n);const i=new l(new y(.14,5,4),new f({color:1710618}));i.position.set(0,.9,0),e.add(i);const a=new l(new ce(.03,.1,4),new f({color:14518272}));a.position.set(0,.85,.15),a.rotation.x=-Math.PI/2,e.add(a);const o=new y(.5,8,6).scale(.06,.3,.12),r=new f({color:1710618});return e.add(new l(o,r).translateX(-.2).translateY(.5)),e.add(new l(o,r).translateX(.2).translateY(.5)),e}},pelicano:{name:"Pelicano",speed:3,chaseSpeed:7,points:4,health:45,attackDamage:8,attackRange:3,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.3,.5),new f({color:16777215}));t.position.y=.8,t.castShadow=!0,e.add(t);const n=new l(new y(.14,5,4),new f({color:16777215}));n.position.set(0,1.1,.2),e.add(n);const i=new l(new ce(.04,.4,6).rotateX(Math.PI/2),new f({color:14518272}));i.position.set(0,1,.45),e.add(i);const a=new l(new y(.5,8,6).scale(.08,.08,.2),new f({color:14527040}));a.position.set(0,.92,.45),e.add(a);const o=new y(.5,8,6).scale(.6,.04,.3),r=new f({color:15658734});return e.add(new l(o,r).translateX(-.4).translateY(.85)),e.add(new l(o,r).translateX(.4).translateY(.85)),e}},flamingo:{name:"Flamingo",speed:3,chaseSpeed:6,points:4,health:40,attackDamage:6,attackRange:2.5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.2,5,4),new f({color:16737928}));t.position.y=1.2,t.castShadow=!0,e.add(t);const n=new l(new A(.04,.04,.6,5),new f({color:16737928}));n.position.set(0,1.7,.05),e.add(n);const i=new l(new y(.1,5,4),new f({color:16737928}));i.position.set(0,2.1,.05),e.add(i);const a=new l(new ce(.03,.12,4),new f({color:1710618}));a.position.set(0,2.05,.15),a.rotation.x=-Math.PI/2,e.add(a);const o=new A(.02,.02,.8,4),r=new f({color:16737928});return e.add(new l(o,r).translateX(-.06).translateY(.5)),e.add(new l(o,r).translateX(.06).translateY(.5)),e}},condor:{name:"Condor",speed:4,chaseSpeed:9,points:6,health:60,attackDamage:12,attackRange:3,detectionRange:24,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.35,.3,.6),new f({color:1710618}));t.position.y=3.5,t.castShadow=!0,e.add(t);const n=new l(new y(.12,5,4),new f({color:11153456}));n.position.set(0,3.7,.25),e.add(n);const i=new l(new A(.15,.13,.08,6),new f({color:16777215}));i.position.set(0,3.55,.2),e.add(i);const a=new y(.5,8,6).scale(1,.05,.4),o=new f({color:1710618});return e.add(new l(a,o).translateX(-.6).translateY(3.5)),e.add(new l(a,o).translateX(.6).translateY(3.5)),e}},grifo:{name:"Grifo",speed:4,chaseSpeed:11,points:8,health:140,attackDamage:22,attackRange:3.5,detectionRange:24,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,.6,1.2),new f({color:13148224}));t.position.y=3.5,t.castShadow=!0,e.add(t);const n=new l(new y(.25,5,4),new f({color:16777215}));n.position.set(0,4,.5),e.add(n);const i=new l(new ce(.08,.2,4),new f({color:14526976}));i.position.set(0,3.95,.72),i.rotation.x=-Math.PI/2,e.add(i);const a=new y(.5,8,6).scale(1.2,.06,.5),o=new f({color:13148224});e.add(new l(a,o).translateX(-.7).translateY(3.6)),e.add(new l(a,o).translateX(.7).translateY(3.6));const r=new A(.075,.075,.5,6),c=new f({color:13148224});return e.add(new l(r,c).translateX(-.2).translateY(2.95)),e.add(new l(r,c).translateX(.2).translateY(2.95)),e}},fenix:{name:"Fênix",speed:5,chaseSpeed:12,points:9,health:120,attackDamage:20,attackRange:3,detectionRange:26,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.35,.7),new f({color:16729088}));t.position.y=3.5,t.castShadow=!0,e.add(t);const n=new l(new y(.18,5,4),new f({color:16763904}));n.position.set(0,3.8,.3),e.add(n);const i=new l(new ce(.06,.2,4),new f({color:16711680}));i.position.set(0,4,.2),e.add(i);const a=new y(.5,8,6).scale(.9,.05,.4),o=new f({color:16737792});e.add(new l(a,o).translateX(-.5).translateY(3.5)),e.add(new l(a,o).translateX(.5).translateY(3.5));const r=new l(new y(.5,8,6).scale(.2,.1,.6),new f({color:16720384}));return r.position.set(0,3.4,-.6),e.add(r),e}},basilisco:{name:"Basilisco",speed:3,chaseSpeed:8,points:8,health:120,attackDamage:20,attackRange:4,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.4,1.4),new f({color:2775594}));t.position.y=.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.3,.3,.35),new f({color:3828282}));n.position.set(0,.6,.8),e.add(n);const i=new l(new ce(.1,.25,4),new f({color:11149344}));i.position.set(0,.9,.75),e.add(i);const a=new y(.05,4,3),o=new f({color:16776960});e.add(new l(a,o).translateX(-.12).translateY(.65).translateZ(.95)),e.add(new l(a,o).translateX(.12).translateY(.65).translateZ(.95));const r=new l(new y(.5,8,6).scale(.2,.2,.8),new f({color:2775594}));return r.position.set(0,.4,-1),e.add(r),e}},quimera:{name:"Quimera",speed:4,chaseSpeed:10,points:9,health:160,attackDamage:24,attackRange:3.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,.6,1.2),new f({color:9067050}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.25,5,4),new f({color:13148208}));n.position.set(0,1.5,.5),e.add(n);const i=new l(new y(.15,5,4),new f({color:8026746}));i.position.set(0,1.7,0),e.add(i);const a=new ce(.03,.15,4),o=new f({color:4868666});e.add(new l(a,o).translateX(-.06).translateY(1.9)),e.add(new l(a,o).translateX(.06).translateY(1.9));const r=new l(new A(.06,.03,.8,5),new f({color:2775594}));r.position.set(0,.9,-.8),r.rotation.x=.5,e.add(r);const c=new A(.06,.06,.5,6),h=new f({color:8014362});return[[-.25,.35,.35],[.25,.35,.35],[-.25,.35,-.35],[.25,.35,-.35]].forEach(d=>{e.add(new l(c,h).translateX(d[0]).translateY(d[1]).translateZ(d[2]))}),e}},minotauro:{name:"Minotauro",speed:3,chaseSpeed:8,points:8,health:160,attackDamage:24,attackRange:3.5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.8,1,.6),new f({color:5913114}));t.position.y=1.4,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.45,.4,.4),new f({color:4860426}));n.position.set(0,2.2,.1),e.add(n);const i=new ce(.05,.3,4),a=new f({color:13421738});e.add(new l(i,a).translateX(-.2).translateY(2.5).rotateZ(.3)),e.add(new l(i,a).translateX(.2).translateY(2.5).rotateZ(-.3));const o=new A(.1,.1,.8,6),r=new f({color:5913114});e.add(new l(o,r).translateX(-.5).translateY(1.3)),e.add(new l(o,r).translateX(.5).translateY(1.3));const c=new A(.1,.1,.8,6);return[[-.25,.4,0],[.25,.4,0]].forEach(h=>{e.add(new l(c,r).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},ciclope:{name:"Ciclope",speed:2,chaseSpeed:6,points:8,health:180,attackDamage:26,attackRange:4,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1,1.4,.7),new f({color:6969930}));t.position.y=1.6,t.castShadow=!0,e.add(t);const n=new l(new y(.4,6,5),new f({color:8022618}));n.position.set(0,2.7,0),e.add(n);const i=new l(new y(.15,5,4),new f({color:16729156}));i.position.set(0,2.75,.35),e.add(i);const a=new A(.125,.125,1,6),o=new f({color:6969930});e.add(new l(a,o).translateX(-.6).translateY(1.5)),e.add(new l(a,o).translateX(.6).translateY(1.5));const r=new A(.15,.15,.9,6);return[[-.3,.45,0],[.3,.45,0]].forEach(c=>{e.add(new l(r,o).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},hidra:{name:"Hidra",speed:3,chaseSpeed:7,points:9,health:180,attackDamage:22,attackRange:4,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.8,.6,1),new f({color:2771498}));t.position.y=.7,t.castShadow=!0,e.add(t);const n=new A(.08,.08,.7,5),i=new f({color:3824186});e.add(new l(n,i).translateX(-.2).translateY(1.3).translateZ(.3).rotateZ(.2)),e.add(new l(n,i).translateY(1.4).translateZ(.3)),e.add(new l(n,i).translateX(.2).translateY(1.3).translateZ(.3).rotateZ(-.2));const a=new y(.12,5,4),o=new f({color:4876874});return e.add(new l(a,o).translateX(-.3).translateY(1.7).translateZ(.4)),e.add(new l(a,o).translateY(1.8).translateZ(.4)),e.add(new l(a,o).translateX(.3).translateY(1.7).translateZ(.4)),e}},cerberus:{name:"Cerberus",speed:4,chaseSpeed:10,points:9,health:160,attackDamage:24,attackRange:3.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,.6,1),new f({color:2759194}));t.position.y=.9,t.castShadow=!0,e.add(t);const n=new y(.2,5,4),i=new f({color:3811882});e.add(new l(n,i).translateX(-.25).translateY(1.3).translateZ(.4)),e.add(new l(n,i).translateY(1.4).translateZ(.5)),e.add(new l(n,i).translateX(.25).translateY(1.3).translateZ(.4));const a=new y(.04,3,3),o=new f({color:16720384});e.add(new l(a,o).translateX(-.25).translateY(1.35).translateZ(.58)),e.add(new l(a,o).translateY(1.45).translateZ(.68)),e.add(new l(a,o).translateX(.25).translateY(1.35).translateZ(.58));const r=new A(.06,.06,.5,6),c=new f({color:2759194});return[[-.2,.35,.3],[.2,.35,.3],[-.2,.35,-.3],[.2,.35,-.3]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},kraken:{name:"Kraken",speed:2,chaseSpeed:6,points:9,health:200,attackDamage:26,attackRange:5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,6,5),new f({color:3811914}));t.position.y=.8,t.castShadow=!0,e.add(t);const n=new y(.1,4,3),i=new f({color:16776960});e.add(new l(n,i).translateX(-.2).translateY(.9).translateZ(.4)),e.add(new l(n,i).translateX(.2).translateY(.9).translateZ(.4));const a=new A(.06,.03,.8,5),o=new f({color:4864602});return e.add(new l(a,o).translateX(-.3).translateY(.2).rotateZ(.3)),e.add(new l(a,o).translateX(.3).translateY(.2).rotateZ(-.3)),e.add(new l(a,o).translateX(-.15).translateY(.15).translateZ(.2).rotateZ(.15)),e.add(new l(a,o).translateX(.15).translateY(.15).translateZ(.2).rotateZ(-.15)),e}},golem:{name:"Golem",speed:2,chaseSpeed:4,points:8,health:200,attackDamage:28,attackRange:3.5,detectionRange:10,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(1,1.2,.7),new f({color:6974042}));t.position.y=1.4,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.5,.4,.4),new f({color:8026730}));n.position.set(0,2.3,0),e.add(n);const i=new y(.06,4,3),a=new f({color:4521796});e.add(new l(i,a).translateX(-.12).translateY(2.35).translateZ(.2)),e.add(new l(i,a).translateX(.12).translateY(2.35).translateZ(.2));const o=new A(.15,.15,1,6),r=new f({color:5921354});e.add(new l(o,r).translateX(-.7).translateY(1.3)),e.add(new l(o,r).translateX(.7).translateY(1.3));const c=new A(.175,.175,.8,6);return[[-.3,.4,0],[.3,.4,0]].forEach(h=>{e.add(new l(c,r).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}},troll:{name:"Troll",speed:3,chaseSpeed:6,points:7,health:140,attackDamage:20,attackRange:3.5,detectionRange:14,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,1,.5),new f({color:4876858}));t.position.y=1.3,t.castShadow=!0,e.add(t);const n=new l(new y(.3,5,4),new f({color:5929546}));n.position.set(0,2.1,0),e.add(n);const i=new l(new ce(.06,.15,4),new f({color:4876858}));i.position.set(0,2,.3),i.rotation.x=-Math.PI/2,e.add(i);const a=new A(.1,.1,.9,6),o=new f({color:4876858});e.add(new l(a,o).translateX(-.5).translateY(1.2)),e.add(new l(a,o).translateX(.5).translateY(1.2));const r=new A(.1,.1,.7,6);return[[-.2,.4,0],[.2,.4,0]].forEach(c=>{e.add(new l(r,o).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},ogro:{name:"Ogro",speed:2,chaseSpeed:5,points:7,health:160,attackDamage:22,attackRange:4,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.9,1.1,.6),new f({color:5929530}));t.position.y=1.4,t.castShadow=!0,e.add(t);const n=new l(new y(.3,5,4),new f({color:6982218}));n.position.set(0,2.2,0),e.add(n);const i=new l(new y(.5,8,6).scale(.2,.1,.1),new f({color:3807770}));i.position.set(0,2.1,.28),e.add(i);const a=new A(.125,.125,.9,6),o=new f({color:5929530});e.add(new l(a,o).translateX(-.6).translateY(1.3)),e.add(new l(a,o).translateX(.6).translateY(1.3));const r=new A(.125,.125,.8,6);return[[-.25,.4,0],[.25,.4,0]].forEach(c=>{e.add(new l(r,o).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},vampiro:{name:"Vampiro",speed:5,chaseSpeed:12,points:7,health:90,attackDamage:18,attackRange:2.5,detectionRange:22,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.9,.3),new f({color:1710634}));t.position.y=1.2,t.castShadow=!0,e.add(t);const n=new l(new y(.2,5,4),new f({color:13684944}));n.position.set(0,1.9,0),e.add(n);const i=new l(new y(.5,8,6).scale(.7,.8,.1),new f({color:3803658}));i.position.set(0,1.2,-.2),e.add(i);const a=new y(.03,3,3),o=new f({color:16711680});e.add(new l(a,o).translateX(-.07).translateY(1.93).translateZ(.18)),e.add(new l(a,o).translateX(.07).translateY(1.93).translateZ(.18));const r=new A(.06,.06,.7,6),c=new f({color:1710634});return e.add(new l(r,c).translateX(-.12).translateY(.5)),e.add(new l(r,c).translateX(.12).translateY(.5)),e}},zumbi:{name:"Zumbi",speed:2,chaseSpeed:5,points:5,health:80,attackDamage:14,attackRange:2.5,detectionRange:12,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.8,.3),new f({color:4872762}));t.position.y=1.1,t.castShadow=!0,e.add(t);const n=new l(new y(.2,5,4),new f({color:5925450}));n.position.set(0,1.7,0),e.add(n);const i=new A(.05,.05,.6,6),a=new f({color:4872762});e.add(new l(i,a).translateX(-.3).translateY(1.1).translateZ(.15)),e.add(new l(i,a).translateX(.3).translateY(1.1).translateZ(.15));const o=new A(.06,.06,.6,6);return e.add(new l(o,a).translateX(-.12).translateY(.4)),e.add(new l(o,a).translateX(.12).translateY(.4)),e}},esqueleto:{name:"Esqueleto",speed:4,chaseSpeed:8,points:5,health:50,attackDamage:12,attackRange:2.5,detectionRange:16,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.3,.7,.2),new f({color:15263960}));t.position.y=1.1,t.castShadow=!0,e.add(t);const n=new l(new y(.18,5,4),new f({color:15263960}));n.position.set(0,1.7,0),e.add(n);const i=new y(.04,3,3),a=new f({color:1118481});e.add(new l(i,a).translateX(-.06).translateY(1.72).translateZ(.14)),e.add(new l(i,a).translateX(.06).translateY(1.72).translateZ(.14));const o=new A(.03,.03,.5,6),r=new f({color:15263960});e.add(new l(o,r).translateX(-.22).translateY(1)),e.add(new l(o,r).translateX(.22).translateY(1));const c=new A(.035,.035,.6,6);return e.add(new l(c,r).translateX(-.08).translateY(.4)),e.add(new l(c,r).translateX(.08).translateY(.4)),e}},demonio:{name:"Demônio",speed:4,chaseSpeed:11,points:9,health:140,attackDamage:24,attackRange:3,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.9,.4),new f({color:9050650}));t.position.y=1.3,t.castShadow=!0,e.add(t);const n=new l(new y(.25,5,4),new f({color:11151914}));n.position.set(0,2,0),e.add(n);const i=new ce(.04,.25,4),a=new f({color:2763306});e.add(new l(i,a).translateX(-.12).translateY(2.3)),e.add(new l(i,a).translateX(.12).translateY(2.3));const o=new y(.5,8,6).scale(.5,.4,.05),r=new f({color:4852234});e.add(new l(o,r).translateX(-.5).translateY(1.5).translateZ(-.2)),e.add(new l(o,r).translateX(.5).translateY(1.5).translateZ(-.2));const c=new l(new A(.03,.02,.6,4),new f({color:9050650}));return c.position.set(0,1,-.3),c.rotation.x=.5,e.add(c),e}},anjo:{name:"Anjo",speed:4,chaseSpeed:10,points:8,health:100,attackDamage:16,attackRange:3.5,detectionRange:22,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.4,.9,.3),new f({color:16777215}));t.position.y=3.5,t.castShadow=!0,e.add(t);const n=new l(new y(.2,6,5),new f({color:16772829}));n.position.set(0,4.2,0),e.add(n);const i=new l(new A(.2,.2,.04,8),new f({color:16768324}));i.position.set(0,4.5,0),e.add(i);const a=new y(.5,8,6).scale(.6,.6,.05),o=new f({color:16777215});return e.add(new l(a,o).translateX(-.5).translateY(3.7).translateZ(-.15)),e.add(new l(a,o).translateX(.5).translateY(3.7).translateZ(-.15)),e}},centauro:{name:"Centauro",speed:5,chaseSpeed:11,points:8,health:130,attackDamage:20,attackRange:3.5,detectionRange:18,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.6,.5,1.2),new f({color:8018490}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.4,.7,.3),new f({color:13148288}));n.position.set(0,1.7,.4),e.add(n);const i=new l(new y(.18,5,4),new f({color:13148288}));i.position.set(0,2.2,.4),e.add(i);const a=new A(.07,.07,.7,5),o=new f({color:6965802});return[[-.2,.35,.35],[.2,.35,.35],[-.2,.35,-.35],[.2,.35,-.35]].forEach(r=>{e.add(new l(a,o).translateX(r[0]).translateY(r[1]).translateZ(r[2]))}),e}},pegasus:{name:"Pégasus",speed:5,chaseSpeed:13,points:8,health:110,attackDamage:16,attackRange:3,detectionRange:24,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.45,1),new f({color:16777215}));t.position.y=3.5,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.3,.3),new f({color:16777215}));n.position.set(0,3.9,.5),e.add(n);const i=new y(.5,8,6).scale(.9,.06,.5),a=new f({color:15658734});e.add(new l(i,a).translateX(-.6).translateY(3.7)),e.add(new l(i,a).translateX(.6).translateY(3.7));const o=new A(.05,.05,.5,5),r=new f({color:15658734});return[[-.15,3,.3],[.15,3,.3],[-.15,3,-.3],[.15,3,-.3]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},unicornio:{name:"Unicórnio",speed:5,chaseSpeed:12,points:8,health:110,attackDamage:18,attackRange:3,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.5,.45,1),new f({color:16777215}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.5,8,6).scale(.25,.3,.3),new f({color:16777215}));n.position.set(0,1.4,.5),e.add(n);const i=new l(new ce(.04,.35,5),new f({color:16768324}));i.position.set(0,1.8,.55),e.add(i);const a=new l(new y(.5,8,6).scale(.1,.3,.4),new f({color:14518527}));a.position.set(0,1.4,.2),e.add(a);const o=new A(.06,.06,.6,5),r=new f({color:15658734});return[[-.15,.4,.3],[.15,.4,.3],[-.15,.4,-.3],[.15,.4,-.3]].forEach(c=>{e.add(new l(o,r).translateX(c[0]).translateY(c[1]).translateZ(c[2]))}),e}},manticora:{name:"Manticora",speed:4,chaseSpeed:10,points:9,health:150,attackDamage:22,attackRange:3.5,detectionRange:20,createMesh(){const e=new z,t=new l(new y(.5,8,6).scale(.7,.55,1.2),new f({color:13127728}));t.position.y=1,t.castShadow=!0,e.add(t);const n=new l(new y(.28,5,4),new f({color:13148288}));n.position.set(0,1.4,.5),e.add(n);const i=new l(new y(.35,5,4),new f({color:9056272}));i.position.set(0,1.4,.4),e.add(i);const a=new l(new A(.06,.04,.9,5),new f({color:13127728}));a.position.set(0,1,-.9),a.rotation.x=.4,e.add(a);const o=new l(new y(.1,4,3),new f({color:4860442}));o.position.set(0,1.2,-1.3),e.add(o);const r=new A(.06,.06,.5,6),c=new f({color:11550752});return[[-.25,.35,.35],[.25,.35,.35],[-.25,.35,-.35],[.25,.35,-.35]].forEach(h=>{e.add(new l(r,c).translateX(h[0]).translateY(h[1]).translateZ(h[2]))}),e}}});let jn=Wa;const Mt={bastao:{name:"BASTAO",damage:12,type:"melee",range:4,cooldown:.3},pistola:{name:"PISTOLA",damage:20,type:"hitscan",range:40,cooldown:.12},adaga:{name:"ADAGA",damage:10,type:"melee",range:3,cooldown:.18},funda:{name:"FUNDA",damage:8,type:"ranged",range:50,cooldown:.5},chicote:{name:"CHICOTE",damage:9,type:"melee",range:5.5,cooldown:.35},bumerangue:{name:"BUMERANGUE",damage:11,type:"ranged",range:30,cooldown:.6},clava:{name:"CLAVA",damage:13,type:"melee",range:3.5,cooldown:.4},florete:{name:"FLORETE",damage:14,type:"melee",range:4.5,cooldown:.22},arco:{name:"ARCO",damage:15,type:"ranged",range:70,cooldown:.6},lanca:{name:"LANCA",damage:16,type:"melee",range:6,cooldown:.45},rapieira:{name:"RAPIEIRA",damage:16,type:"melee",range:4.5,cooldown:.2},sabre:{name:"SABRE",damage:17,type:"melee",range:4,cooldown:.28},espada:{name:"ESPADA",damage:18,type:"melee",range:4,cooldown:.3},tridente:{name:"TRIDENTE",damage:19,type:"melee",range:5.5,cooldown:.4},besta:{name:"BESTA",damage:20,type:"ranged",range:80,cooldown:.8},maca:{name:"MACA",damage:22,type:"melee",range:3.5,cooldown:.5},machado:{name:"MACHADO DE BATALHA",damage:24,type:"melee",range:3.5,cooldown:.55},alabarda:{name:"ALABARDA",damage:25,type:"melee",range:6,cooldown:.6},martelo:{name:"MARTELO DE GUERRA",damage:26,type:"melee",range:3.5,cooldown:.65},ak47:{name:"AK-47",damage:30,type:"hitscan",range:60,cooldown:.4},minigun:{name:"MINIGUN",damage:40,type:"hitscan",range:1e26,cooldown:1e-30,precoMoney:1e7,precoTokens:500,precoRodadaMoney:1e6},cajado_fogo:{name:"CAJADO DE FOGO",damage:25,type:"hitscan",range:30,cooldown:2.3,precoMoney:25e3,precoTokens:25},bazuca:{name:"BAZUCA",damage:100,type:"projectile",range:80,cooldown:11,ammoType:"bazuca",precoMoney:1e8,precoTokens:1e4,precoRodadaMoney:1e6,preco5RodadasTokens:500},april_fools:{name:"APRIL FOOLS GUN",damage:.5,type:"hitscan",range:50,cooldown:20,descricao:"OMG, IS THAT THE BEST GUN IN THE GAME?! LOL *-*",precoMoney:5e5,precoTokens:500},chicken_gun:{name:"CHICKEN GUN",damage:5,type:"projectile",range:60,cooldown:5,ammoType:"chicken",precoMoney:490,precoTokens:490,preco3RodadasMoney:24500,preco3RodadasTokens:24},sniper:{name:"SNIPER",damage:120,type:"hitscan",range:200,cooldown:2,ammoType:"sniper",precoMoney:5e4,precoTokens:50}};function Dc(){const s=Math.random()*1e3;return s<1?1/0:s<10?1e3:s<250?20:s<500?15:10}class _f{constructor(e,t,n){this.scene=e,this.camera=t,this.arena=n,this.raycaster=new pf,this.cooldown=0,this.recoil=0,this.projectiles=[],this.pendingHits=[],this.explosions=[],this.mouseHeld=!1,this.zoomed=!1,this._lastTargets=[],this.inventory=["bastao","pistola"],this.currentIndex=0,this.currentWeapon="bastao",this.ammo=30,this.weaponGroup=new z,this.camera.add(this.weaponGroup),this.hitboxMesh=new l(new Z(1,1,1),new We({color:16711680,transparent:!0,opacity:.15,wireframe:!1})),this.hitboxWire=new cf(new lf(new Z(1,1,1)),new Rc({color:16711680,transparent:!0,opacity:.4})),this.hitboxMesh.visible=!1,this.hitboxWire.visible=!1,this.camera.add(this.hitboxMesh),this.camera.add(this.hitboxWire),this.hitboxTimer=0,this.updateHitbox(),this.buildCurrentModel(),this.setupInput(),this.updateDisplay()}setupInput(){document.addEventListener("keydown",e=>{e.code==="KeyR"&&this.cycleWeapon(),(e.code==="ControlLeft"||e.code==="ControlRight")&&this.currentWeapon==="sniper"&&this.toggleZoom()}),document.addEventListener("wheel",e=>{e.deltaY>0?this.cycleWeapon(1):this.cycleWeapon(-1)}),document.addEventListener("mousedown",e=>{e.button===0&&(this.mouseHeld=!0)}),document.addEventListener("mouseup",e=>{e.button===0&&(this.mouseHeld=!1)})}toggleZoom(){this.zoomed=!this.zoomed,this.zoomed?this.camera.fov=15:this.camera.fov=75,this.camera.updateProjectionMatrix()}addWeapon(e,t){this.inventory.includes(e)||this.inventory.push(e),t&&t!==1/0&&(this.ammo+=t),this.updateInventoryDisplay()}addAmmo(e,t){this.ammo+=t}getAmmo(e){const t=Mt[e];return!t||t.type==="melee"?1/0:this.ammo}getCurrentAmmo(){return this.getAmmo(this.currentWeapon)}swapWeapons(e,t){e<0||t<0||e>=this.inventory.length||t>=this.inventory.length||([this.inventory[e],this.inventory[t]]=[this.inventory[t],this.inventory[e]],this.currentIndex===e?this.currentIndex=t:this.currentIndex===t&&(this.currentIndex=e),this.currentWeapon=this.inventory[this.currentIndex],this.updateDisplay())}cycleWeapon(e=1){this.inventory.length<=1||(this.currentIndex=(this.currentIndex+e+this.inventory.length)%this.inventory.length,this.currentWeapon=this.inventory[this.currentIndex],this.buildCurrentModel(),this.updateHitbox(),this.updateDisplay())}dropCurrentWeapon(){if(this.inventory.length<=1)return null;const e=this.currentWeapon;return this.inventory.splice(this.currentIndex,1),this.currentIndex=this.currentIndex%this.inventory.length,this.currentWeapon=this.inventory[this.currentIndex],this.buildCurrentModel(),this.updateHitbox(),this.updateDisplay(),this.updateInventoryDisplay(),e}updateDisplay(){const e=Mt[this.currentWeapon],t=document.getElementById("weapon-display");if(t){let n=e.name+" (DMG:"+e.damage+")";e.type!=="melee"&&(n+=" | "+(this.currentWeapon==="minigun"?"INF":this.ammo)),t.textContent=n}this.updateInventoryDisplay()}updateInventoryDisplay(){const e=document.getElementById("inventory-display");e&&(e.innerHTML=this.inventory.map((t,n)=>{const i=Mt[t];let o=(n===this.currentIndex?"> ":"  ")+i.name;return i.type!=="melee"&&(o+=" ["+(t==="minigun"?"INF":this.ammo)+"]"),o}).join("<br>"))}updateHitbox(){const e=Mt[this.currentWeapon],t=Math.min(e.range,8),n=e.type==="melee"?1.5:.6,i=e.type==="melee"?1.5:.6;this.hitboxMesh.scale.set(n,i,t),this.hitboxMesh.position.set(0,0,-t/2),this.hitboxWire.scale.set(n,i,t),this.hitboxWire.position.set(0,0,-t/2)}showHitbox(){this.hitboxMesh.visible=!0,this.hitboxWire.visible=!0,this.hitboxTimer=.2}buildCurrentModel(){for(;this.weaponGroup.children.length>0;)this.weaponGroup.remove(this.weaponGroup.children[0]);const e=this.createWeaponModel(this.currentWeapon);this.weaponGroup.add(e)}createWeaponModel(e){const t=new z,n=Mt[e];return n.type==="ranged"||n.type==="hitscan"||n.type==="projectile"?this.createRangedModel(e,t):this.createMeleeModel(e,t)}createMeleeModel(e,t){const n=new f({color:8947848}),i=new f({color:4861976}),a=new f({color:11184844}),o=new f({color:2630430}),r=new f({color:7094820}),c=new f({color:12094261});switch(e){case"bastao":{const h=new l(new A(.035,.04,1.6,6),i);h.position.set(.35,-.15,-.5),h.rotation.x=Math.PI/2+.15,t.add(h);const d=new l(new A(.046,.046,.34,6),r);d.position.set(.35,-.15,-.02),d.rotation.x=Math.PI/2+.15,t.add(d);const u=new l(new ce(.055,.12,6),c);u.position.set(.35,-.03,-1.3),u.rotation.x=Math.PI/2,t.add(u);break}case"adaga":{const h=new l(new A(.012,.022,.32,8),a);h.position.set(.3,-.2,-.45),h.rotation.x=Math.PI/2,t.add(h);const d=new l(new A(.012,.015,.22,5),r);d.position.set(.3,-.2,-.18),t.add(d);const u=new l(new vt(.03,.008,4,8),c);u.position.set(.3,-.2,-.02),u.rotation.x=Math.PI/2,t.add(u);const p=new l(new ce(.028,.1,4),a);p.position.set(.3,-.2,-.62),p.rotation.x=Math.PI/2,t.add(p);const m=new l(new y(.035,6,4),c);m.position.set(.3,-.2,-.08),t.add(m);break}case"clava":{const h=new l(new A(.03,.04,1,5),i);h.position.set(.32,-.15,-.4),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.045,.04,.28,6),r);d.position.set(.32,-.15,-.02),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new Ei(.12,0),o);u.position.set(.32,-.12,-.95),t.add(u);for(const p of[-.075,.075]){const m=new l(new ce(.025,.06,4),c);m.position.set(.32+p,-.12,-1.03),m.rotation.x=Math.PI/2,t.add(m)}break}case"florete":{const h=new l(new A(.008,.008,.9,4),a);h.rotation.x=Math.PI/2,h.position.set(.3,-.22,-.65),t.add(h);const d=new l(new ce(.022,.13,4),a);d.position.set(.3,-.22,-1.165),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new y(.06,6,4),n);u.position.set(.3,-.22,-.18),u.scale.set(1,.3,1),t.add(u);const p=new l(new A(.02,.02,.18,5),r);p.position.set(.3,-.22,-.05),p.rotation.x=Math.PI/2,t.add(p);const m=new l(new y(.035,6,4),c);m.position.set(.3,-.22,.06),t.add(m);break}case"lanca":{const h=new l(new A(.025,.025,2,5),i);h.position.set(.32,-.15,-.7),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.037,.034,.36,6),r);d.position.set(.32,-.15,-.02),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new A(.043,.043,.09,6),c);u.position.set(.32,-.06,-1.54),u.rotation.x=Math.PI/2,t.add(u);const p=new l(new ce(.04,.2,4),a);p.position.set(.32,-.08,-1.7),p.rotation.x=Math.PI/2,t.add(p);break}case"rapieira":{const h=new l(new A(.006,.006,.85,4),a);h.rotation.x=Math.PI/2,h.position.set(.3,-.22,-.6),t.add(h);const d=new l(new ce(.018,.12,4),a);d.position.set(.3,-.22,-1.085),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new vt(.065,.01,4,8),c);u.rotation.z=Math.PI/2,u.position.set(.3,-.22,-.15),t.add(u);const p=new l(new vt(.065,.009,4,8),n);p.position.set(.3,-.22,-.12),t.add(p);const m=new l(new A(.02,.02,.2,5),r);m.position.set(.3,-.22,-.02),m.rotation.x=Math.PI/2,t.add(m);const x=new l(new y(.032,6,4),c);x.position.set(.3,-.22,.1),t.add(x);break}case"sabre":{const h=new l(new A(.008,.012,.6,6),a);h.position.set(.3,-.22,-.55),h.rotation.x=Math.PI/2,t.add(h);const d=new l(new ce(.032,.12,4),a);d.position.set(.3,-.22,-.95),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new A(.04,.03,.04,6),c);u.position.set(.3,-.18,-.1),u.rotation.z=Math.PI/2,t.add(u);const p=new l(new vt(.045,.008,4,8,Math.PI),n);p.position.set(.3,-.17,-.08),p.rotation.z=Math.PI,t.add(p);const m=new l(new A(.015,.015,.16,5),r);m.position.set(.3,-.22,-.04),m.rotation.x=Math.PI/2,t.add(m);const x=new l(new y(.035,6,4),c);x.position.set(.3,-.22,.09),t.add(x);break}case"espada":{const h=new l(new A(.006,.008,.68,6),a);h.position.set(.3,-.22,-.6),h.rotation.x=Math.PI/2,t.add(h);const d=new l(new A(.005,.004,.35,6),n);d.position.set(.3,-.22,-.52),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new ce(.035,.12,4),a);u.position.set(.3,-.22,-1),u.rotation.x=Math.PI/2,t.add(u);const p=new l(new A(.045,.035,.03,6),c);p.position.set(.3,-.18,-.12),p.rotation.z=Math.PI/2,t.add(p);const m=new l(new A(.015,.015,.18,5),r);m.position.set(.3,-.22,-.015),m.rotation.x=Math.PI/2,t.add(m);const x=new l(new Ei(.03,0),c);x.position.set(.3,-.22,.12),t.add(x);break}case"tridente":{const h=new l(new A(.025,.025,1.8,5),i);h.position.set(.32,-.15,-.6),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.034,.034,.32,5),r);d.position.set(.32,-.16,-.02),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new A(.045,.045,.07,5),c);u.position.set(.32,-.08,-1.36),u.rotation.x=Math.PI/2+.1,t.add(u);const p=new l(new A(.04,.035,.22,6),c);p.position.set(.32,-.08,-1.43),p.rotation.x=Math.PI/2,t.add(p);for(let x=-1;x<=1;x++){const _=new l(new ce(.02,.16,4),a);_.position.set(.32+x*.07,-.08,-1.58),_.rotation.x=Math.PI/2,x!==0&&(_.rotation.z=x*.16),t.add(_)}const m=new l(new ce(.035,.08,5),c);m.position.set(.32,-.15,.33),m.rotation.x=-Math.PI/2+.1,t.add(m);break}case"machado":{const h=new l(new A(.03,.03,1,5),i);h.position.set(.32,-.15,-.4),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.04,.04,.32,5),r);d.position.set(.32,-.16,-.02),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new A(.02,.025,.25,4),n);u.position.set(.4,-.1,-.9),u.scale.set(1.2,1,1),u.rotation.z=-.16,t.add(u);const p=new l(new A(.05,.05,.16,5),c);p.position.set(.32,-.1,-.9),p.rotation.z=Math.PI/2,t.add(p);const m=new l(new ce(.07,.12,4),n);m.position.set(.45,-.13,-.95),m.rotation.z=-Math.PI/2,t.add(m);const x=new l(new y(.04,6,4),c);x.position.set(.32,-.15,.15),t.add(x);break}case"alabarda":{const h=new l(new A(.025,.025,2,5),i);h.position.set(.32,-.15,-.7),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.034,.034,.34,5),r);d.position.set(.32,-.16,-.02),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new A(.047,.047,.08,5),c);u.position.set(.32,-.08,-1.45),u.rotation.x=Math.PI/2+.1,t.add(u);const p=new l(new A(.02,.03,.28,4),n);p.position.set(.39,-.1,-.9),p.scale.set(1.3,1.2,1.1),p.rotation.z=-.15,t.add(p);const m=new l(new ce(.06,.15,4),o);m.position.set(.22,-.06,-1.6),m.rotation.z=Math.PI/2,t.add(m);const x=new l(new ce(.028,.15,4),a);x.position.set(.32,-.03,-1.82),x.rotation.x=Math.PI/2,t.add(x);const _=new l(new ce(.045,.1,5),c);_.position.set(.32,-.15,.33),_.rotation.x=-Math.PI/2+.1,t.add(_);break}case"martelo":{const h=new l(new A(.035,.035,.9,5),i);h.position.set(.32,-.15,-.35),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.047,.047,.32,5),r);d.position.set(.32,-.16,-.01),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new A(.08,.06,.12,4),o);u.position.set(.32,-.1,-.88),u.rotation.x=Math.PI/4,t.add(u);for(const x of[-.105,.105]){const _=new l(new A(.05,.04,.04,5),n);_.position.set(.32+x,-.1,-.85),_.rotation.z=Math.PI/2,t.add(_)}const p=new l(new A(.05,.05,.08,5),c);p.position.set(.32,-.12,-.7),p.rotation.x=Math.PI/2+.1,t.add(p);const m=new l(new y(.04,6,4),c);m.position.set(.32,-.15,.16),t.add(m);break}default:{const h=new l(new A(.03,.03,1,5),i);h.position.set(.32,-.15,-.4),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.04,.04,.3,5),r);d.position.set(.32,-.16,-.02),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new y(.045,6,4),c);u.position.set(.32,-.15,.15),t.add(u)}}return t}createRangedModel(e,t){const n=new f({color:8947848}),i=new f({color:4861976}),a=new f({color:2630430}),o=new f({color:7094820}),r=new f({color:12094261}),c=new f({color:13421738});switch(e){case"pistola":{const h=new l(new A(.04,.045,.34,8),a);h.position.set(.3,-.22,-.32),t.add(h);const d=new l(new A(.024,.024,.32,8),n);d.position.set(.3,-.2,-.62),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new ce(.06,.03,6),r);u.position.set(.3,-.2,-.8),u.rotation.x=Math.PI/2,t.add(u);const p=new l(new y(.022,6,4),n);p.position.set(.3,-.16,-.12),t.add(p);const m=new l(new A(.018,.025,.07,4),r);m.position.set(.3,-.16,-.5),t.add(m);const x=new l(new A(.018,.032,.14,6),o);x.position.set(.3,-.33,-.16),x.rotation.x=.3,t.add(x);const _=new l(new vt(.04,.009,4,6,Math.PI),r);_.position.set(.3,-.29,-.28),_.rotation.y=Math.PI/2,t.add(_);break}case"funda":{const h=new l(new Ei(.075,1),o);h.position.set(.3,-.22,-.4),t.add(h);const d=new l(new vt(.06,.009,4,8),r);d.position.set(.3,-.22,-.34),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new A(.009,.009,.5,4),c);u.position.set(.3,-.22,-.15),u.rotation.x=Math.PI/2,t.add(u);const p=new l(new A(.009,.009,.46,4),c);p.position.set(.3,-.22,-.38),p.rotation.z=Math.PI/2,t.add(p);const m=new l(new y(.025,5,4),r);m.position.set(.3,-.22,.1),t.add(m);break}case"bumerangue":{const h=new l(new A(.022,.028,.38,4),i);h.position.set(.3,-.22,-.45),h.rotation.y=.42,t.add(h);const d=new l(new A(.022,.028,.38,4),i);d.position.set(.3,-.22,-.45),d.rotation.y=-.42,t.add(d);const u=new l(new y(.045,5,4),r);u.position.set(.3,-.22,-.45),t.add(u);for(const p of[.42,-.42]){const m=new l(new A(.012,.018,.26,4),a);m.position.set(.3,-.21,-.48),m.rotation.y=p,t.add(m)}break}case"arco":{const h=new l(new vt(.3,.02,4,10,Math.PI),i);h.position.set(.3,-.22,-.5),h.rotation.y=Math.PI/2,t.add(h);const d=new l(new A(.028,.028,.16,5),o);d.position.set(.3,-.22,-.5),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new A(.004,.004,.55,4),c);u.position.set(.3,-.22,-.5),t.add(u);const p=new l(new A(.009,.009,.52,4),i);p.position.set(.3,-.22,-.62),p.rotation.x=Math.PI/2,t.add(p);const m=new l(new ce(.026,.1,4),n);m.position.set(.3,-.22,-.93),m.rotation.x=Math.PI/2,t.add(m);for(const x of[-.022,.022]){const _=new l(new A(.006,.006,.07,4),r);_.position.set(.3+x,-.22,-.36),t.add(_)}break}case"besta":{const h=new l(new A(.035,.045,.55,6),i);h.position.set(.3,-.28,-.3),t.add(h);const d=new l(new A(.025,.02,.6,4),a);d.position.set(.3,-.22,-.38),t.add(d);const u=new l(new A(.009,.009,.56,4),i);u.position.set(.3,-.19,-.57),u.rotation.x=Math.PI/2,t.add(u);const p=new l(new ce(.025,.09,4),n);p.position.set(.3,-.19,-.91),p.rotation.x=Math.PI/2,t.add(p);const m=new l(new A(.02,.015,.4,4),i);m.position.set(.08,-.24,-.67),m.rotation.z=.2,t.add(m);const x=new l(new A(.02,.015,.4,4),i);x.position.set(.52,-.24,-.67),x.rotation.z=-.2,t.add(x);const _=new l(new A(.004,.004,.43,4),c);_.position.set(.3,-.24,-.68),_.rotation.z=Math.PI/2,t.add(_);const w=new l(new vt(.06,.008,4,6,Math.PI),n);w.position.set(.3,-.24,-.83),w.rotation.y=Math.PI/2,t.add(w);const g=new l(new A(.012,.012,.05,4),r);g.position.set(.3,-.35,-.14),g.rotation.x=-.25,t.add(g);break}case"ak47":{const h=new f({color:2105374}),d=new f({color:4014147}),u=new f({color:5913120}),p=new l(new A(.04,.045,.52,6),h);p.position.set(.3,-.22,-.36),t.add(p);const m=new l(new A(.035,.04,.4,6),d);m.position.set(.3,-.25,-.32),t.add(m);const x=new l(new A(.036,.03,.36,6),d);x.position.set(.3,-.17,-.38),t.add(x);const _=new l(new A(.02,.02,.5,8),d);_.position.set(.3,-.2,-.74),_.rotation.x=Math.PI/2,t.add(_);const w=new l(new A(.023,.02,.07,8),h);w.position.set(.3,-.2,-.51),w.rotation.x=Math.PI/2,t.add(w);const g=new l(new A(.007,.007,.34,8),d);g.position.set(.3,-.155,-.66),g.rotation.x=Math.PI/2,t.add(g);const S=new l(new A(.022,.022,.07,8),h);S.position.set(.3,-.155,-.86),t.add(S);const v=new l(new A(.012,.025,.045,4),h);v.position.set(.3,-.14,-.9),t.add(v);const E=new l(new A(.015,.015,.09,8),h);E.position.set(.3,-.2,-1.02),E.rotation.x=Math.PI/2,t.add(E);const I=new l(new A(.025,.025,.24,6),d);I.position.set(.3,-.4,-.3),I.rotation.x=.35,t.add(I);const C=new l(new A(.0275,.0175,.1,6),h);C.position.set(.3,-.53,-.22),C.rotation.x=.35,t.add(C);const P=new l(new A(.0275,.03,.24,6),u);P.position.set(.3,-.19,-.56),t.add(P);const k=new l(new A(.03,.0175,.22,6),u);k.position.set(.3,-.23,-.55),t.add(k);const b=new l(new A(.0275,.045,.3,6),u);b.position.set(.3,-.24,-.02),b.rotation.x=-.08,t.add(b);const M=new l(new A(.035,.0525,.06,6),u);M.position.set(.3,-.24,.14),M.rotation.x=-.08,t.add(M);const U=new l(new A(.0375,.0575,.02,6),h);U.position.set(.3,-.24,.18),U.rotation.x=-.08,t.add(U);const O=new l(new vt(.035,.006,4,6,Math.PI),d);O.position.set(.3,-.3,-.27),O.rotation.y=Math.PI/2,t.add(O);const L=new l(new A(.015,.015,.045,4),h);L.position.set(.3,-.16,-.5),t.add(L);const H=new l(new A(.0175,.01,.07,6),d);H.position.set(.33,-.2,-.42),t.add(H);break}case"minigun":{const h=new f({color:1842206}),d=new f({color:3816768}),u=new f({color:5593180}),p=new l(new A(.085,.095,.5,12),h);p.position.set(.3,-.22,-.38),p.rotation.x=Math.PI/2,t.add(p);for(const P of[-.6,-.72,-.84]){const k=new l(new vt(.09,.01,6,12),r);k.position.set(.3,-.22,P),k.rotation.x=Math.PI/2,t.add(k)}for(let P=0;P<6;P++){const k=P/6*Math.PI*2,b=new l(new A(.02,.02,.72,8),d);b.position.set(.3+Math.cos(k)*.058,-.22+Math.sin(k)*.058,-.78),b.rotation.x=Math.PI/2,t.add(b);const M=new l(new A(.028,.02,.05,8),u);M.position.set(.3+Math.cos(k)*.058,-.22+Math.sin(k)*.058,-1.13),M.rotation.x=Math.PI/2,t.add(M)}const m=new l(new A(.03,.03,.78,8),r);m.position.set(.3,-.22,-.78),m.rotation.x=Math.PI/2,t.add(m);const x=new l(new A(.06,.065,.24,6),h);x.position.set(.3,-.22,-.04),t.add(x);const _=new l(new A(.05,.06,.24,6),d);_.position.set(.3,-.14,-.04),t.add(_);const w=new l(new A(.075,.075,.09,10),u);w.position.set(.3,-.22,.1),w.rotation.x=Math.PI/2,t.add(w);const g=new l(new vt(.078,.008,5,10),r);g.position.set(.3,-.22,.05),g.rotation.x=Math.PI/2,t.add(g);for(let P=0;P<8;P++){const k=new l(new A(.0175,.009,.05,4),r);k.position.set(.3+.055*(P+.5),-.13,-.24-Math.sin(P*.5)*.02),k.rotation.z=-.5,t.add(k)}const S=new l(new A(.06,.09,.14,6),h);S.position.set(.42,-.13,-.2),S.rotation.z=.35,t.add(S);const v=new l(new A(.012,.012,.06,5),r);v.position.set(.47,-.08,-.2),v.rotation.z=.35,t.add(v);const E=new l(new A(.03,.085,.06,6),o);E.position.set(.3,-.37,-.13),E.rotation.x=.18,t.add(E);for(const[P,k]of[[-.32,-.13],[-.28,-.12]]){const b=new l(new vt(.037,.007,4,8),r);b.position.set(.3,P,k),b.rotation.x=.18,b.rotation.z=Math.PI/2,t.add(b)}const I=new l(new A(.02,.06,.04,6),h);I.position.set(.3,-.33,-.55),I.rotation.x=.15,t.add(I);const C=new l(new A(.01,.045,.22,6),h);C.position.set(.3,-.13,-.32),t.add(C);break}case"cajado_fogo":{const h=new l(new A(.03,.038,1.4,6),i);h.position.set(.3,-.15,-.5),h.rotation.x=Math.PI/2+.1,t.add(h);const d=new l(new A(.042,.04,.3,6),o);d.position.set(.3,-.16,-.02),d.rotation.x=Math.PI/2+.1,t.add(d);const u=new l(new A(.05,.05,.07,6),r);u.position.set(.3,-.09,-1.22),u.rotation.x=Math.PI/2+.1,t.add(u);const p=new hf({color:16755251,emissive:16733440,emissiveIntensity:1.6}),m=new l(new y(.07,10,8),p);m.position.set(.3,-.07,-1.35),t.add(m);const x=new l(new y(.04,8,6),new We({color:16772795}));x.position.set(.3,-.07,-1.35),t.add(x);for(let _=0;_<4;_++){const w=_/4*Math.PI*2,g=new l(new ce(.035,.12,5),new We({color:16746496,transparent:!0,opacity:.8}));g.position.set(.3+Math.cos(w)*.05,-.07+Math.sin(w)*.05,-1.35),g.rotation.z=Math.PI/2+w,t.add(g)}break}case"bazuca":{const h=new f({color:3092271}),d=new l(new A(.06,.06,.95,10),h);d.position.set(.3,-.2,-.6),d.rotation.x=Math.PI/2,t.add(d);const u=new l(new A(.075,.07,.12,10),a);u.position.set(.3,-.2,-1.1),u.rotation.x=Math.PI/2,t.add(u);const p=new l(new A(.05,.06,.16,8),a);p.position.set(.3,-.2,-.12),p.rotation.x=Math.PI/2,t.add(p);const m=new l(new A(.032,.032,.5,8),n);m.position.set(.3,-.2,-.75),m.rotation.x=Math.PI/2,t.add(m);const x=new l(new ce(.032,.16,8),r);x.position.set(.3,-.2,-1.03),x.rotation.x=Math.PI/2,t.add(x);const _=new l(new A(.028,.028,.1,8),new f({color:12597547}));_.position.set(.3,-.2,-.9),_.rotation.x=Math.PI/2,t.add(_);const w=new l(new y(.022,6,4),r);w.scale.set(.9,1.4,1.1),w.position.set(.3,-.12,-.7),t.add(w);const g=new l(new A(.022,.026,.12,6),o);g.position.set(.3,-.32,-.42),g.rotation.x=.25,t.add(g);const S=new l(new A(.02,.02,.13,6),i);S.position.set(.3,-.32,-.15),S.rotation.x=.2,t.add(S);break}case"april_fools":{const h=new f({color:16766720}),d=new f({color:16770394}),u=new l(new A(.028,.03,.22,8),h);u.rotation.x=Math.PI/2,u.position.set(.3,-.2,-.3),t.add(u);const p=new l(new A(.022,.024,.3,8),d);p.rotation.x=Math.PI/2,p.position.set(.3,-.165,-.38),t.add(p);const m=new l(new A(.016,.016,.22,6),d);m.position.set(.3,-.185,-.65),m.rotation.x=Math.PI/2,t.add(m);const x=new l(new A(.024,.024,.05,6),h);x.position.set(.3,-.185,-.79),x.rotation.x=Math.PI/2,t.add(x);const _=new l(new A(.024,.028,.13,6),h);_.position.set(.3,-.3,-.16),_.rotation.x=.3,t.add(_);const w=new l(new y(.02,6,4),d);w.scale.set(1.6,1.3,1.3),w.position.set(.3,-.155,-.12),t.add(w);const g=new l(new Ja(.018,0),d);g.position.set(.3,-.17,-.42),t.add(g);break}case"chicken_gun":{const h=new f({color:16244811}),d=new f({color:16747546}),u=new l(new A(.035,.038,.3,8),a);u.rotation.x=Math.PI/2,u.position.set(.3,-.2,-.32),t.add(u);const p=new l(new y(.075,10,8),h);p.position.set(.3,-.16,-.6),p.scale.set(1,.85,1.4),t.add(p);const m=new l(new y(.045,8,6),h);m.position.set(.3,-.11,-.78),t.add(m);const x=new l(new y(.018,5,4),new f({color:14231078}));x.position.set(.3,-.055,-.8),x.scale.set(1,.6,1),t.add(x);const _=new l(new ce(.02,.07,4),d);_.position.set(.3,-.11,-.84),_.rotation.x=Math.PI/2,t.add(_);const w=new l(new y(.012,5,4),d);w.position.set(.3,-.16,-.79),t.add(w);const g=new l(new A(.018,.018,.3,6),a);g.position.set(.3,-.2,-.85),g.rotation.x=Math.PI/2,t.add(g);const S=new l(new y(.03,6,5),h);S.position.set(.34,-.16,-.6),S.scale.set(.7,1,1.2),t.add(S);const v=new l(new A(.025,.03,.13,6),o);v.position.set(.3,-.33,-.16),v.rotation.x=.3,t.add(v);break}case"sniper":{const h=new f({color:1710618}),d=new l(new A(.045,.052,.55,8),i);d.rotation.x=Math.PI/2,d.position.set(.3,-.26,-.18),t.add(d);const u=new l(new A(.05,.06,.16,8),o);u.rotation.x=Math.PI/2,u.position.set(.3,-.26,.14),t.add(u);const p=new l(new A(.04,.043,.5,8),a);p.rotation.x=Math.PI/2,p.position.set(.3,-.22,-.55),t.add(p);const m=new l(new A(.016,.016,.9,8),n);m.position.set(.3,-.205,-1),m.rotation.x=Math.PI/2,t.add(m);const x=new l(new A(.026,.026,.08,8),a);x.position.set(.3,-.205,-1.45),x.rotation.x=Math.PI/2,t.add(x);const _=new l(new A(.032,.032,.34,10),h);_.position.set(.3,-.14,-.62),_.rotation.x=Math.PI/2,t.add(_);const w=new l(new A(.038,.032,.07,10),a);w.position.set(.3,-.14,-.46),w.rotation.x=Math.PI/2,t.add(w);const g=new l(new A(.038,.032,.07,10),a);g.position.set(.3,-.14,-.79),g.rotation.x=Math.PI/2,t.add(g);const S=new We({color:8965375}),v=new l(new wn(.028,10),S);v.position.set(.3,-.14,-.43),v.rotation.y=Math.PI/2,t.add(v);const E=new l(new wn(.028,10),S);E.position.set(.3,-.14,-.82),E.rotation.y=-Math.PI/2,t.add(E);const I=new l(new A(.014,.016,.1,6),a);I.rotation.x=Math.PI/2,I.position.set(.3,-.18,-.62),t.add(I);const C=new l(new A(.028,.022,.14,6),n);C.position.set(.3,-.33,-.55),C.rotation.x=.12,t.add(C);const P=new l(new A(.024,.028,.13,6),o);P.position.set(.3,-.33,-.3),P.rotation.x=.25,t.add(P);const k=new l(new A(.012,.012,.1,6),a);k.position.set(.3,-.33,-1),t.add(k);break}default:{const h=new l(new A(.04,.04,.5,8),i);h.rotation.x=Math.PI/2,h.position.set(.3,-.22,-.4),t.add(h);const d=new l(new A(.025,.025,.18,6),n);d.position.set(.3,-.22,-.75),d.rotation.x=Math.PI/2,t.add(d)}}return t}fire(e){if(this.cooldown>0)return null;const t=Mt[this.currentWeapon];if(this._lastTargets=e||[],t.type!=="melee"&&this.currentWeapon!=="minigun"){if(this.ammo<=0)return null;this.ammo--}if(this.cooldown=t.cooldown,this.recoil=1,this.showHitbox(),this.raycaster.far=t.range,t.type==="melee")return at.knifeSlash(),this.meleeHit(e,t.range);if(t.type==="hitscan"){at.gunshot(),this.updateDisplay();const n=this.hitscanHit(e,t.range);if(this.currentWeapon==="minigun"){const i=this.hitscanHit(e,t.range);i&&this.pendingHits.push({target:i,damage:t.damage})}return n}return at.crossbowShoot(),this.spawnProjectile(e),this.updateDisplay(),null}getDamage(){return Mt[this.currentWeapon].damage}meleeHit(e,t){const n=new N(0,0,-1).applyQuaternion(this.camera.quaternion);this.raycaster.set(this.camera.position,n),this.raycaster.far=t;const i=e.filter(r=>r.alive),a=[];i.forEach(r=>r.mesh.traverse(c=>{c.isMesh&&a.push(c)}));const o=this.raycaster.intersectObjects(a);if(o.length>0){const r=o[0].object;return i.find(c=>{let h=!1;return c.mesh.traverse(d=>{d===r&&(h=!0)}),h})||null}return null}hitscanHit(e,t){const n=new N(0,0,-1).applyQuaternion(this.camera.quaternion);this.raycaster.set(this.camera.position,n),this.raycaster.far=t;const i=e.filter(r=>r.alive),a=[];i.forEach(r=>r.mesh.traverse(c=>{c.isMesh&&a.push(c)}));const o=this.raycaster.intersectObjects(a);if(o.length>0){const r=o[0].object;return i.find(c=>{let h=!1;return c.mesh.traverse(d=>{d===r&&(h=!0)}),h})||null}return null}spawnProjectile(e){const t=new N(0,0,-1).applyQuaternion(this.camera.quaternion),n=this.camera.position.clone(),i=Mt[this.currentWeapon],a=new z;let o=55,r=i.damage;if(this.currentWeapon==="bazuca"){const c=new f({color:7048739}),h=new l(new A(.05,.05,.4,8),c);h.rotation.x=Math.PI/2,a.add(h);const d=new f({color:9109504}),u=new l(new ce(.05,.18,8),d);u.position.z=-.29,u.rotation.x=-Math.PI/2,a.add(u);for(let p=0;p<4;p++){const m=new l(new A(.012,.012,.09,4),d);m.rotation.x=Math.PI/2,m.position.z=.15,m.rotation.z=p/4*Math.PI*2,a.add(m)}o=45}else if(this.currentWeapon==="chicken_gun"){const c=new f({color:16244811}),h=new l(new y(.08,8,6),c);h.scale.set(1,.85,1.3),a.add(h);const d=new l(new y(.045,8,6),c);d.position.set(0,.035,-.1),a.add(d);const u=new f({color:16747546}),p=new l(new ce(.018,.06,4),u);p.position.set(0,.035,-.15),p.rotation.x=Math.PI/2,a.add(p),o=50,r=Math.floor(5+Math.random()*76)}else{const c=new A(.012,.012,.5,4),h=new f({color:4861976}),d=new l(c,h);d.rotation.x=Math.PI/2,a.add(d);const u=new ce(.025,.08,4),p=new f({color:8947848}),m=new l(u,p);m.position.z=-.3,m.rotation.x=-Math.PI/2,a.add(m)}a.position.copy(n),a.lookAt(n.clone().add(t)),this.scene.add(a),this.projectiles.push({mesh:a,direction:t,speed:o,distance:0,maxDistance:i.range,damage:r,targets:e,weapon:this.currentWeapon})}createExplosion(e,t){const n=new We({color:16737792,transparent:!0,opacity:1}),i=new l(new y(.6,10,8),n);i.position.copy(e),this.scene.add(i),this.explosions.push({mesh:i,age:0,maxAge:.5,targets:t});const a=6,o=t.filter(r=>r.alive);for(const r of o){const c=e.x-r.mesh.position.x,h=e.z-r.mesh.position.z,d=e.y-(r.mesh.position.y+(r.hitHeight||.5));Math.sqrt(c*c+d*d+h*h)<=a&&this.pendingHits.push({target:r,damage:100})}}update(e){this.cooldown>0&&(this.cooldown-=e),this.recoil>0&&(this.recoil-=e*6,this.recoil<0&&(this.recoil=0)),this.mouseHeld&&this.currentWeapon==="cajado_fogo"&&this.cooldown<=0&&this.fire(this._lastTargets);for(let i=this.explosions.length-1;i>=0;i--){const a=this.explosions[i];a.age+=e;const o=a.age/a.maxAge;a.mesh.scale.setScalar(1+o*3),a.mesh.material.opacity=1-o,a.age>=a.maxAge&&(this.scene.remove(a.mesh),this.explosions.splice(i,1))}Mt[this.currentWeapon].type==="melee"?(this.weaponGroup.rotation.x=-this.recoil*1,this.weaponGroup.rotation.z=this.recoil*.3,this.weaponGroup.position.z=-this.recoil*.15,this.weaponGroup.position.y=this.recoil*.05):(this.weaponGroup.position.z=this.recoil*.08,this.weaponGroup.rotation.x=-this.recoil*.08,this.weaponGroup.rotation.z=0,this.weaponGroup.position.y=0),this.hitboxTimer>0&&(this.hitboxTimer-=e,this.hitboxTimer<=0&&(this.hitboxMesh.visible=!1,this.hitboxWire.visible=!1));const n=performance.now()*.001;this.weaponGroup.position.x=Math.sin(n*2)*.004,this.weaponGroup.position.y+=Math.sin(n*3)*.002,this.updateProjectiles(e)}updateProjectiles(e){for(let t=this.projectiles.length-1;t>=0;t--){const n=this.projectiles[t],i=n.speed*e;n.mesh.position.addScaledVector(n.direction,i),n.distance+=i;const a=()=>{n.weapon==="bazuca"&&this.createExplosion(n.mesh.position,n.targets),this.scene.remove(n.mesh),this.projectiles.splice(t,1)};if(n.distance>=n.maxDistance){a();continue}if(this.arena&&!this.arena.isPassable(n.mesh.position.x,n.mesh.position.z)){a();continue}const o=n.targets.filter(c=>c.alive);let r=null;for(const c of o){const h=n.mesh.position.x-c.mesh.position.x,d=n.mesh.position.z-c.mesh.position.z,u=c.hitHeight||.5,p=n.mesh.position.y-(c.mesh.position.y+u),m=Math.sqrt(h*h+p*p+d*d),x=c.hitRadius||1;if(m<x){r=c;break}}r&&(n.weapon==="bazuca"?a():(this.scene.remove(n.mesh),this.projectiles.splice(t,1),this.pendingHits.push({target:r,damage:n.damage})))}}getWeaponName(){return Mt[this.currentWeapon].name}}class vf{constructor(){this.hudEl=document.getElementById("hud"),this.killCountEl=document.getElementById("kill-count"),this.capyCountEl=document.getElementById("animal-count"),this.messageEl=document.getElementById("message"),this.healthBar=document.getElementById("health-bar"),this.healthText=document.getElementById("health-text"),this.damageFlash=document.getElementById("damage-flash"),this.killFeed=document.getElementById("kill-feed"),this.interactPrompt=document.getElementById("interact-prompt"),this.timerEl=document.getElementById("match-timer"),this.staminaBar=document.getElementById("stamina-bar"),this.bossBarContainer=document.getElementById("boss-bar-container"),this.bossBar=document.getElementById("boss-bar"),this.bossBarLabel=document.getElementById("boss-bar-label"),this.tokensEl=document.getElementById("tokens-display"),this.moneyEl=document.getElementById("money-display"),this.armorEl=document.getElementById("armor-display"),this.crosshairEl=document.getElementById("crosshair"),this.crosshairDefaultDisplay=this.crosshairEl?this.crosshairEl.style.display:"",this.weaponDisplayEl=document.getElementById("weapon-display"),this.messageTimeout=null,this.flashTimeout=null}show(){this.hudEl.style.display="block"}hide(){this.hudEl.style.display="none"}updateKills(e){this.killCountEl.textContent=e}updateRemaining(e){this.capyCountEl.textContent=e}updateHealth(e,t){const n=Math.max(0,e/t*100);this.healthBar.style.width=n+"%",this.healthText.textContent="VIDA: "+Math.ceil(e),n<25?this.healthBar.style.background="linear-gradient(90deg, #880000, #aa0000)":n<50?this.healthBar.style.background="linear-gradient(90deg, #aa4400, #cc2200)":this.healthBar.style.background="linear-gradient(90deg, #cc0000, #ff2200)"}showDamageFlash(){this.damageFlash.style.opacity="1",this.flashTimeout&&clearTimeout(this.flashTimeout),this.flashTimeout=setTimeout(()=>{this.damageFlash.style.opacity="0"},200)}addKillEntry(e,t){const n=document.createElement("div");n.className="kill-entry";const i=document.createElement("span");i.className="killer",i.textContent=e;const a=document.createElement("span");for(a.className="victim",a.textContent=t,n.appendChild(i),n.append(" matou "),n.appendChild(a),this.killFeed.appendChild(n);this.killFeed.children.length>6;)this.killFeed.removeChild(this.killFeed.firstChild);setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n)},4e3)}showMessage(e){this.messageEl.textContent=e,this.messageEl.style.opacity="1",this.messageTimeout&&clearTimeout(this.messageTimeout),this.messageTimeout=setTimeout(()=>{this.messageEl.style.opacity="0"},1500)}showCooldownMessage(e){this.showMessage(e)}setCrosshairVisible(e){this.crosshairEl&&(this.crosshairEl.style.display=e?this.crosshairDefaultDisplay:"none")}setWeaponName(e){this.weaponDisplayEl&&(this.weaponDisplayEl.textContent=e)}updateStamina(e,t){if(!this.staminaBar)return;const n=Math.max(0,e/t*100);this.staminaBar.style.width=n+"%",n<20?this.staminaBar.style.background="linear-gradient(90deg, #663333, #aa4444)":this.staminaBar.style.background="linear-gradient(90deg, #2266cc, #44aaff)"}updateTimer(e){if(!this.timerEl)return;const t=Math.floor(e/60),n=Math.floor(e%60);this.timerEl.textContent=t+":"+(n<10?"0":"")+n,e<60?this.timerEl.style.color="#ff4444":this.timerEl.style.color="#ffcc66"}showBossMessage(e){this.messageEl.textContent=e,this.messageEl.style.opacity="1",this.messageEl.style.color="#ff2222",this.messageEl.style.fontSize="36px",this.messageTimeout&&clearTimeout(this.messageTimeout),this.messageTimeout=setTimeout(()=>{this.messageEl.style.opacity="0",this.messageEl.style.color="",this.messageEl.style.fontSize=""},3e3)}showInteractPrompt(){this.interactPrompt&&(this.interactPrompt.style.opacity="1")}hideInteractPrompt(){this.interactPrompt&&(this.interactPrompt.style.opacity="0")}showBossBar(){this.bossBarContainer&&(this.bossBarContainer.style.display="block"),this.bossBarLabel&&(this.bossBarLabel.style.display="block")}updateBossHealth(e,t){if(!this.bossBar||!this.bossBarLabel)return;const n=Math.max(0,e/t*100);this.bossBar.style.width=n+"%",this.bossBarLabel.textContent="Chefe Final | HP "+Math.ceil(e)}hideBossBar(){this.bossBarContainer&&(this.bossBarContainer.style.display="none"),this.bossBarLabel&&(this.bossBarLabel.style.display="none")}updateResources(e,t,n){this.tokensEl&&(this.tokensEl.textContent="TOKENS: "+e),this.moneyEl&&(this.moneyEl.textContent="R$: "+t),this.armorEl&&(this.armorEl.textContent="ARMADURA: "+n)}updateHotbar(e,t,n){let i=document.getElementById("hotbar");i||(i=document.createElement("div"),i.id="hotbar",i.style.cssText="position:fixed;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:40;font-family:sans-serif;",document.body.appendChild(i)),i.innerHTML="";for(let a=0;a<e.length;a++){const o=n[e[a]],r=document.createElement("div");r.style.cssText="min-width:48px;padding:4px 8px;border:2px solid "+(a===t?"#ffdd00":"#555")+";background:rgba(0,0,0,0.6);color:#fff;border-radius:4px;text-align:center;font-size:11px;",r.innerHTML="<div>"+(a+1)+"</div><div>"+(o&&o.name||e[a])+"</div>",i.appendChild(r)}}}class yf{constructor(e,t,n,i){this.scene=e,this.name=t,this.arena=i;const a=i?i.getRandomSpawnPoint():{x:0,z:0};this.position=new N(a.x,0,a.z),this.velocity=new N,this.speed=4+Math.random()*2,this.shootCooldown=0,this.shootInterval=4+Math.random()*3,this.target=null,this.accuracy=.3+Math.random()*.2,this.health=200,this.alive=!0,this.sellTimer=0,this.sellInterval=15,this.droppedItems=[],this.mesh=this.createMesh(),this.mesh.position.copy(this.position),e.add(this.mesh)}createMesh(){if(this.name==="Bot_Carioca")return this.createCariocaMesh();const e=new z,t=new Z(.6,1.4,.4),n=new f({color:4482628}),i=new l(t,n);i.position.y=.9,i.castShadow=!0,e.add(i);const a=new Z(.4,.4,.4),o=new f({color:13413e3}),r=new l(a,o);r.position.y=1.8,r.castShadow=!0,e.add(r);const c=new Z(.08,.08,.6),h=new f({color:3355443}),d=new l(c,h);return d.position.set(.4,1.1,-.2),e.add(d),e}createCariocaMesh(){const e=new z,t=new Z(.6,1.4,.4),n=new f({color:13369344}),i=new f({color:1118481}),a=new l(t,n);a.position.y=.9,a.castShadow=!0,e.add(a);const o=new l(new Z(.62,.28,.2),i);o.position.set(0,.7,.11),e.add(o);const r=new l(new Z(.62,.28,.2),i);r.position.set(0,1.1,.11),e.add(r);const c=new Z(.4,.4,.4),h=new f({color:13413e3}),d=new l(c,h);d.position.y=1.8,d.castShadow=!0,e.add(d);const u=new Z(.44,.15,.44),p=new f({color:16115266}),m=new l(u,p);m.position.y=2.05,e.add(m);const x=new f({color:16737792,transparent:!0,opacity:.7}),_=new Z(.18,.08,.05),w=new l(_,x);w.position.set(-.1,1.82,.22),e.add(w);const g=new l(_,x);g.position.set(.1,1.82,.22),e.add(g);const S=new l(new Z(.04,.03,.05),x);S.position.set(0,1.82,.22),e.add(S);const v=new Z(.08,.08,.6),E=new f({color:3355443}),I=new l(v,E);return I.position.set(.4,1.1,-.2),e.add(I),e}update(e,t){if(!this.alive)return null;this.shootCooldown-=e,this.name==="Bot_Carioca"&&(this.sellTimer+=e,this.sellTimer>=this.sellInterval&&(this.sellTimer=0,this.dropSaleItem()));const n=t.filter(o=>o.alive&&!o.isProtectedAlly);if(n.length===0)return null;let i=null,a=1/0;for(const o of n){const r=this.position.distanceTo(o.mesh.position);r<a&&(a=r,i=o)}if(this.target=i,i){const o=i.mesh.position.clone().sub(this.position);o.y=0,o.normalize();const r=this.position.x+o.x*this.speed*e,c=this.position.z+o.z*this.speed*e;if((!this.arena||this.arena.isPassable(r,c))&&(this.position.x=r,this.position.z=c),this.position.y=0,this.mesh.position.copy(this.position),this.mesh.rotation.y=Math.atan2(o.x,o.z),a<10&&this.shootCooldown<=0&&(this.shootCooldown=this.shootInterval,Math.random()<this.accuracy))return i}return null}dropSaleItem(){const e=["ammo","medkit","ammo","ammo","medkit"],t=e[Math.floor(Math.random()*e.length)],n=new N((Math.random()-.5)*2,0,(Math.random()-.5)*2),i=this.position.clone().add(n),a=new z,o=new Z(.4,.4,.4),r=new f({color:t==="ammo"?4508740:13386820}),c=new l(o,r);a.add(c);const h=new Z(.15,.2,.02),d=new f({color:16768256}),u=new l(h,d);u.position.set(0,.25,.21),a.add(u),a.position.set(i.x,.5,i.z),this.scene.add(a),this.droppedItems.push({mesh:a,position:i,type:t,collected:!1})}takeDamage(e){return this.health-=e,this.health<=0?(this.die(),!0):!1}die(){this.alive=!1,this.scene.remove(this.mesh)}destroy(){this.scene.remove(this.mesh)}}class ft{static show(e,t,n,i){const a=document.getElementById("celebration");a.style.display="flex";const o=a.querySelector("h1"),r=a.querySelector(".churrasco-text");t&&i?(o.textContent="SONEGADOR!",r.textContent="Voce nao pagou seus impostos e o governo te viu sonegar!",a.querySelector("#btn-play-again").textContent="Pagar as multas e recomecar"):t?(o.textContent="PRESO!",r.textContent="Voce e seus amigos cometeram muitos crimes e foram pegos pelo IBAMA!",a.querySelector("#btn-play-again").textContent="Pagar as multas e recomecar"):(o.textContent="PRESOS!",r.textContent="Os animais foram capturados! Justica foi feita!",a.querySelector("#btn-play-again").textContent="Jogar novamente");const c=Object.entries(e).sort((H,q)=>q[1]-H[1]),h=document.getElementById("fire-canvas");h.width=900,h.height=550,h.style.width="900px",h.style.height="550px",h.style.borderRadius="4px";const d=new Ec({canvas:h,antialias:!0});d.setSize(900,550),d.shadowMap.enabled=!0,d.setClearColor(8900331);const u=new Tc;u.background=new Ce(4872810);const p=new Ft(55,900/550,.1,80);p.position.set(6,4,10),p.lookAt(0,1.5,0);const m=new Pc(16777215,.6);u.add(m);const x=new Ha(16777198,.8);x.position.set(10,15,8),x.castShadow=!0,x.shadow.mapSize.set(1024,1024),u.add(x);const _=new gn(16764040,.6,15);_.position.set(0,4,0),u.add(_);const w=new St(30,30),g=new f({color:5592400}),S=new l(w,g);S.rotation.x=-Math.PI/2,S.receiveShadow=!0,u.add(S);const v=new Z(16,5,.3),E=new f({color:6974048}),I=new l(v,E);I.position.set(0,2.5,-3),I.castShadow=!0,u.add(I);const C=new l(new Z(.3,5,8),E);C.position.set(-8,2.5,1),u.add(C);const P=new l(new Z(.3,5,8),E);P.position.set(8,2.5,1),u.add(P);let k=[];t&&i?k=ft.buildBossLoseScene(u,c):t?k=ft.buildLoseScene(u,c):k=ft.buildJailScene(u,c);let b=0,M;function U(){M=requestAnimationFrame(U),b+=.01,p.position.x=Math.sin(b*.15)*8,p.position.z=8+Math.cos(b*.15)*3,p.position.y=3.5+Math.sin(b*.1)*.5,p.lookAt(0,1.5,0);for(let H=0;H<k.length;H++){const q=k[H];q.position.y=q.userData.baseY+Math.abs(Math.sin(b*8+H*1.5))*.5}d.render(u,p)}U();const O=document.getElementById("final-scoreboard");O.replaceChildren(),c.forEach(([H,q],ee)=>{const ne=document.createElement("div");ne.className="score-entry"+(ee===0?" winner":"");const Y=document.createElement("span");Y.className="name",Y.textContent=(ee===0?">>> ":`${ee+1}. `)+H;const oe=document.createElement("span");oe.className="score",oe.textContent=q+" pts",ne.appendChild(Y),ne.appendChild(oe),O.appendChild(ne)}),document.getElementById("btn-play-again").addEventListener("click",()=>{cancelAnimationFrame(M),d.dispose()},{once:!0})}static buildJailScene(e,t){const n=new f({color:3355443}),i=new f({color:4473924});ft.buildCell(e,-4,0,n,i),ft.buildCell(e,0,0,n,i),ft.buildCell(e,4,0,n,i);for(let u=0;u<3;u++){const p=ft.createAnimal();p.position.set(-4+(u-1)*.9,0,-1.5+u*.3),e.add(p)}const a=ft.createJacare();a.position.set(0,0,-1.5),e.add(a);const o=ft.createTucano();o.position.set(.6,0,-1),e.add(o);const r=ft.createAnta();r.position.set(4,0,-1.5),e.add(r);const c=ft.createSucuri();c.position.set(4.5,0,-.8),e.add(c);for(let u=0;u<3;u++){const p=new St(1.2,.4),m=document.createElement("canvas");m.width=128,m.height=48;const x=m.getContext("2d");x.fillStyle="#dddddd",x.fillRect(0,0,128,48),x.fillStyle="#222222",x.font="bold 14px Courier New",x.textAlign="center";const _=["ANIMAIS","JACARE/TUCANO","ANTA/SUCURI"];x.fillText(_[u],64,30);const w=new Yt(m),g=new We({map:w}),S=new l(p,g);S.position.set(-4+u*4,3.8,-2.4),e.add(S)}const h=[4482628,6702148,4473958,6710852],d=[];return t.forEach(([u,p],m)=>{const x=ft.createPlayerModel(u,p,m,h[m%4],m===0),_=-.8+m/Math.max(t.length-1,1)*1.6;x.position.set(Math.sin(_)*5.5,0,3+Math.cos(_)*2),x.userData.baseY=0,x.lookAt(0,1.5,0),e.add(x),d.push(x)}),d}static buildLoseScene(e,t){const n=new f({color:3355443}),i=new f({color:4473924}),a=Math.min(t.length,3),o=a===1?[0]:a===2?[-3,3]:[-4,0,4];for(let m=0;m<a;m++)ft.buildCell(e,o[m],0,n,i);const r=[4482628,6702148,4473958,6710852];t.forEach(([m,x],_)=>{const w=_%a,g=_>=a?(_-a)*.6-.3:0,S=new z,v=new Z(.5,1,.35),E=new f({color:r[_%4]}),I=new l(v,E);I.position.y=1,S.add(I);const C=new Z(.35,.35,.35),P=new f({color:14531464}),k=new l(C,P);k.position.y=1.7,S.add(k);const b=new Z(.18,.5,.2),M=new f({color:3355460}),U=new l(b,M);U.position.set(-.15,.25,0),S.add(U);const O=new l(b,M);O.position.set(.15,.25,0),S.add(O);const L=document.createElement("canvas");L.width=256,L.height=48;const H=L.getContext("2d");H.font="bold 24px Courier New",H.fillStyle="#ff4444",H.textAlign="center",H.fillText(m,128,30);const q=new Yt(L),ee=new Cn({map:q}),ne=new Jn(ee);ne.position.y=2.3,ne.scale.set(1.4,.35,1),S.add(ne),S.position.set(o[w]+g,0,-1.5),e.add(S)});for(let m=0;m<a;m++){const x=new St(1.2,.4),_=document.createElement("canvas");_.width=128,_.height=48;const w=_.getContext("2d");w.fillStyle="#dddddd",w.fillRect(0,0,128,48),w.fillStyle="#aa0000",w.font="bold 14px Courier New",w.textAlign="center",w.fillText("PRESO",64,30);const g=new Yt(_),S=new We({map:g}),v=new l(x,S);v.position.set(o[m],3.8,-2.4),e.add(v)}const c=[2237098,2271778,11149858,11184674,11149994,2271914],h=[];for(let m=0;m<4;m++){const x=ft.createAnimal(),_=-.8+m/3*1.6;x.position.set(Math.sin(_)*5,0,3+Math.cos(_)*2),x.userData.baseY=0,x.lookAt(0,.8,0);const g=new ce(.2,.3,6),S=new f({color:c[m]}),v=new l(g,S);v.position.set(0,1.5,.3),x.add(v),e.add(x),h.push(x)}const d=ft.createJacare();d.position.set(-3,0,4.5),d.userData.baseY=0,d.lookAt(0,.4,0),e.add(d),h.push(d);const u=ft.createTucano();u.position.set(3.5,0,4),u.userData.baseY=0,e.add(u),h.push(u);const p=ft.createAnta();return p.position.set(-5,0,3),p.userData.baseY=0,p.lookAt(0,.8,0),e.add(p),h.push(p),h}static buildBossLoseScene(e,t){const n=new f({color:3355443}),i=new f({color:4473924});ft.buildCell(e,0,0,n,i);const a=[4482628,6702148,4473958,6710852];t.forEach(([ne,Y],oe)=>{const se=new z,ve=new Z(.5,1,.35),Ve=new f({color:a[oe%4]}),$e=new l(ve,Ve);$e.position.y=1,se.add($e);const K=new Z(.35,.35,.35),re=new f({color:14531464}),xe=new l(K,re);xe.position.y=1.7,se.add(xe);const he=new Z(.18,.5,.2),Fe=new f({color:3355460}),ze=new l(he,Fe);ze.position.set(-.15,.25,0),se.add(ze);const G=new l(he,Fe);G.position.set(.15,.25,0),se.add(G);const je=document.createElement("canvas");je.width=256,je.height=48;const Me=je.getContext("2d");Me.font="bold 24px Courier New",Me.fillStyle="#ff4444",Me.textAlign="center",Me.fillText(ne,128,30);const Qe=new Yt(je),Ee=new Cn({map:Qe}),Ge=new Jn(Ee);Ge.position.y=2.3,Ge.scale.set(1.4,.35,1),se.add(Ge);const De=(oe-(t.length-1)/2)*.8;se.position.set(De,0,-1.5),e.add(se)});const o=new St(1.8,.5),r=document.createElement("canvas");r.width=192,r.height=48;const c=r.getContext("2d");c.fillStyle="#dddddd",c.fillRect(0,0,192,48),c.fillStyle="#aa0000",c.font="bold 14px Courier New",c.textAlign="center",c.fillText("SONEGADOR",96,30);const h=new Yt(r),d=new We({map:h}),u=new l(o,d);u.position.set(0,3.8,-2.4),e.add(u);const p=new z,m=new f({color:1710650}),x=new l(new Z(1.2,1.8,.7),m);x.position.y=2,x.castShadow=!0,p.add(x);const _=new f({color:14531464}),w=new l(new Z(.6,.6,.6),_);w.position.y=3.2,p.add(w);const g=new f({color:13369344}),S=new l(new Z(.15,.8,.08),g);S.position.set(0,2.2,.4),p.add(S);const v=new f({color:1710618}),E=new l(new A(.45,.45,.08,8),v);E.position.y=3.55,p.add(E);const I=new l(new A(.3,.3,.4,8),v);I.position.y=3.8,p.add(I);const C=new f({color:1710650}),P=new l(new Z(.3,1.2,.3),C);P.position.set(-.8,2,0),p.add(P);const k=new l(new Z(.3,1.2,.3),C);k.position.set(.8,2,0),p.add(k);const b=new f({color:1710634}),M=new l(new Z(.35,.9,.35),b);M.position.set(-.3,.45,0),p.add(M);const U=new l(new Z(.35,.9,.35),b);U.position.set(.3,.45,0),p.add(U);const O=document.createElement("canvas");O.width=320,O.height=80;const L=O.getContext("2d");L.fillStyle="#ffffff",L.beginPath(),L.roundRect(4,4,312,56,12),L.fill(),L.strokeStyle="#333333",L.lineWidth=2,L.beginPath(),L.roundRect(4,4,312,56,12),L.stroke(),L.beginPath(),L.moveTo(140,60),L.lineTo(150,78),L.lineTo(160,60),L.fillStyle="#ffffff",L.fill(),L.fillStyle="#222222",L.font="bold 15px Courier New",L.textAlign="center",L.fillText("vc n deveria ter sonegado...",160,38);const H=new Yt(O),q=new Cn({map:H}),ee=new Jn(q);return ee.position.y=4.8,ee.scale.set(3.5,.9,1),p.add(ee),p.position.set(4,0,3),p.userData.baseY=0,p.lookAt(0,1.5,0),e.add(p),[p]}static buildCell(e,t,n,i,a){const h=new l(new Z(3.2,.15,.15),a);h.position.set(t,4,n-2.5+3/2),e.add(h);const d=new l(new Z(3.2,.15,.15),a);d.position.set(t,.1,n-2.5+3/2),e.add(d);const u=8,p=3.2/(u+1);for(let _=1;_<=u;_++){const w=new l(new A(.04,.04,4,6),i);w.position.set(t-3.2/2+_*p,4/2,n-2.5+3/2),w.castShadow=!0,e.add(w)}const m=new l(new A(.06,.06,4,6),a);m.position.set(t-3.2/2,4/2,n-2.5+3/2),e.add(m);const x=new l(new A(.06,.06,4,6),a);x.position.set(t+3.2/2,4/2,n-2.5+3/2),e.add(x)}static createAnimal(){const e=new z,t=new f({color:9136404}),n=new l(new Z(.6,.5,1),t);n.position.y=.7,n.castShadow=!0,e.add(n);const i=new f({color:10189092}),a=new l(new Z(.4,.35,.45),i);a.position.set(0,1,.45),e.add(a);const o=new f({color:5913104}),r=new l(new Z(.15,.1,.1),o);r.position.set(0,.9,.7),e.add(r);const c=new Z(.12,.4,.12),h=new f({color:7035152});return[[-.2,.2,-.3],[.2,.2,-.3],[-.2,.2,.2],[.2,.2,.2]].forEach(([d,u,p])=>{const m=new l(c,h);m.position.set(d,u,p),e.add(m)}),e}static createJacare(){const e=new z,t=new f({color:2775594}),n=new l(new Z(.5,.3,1.5),t);n.position.y=.4,e.add(n);const i=new l(new Z(.4,.2,.6),t);i.position.set(0,.45,.9),e.add(i);const a=new l(new Z(.2,.15,.8),t);return a.position.set(0,.35,-1),e.add(a),e}static createTucano(){const e=new z,t=new f({color:1118481}),n=new l(new Z(.3,.35,.5),t);n.position.y=.8,e.add(n);const i=new f({color:16746496}),a=new l(new Z(.12,.12,.4),i);a.position.set(0,.85,.45),e.add(a);const o=new f({color:4473924}),r=new l(new Z(.04,.4,.04),o);r.position.set(-.08,.4,0),e.add(r);const c=new l(new Z(.04,.4,.04),o);return c.position.set(.08,.4,0),e.add(c),e}static createAnta(){const e=new z,t=new f({color:5917242}),n=new l(new Z(.7,.6,1.2),t);n.position.y=.8,e.add(n);const i=new l(new Z(.4,.4,.5),t);i.position.set(0,1,.7),e.add(i);const a=new l(new Z(.2,.15,.3),t);a.position.set(0,.9,1),e.add(a);const o=new Z(.15,.5,.15),r=new f({color:4864554});return[[-.25,.25,-.4],[.25,.25,-.4],[-.25,.25,.3],[.25,.25,.3]].forEach(([c,h,d])=>{const u=new l(o,r);u.position.set(c,h,d),e.add(u)}),e}static createSucuri(){const e=new z,t=new f({color:3824170});for(let i=0;i<8;i++){const a=new l(new y(.12,5,4),t);a.position.set(Math.sin(i*.5)*.3,.15,i*.2-.7),a.scale.set(1,.7,1),e.add(a)}const n=new l(new Z(.15,.1,.2),t);return n.position.set(Math.sin(4)*.3,.2,.9),e.add(n),e}static createPlayerModel(e,t,n,i,a){const o=new z,r=new Z(.5,1.2,.35),c=new f({color:i}),h=new l(r,c);h.position.y=1.2,h.castShadow=!0,o.add(h);const d=new Z(.35,.35,.35),u=new f({color:14531464}),p=new l(d,u);p.position.y=2,p.castShadow=!0,o.add(p);const m=new Z(.15,.7,.15),x=new f({color:i}),_=new l(m,x);_.position.set(-.4,1.6,0),_.rotation.z=.5+Math.random()*.5,o.add(_);const w=new l(m,x);w.position.set(.4,1.6,0),w.rotation.z=-(.5+Math.random()*.5),o.add(w);const g=new Z(.18,.7,.2),S=new f({color:3355460}),v=new l(g,S);v.position.set(-.15,.35,0),o.add(v);const E=new l(g,S);if(E.position.set(.15,.35,0),o.add(E),a){const M=new A(.25,.25,.3,6),U=new f({color:16763904}),O=new l(M,U);O.position.y=2.3,o.add(O)}const I=document.createElement("canvas");I.width=256,I.height=64;const C=I.getContext("2d");C.font="bold 28px Courier New",C.fillStyle=a?"#ffcc00":"#ffffff",C.textAlign="center",C.fillText(e,128,28),C.font="20px Courier New",C.fillStyle="#88cc44",C.fillText(`${t} pts`,128,52);const P=new Yt(I),k=new Cn({map:P}),b=new Jn(k);return b.position.y=2.7,b.scale.set(1.5,.4,1),o.add(b),o}}const Yr=Object.keys(Mt).filter(s=>s!=="bastao"&&s!=="pistola"&&s!=="ak47"&&s!=="minigun");class Mf{constructor(e,t,n){this.scene=e,this.x=t,this.z=n,this.opened=!1,this.weaponId=Yr[Math.floor(Math.random()*Yr.length)],this.ammoCount=Dc(),this.mesh=this.buildMesh(),this.mesh.position.set(t,.4,n),this.scene.add(this.mesh)}buildMesh(){const e=new z,t=new Z(.8,.5,.6),n=new f({color:5913114}),i=new l(t,n);e.add(i);const a=new Z(.84,.15,.64),o=new l(a,n);o.position.y=.32,e.add(o);const r=new f({color:3815994});for(let x=-1;x<=1;x+=2){const _=new l(new Z(.84,.06,.04),r);_.position.set(0,0,x*.2),e.add(_);const w=new l(new Z(.84,.04,.04),r);w.position.set(0,.32,x*.22),e.add(w)}const c=new Z(.1,.12,.05),h=new f({color:13412932}),d=new l(c,h);d.position.set(0,.15,.33),e.add(d);const u=new y(.6,8,6),p=new We({color:16763972,transparent:!0,opacity:.08}),m=new l(u,p);return m.position.y=.3,e.add(m),e}open(){return this.opened?null:(this.opened=!0,at.chestOpen(),this.scene.remove(this.mesh),{weaponId:this.weaponId,ammo:this.ammoCount})}getDistanceTo(e){const t=e.x-this.x,n=e.z-this.z;return Math.sqrt(t*t+n*n)}update(e){this.opened||(this.mesh.position.y=.4+Math.sin(e*.003)*.1,this.mesh.rotation.y+=.005)}}class Ia{constructor(e,t,n,i,a={}){this.scene=e,this.arena=i,this.alive=!0,this.health=a.health!==void 0?a.health:1e3,this.maxHealth=a.maxHealth!==void 0?a.maxHealth:1e3,this.speed=a.speed!==void 0?a.speed:10,this.chaseSpeed=a.chaseSpeed!==void 0?a.chaseSpeed:10,this.attackDamage=a.attackDamage!==void 0?a.attackDamage:20,this.attackRange=a.attackRange!==void 0?a.attackRange:12,this.attackCooldown=0,this.shootCooldown=1.5,this.meleeRange=4,this.meleeCooldown=0,this.meleeRate=2,this.detectionRange=50,this.chasing=!0,this.wanderDir=new N(0,0,1),this.projectiles=[],this.minions=[],this.minionTimer=30,this.points=a.points!==void 0?a.points:10,this.hitRadius=3,this.hitHeight=2.5,this.mesh=this.createMesh(),this.mesh.position.set(t,0,n),e.add(this.mesh),this.speechTimer=5,this.speechBubble=null,this.speechVisible=!1,this.speeches=["Pague seus impostos!","Taxa de respiro!","ICMS ativado!","Imposto sobre imposto!","Nota fiscal, por favor!","Contribuinte detectado!","Aliquota maxima!","Voce deve ao governo!","Tributo obrigatorio!","Multa por atraso!","Declaracao pendente!","Sonegador identificado!","Chegou a hora do Leao!","O caixa do governo agradece!","Pagamento fiscal confirmado!","Sua guia venceu ontem!","Boleto tributario gerado!","Pix para a Receita, agora!","O tributo nao se paga sozinho!","Cofre publico com fome!","Seu debito acabou de crescer!","Arrecadacao em andamento!","Auditoria surpresa!","Fiscal na sua cola!","Malha fina localizada!","Documento irregular!","Recibo suspeito!","Cadastro sob analise!","Patrimonio investigado!","Movimentacao fiscal detectada!","Comprovante rejeitado!","Processo tributario aberto!","Taxa de caminhada!","Imposto de piscada!","Tributo por segundo!","Taxa de sombra!","Imposto de silencio!","Tarifa de coragem!","Cobranca por vitoria!","Pedagio de batalha!","Taxa de mira!","Imposto de recarga!","Seu loot tem dono: o governo!","Drop raro, imposto maior!","Cada moeda gera uma taxa!","Bau aberto, guia emitida!","Upgrade sujeito a tributacao!","Skin nova, tarifa nova!","XP tributavel detectado!","Respawn com taxa adicional!","Revive sem nota fiscal!","Premio liquido: quase nada!","Corra, o boleto corre mais!","Voce nao escapa da Receita!","Nem seu escudo evita impostos!","A multa atravessa armadura!","Seu saldo parece tributavel!","Prepare o bolso!","Hoje tem cobranca em dobro!","Seu lucro chamou minha atencao!","Nada pessoal, apenas tributos!","A Receita sempre encontra voce!","Aliquota reajustada sem aviso!","Juros fiscais acumulando!","Correcao monetaria aplicada!","Vencimento antecipado!","Isencao negada!","Recurso indeferido!","Parcelamento cancelado!","Guia complementar emitida!","Saldo devedor atualizado!","Regularizacao obrigatoria!","Cade o CPF?","Apresente seus comprovantes!","Assine esta declaracao!","Carimbe todas as vias!","Protocolo gerado!","Certidao indisponivel!","Sistema fiscal fora do ar!","Tente pagar novamente!","Dados divergentes!","Declaracao incompleta!","Seu bolso foi auditado!","A burocracia venceu!","Parabens, voce ganhou um imposto!","Promocao: pague duas taxas!","Imposto gratis na primeira compra!","O desconto virou contribuicao!","Seu troco foi retido!","Ate o nada tem aliquota!","Taxamos antes de perguntar!","Sorria para o fiscal!","Golpe fiscal carregado!","Boleto teleguiado!","Rajada de tributos!","Escudo de burocracia!","Combo de cobrancas!","Critico tributario!","Dano fiscal aumentado!","Ataque da malha fina!","Ultimato da Receita!","Fim da isencao!","Cobranca concluida!","Tributo bloqueado? Jamais!","Debito confirmado!","Seu prazo acabou!","Pagamento pendente!","Multa duplicada!","Fiscalizacao maxima!","Imposto inevitavel!","Receita em alerta!","Contribuinte cercado!","Taxa aplicada em seu inventario!","Taxa aplicada em seu equipamento!","Taxa aplicada em seu saldo!","Taxa aplicada em seu premio!","Taxa aplicada em seu bonus!","Taxa aplicada em seu lucro!","Taxa aplicada em seu ouro!","Taxa aplicada em seu bau!","Taxa aplicada em seu escudo!","Taxa aplicada em seu capacete!","Taxa aplicada em seu colete!","Taxa aplicada em seu ataque!","Taxa aplicada em seu combo!","Taxa aplicada em seu dano!","Taxa aplicada em seu revive!","Taxa aplicada em seu respawn!","Taxa aplicada em seu portal!","Taxa aplicada em seu nivel!","Taxa aplicada em seu rank!","Taxa aplicada em seu passe!","Auditoria iniciada em seu inventario!","Auditoria iniciada em seu equipamento!","Auditoria iniciada em seu saldo!","Auditoria iniciada em seu premio!","Auditoria iniciada em seu bonus!","Auditoria iniciada em seu lucro!","Auditoria iniciada em seu ouro!","Auditoria iniciada em seu bau!","Auditoria iniciada em seu escudo!","Auditoria iniciada em seu capacete!","Auditoria iniciada em seu colete!","Auditoria iniciada em seu ataque!","Auditoria iniciada em seu combo!","Auditoria iniciada em seu dano!","Auditoria iniciada em seu revive!","Auditoria iniciada em seu respawn!","Auditoria iniciada em seu portal!","Auditoria iniciada em seu nivel!","Auditoria iniciada em seu rank!","Auditoria iniciada em seu passe!","Cobranca extra em seu inventario!","Cobranca extra em seu equipamento!","Cobranca extra em seu saldo!","Cobranca extra em seu premio!","Cobranca extra em seu bonus!","Cobranca extra em seu lucro!","Cobranca extra em seu ouro!","Cobranca extra em seu bau!","Cobranca extra em seu escudo!","Cobranca extra em seu capacete!","Cobranca extra em seu colete!","Cobranca extra em seu ataque!","Cobranca extra em seu combo!","Cobranca extra em seu dano!","Cobranca extra em seu revive!","Cobranca extra em seu respawn!","Cobranca extra em seu portal!","Cobranca extra em seu nivel!","Cobranca extra em seu rank!","Cobranca extra em seu passe!","Imposto surpresa em seu inventario!","Imposto surpresa em seu equipamento!","Imposto surpresa em seu saldo!","Imposto surpresa em seu premio!","Imposto surpresa em seu bonus!","Imposto surpresa em seu lucro!","Imposto surpresa em seu ouro!","Imposto surpresa em seu bau!","Imposto surpresa em seu escudo!","Imposto surpresa em seu capacete!","Imposto surpresa em seu colete!","Imposto surpresa em seu ataque!","Imposto surpresa em seu combo!","Imposto surpresa em seu dano!","Imposto surpresa em seu revive!","Imposto surpresa em seu respawn!","Imposto surpresa em seu portal!","Imposto surpresa em seu nivel!","Imposto surpresa em seu rank!","Imposto surpresa em seu passe!","Fiscal de olho em seu inventario!","Fiscal de olho em seu equipamento!","Fiscal de olho em seu saldo!","Fiscal de olho em seu premio!","Fiscal de olho em seu bonus!","Fiscal de olho em seu lucro!","Fiscal de olho em seu ouro!","Fiscal de olho em seu bau!","Fiscal de olho em seu escudo!","Fiscal de olho em seu capacete!","Fiscal de olho em seu colete!","Fiscal de olho em seu ataque!","Fiscal de olho em seu combo!","Fiscal de olho em seu dano!","Fiscal de olho em seu revive!","Fiscal de olho em seu respawn!","Fiscal de olho em seu portal!","Fiscal de olho em seu nivel!","Fiscal de olho em seu rank!","Fiscal de olho em seu passe!","Tarifa ativada em seu inventario!","Tarifa ativada em seu equipamento!","Tarifa ativada em seu saldo!","Tarifa ativada em seu premio!","Tarifa ativada em seu bonus!","Tarifa ativada em seu lucro!","Tarifa ativada em seu ouro!","Tarifa ativada em seu bau!","Tarifa ativada em seu escudo!","Tarifa ativada em seu capacete!","Tarifa ativada em seu colete!","Tarifa ativada em seu ataque!","Tarifa ativada em seu combo!","Tarifa ativada em seu dano!","Tarifa ativada em seu revive!","Tarifa ativada em seu respawn!","Tarifa ativada em seu portal!","Tarifa ativada em seu nivel!","Tarifa ativada em seu rank!","Tarifa ativada em seu passe!","Tributo acumulado em seu inventario!","Tributo acumulado em seu equipamento!","Tributo acumulado em seu saldo!","Tributo acumulado em seu premio!","Tributo acumulado em seu bonus!","Tributo acumulado em seu lucro!","Tributo acumulado em seu ouro!","Tributo acumulado em seu bau!","Tributo acumulado em seu escudo!","Tributo acumulado em seu capacete!","Tributo acumulado em seu colete!","Tributo acumulado em seu ataque!","Tributo acumulado em seu combo!","Tributo acumulado em seu dano!","Tributo acumulado em seu revive!","Tributo acumulado em seu respawn!","Tributo acumulado em seu portal!","Tributo acumulado em seu nivel!","Tributo acumulado em seu rank!","Tributo acumulado em seu passe!","Pendencia encontrada em seu inventario!","Pendencia encontrada em seu equipamento!","Pendencia encontrada em seu saldo!","Pendencia encontrada em seu premio!","Pendencia encontrada em seu bonus!","Pendencia encontrada em seu lucro!","Pendencia encontrada em seu ouro!","Pendencia encontrada em seu bau!","Pendencia encontrada em seu escudo!","Pendencia encontrada em seu capacete!","Pendencia encontrada em seu colete!","Pendencia encontrada em seu ataque!","Pendencia encontrada em seu combo!","Pendencia encontrada em seu dano!","Pendencia encontrada em seu revive!","Pendencia encontrada em seu respawn!","Pendencia encontrada em seu portal!","Pendencia encontrada em seu nivel!","Pendencia encontrada em seu rank!","Pendencia encontrada em seu passe!","Multa registrada em seu inventario!","Multa registrada em seu equipamento!","Multa registrada em seu saldo!","Multa registrada em seu premio!","Multa registrada em seu bonus!","Multa registrada em seu lucro!","Multa registrada em seu ouro!","Multa registrada em seu bau!","Multa registrada em seu escudo!","Multa registrada em seu capacete!","Multa registrada em seu colete!","Multa registrada em seu ataque!","Multa registrada em seu combo!","Multa registrada em seu dano!","Multa registrada em seu revive!","Multa registrada em seu respawn!","Multa registrada em seu portal!","Multa registrada em seu nivel!","Multa registrada em seu rank!","Multa registrada em seu passe!","Aliquota elevada em seu inventario!","Aliquota elevada em seu equipamento!","Aliquota elevada em seu saldo!","Aliquota elevada em seu premio!","Aliquota elevada em seu bonus!","Aliquota elevada em seu lucro!","Aliquota elevada em seu ouro!","Aliquota elevada em seu bau!","Aliquota elevada em seu escudo!","Aliquota elevada em seu capacete!","Aliquota elevada em seu colete!","Aliquota elevada em seu ataque!","Aliquota elevada em seu combo!","Aliquota elevada em seu dano!","Aliquota elevada em seu revive!","Aliquota elevada em seu respawn!","Aliquota elevada em seu portal!","Aliquota elevada em seu nivel!","Aliquota elevada em seu rank!","Aliquota elevada em seu passe!","Receita rastreando seu inventario!","Receita rastreando seu equipamento!","Receita rastreando seu saldo!","Receita rastreando seu premio!","Receita rastreando seu bonus!","Receita rastreando seu lucro!","Receita rastreando seu ouro!","Receita rastreando seu bau!","Receita rastreando seu escudo!","Receita rastreando seu capacete!","Receita rastreando seu colete!","Receita rastreando seu ataque!","Receita rastreando seu combo!","Receita rastreando seu dano!","Receita rastreando seu revive!","Receita rastreando seu respawn!","Receita rastreando seu portal!","Receita rastreando seu nivel!","Receita rastreando seu rank!","Receita rastreando seu passe!","Governo taxando seu inventario!","Governo taxando seu equipamento!","Governo taxando seu saldo!","Governo taxando seu premio!","Governo taxando seu bonus!","Governo taxando seu lucro!","Governo taxando seu ouro!","Governo taxando seu bau!","Governo taxando seu escudo!","Governo taxando seu capacete!","Governo taxando seu colete!","Governo taxando seu ataque!","Governo taxando seu combo!","Governo taxando seu dano!","Governo taxando seu revive!","Governo taxando seu respawn!","Governo taxando seu portal!","Governo taxando seu nivel!","Governo taxando seu rank!","Governo taxando seu passe!","Declare seu inventario agora!","Declare seu equipamento agora!","Declare seu saldo agora!","Declare seu premio agora!","Declare seu bonus agora!","Declare seu lucro agora!","Declare seu ouro agora!","Declare seu bau agora!","Declare seu escudo agora!","Declare seu capacete agora!","Declare seu colete agora!","Declare seu ataque agora!","Declare seu combo agora!","Declare seu dano agora!","Declare seu revive agora!","Declare seu respawn agora!","Declare seu portal agora!","Declare seu nivel agora!","Declare seu rank agora!","Declare seu passe agora!","Nota fiscal para seu inventario!","Nota fiscal para seu equipamento!","Nota fiscal para seu saldo!","Nota fiscal para seu premio!","Nota fiscal para seu bonus!","Nota fiscal para seu lucro!","Nota fiscal para seu ouro!","Nota fiscal para seu bau!","Nota fiscal para seu escudo!","Nota fiscal para seu capacete!","Nota fiscal para seu colete!","Nota fiscal para seu ataque!","Nota fiscal para seu combo!","Nota fiscal para seu dano!","Nota fiscal para seu revive!","Nota fiscal para seu respawn!","Nota fiscal para seu portal!","Nota fiscal para seu nivel!","Nota fiscal para seu rank!","Nota fiscal para seu passe!","Debito ligado a seu inventario!","Debito ligado a seu equipamento!","Debito ligado a seu saldo!","Debito ligado a seu premio!","Debito ligado a seu bonus!","Debito ligado a seu lucro!","Debito ligado a seu ouro!","Debito ligado a seu bau!","Debito ligado a seu escudo!","Debito ligado a seu capacete!","Debito ligado a seu colete!","Debito ligado a seu ataque!","Debito ligado a seu combo!","Debito ligado a seu dano!","Debito ligado a seu revive!","Debito ligado a seu respawn!","Debito ligado a seu portal!","Debito ligado a seu nivel!","Debito ligado a seu rank!","Debito ligado a seu passe!","Contribuicao sobre seu inventario!","Contribuicao sobre seu equipamento!","Contribuicao sobre seu saldo!","Contribuicao sobre seu premio!","Contribuicao sobre seu bonus!","Contribuicao sobre seu lucro!","Contribuicao sobre seu ouro!","Contribuicao sobre seu bau!","Contribuicao sobre seu escudo!","Contribuicao sobre seu capacete!","Contribuicao sobre seu colete!","Contribuicao sobre seu ataque!","Contribuicao sobre seu combo!","Contribuicao sobre seu dano!","Contribuicao sobre seu revive!","Contribuicao sobre seu respawn!","Contribuicao sobre seu portal!","Contribuicao sobre seu nivel!","Contribuicao sobre seu rank!","Contribuicao sobre seu passe!","Retencao aplicada a seu inventario!","Retencao aplicada a seu equipamento!","Retencao aplicada a seu saldo!","Retencao aplicada a seu premio!","Retencao aplicada a seu bonus!","Retencao aplicada a seu lucro!","Retencao aplicada a seu ouro!","Retencao aplicada a seu bau!","Retencao aplicada a seu escudo!","Retencao aplicada a seu capacete!","Retencao aplicada a seu colete!","Retencao aplicada a seu ataque!","Retencao aplicada a seu combo!","Retencao aplicada a seu dano!","Retencao aplicada a seu revive!","Retencao aplicada a seu respawn!","Retencao aplicada a seu portal!","Retencao aplicada a seu nivel!","Retencao aplicada a seu rank!","Retencao aplicada a seu passe!","Regularize seu inventario!","Regularize seu equipamento!","Regularize seu saldo!","Regularize seu premio!","Regularize seu bonus!","Regularize seu lucro!","Regularize seu ouro!","Regularize seu bau!","Regularize seu escudo!","Regularize seu capacete!","Regularize seu colete!","Regularize seu ataque!","Regularize seu combo!","Regularize seu dano!","Regularize seu revive!","Regularize seu respawn!","Regularize seu portal!","Regularize seu nivel!","Regularize seu rank!","Regularize seu passe!","Imposto calculado em seu inventario!","Imposto calculado em seu equipamento!","Imposto calculado em seu saldo!","Imposto calculado em seu premio!","Imposto calculado em seu bonus!","Imposto calculado em seu lucro!","Imposto calculado em seu ouro!","Imposto calculado em seu bau!","Imposto calculado em seu escudo!","Imposto calculado em seu capacete!","Imposto calculado em seu colete!","Imposto calculado em seu ataque!","Imposto calculado em seu combo!","Imposto calculado em seu dano!","Imposto calculado em seu revive!","Imposto calculado em seu respawn!","Imposto calculado em seu portal!","Imposto calculado em seu nivel!","Imposto calculado em seu rank!","Imposto calculado em seu passe!","Taxacao automatica em seu inventario!","Taxacao automatica em seu equipamento!","Taxacao automatica em seu saldo!","Taxacao automatica em seu premio!","Taxacao automatica em seu bonus!","Taxacao automatica em seu lucro!","Taxacao automatica em seu ouro!","Taxacao automatica em seu bau!","Taxacao automatica em seu escudo!","Taxacao automatica em seu capacete!","Taxacao automatica em seu colete!","Taxacao automatica em seu ataque!","Taxacao automatica em seu combo!","Taxacao automatica em seu dano!","Taxacao automatica em seu revive!","Taxacao automatica em seu respawn!","Taxacao automatica em seu portal!","Taxacao automatica em seu nivel!","Taxacao automatica em seu rank!","Taxacao automatica em seu passe!"]}createMesh(){const e=new z,t=new f({color:1710650}),n=new l(new Z(2,2.5,1.2),t);n.position.y=2.5,n.castShadow=!0,e.add(n);const i=new f({color:14531464}),a=new l(new Z(.8,.8,.8),i);a.position.y=4.2,a.castShadow=!0,e.add(a);const o=new We({color:16711680}),r=new y(.08,8,8),c=new l(r,o);c.position.set(-.18,4.3,.42),e.add(c);const h=new l(r,o);h.position.set(.18,4.3,.42),e.add(h);const d=new f({color:13369344}),u=new l(new Z(.2,1.2,.1),d);u.position.set(0,2.8,.65),e.add(u);const p=new f({color:13938487}),m=new l(new Z(1.4,1.5,.08),p);m.position.set(0,2.8,.59),e.add(m);const x=new f({color:1710618}),_=new l(new A(.6,.6,.1,8),x);_.position.y=4.7,e.add(_);const w=new l(new A(.4,.4,.5,8),x);w.position.y=5,e.add(w);const g=new f({color:1710650}),S=new l(new Z(.4,1.8,.4),g);S.position.set(-1.3,2.5,0),e.add(S);const v=new l(new Z(.4,1.8,.4),g);v.position.set(1.3,2.5,0),e.add(v);const E=new l(new Z(.5,.5,.5),g);E.position.set(-1.3,1.35,0),e.add(E);const I=new l(new Z(.5,.5,.5),g);I.position.set(1.3,1.35,0),e.add(I);const C=new f({color:1710634}),P=new l(new Z(.5,1.2,.5),C);P.position.set(-.4,.6,0),e.add(P);const k=new l(new Z(.5,1.2,.5),C);k.position.set(.4,.6,0),e.add(k);const b=new f({color:3811866}),M=new l(new Z(.6,.4,.3),b);M.position.set(1.5,1.6,0),e.add(M);const U=document.createElement("canvas");U.width=256,U.height=64;const O=U.getContext("2d");O.fillStyle="#ffcc00",O.font="bold 22px Courier New",O.textAlign="center",O.fillText("GOVERNO FEDERAL",128,40);const L=new Yt(U),H=new Cn({map:L}),q=new Jn(H);return q.position.y=5.8,q.scale.set(3,.8,1),e.add(q),e}update(e,t){if(!this.alive)return null;this.attackCooldown-=e,this.speechTimer-=e,this.speechTimer<=0&&(this.showSpeechBubble(),this.speechTimer=10),this.speechBubble&&(this.speechBubbleLife-=e,this.speechBubbleLife<=0&&(this.mesh.remove(this.speechBubble),this.speechBubble=null)),this.minionTimer-=e,this.minionTimer<=0&&(this.minionTimer=30,this.spawnMinions(3));for(const d of this.minions){if(!d.alive)continue;const u=d.update(e,t);u>0&&(this.lastHitDamage=(this.lastHitDamage||0)+u)}const n=this.mesh.position,i=n.distanceTo(t),a=t.clone().sub(n).normalize();a.y=0,this.wanderDir.copy(a);const o=this.chaseSpeed,r=n.x+this.wanderDir.x*o*e,c=n.z+this.wanderDir.z*o*e;this.arena&&!this.arena.isPassable(r,c)?this.wanderDir.negate():(n.x=r,n.z=c);const h=Math.atan2(this.wanderDir.x,this.wanderDir.z);return this.mesh.rotation.y=h,this.mesh.position.y=Math.sin(performance.now()*.003)*.1,this.updateProjectiles(e,t),this.meleeCooldown-=e,i<this.meleeRange&&this.meleeCooldown<=0?(this.meleeCooldown=this.meleeRate,this.lastHitDamage=this.attackDamage,this.spawnMeleeHitbox(t)):i<this.attackRange&&this.attackCooldown<=0&&(this.attackCooldown=this.shootCooldown,this.fireProjectile(t)),null}fireProjectile(e){const t=this.mesh.position.clone();t.y=2.5;const n=e.clone().sub(t).normalize(),i=document.createElement("canvas");i.width=128,i.height=64;const a=i.getContext("2d");a.fillStyle="#ffffff",a.fillRect(0,0,128,64),a.strokeStyle="#333333",a.lineWidth=3,a.strokeRect(2,2,124,60),a.fillStyle="#cc0000",a.font="bold 18px Courier New",a.textAlign="center",a.fillText("IMPOSTO",64,38);const o=new Yt(i),r=new St(1,.5),c=new We({map:o,side:Lt}),h=new l(r,c);h.position.copy(t),this.scene.add(h);const d=new St(.4,.2),u=new We({color:16777215,transparent:!0,opacity:.4,side:Lt}),p=new l(d,u);p.position.copy(t),this.scene.add(p),this.projectiles.push({mesh:h,trail:p,dir:n,speed:18,life:3}),at.gunshot()}updateProjectiles(e,t){for(let n=this.projectiles.length-1;n>=0;n--){const i=this.projectiles[n];if(i.mesh.position.add(i.dir.clone().multiplyScalar(i.speed*e)),i.mesh.rotation.z+=e*3,i.trail.position.copy(i.mesh.position).add(i.dir.clone().multiplyScalar(-.5)),i.trail.rotation.z=i.mesh.rotation.z,i.life-=e,i.mesh.position.distanceTo(t)<1.2){this.scene.remove(i.mesh),this.scene.remove(i.trail),this.projectiles.splice(n,1),this.lastHitDamage=this.attackDamage;return}i.life<=0&&(this.scene.remove(i.mesh),this.scene.remove(i.trail),this.projectiles.splice(n,1))}this.lastHitDamage=0}getHitDamage(){const e=this.lastHitDamage||0;return this.lastHitDamage=0,e}takeDamage(e){return this.health-=e,this.health<=0?(this.die(),!0):(this.flashDamage(),!1)}flashDamage(){this.mesh.children.forEach(e=>{if(e.material){const t=e.material.color.getHex();e.material.color.setHex(16711680),setTimeout(()=>e.material.color.setHex(t),100)}})}spawnMinions(e){for(let t=0;t<e;t++){const n=t/e*Math.PI*2+Math.random()*.5,i=5+Math.random()*3,a=this.mesh.position.x+Math.cos(n)*i,o=this.mesh.position.z+Math.sin(n)*i,r=new Sf(this.scene,a,o,this.arena);this.minions.push(r)}}spawnMeleeHitbox(e){const t=this.mesh.position.clone(),n=e.clone().sub(t).normalize();t.add(n.multiplyScalar(2.5)),t.y=1.5;const i=new Z(1.5,1.5,1.5),a=new We({color:16729088,transparent:!0,opacity:.4}),o=new l(i,a);o.position.copy(t),this.scene.add(o),setTimeout(()=>{this.scene.remove(o),i.dispose(),a.dispose()},300)}showSpeechBubble(){this.speechBubble&&this.mesh.remove(this.speechBubble);const e=this.speeches[Math.floor(Math.random()*this.speeches.length)],t=document.createElement("canvas");t.width=256,t.height=80;const n=t.getContext("2d");n.fillStyle="#ffffff",n.beginPath(),n.roundRect(4,4,248,60,12),n.fill(),n.strokeStyle="#333333",n.lineWidth=2,n.beginPath(),n.roundRect(4,4,248,60,12),n.stroke(),n.beginPath(),n.moveTo(120,64),n.lineTo(128,78),n.lineTo(136,64),n.fillStyle="#ffffff",n.fill(),n.fillStyle="#222222",n.font="bold 16px Courier New",n.textAlign="center",n.fillText(e,128,42);const i=new Yt(t),a=new Cn({map:i}),o=new Jn(a);o.position.y=7,o.scale.set(4,1.2,1),this.mesh.add(o),this.speechBubble=o,this.speechBubbleLife=5}die(){this.alive=!1,this.speechBubble&&(this.mesh.remove(this.speechBubble),this.speechBubble=null);for(const e of this.projectiles)this.scene.remove(e.mesh),this.scene.remove(e.trail);this.projectiles=[];for(const e of this.minions)e.alive&&e.die();this.minions=[],this.scene.remove(this.mesh)}}class Zr extends Ia{constructor(e,t,n,i){super(e,t,n,i,{health:500,maxHealth:500,speed:10,chaseSpeed:10,attackDamage:12,points:5,attackRange:10}),this.mesh.scale.setScalar(.7)}}class Sf{constructor(e,t,n,i){this.scene=e,this.arena=i,this.alive=!0,this.health=100,this.speed=10,this.attackDamage=10,this.attackRange=8,this.meleeRange=3,this.shootCooldown=0,this.shootRate=2.5,this.meleeCooldown=0,this.meleeRate=2.5,this.hitRadius=1,this.hitHeight=1.5,this.projectiles=[],this.mesh=this.createMesh(),this.mesh.position.set(t,0,n),e.add(this.mesh)}createMesh(){const e=new z,t=new f({color:2763338}),n=new l(new Z(.7,1.2,.5),t);n.position.y=1.3,n.castShadow=!0,e.add(n);const i=new f({color:14531464}),a=new l(new Z(.4,.4,.4),i);a.position.y=2.2,e.add(a);const o=new f({color:13369344}),r=new l(new Z(.08,.5,.05),o);r.position.set(0,1.5,.28),e.add(r);const c=new f({color:2763322}),h=new l(new Z(.2,.7,.2),c);h.position.set(-.15,.35,0),e.add(h);const d=new l(new Z(.2,.7,.2),c);d.position.set(.15,.35,0),e.add(d);const u=document.createElement("canvas");u.width=128,u.height=32;const p=u.getContext("2d");p.fillStyle="#ffcc00",p.font="bold 14px Courier New",p.textAlign="center",p.fillText("FISCAL",64,22);const m=new Yt(u),x=new Cn({map:m}),_=new Jn(x);return _.position.y=2.8,_.scale.set(1.5,.4,1),e.add(_),e}update(e,t){if(!this.alive)return 0;this.shootCooldown-=e,this.meleeCooldown-=e;const n=this.mesh.position,i=n.distanceTo(t),a=t.clone().sub(n).normalize();a.y=0;const o=n.x+a.x*this.speed*e,r=n.z+a.z*this.speed*e;this.arena&&!this.arena.isPassable(o,r)||(n.x=o,n.z=r);const c=Math.atan2(a.x,a.z);this.mesh.rotation.y=c,this.updateProjectiles(e,t);let h=0;return i<this.meleeRange&&this.meleeCooldown<=0?(this.meleeCooldown=this.meleeRate,h=this.attackDamage,this.spawnMeleeHitbox(t)):i<this.attackRange&&this.shootCooldown<=0&&(this.shootCooldown=this.shootRate,this.fireProjectile(t)),h}fireProjectile(e){const t=this.mesh.position.clone();t.y=1.5;const n=e.clone().sub(t).normalize(),i=document.createElement("canvas");i.width=64,i.height=32;const a=i.getContext("2d");a.fillStyle="#ffffff",a.fillRect(0,0,64,32),a.fillStyle="#cc0000",a.font="bold 10px Courier New",a.textAlign="center",a.fillText("TAXA",32,22);const o=new Yt(i),r=new St(.6,.3),c=new We({map:o,side:Lt}),h=new l(r,c);h.position.copy(t),this.scene.add(h),this.projectiles.push({mesh:h,dir:n,speed:14,life:2.5})}updateProjectiles(e,t){for(let n=this.projectiles.length-1;n>=0;n--){const i=this.projectiles[n];if(i.mesh.position.add(i.dir.clone().multiplyScalar(i.speed*e)),i.mesh.rotation.z+=e*4,i.life-=e,i.mesh.position.distanceTo(t)<1.2){this.scene.remove(i.mesh),this.projectiles.splice(n,1),this.lastHitDamage=this.attackDamage;return}i.life<=0&&(this.scene.remove(i.mesh),this.projectiles.splice(n,1))}}spawnMeleeHitbox(e){const t=this.mesh.position.clone(),n=e.clone().sub(t).normalize();t.add(n.multiplyScalar(1.5)),t.y=1.2;const i=new Z(1,1,1),a=new We({color:16737792,transparent:!0,opacity:.35}),o=new l(i,a);o.position.copy(t),this.scene.add(o),setTimeout(()=>{this.scene.remove(o),i.dispose(),a.dispose()},250)}takeDamage(e){return this.health-=e,this.health<=0?(this.die(),!0):!1}die(){this.alive=!1;for(const e of this.projectiles)this.scene.remove(e.mesh);this.projectiles=[],this.scene.remove(this.mesh)}}const bf=600,jr=[{id:"kills_1",name:"Primeiro Abate",test:s=>s.stats.kills>=1},{id:"kills_10",name:"Dez Vidas",test:s=>s.stats.kills>=10},{id:"kills_50",name:"Caçador",test:s=>s.stats.kills>=50},{id:"kills_100",name:"Centuria",test:s=>s.stats.kills>=100},{id:"kills_250",name:"Exterminador",test:s=>s.stats.kills>=250},{id:"kills_500",name:"Lenda Viva",test:s=>s.stats.kills>=500},{id:"kills_1000",name:"Mil Abates",test:s=>s.stats.kills>=1e3},{id:"kills_2500",name:"A Morte",test:s=>s.stats.kills>=2500},{id:"kills_5000",name:"Deus da Guerra",test:s=>s.stats.kills>=5e3},{id:"money_500",name:"Trocados",test:s=>s.stats.moneyEarned>=500},{id:"money_1000",name:"Mil reais",test:s=>s.stats.moneyEarned>=1e3},{id:"money_5000",name:"Rico",test:s=>s.stats.moneyEarned>=5e3},{id:"money_10000",name:"Investidor",test:s=>s.stats.moneyEarned>=1e4},{id:"money_50000",name:"Barão",test:s=>s.stats.moneyEarned>=5e4},{id:"money_100000",name:"Milionario?",test:s=>s.stats.moneyEarned>=1e5},{id:"money_500000",name:"Magnata",test:s=>s.stats.moneyEarned>=5e5},{id:"money_1000000",name:"Bilionario",test:s=>s.stats.moneyEarned>=1e6},{id:"tokens_1",name:"Primeiro Token",test:s=>s.stats.tokensEarned>=1},{id:"tokens_10",name:"Dez Tokens",test:s=>s.stats.tokensEarned>=10},{id:"tokens_50",name:"Colecionador",test:s=>s.stats.tokensEarned>=50},{id:"tokens_100",name:"Cem Tokens",test:s=>s.stats.tokensEarned>=100},{id:"tokens_500",name:"Token Lord",test:s=>s.stats.tokensEarned>=500},{id:"tokens_1000",name:"Mil Tokens",test:s=>s.stats.tokensEarned>=1e3},{id:"tokens_5000",name:"Token Master",test:s=>s.stats.tokensEarned>=5e3},{id:"wave_5",name:"Cinco Ondas",test:s=>s.stats.waves>=5},{id:"wave_10",name:"Dez Ondas",test:s=>s.stats.waves>=10},{id:"wave_15",name:"Quinze Ondas",test:s=>s.stats.waves>=15},{id:"wave_20",name:"Vinte Ondas",test:s=>s.stats.waves>=20},{id:"wave_30",name:"Trinta Ondas",test:s=>s.stats.waves>=30},{id:"wave_50",name:"Cinquenta Ondas",test:s=>s.stats.waves>=50},{id:"level_5",name:"Nivel 5",test:s=>s.level>=5},{id:"level_10",name:"Nivel 10",test:s=>s.level>=10},{id:"level_25",name:"Nivel 25",test:s=>s.level>=25},{id:"level_50",name:"Nivel 50",test:s=>s.level>=50},{id:"level_75",name:"Nivel 75",test:s=>s.level>=75},{id:"level_100",name:"Nivel 100",test:s=>s.level>=100},{id:"boss_1",name:"Primeiro Chefe",test:s=>s.stats.bosses>=1},{id:"boss_5",name:"Cinco Chefes",test:s=>s.stats.bosses>=5},{id:"boss_10",name:"Dez Chefes",test:s=>s.stats.bosses>=10},{id:"boss_25",name:"Vinte e Cinco Chefes",test:s=>s.stats.bosses>=25},{id:"miniboss_1",name:"Mini Chefe",test:s=>s.stats.minibosses>=1},{id:"miniboss_5",name:"Cinco Minis",test:s=>s.stats.minibosses>=5},{id:"miniboss_10",name:"Dez Minis",test:s=>s.stats.minibosses>=10},{id:"miniboss_25",name:"Vinte e Cinco Minis",test:s=>s.stats.minibosses>=25},{id:"weapons_1",name:"Armado",test:s=>s.weapon.inventory.length>=1},{id:"weapons_2",name:"Duas Armas",test:s=>s.weapon.inventory.length>=2},{id:"weapons_4",name:"Arsenal",test:s=>s.weapon.inventory.length>=4},{id:"weapons_6",name:"Colecao",test:s=>s.weapon.inventory.length>=6},{id:"weapons_7",name:"Todas as Armas",test:s=>s.weapon.inventory.length>=7},{id:"armors_1",name:"Primeira Armadura",test:s=>s.stats.armorsOwned>=1},{id:"armors_2",name:"Duas Armaduras",test:s=>s.stats.armorsOwned>=2},{id:"armors_3",name:"Tres Armaduras",test:s=>s.stats.armorsOwned>=3},{id:"armors_4",name:"Quatro Armaduras",test:s=>s.stats.armorsOwned>=4},{id:"armors_5",name:"Cinto de Ferro",test:s=>s.stats.armorsOwned>=5},{id:"revive_1",name:"Renascido",test:s=>s.stats.revivesUsed>=1},{id:"revive_3",name:"Gato de Sete Vidas",test:s=>s.stats.revivesUsed>=3},{id:"revive_5",name:"Imortal",test:s=>s.stats.revivesUsed>=5},{id:"rebirth_1",name:"Primeiro Rebirth",test:s=>s.stats.rebirths>=1},{id:"rebirth_2",name:"Segundo Rebirth",test:s=>s.stats.rebirths>=2},{id:"rebirth_3",name:"Terceiro Rebirth",test:s=>s.stats.rebirths>=3},{id:"rebirth_5",name:"Cinco Rebirths",test:s=>s.stats.rebirths>=5},{id:"dmg_100000",name:"Cem Mil de Dano",test:s=>(s.stats.damageDealt||0)>=1e5},{id:"dmg_1000000",name:"Um Milhao de Dano",test:s=>(s.stats.damageDealt||0)>=1e6},{id:"dmg_5000000",name:"Cinco Milhoes de Dano",test:s=>(s.stats.damageDealt||0)>=5e6}];class Ti{static readBalance(e){const t=localStorage.getItem(e),n=Number.parseInt(t,10);return t!==null&&Number.isSafeInteger(n)&&n>=0?n:0}constructor(e){this.mode=e.mode,this.network=e.network||null,this.botCount=e.botCount||0,this.animalCount=e.animalCount||50,this.map=e.map||null,this.running=!1,this.targets=[],this.bots=[],this.chests=[],this.scores={},this.playerName=e.playerName||"Jogador",this.scores[this.playerName]=0,this.playerHealth=200,this.playerMaxHealth=200,this.playerDead=!1,this.killedByBoss=!1,this.tokens=Ti.readBalance("capiquake_tokens"),this.money=Ti.readBalance("capiquake_money"),this.armor=0,this.maxArmor=100,this.shopPurchases=e.shopPurchases||{},this.pickups=[],this.nearChest=null,this.timeRemaining=bf,this.speedBoost=!1,this.speedBoostTimer=0,this.invincible=!1,this.invincibleTimer=0,this.inventoryOpen=!1,this.inventorySelected=-1,this.boss=null,this.bossActive=!1,this.networkPlayers=[],this.remotePlayers={},this._lastPosSend=0,this.damageDealt={},this.armorType="leather",this.playerMaxHealth=200,this.rebirthLevel=Ti.readBalance("capiquake_rebirth")||0,this.rebirthMultiplier=1+this.rebirthLevel*.5,this.enchantFire=!1,this.enchantIce=!1,this.enchantLightning=!1,this.currentEnchant=null,this.skinVoid=!1,this.skinFlame=!1,this.skinSteam=!1,this.weaponSkinVoid=!1,this.weaponSkinGold=!1,this.weaponSkinCryogenic=!1,this.level=1,this.xp=0,this.voidCooldown=0,this.voidActive=!1,this.voidTimer=0,this.voidExplosionCooldown=0,this.fartCooldown=0,this.teleportCooldown=0,this.speedRushCooldown=0,this.fartCloud=null,this.nearPickup=null,this.wave=1,this.paused=!1,this.adminMode=!1,this.infiniteAmmo=!1,this.reviveCount=this.shopPurchases.revive||0,this.usedRevives=0,this.achievements=new Set((()=>{const t=localStorage.getItem("capiquake_achievements");if(!t)return new Set;const n=JSON.parse(t);return new Set(n)})()),this.deathScreenEl=null,this.adminPanelEl=null,this.waveDisplayEl=null,this.waveDisplayCreated=!1,this.drops=[],this.reviveCooldown=0,this.baseSpeedMultiplier=1,this.hasVoidAbility=!1,this.speedRushTimer=0,this.iceSlows=[],this.fartCloudTimer=0,this.fartCooldownRemaining=0,this._lastHotbarIndex=-1,this._lastHotbarLen=-1,this.stats=null}start(){this.renderer=new ff(this.map),this.scene=this.renderer.scene,this.camera=this.renderer.camera,this.arena=new wf(this.scene,this.map),this.scene.add(this.camera),this.player=new mf(this.camera,this.renderer.domElement,this.scene,this.arena),this.weapon=new _f(this.scene,this.camera,this.arena),this.hud=new vf,this.stats={kills:0,moneyEarned:0,tokensEarned:0,waves:1,bosses:0,minibosses:0,weaponsOwned:0,armorsOwned:this.shopPurchases.armorType||this.shopPurchases.armor?1:0,revivesUsed:0,rebirths:this.rebirthLevel,level:1,damageDealt:0},this.shopPurchases.minigun&&this.weapon.addWeapon("minigun",0),this.shopPurchases.ak47&&this.weapon.addWeapon("ak47",30),this.shopPurchases.cajado_fogo&&this.weapon.addWeapon("cajado_fogo",50),this.shopPurchases.bazuca&&this.weapon.addWeapon("bazuca",this.shopPurchases.ammoBazuca||100),this.shopPurchases.april_fools&&this.weapon.addWeapon("april_fools",999),this.shopPurchases.chicken_gun&&this.weapon.addWeapon("chicken_gun",this.shopPurchases.ammoChicken||10),this.shopPurchases.sniper&&this.weapon.addWeapon("sniper",this.shopPurchases.ammoSniper||10),this.mode==="test"&&(this.weapon.addWeapon("minigun",999),this.weapon.addWeapon("ak47",999),this.weapon.addWeapon("cajado_fogo",999),this.weapon.addWeapon("bazuca",999),this.weapon.addWeapon("april_fools",999),this.weapon.addWeapon("chicken_gun",999),this.weapon.addWeapon("sniper",999),this.infiniteAmmo=!0),this.shopPurchases.armor&&(this.armor=this.shopPurchases.armor),this.shopPurchases.armorType&&(this.armorType=this.shopPurchases.armorType,this.armorType==="leather"?this.playerMaxHealth+=20:this.armorType==="gold"?this.playerMaxHealth+=30:this.armorType==="iron"?this.playerMaxHealth+=50:this.armorType==="diamond"?(this.playerMaxHealth+=100,this.speedBoost=!0,this.speedBoostTimer=60,this.baseSpeedMultiplier=1.5,this.player.setSpeedMultiplier(1.5)):this.armorType==="void"&&(this.playerMaxHealth+=500,this.hasVoidAbility=!0)),this.shopPurchases.extraLife&&(this.playerMaxHealth+=this.shopPurchases.extraLife*50),this.shopPurchases.speedBoost&&(this.speedBoost=!0,this.speedBoostTimer=60,this.baseSpeedMultiplier=1.5,this.player.setSpeedMultiplier(1.5)),this.shopPurchases.healthBoost&&(this.playerMaxHealth+=100),this.rebirthLevel>=1&&(this.playerMaxHealth*=Math.pow(2,this.rebirthLevel)),this.playerHealth=this.playerMaxHealth,this.enchantFire=!!this.shopPurchases.enchantFire,this.enchantIce=!!this.shopPurchases.enchantIce,this.enchantLightning=!!this.shopPurchases.enchantLightning,this.enchantFire?this.currentEnchant="fire":this.enchantIce?this.currentEnchant="ice":this.enchantLightning&&(this.currentEnchant="lightning"),this.skinVoid=!!this.shopPurchases.skinVoid,this.skinFlame=!!this.shopPurchases.skinFlame,this.skinSteam=!!this.shopPurchases.skinSteam,this.weaponSkinVoid=!!this.shopPurchases.weaponSkinVoid,this.weaponSkinGold=!!this.shopPurchases.weaponSkinGold,this.weaponSkinCryogenic=!!this.shopPurchases.weaponSkinCryogenic,this.shopPurchases.revive&&(this.reviveCount=this.shopPurchases.revive),(this.shopPurchases.voidArmor||this.shopPurchases.voidExplosion)&&(this.hasVoidAbility=!0),this.applySkinVisuals();const e=this.arena.getPlayerStart();if(this.camera.position.set(e.x,1.7,e.z),this.spawnAnimals(),this.spawnBots(),this.spawnPickups(),this.spawnChests(),this.hud.show(),this.hud.updateRemaining(this.getHostileTargets().length),this.hud.updateHealth(this.playerHealth,this.playerMaxHealth),this.hud.updateResources(this.tokens,this.money,this.armor),this.hud.updateTimer(this.timeRemaining),this.weapon.updateDisplay(),this.weapon.updateInventoryDisplay(),this.updateHotbar(),this.stats.weaponsOwned=this.weapon.inventory.length,this.createWaveDisplay(),this.updateWaveDisplay(),this.checkAchievements(),this.running=!0,this.lastTime=performance.now(),this.animate(),this.player.onShoot(()=>this.handleShoot()),this.setupInteraction(),this.mode==="multiplayer"){const t=document.getElementById("chat");t&&(t.style.display="block")}this.mode==="multiplayer"&&this.network&&this.setupNetwork()}setupInteraction(){this._keyHandler=e=>{if(e.code==="KeyE"&&this.nearChest&&!this.playerDead&&!this.inventoryOpen&&!this.paused){const t=this.nearChest.open();if(t){this.weapon.addWeapon(t.weaponId,t.ammo);const n=Mt[t.weaponId].name,i=t.ammo===1/0?"INF":t.ammo;this.hud.showMessage(`${n} +${i} balas!`),this.hud.hideInteractPrompt(),this.nearChest=null,this.updateHotbar()}}if(e.code==="KeyE"&&this.nearPickup&&!this.playerDead&&!this.inventoryOpen&&!this.paused&&this.collectNearPickup(),e.code==="KeyZ"&&!this.playerDead&&!this.inventoryOpen&&!this.paused&&this.dropCurrentWeapon(),e.code==="KeyF"&&!this.playerDead&&!this.inventoryOpen&&!this.paused&&this.useVoidAbility(),e.code==="KeyT"&&!this.playerDead&&!this.inventoryOpen&&!this.paused&&this.useFartAbility(),e.code==="KeyG"&&!this.playerDead&&!this.inventoryOpen&&!this.paused&&this.useTeleport(),e.code==="KeyH"&&!this.playerDead&&!this.inventoryOpen&&!this.paused&&this.useSpeedRush(),e.code==="KeyP"&&(this.mode==="singleplayer"||this.mode==="test")&&this.togglePause(),e.code.startsWith("Digit")&&!this.playerDead&&!this.inventoryOpen&&!this.paused){const t=parseInt(e.code.slice(5),10)-1;this.selectWeaponIndex(t)}e.code==="F8"&&this.mode==="test"&&this.toggleAdminPanel(),e.code==="Escape"&&this.toggleInventoryScreen()},document.addEventListener("keydown",this._keyHandler)}dropCurrentWeapon(){const e=this.weapon.dropCurrentWeapon();if(e){const t=Mt[e].name;this.hud.showMessage(`${t} DESCARTADA!`)}}selectWeaponIndex(e){!this.weapon||!this.weapon.inventory||e<0||e>=this.weapon.inventory.length||this.weapon.currentIndex!==e&&(this.weapon.currentIndex=e,this.weapon.currentWeapon=this.weapon.inventory[e],this.weapon.buildCurrentModel(),this.weapon.updateHitbox(),this.weapon.updateDisplay(),this.weapon.updateInventoryDisplay(),this.updateHotbar())}toggleInventoryScreen(){this.inventoryOpen=!this.inventoryOpen;const e=document.getElementById("inventory-screen");e&&(this.inventoryOpen?(this.player.unlock(),e.style.display="flex",this.renderInventoryScreen()):(e.style.display="none",this.inventorySelected=-1,this.player.lock()))}renderInventoryScreen(){const e=document.getElementById("inventory-screen");if(!e)return;const t=e.querySelector(".inv-list");t&&(t.innerHTML="",this.weapon.inventory.forEach((n,i)=>{const a=Mt[n],o=document.createElement("div");o.className="inv-item"+(i===this.inventorySelected?" selected":"")+(i===this.weapon.currentIndex?" active":"");let r=`[${i+1}] ${a.name} (DMG:${a.damage})`;if(a.type!=="melee"){const c=this.weapon.getAmmo(n);r+=` | ${c===1/0?"INF":c} balas`}o.textContent=r,o.addEventListener("click",()=>{this.inventorySelected===-1?this.inventorySelected=i:(this.weapon.swapWeapons(this.inventorySelected,i),this.inventorySelected=-1),this.renderInventoryScreen()}),t.appendChild(o)}))}spawnChests(){const e=this.arena.map,t=e.length,n=e[0].length,i=[];for(let o=0;o<t;o++)for(let r=0;r<n;r++)(e[o][r]>=3||e[o][r]===1)&&i.push({r:o,c:r});for(let o=i.length-1;o>0;o--){const r=Math.floor(Math.random()*(o+1));[i[o],i[r]]=[i[r],i[o]]}const a=Math.min(14,i.length);for(let o=0;o<a;o++){const r=i[o],c=r.c*4+2,h=r.r*4+2;this.chests.push(new Mf(this.scene,c,h))}}spawnAnimals(){const e=this.arena.getRoomIds(),t=Math.ceil(this.animalCount/e.length),n=["jacare","tucano","anta","queixada","arara","sucuri","onca","loboguara","micoleao","tamandua","tatu","preguica","pirarucu","boto","harpia","sagui","gamba","paca","cutia","veado","jaguatirica","piranha","caititu","bugio","coruja","urubu","gaviao","tartaruga","cobracoral","cascavel","jiboia","sapo","perereca","macacoaranha","quati","cervo","urso","leao","tigre","elefante","gorila","rinoceronte","hipopotamo","crocodilo","tubarao","aguia","falcao","lobo","raposa","coiote","hiena","leopardo","pantera","bufalo","bisonte","javali","alce","rena","camelo","girafa","zebra","gnu","antilope","gazela","canguru","koala","ornitorrinco","wombat","diabo_tasmania","dragao_komodo","panda","urso_polar","morsa","foca","pinguim","pelicano","flamingo","condor","grifo","fenix","basilisco","quimera","minotauro","ciclope","hidra","cerberus","kraken","golem","troll","ogro","vampiro","zumbi","esqueleto","demonio","anjo","centauro","pegasus","unicornio","manticora","lobisomem"];for(const i of e){const a=Math.min(t,4);for(let o=0;o<a;o++){const r=n[(i+o)%n.length],c=this.arena.getRandomSpawnInRoom(i),h=new jn(this.scene,c.x,c.z,r,this.arena);h.dormant=!0,h.roomId=i,this.targets.push(h)}}this.arena.onRoomActivation(i=>{let a=0;for(const o of this.targets)o.roomId===i&&o.dormant&&(o.dormant=!1,a++);a>0&&this.hud.showMessage(`SALA ABERTA! ${a} animais!`)})}spawnBots(){if(this.mode!=="singleplayer")return;const e=["Bot_Gaucho","Bot_Mineiro","Bot_Paulista","Bot_Carioca","Bot_Baiano","Bot_Nordestino","Bot_Paranaense","Bot_Goiano","Bot_Capixaba","Bot_Matogrossense","Bot_Amazonense","Bot_Brasiliense","Bot_Cearense","Bot_Pernambucano","Bot_Gauchao","Bot_Sertanejo","Bot_Pantaneiro","Bot_Candango","Bot_Manauara","Bot_Potiguar","Bot_Maranhense","Bot_Paraense","Bot_Sergipano","Bot_Piauiense"];for(let t=0;t<this.botCount;t++){const n=e[t]||`Bot_${t}`,i=new yf(this.scene,n,this.targets,this.arena);this.bots.push(i),this.scores[n]=0}}spawnPickups(){const e=this.arena.map,t=e.length,n=e[0].length,i=[];for(let c=0;c<t;c++)for(let h=0;h<n;h++)e[c][h]===1&&i.push({r:c,c:h});for(let c=i.length-1;c>0;c--){const h=Math.floor(Math.random()*(c+1));[i[c],i[h]]=[i[h],i[c]]}let a=0;for(let c=0;c<3&&a<i.length;c++,a++){const h=i[a],d=h.c*4+2,u=h.r*4+2;this.pickups.push(this.createMedkit(d,u))}for(let c=0;c<5&&a<i.length;c++,a++){const h=i[a],d=h.c*4+2,u=h.r*4+2;this.pickups.push(this.createBandaid(d,u))}const o=["green","red","blue","blue","black","black","green","red","turquoise","turquoise","brown","brown","gray","gray"];for(let c=0;c<o.length&&a<i.length;c++,a++){const h=i[a],d=h.c*4+2,u=h.r*4+2;this.pickups.push(this.createPotion(d,u,o[c]))}for(let c=0;c<4&&a<i.length;c++,a++){const h=i[a],d=h.c*4+2,u=h.r*4+2;this.pickups.push(this.createBoost(d,u))}const r=[];for(let c=0;c<t;c++)for(let h=0;h<n;h++)e[c][h]>=3&&r.push({r:c,c:h});for(let c=r.length-1;c>0;c--){const h=Math.floor(Math.random()*(c+1));[r[c],r[h]]=[r[h],r[c]]}for(let c=0;c<10&&c<r.length;c++){const h=r[c],d=h.c*4+2,u=h.r*4+2;this.pickups.push(this.createAmmoPickup(d,u))}}createMedkit(e,t){const n=new z,i=new Z(.6,.4,.6),a=new f({color:16777215}),o=new l(i,a);n.add(o);const r=new l(new Z(.35,.42,.1),new We({color:13369344}));r.position.z=.31,n.add(r);const c=new l(new Z(.1,.42,.35),new We({color:13369344}));return c.position.z=.31,n.add(c),n.position.set(e,.6,t),this.scene.add(n),{mesh:n,x:e,z:t,type:"medkit",collected:!1}}createBandaid(e,t){const n=new z,i=new Z(.4,.12,.25),a=new f({color:14531464}),o=new l(i,a);n.add(o);const r=new l(new Z(.15,.13,.12),new f({color:11176021}));return n.add(r),n.position.set(e,.5,t),this.scene.add(n),{mesh:n,x:e,z:t,type:"bandaid",collected:!1}}createBoost(e,t){const n=new z,i=new f({color:5913130});for(let c=-1;c<=1;c+=2){const h=new l(new Z(.15,.06,.3),i);h.position.set(c*.12,0,0),n.add(h);const d=new l(new Z(.13,.2,.2),i);d.position.set(c*.12,.12,-.02),n.add(d)}const a=new We({color:16763972,transparent:!0,opacity:.7}),o=new l(new Z(.02,.12,.15),a);o.position.set(.25,.15,0),o.rotation.z=.3,n.add(o);const r=new l(new Z(.02,.12,.15),a);return r.position.set(-.25,.15,0),r.rotation.z=-.3,n.add(r),n.position.set(e,.5,t),this.scene.add(n),{mesh:n,x:e,z:t,type:"boost",collected:!1}}createAmmoPickup(e,t){const n=new z,i=new Z(.4,.3,.3),a=new f({color:9075242}),o=new l(i,a);n.add(o);const r=new l(new Z(.2,.15,.32),new We({color:13412932}));r.position.y=.05,n.add(r);const c=new l(new A(.03,.03,.12,5),new f({color:14540134}));return c.position.set(0,.08,.16),c.rotation.x=Math.PI/2,n.add(c),n.position.set(e,.5,t),this.scene.add(n),{mesh:n,x:e,z:t,type:"ammo",ammoCount:Dc(),collected:!1}}createPotion(e,t,n){const i=new z,o={green:{glass:2250018,liquid:4521796},red:{glass:5579298,liquid:16729156},blue:{glass:2237013,liquid:4491519},black:{glass:1710618,liquid:3355443},turquoise:{glass:2250069,liquid:4521966},brown:{glass:4469538,liquid:11171652},gray:{glass:3355443,liquid:13421772}}[n],r=new A(.12,.15,.4,6),c=new f({color:o.glass,transparent:!0,opacity:.7}),h=new l(r,c);i.add(h);const d=new A(.06,.08,.15,6),u=new l(d,c);u.position.y=.27,i.add(u);const p=new y(.07,5,4),m=new f({color:6965802}),x=new l(p,m);x.position.y=.37,i.add(x);const _=new A(.1,.13,.3,6),w=new We({color:o.liquid,transparent:!0,opacity:.5}),g=new l(_,w);return g.position.y=-.03,i.add(g),i.position.set(e,.55,t),this.scene.add(i),{mesh:i,x:e,z:t,type:"potion",potionColor:n,collected:!1}}checkPickups(){const e=this.player.getPosition();for(const t of this.pickups){if(t.collected)continue;const n=e.x-t.x,i=e.z-t.z;if(Math.sqrt(n*n+i*i)<2){if(t.type==="medkit"&&this.playerHealth>=this.playerMaxHealth||t.type==="bandaid"&&this.playerHealth>=this.playerMaxHealth)continue;if(t.collected=!0,this.scene.remove(t.mesh),t.type==="medkit")this.playerHealth=this.playerMaxHealth,this.hud.showMessage("KIT MEDICO! Vida cheia!");else if(t.type==="bandaid")this.playerHealth=Math.min(this.playerMaxHealth,this.playerHealth+this.playerMaxHealth*.1),this.hud.showMessage("BANDAID! +10% vida");else if(t.type==="boost")this.speedBoost=!0,this.speedBoostTimer=30,this.player.setSpeedMultiplier(1.6),this.hud.showMessage("BOOST! Velocidade aumentada!");else if(t.type==="potion")this.applyPotion(t.potionColor);else if(t.type==="ammo"){this.weapon.addAmmo(null,t.ammoCount);const o=t.ammoCount===1/0?"INF":t.ammoCount;this.hud.showMessage(`MUNICAO! +${o} balas!`),this.weapon.updateDisplay()}this.hud.updateHealth(this.playerHealth,this.playerMaxHealth)}}}applyPlayerDamage(e){if(this.mode==="test")return!1;if(this.armor>0){const t=Math.min(this.armor,e*.6);this.armor-=t,e-=t,this.hud.updateResources(this.tokens,this.money,Math.floor(this.armor))}return this.playerHealth-=e,this.hud.updateHealth(this.playerHealth,this.playerMaxHealth),this.hud.showDamageFlash(),at.playerHurt(),this.playerHealth<=0}applyPotion(e){switch(e){case"green":{const t=this.playerMaxHealth*.3;this.playerHealth-=t,this.hud.showDamageFlash(),at.playerHurt(),this.hud.showMessage("VENENO! -30% vida!"),this.playerHealth<=0&&(this.playerHealth=0,this.playerDead=!0,this.hud.updateHealth(0,this.playerMaxHealth),this.hud.addKillEntry("VENENO",this.playerName),this.hud.showMessage("ENVENENADO!"),this.showDeathScreen());break}case"red":this.playerHealth+=this.playerMaxHealth*.5,this.hud.showMessage("POCAO VERMELHA! +50% vida extra!");break;case"blue":this.playerHealth=Math.min(this.playerMaxHealth,this.playerHealth+this.playerMaxHealth*.3),this.hud.showMessage("POCAO AZUL! +30% vida!");break;case"black":this.playerHealth=Math.min(this.playerMaxHealth,this.playerHealth+this.playerMaxHealth*.15),this.hud.showMessage("POCAO PRETA! +15% vida!");break;case"turquoise":this.playerHealth+=100,this.hud.showMessage("POCAO TURQUESA! +100 vida extra!");break;case"brown":this.speedBoost=!0,this.speedBoostTimer=20,this.player.setSpeedMultiplier(1.5),this.hud.showMessage("POCAO MARROM! Velocidade!");break;case"gray":this.invincible=!0,this.invincibleTimer=30,this.hud.showMessage("POCAO CINZA! Invencivel 30s!");break}}checkChests(){const e=this.player.getPosition();let t=null,n=1/0;for(const i of this.chests){if(i.opened)continue;const a=i.getDistanceTo(e);a<2.5&&a<n&&(t=i,n=a)}t&&t!==this.nearChest?(this.nearChest=t,this.hud.showInteractPrompt()):!t&&this.nearChest&&(this.nearChest=null,this.hud.hideInteractPrompt())}checkBotSales(){const e=this.player.getPosition();for(const t of this.bots)for(const n of t.droppedItems){if(n.collected)continue;const i=e.x-n.position.x,a=e.z-n.position.z;i*i+a*a<4&&(n.collected=!0,this.scene.remove(n.mesh),n.type==="ammo"?(this.weapon.addAmmo(null,10),this.hud.showMessage("Comprou municao do Carioca!")):(this.playerHealth=Math.min(this.playerMaxHealth,this.playerHealth+50),this.hud.showMessage("Comprou kit do Carioca!")),this.weapon.updateDisplay(),this.hud.updateHealth(this.playerHealth,this.playerMaxHealth))}}setupNetwork(){this.network.onStateUpdate(e=>{this.networkPlayers.length=0;for(const t of Object.keys(e||{})){const n=e[t];n&&n.position&&(this.networkPlayers.push(n.position),this.updateRemotePlayer(t,n))}}),this.network.onKill(e=>{!e||!e.player||e.player!==this.playerName&&(this.scores[e.player]=(this.scores[e.player]||0)+1,this.hud.addKillEntry(e.player,"ANIMAL"))}),this.network.sendJoin(this.playerName)}updateRemotePlayer(e,t){let n=this.remotePlayers[e];n||(n={mesh:this.createRemotePlayerMesh(),position:new N,rotationY:0,lastSeen:performance.now()},this.remotePlayers[e]=n,this.scene.add(n.mesh)),n.position.set(t.position.x,t.position.y,t.position.z);const i=t.rotation;i&&typeof i=="object"&&typeof i.y=="number"&&(n.rotationY=i.y),n.lastSeen=performance.now()}createRemotePlayerMesh(){const e=new z,t=new Z(.6,1.4,.4),n=new f({color:3368652}),i=new l(t,n);i.position.y=.9,i.castShadow=!0,e.add(i);const a=new Z(.4,.4,.4),o=new f({color:13413e3}),r=new l(a,o);r.position.y=1.8,r.castShadow=!0,e.add(r);const c=new Z(.08,.08,.6),h=new f({color:3355443}),d=new l(c,h);return d.position.set(.4,1.1,-.2),e.add(d),e}isHostileTarget(e){return!!e&&!e.isProtectedAlly}getHostileTargets(){return this.targets.filter(e=>e&&e.alive&&!e.isProtectedAlly)}getCombatTargets(){const e=this.getHostileTargets();return this.boss&&this.boss.alive?[...e,this.boss]:e}handleShoot(){if(this.playerDead||this.inventoryOpen||this.paused)return;const e=this.getCombatTargets(),t=this.weapon.fire(e);if(this.infiniteAmmo&&this.weapon.currentWeapon!=="minigun"&&(this.weapon.addAmmo(this.weapon.currentWeapon,1),this.weapon.updateDisplay(),this.weapon.updateInventoryDisplay()),t){const n=this.weapon.getDamage();this.registerDamage(t,n);const i=t.takeDamage(n);if(this.enchantIce&&!i&&t.alive&&this.applyIceSlow(t),t===this.boss){this.hud.updateBossHealth(this.boss.health,this.boss.maxHealth),i&&this.resolveBossKill(t)&&this.endGame();return}i&&(this.resolveKill(t,this.playerName),this.mode==="multiplayer"&&this.network&&this.network.sendKill(t.id))}}processBoltHits(){for(;this.weapon.pendingHits.length>0;){const e=this.weapon.pendingHits.shift(),t=e.target,n=e.damage;if(!t.alive||!this.isHostileTarget(t))continue;this.registerDamage(t,n);const i=t.takeDamage(n);if(this.enchantIce&&!i&&t.alive&&this.applyIceSlow(t),t===this.boss){this.hud.updateBossHealth(this.boss.health,this.boss.maxHealth),i&&this.resolveBossKill(t)&&this.endGame();continue}i&&this.resolveKill(t,this.playerName)}}handleBotKill(e,t){this.isHostileTarget(t)&&(t.die(),this.weapon.pendingHits.some(n=>n.target===t)&&(this.weapon.pendingHits=this.weapon.pendingHits.filter(n=>n.target!==t)),this.resolveKill(t,e.name))}registerDamage(e,t){!e||!this.isHostileTarget(e)||(e.damageDealers||(e.damageDealers={}),e.damageDealers[this.playerName]=(e.damageDealers[this.playerName]||0)+t,this.damageDealt[this.playerName]=(this.damageDealt[this.playerName]||0)+t,this.stats.damageDealt=(this.stats.damageDealt||0)+t)}getTopDamageDealer(e){const t=e&&e.damageDealers;if(!t)return null;let n=null,i=0;for(const[a,o]of Object.entries(t))o>i&&(n=a,i=o);return n}getMoneyMultiplier(){return 1+this.rebirthLevel}getTokenMultiplier(){return 1+this.rebirthLevel*.5}getXpMultiplier(){return 1+this.rebirthLevel}saveBalance(){this.mode!=="test"&&(localStorage.setItem("capiquake_money",this.money),localStorage.setItem("capiquake_tokens",this.tokens))}saveStats(){this.mode!=="test"&&localStorage.setItem("capiquake_stats",JSON.stringify(this.stats||{}))}resolveKill(e,t){const n=this.getTopDamageDealer(e)||t,i=e.points||1;this.scores[n]=(this.scores[n]||0)+i,n===this.playerName&&this.hud.updateKills(this.scores[this.playerName]);const a=e.config?e.config.name:"ANIMAL";if(n===this.playerName){const r=this.getMoneyMultiplier(),c=this.getTokenMultiplier(),h=Math.round((e.getDropMoney?e.getDropMoney():e.dropMoney||0)*r),d=Math.round((e.getDropTokens?e.getDropTokens():e.dropTokens||0)*c);this.money+=h,this.tokens+=d,this.saveBalance(),this.hud.updateResources(this.tokens,this.money,this.armor),h>0&&this.hud.showMessage(`+$${h}`),d>0&&this.hud.showMessage(`+${d} TOKENS`),(h>0||d>0)&&this.createCoinPickup(e.mesh?e.mesh.position:null,h,d,!0),this.stats.kills=(this.stats.kills||0)+1,this.stats.moneyEarned=(this.stats.moneyEarned||0)+h,this.stats.tokensEarned=(this.stats.tokensEarned||0)+d,this.addXp(i*10),this.checkAchievements()}this.hud.showMessage(`${a} ABATIDA! +${i}`),this.hud.addKillEntry(n,a);const o=this.getHostileTargets();this.hud.updateRemaining(o.length),o.length===0&&!this.bossActive&&!this.playerDead&&this.nextWave()}resolveBossKill(e){if(this.hud.hideBossBar(),e.isMiniBoss){this.stats.minibosses=(this.stats.minibosses||0)+1,this.tokens+=5,this.money+=200,this.saveBalance(),this.hud.updateResources(this.tokens,this.money,this.armor),this.hud.showMessage("MINI BOSS DERROTADO! +5 TOKENS!"),this.hud.addKillEntry(this.getTopDamageDealer(e)||this.playerName,"MINI BOSS"),this.scores[this.playerName]+=e.points||50,this.hud.updateKills(this.scores[this.playerName]),this.addXp((e.points||50)*10),this.boss=null,this.bossActive=!1,this.checkAchievements();const t=this.getHostileTargets();return this.hud.updateRemaining(t.length),t.length===0&&!this.playerDead&&this.nextWave(),!1}if(e.isWaveBoss){this.stats.bosses=(this.stats.bosses||0)+1,this.tokens+=10,this.money+=500,this.saveBalance(),this.hud.updateResources(this.tokens,this.money,this.armor),this.hud.showMessage("CHEFE DA ONDA DERROTADO! +10 TOKENS!"),this.hud.addKillEntry(this.getTopDamageDealer(e)||this.playerName,"GOVERNO FEDERAL"),this.scores[this.playerName]+=e.points||100,this.hud.updateKills(this.scores[this.playerName]),this.addXp((e.points||100)*10),this.boss=null,this.bossActive=!1,this.checkAchievements();const t=this.getHostileTargets();return this.hud.updateRemaining(t.length),t.length===0&&!this.playerDead&&this.nextWave(),!1}return this.hud.showMessage("GOVERNO FEDERAL DERROTADO! +10 TOKENS!"),this.hud.addKillEntry(this.getTopDamageDealer(e)||this.playerName,"GOVERNO FEDERAL"),this.scores[this.playerName]+=e.points||0,this.hud.updateKills(this.scores[this.playerName]),this.tokens+=10,this.saveBalance(),this.hud.updateResources(this.tokens,this.money,this.armor),this.stats.bosses=(this.stats.bosses||0)+1,this.checkAchievements(),!0}applyIceSlow(e){!e||typeof e.speed!="number"||e._iceSlowTimer||(e._iceSlowTimer=5,e.speed*=.5)}useVoidAbility(){if(this.hasVoidAbility){if(this.voidExplosionCooldown>0){this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.voidExplosionCooldown)} segundos.`);return}if(this.voidActive){this.hud.showCooldownMessage("Habilidade Void ja esta ativa!");return}if(this.shopPurchases.voidExplosion){this.voidExplosionCooldown=30;const e=this.player.getPosition(),t=this.getCombatTargets().slice();for(const n of t){if(!n.alive)continue;const i=n.mesh.position;Math.sqrt((i.x-e.x)*(i.x-e.x)+(i.z-e.z)*(i.z-e.z))<=10&&(this.registerDamage(n,200),n.takeDamage(200)&&(n===this.boss?this.resolveBossKill(n)&&this.endGame():this.resolveKill(n,this.playerName)))}this.hud.showMessage("EXPLOSAO VOID! 200 de dano em area!");return}if(this.voidCooldown>0){this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.voidCooldown)} segundos.`);return}this.voidActive=!0,this.voidTimer=15,this.voidCooldown=30,this.hud.showMessage("HABILIDADE VOID ATIVADA! 15s de invencibilidade!")}}useFartAbility(){if(this.fartCooldown>0){this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.fartCooldown)} segundos.`);return}this.fartCooldown=20;const e=this.player.getPosition(),t=new z,n=new l(new y(1.2,10,8),new We({color:4508740,transparent:!0,opacity:.6}));t.add(n),t.position.set(e.x,e.y+.5,e.z),this.scene.add(t),this.fartCloud=t,this.fartCloudTimer=2;const i=this.getCombatTargets().slice();for(const a of i){if(!a.alive)continue;const o=a.mesh.position;if(Math.sqrt((o.x-e.x)*(o.x-e.x)+(o.z-e.z)*(o.z-e.z))<=8){this.registerDamage(a,5);const h=a.takeDamage(5);a.fleeTimer=10,a.chasing=!1,h&&(a===this.boss?this.resolveBossKill(a)&&this.endGame():this.resolveKill(a,this.playerName))}}this.hud.showMessage("PEIDO! +5 dano e fuga!")}useTeleport(){if(!this.shopPurchases.teleport)return;if(this.teleportCooldown>0){this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.teleportCooldown)} segundos.`);return}this.teleportCooldown=15;const e=[];for(const n of this.arena.getRoomIds())for(const i of this.arena.getRoomSpawnPoints(n))this.arena.isPassable(i.x,i.z)&&e.push(i);if(e.length===0){this.hud.showCooldownMessage("Nenhum ponto de teleporte encontrado!");return}const t=e[Math.floor(Math.random()*e.length)];this.camera.position.set(t.x,1.7,t.z),this.hud.showMessage("TELEPORTE!")}useSpeedRush(){if(this.shopPurchases.speedRush){if(this.speedRushTimer>0){this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.speedRushTimer)} segundos.`);return}if(this.speedRushCooldown>0){this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.speedRushCooldown)} segundos.`);return}this.speedRushTimer=10,this.speedRushCooldown=45,this.player.setSpeedMultiplier(2),this.hud.showMessage("SPEED RUSH! 200% velocidade por 10s!")}}showDeathScreen(){let e=document.getElementById("death-screen");e||(e=document.createElement("div"),e.id="death-screen",e.style.cssText="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);z-index:1000;color:#fff;font-family:sans-serif;",e.innerHTML='<h2>VOCE MORREU!</h2><p>Reviver custa <span id="revive-price">R$5750</span> ou use revives comprados.</p><p>Revives disponiveis: <span id="revive-count">0</span></p><div id="death-shop" style="display:none;margin:10px 0;"></div><button id="btn-revive" style="margin:4px;padding:8px 16px;">Reviver (R$5750)</button><button id="btn-death-shop" style="margin:4px;padding:8px 16px;">Loja de Emergencia</button><button id="btn-death-menu" style="margin:4px;padding:8px 16px;">Voltar ao Menu</button>',document.body.appendChild(e)),e.style.display="flex",this.deathScreenEl=e;const t=Math.max(0,this.reviveCount-this.usedRevives),n=document.getElementById("revive-count");n&&(n.textContent=t);const i=document.getElementById("revive-price");i&&(i.textContent="R$5750");const a=document.getElementById("btn-revive");a&&(a.onclick=()=>this.revivePlayer(),a.disabled=this.reviveCooldown>0);const o=document.getElementById("btn-death-shop");o&&(o.onclick=()=>this.toggleDeathShop());const r=document.getElementById("btn-death-menu");r&&(r.onclick=()=>this.returnToMenu())}hideDeathScreen(){const e=document.getElementById("death-screen");e&&(e.style.display="none")}revivePlayer(){const e=Math.max(0,this.reviveCount-this.usedRevives);if(this.reviveCooldown>0){this.hud.showCooldownMessage(`Espere! Faltam ${Math.ceil(this.reviveCooldown)} segundos.`);return}if(this.mode==="multiplayer"&&e<=0){this.hud.showCooldownMessage("Multiplayer: apenas revives comprados!");return}if(e>0){this.usedRevives++,this.stats.revivesUsed=(this.stats.revivesUsed||0)+1,this.checkAchievements(),this.performRevive();return}if(this.money>=5750){this.money-=5750,this.saveBalance(),this.hud.updateResources(this.tokens,this.money,this.armor),this.performRevive();return}this.hud.showCooldownMessage("Sem dinheiro suficiente para reviver!")}performRevive(){this.hideDeathScreen();const e=this.arena.getPlayerStart();this.camera.position.set(e.x,1.7,e.z),this.playerDead=!1,this.killedByBoss=!1,this.playerHealth=this.playerMaxHealth,this.reviveCooldown=300,this.hud.updateHealth(this.playerHealth,this.playerMaxHealth),this.hud.showMessage("REVIVEU! Vida cheia!");const t=document.getElementById("btn-revive");t&&(t.disabled=!0)}toggleDeathShop(){const e=document.getElementById("death-shop");if(!e)return;const t=e.style.display!=="none";e.style.display=t?"none":"block",t||this.populateDeathShop(e)}populateDeathShop(e){e.innerHTML="";const t=document.createElement("button");t.textContent="Vida Extra (+50 HP) - $1000 ou 1 token",t.style.cssText="margin:4px;padding:6px 12px;",t.onclick=()=>{if(this.money>=1e3)this.money-=1e3,this.saveBalance();else if(this.tokens>=1)this.tokens-=1,this.saveBalance();else{this.hud.showCooldownMessage("Sem dinheiro ou tokens!");return}this.playerMaxHealth+=50,this.playerHealth=this.playerMaxHealth,this.hud.updateHealth(this.playerHealth,this.playerMaxHealth),this.hud.updateResources(this.tokens,this.money,this.armor),this.hud.showMessage("VIDA EXTRA! +50 HP")};const n=document.createElement("button");n.textContent="Reviver (1 token)",n.style.cssText="margin:4px;padding:6px 12px;",n.onclick=()=>{if(this.tokens>=1){this.tokens-=1,this.saveBalance(),this.reviveCount++,this.hud.updateResources(this.tokens,this.money,this.armor);const i=document.getElementById("revive-count");i&&(i.textContent=Math.max(0,this.reviveCount-this.usedRevives)),this.hud.showMessage("REVIVE COMPRADO!")}else this.hud.showCooldownMessage("Sem tokens!")},e.appendChild(t),e.appendChild(n)}returnToMenu(){this.hideDeathScreen(),this.endGame(),typeof window<"u"&&typeof window.showMainMenu=="function"?window.showMainMenu():typeof window<"u"&&typeof window.menuShow=="function"?window.menuShow():location.reload()}nextWave(){this.playerDead||this.bossActive||(this.wave++,this.stats.waves=this.wave,this.updateWaveDisplay(),this.hud.showMessage(`WAVE ${this.wave}`),this.checkAchievements(),this.wave%10===0?this.spawnWaveBoss():this.wave%5===0?(this.spawnMiniBoss(),this.spawnWaveAnimals()):this.spawnWaveAnimals())}spawnWaveAnimals(){const e=this.getHostileTargets().length,t=40+this.wave*2,n=Math.max(1,Math.min(8+this.wave,t-e)),i=["jacare","tucano","anta","queixada","arara","sucuri","onca","loboguara","piranha","cascavel","tigre","leao","lobo","zumbi","esqueleto","demonio","golem","ogro","troll"],a=this.arena.getRoomIds();for(let o=0;o<n;o++){const r=a[Math.floor(Math.random()*a.length)],c=this.arena.getRandomSpawnInRoom(r),h=i[Math.floor(Math.random()*i.length)],d=new jn(this.scene,c.x,c.z,h,this.arena);d.dormant=!1,d.roomId=r,typeof d.maxHealth=="number"&&(d.maxHealth=Math.round(d.maxHealth*(1+this.wave*.1)),d.health=d.maxHealth),typeof d.attackDamage=="number"&&(d.attackDamage*=1+this.wave*.05),this.targets.push(d)}}spawnMiniBoss(){const e=this.pickBossSpawn();e&&(this.bossActive=!0,this.hud.showBossMessage("MINI BOSS A VISTA!!!"),this.hud.showBossBar(),this.boss=new Zr(this.scene,e.x,e.z,this.arena),this.boss.isMiniBoss=!0,this.hud.updateBossHealth(this.boss.health||500,this.boss.maxHealth||500))}spawnWaveBoss(){const e=this.arena.map.length,t=this.arena.map[0].length,n=Math.floor(e/2),a=Math.floor(t/2)*4+2,o=n*4+2;this.bossActive=!0,this.hud.showBossMessage("CHEFE DA ONDA A VISTA!!!"),this.hud.showBossBar(),this.boss=new Ia(this.scene,a,o,this.arena),this.boss.isWaveBoss=!0,this.hud.updateBossHealth(this.boss.health||1e3,this.boss.maxHealth||1e3)}createWaveDisplay(){if(this.waveDisplayCreated)return;const e=document.getElementById("stats");this.waveDisplayEl=document.createElement("div"),this.waveDisplayEl.id="wave-display",this.waveDisplayEl.style.cssText="color:#ffcc66;font-size:14px;margin-top:4px;",e?e.appendChild(this.waveDisplayEl):(this.waveDisplayEl.style.cssText+="position:absolute;top:10px;right:10px;z-index:50;",document.body.appendChild(this.waveDisplayEl)),this.waveDisplayCreated=!0}updateWaveDisplay(){this.waveDisplayCreated||this.createWaveDisplay(),this.waveDisplayEl&&(this.waveDisplayEl.textContent=`ONDA ${this.wave}`)}createCoinPickup(e,t,n,i){const a=new z,o=new l(new Z(.3,.3,.3),new f({color:16768256}));a.add(o);const r=e?e.x:this.player.getPosition().x,c=e?e.z:this.player.getPosition().z;a.position.set(r,1,c),this.scene.add(a),this.drops.push({mesh:a,x:r,z:c,type:"drops",money:t,tokens:n,granted:!!i,collected:!1})}checkDrops(){const e=this.player.getPosition();let t=null,n=1/0;for(const i of this.drops){if(i.collected)continue;const a=e.x-i.x,o=e.z-i.z,r=Math.sqrt(a*a+o*o);if(r<n&&(t=i,n=r),r<2){if(i.collected=!0,this.scene.remove(i.mesh),i.granted)continue;this.money+=i.money,this.tokens+=i.tokens,this.saveBalance(),this.hud.updateResources(this.tokens,this.money,this.armor),i.money>0&&this.hud.showMessage(`+$${i.money}`),i.tokens>0&&this.hud.showMessage(`+${i.tokens} TOKENS`)}}t&&n<2&&t!==this.nearPickup?(this.nearPickup=t,this.hud.showInteractPrompt()):(!t||n>=2)&&(this.nearPickup&&this.hud.hideInteractPrompt(),this.nearPickup=null)}collectNearPickup(){if(!this.nearPickup||this.nearPickup.collected)return;const e=this.nearPickup;e.collected=!0,this.scene.remove(e.mesh),e.granted||(this.money+=e.money,this.tokens+=e.tokens,this.saveBalance(),this.hud.updateResources(this.tokens,this.money,this.armor),e.money>0&&this.hud.showMessage(`+$${e.money}`),e.tokens>0&&this.hud.showMessage(`+${e.tokens} TOKENS`)),this.nearPickup=null,this.hud.hideInteractPrompt()}applySkinVisuals(){if(!this.weapon||!this.weapon.weaponGroup)return;let e=null;this.skinVoid?e=8930559:this.skinFlame?e=16733474:this.skinSteam&&(e=11189196),e!==null&&this.weapon.weaponGroup.traverse(n=>{n.isMesh&&n.material&&(Array.isArray(n.material)?n.material.forEach(i=>{i.color&&i.color.setHex(e)}):n.material.color&&n.material.color.setHex(e))});const t=document.getElementById("crosshair");t&&(this.skinVoid?t.style.borderColor="#8844ff":this.skinFlame?t.style.borderColor="#ff5522":this.skinSteam&&(t.style.borderColor="#aabbcc"))}updateHotbar(){if(!this.hud||typeof this.hud.updateHotbar!="function")return;const e=this.weapon.inventory;this._lastHotbarIndex===this.weapon.currentIndex&&this._lastHotbarLen===e.length||(this._lastHotbarIndex=this.weapon.currentIndex,this._lastHotbarLen=e.length,this.hud.updateHotbar(e,this.weapon.currentIndex,Mt))}addChatMessage(e,t,n){const i=document.getElementById("chat-messages");if(!i)return;const a=document.createElement("div");a.className="chat-entry";const o=document.createElement("span");for(o.style.color=t||"#ffffff",o.textContent=e+": ",a.appendChild(o),a.append(n),i.appendChild(a);i.children.length>30;)i.removeChild(i.firstChild);const r=document.getElementById("chat");r&&this.mode==="multiplayer"&&(r.style.display="block")}togglePause(){this.paused=!this.paused;let e=document.getElementById("pause-overlay");e||(e=document.createElement("div"),e.id="pause-overlay",e.style.cssText="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);z-index:900;color:#fff;font-size:48px;font-family:sans-serif;pointer-events:none;",e.textContent="PAUSADO",document.body.appendChild(e)),e.style.display=this.paused?"flex":"none",this.paused?this.player.unlock():this.player.lock()}setupAdminPanel(){if(!document.getElementById("admin-panel"))return;this._adminSelected||(this._adminSelected={}),this.buildAdminList("admin-animal-list",Object.keys(jn.TYPES||{}),"animal",this._adminSelected.animal),this.buildAdminList("admin-boss-list",["GOVERNO FEDERAL","MINI BOSS"],"boss",this._adminSelected.boss),this.buildAdminList("admin-weapon-list",Object.keys(Mt),"weapon",this._adminSelected.weapon);const t=document.getElementById("btn-create-animals");t&&(t.onclick=()=>this.adminCreateAnimals());const n=document.getElementById("btn-create-bosses");n&&(n.onclick=()=>this.adminCreateBosses());const i=document.getElementById("btn-give-weapon");i&&(i.onclick=()=>this.adminGiveWeapon());const a=document.getElementById("btn-inf-ammo");a&&(a.onclick=()=>this.adminToggleAmmo());const o=document.getElementById("btn-admin-close");o&&(o.onclick=()=>this.toggleAdminPanel(!1))}buildAdminList(e,t,n,i){const a=document.getElementById(e);a&&(a.innerHTML="",t.forEach(o=>{const r=document.createElement("div");r.textContent=o,r.className=o===i?"selected":"",r.onclick=()=>{this._adminSelected[n]=o;for(const c of a.children)c.className=c===r?"selected":""},a.appendChild(r)}),!this._adminSelected[n]&&t.length>0&&(this._adminSelected[n]=t[0],a.children[0]&&(a.children[0].className="selected")))}toggleAdminPanel(e){if(this.mode!=="test")return;this.adminMode=e!==void 0?e:!this.adminMode;const t=document.getElementById("admin-panel");t&&(t.style.display=this.adminMode?"block":"none",this.adminMode&&(this.setupAdminPanel(),this.updateAdminAmmoText()))}adminCreateAnimals(){const e=document.getElementById("admin-animal-count"),t=Math.max(1,parseInt(e.value,10)||1),n=this._adminSelected&&this._adminSelected.animal?this._adminSelected.animal:Object.keys(jn.TYPES||{})[0],i=this.arena.getRoomIds();for(let a=0;a<t;a++){const o=i[Math.floor(Math.random()*i.length)],r=this.arena.getRandomSpawnInRoom(o),c=new jn(this.scene,r.x,r.z,n,this.arena);c.dormant=!1,this.targets.push(c)}this.hud.updateRemaining(this.getHostileTargets().length)}adminCreateBosses(){const e=document.getElementById("admin-boss-count"),t=Math.max(1,parseInt(e.value,10)||1),n=this._adminSelected&&this._adminSelected.boss?this._adminSelected.boss:"GOVERNO FEDERAL";for(let i=0;i<t;i++){const a=this.pickBossSpawn();if(!a)break;n==="MINI BOSS"?(this.bossActive=!0,this.boss=new Zr(this.scene,a.x,a.z,this.arena),this.boss.isMiniBoss=!0):(this.bossActive=!0,this.boss=new Ia(this.scene,a.x,a.z,this.arena))}this.hud.showBossBar(),this.boss&&this.hud.updateBossHealth(this.boss.health||1e3,this.boss.maxHealth||1e3)}adminGiveWeapon(){const e=this._adminSelected&&this._adminSelected.weapon?this._adminSelected.weapon:Object.keys(Mt)[0];this.weapon.addWeapon(e,999),this.weapon.updateDisplay(),this.weapon.updateInventoryDisplay(),this.updateHotbar(),this.stats.weaponsOwned=this.weapon.inventory.length,this.checkAchievements()}adminToggleAmmo(){this.infiniteAmmo=!this.infiniteAmmo,this.updateAdminAmmoText()}updateAdminAmmoText(){const e=document.getElementById("btn-inf-ammo");e&&(e.textContent="INFINITA: "+(this.infiniteAmmo?"TRUE":"FALSE"))}addXp(e){this.xp+=Math.round(e*this.getXpMultiplier());let t=!1;for(;this.level<100&&this.xp>=this.level*100;)this.xp-=this.level*100,this.level++,t=!0;this.level>=100&&(this.xp=Math.min(this.xp,99*100)),t&&(this.hud.showMessage(`NIVEL ${this.level}!`),this.stats.level=this.level,this.checkAchievements())}tryRebirth(){this.mode!=="test"&&this.level>=100&&this.tokens>=1e4&&this.money>=1e6&&(this.rebirthLevel++,localStorage.setItem("capiquake_rebirth",this.rebirthLevel),this.level=1,this.xp=0,this.tokens=0,this.money=0,localStorage.setItem("capiquake_tokens","0"),localStorage.setItem("capiquake_money","0"),this.playerMaxHealth=200*Math.pow(2,this.rebirthLevel),this.stats.rebirths=this.rebirthLevel,this.checkAchievements(),this.hud.showMessage(`REBIRTH! Dinheiro x${this.getMoneyMultiplier()}, Tokens x${this.getTokenMultiplier()}, XP x${this.getXpMultiplier()}, HP x${Math.pow(2,this.rebirthLevel)}!`))}unlockAchievement(e){if(this.mode==="test"||this.achievements.has(e))return;const t=jr.find(n=>n.id===e);t&&(this.achievements.add(e),localStorage.setItem("capiquake_achievements",JSON.stringify([...this.achievements])),this.hud.showMessage(`CONQUISTA DESBLOQUEADA: ${t.name}!`))}checkAchievements(){for(const e of jr)!this.achievements.has(e.id)&&e.test(this)&&this.unlockAchievement(e.id)}pickBossSpawn(){const n=[];if(this.player){const h=this.player.getPosition();n.push({x:h.x,z:h.z})}for(const h of this.networkPlayers)n.push({x:h.x,z:h.z});const i=[];for(const h of this.arena.getRoomIds())for(const d of this.arena.getRoomSpawnPoints(h))this.arena.isPassable(d.x,d.z)&&i.push(d);if(i.length===0)return null;let a=null,o=-1/0,r=null,c=-1/0;for(const h of i){let d=1/0;for(const u of n){const p=h.x-u.x,m=h.z-u.z,x=p*p+m*m;x<d&&(d=x)}d>=625&&d>c&&(c=d,r=h),d>o&&(o=d,a=h)}return r||a}spawnBoss(){const e=this.pickBossSpawn();if(!e){this.bossActive=!1;return}this.bossActive=!0,this.hud.showBossMessage("CHEFAO A VISTA!!!"),this.hud.showBossBar(),this.hud.updateBossHealth(1e3,1e3),this.boss=new Ia(this.scene,e.x,e.z,this.arena)}endGame(){if(this._gameEnded)return;this._gameEnded=!0,this.running=!1,this.player.unlock(),this.hud.hideBossBar(),this.hud.hide();const e=document.getElementById("inventory-screen");e&&(e.style.display="none");for(const t of this.targets)t.mesh&&this.scene.remove(t.mesh);if(this.boss){this.boss.mesh&&this.scene.remove(this.boss.mesh);for(const t of this.boss.projectiles)this.scene.remove(t.mesh),t.trail&&this.scene.remove(t.trail);for(const t of this.boss.minions){t.mesh&&this.scene.remove(t.mesh);for(const n of t.projectiles)this.scene.remove(n.mesh)}}this.renderer.render(),this.saveStats(),this.playerDead?at.loseMusic():(at.winMusic(),this.level>=100&&this.tokens>=1e4&&this.money>=1e6&&this.showRebirthOffer()),ft.show(this.scores,this.playerDead,this.playerName,this.killedByBoss)}showRebirthOffer(){let e=document.getElementById("rebirth-offer");e||(e=document.createElement("div"),e.id="rebirth-offer",e.style.cssText="position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);border:2px solid #ffcc00;color:#fff;padding:16px 24px;border-radius:8px;z-index:1200;text-align:center;font-family:sans-serif;",e.innerHTML='<h3 style="margin:0 0 8px;color:#ffcc00;">REBIRTH DISPONIVEL!</h3><p style="margin:0 0 12px;">Nivel 100+ com recursos suficientes. Reinicie com bonus permanentes!</p><button id="btn-rebirth" style="margin:4px;padding:8px 16px;">REBIRTH (+1)</button><button id="btn-rebirth-skip" style="margin:4px;padding:8px 16px;">Agora nao</button>',document.body.appendChild(e)),e.style.display="block";const t=document.getElementById("btn-rebirth");t&&(t.onclick=()=>{this.rebirthLevel++,this.mode!=="test"&&localStorage.setItem("capiquake_rebirth",this.rebirthLevel),this.tokens=0,this.money=0,this.saveBalance(),this.stats.rebirths=this.rebirthLevel,this.saveStats(),this.hud.updateResources(0,0,this.armor),e&&(e.style.display="none")});const n=document.getElementById("btn-rebirth-skip");n&&(n.onclick=()=>{e&&(e.style.display="none")})}updateBuffs(e){this.speedBoost&&(this.speedBoostTimer-=e,this.speedBoostTimer<=0&&(this.speedBoost=!1,this.player.setSpeedMultiplier(1))),this.invincible&&(this.invincibleTimer-=e,this.invincibleTimer<=0&&(this.invincible=!1,this.hud.showMessage("Invencibilidade acabou!")))}updateCooldowns(e){if(this.voidCooldown>0&&(this.voidCooldown=Math.max(0,this.voidCooldown-e)),this.voidExplosionCooldown>0&&(this.voidExplosionCooldown=Math.max(0,this.voidExplosionCooldown-e)),this.fartCooldown>0&&(this.fartCooldown=Math.max(0,this.fartCooldown-e)),this.teleportCooldown>0&&(this.teleportCooldown=Math.max(0,this.teleportCooldown-e)),this.speedRushCooldown>0&&(this.speedRushCooldown=Math.max(0,this.speedRushCooldown-e)),this.reviveCooldown>0&&(this.reviveCooldown=Math.max(0,this.reviveCooldown-e)),this.reviveCooldown<=0){const t=document.getElementById("btn-revive");t&&(t.disabled=!1)}}updateVoidAbility(e){this.voidActive&&(this.voidTimer-=e,this.voidTimer<=0&&(this.voidActive=!1,this.hud.showMessage("Habilidade Void acabou!")))}updateFartCloud(e){if(!this.fartCloud)return;this.fartCloudTimer-=e,this.fartCloud.position.y+=e*1.5,this.fartCloud.scale.multiplyScalar(1+e*2);const t=this.getCombatTargets().slice();for(const n of t){if(!n.alive)continue;const i=n.mesh.position;if(Math.sqrt((i.x-this.fartCloud.position.x)*(i.x-this.fartCloud.position.x)+(i.z-this.fartCloud.position.z)*(i.z-this.fartCloud.position.z))<3.5){const o=1*e*5;this.registerDamage(n,o),n.takeDamage(o)&&(n===this.boss?this.resolveBossKill(n)&&this.endGame():this.resolveKill(n,this.playerName))}}this.fartCloudTimer<=0&&(this.scene.remove(this.fartCloud),this.fartCloud=null)}updateSpeedRush(e){this.speedRushTimer<=0||(this.speedRushTimer-=e,this.speedRushTimer<=0&&(this.player.setSpeedMultiplier(this.baseSpeedMultiplier>1?this.baseSpeedMultiplier:1),this.hud.showMessage("Speed Rush acabou!")))}updateIceSlows(e){for(const t of this.targets.concat(this.boss?[this.boss]:[]))t._iceSlowTimer&&(t._iceSlowTimer-=e,t._iceSlowTimer<=0&&(t._iceSlowTimer=0,t.speed*=2))}animate(){if(!this.running||(requestAnimationFrame(()=>this.animate()),this.paused))return;const e=performance.now(),t=(e-this.lastTime)/1e3;if(this.lastTime=e,this.mode!=="test"){if(this.timeRemaining-=t,this.timeRemaining<=0){this.timeRemaining=0,this.endGame();return}this.hud.updateTimer(this.timeRemaining)}this.updateCooldowns(t),this.updateVoidAbility(t),this.updateFartCloud(t),this.updateSpeedRush(t),this.updateIceSlows(t),this.checkDrops(),this.updateHotbar(),!this.playerDead&&!this.inventoryOpen&&(this.player.update(t),this.hud.updateStamina(this.player.stamina,this.player.maxStamina),this.weapon.update(t),this.processBoltHits(),this.player.mouseHeld&&this.weapon.currentWeapon==="minigun"&&this.handleShoot(),this.mode==="multiplayer"&&this.network&&this.network.connected&&e-this._lastPosSend>100&&(this._lastPosSend=e,this.network.sendPosition(this.player.getPosition(),{y:this.player.euler.y}))),this.updateBuffs(t),this.arena.updateDoors(this.player.getPosition());for(const n of this.pickups){if(n.collected)continue;const i=n.type==="medkit"?.6:n.type==="boost"?.5:n.type==="potion"?.55:.5;n.mesh.position.y=i+Math.sin(e*.003)*.15,n.mesh.rotation.y+=t*2}for(const n of this.chests)n.update(e);!this.playerDead&&!this.inventoryOpen&&(this.checkPickups(),this.checkChests(),this.checkBotSales());for(const n of this.targets)if(n.alive&&!n.dormant){const i=n.update(t,this.player.getPosition());if(i&&!this.playerDead){if(this.invincible)continue;if(this.applyPlayerDamage(i)){this.playerHealth=0,this.playerDead=!0,this.hud.updateHealth(0,this.playerMaxHealth);const o=n.config?n.config.name:"ANIMAL";this.hud.addKillEntry(o,this.playerName),this.hud.showMessage("VOCE MORREU!"),this.showDeathScreen()}}}if(this.boss&&this.boss.alive&&!this.playerDead){this.boss.update(t,this.player.getPosition());const n=this.boss.getHitDamage();n>0&&!this.invincible&&this.applyPlayerDamage(n)&&(this.playerHealth=0,this.playerDead=!0,this.killedByBoss=!0,this.hud.updateHealth(0,this.playerMaxHealth),this.hud.addKillEntry("GOVERNO FEDERAL",this.playerName),this.hud.showMessage("VOCE MORREU!"),this.showDeathScreen()),this.hud.updateBossHealth(this.boss.health,this.boss.maxHealth)}for(const n of this.bots){if(!n.alive)continue;const i=n.update(t,this.targets);i&&this.handleBotKill(n,i);for(const a of this.targets){if(!a.alive||a.dormant)continue;a.mesh.position.distanceTo(n.position)<a.attackRange&&n.takeDamage(a.attackDamage*t)}this.boss&&this.boss.alive&&this.boss.mesh.position.distanceTo(n.position)<4&&n.takeDamage(20*t)}if(this.mode==="multiplayer")for(const n of Object.keys(this.remotePlayers)){const i=this.remotePlayers[n];if(e-i.lastSeen>3e3){this.scene.remove(i.mesh),delete this.remotePlayers[n];continue}i.mesh.position.set(i.position.x,i.position.y-1.7,i.position.z),i.mesh.rotation.y=i.rotationY}this.renderer.render()}destroy(){var e,t;this._destroyed||(this._destroyed=!0,this.running=!1,this.player.unlock(),this.renderer.destroy(),this.hud.hide(),this._keyHandler&&(this._keyHandler=null),this.player&&((t=(e=this.player).destroy)==null||t.call(e),this.player=null),this.scene&&(this.scene.traverse(n=>{var i,a,o;(i=n.geometry)==null||i.dispose(),(a=n.material)==null||a.dispose(),(o=n.texture)==null||o.dispose()}),this.scene.clear()),this._animationId&&cancelAnimationFrame(this._animationId))}}class Ef{constructor(){this.ws=null,this.callbacks={},this.connected=!1,this.joined=!1,this.playerName="",this.color="#ffffff",this.lastChatTime=0,this._serverUrl=null,this._shouldReconnect=!0,this._reconnectTimer=null}connect(e){e&&this.setPlayerInfo(e);const t=this.playerName||"Jogador";if(this.playerName=t,this._reconnectTimer&&(clearTimeout(this._reconnectTimer),this._reconnectTimer=null),this._shouldReconnect=!0,!this._serverUrl){const n=location.protocol==="https:"?"wss:":"ws:";this._serverUrl=`${n}//${location.host}/ws`}this.ws=new WebSocket(this._serverUrl),this.ws.onopen=()=>{this.connected=!0,this.joined||(this.joined=!0,this.sendJoin(t))},this.ws.onmessage=n=>{const i=JSON.parse(n.data);switch(i.type){case"players":this.callbacks.playersUpdate&&this.callbacks.playersUpdate(i.players);break;case"gameStart":this.callbacks.gameStart&&this.callbacks.gameStart(i.data);break;case"stateUpdate":this.callbacks.stateUpdate&&this.callbacks.stateUpdate(i.state);break;case"kill":this.callbacks.kill&&this.callbacks.kill(i.data);break;case"chat":this.callbacks.chat&&this.callbacks.chat(i.data);break;case"testModeAck":this.callbacks.testModeAck&&this.callbacks.testModeAck(i);break}},this.ws.onclose=()=>{this.connected=!1,this.joined=!1,this._shouldReconnect&&(console.warn("[Network] Conexão perdida, tentando reconectar em 3s..."),this._reconnectTimer=setTimeout(()=>{this._reconnectTimer=null,this.connect()},3e3))}}disconnect(){this._shouldReconnect=!1,this._reconnectTimer&&(clearTimeout(this._reconnectTimer),this._reconnectTimer=null),this.ws&&(this.ws.onclose=null,this.ws.close(),this.ws=null),this.connected=!1,this.joined=!1}send(e,t){this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify({type:e,...t}))}sendJoin(e){this.send("join",{name:e})}sendPosition(e,t){this.send("position",{position:e,rotation:t})}sendKill(e){this.send("kill",{targetId:e})}sendChat(e){const t=String(e||"").trim().slice(0,150);return!t||Date.now()-this.lastChatTime<=2e3?!1:(this.lastChatTime=Date.now(),this.send("chat",{name:this.playerName,color:this.color,message:t}),!0)}setPlayerInfo(e,t){const n=String(e||"").trim();n&&(this.playerName=n),t&&(this.color=t)}onPlayersUpdate(e){this.callbacks.playersUpdate=e}onGameStart(e){this.callbacks.gameStart=e}onStateUpdate(e){this.callbacks.stateUpdate=e}onKill(e){this.callbacks.kill=e}onChat(e){this.callbacks.chat=e}onTestModeAck(e){this.callbacks.testModeAck=e}}const Nt=new Xc,Dt=new Ef;let mt=null;const js=["Bem-vindo ao CapiQuake! Use [W][A][S][D] para se mover e o MOUSE para atirar.","Aproxime-se de um baú e pressione [E] para pegar armas e munição.","Pressione [F] para usar a habilidade Void (se tiver).","Pressione [F3] para alternar a câmera.","Pressione [T] para soltar o peido!","Segure [CTRL] para mirar com a sniper.","Pressione [ESC] para abrir o inventário."];let Da=0,Ks=null;function oo(s){if(localStorage.getItem("capiquake_tutorial_done")){s&&s();return}Da=0,Ks=s;const e=document.getElementById("tutorial-text");e.textContent=js[0],document.getElementById("tutorial").style.display="flex"}function Lc(s){document.getElementById("tutorial").style.display="none",localStorage.setItem("capiquake_tutorial_done","1")}function kc(){const s=Ks;Ks=null,s&&s()}document.getElementById("btn-skip-tutorial").addEventListener("click",()=>{Lc(),kc()});document.getElementById("btn-tutorial-next").addEventListener("click",()=>{Da+=1,Da>=js.length?(Lc(),kc()):document.getElementById("tutorial-text").textContent=js[Da]});function Nc(s){mt=new Ti(s),mt.start(),window.__game=mt}Nt.onSingleplayer((s,e,t)=>{oo(()=>Nc({mode:"singleplayer",botCount:5,animalCount:300,playerName:s,map:e,shopPurchases:t}))});document.getElementById("btn-test-mode").addEventListener("click",()=>{const s=Nt.getPlayerName();Nt.hide(),oo(()=>Nc({mode:"test",botCount:5,animalCount:300,playerName:s,map:null}))});function Uc(){const s=document.getElementById("lobby-player-name");return(s?s.value.trim():"")||Nt.getPlayerName()}Nt.onMultiplayer(()=>{const s=Uc(),e=document.getElementById("lobby-player-name");e&&!e.value.trim()&&(e.value=s),Dt.setPlayerInfo(s),Nt.showLobby(),Dt.connect(s)});Nt.onStartGame(()=>{const s=Uc();Dt.setPlayerInfo(s),Dt.connected&&!Dt.joined&&(Dt.joined=!0,Dt.sendJoin(s)),Nt.showMapVote(e=>{Dt.send("startGame",{map:e,animalCount:20})})});Nt.onBackToMenu(()=>{Dt.disconnect(),Nt.hideLobby(),Nt.show()});Dt.onGameStart(s=>{Nt.hideLobby(),Nt.hideMapVote(),mt=new Ti({mode:"multiplayer",network:Dt,playerName:Dt.playerName,...s}),mt.start(),window.__game=mt});Dt.onPlayersUpdate(s=>{Nt.updatePlayersList(s)});Dt.onChat(s=>{mt&&typeof mt.addChatMessage=="function"&&mt.addChatMessage(s.name,s.color,s.message)});const Ln=document.getElementById("chat-input"),Kr=()=>{Ln.value="",Ln.style.display="none",Ln.blur()};Ln.addEventListener("keydown",s=>{s.stopPropagation(),s.key==="Enter"?(Dt.sendChat(Ln.value)&&(Ln.value=""),Kr()):s.key==="Escape"&&Kr()});document.addEventListener("keydown",s=>{if(s.key!=="/"||s.ctrlKey||s.metaKey||s.altKey||!mt||mt.mode!=="multiplayer"||!mt.running)return;const e=document.activeElement;e&&e.tagName==="INPUT"||(s.preventDefault(),Ln.style.display="block",Ln.focus())});const Va=document.getElementById("settings-screen");document.getElementById("btn-settings").addEventListener("click",()=>{Va.style.display=Va.style.display==="none"?"flex":"none"});document.getElementById("btn-settings-quit").addEventListener("click",()=>{Va.style.display="none"});document.getElementById("btn-pause").addEventListener("click",()=>{!mt||!mt.running||mt.mode!=="singleplayer"&&mt.mode!=="test"||mt.togglePause()});document.getElementById("btn-repeat-tutorial").addEventListener("click",()=>{localStorage.removeItem("capiquake_tutorial_done"),Va.style.display="none",oo(null)});document.getElementById("btn-reset-keys").addEventListener("click",()=>{const s={"key-move-forward":"W","key-move-back":"S","key-move-left":"A","key-move-right":"D","key-jump":" ","key-sprint":"SHIFT","key-pickup":"E","key-void":"F","key-camera":"F3","key-fart":"T","key-emotes":"B","key-sniper":"CTRL","key-inventory":"ESC","key-drop":"Z"};Object.keys(s).forEach(e=>{const t=document.getElementById(e);t&&(t.value=s[e])})});document.getElementById("btn-play-again").addEventListener("click",()=>{document.getElementById("celebration").style.display="none",mt&&mt.destroy(),mt=null,Nt.show()});
