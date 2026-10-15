var di=Object.defineProperty;var hi=(e,t,o)=>t in e?di(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var q=(e,t,o)=>hi(e,typeof t!="symbol"?t+"":t,o);import{c as ui}from"./characters-data-CiXwccP8.js";import{l as fi,r as pi,t as Ut}from"./geography-data-BeJgTstB.js";import{M as N,G as re,a as P,C as ee,B as Y,b as de,D as We,I as Qt,c as yi,d as se,R as Zt,W as gi,P as mi,A as wi,S as ki,F as et,e as xi,O as bi,H as vi,f as $i,g as Kt,V as Jt,h as U,i as Si,j as It,k as Ci,l as Mi,m as we,n as Ct,T as tt,o as eo,p as Te,L as Li,q as _i}from"./three-vendor-D56VFzTP.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();var Pt="http://www.w3.org/1999/xhtml";const to={svg:"http://www.w3.org/2000/svg",xhtml:Pt,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function kt(e){var t=e+="",o=t.indexOf(":");return o>=0&&(t=e.slice(0,o))!=="xmlns"&&(e=e.slice(o+1)),to.hasOwnProperty(t)?{space:to[t],local:e}:e}function Ei(e){return function(){var t=this.ownerDocument,o=this.namespaceURI;return o===Pt&&t.documentElement.namespaceURI===Pt?t.createElement(e):t.createElementNS(o,e)}}function Ii(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function Po(e){var t=kt(e);return(t.local?Ii:Ei)(t)}function Pi(){}function Bt(e){return e==null?Pi:function(){return this.querySelector(e)}}function Fi(e){typeof e!="function"&&(e=Bt(e));for(var t=this._groups,o=t.length,r=new Array(o),n=0;n<o;++n)for(var a=t[n],l=a.length,s=r[n]=new Array(l),i,d,c=0;c<l;++c)(i=a[c])&&(d=e.call(i,i.__data__,c,a))&&("__data__"in i&&(d.__data__=i.__data__),s[c]=d);return new he(r,this._parents)}function Ai(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function Ri(){return[]}function Fo(e){return e==null?Ri:function(){return this.querySelectorAll(e)}}function Ti(e){return function(){return Ai(e.apply(this,arguments))}}function Ni(e){typeof e=="function"?e=Ti(e):e=Fo(e);for(var t=this._groups,o=t.length,r=[],n=[],a=0;a<o;++a)for(var l=t[a],s=l.length,i,d=0;d<s;++d)(i=l[d])&&(r.push(e.call(i,i.__data__,d,l)),n.push(i));return new he(r,n)}function Ao(e){return function(){return this.matches(e)}}function Ro(e){return function(t){return t.matches(e)}}var Di=Array.prototype.find;function Gi(e){return function(){return Di.call(this.children,e)}}function Hi(){return this.firstElementChild}function zi(e){return this.select(e==null?Hi:Gi(typeof e=="function"?e:Ro(e)))}var qi=Array.prototype.filter;function Bi(){return Array.from(this.children)}function Oi(e){return function(){return qi.call(this.children,e)}}function Wi(e){return this.selectAll(e==null?Bi:Oi(typeof e=="function"?e:Ro(e)))}function Yi(e){typeof e!="function"&&(e=Ao(e));for(var t=this._groups,o=t.length,r=new Array(o),n=0;n<o;++n)for(var a=t[n],l=a.length,s=r[n]=[],i,d=0;d<l;++d)(i=a[d])&&e.call(i,i.__data__,d,a)&&s.push(i);return new he(r,this._parents)}function To(e){return new Array(e.length)}function ji(){return new he(this._enter||this._groups.map(To),this._parents)}function ht(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}ht.prototype={constructor:ht,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function Xi(e){return function(){return e}}function Vi(e,t,o,r,n,a){for(var l=0,s,i=t.length,d=a.length;l<d;++l)(s=t[l])?(s.__data__=a[l],r[l]=s):o[l]=new ht(e,a[l]);for(;l<i;++l)(s=t[l])&&(n[l]=s)}function Ui(e,t,o,r,n,a,l){var s,i,d=new Map,c=t.length,h=a.length,f=new Array(c),w;for(s=0;s<c;++s)(i=t[s])&&(f[s]=w=l.call(i,i.__data__,s,t)+"",d.has(w)?n[s]=i:d.set(w,i));for(s=0;s<h;++s)w=l.call(e,a[s],s,a)+"",(i=d.get(w))?(r[s]=i,i.__data__=a[s],d.delete(w)):o[s]=new ht(e,a[s]);for(s=0;s<c;++s)(i=t[s])&&d.get(f[s])===i&&(n[s]=i)}function Qi(e){return e.__data__}function Zi(e,t){if(!arguments.length)return Array.from(this,Qi);var o=t?Ui:Vi,r=this._parents,n=this._groups;typeof e!="function"&&(e=Xi(e));for(var a=n.length,l=new Array(a),s=new Array(a),i=new Array(a),d=0;d<a;++d){var c=r[d],h=n[d],f=h.length,w=Ki(e.call(c,c&&c.__data__,d,r)),b=w.length,g=s[d]=new Array(b),$=l[d]=new Array(b),p=i[d]=new Array(f);o(c,h,g,$,p,w,t);for(var S=0,y=0,u,x;S<b;++S)if(u=g[S]){for(S>=y&&(y=S+1);!(x=$[y])&&++y<b;);u._next=x||null}}return l=new he(l,r),l._enter=s,l._exit=i,l}function Ki(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function Ji(){return new he(this._exit||this._groups.map(To),this._parents)}function er(e,t,o){var r=this.enter(),n=this,a=this.exit();return typeof e=="function"?(r=e(r),r&&(r=r.selection())):r=r.append(e+""),t!=null&&(n=t(n),n&&(n=n.selection())),o==null?a.remove():o(a),r&&n?r.merge(n).order():n}function tr(e){for(var t=e.selection?e.selection():e,o=this._groups,r=t._groups,n=o.length,a=r.length,l=Math.min(n,a),s=new Array(n),i=0;i<l;++i)for(var d=o[i],c=r[i],h=d.length,f=s[i]=new Array(h),w,b=0;b<h;++b)(w=d[b]||c[b])&&(f[b]=w);for(;i<n;++i)s[i]=o[i];return new he(s,this._parents)}function or(){for(var e=this._groups,t=-1,o=e.length;++t<o;)for(var r=e[t],n=r.length-1,a=r[n],l;--n>=0;)(l=r[n])&&(a&&l.compareDocumentPosition(a)^4&&a.parentNode.insertBefore(l,a),a=l);return this}function ir(e){e||(e=rr);function t(h,f){return h&&f?e(h.__data__,f.__data__):!h-!f}for(var o=this._groups,r=o.length,n=new Array(r),a=0;a<r;++a){for(var l=o[a],s=l.length,i=n[a]=new Array(s),d,c=0;c<s;++c)(d=l[c])&&(i[c]=d);i.sort(t)}return new he(n,this._parents).order()}function rr(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function nr(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function sr(){return Array.from(this)}function ar(){for(var e=this._groups,t=0,o=e.length;t<o;++t)for(var r=e[t],n=0,a=r.length;n<a;++n){var l=r[n];if(l)return l}return null}function lr(){let e=0;for(const t of this)++e;return e}function cr(){return!this.node()}function dr(e){for(var t=this._groups,o=0,r=t.length;o<r;++o)for(var n=t[o],a=0,l=n.length,s;a<l;++a)(s=n[a])&&e.call(s,s.__data__,a,n);return this}function hr(e){return function(){this.removeAttribute(e)}}function ur(e){return function(){this.removeAttributeNS(e.space,e.local)}}function fr(e,t){return function(){this.setAttribute(e,t)}}function pr(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function yr(e,t){return function(){var o=t.apply(this,arguments);o==null?this.removeAttribute(e):this.setAttribute(e,o)}}function gr(e,t){return function(){var o=t.apply(this,arguments);o==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,o)}}function mr(e,t){var o=kt(e);if(arguments.length<2){var r=this.node();return o.local?r.getAttributeNS(o.space,o.local):r.getAttribute(o)}return this.each((t==null?o.local?ur:hr:typeof t=="function"?o.local?gr:yr:o.local?pr:fr)(o,t))}function No(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function wr(e){return function(){this.style.removeProperty(e)}}function kr(e,t,o){return function(){this.style.setProperty(e,t,o)}}function xr(e,t,o){return function(){var r=t.apply(this,arguments);r==null?this.style.removeProperty(e):this.style.setProperty(e,r,o)}}function br(e,t,o){return arguments.length>1?this.each((t==null?wr:typeof t=="function"?xr:kr)(e,t,o??"")):Pe(this.node(),e)}function Pe(e,t){return e.style.getPropertyValue(t)||No(e).getComputedStyle(e,null).getPropertyValue(t)}function vr(e){return function(){delete this[e]}}function $r(e,t){return function(){this[e]=t}}function Sr(e,t){return function(){var o=t.apply(this,arguments);o==null?delete this[e]:this[e]=o}}function Cr(e,t){return arguments.length>1?this.each((t==null?vr:typeof t=="function"?Sr:$r)(e,t)):this.node()[e]}function Do(e){return e.trim().split(/^|\s+/)}function Ot(e){return e.classList||new Go(e)}function Go(e){this._node=e,this._names=Do(e.getAttribute("class")||"")}Go.prototype={add:function(e){var t=this._names.indexOf(e);t<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var t=this._names.indexOf(e);t>=0&&(this._names.splice(t,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function Ho(e,t){for(var o=Ot(e),r=-1,n=t.length;++r<n;)o.add(t[r])}function zo(e,t){for(var o=Ot(e),r=-1,n=t.length;++r<n;)o.remove(t[r])}function Mr(e){return function(){Ho(this,e)}}function Lr(e){return function(){zo(this,e)}}function _r(e,t){return function(){(t.apply(this,arguments)?Ho:zo)(this,e)}}function Er(e,t){var o=Do(e+"");if(arguments.length<2){for(var r=Ot(this.node()),n=-1,a=o.length;++n<a;)if(!r.contains(o[n]))return!1;return!0}return this.each((typeof t=="function"?_r:t?Mr:Lr)(o,t))}function Ir(){this.textContent=""}function Pr(e){return function(){this.textContent=e}}function Fr(e){return function(){var t=e.apply(this,arguments);this.textContent=t??""}}function Ar(e){return arguments.length?this.each(e==null?Ir:(typeof e=="function"?Fr:Pr)(e)):this.node().textContent}function Rr(){this.innerHTML=""}function Tr(e){return function(){this.innerHTML=e}}function Nr(e){return function(){var t=e.apply(this,arguments);this.innerHTML=t??""}}function Dr(e){return arguments.length?this.each(e==null?Rr:(typeof e=="function"?Nr:Tr)(e)):this.node().innerHTML}function Gr(){this.nextSibling&&this.parentNode.appendChild(this)}function Hr(){return this.each(Gr)}function zr(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function qr(){return this.each(zr)}function Br(e){var t=typeof e=="function"?e:Po(e);return this.select(function(){return this.appendChild(t.apply(this,arguments))})}function Or(){return null}function Wr(e,t){var o=typeof e=="function"?e:Po(e),r=t==null?Or:typeof t=="function"?t:Bt(t);return this.select(function(){return this.insertBefore(o.apply(this,arguments),r.apply(this,arguments)||null)})}function Yr(){var e=this.parentNode;e&&e.removeChild(this)}function jr(){return this.each(Yr)}function Xr(){var e=this.cloneNode(!1),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function Vr(){var e=this.cloneNode(!0),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function Ur(e){return this.select(e?Vr:Xr)}function Qr(e){return arguments.length?this.property("__data__",e):this.node().__data__}function Zr(e){return function(t){e.call(this,t,this.__data__)}}function Kr(e){return e.trim().split(/^|\s+/).map(function(t){var o="",r=t.indexOf(".");return r>=0&&(o=t.slice(r+1),t=t.slice(0,r)),{type:t,name:o}})}function Jr(e){return function(){var t=this.__on;if(t){for(var o=0,r=-1,n=t.length,a;o<n;++o)a=t[o],(!e.type||a.type===e.type)&&a.name===e.name?this.removeEventListener(a.type,a.listener,a.options):t[++r]=a;++r?t.length=r:delete this.__on}}}function en(e,t,o){return function(){var r=this.__on,n,a=Zr(t);if(r){for(var l=0,s=r.length;l<s;++l)if((n=r[l]).type===e.type&&n.name===e.name){this.removeEventListener(n.type,n.listener,n.options),this.addEventListener(n.type,n.listener=a,n.options=o),n.value=t;return}}this.addEventListener(e.type,a,o),n={type:e.type,name:e.name,value:t,listener:a,options:o},r?r.push(n):this.__on=[n]}}function tn(e,t,o){var r=Kr(e+""),n,a=r.length,l;if(arguments.length<2){var s=this.node().__on;if(s){for(var i=0,d=s.length,c;i<d;++i)for(n=0,c=s[i];n<a;++n)if((l=r[n]).type===c.type&&l.name===c.name)return c.value}return}for(s=t?en:Jr,n=0;n<a;++n)this.each(s(r[n],t,o));return this}function qo(e,t,o){var r=No(e),n=r.CustomEvent;typeof n=="function"?n=new n(t,o):(n=r.document.createEvent("Event"),o?(n.initEvent(t,o.bubbles,o.cancelable),n.detail=o.detail):n.initEvent(t,!1,!1)),e.dispatchEvent(n)}function on(e,t){return function(){return qo(this,e,t)}}function rn(e,t){return function(){return qo(this,e,t.apply(this,arguments))}}function nn(e,t){return this.each((typeof t=="function"?rn:on)(e,t))}function*sn(){for(var e=this._groups,t=0,o=e.length;t<o;++t)for(var r=e[t],n=0,a=r.length,l;n<a;++n)(l=r[n])&&(yield l)}var Bo=[null];function he(e,t){this._groups=e,this._parents=t}function Ze(){return new he([[document.documentElement]],Bo)}function an(){return this}he.prototype=Ze.prototype={constructor:he,select:Fi,selectAll:Ni,selectChild:zi,selectChildren:Wi,filter:Yi,data:Zi,enter:ji,exit:Ji,join:er,merge:tr,selection:an,order:or,sort:ir,call:nr,nodes:sr,node:ar,size:lr,empty:cr,each:dr,attr:mr,style:br,property:Cr,classed:Er,text:Ar,html:Dr,raise:Hr,lower:qr,append:Br,insert:Wr,remove:jr,clone:Ur,datum:Qr,on:tn,dispatch:nn,[Symbol.iterator]:sn};function fe(e){return typeof e=="string"?new he([[document.querySelector(e)]],[document.documentElement]):new he([[e]],Bo)}function ln(e){let t;for(;t=e.sourceEvent;)e=t;return e}function Me(e,t){if(e=ln(e),t===void 0&&(t=e.currentTarget),t){var o=t.ownerSVGElement||t;if(o.createSVGPoint){var r=o.createSVGPoint();return r.x=e.clientX,r.y=e.clientY,r=r.matrixTransform(t.getScreenCTM().inverse()),[r.x,r.y]}if(t.getBoundingClientRect){var n=t.getBoundingClientRect();return[e.clientX-n.left-t.clientLeft,e.clientY-n.top-t.clientTop]}}return[e.pageX,e.pageY]}var cn={value:()=>{}};function Wt(){for(var e=0,t=arguments.length,o={},r;e<t;++e){if(!(r=arguments[e]+"")||r in o||/[\s.]/.test(r))throw new Error("illegal type: "+r);o[r]=[]}return new st(o)}function st(e){this._=e}function dn(e,t){return e.trim().split(/^|\s+/).map(function(o){var r="",n=o.indexOf(".");if(n>=0&&(r=o.slice(n+1),o=o.slice(0,n)),o&&!t.hasOwnProperty(o))throw new Error("unknown type: "+o);return{type:o,name:r}})}st.prototype=Wt.prototype={constructor:st,on:function(e,t){var o=this._,r=dn(e+"",o),n,a=-1,l=r.length;if(arguments.length<2){for(;++a<l;)if((n=(e=r[a]).type)&&(n=hn(o[n],e.name)))return n;return}if(t!=null&&typeof t!="function")throw new Error("invalid callback: "+t);for(;++a<l;)if(n=(e=r[a]).type)o[n]=oo(o[n],e.name,t);else if(t==null)for(n in o)o[n]=oo(o[n],e.name,null);return this},copy:function(){var e={},t=this._;for(var o in t)e[o]=t[o].slice();return new st(e)},call:function(e,t){if((n=arguments.length-2)>0)for(var o=new Array(n),r=0,n,a;r<n;++r)o[r]=arguments[r+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(a=this._[e],r=0,n=a.length;r<n;++r)a[r].value.apply(t,o)},apply:function(e,t,o){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var r=this._[e],n=0,a=r.length;n<a;++n)r[n].value.apply(t,o)}};function hn(e,t){for(var o=0,r=e.length,n;o<r;++o)if((n=e[o]).name===t)return n.value}function oo(e,t,o){for(var r=0,n=e.length;r<n;++r)if(e[r].name===t){e[r]=cn,e=e.slice(0,r).concat(e.slice(r+1));break}return o!=null&&e.push({name:t,value:o}),e}const Ft={capture:!0,passive:!1};function At(e){e.preventDefault(),e.stopImmediatePropagation()}function un(e){var t=e.document.documentElement,o=fe(e).on("dragstart.drag",At,Ft);"onselectstart"in t?o.on("selectstart.drag",At,Ft):(t.__noselect=t.style.MozUserSelect,t.style.MozUserSelect="none")}function fn(e,t){var o=e.document.documentElement,r=fe(e).on("dragstart.drag",null);t&&(r.on("click.drag",At,Ft),setTimeout(function(){r.on("click.drag",null)},0)),"onselectstart"in o?r.on("selectstart.drag",null):(o.style.MozUserSelect=o.__noselect,delete o.__noselect)}function Yt(e,t,o){e.prototype=t.prototype=o,o.constructor=e}function Oo(e,t){var o=Object.create(e.prototype);for(var r in t)o[r]=t[r];return o}function Ke(){}var Ye=.7,ut=1/Ye,Ie="\\s*([+-]?\\d+)\\s*",je="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",ge="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",pn=/^#([0-9a-f]{3,8})$/,yn=new RegExp(`^rgb\\(${Ie},${Ie},${Ie}\\)$`),gn=new RegExp(`^rgb\\(${ge},${ge},${ge}\\)$`),mn=new RegExp(`^rgba\\(${Ie},${Ie},${Ie},${je}\\)$`),wn=new RegExp(`^rgba\\(${ge},${ge},${ge},${je}\\)$`),kn=new RegExp(`^hsl\\(${je},${ge},${ge}\\)$`),xn=new RegExp(`^hsla\\(${je},${ge},${ge},${je}\\)$`),io={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Yt(Ke,Xe,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:ro,formatHex:ro,formatHex8:bn,formatHsl:vn,formatRgb:no,toString:no});function ro(){return this.rgb().formatHex()}function bn(){return this.rgb().formatHex8()}function vn(){return Wo(this).formatHsl()}function no(){return this.rgb().formatRgb()}function Xe(e){var t,o;return e=(e+"").trim().toLowerCase(),(t=pn.exec(e))?(o=t[1].length,t=parseInt(t[1],16),o===6?so(t):o===3?new ce(t>>8&15|t>>4&240,t>>4&15|t&240,(t&15)<<4|t&15,1):o===8?ot(t>>24&255,t>>16&255,t>>8&255,(t&255)/255):o===4?ot(t>>12&15|t>>8&240,t>>8&15|t>>4&240,t>>4&15|t&240,((t&15)<<4|t&15)/255):null):(t=yn.exec(e))?new ce(t[1],t[2],t[3],1):(t=gn.exec(e))?new ce(t[1]*255/100,t[2]*255/100,t[3]*255/100,1):(t=mn.exec(e))?ot(t[1],t[2],t[3],t[4]):(t=wn.exec(e))?ot(t[1]*255/100,t[2]*255/100,t[3]*255/100,t[4]):(t=kn.exec(e))?co(t[1],t[2]/100,t[3]/100,1):(t=xn.exec(e))?co(t[1],t[2]/100,t[3]/100,t[4]):io.hasOwnProperty(e)?so(io[e]):e==="transparent"?new ce(NaN,NaN,NaN,0):null}function so(e){return new ce(e>>16&255,e>>8&255,e&255,1)}function ot(e,t,o,r){return r<=0&&(e=t=o=NaN),new ce(e,t,o,r)}function $n(e){return e instanceof Ke||(e=Xe(e)),e?(e=e.rgb(),new ce(e.r,e.g,e.b,e.opacity)):new ce}function Rt(e,t,o,r){return arguments.length===1?$n(e):new ce(e,t,o,r??1)}function ce(e,t,o,r){this.r=+e,this.g=+t,this.b=+o,this.opacity=+r}Yt(ce,Rt,Oo(Ke,{brighter(e){return e=e==null?ut:Math.pow(ut,e),new ce(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?Ye:Math.pow(Ye,e),new ce(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new ce(_e(this.r),_e(this.g),_e(this.b),ft(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:ao,formatHex:ao,formatHex8:Sn,formatRgb:lo,toString:lo}));function ao(){return`#${Le(this.r)}${Le(this.g)}${Le(this.b)}`}function Sn(){return`#${Le(this.r)}${Le(this.g)}${Le(this.b)}${Le((isNaN(this.opacity)?1:this.opacity)*255)}`}function lo(){const e=ft(this.opacity);return`${e===1?"rgb(":"rgba("}${_e(this.r)}, ${_e(this.g)}, ${_e(this.b)}${e===1?")":`, ${e})`}`}function ft(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function _e(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function Le(e){return e=_e(e),(e<16?"0":"")+e.toString(16)}function co(e,t,o,r){return r<=0?e=t=o=NaN:o<=0||o>=1?e=t=NaN:t<=0&&(e=NaN),new pe(e,t,o,r)}function Wo(e){if(e instanceof pe)return new pe(e.h,e.s,e.l,e.opacity);if(e instanceof Ke||(e=Xe(e)),!e)return new pe;if(e instanceof pe)return e;e=e.rgb();var t=e.r/255,o=e.g/255,r=e.b/255,n=Math.min(t,o,r),a=Math.max(t,o,r),l=NaN,s=a-n,i=(a+n)/2;return s?(t===a?l=(o-r)/s+(o<r)*6:o===a?l=(r-t)/s+2:l=(t-o)/s+4,s/=i<.5?a+n:2-a-n,l*=60):s=i>0&&i<1?0:l,new pe(l,s,i,e.opacity)}function Cn(e,t,o,r){return arguments.length===1?Wo(e):new pe(e,t,o,r??1)}function pe(e,t,o,r){this.h=+e,this.s=+t,this.l=+o,this.opacity=+r}Yt(pe,Cn,Oo(Ke,{brighter(e){return e=e==null?ut:Math.pow(ut,e),new pe(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?Ye:Math.pow(Ye,e),new pe(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,t=isNaN(e)||isNaN(this.s)?0:this.s,o=this.l,r=o+(o<.5?o:1-o)*t,n=2*o-r;return new ce(Mt(e>=240?e-240:e+120,n,r),Mt(e,n,r),Mt(e<120?e+240:e-120,n,r),this.opacity)},clamp(){return new pe(ho(this.h),it(this.s),it(this.l),ft(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=ft(this.opacity);return`${e===1?"hsl(":"hsla("}${ho(this.h)}, ${it(this.s)*100}%, ${it(this.l)*100}%${e===1?")":`, ${e})`}`}}));function ho(e){return e=(e||0)%360,e<0?e+360:e}function it(e){return Math.max(0,Math.min(1,e||0))}function Mt(e,t,o){return(e<60?t+(o-t)*e/60:e<180?o:e<240?t+(o-t)*(240-e)/60:t)*255}const Yo=e=>()=>e;function Mn(e,t){return function(o){return e+o*t}}function Ln(e,t,o){return e=Math.pow(e,o),t=Math.pow(t,o)-e,o=1/o,function(r){return Math.pow(e+r*t,o)}}function _n(e){return(e=+e)==1?jo:function(t,o){return o-t?Ln(t,o,e):Yo(isNaN(t)?o:t)}}function jo(e,t){var o=t-e;return o?Mn(e,o):Yo(isNaN(e)?t:e)}const uo=function e(t){var o=_n(t);function r(n,a){var l=o((n=Rt(n)).r,(a=Rt(a)).r),s=o(n.g,a.g),i=o(n.b,a.b),d=jo(n.opacity,a.opacity);return function(c){return n.r=l(c),n.g=s(c),n.b=i(c),n.opacity=d(c),n+""}}return r.gamma=e,r}(1);function ve(e,t){return e=+e,t=+t,function(o){return e*(1-o)+t*o}}var Tt=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Lt=new RegExp(Tt.source,"g");function En(e){return function(){return e}}function In(e){return function(t){return e(t)+""}}function Pn(e,t){var o=Tt.lastIndex=Lt.lastIndex=0,r,n,a,l=-1,s=[],i=[];for(e=e+"",t=t+"";(r=Tt.exec(e))&&(n=Lt.exec(t));)(a=n.index)>o&&(a=t.slice(o,a),s[l]?s[l]+=a:s[++l]=a),(r=r[0])===(n=n[0])?s[l]?s[l]+=n:s[++l]=n:(s[++l]=null,i.push({i:l,x:ve(r,n)})),o=Lt.lastIndex;return o<t.length&&(a=t.slice(o),s[l]?s[l]+=a:s[++l]=a),s.length<2?i[0]?In(i[0].x):En(t):(t=i.length,function(d){for(var c=0,h;c<t;++c)s[(h=i[c]).i]=h.x(d);return s.join("")})}var fo=180/Math.PI,Nt={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function Xo(e,t,o,r,n,a){var l,s,i;return(l=Math.sqrt(e*e+t*t))&&(e/=l,t/=l),(i=e*o+t*r)&&(o-=e*i,r-=t*i),(s=Math.sqrt(o*o+r*r))&&(o/=s,r/=s,i/=s),e*r<t*o&&(e=-e,t=-t,i=-i,l=-l),{translateX:n,translateY:a,rotate:Math.atan2(t,e)*fo,skewX:Math.atan(i)*fo,scaleX:l,scaleY:s}}var rt;function Fn(e){const t=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return t.isIdentity?Nt:Xo(t.a,t.b,t.c,t.d,t.e,t.f)}function An(e){return e==null||(rt||(rt=document.createElementNS("http://www.w3.org/2000/svg","g")),rt.setAttribute("transform",e),!(e=rt.transform.baseVal.consolidate()))?Nt:(e=e.matrix,Xo(e.a,e.b,e.c,e.d,e.e,e.f))}function Vo(e,t,o,r){function n(d){return d.length?d.pop()+" ":""}function a(d,c,h,f,w,b){if(d!==h||c!==f){var g=w.push("translate(",null,t,null,o);b.push({i:g-4,x:ve(d,h)},{i:g-2,x:ve(c,f)})}else(h||f)&&w.push("translate("+h+t+f+o)}function l(d,c,h,f){d!==c?(d-c>180?c+=360:c-d>180&&(d+=360),f.push({i:h.push(n(h)+"rotate(",null,r)-2,x:ve(d,c)})):c&&h.push(n(h)+"rotate("+c+r)}function s(d,c,h,f){d!==c?f.push({i:h.push(n(h)+"skewX(",null,r)-2,x:ve(d,c)}):c&&h.push(n(h)+"skewX("+c+r)}function i(d,c,h,f,w,b){if(d!==h||c!==f){var g=w.push(n(w)+"scale(",null,",",null,")");b.push({i:g-4,x:ve(d,h)},{i:g-2,x:ve(c,f)})}else(h!==1||f!==1)&&w.push(n(w)+"scale("+h+","+f+")")}return function(d,c){var h=[],f=[];return d=e(d),c=e(c),a(d.translateX,d.translateY,c.translateX,c.translateY,h,f),l(d.rotate,c.rotate,h,f),s(d.skewX,c.skewX,h,f),i(d.scaleX,d.scaleY,c.scaleX,c.scaleY,h,f),d=c=null,function(w){for(var b=-1,g=f.length,$;++b<g;)h[($=f[b]).i]=$.x(w);return h.join("")}}}var Rn=Vo(Fn,"px, ","px)","deg)"),Tn=Vo(An,", ",")",")"),Nn=1e-12;function po(e){return((e=Math.exp(e))+1/e)/2}function Dn(e){return((e=Math.exp(e))-1/e)/2}function Gn(e){return((e=Math.exp(2*e))-1)/(e+1)}const Hn=function e(t,o,r){function n(a,l){var s=a[0],i=a[1],d=a[2],c=l[0],h=l[1],f=l[2],w=c-s,b=h-i,g=w*w+b*b,$,p;if(g<Nn)p=Math.log(f/d)/t,$=function(k){return[s+k*w,i+k*b,d*Math.exp(t*k*p)]};else{var S=Math.sqrt(g),y=(f*f-d*d+r*g)/(2*d*o*S),u=(f*f-d*d-r*g)/(2*f*o*S),x=Math.log(Math.sqrt(y*y+1)-y),m=Math.log(Math.sqrt(u*u+1)-u);p=(m-x)/t,$=function(k){var I=k*p,L=po(x),E=d/(o*S)*(L*Gn(t*I+x)-Dn(x));return[s+E*w,i+E*b,d*L/po(t*I+x)]}}return $.duration=p*1e3*t/Math.SQRT2,$}return n.rho=function(a){var l=Math.max(.001,+a),s=l*l,i=s*s;return e(l,s,i)},n}(Math.SQRT2,2,4);var Fe=0,He=0,Ne=0,Uo=1e3,pt,ze,yt=0,Ee=0,xt=0,Ve=typeof performance=="object"&&performance.now?performance:Date,Qo=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function jt(){return Ee||(Qo(zn),Ee=Ve.now()+xt)}function zn(){Ee=0}function gt(){this._call=this._time=this._next=null}gt.prototype=Zo.prototype={constructor:gt,restart:function(e,t,o){if(typeof e!="function")throw new TypeError("callback is not a function");o=(o==null?jt():+o)+(t==null?0:+t),!this._next&&ze!==this&&(ze?ze._next=this:pt=this,ze=this),this._call=e,this._time=o,Dt()},stop:function(){this._call&&(this._call=null,this._time=1/0,Dt())}};function Zo(e,t,o){var r=new gt;return r.restart(e,t,o),r}function qn(){jt(),++Fe;for(var e=pt,t;e;)(t=Ee-e._time)>=0&&e._call.call(void 0,t),e=e._next;--Fe}function yo(){Ee=(yt=Ve.now())+xt,Fe=He=0;try{qn()}finally{Fe=0,On(),Ee=0}}function Bn(){var e=Ve.now(),t=e-yt;t>Uo&&(xt-=t,yt=e)}function On(){for(var e,t=pt,o,r=1/0;t;)t._call?(r>t._time&&(r=t._time),e=t,t=t._next):(o=t._next,t._next=null,t=e?e._next=o:pt=o);ze=e,Dt(r)}function Dt(e){if(!Fe){He&&(He=clearTimeout(He));var t=e-Ee;t>24?(e<1/0&&(He=setTimeout(yo,e-Ve.now()-xt)),Ne&&(Ne=clearInterval(Ne))):(Ne||(yt=Ve.now(),Ne=setInterval(Bn,Uo)),Fe=1,Qo(yo))}}function go(e,t,o){var r=new gt;return t=t==null?0:+t,r.restart(n=>{r.stop(),e(n+t)},t,o),r}var Wn=Wt("start","end","cancel","interrupt"),Yn=[],Ko=0,mo=1,Gt=2,at=3,wo=4,Ht=5,lt=6;function bt(e,t,o,r,n,a){var l=e.__transition;if(!l)e.__transition={};else if(o in l)return;jn(e,o,{name:t,index:r,group:n,on:Wn,tween:Yn,time:a.time,delay:a.delay,duration:a.duration,ease:a.ease,timer:null,state:Ko})}function Xt(e,t){var o=ye(e,t);if(o.state>Ko)throw new Error("too late; already scheduled");return o}function me(e,t){var o=ye(e,t);if(o.state>at)throw new Error("too late; already running");return o}function ye(e,t){var o=e.__transition;if(!o||!(o=o[t]))throw new Error("transition not found");return o}function jn(e,t,o){var r=e.__transition,n;r[t]=o,o.timer=Zo(a,0,o.time);function a(d){o.state=mo,o.timer.restart(l,o.delay,o.time),o.delay<=d&&l(d-o.delay)}function l(d){var c,h,f,w;if(o.state!==mo)return i();for(c in r)if(w=r[c],w.name===o.name){if(w.state===at)return go(l);w.state===wo?(w.state=lt,w.timer.stop(),w.on.call("interrupt",e,e.__data__,w.index,w.group),delete r[c]):+c<t&&(w.state=lt,w.timer.stop(),w.on.call("cancel",e,e.__data__,w.index,w.group),delete r[c])}if(go(function(){o.state===at&&(o.state=wo,o.timer.restart(s,o.delay,o.time),s(d))}),o.state=Gt,o.on.call("start",e,e.__data__,o.index,o.group),o.state===Gt){for(o.state=at,n=new Array(f=o.tween.length),c=0,h=-1;c<f;++c)(w=o.tween[c].value.call(e,e.__data__,o.index,o.group))&&(n[++h]=w);n.length=h+1}}function s(d){for(var c=d<o.duration?o.ease.call(null,d/o.duration):(o.timer.restart(i),o.state=Ht,1),h=-1,f=n.length;++h<f;)n[h].call(e,c);o.state===Ht&&(o.on.call("end",e,e.__data__,o.index,o.group),i())}function i(){o.state=lt,o.timer.stop(),delete r[t];for(var d in r)return;delete e.__transition}}function ct(e,t){var o=e.__transition,r,n,a=!0,l;if(o){t=t==null?null:t+"";for(l in o){if((r=o[l]).name!==t){a=!1;continue}n=r.state>Gt&&r.state<Ht,r.state=lt,r.timer.stop(),r.on.call(n?"interrupt":"cancel",e,e.__data__,r.index,r.group),delete o[l]}a&&delete e.__transition}}function Xn(e){return this.each(function(){ct(this,e)})}function Vn(e,t){var o,r;return function(){var n=me(this,e),a=n.tween;if(a!==o){r=o=a;for(var l=0,s=r.length;l<s;++l)if(r[l].name===t){r=r.slice(),r.splice(l,1);break}}n.tween=r}}function Un(e,t,o){var r,n;if(typeof o!="function")throw new Error;return function(){var a=me(this,e),l=a.tween;if(l!==r){n=(r=l).slice();for(var s={name:t,value:o},i=0,d=n.length;i<d;++i)if(n[i].name===t){n[i]=s;break}i===d&&n.push(s)}a.tween=n}}function Qn(e,t){var o=this._id;if(e+="",arguments.length<2){for(var r=ye(this.node(),o).tween,n=0,a=r.length,l;n<a;++n)if((l=r[n]).name===e)return l.value;return null}return this.each((t==null?Vn:Un)(o,e,t))}function Vt(e,t,o){var r=e._id;return e.each(function(){var n=me(this,r);(n.value||(n.value={}))[t]=o.apply(this,arguments)}),function(n){return ye(n,r).value[t]}}function Jo(e,t){var o;return(typeof t=="number"?ve:t instanceof Xe?uo:(o=Xe(t))?(t=o,uo):Pn)(e,t)}function Zn(e){return function(){this.removeAttribute(e)}}function Kn(e){return function(){this.removeAttributeNS(e.space,e.local)}}function Jn(e,t,o){var r,n=o+"",a;return function(){var l=this.getAttribute(e);return l===n?null:l===r?a:a=t(r=l,o)}}function es(e,t,o){var r,n=o+"",a;return function(){var l=this.getAttributeNS(e.space,e.local);return l===n?null:l===r?a:a=t(r=l,o)}}function ts(e,t,o){var r,n,a;return function(){var l,s=o(this),i;return s==null?void this.removeAttribute(e):(l=this.getAttribute(e),i=s+"",l===i?null:l===r&&i===n?a:(n=i,a=t(r=l,s)))}}function os(e,t,o){var r,n,a;return function(){var l,s=o(this),i;return s==null?void this.removeAttributeNS(e.space,e.local):(l=this.getAttributeNS(e.space,e.local),i=s+"",l===i?null:l===r&&i===n?a:(n=i,a=t(r=l,s)))}}function is(e,t){var o=kt(e),r=o==="transform"?Tn:Jo;return this.attrTween(e,typeof t=="function"?(o.local?os:ts)(o,r,Vt(this,"attr."+e,t)):t==null?(o.local?Kn:Zn)(o):(o.local?es:Jn)(o,r,t))}function rs(e,t){return function(o){this.setAttribute(e,t.call(this,o))}}function ns(e,t){return function(o){this.setAttributeNS(e.space,e.local,t.call(this,o))}}function ss(e,t){var o,r;function n(){var a=t.apply(this,arguments);return a!==r&&(o=(r=a)&&ns(e,a)),o}return n._value=t,n}function as(e,t){var o,r;function n(){var a=t.apply(this,arguments);return a!==r&&(o=(r=a)&&rs(e,a)),o}return n._value=t,n}function ls(e,t){var o="attr."+e;if(arguments.length<2)return(o=this.tween(o))&&o._value;if(t==null)return this.tween(o,null);if(typeof t!="function")throw new Error;var r=kt(e);return this.tween(o,(r.local?ss:as)(r,t))}function cs(e,t){return function(){Xt(this,e).delay=+t.apply(this,arguments)}}function ds(e,t){return t=+t,function(){Xt(this,e).delay=t}}function hs(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?cs:ds)(t,e)):ye(this.node(),t).delay}function us(e,t){return function(){me(this,e).duration=+t.apply(this,arguments)}}function fs(e,t){return t=+t,function(){me(this,e).duration=t}}function ps(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?us:fs)(t,e)):ye(this.node(),t).duration}function ys(e,t){if(typeof t!="function")throw new Error;return function(){me(this,e).ease=t}}function gs(e){var t=this._id;return arguments.length?this.each(ys(t,e)):ye(this.node(),t).ease}function ms(e,t){return function(){var o=t.apply(this,arguments);if(typeof o!="function")throw new Error;me(this,e).ease=o}}function ws(e){if(typeof e!="function")throw new Error;return this.each(ms(this._id,e))}function ks(e){typeof e!="function"&&(e=Ao(e));for(var t=this._groups,o=t.length,r=new Array(o),n=0;n<o;++n)for(var a=t[n],l=a.length,s=r[n]=[],i,d=0;d<l;++d)(i=a[d])&&e.call(i,i.__data__,d,a)&&s.push(i);return new be(r,this._parents,this._name,this._id)}function xs(e){if(e._id!==this._id)throw new Error;for(var t=this._groups,o=e._groups,r=t.length,n=o.length,a=Math.min(r,n),l=new Array(r),s=0;s<a;++s)for(var i=t[s],d=o[s],c=i.length,h=l[s]=new Array(c),f,w=0;w<c;++w)(f=i[w]||d[w])&&(h[w]=f);for(;s<r;++s)l[s]=t[s];return new be(l,this._parents,this._name,this._id)}function bs(e){return(e+"").trim().split(/^|\s+/).every(function(t){var o=t.indexOf(".");return o>=0&&(t=t.slice(0,o)),!t||t==="start"})}function vs(e,t,o){var r,n,a=bs(t)?Xt:me;return function(){var l=a(this,e),s=l.on;s!==r&&(n=(r=s).copy()).on(t,o),l.on=n}}function $s(e,t){var o=this._id;return arguments.length<2?ye(this.node(),o).on.on(e):this.each(vs(o,e,t))}function Ss(e){return function(){var t=this.parentNode;for(var o in this.__transition)if(+o!==e)return;t&&t.removeChild(this)}}function Cs(){return this.on("end.remove",Ss(this._id))}function Ms(e){var t=this._name,o=this._id;typeof e!="function"&&(e=Bt(e));for(var r=this._groups,n=r.length,a=new Array(n),l=0;l<n;++l)for(var s=r[l],i=s.length,d=a[l]=new Array(i),c,h,f=0;f<i;++f)(c=s[f])&&(h=e.call(c,c.__data__,f,s))&&("__data__"in c&&(h.__data__=c.__data__),d[f]=h,bt(d[f],t,o,f,d,ye(c,o)));return new be(a,this._parents,t,o)}function Ls(e){var t=this._name,o=this._id;typeof e!="function"&&(e=Fo(e));for(var r=this._groups,n=r.length,a=[],l=[],s=0;s<n;++s)for(var i=r[s],d=i.length,c,h=0;h<d;++h)if(c=i[h]){for(var f=e.call(c,c.__data__,h,i),w,b=ye(c,o),g=0,$=f.length;g<$;++g)(w=f[g])&&bt(w,t,o,g,f,b);a.push(f),l.push(c)}return new be(a,l,t,o)}var _s=Ze.prototype.constructor;function Es(){return new _s(this._groups,this._parents)}function Is(e,t){var o,r,n;return function(){var a=Pe(this,e),l=(this.style.removeProperty(e),Pe(this,e));return a===l?null:a===o&&l===r?n:n=t(o=a,r=l)}}function ei(e){return function(){this.style.removeProperty(e)}}function Ps(e,t,o){var r,n=o+"",a;return function(){var l=Pe(this,e);return l===n?null:l===r?a:a=t(r=l,o)}}function Fs(e,t,o){var r,n,a;return function(){var l=Pe(this,e),s=o(this),i=s+"";return s==null&&(i=s=(this.style.removeProperty(e),Pe(this,e))),l===i?null:l===r&&i===n?a:(n=i,a=t(r=l,s))}}function As(e,t){var o,r,n,a="style."+t,l="end."+a,s;return function(){var i=me(this,e),d=i.on,c=i.value[a]==null?s||(s=ei(t)):void 0;(d!==o||n!==c)&&(r=(o=d).copy()).on(l,n=c),i.on=r}}function Rs(e,t,o){var r=(e+="")=="transform"?Rn:Jo;return t==null?this.styleTween(e,Is(e,r)).on("end.style."+e,ei(e)):typeof t=="function"?this.styleTween(e,Fs(e,r,Vt(this,"style."+e,t))).each(As(this._id,e)):this.styleTween(e,Ps(e,r,t),o).on("end.style."+e,null)}function Ts(e,t,o){return function(r){this.style.setProperty(e,t.call(this,r),o)}}function Ns(e,t,o){var r,n;function a(){var l=t.apply(this,arguments);return l!==n&&(r=(n=l)&&Ts(e,l,o)),r}return a._value=t,a}function Ds(e,t,o){var r="style."+(e+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(t==null)return this.tween(r,null);if(typeof t!="function")throw new Error;return this.tween(r,Ns(e,t,o??""))}function Gs(e){return function(){this.textContent=e}}function Hs(e){return function(){var t=e(this);this.textContent=t??""}}function zs(e){return this.tween("text",typeof e=="function"?Hs(Vt(this,"text",e)):Gs(e==null?"":e+""))}function qs(e){return function(t){this.textContent=e.call(this,t)}}function Bs(e){var t,o;function r(){var n=e.apply(this,arguments);return n!==o&&(t=(o=n)&&qs(n)),t}return r._value=e,r}function Os(e){var t="text";if(arguments.length<1)return(t=this.tween(t))&&t._value;if(e==null)return this.tween(t,null);if(typeof e!="function")throw new Error;return this.tween(t,Bs(e))}function Ws(){for(var e=this._name,t=this._id,o=ti(),r=this._groups,n=r.length,a=0;a<n;++a)for(var l=r[a],s=l.length,i,d=0;d<s;++d)if(i=l[d]){var c=ye(i,t);bt(i,e,o,d,l,{time:c.time+c.delay+c.duration,delay:0,duration:c.duration,ease:c.ease})}return new be(r,this._parents,e,o)}function Ys(){var e,t,o=this,r=o._id,n=o.size();return new Promise(function(a,l){var s={value:l},i={value:function(){--n===0&&a()}};o.each(function(){var d=me(this,r),c=d.on;c!==e&&(t=(e=c).copy(),t._.cancel.push(s),t._.interrupt.push(s),t._.end.push(i)),d.on=t}),n===0&&a()})}var js=0;function be(e,t,o,r){this._groups=e,this._parents=t,this._name=o,this._id=r}function ti(){return++js}var ke=Ze.prototype;be.prototype={constructor:be,select:Ms,selectAll:Ls,selectChild:ke.selectChild,selectChildren:ke.selectChildren,filter:ks,merge:xs,selection:Es,transition:Ws,call:ke.call,nodes:ke.nodes,node:ke.node,size:ke.size,empty:ke.empty,each:ke.each,on:$s,attr:is,attrTween:ls,style:Rs,styleTween:Ds,text:zs,textTween:Os,remove:Cs,tween:Qn,delay:hs,duration:ps,ease:gs,easeVarying:ws,end:Ys,[Symbol.iterator]:ke[Symbol.iterator]};function Xs(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var Vs={time:null,delay:0,duration:250,ease:Xs};function Us(e,t){for(var o;!(o=e.__transition)||!(o=o[t]);)if(!(e=e.parentNode))throw new Error(`transition ${t} not found`);return o}function Qs(e){var t,o;e instanceof be?(t=e._id,e=e._name):(t=ti(),(o=Vs).time=jt(),e=e==null?null:e+"");for(var r=this._groups,n=r.length,a=0;a<n;++a)for(var l=r[a],s=l.length,i,d=0;d<s;++d)(i=l[d])&&bt(i,e,t,d,l,o||Us(i,t));return new be(r,this._parents,e,t)}Ze.prototype.interrupt=Xn;Ze.prototype.transition=Qs;const nt=e=>()=>e;function Zs(e,{sourceEvent:t,target:o,transform:r,dispatch:n}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:t,enumerable:!0,configurable:!0},target:{value:o,enumerable:!0,configurable:!0},transform:{value:r,enumerable:!0,configurable:!0},_:{value:n}})}function xe(e,t,o){this.k=e,this.x=t,this.y=o}xe.prototype={constructor:xe,scale:function(e){return e===1?this:new xe(this.k*e,this.x,this.y)},translate:function(e,t){return e===0&t===0?this:new xe(this.k,this.x+this.k*e,this.y+this.k*t)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var mt=new xe(1,0,0);xe.prototype;function _t(e){e.stopImmediatePropagation()}function De(e){e.preventDefault(),e.stopImmediatePropagation()}function Ks(e){return(!e.ctrlKey||e.type==="wheel")&&!e.button}function Js(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]):[[0,0],[e.clientWidth,e.clientHeight]]}function ko(){return this.__zoom||mt}function ea(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function ta(){return navigator.maxTouchPoints||"ontouchstart"in this}function oa(e,t,o){var r=e.invertX(t[0][0])-o[0][0],n=e.invertX(t[1][0])-o[1][0],a=e.invertY(t[0][1])-o[0][1],l=e.invertY(t[1][1])-o[1][1];return e.translate(n>r?(r+n)/2:Math.min(0,r)||Math.max(0,n),l>a?(a+l)/2:Math.min(0,a)||Math.max(0,l))}function ia(){var e=Ks,t=Js,o=oa,r=ea,n=ta,a=[0,1/0],l=[[-1/0,-1/0],[1/0,1/0]],s=250,i=Hn,d=Wt("start","zoom","end"),c,h,f,w=500,b=150,g=0,$=10;function p(v){v.property("__zoom",ko).on("wheel.zoom",I,{passive:!1}).on("mousedown.zoom",L).on("dblclick.zoom",E).filter(n).on("touchstart.zoom",A).on("touchmove.zoom",H).on("touchend.zoom touchcancel.zoom",O).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}p.transform=function(v,M,C,F){var D=v.selection?v.selection():v;D.property("__zoom",ko),v!==D?x(v,M,C,F):D.interrupt().each(function(){m(this,arguments).event(F).start().zoom(null,typeof M=="function"?M.apply(this,arguments):M).end()})},p.scaleBy=function(v,M,C,F){p.scaleTo(v,function(){var D=this.__zoom.k,R=typeof M=="function"?M.apply(this,arguments):M;return D*R},C,F)},p.scaleTo=function(v,M,C,F){p.transform(v,function(){var D=t.apply(this,arguments),R=this.__zoom,z=C==null?u(D):typeof C=="function"?C.apply(this,arguments):C,B=R.invert(z),X=typeof M=="function"?M.apply(this,arguments):M;return o(y(S(R,X),z,B),D,l)},C,F)},p.translateBy=function(v,M,C,F){p.transform(v,function(){return o(this.__zoom.translate(typeof M=="function"?M.apply(this,arguments):M,typeof C=="function"?C.apply(this,arguments):C),t.apply(this,arguments),l)},null,F)},p.translateTo=function(v,M,C,F,D){p.transform(v,function(){var R=t.apply(this,arguments),z=this.__zoom,B=F==null?u(R):typeof F=="function"?F.apply(this,arguments):F;return o(mt.translate(B[0],B[1]).scale(z.k).translate(typeof M=="function"?-M.apply(this,arguments):-M,typeof C=="function"?-C.apply(this,arguments):-C),R,l)},F,D)};function S(v,M){return M=Math.max(a[0],Math.min(a[1],M)),M===v.k?v:new xe(M,v.x,v.y)}function y(v,M,C){var F=M[0]-C[0]*v.k,D=M[1]-C[1]*v.k;return F===v.x&&D===v.y?v:new xe(v.k,F,D)}function u(v){return[(+v[0][0]+ +v[1][0])/2,(+v[0][1]+ +v[1][1])/2]}function x(v,M,C,F){v.on("start.zoom",function(){m(this,arguments).event(F).start()}).on("interrupt.zoom end.zoom",function(){m(this,arguments).event(F).end()}).tween("zoom",function(){var D=this,R=arguments,z=m(D,R).event(F),B=t.apply(D,R),X=C==null?u(B):typeof C=="function"?C.apply(D,R):C,oe=Math.max(B[1][0]-B[0][0],B[1][1]-B[0][1]),W=D.__zoom,V=typeof M=="function"?M.apply(D,R):M,te=i(W.invert(X).concat(oe/W.k),V.invert(X).concat(oe/V.k));return function(Q){if(Q===1)Q=V;else{var ne=te(Q),ue=oe/ne[2];Q=new xe(ue,X[0]-ne[0]*ue,X[1]-ne[1]*ue)}z.zoom(null,Q)}})}function m(v,M,C){return!C&&v.__zooming||new k(v,M)}function k(v,M){this.that=v,this.args=M,this.active=0,this.sourceEvent=null,this.extent=t.apply(v,M),this.taps=0}k.prototype={event:function(v){return v&&(this.sourceEvent=v),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(v,M){return this.mouse&&v!=="mouse"&&(this.mouse[1]=M.invert(this.mouse[0])),this.touch0&&v!=="touch"&&(this.touch0[1]=M.invert(this.touch0[0])),this.touch1&&v!=="touch"&&(this.touch1[1]=M.invert(this.touch1[0])),this.that.__zoom=M,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(v){var M=fe(this.that).datum();d.call(v,this.that,new Zs(v,{sourceEvent:this.sourceEvent,target:p,transform:this.that.__zoom,dispatch:d}),M)}};function I(v,...M){if(!e.apply(this,arguments))return;var C=m(this,M).event(v),F=this.__zoom,D=Math.max(a[0],Math.min(a[1],F.k*Math.pow(2,r.apply(this,arguments)))),R=Me(v);if(C.wheel)(C.mouse[0][0]!==R[0]||C.mouse[0][1]!==R[1])&&(C.mouse[1]=F.invert(C.mouse[0]=R)),clearTimeout(C.wheel);else{if(F.k===D)return;C.mouse=[R,F.invert(R)],ct(this),C.start()}De(v),C.wheel=setTimeout(z,b),C.zoom("mouse",o(y(S(F,D),C.mouse[0],C.mouse[1]),C.extent,l));function z(){C.wheel=null,C.end()}}function L(v,...M){if(f||!e.apply(this,arguments))return;var C=v.currentTarget,F=m(this,M,!0).event(v),D=fe(v.view).on("mousemove.zoom",X,!0).on("mouseup.zoom",oe,!0),R=Me(v,C),z=v.clientX,B=v.clientY;un(v.view),_t(v),F.mouse=[R,this.__zoom.invert(R)],ct(this),F.start();function X(W){if(De(W),!F.moved){var V=W.clientX-z,te=W.clientY-B;F.moved=V*V+te*te>g}F.event(W).zoom("mouse",o(y(F.that.__zoom,F.mouse[0]=Me(W,C),F.mouse[1]),F.extent,l))}function oe(W){D.on("mousemove.zoom mouseup.zoom",null),fn(W.view,F.moved),De(W),F.event(W).end()}}function E(v,...M){if(e.apply(this,arguments)){var C=this.__zoom,F=Me(v.changedTouches?v.changedTouches[0]:v,this),D=C.invert(F),R=C.k*(v.shiftKey?.5:2),z=o(y(S(C,R),F,D),t.apply(this,M),l);De(v),s>0?fe(this).transition().duration(s).call(x,z,F,v):fe(this).call(p.transform,z,F,v)}}function A(v,...M){if(e.apply(this,arguments)){var C=v.touches,F=C.length,D=m(this,M,v.changedTouches.length===F).event(v),R,z,B,X;for(_t(v),z=0;z<F;++z)B=C[z],X=Me(B,this),X=[X,this.__zoom.invert(X),B.identifier],D.touch0?!D.touch1&&D.touch0[2]!==X[2]&&(D.touch1=X,D.taps=0):(D.touch0=X,R=!0,D.taps=1+!!c);c&&(c=clearTimeout(c)),R&&(D.taps<2&&(h=X[0],c=setTimeout(function(){c=null},w)),ct(this),D.start())}}function H(v,...M){if(this.__zooming){var C=m(this,M).event(v),F=v.changedTouches,D=F.length,R,z,B,X;for(De(v),R=0;R<D;++R)z=F[R],B=Me(z,this),C.touch0&&C.touch0[2]===z.identifier?C.touch0[0]=B:C.touch1&&C.touch1[2]===z.identifier&&(C.touch1[0]=B);if(z=C.that.__zoom,C.touch1){var oe=C.touch0[0],W=C.touch0[1],V=C.touch1[0],te=C.touch1[1],Q=(Q=V[0]-oe[0])*Q+(Q=V[1]-oe[1])*Q,ne=(ne=te[0]-W[0])*ne+(ne=te[1]-W[1])*ne;z=S(z,Math.sqrt(Q/ne)),B=[(oe[0]+V[0])/2,(oe[1]+V[1])/2],X=[(W[0]+te[0])/2,(W[1]+te[1])/2]}else if(C.touch0)B=C.touch0[0],X=C.touch0[1];else return;C.zoom("touch",o(y(z,B,X),C.extent,l))}}function O(v,...M){if(this.__zooming){var C=m(this,M).event(v),F=v.changedTouches,D=F.length,R,z;for(_t(v),f&&clearTimeout(f),f=setTimeout(function(){f=null},w),R=0;R<D;++R)z=F[R],C.touch0&&C.touch0[2]===z.identifier?delete C.touch0:C.touch1&&C.touch1[2]===z.identifier&&delete C.touch1;if(C.touch1&&!C.touch0&&(C.touch0=C.touch1,delete C.touch1),C.touch0)C.touch0[1]=this.__zoom.invert(C.touch0[0]);else if(C.end(),C.taps===2&&(z=Me(z,this),Math.hypot(h[0]-z[0],h[1]-z[1])<$)){var B=fe(this).on("dblclick.zoom");B&&B.apply(this,arguments)}}}return p.wheelDelta=function(v){return arguments.length?(r=typeof v=="function"?v:nt(+v),p):r},p.filter=function(v){return arguments.length?(e=typeof v=="function"?v:nt(!!v),p):e},p.touchable=function(v){return arguments.length?(n=typeof v=="function"?v:nt(!!v),p):n},p.extent=function(v){return arguments.length?(t=typeof v=="function"?v:nt([[+v[0][0],+v[0][1]],[+v[1][0],+v[1][1]]]),p):t},p.scaleExtent=function(v){return arguments.length?(a[0]=+v[0],a[1]=+v[1],p):[a[0],a[1]]},p.translateExtent=function(v){return arguments.length?(l[0][0]=+v[0][0],l[1][0]=+v[1][0],l[0][1]=+v[0][1],l[1][1]=+v[1][1],p):[[l[0][0],l[0][1]],[l[1][0],l[1][1]]]},p.constrain=function(v){return arguments.length?(o=v,p):o},p.duration=function(v){return arguments.length?(s=+v,p):s},p.interpolate=function(v){return arguments.length?(i=v,p):i},p.on=function(){var v=d.on.apply(d,arguments);return v===d?p:v},p.clickDistance=function(v){return arguments.length?(g=(v=+v)*v,p):Math.sqrt(g)},p.tapDistance=function(v){return arguments.length?($=+v,p):$},p}const Ue=[{id:"remilia-scarlet",shortName:"Remilia",locationId:"scarlet-devil-mansion",region:"Misty Lake",spotLabel:"Scarlet South Terrace Overlook",x:.811,y:.785,quote:"“The night is still young, and the moon over Misty Lake belongs to the Scarlet Devil.”",hairColor:"#92b4f4",hairStyle:"short",eyeColor:"#e0243c",outfitPrimary:"#f7d8e4",outfitSecondary:"#c81e32",accentColor:"#ff3858",headgear:"mob_cap",wings:"bat",prop:"gungnir"},{id:"flandre-scarlet",shortName:"Flandre",locationId:"sdm-gardens-east-wing",region:"Misty Lake",spotLabel:"East Rose Garden Lawn",x:.866,y:.748,quote:"“Will you play with me? Careful—things tend to go ‘kyuu~’ and shatter when I squeeze my hand!”",hairColor:"#f6d860",hairStyle:"side_tail",eyeColor:"#e62238",outfitPrimary:"#d92232",outfitSecondary:"#fce6ec",accentColor:"#ffbe3c",headgear:"mob_cap",wings:"flandre_crystal",prop:"laevateinn",flipX:!0},{id:"sakuya-izayoi",shortName:"Sakuya",locationId:"sdm-parlor-dining",region:"Misty Lake",spotLabel:"SDM Grand Courtyard Promenade",x:.844,y:.784,quote:"“Black tea is freshly brewed for the Mistress. Every silver knife and clock hand is in its proper place.”",hairColor:"#d8e0ef",hairStyle:"braid",eyeColor:"#3b64b8",outfitPrimary:"#243a7a",outfitSecondary:"#f4f6fa",accentColor:"#36a868",headgear:"maid_band",wings:"none",prop:"none",flipX:!0},{id:"patchouli-knowledge",shortName:"Patchouli",locationId:"voile-library",region:"Misty Lake",spotLabel:"West Voile Library Courtyard",x:.791,y:.781,quote:"“Please keep your voice down among the grimoires… and keep that black-and-white witch away from my shelves.”",hairColor:"#9b54b6",hairStyle:"long",eyeColor:"#7a3ea0",outfitPrimary:"#d89ce8",outfitSecondary:"#682c8a",accentColor:"#f2ca52",headgear:"patchouli_cap",wings:"none",prop:"book"},{id:"hong-meiling",shortName:"Meiling",locationId:"scarlet-devil-mansion",region:"Misty Lake",spotLabel:"Scarlet Iron Front Gate",x:.826,y:.795,quote:"“Halt! Nobody passes the Scarlet Devil Mansion gate while I am wide awake—mostly wide awake!”",hairColor:"#c92e3a",hairStyle:"long",eyeColor:"#3c78c8",outfitPrimary:"#267844",outfitSecondary:"#f2f0e8",accentColor:"#e8c448",headgear:"meiling_beret",wings:"none",prop:"none"},{id:"koakuma",shortName:"Koakuma",locationId:"voile-library",region:"Misty Lake",spotLabel:"West Library Garden Walk",x:.785,y:.748,quote:"“Sorting Lady Patchouli’s newly bound spellbooks outside the west wing.”",hairColor:"#c63646",hairStyle:"wavy",eyeColor:"#b02838",outfitPrimary:"#221e28",outfitSecondary:"#b62838",accentColor:"#f2e8dc",headgear:"bat",wings:"bat",prop:"book"},{id:"cirno",shortName:"Cirno",locationId:"crawdad-rock",region:"Misty Lake",spotLabel:"Crawdad Rock Ice Bank",x:.635,y:.878,quote:"“Eye’m the strongest fairy on Misty Lake! There are no buses in Gensokyo—only my freeze-ray!”",hairColor:"#56a8f5",hairStyle:"bob",eyeColor:"#2575d8",outfitPrimary:"#2b6cd4",outfitSecondary:"#eef6ff",accentColor:"#7be0ff",headgear:"ribbon",wings:"cirno_ice",prop:"none"},{id:"daiyousei",shortName:"Daiyousei",locationId:"misty-lake",region:"Misty Lake",spotLabel:"Southern Reed Shallows",x:.653,y:.885,quote:"“Cheering on Cirno from the reeds along the southern shore of Misty Lake.”",hairColor:"#72cf68",hairStyle:"side_tail",eyeColor:"#2d8a4e",outfitPrimary:"#2d7a4c",outfitSecondary:"#f4f8ec",accentColor:"#f2d44e",headgear:"ribbon",wings:"fairy",prop:"none",flipX:!0},{id:"wakasagihime",shortName:"Wakasagihime",locationId:"misty-lake",region:"Misty Lake",spotLabel:"Misty Lake Shimmering Shoals",x:.692,y:.808,quote:"“Collecting smooth river stones and singing softly beneath the surface mist.”",hairColor:"#3c8cd4",hairStyle:"wavy",eyeColor:"#28a89e",outfitPrimary:"#225e9c",outfitSecondary:"#86d8d4",accentColor:"#e26a8c",headgear:"none",wings:"none",prop:"none"},{id:"lunasa-prismriver",shortName:"Lunasa",locationId:"prismriver-mansion",region:"Misty Lake",spotLabel:"Prismriver Concert Lawn",x:.742,y:.714,quote:"“Tuning the solo violin before the Prismriver Ensemble begins its evening performance.”",hairColor:"#dcd8b8",hairStyle:"bob",eyeColor:"#9c3a44",outfitPrimary:"#26262e",outfitSecondary:"#f2eee6",accentColor:"#d43844",headgear:"mob_cap",wings:"none",prop:"none"},{id:"reimu-hakurei",shortName:"Reimu",locationId:"hakurei-shrine",region:"Hakurei",spotLabel:"Hakurei Shrine Front Approach",x:.255,y:.344,quote:"“Sweeping cherry petals off the shrine steps… Donations are always welcome inside the offertory box!”",hairColor:"#2c1f28",hairStyle:"long",eyeColor:"#8e2b36",outfitPrimary:"#d4262e",outfitSecondary:"#f8f6f2",accentColor:"#f2ca48",headgear:"reimu_bow",wings:"none",prop:"gohei"},{id:"suika-ibuki",shortName:"Suika",locationId:"hakurei-shrine",region:"Hakurei",spotLabel:"Shrine Sakura Banquet Lawn",x:.275,y:.336,quote:"“The Ibuki Gourd never runs dry! Care for a cup under the shrine’s cherry blossoms?”",hairColor:"#e89a54",hairStyle:"side_tail",eyeColor:"#c83c32",outfitPrimary:"#f2ece2",outfitSecondary:"#583898",accentColor:"#d8382c",headgear:"oni_horns",wings:"none",prop:"gourd",flipX:!0},{id:"shinmyoumaru-sukuna",shortName:"Shinmyoumaru",locationId:"hakurei-shrine",region:"Hakurei",spotLabel:"West Shrine Precinct",x:.236,y:.336,quote:"“Brandishing my gleaming sewing needle from inside the Shining Needle Bowl!”",hairColor:"#dcd8e8",hairStyle:"bob",eyeColor:"#c82848",outfitPrimary:"#b83258",outfitSecondary:"#f6eff4",accentColor:"#e8b842",headgear:"shinmy_bowl",wings:"none",prop:"katana"},{id:"sunny-milk",shortName:"Sunny Milk",locationId:"three-fairies-tree",region:"Hakurei",spotLabel:"Great Fairy Treehouse Clearing",x:.285,y:.268,quote:"“With the Three Fairies of Light together, our next prank on Reimu cannot possibly fail!”",hairColor:"#f49a42",hairStyle:"twintails",eyeColor:"#d84828",outfitPrimary:"#e24434",outfitSecondary:"#fcf6ec",accentColor:"#f8d048",headgear:"mob_cap",wings:"fairy",prop:"none"},{id:"luna-child",shortName:"Luna Child",locationId:"three-fairies-tree",region:"Hakurei",spotLabel:"Treehouse East Lawn",x:.302,y:.285,quote:"“Muffling all surrounding sound while sipping stolen coffee outside the hollow oak.”",hairColor:"#f4e078",hairStyle:"drill",eyeColor:"#a86e24",outfitPrimary:"#f6f0dc",outfitSecondary:"#684428",accentColor:"#e8c448",headgear:"mob_cap",wings:"fairy",prop:"none",flipX:!0},{id:"star-sapphire",shortName:"Star Sapphire",locationId:"three-fairies-tree",region:"Hakurei",spotLabel:"Ancient Oak South Path",x:.269,y:.297,quote:"“My radar senses someone approaching along the path behind Hakurei Shrine~”",hairColor:"#362e3e",hairStyle:"long",eyeColor:"#2c5ec8",outfitPrimary:"#2852a8",outfitSecondary:"#f2f4fa",accentColor:"#e83848",headgear:"ribbon",wings:"fairy",prop:"none"},{id:"marisa-kirisame",shortName:"Marisa",locationId:"marisas-house",region:"Forest of Magic",spotLabel:"Kirisame Magic Shop Yard",x:.618,y:.654,quote:"“It’s all about firepower, ze! Just testing out a new mushroom concoction for my Mini-Hakkero.”",hairColor:"#f6d458",hairStyle:"braid",eyeColor:"#d49a28",outfitPrimary:"#222028",outfitSecondary:"#f6f4f0",accentColor:"#f4c842",headgear:"witch_hat",wings:"none",prop:"broom"},{id:"alice-margatroid",shortName:"Alice",locationId:"alices-house",region:"Forest of Magic",spotLabel:"Margatroid Doll Atelier Front",x:.578,y:.726,quote:"“Adjusting the silk threads on Shanghai and Hourai before afternoon tea.”",hairColor:"#f4dc6c",hairStyle:"bob",eyeColor:"#3868b8",outfitPrimary:"#3464b8",outfitSecondary:"#f8f4f2",accentColor:"#e4384c",headgear:"ribbon",wings:"none",prop:"book",flipX:!0},{id:"rinnosuke-morichika",shortName:"Rinnosuke",locationId:"kourindou",region:"Forest of Magic",spotLabel:"Kourindou Front Porch",x:.5,y:.624,quote:"“Appraising a mysterious artifact that drifted in from the Outside World.”",hairColor:"#c8cee0",hairStyle:"short",eyeColor:"#7a6848",outfitPrimary:"#2c4478",outfitSecondary:"#d8d4c8",accentColor:"#b88638",headgear:"none",wings:"none",prop:"book"},{id:"narumi-yatadera",shortName:"Narumi",locationId:"forest-of-magic-jizo",region:"Forest of Magic",spotLabel:"Mossy Jizo Sanctuary",x:.512,y:.732,quote:"“Watching quietly over the mossy forest trails beneath my woven sedge hat.”",hairColor:"#2c2832",hairStyle:"bob",eyeColor:"#b83238",outfitPrimary:"#c82c34",outfitSecondary:"#38343c",accentColor:"#d8b448",headgear:"narumi_kasa",wings:"none",prop:"orb"},{id:"rumia",shortName:"Rumia",locationId:"rumia-cedar-clearing",region:"Forest of Magic",spotLabel:"Cedar Clearing Shadow",x:.654,y:.694,quote:"“Is it really true that saying ‘Does that mean the saint was crucified?’ makes you look like a T-pose?”",hairColor:"#f4d862",hairStyle:"bob",eyeColor:"#c82834",outfitPrimary:"#201e26",outfitSecondary:"#f4f2ee",accentColor:"#d82834",headgear:"ribbon",wings:"none",prop:"none"},{id:"kosuzu-motoori",shortName:"Kosuzu",locationId:"suzunaan",region:"Heartland",spotLabel:"Suzunaan South Bookshop Lane",x:.482,y:.526,quote:"“Another rare Demon Book arrived today! Even if it’s written in ancient cipher, I can read every word!”",hairColor:"#b84a2c",hairStyle:"twintails",eyeColor:"#a84228",outfitPrimary:"#48884c",outfitSecondary:"#f2e8c8",accentColor:"#d43c38",headgear:"ribbon",wings:"none",prop:"book"},{id:"hieda-no-akyuu",shortName:"Akyuu",locationId:"hieda-estate",region:"Heartland",spotLabel:"Hieda Estate West Courtyard",x:.436,y:.422,quote:"“Recording the ninth Child of Miare’s latest observations for the Gensokyo Chronicle.”",hairColor:"#9852b8",hairStyle:"bob",eyeColor:"#7a3898",outfitPrimary:"#e87898",outfitSecondary:"#f6d884",accentColor:"#c82c44",headgear:"ribbon",wings:"none",prop:"scroll"},{id:"keine-kamishirasawa",shortName:"Keine",locationId:"terakoya-school",region:"Heartland",spotLabel:"Village Central Plaza",x:.476,y:.466,quote:"“Class is in session! History must be preserved accurately for the children of the Human Village.”",hairColor:"#cdd8f0",hairStyle:"long",eyeColor:"#3858a8",outfitPrimary:"#28488e",outfitSecondary:"#f4f4f8",accentColor:"#368a58",headgear:"crown",wings:"none",prop:"scroll",flipX:!0},{id:"miyoi-okunoda",shortName:"Miyoi",locationId:"geidontei",region:"Heartland",spotLabel:"Geidontei Izakaya Front",x:.42,y:.464,quote:"“Welcome to Geidontei! Warm sake and freshly braised dishes are ready at the counter~”",hairColor:"#e86888",hairStyle:"bob",eyeColor:"#2878a8",outfitPrimary:"#2c5888",outfitSecondary:"#f4f2ec",accentColor:"#e87898",headgear:"kappa_cap",wings:"none",prop:"gourd"},{id:"sekibanki",shortName:"Sekibanki",locationId:"foot-washing-house",region:"Heartland",spotLabel:"South Quarter Willow Walk",x:.448,y:.518,quote:"“Blending into the Human Village with my scarf pulled high… nobody suspects a Rokurokubi here.”",hairColor:"#b8283c",hairStyle:"bob",eyeColor:"#c82838",outfitPrimary:"#c82838",outfitSecondary:"#24242c",accentColor:"#f2ece4",headgear:"ribbon",wings:"none",prop:"none"},{id:"mystia-lorelei",shortName:"Mystia",locationId:"youkai-trail",region:"Heartland",spotLabel:"Charcoal-Grilled Lamprey Cart",x:.538,y:.526,quote:"“Freshly grilled lamprey skewers, hot off the charcoal! Guaranteed to cure night-blindness~♪”",hairColor:"#c87898",hairStyle:"short",eyeColor:"#983864",outfitPrimary:"#683458",outfitSecondary:"#f4ecee",accentColor:"#d8b458",headgear:"tengu_tokin",wings:"crow",prop:"lantern"},{id:"mamizou-futatsuiwa",shortName:"Mamizou",locationId:"youkai-tanuki-forest",region:"Heartland",spotLabel:"Tanuki Forest Glade",x:.415,y:.538,quote:"“Hohoho, care for a friendly wager? Don’t let a transformed autumn leaf fool your eyes.”",hairColor:"#8c5a38",hairStyle:"long",eyeColor:"#b87828",outfitPrimary:"#3e6e48",outfitSecondary:"#f2ece0",accentColor:"#c87834",headgear:"wolf_ears",wings:"none",prop:"scroll"},{id:"byakuren-hijiri",shortName:"Byakuren",locationId:"myouren-temple",region:"Heartland",spotLabel:"Myouren Temple South Approach",x:.382,y:.614,quote:"“At Myouren Temple, both humans and youkai may walk the path of enlightenment in peace.”",hairColor:"#8e5ab8",hairStyle:"wavy",eyeColor:"#6848a8",outfitPrimary:"#24202c",outfitSecondary:"#f4f0f6",accentColor:"#c888d8",headgear:"none",wings:"none",prop:"scroll"},{id:"shou-toramaru",shortName:"Shou",locationId:"myouren-temple",region:"Heartland",spotLabel:"Jeweled Pagoda East Lawn",x:.402,y:.592,quote:"“Thankfully Nazrin found the Jeweled Pagoda again! Its radiance watches over the temple.”",hairColor:"#e8b848",hairStyle:"bob",eyeColor:"#b87824",outfitPrimary:"#d87828",outfitSecondary:"#f6f2e8",accentColor:"#f8d854",headgear:"crown",wings:"none",prop:"pagoda",flipX:!0},{id:"minamitsu-murasa",shortName:"Murasa",locationId:"myouren-temple",region:"Heartland",spotLabel:"Palanquin Ship Mooring",x:.362,y:.596,quote:"“All hands on deck! Even anchored beside the temple, the Palanquin Ship is ready to sail the skies.”",hairColor:"#2c4848",hairStyle:"short",eyeColor:"#287888",outfitPrimary:"#243458",outfitSecondary:"#f4f6f8",accentColor:"#c8343c",headgear:"meiling_beret",wings:"none",prop:"anchor"},{id:"nazrin",shortName:"Nazrin",locationId:"myouren-temple",region:"Heartland",spotLabel:"Temple North Gate",x:.372,y:.558,quote:"“My dowsing rods never miss a lost treasure—or a fine piece of cheese.”",hairColor:"#7c7884",hairStyle:"short",eyeColor:"#b82834",outfitPrimary:"#3e4252",outfitSecondary:"#dcd8d4",accentColor:"#d43844",headgear:"wolf_ears",wings:"none",prop:"gohei"},{id:"kogasa-tatara",shortName:"Kogasa",locationId:"kogasa-forge",region:"Heartland",spotLabel:"Cemetery Blacksmith Forge",x:.415,y:.612,quote:"“Boo! Did I surprise you?! …Wait, you just came to have your needles and tools sharpened?”",hairColor:"#3ad4d8",hairStyle:"short",eyeColor:"#d82c3c",outfitPrimary:"#3858a8",outfitSecondary:"#f4eef2",accentColor:"#8838a8",headgear:"none",wings:"none",prop:"parasol"},{id:"toyosatomimi-no-miko",shortName:"Miko",locationId:"hall-of-dreams",region:"Heartland",spotLabel:"Hall of Dreams Courtyard",x:.34,y:.634,quote:"“Speak freely—I can hear ten desires at once and discern the true heart of every visitor.”",hairColor:"#e8c458",hairStyle:"short",eyeColor:"#a86828",outfitPrimary:"#683898",outfitSecondary:"#f6f2ec",accentColor:"#f2ca48",headgear:"miko_earmuffs",wings:"none",prop:"katana"},{id:"mononobe-no-futo",shortName:"Futo",locationId:"hall-of-dreams",region:"Heartland",spotLabel:"Mausoleum Dragon Waterways",x:.322,y:.624,quote:"“Verily, the feng shui of this octagonal pavilion flows auspiciously for the Crown Prince!”",hairColor:"#b8bec8",hairStyle:"side_tail",eyeColor:"#2c5898",outfitPrimary:"#eef2f6",outfitSecondary:"#3868b8",accentColor:"#2c4888",headgear:"futo_eboshi",wings:"none",prop:"orb"},{id:"seiga-kaku",shortName:"Seiga",locationId:"senkai",region:"Heartland",spotLabel:"Senkai Hermit Realm",x:.304,y:.642,quote:"“Walls are merely a suggestion when one holds a Taoist hairpin that carves passages anywhere~”",hairColor:"#2c68a8",hairStyle:"twintails",eyeColor:"#285898",outfitPrimary:"#2c5898",outfitSecondary:"#e8eef8",accentColor:"#e8b848",headgear:"ribbon",wings:"none",prop:"fan",flipX:!0},{id:"kaguya-houraisan",shortName:"Kaguya",locationId:"eientei",region:"Bamboo Forest",spotLabel:"Eientei South Garden Gate",x:.855,y:.496,quote:"“Eternity is never dull here in Eientei—especially when Five Impossible Requests await.”",hairColor:"#1e1c24",hairStyle:"long",eyeColor:"#583868",outfitPrimary:"#d8385c",outfitSecondary:"#fce8ee",accentColor:"#f2ca48",headgear:"none",wings:"none",prop:"fan"},{id:"eirin-yagokoro",shortName:"Eirin",locationId:"eientei",region:"Bamboo Forest",spotLabel:"Eientei Apothecary Lawn",x:.835,y:.488,quote:"“The clinic is open. Whether human or youkai, take this remedy and rest under the bamboo eaves.”",hairColor:"#d8dce8",hairStyle:"braid",eyeColor:"#586898",outfitPrimary:"#c8283c",outfitSecondary:"#343878",accentColor:"#f2d458",headgear:"patchouli_cap",wings:"none",prop:"gohei"},{id:"reisen-udongein-inaba",shortName:"Reisen",locationId:"eientei",region:"Bamboo Forest",spotLabel:"Eientei East Bamboo Walk",x:.875,y:.488,quote:"“Preparing Master Eirin’s medicine deliveries before heading to the Human Village.”",hairColor:"#b898d8",hairStyle:"long",eyeColor:"#d8283c",outfitPrimary:"#242434",outfitSecondary:"#f4f2f8",accentColor:"#d83848",headgear:"bunny_ears",wings:"none",prop:"none",flipX:!0},{id:"tewi-inaba",shortName:"Tewi",locationId:"bamboo-forest-of-the-lost",region:"Bamboo Forest",spotLabel:"Lucky Bamboo Crossroads",x:.775,y:.436,quote:"“Follow the white rabbits if you don’t want to wander the Bamboo Forest forever—or maybe into a pitfall~”",hairColor:"#282228",hairStyle:"bob",eyeColor:"#b82838",outfitPrimary:"#f4a8b8",outfitSecondary:"#f8f4f6",accentColor:"#d8283c",headgear:"bunny_ears",wings:"none",prop:"none"},{id:"fujiwara-no-mokou",shortName:"Mokou",locationId:"mokous-house",region:"Bamboo Forest",spotLabel:"Mokou’s Bamboo Clearing",x:.725,y:.398,quote:"“Lost in the bamboo thicket? Come on, I’ll escort you back toward the village before nightfall.”",hairColor:"#eef0f8",hairStyle:"long",eyeColor:"#c82834",outfitPrimary:"#c82834",outfitSecondary:"#f6f4f2",accentColor:"#ff7828",headgear:"reimu_bow",wings:"none",prop:"none"},{id:"yuuka-kazami",shortName:"Yuuka",locationId:"garden-of-the-sun",region:"Bamboo Forest",spotLabel:"Garden of the Sun Terraces",x:.79,y:.602,quote:"“You are welcome to admire the sunflowers, so long as you do not trample a single stem.”",hairColor:"#44b858",hairStyle:"bob",eyeColor:"#c82834",outfitPrimary:"#c82834",outfitSecondary:"#f8f4f0",accentColor:"#f4d448",headgear:"none",wings:"none",prop:"parasol"},{id:"medicine-melancholy",shortName:"Medicine",locationId:"nameless-hill",region:"Bamboo Forest",spotLabel:"Nameless Hill Lily-of-the-Valley",x:.895,y:.574,quote:"“Sweet poison drifts across the white lily-of-the-valley blossoms on Nameless Hill.”",hairColor:"#f2d458",hairStyle:"bob",eyeColor:"#c82838",outfitPrimary:"#b8283c",outfitSecondary:"#242028",accentColor:"#f4e8ee",headgear:"ribbon",wings:"none",prop:"none"},{id:"yukari-yakumo",shortName:"Yukari",locationId:"mayohiga",region:"Bamboo Forest",spotLabel:"Mayohiga South Approach",x:.915,y:.378,quote:"“The boundary between 2D parchment and 3D reality is thin indeed… mind the gaps~”",hairColor:"#f4d868",hairStyle:"long",eyeColor:"#783898",outfitPrimary:"#783898",outfitSecondary:"#f8f4f8",accentColor:"#d8283c",headgear:"yukari_cap",wings:"none",prop:"parasol"},{id:"ran-yakumo",shortName:"Ran",locationId:"mayohiga",region:"Bamboo Forest",spotLabel:"Mayohiga West Courtyard",x:.896,y:.368,quote:"“Inspecting the eastern barrier calculations while Lady Yukari rests.”",hairColor:"#f4d862",hairStyle:"short",eyeColor:"#4868b8",outfitPrimary:"#3452a8",outfitSecondary:"#f6f4f8",accentColor:"#f2ca48",headgear:"ran_cap",wings:"none",prop:"scroll"},{id:"chen",shortName:"Chen",locationId:"mayohiga",region:"Bamboo Forest",spotLabel:"Mayohiga East Steps",x:.934,y:.368,quote:"“Leaping across the stone steps of Mayohiga before Lady Ran calls me in!”",hairColor:"#684434",hairStyle:"short",eyeColor:"#884828",outfitPrimary:"#d8382c",outfitSecondary:"#2c7848",accentColor:"#f2d458",headgear:"chen_cap",wings:"none",prop:"none",flipX:!0},{id:"sanae-kochiya",shortName:"Sanae",locationId:"moriya-shrine",region:"Youkai Mountain",spotLabel:"Moriya Shrine Front Torii",x:.643,y:.127,quote:"“The mountain breeze above the clouds is crisp today! May the Moriya gods bless your climb!”",hairColor:"#44c868",hairStyle:"long",eyeColor:"#2c9858",outfitPrimary:"#3878d8",outfitSecondary:"#f6f8fc",accentColor:"#58d878",headgear:"suwako_hat",wings:"none",prop:"gohei"},{id:"kanako-yasaka",shortName:"Kanako",locationId:"wind-gods-lake",region:"Youkai Mountain",spotLabel:"Wind God’s Lake Sanctuary",x:.651,y:.117,quote:"“Gazing out from the four sacred Onbashira pillars over Wind God’s Lake and all of Gensokyo.”",hairColor:"#584888",hairStyle:"short",eyeColor:"#b82838",outfitPrimary:"#c82838",outfitSecondary:"#282438",accentColor:"#e8d488",headgear:"crown",wings:"none",prop:"orb",flipX:!0},{id:"suwako-moriya",shortName:"Suwako",locationId:"moriya-shrine",region:"Youkai Mountain",spotLabel:"Moriya West Precinct",x:.625,y:.118,quote:"“Kero kero~ Iron rings and spring rain still belong to the native gods of Moriya!”",hairColor:"#e8d068",hairStyle:"bob",eyeColor:"#688848",outfitPrimary:"#584498",outfitSecondary:"#f4f0f8",accentColor:"#d8c468",headgear:"suwako_hat",wings:"none",prop:"orb"},{id:"aya-shameimaru",shortName:"Aya",locationId:"nine-heavens-waterfall",region:"Youkai Mountain",spotLabel:"Waterfall of Nine Heavens Outlook",x:.619,y:.176,quote:"“Ayayaya! What a scoop! Hold that pose for the front page of the Bunbunmaru Newspaper!”",hairColor:"#1e1c24",hairStyle:"bob",eyeColor:"#c82834",outfitPrimary:"#242228",outfitSecondary:"#f6f4f0",accentColor:"#d82834",headgear:"tengu_tokin",wings:"crow",prop:"camera"},{id:"momiji-inubashiri",shortName:"Momiji",locationId:"nine-heavens-waterfall",region:"Youkai Mountain",spotLabel:"Vermilion Tengu Bridge",x:.612,y:.18,quote:"“White Wolf Tengu perimeter patrol is clear! No intruders have crossed the waterfall gorge.”",hairColor:"#eef0f6",hairStyle:"short",eyeColor:"#c83434",outfitPrimary:"#f4f2ee",outfitSecondary:"#c82834",accentColor:"#e8b842",headgear:"wolf_ears",wings:"none",prop:"shield_sword",flipX:!0},{id:"hatate-himekaidou",shortName:"Hatate",locationId:"tengu-village",region:"Youkai Mountain",spotLabel:"Tengu Village Press Terrace",x:.706,y:.162,quote:"“With Spirit Photography, I don’t even need to fly out in the rain to capture the best headlines!”",hairColor:"#583c48",hairStyle:"twintails",eyeColor:"#9848a8",outfitPrimary:"#784898",outfitSecondary:"#f4eef8",accentColor:"#e8c448",headgear:"tengu_tokin",wings:"crow",prop:"camera"},{id:"nitori-kawashiro",shortName:"Nitori",locationId:"genbu-ravine",region:"Youkai Mountain",spotLabel:"Genbu Ravine Riverbank",x:.545,y:.272,quote:"“Kappa optical camouflage and hydro-turbines are running at peak efficiency, my sworn friend!”",hairColor:"#3888d8",hairStyle:"twintails",eyeColor:"#2868b8",outfitPrimary:"#2c78c8",outfitSecondary:"#68c858",accentColor:"#f2d448",headgear:"kappa_cap",wings:"none",prop:"none"},{id:"kasen-ibaraki",shortName:"Kasen",locationId:"kasen-senkai",region:"Youkai Mountain",spotLabel:"Kasen’s Mountain Hermitage",x:.563,y:.155,quote:"“Feeding the mountain eagles and lecturing visitors on proper hermit discipline.”",hairColor:"#e86888",hairStyle:"twintails",eyeColor:"#c83848",outfitPrimary:"#d8384c",outfitSecondary:"#f6f2ec",accentColor:"#48a858",headgear:"ribbon",wings:"none",prop:"scroll"},{id:"seija-kijin",shortName:"Seija",locationId:"shining-needle-castle",region:"Youkai Mountain",spotLabel:"Inverted Shining Needle Keep",x:.785,y:.147,quote:"“Up is down, strong is weak! Why shouldn’t the whole world be flipped upside-down?”",hairColor:"#24222c",hairStyle:"bob",eyeColor:"#c82838",outfitPrimary:"#b82838",outfitSecondary:"#f2eef4",accentColor:"#3858b8",headgear:"oni_horns",wings:"none",prop:"none"},{id:"ariya-iwanaga",shortName:"Ariya",locationId:"asama-purifying-mountain",region:"Youkai Mountain",spotLabel:"Asama Stone Sanctuary",x:.75,y:.259,quote:"“Enduring in silent stone permanence atop the ancient Asama Purifying Mountain.”",hairColor:"#989ca8",hairStyle:"long",eyeColor:"#d84858",outfitPrimary:"#585c68",outfitSecondary:"#dcdce4",accentColor:"#e85848",headgear:"crown",wings:"none",prop:"orb"},{id:"tenshi-hinanawi",shortName:"Tenshi",locationId:"heaven",region:"Otherworld",spotLabel:"Heaven of Bhava-agra Peach Island",x:.674,y:.051,quote:"“Standing atop the Keystone with the Sword of Hisou! Honestly, Heaven is far too quiet without a duel.”",hairColor:"#3868d8",hairStyle:"long",eyeColor:"#c82838",outfitPrimary:"#2c58b8",outfitSecondary:"#f6f4f8",accentColor:"#e85878",headgear:"tenshi_hat",wings:"none",prop:"katana"},{id:"iku-nagae",shortName:"Iku",locationId:"bhava-agra",region:"Otherworld",spotLabel:"Bhava-agra Scarlet Cloud Terrace",x:.676,y:.048,quote:"“Reading the flow of the scarlet clouds to warn the surface of any impending tremors.”",hairColor:"#6848a8",hairStyle:"bob",eyeColor:"#c8283c",outfitPrimary:"#2c2838",outfitSecondary:"#f4eef8",accentColor:"#d83848",headgear:"patchouli_cap",wings:"none",prop:"fan",flipX:!0},{id:"yuyuko-saigyouji",shortName:"Yuyuko",locationId:"hakugyokurou",region:"Netherworld",spotLabel:"Hakugyokurou Cherry Viewing Lawn",x:.332,y:.084,quote:"“Youmu~ Once you finish sweeping the garden steps, let’s have cherry-blossom sweets beneath the Saigyou Ayakashi.”",hairColor:"#f298b8",hairStyle:"bob",eyeColor:"#b83868",outfitPrimary:"#78b8e8",outfitSecondary:"#f6f8fc",accentColor:"#e85888",headgear:"yuyuko_veil",wings:"none",prop:"fan"},{id:"youmu-konpaku",shortName:"Youmu",locationId:"netherworld",region:"Netherworld",spotLabel:"Hakugyokurou Stone Stairway Landing",x:.362,y:.086,quote:"“The things that cannot be cut by my Roukanken, forged by youkai, are next to none!”",hairColor:"#e4ece8",hairStyle:"bob",eyeColor:"#287868",outfitPrimary:"#246858",outfitSecondary:"#f4f8f6",accentColor:"#283834",headgear:"ribbon",wings:"myon",prop:"katana",flipX:!0},{id:"eiki-shiki",shortName:"Eiki Shiki",locationId:"higan",region:"Netherworld",spotLabel:"Ministry of Right and Wrong Plaza",x:.185,y:.166,quote:"“Gazing into the Cleansed Crystal Mirror and weighing every deed with the Rod of Remorse.”",hairColor:"#34884c",hairStyle:"bob",eyeColor:"#2c6844",outfitPrimary:"#243878",outfitSecondary:"#f6f4f0",accentColor:"#e8c448",headgear:"eiki_yama",wings:"none",prop:"rod_of_remorse"},{id:"komachi-onozuka",shortName:"Komachi",locationId:"sanzu-river",region:"Netherworld",spotLabel:"Sanzu River Shore",x:.326,y:.172,quote:"“What’s the rush? The Sanzu River is wide as ever—Wait, is that Lady Eiki coming this way?!”",hairColor:"#d82848",hairStyle:"twintails",eyeColor:"#b8283c",outfitPrimary:"#2c4888",outfitSecondary:"#f4f2f6",accentColor:"#e8b848",headgear:"ribbon",wings:"none",prop:"scythe"},{id:"yuuma-toutetsu",shortName:"Yuuma",locationId:"animal-realm",region:"Otherworld",spotLabel:"Gouyoku Alliance Fortress",x:.072,y:.132,quote:"“Anything that falls into my giant iron spork—spirits, oil, or greed—is mine to devour!”",hairColor:"#e8ecf2",hairStyle:"wavy",eyeColor:"#c82834",outfitPrimary:"#28242c",outfitSecondary:"#b82834",accentColor:"#78b8e8",headgear:"oni_horns",wings:"none",prop:"spoon"},{id:"keiki-haniyasushin",shortName:"Keiki",locationId:"primate-spirit-garden",region:"Otherworld",spotLabel:"Primate Spirit Garden Plaza",x:.088,y:.078,quote:"“Oh! Let me sculpt a sacred Haniwa idol to protect you inside the Primate Spirit Garden.”",hairColor:"#48b8c8",hairStyle:"long",eyeColor:"#288898",outfitPrimary:"#346898",outfitSecondary:"#e8c468",accentColor:"#f4eef0",headgear:"patchouli_cap",wings:"none",prop:"katana"},{id:"satori-komeiji",shortName:"Satori",locationId:"palace-of-earth-spirits",region:"Underworld",spotLabel:"Chireiden Front Rose Approach",x:.112,y:.797,quote:"“You needn’t speak aloud—my Third Eye already hears the thoughts that brought you down to Chireiden.”",hairColor:"#d878a8",hairStyle:"bob",eyeColor:"#b84878",outfitPrimary:"#7898d8",outfitSecondary:"#f6d8e8",accentColor:"#e02848",headgear:"satori_band",wings:"satori_eye",prop:"none"},{id:"koishi-komeiji",shortName:"Koishi",locationId:"palace-of-earth-spirits",region:"Underworld",spotLabel:"Chireiden East Courtyard",x:.143,y:.798,quote:"“Wandering wherever the unconscious wind takes me—did you notice me standing right beside you?”",hairColor:"#78c498",hairStyle:"wavy",eyeColor:"#389878",outfitPrimary:"#f2ca48",outfitSecondary:"#2c5848",accentColor:"#386898",headgear:"koishi_hat",wings:"satori_eye",prop:"none",flipX:!0},{id:"utsuho-reiuji",shortName:"Okuu",locationId:"nuclear-furnace",region:"Underworld",spotLabel:"Blazing Hell Reactor Catwalk",x:.165,y:.908,quote:"“Warning! Warning! Subterranean Sun fusion output is at maximum inside the Nuclear Furnace!”",hairColor:"#382824",hairStyle:"long",eyeColor:"#c82834",outfitPrimary:"#287848",outfitSecondary:"#f4f2ee",accentColor:"#e83828",headgear:"okuu_ribbon",wings:"crow",prop:"control_rod"},{id:"rin-kaenbyou",shortName:"Orin",locationId:"remains-of-blazing-hell",region:"Underworld",spotLabel:"Blazing Hell Wheelbarrow Path",x:.132,y:.858,quote:"“Keeping Okuu’s reactor flames in check and chatting with the vengeful spirits along the catwalk!”",hairColor:"#b8282c",hairStyle:"braid",eyeColor:"#c87828",outfitPrimary:"#243c38",outfitSecondary:"#f2ece4",accentColor:"#d8382c",headgear:"cat_ears",wings:"none",prop:"lantern"},{id:"yuugi-hoshiguma",shortName:"Yuugi",locationId:"former-hell",region:"Underworld",spotLabel:"Former Hell Capital Tavern Street",x:.184,y:.802,quote:"“Welcome to the Old Capital! Win only if you do not spill a single drop from this red sake dish!”",hairColor:"#f4d862",hairStyle:"short",eyeColor:"#c82834",outfitPrimary:"#f4f2ec",outfitSecondary:"#2c3c68",accentColor:"#d82828",headgear:"oni_horns",wings:"none",prop:"gourd"},{id:"parsee-mizuhashi",shortName:"Parsee",locationId:"deep-road-to-hell",region:"Underworld",spotLabel:"Bridge to the Underworld",x:.266,y:.736,quote:"“Guarding the wind-swept bridge between the surface world and Former Hell… how enviable.”",hairColor:"#f4d868",hairStyle:"bob",eyeColor:"#389858",outfitPrimary:"#282434",outfitSecondary:"#388858",accentColor:"#e87898",headgear:"none",wings:"none",prop:"none"},{id:"shinki",shortName:"Shinki",locationId:"pandaemonium",region:"Otherworld",spotLabel:"Pandaemonium Crystal Approach",x:.102,y:.642,quote:"“As the Creator Goddess of Makai, everything in this demon realm—and little Alice—is my treasured creation.”",hairColor:"#d8dce8",hairStyle:"long",eyeColor:"#8838a8",outfitPrimary:"#c8283c",outfitSecondary:"#f6f2f8",accentColor:"#9848d8",headgear:"crown",wings:"angel",prop:"none"},{id:"watatsuki-no-yorihime",shortName:"Yorihime",locationId:"lunar-capital",region:"Otherworld",spotLabel:"Lunar Capital Jade Courtyard",x:.922,y:.098,quote:"“Channeling the myriad Shinto gods into my blade to guard the purity of the Lunar Capital.”",hairColor:"#683868",hairStyle:"ponytail",eyeColor:"#b82838",outfitPrimary:"#d8384c",outfitSecondary:"#f8f4f6",accentColor:"#f2ca48",headgear:"reimu_bow",wings:"none",prop:"katana"},{id:"junko",shortName:"Junko",locationId:"gensokyos-moon",region:"Otherworld",spotLabel:"Sea of Tranquility Shore",x:.881,y:.13,quote:"“Gazing across the Lunar Sea with purified, unwavering resolve.”",hairColor:"#f4c848",hairStyle:"long",eyeColor:"#c82834",outfitPrimary:"#24202c",outfitSecondary:"#c82834",accentColor:"#f4c848",headgear:"crown",wings:"none",prop:"orb"},{id:"okina-matara",shortName:"Okina",locationId:"land-of-the-back-door",region:"Otherworld",spotLabel:"Land of the Back Door Throne",x:.928,y:.862,quote:"“Behold the Hidden God of the Four Seasons! Every back door in Gensokyo opens at my command.”",hairColor:"#f4d458",hairStyle:"long",eyeColor:"#c87828",outfitPrimary:"#882838",outfitSecondary:"#282434",accentColor:"#f4c848",headgear:"koishi_hat",wings:"none",prop:"none"}],ra=new Map(Ue.map(e=>[e.id,e]));function wt(e){if(e)return ra.get(e)}const T=2400,G=1600;function xo(e){const t=e.replace(/\s*\([^)]*\)\s*/g,"").replace(/, Yamaxanadu$/i,"").trim();return({"Reisen II":"Reisen","Kirisame Family":"Marisa Kirisame","Hourai Doll":"Alice Margatroid","Shanghai Doll":"Alice Margatroid","Biten Son":"Son Biten"}[t]||t).toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}class na{constructor(){q(this,"state",{selectedId:null,selectedCharacterId:null,popupCharacterId:null,hoveredId:null,searchQuery:"",regionFilter:"All",kindFilter:"All",timeOfDay:"day",routeMode:!1,routeStartId:null,routeEndId:null,computedRoute:null,showFootprints:!0,showRoutes:!0,showResidents:!0,view3d:!1,zoom:{x:0,y:0,k:1}});q(this,"listeners",new Set);q(this,"locations",[]);q(this,"routes",[]);q(this,"characters",[]);q(this,"locMap",new Map);q(this,"charMap",new Map)}initData(t,o,r=[]){this.locations=t,this.routes=o,this.characters=r,this.locMap.clear();for(const n of t)this.locMap.set(n.id,n);this.charMap.clear();for(const n of r)this.charMap.set(n.id,n),this.charMap.set(xo(n.name_en),n)}getLocations(){return this.locations}getLocation(t){if(t)return this.locMap.get(t)}getCharacters(){return this.characters}getCharacter(t){if(t)return this.charMap.get(t)??this.charMap.get(xo(t))}getRoutes(){return this.routes}getState(){return this.state}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}update(t){this.state={...this.state,...t};for(const o of this.listeners)o(this.state)}setRouteEndpoints(t,o){let r=null;if(t&&o&&t!==o){const n=this.locMap.get(t),a=this.locMap.get(o);n&&a&&(r=this.computeShortestPath(n,a))}this.update({routeStartId:t,routeEndId:o,computedRoute:r})}computeShortestPath(t,o){const n=+(Math.hypot(o.x-t.x,o.y-t.y)*12).toFixed(2),a=Math.max(2,Math.round(n*2.2)),l=new Map;for(const h of this.routes)l.has(h.from)||l.set(h.from,[]),l.has(h.to)||l.set(h.to,[]),l.get(h.from).push({neighbor:h.to,route:h}),l.get(h.to).push({neighbor:h.from,route:h});const s=new Map,i=new Map,d=new Set;for(const h of this.locations)s.set(h.id,1/0);for(s.set(t.id,0);;){let h=null,f=1/0;for(const[b,g]of s.entries())!d.has(b)&&g<f&&(f=g,h=b);if(!h||h===o.id||f===1/0)break;d.add(h);const w=l.get(h)??[];for(const b of w){if(d.has(b.neighbor))continue;const g=f+b.route.minutes;g<(s.get(b.neighbor)??1/0)&&(s.set(b.neighbor,g),i.set(b.neighbor,{prevId:h,route:b.route}))}}if((s.get(o.id)??1/0)<1/0){const h=[],f=[];let w=o.id;for(;w;){const $=this.locMap.get(w);$&&h.unshift($);const p=i.get(w);if(!p)break;f.unshift(p.route),w=p.prevId}const b=f.reduce(($,p)=>$+p.minutes,0),g=+f.reduce(($,p)=>$+p.distance_km,0).toFixed(2);return{from:t,to:o,hops:h,segments:f,totalMinutes:b,totalKm:g,flightMinutes:a,crowKm:n,isDirectGraphPath:!0}}const c=Math.max(3,Math.round(n*15));return{from:t,to:o,hops:[t,o],segments:[],totalMinutes:c,totalKm:n,flightMinutes:a,crowKm:n,isDirectGraphPath:!1}}}const _=new na,bo=new Map;function sa(e){const t=e.replace("#",""),o=parseInt(t,16);return[o>>16&255,o>>8&255,o&255]}function Ge(e,t){const[o,r,n]=sa(e),a=l=>Math.max(0,Math.min(255,Math.round(l)));return`rgb(${a(o*t)},${a(r*t)},${a(n*t)})`}function Qe(e){const t=bo.get(e.id);if(t)return t;const o=32,r=36,n=document.createElement("canvas");n.width=o,n.height=r;const a=n.getContext("2d");a.clearRect(0,0,o,r);const l=Array.from({length:r},()=>Array(o).fill(null)),s=(u,x,m)=>{const k=e.flipX?o-1-Math.round(u):Math.round(u),I=Math.round(x);k>=0&&k<o&&I>=0&&I<r&&(l[I][k]=m)},i=(u,x,m,k,I)=>{for(let L=0;L<k;L++)for(let E=0;E<m;E++)s(u+E,x+L,I)},d=Ge(e.hairColor,.75),c=Ge(e.hairColor,1.18),h=Ge(e.outfitPrimary,.74),f="#ffe4d0",w="#f0c4a8",b="#ff92a6",g="#f8f6f4";if(e.id==="ran-yakumo"){const u="#f6d862",x="#fff8d4",m="#d8a838",k=[[4,15],[3,18],[4,21],[6,24],[16,13],[27,15],[28,18],[27,21],[25,24]];for(const[I,L]of k)i(I-2,L-1,4,3,u),s(I-2,L+1,m),s(I<16?I-2:I+1,L-1,x),s(I<16?I-3:I+2,L,x)}else if(e.id==="kanako-yasaka"){const u="#c89e58",x="#987238",m="#785030";for(let k=0;k<24;k++){const I=k/24*Math.PI*2,L=Math.round(16+Math.cos(I)*10),E=Math.round(17+Math.sin(I)*9);i(L-1,E-1,2,2,k%2===0?u:x)}i(4,15,3,4,m),i(25,15,3,4,m),i(5,22,3,4,m),i(24,22,3,4,m),i(7,20,2,4,g),i(23,20,2,4,g)}else if(e.id==="utsuho-reiuji"){i(7,18,18,11,"#163868"),i(9,19,14,9,"#1e5088");for(const[u,x]of[[9,21],[12,25],[19,20],[22,24],[15,27],[10,27]])s(u,x,"#98f0ff");s(11,22,g),s(20,23,g),i(2,14,6,8,"#1a1620"),i(3,14,4,2,"#981820"),i(24,14,6,8,"#1a1620"),i(25,14,4,2,"#981820"),s(1,17,"#1a1620"),s(1,19,"#1a1620"),s(30,17,"#1a1620"),s(30,19,"#1a1620")}else if(e.id==="toyosatomimi-no-miko")i(4,15,24,9,"#c82878"),i(5,16,22,7,"#e83858"),i(3,18,3,5,"#d82878"),i(26,18,3,5,"#d82878");else if(e.id==="junko")for(const[u,x]of[[4,14],[3,19],[5,24],[16,11],[27,14],[28,19],[26,24]])i(u-1,x-2,3,5,"#d848a8"),s(u,x-1,"#ff98e8");else if(e.id==="okina-matara"){i(6,10,20,20,"#4878a8"),i(8,12,16,16,"#1e2c38");for(let u=13;u<=26;u+=2)s(26,u,"#68e8cf"),s(28,u+1,"#f4c858")}else if(e.id==="minamitsu-murasa"){for(let u=0;u<16;u++)i(6+u,12+Math.floor(u*.7),3,2,"#c898a8");i(4,18,5,6,"#b88898"),i(22,10,5,5,"#c898a8")}else if(e.id==="nitori-kawashiro")i(18,15,9,11,"#886498"),i(19,16,7,9,"#9c78ac");else if(e.id==="mamizou-futatsuiwa")i(21,18,8,9,"#9c6e4c"),i(22,19,6,2,"#68442c"),i(22,23,6,2,"#68442c");else if(e.id==="momiji-inubashiri")i(21,20,6,6,g),i(25,22,3,4,"#e4e0dc");else if(e.id==="chen"||e.id==="rin-kaenbyou"){const u=e.id==="rin-kaenbyou"?"#58342c":"#684434";for(let x=0;x<6;x++)s(22+(x>>1),22-x,u),s(24+(x>>1),24-x,u);e.id==="rin-kaenbyou"&&(i(2,15,4,5,"#48a8ff"),i(3,17,2,2,g),i(25,12,4,5,"#48a8ff"),i(26,14,2,2,g))}else if(e.id==="shou-toramaru"||e.id==="seiga-kaku"||e.id==="iku-nagae"){const u=e.id==="iku-nagae"?"#e82828":g,x=e.id==="iku-nagae"?g:"#d8e4f8";i(4,12,4,12,u),i(24,12,4,12,u),i(8,10,16,3,x)}else if(e.id==="keiki-haniyasushin")i(3,14,4,12,"#ff6828"),i(25,13,4,13,"#ff6828"),i(5,24,22,4,"#ff8838");else if(e.id==="ariya-iwanaga")i(2,15,7,12,"#1e2832"),i(23,15,7,12,"#1e2832"),s(5,18,g),s(4,22,g),s(26,19,g),s(25,23,g),i(18,10,8,6,"#ff5824");else if(e.wings==="bat"){const u="#2a1836",x="#682c78";i(3,17,6,5,x),s(2,16,u),s(3,16,u),s(8,17,u),s(2,21,u),s(5,21,u),i(23,17,6,5,x),s(29,16,u),s(28,16,u),s(23,17,u),s(29,21,u),s(26,21,u)}else if(e.wings==="flandre_crystal"){const u="#281e28";for(let m=2;m<=10;m++)s(m,17+(m<5?1:0),u);for(let m=21;m<=29;m++)s(m,17+(m>26?1:0),u);const x=[[2,20,"#58b8ff"],[4,19,"#ff3848"],[7,19,"#ff9828"],[9,20,"#f8e838"],[22,20,"#48d868"],[24,19,"#4868f8"],[27,19,"#a848f8"],[29,20,"#ff68c8"]];for(const[m,k,I]of x)i(m,k-1,2,3,I),s(m,k,g)}else if(e.wings==="cirno_ice"){const u="#80ecff",x="#ecffff";for(const m of[-3,0,3])i(2,18+m,6,2,u),i(4,18+m,3,1,x),i(24,18+m,6,2,u),i(25,18+m,3,1,x);i(7,7,5,4,"#58c888"),i(20,7,5,4,"#58c888")}else if(e.wings==="fairy"){const u="#eefaff",x="#98dcf8";i(3,16,6,5,u),i(3,21,5,3,x),i(23,16,6,5,u),i(24,21,5,3,x)}else if(e.wings==="crow"){const u=e.id==="mystia-lorelei"?"#e898b8":"#1e1c28",x=e.id==="mystia-lorelei"?"#fcf0f6":"#443e58";i(2,16,6,6,u),i(3,16,4,2,x),i(24,16,6,6,u),i(25,16,4,2,x)}else e.wings==="angel"?(i(2,15,7,10,"#782898"),i(4,16,4,7,"#c858e8"),i(23,15,7,10,"#782898"),i(24,16,4,7,"#c858e8")):e.wings==="myon"&&(i(2,16,6,6,g),i(3,15,4,8,"#f0fcf8"),i(25,13,3,9,g));if(e.id==="yuyuko-saigyouji"&&(i(2,14,3,8,"#fce4f0"),s(3,15,g),i(27,15,3,8,"#fce4f0"),s(28,16,g)),e.hairStyle==="long"||e.hairStyle==="wavy"){const u=e.id==="fujiwara-no-mokou"||e.id==="kaguya-houraisan"||e.id==="shinki"?14:11;i(8,13,16,u,d),e.id==="byakuren-hijiri"?(i(7,18,18,6,"#e8b868"),i(6,20,4,4,"#f2ca78"),i(22,20,4,4,"#f2ca78")):(i(7,15,2,u-3,e.hairColor),i(23,15,2,u-3,e.hairColor))}else e.hairStyle==="twintails"?(i(5,11,4,10,e.hairColor),i(5,18,4,3,d),i(23,11,4,10,e.hairColor),i(23,18,4,3,d)):e.hairStyle==="side_tail"?(i(23,11,4,8,e.hairColor),s(25,13,c)):e.hairStyle==="ponytail"?i(21,9,5,8,d):e.hairStyle==="braid"&&(i(6,13,3,9,e.hairColor),i(6,21,3,2,g));if(e.id==="wakasagihime")i(11,24,10,4,"#a8dce8"),i(13,28,8,3,"#98cce0"),i(15,31,9,3,"#f4b8c8"),i(12,32,4,2,"#f4b8c8"),i(9,18,14,7,"#4c8858"),i(10,21,12,2,"#783888"),i(9,24,14,1,"#f4a8b8");else if(e.id==="fujiwara-no-mokou")i(10,18,12,5,g),i(12,18,1,5,"#d8382c"),i(19,18,1,5,"#d8382c"),i(15,18,2,3,"#d8382c"),i(9,22,6,10,"#d84434"),i(17,22,6,10,"#d84434"),i(11,22,10,3,"#d84434"),i(10,25,2,2,g),i(19,26,2,2,g),i(9,31,6,1,g),i(17,31,6,1,g),i(9,32,5,2,"#c82828"),i(18,32,5,2,"#c82828");else if(e.id==="rinnosuke-morichika")i(10,24,5,7,"#5868b8"),i(17,24,5,7,"#5868b8"),i(10,31,4,3,g),i(18,31,4,3,g),i(9,18,7,9,"#282830"),i(16,18,7,9,"#4858a8"),i(13,22,6,2,"#e86828");else{const u=e.id==="eiki-shiki"||e.id==="yuuka-kazami"?"#242028":g,x=e.id==="reimu-hakurei"||e.id==="remilia-scarlet"||e.id==="flandre-scarlet"||e.id==="rumia"||e.id==="medicine-melancholy"?"#d82834":e.id==="koakuma"||e.id==="tewi-inaba"||e.id==="kosuzu-motoori"?"#d88838":"#28202c";if(i(11,29,3,3,u),i(18,29,3,3,u),i(10,32,4,2,x),i(18,32,4,2,x),e.id==="utsuho-reiuji"&&i(10,29,4,5,"#888480"),e.id==="eirin-yagokoro")i(8,22,8,6,"#283888"),i(16,22,8,6,"#d42c3c"),i(8,28,16,1,g),i(10,18,6,5,"#d42c3c"),i(16,18,6,5,"#283888");else if(e.id==="tenshi-hinanawi"){i(8,22,16,6,"#2858b8");const m=["#ff3848","#ff9828","#f8e838","#48d868","#4898ff","#a858f8"];for(let k=0;k<6;k++)i(10+k*2,22,2,4,m[k]);i(8,28,16,1,g)}else if(e.id==="cirno"){i(8,22,16,5,"#2868d8");for(let m=8;m<=23;m++)i(m,m%2===0?26:27,1,m%2===0?3:2,g)}else if(e.id==="momiji-inubashiri"){i(8,22,16,5,"#1e1c24");for(let m=8;m<=23;m++)i(m,m%2===0?26:27,1,2,"#d82828");i(8,28,16,1,g)}else if(e.id==="marisa-kirisame"||e.id==="sakuya-izayoi"||e.id==="kosuzu-motoori"||e.id==="miyoi-okunoda"){const m=e.id==="marisa-kirisame"?"#2c2224":e.id==="sakuya-izayoi"?"#243a88":e.id==="kosuzu-motoori"?"#687838":"#f4a8b8",k=e.id==="kosuzu-motoori"?"#f4c868":e.id==="miyoi-okunoda"?"#1e6898":g;i(8,22,16,6,m),i(8,28,16,1,g),i(10,22,12,5,k),e.id==="miyoi-okunoda"&&i(12,25,8,2,g)}else if(e.id==="yukari-yakumo"||e.id==="ran-yakumo"||e.id==="kasen-ibaraki"||e.id==="okina-matara"){const m=e.id==="kasen-ibaraki"?"#888c28":e.id==="okina-matara"?"#285828":e.outfitPrimary,k=e.id==="ran-yakumo"?"#283888":e.id==="kasen-ibaraki"?"#d82828":e.id==="okina-matara"?"#e88828":g;i(8,22,16,6,m),i(12,20,8,8,k),i(13,21,6,6,g),i(14,22,4,4,k)}else if(e.id==="yuugi-hoshiguma")for(let m=8;m<=23;m++)i(m,22,1,7,m%2===0?"#2c4898":"#d82838");else if(e.id==="medicine-melancholy")i(7,22,18,6,"#d82c28"),i(10,24,3,1,"#201c24"),i(11,23,1,3,"#201c24"),i(19,24,3,1,"#201c24"),i(20,23,1,3,"#201c24");else if(e.id==="suwako-moriya")i(8,22,16,6,"#6844a8"),i(11,25,2,2,"#58d868"),i(18,26,2,2,"#58d868");else if(e.id==="byakuren-hijiri")i(8,22,16,7,"#201c24"),i(11,21,10,8,"#fceef4");else{i(8,22,16,6,e.outfitPrimary);for(let m=22;m<=27;m++)s(8,m,h),s(23,m,h);for(let m=8;m<=23;m++)s(m,28,m%2===0?e.outfitSecondary:e.outfitPrimary)}if(e.id==="reimu-hakurei"||e.id==="sanae-kochiya")i(10,17,12,5,e.outfitPrimary),i(12,18,8,4,e.id==="reimu-hakurei"?e.outfitPrimary:g),i(14,18,4,2,e.id==="reimu-hakurei"?"#f4d048":"#3878d8"),s(8,17,f),s(23,17,f),i(5,18,4,5,g),i(23,18,4,5,g),i(5,19,4,1,e.outfitPrimary),i(23,19,4,1,e.outfitPrimary);else if(e.id==="yuugi-hoshiguma")i(10,17,12,5,g),i(7,17,3,3,g),i(22,17,3,3,g),i(6,20,2,2,f),i(24,20,2,2,f);else if(e.id==="koishi-komeiji")i(10,17,12,5,"#f2b844"),i(6,18,4,4,"#f2b844"),i(22,18,4,4,"#f2b844"),i(13,17,6,2,"#488858");else if(e.id==="satori-komeiji")i(10,17,12,5,"#b8d4f4"),i(7,18,3,4,"#b8d4f4"),i(22,18,3,4,"#b8d4f4"),i(13,17,6,2,"#f498b8");else if(e.id==="utsuho-reiuji")i(10,17,12,5,g),i(7,17,3,4,g),i(22,17,3,4,g),i(14,18,4,4,"#ff2020"),i(15,19,2,2,"#ff9838");else if(e.id==="kanako-yasaka")i(10,17,12,5,"#d82834"),i(7,17,3,4,"#d82834"),i(22,17,3,4,"#d82834"),i(13,18,6,4,g),i(14,19,4,2,"#202028");else if(e.id==="eiki-shiki")i(10,17,12,5,"#284498"),i(8,17,3,2,"#f4d048"),i(21,17,3,2,"#f4d048"),i(7,19,3,3,g),i(22,19,3,3,g),i(14,17,4,2,"#d82838");else if(e.id==="kosuzu-motoori"){i(10,17,12,5,"#f4c868");for(let m=17;m<=21;m++)for(let k of[6,7,8,9,22,23,24,25])s(k,m,(k+m)%2===0?"#d8382c":g)}else e.id!=="eirin-yagokoro"&&(i(10,17,12,5,e.outfitPrimary),i(13,18,6,4,e.outfitSecondary),i(14,17,4,2,e.accentColor),i(7,17,3,4,e.outfitSecondary),i(22,17,3,4,e.outfitSecondary),s(7,21,f),s(24,21,f))}if(e.wings==="satori_eye"){const u=e.id==="koishi-komeiji"?"#8858b8":"#e82848",x=e.id==="koishi-komeiji"?"#9868c8":"#ff2848";for(let m=6;m<=25;m+=2)s(m,20,u),s(m,24,u);i(14,19,4,3,x),s(15,20,g),s(16,20,"#201824")}i(9,7,14,7,e.hairColor),i(8,9,16,6,e.hairColor);for(let u=10;u<=21;u+=2)s(u,8,c);i(10,10,12,7,f),i(9,11,14,5,f),i(11,16,10,1,w),i(8,10,2,7,e.hairColor),i(22,10,2,7,e.hairColor),s(8,16,d),s(23,16,d),e.id==="reimu-hakurei"?(i(7,12,2,4,g),i(23,12,2,4,g),s(7,12,"#d82834"),s(24,12,"#d82834")):e.id==="sakuya-izayoi"?(i(8,12,2,6,e.hairColor),i(22,12,2,6,e.hairColor),i(8,17,2,1,"#36a868"),i(22,17,2,1,"#36a868")):e.id==="sanae-kochiya"&&(i(22,12,2,5,g),s(22,14,"#58c878")),i(10,10,12,1,e.hairColor),s(11,11,e.hairColor),s(14,11,e.hairColor),s(16,11,e.hairColor),s(18,11,e.hairColor),s(20,11,e.hairColor);const $=e.eyeColor,p=e.id==="kogasa-tatara"?"#2878d8":e.eyeColor;switch(i(10,12,2,3,$),s(10,12,g),s(11,14,Ge($,1.25)),i(20,12,2,3,p),s(20,12,g),s(21,14,Ge(p,1.25)),i(9,14,1,1,b),i(22,14,1,1,b),e.headgear){case"reimu_bow":{i(5,4,7,5,"#d8242e"),i(20,4,7,5,"#d8242e"),i(13,5,6,3,"#f43842"),i(4,5,1,3,g),i(27,5,1,3,g);break}case"witch_hat":{i(4,6,24,3,"#1e1c26"),i(8,4,16,2,"#282434"),i(11,2,10,2,"#1e1c26"),i(14,1,6,1,"#1e1c26"),i(9,4,12,3,g),i(13,5,4,2,"#e8e4dc");break}case"mob_cap":{i(7,4,18,4,"#fcf4f8"),i(9,3,14,1,"#fcf4f8"),i(9,5,14,2,e.accentColor),e.id==="remilia-scarlet"&&(i(6,3,4,2,"#d82438"),i(22,3,4,2,"#d82438"));break}case"yukari_cap":{i(7,4,18,4,"#fcf6fc"),i(9,3,14,1,"#fcf6fc"),i(8,5,16,1,"#d8283c");break}case"ran_cap":{i(5,3,6,5,"#f8f6fc"),i(21,3,6,5,"#f8f6fc"),i(8,4,16,4,"#f8f6fc"),i(6,5,2,2,"#d83838"),i(24,5,2,2,"#d83838");break}case"chen_cap":{i(8,4,16,3,"#2c7848"),i(6,3,3,3,"#684434"),i(23,3,3,3,"#684434"),s(6,4,"#ffd848");break}case"maid_band":{i(9,5,14,2,g),i(7,6,2,2,"#36a868"),i(23,6,2,2,"#36a868");break}case"meiling_beret":{const u=e.id==="minamitsu-murasa"?g:"#887828";i(8,4,16,3,u),i(10,3,12,1,u),i(15,5,2,2,"#ffd848");break}case"patchouli_cap":{e.id==="eirin-yagokoro"?(i(8,4,8,3,"#d42c3c"),i(16,4,8,3,"#283888")):e.id==="iku-nagae"?(i(5,5,22,2,"#1e1c24"),i(9,3,14,2,"#1e1c24"),i(10,4,12,1,"#e82828")):e.id==="keiki-haniyasushin"?(i(8,4,16,3,"#288868"),i(9,6,14,1,"#f4c848")):(i(7,3,18,4,"#e8d0f0"),i(9,2,14,1,"#e8d0f0"),i(19,4,3,2,"#ffd848"));break}case"yuyuko_veil":{i(7,4,18,3,"#88c8f4"),i(12,3,8,4,g),i(15,4,2,2,"#e83858");break}case"tengu_tokin":{e.id==="mystia-lorelei"?i(8,4,16,3,"#683878"):(i(13,3,6,4,"#d82834"),i(10,5,3,1,"#d82834"),i(19,5,3,1,"#d82834"));break}case"kappa_cap":{e.id==="miyoi-okunoda"?(i(6,3,20,5,"#288898"),i(9,2,14,2,"#288898"),s(9,5,g),s(22,5,g)):(i(7,4,18,3,"#98b848"),i(9,3,14,1,"#a8c858"),i(6,6,20,1,"#789838"));break}case"suwako_hat":{e.id==="sanae-kochiya"?(i(19,6,4,3,"#58d878"),s(19,6,"#181820"),s(22,6,"#181820")):(i(4,6,24,2,"#d8b878"),i(8,4,16,2,"#e4c888"),i(10,2,3,3,g),s(11,3,"#181820"),i(19,2,3,3,g),s(20,3,"#181820"));break}case"miko_earmuffs":{i(7,2,4,5,e.hairColor),i(21,2,4,5,e.hairColor),i(7,10,2,4,"#f2ca48"),i(23,10,2,4,"#f2ca48");break}case"futo_eboshi":{i(11,1,10,6,"#3858a8"),i(11,3,10,1,g),i(11,5,10,1,g);break}case"eiki_yama":{i(7,2,18,5,"#1e2c58"),i(5,5,22,2,"#e8c448"),i(13,3,6,3,"#ffd848");break}case"tenshi_hat":{i(5,5,22,2,"#282430"),i(9,3,14,2,"#34303e"),i(19,4,3,2,"#ff8898"),i(17,4,2,2,"#58c868");break}case"koishi_hat":{i(5,5,22,2,"#24222c"),i(9,3,14,2,"#2e2c38"),i(7,3,5,3,"#f4b838");break}case"okuu_ribbon":{i(10,4,12,3,"#58b868");break}case"satori_band":{i(9,5,14,2,"#242028");break}case"oni_horns":{if(e.id==="yuugi-hoshiguma")i(15,2,2,5,"#ff2828"),s(15,6,"#ffd848");else if(e.id==="yuuma-toutetsu")i(5,3,5,4,"#b82428"),i(22,3,5,4,"#b82428"),i(4,5,3,3,"#68a8f8"),i(25,5,3,3,"#68a8f8");else{const u=e.id==="seija-kijin"?g:"#e8c888";i(6,2,3,5,u),i(23,2,3,5,u),e.id==="suika-ibuki"&&i(22,2,3,2,"#3858d8")}break}case"bunny_ears":{const u=e.id==="tewi-inaba"?g:"#f6d8e8",x="#ff98b8";i(8,1,4,6,u),i(9,2,2,4,x),i(20,1,4,6,u),i(21,2,2,4,x);break}case"wolf_ears":{if(e.id==="mamizou-futatsuiwa")i(6,3,20,4,"#388828"),i(12,2,2,2,"#d8c868"),i(18,2,2,2,"#d8c868");else{const u=e.id==="nazrin"?"#7c7884":g;i(7,3,4,4,u),s(8,5,"#ff98a8"),i(21,3,4,4,u),s(22,5,"#ff98a8"),e.id==="momiji-inubashiri"&&i(14,3,4,3,"#d82834")}break}case"cat_ears":{i(7,3,4,4,"#242028"),i(21,3,4,4,"#242028"),i(5,5,3,2,"#d82834"),i(24,5,3,2,"#d82834");break}case"crown":{e.id==="keine-kamishirasawa"?(i(10,3,12,4,"#384888"),i(14,1,6,2,"#e83838")):e.id==="junko"?(i(8,3,16,4,"#242028"),i(10,4,12,1,"#f4c848")):(i(10,3,12,4,"#f4d048"),s(15,5,"#e82838"));break}case"shinmy_bowl":{i(5,3,22,4,"#781820"),i(8,2,16,2,"#b82838"),i(7,6,18,1,"#f4b838");break}case"narumi_kasa":{i(3,4,26,3,"#d8d4c8"),i(7,2,18,2,"#e8e4dc");break}case"ribbon":{e.id==="kasen-ibaraki"?(i(6,4,4,4,"#fce4ec"),i(22,4,4,4,"#fce4ec")):i(18,4,6,3,e.accentColor);break}default:e.id==="byakuren-hijiri"&&(i(4,4,24,3,"#e8b868"),i(8,2,16,2,"#f2ca78"));break}if(e.id==="alice-margatroid")i(24,10,5,4,"#f6d868"),i(25,9,3,1,"#d82838"),i(24,14,5,4,"#242028"),i(25,15,3,2,g);else if(e.id==="sekibanki")i(2,8,6,6,"#e84858"),i(3,10,4,3,f),i(2,6,6,2,"#9898e8");else if(e.id==="suika-ibuki")i(4,22,6,6,"#f4c848"),i(24,25,4,4,"#f46888");else if(e.id==="eirin-yagokoro"){for(let u=7;u<=27;u++)s(27,u,"#282028");for(let u=18;u<=29;u++)s(u,18,g)}else e.id==="kogasa-tatara"&&(i(8,2,18,4,"#783898"),i(16,3,3,2,g),s(17,3,"#2858c8"),i(23,5,5,7,"#e82828"));switch(e.prop){case"gungnir":{for(let u=5;u<=30;u++)i(26,u,2,1,"#ff2848");i(24,7,6,2,"#ff7898"),i(26,3,2,3,g);break}case"laevateinn":{for(let u=6;u<=30;u++)i(26,u,2,1,"#ff3828");i(24,12,6,2,"#ffd848"),i(24,16,6,2,"#ffd848");break}case"gohei":{for(let u=12;u<=30;u++)s(26,u,"#8c5834");i(24,8,5,6,g),i(23,10,7,2,g);break}case"broom":{for(let u=7;u<=24;u++)i(26,u,2,1,"#c89838");i(23,24,7,7,"#e8c458"),i(24,24,5,1,"#c82834");break}case"katana":case"shield_sword":{for(let u=8;u<=25;u++)i(26,u,2,1,e.id==="tenshi-hinanawi"?"#ffd848":"#dce4f0");i(24,25,5,1,"#e8c448"),e.id==="momiji-inubashiri"&&(i(11,19,8,7,g),i(13,21,4,4,"#d82828"));break}case"parasol":{for(let u=5;u<=25;u++)s(25,u,"#683848");i(14,1,16,5,e.id==="yukari-yakumo"?"#fce8f4":"#f498b8"),i(14,5,16,1,"#e83858");break}case"control_rod":{i(5,18,5,9,"#f49838"),i(6,19,3,7,"#ffb858");break}case"scythe":{for(let u=5;u<=31;u++)s(27,u,"#784830");i(18,4,10,3,"#cfd8e8");break}case"spoon":{for(let u=0;u<18;u++)i(6+u,22-Math.floor(u*.6),2,2,"#b8c4d8");i(2,20,6,5,"#201c24");break}case"fan":{i(23,16,6,5,e.accentColor),i(24,17,4,3,g);break}case"book":case"scroll":{i(22,17,6,5,e.accentColor),i(23,18,4,3,"#f8f4e8");break}case"gourd":{e.id==="yuugi-hoshiguma"?i(4,16,6,2,"#e82828"):(i(24,19,5,6,"#e8a848"),i(25,18,3,1,"#c82828"));break}}const S="#1b121c";for(let u=0;u<r;u++)for(let x=0;x<o;x++){if(l[u][x]!==null)continue;(u>0&&l[u-1][x]!==null||u<r-1&&l[u+1][x]!==null||x>0&&l[u][x-1]!==null||x<o-1&&l[u][x+1]!==null)&&(a.fillStyle=S,a.fillRect(x,u,1,1))}for(let u=0;u<r;u++)for(let x=0;x<o;x++){const m=l[u][x];m&&(a.fillStyle=m,a.fillRect(x,u,1,1))}const y=n.toDataURL("image/png");return bo.set(e.id,y),y}function vo(e,t,o,r){const n=o.trim().toLowerCase(),a=Ue.map((l,s)=>{if(r!=="All"&&l.region!==r)return"";const i=_.getCharacter(l.id),d=!n||l.shortName.toLowerCase().includes(n)||l.spotLabel.toLowerCase().includes(n)||i&&(i.name_en.toLowerCase().includes(n)||i.name_jp.toLowerCase().includes(n)||i.title.toLowerCase().includes(n)),c=(l.x*T).toFixed(1),h=(l.y*G).toFixed(1),f=Qe(l),w=t===l.id,b=n&&!d?"is-dimmed":"",g=w?"is-selected":"",$=(s*.17%1.8).toFixed(2);return`
      <g
        class="map-resident ${g} ${b}"
        data-char-id="${l.id}"
        data-loc-id="${l.locationId}"
        transform="translate(${c}, ${h})"
      >
        <g class="resident-scale-wrap">
          <ellipse class="resident-shadow" cx="0" cy="2" rx="9.5" ry="3.8" />
          ${w?`<circle class="resident-select-ring" cx="0" cy="-11" r="17" stroke="${l.accentColor}" />`:""}
          <g class="resident-bob-wrap" style="animation-delay: -${$}s;">
            <image
              class="resident-pixel-img"
              href="${f}"
              x="-16"
              y="-33"
              width="32"
              height="36"
            />
          </g>
          <g class="resident-tag-group" transform="translate(0, 8)">
            <rect
              class="resident-tag-bg"
              x="-24"
              y="-5"
              width="48"
              height="10.5"
              rx="3"
              stroke="${l.accentColor}"
            />
            <text class="resident-tag-text" x="0" y="2.4" text-anchor="middle">${l.shortName}</text>
          </g>
        </g>
      </g>
    `}).join("");e.innerHTML=a}const vt={shrine:"#b6342a",temple:"#7b4b94",residence:"#b57c2e",village:"#2e6b56",landmark:"#8a5a36",water:"#366f8f",mountain:"#5c5449",forest:"#3d6b42",otherworld:"#63458a"};function $o(e,t){switch(e||t||""){case"hakurei-shrine":return`
        <g class="landmark-illust" transform="translate(0, -8)">
          <ellipse cx="1.5" cy="9.5" rx="19" ry="5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- 2.5D Honden Shrine Hall behind Torii -->
          <rect x="-15" y="-14" width="26" height="13" fill="#efe2c6" stroke="#2a1812" stroke-width="1.2" />
          <polygon points="11,-14 16,-11 16,-1 11,-1" fill="#cbb792" stroke="#2a1812" stroke-width="1.1" stroke-linejoin="round" />
          <line x1="-8" y1="-14" x2="-8" y2="-1" stroke="#7a2820" stroke-width="1.4" />
          <line x1="4" y1="-14" x2="4" y2="-1" stroke="#7a2820" stroke-width="1.4" />
          <path d="M -21 -13 Q -2 -25 17 -13 L 20 -10 L -18 -10 Z" fill="#593a28" stroke="#24140c" stroke-width="1.35" stroke-linejoin="round" />
          <line x1="-11" y1="-18.5" x2="9" y2="-18.5" stroke="#d9a74a" stroke-width="1.5" stroke-linecap="round" />
          <!-- Grand Crimson Shinto Torii Gate in Foreground -->
          <path d="M -20 -8.5 Q 0 -12.5 20 -8.5" fill="none" stroke="#b6342a" stroke-width="4.2" stroke-linecap="round" />
          <line x1="-15" y1="-4.5" x2="15" y2="-4.5" stroke="#b6342a" stroke-width="2.5" stroke-linecap="round" />
          <line x1="-12" y1="-8.5" x2="-13" y2="10.5" stroke="#b6342a" stroke-width="3.0" />
          <line x1="12" y1="-8.5" x2="13" y2="10.5" stroke="#b6342a" stroke-width="3.0" />
          <rect x="-15" y="8.5" width="4" height="3" fill="#2e2620" />
          <rect x="11" y="8.5" width="4" height="3" fill="#2e2620" />
          <!-- Shimenawa Rope & White Gohei Paper Zigzags -->
          <path d="M -11 -3.2 Q 0 -0.2 11 -3.2" fill="none" stroke="#d9b44a" stroke-width="1.8" />
          <polygon points="-6,-2.8 -8,2.5 -4,2.5" fill="#fffdf7" stroke="#5a4638" stroke-width="0.5" />
          <polygon points="0,-2.2 -2,3 2,3" fill="#fffdf7" stroke="#5a4638" stroke-width="0.5" />
          <polygon points="6,-2.8 4,2.5 8,2.5" fill="#fffdf7" stroke="#5a4638" stroke-width="0.5" />
        </g>
      `;case"scarlet-devil-mansion":return`
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="2" cy="10" rx="22" ry="5.5" fill="rgba(20, 8, 10, 0.38)" />
          <!-- Left & Right 2.5D Gothic Wings (Front Crimson Brick + Shaded East Wall) -->
          <rect x="-20" y="-6" width="38" height="16" fill="#942028" stroke="#240b0d" stroke-width="1.3" />
          <polygon points="18,-6 23,-3 23,10 18,10" fill="#5e1217" stroke="#240b0d" stroke-width="1.1" stroke-linejoin="round" />
          <polygon points="-22,-6 -12,-17 -2,-6" fill="#3a1620" stroke="#240b0d" stroke-width="1.2" />
          <polygon points="2,-6 12,-17 22,-6" fill="#3a1620" stroke="#240b0d" stroke-width="1.2" />
          <!-- Side Turret Spires -->
          <rect x="-19" y="-14" width="6" height="24" fill="#7a181e" stroke="#240b0d" stroke-width="1.2" />
          <polygon points="-20,-14 -16,-24 -12,-14" fill="#2b0f16" stroke="#240b0d" stroke-width="1.1" />
          <rect x="13" y="-14" width="6" height="24" fill="#7a181e" stroke="#240b0d" stroke-width="1.2" />
          <polygon points="12,-14 16,-24 20,-14" fill="#2b0f16" stroke="#240b0d" stroke-width="1.1" />
          <!-- 2.5D Tall Central Clock Tower -->
          <rect x="-6.5" y="-21" width="12" height="31" fill="#ab2630" stroke="#240b0d" stroke-width="1.4" />
          <polygon points="5.5,-21 9,-18.5 9,10 5.5,10" fill="#6e151c" stroke="#240b0d" stroke-width="1.1" stroke-linejoin="round" />
          <polygon points="-8.5,-21 0,-34 8.5,-21" fill="#2b0f16" stroke="#240b0d" stroke-width="1.3" />
          <line x1="0" y1="-34" x2="0" y2="-38" stroke="#d9a74a" stroke-width="1.4" />
          <!-- Illuminated Clock Face & Gothic Rose Windows -->
          <circle cx="-0.5" cy="-12.5" r="4.0" fill="#fff4c8" stroke="#240b0d" stroke-width="1.0" />
          <line x1="-0.5" y1="-12.5" x2="-0.5" y2="-15" stroke="#240b0d" stroke-width="1.0" />
          <line x1="-0.5" y1="-12.5" x2="1.8" y2="-12.5" stroke="#240b0d" stroke-width="1.0" />
          <rect x="-13" y="-2" width="3.5" height="6" rx="1.5" fill="#ffdf9e" />
          <rect x="8" y="-2" width="3.5" height="6" rx="1.5" fill="#ffdf9e" />
        </g>
      `;case"alices-house":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="2" cy="10" rx="20" ry="4.5" fill="rgba(22, 12, 6, 0.34)" />
          <!-- Blue-Grey Cobblestone Chimney on Left Roof Slope -->
          <rect x="-12" y="-20" width="4.5" height="7" fill="#688098" stroke="#242c38" stroke-width="1.0" />
          <rect x="-13" y="-21.5" width="6.5" height="1.8" fill="#f0ece4" stroke="#242c38" stroke-width="0.8" />
          <!-- Main Half-Timbered White Plaster Cottage (Left) -->
          <rect x="-18" y="-6" width="21" height="14" fill="#f5f2ec" stroke="#3b2618" stroke-width="1.3" />
          <line x1="-18" y1="1" x2="3" y2="1" stroke="#6b442a" stroke-width="1.3" />
          <line x1="-11" y1="-6" x2="-11" y2="8" stroke="#6b442a" stroke-width="1.2" />
          <line x1="-4" y1="-6" x2="-4" y2="8" stroke="#6b442a" stroke-width="1.2" />
          <!-- Lavender-Indigo Pitched Gable Roof with White Eave Trim -->
          <polygon points="-21,-5 -15,-16 3,-16 6,-5" fill="#686ca8" stroke="#282a48" stroke-width="1.3" stroke-linejoin="round" />
          <line x1="-15" y1="-16" x2="3" y2="-16" stroke="#484b7e" stroke-width="2.0" stroke-linecap="round" />
          <line x1="-20" y1="-5" x2="5" y2="-5" stroke="#ffffff" stroke-width="1.4" />
          <!-- 4-Pillar Covered Front Porch with Deep Indigo-Purple Awning & Stone Footings -->
          <polygon points="-20,1 -17,-3 1,-3 3,1" fill="#464a7e" stroke="#222442" stroke-width="1.1" />
          <line x1="-18" y1="1" x2="-18" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <line x1="-13" y1="1" x2="-13" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <line x1="-7" y1="1" x2="-7" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <line x1="-1" y1="1" x2="-1" y2="8" stroke="#6b442a" stroke-width="1.5" />
          <rect x="-19" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <rect x="-14" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <rect x="-8" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <rect x="-2" y="7.5" width="2.4" height="2" fill="#5e6878" />
          <!-- Attached 2-Story Octagonal Half-Timbered Tower on Right (AliceHouse.png) -->
          <rect x="2" y="-14" width="14" height="22" fill="#f5f2ec" stroke="#4a2e1b" stroke-width="1.3" />
          <polygon points="16,-14 20,-11 20,8 16,8" fill="#d8d2c5" stroke="#4a2e1b" stroke-width="1.1" />
          <line x1="2" y1="-3" x2="20" y2="-3" stroke="#6b442a" stroke-width="1.5" />
          <line x1="7" y1="-14" x2="7" y2="8" stroke="#6b442a" stroke-width="1.4" />
          <line x1="12" y1="-14" x2="12" y2="8" stroke="#6b442a" stroke-width="1.4" />
          <!-- Glowing Tower Windows with Pink Flower Planter Boxes -->
          <rect x="4" y="-11" width="2.6" height="4.5" fill="#ffdf9e" />
          <rect x="3.5" y="-6.8" width="3.6" height="1.6" fill="#e888b8" stroke="#4a2e1b" stroke-width="0.5" />
          <rect x="8.5" y="-11" width="2.6" height="4.5" fill="#ffdf9e" />
          <rect x="8" y="-6.8" width="3.6" height="1.6" fill="#e888b8" stroke="#4a2e1b" stroke-width="0.5" />
          <rect x="4" y="-0.5" width="2.6" height="4.5" fill="#ffdf9e" />
          <rect x="3.5" y="3.8" width="3.6" height="1.6" fill="#e888b8" stroke="#4a2e1b" stroke-width="0.5" />
          <!-- Conical Stepped Indigo-Purple Tower Roof -->
          <polygon points="0,-14 10,-25 22,-14" fill="#686ca8" stroke="#282a48" stroke-width="1.3" stroke-linejoin="round" />
        </g>
      `;case"marisas-house":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="2" cy="10.5" rx="21" ry="4.8" fill="rgba(22, 12, 6, 0.34)" />
          <!-- Two-Story Cream-Plaster Cottage (Left) -->
          <rect x="-18" y="-6" width="21" height="14" fill="#eae5d9" stroke="#2e2a24" stroke-width="1.3" />
          <!-- Dark Slate Roof & Twin Front Dormer Gables (MarisaHouse.png) -->
          <polygon points="-21,-5 -15,-16 3,-16 6,-5" fill="#4f565e" stroke="#22262b" stroke-width="1.3" stroke-linejoin="round" />
          <polygon points="-13,-8 -9,-13 -5,-8" fill="#636b75" stroke="#22262b" stroke-width="1.0" />
          <rect x="-10.5" y="-9.5" width="3" height="2.5" fill="#ffdf9e" />
          <polygon points="-4,-8 0,-13 4,-8" fill="#636b75" stroke="#22262b" stroke-width="1.0" />
          <rect x="-1.5" y="-9.5" width="3" height="2.5" fill="#ffdf9e" />
          <!-- Tall Cream Exterior Chimney on Front-Left with White Smoke Puffs -->
          <rect x="-17" y="-19" width="4.2" height="27" fill="#dfd9cc" stroke="#2e2a24" stroke-width="1.1" />
          <rect x="-17.8" y="-20" width="5.8" height="2" fill="#636b75" stroke="#22262b" stroke-width="0.9" />
          <circle cx="-15" cy="-23" r="2.2" fill="#ffffff" opacity="0.85" />
          <circle cx="-13" cy="-26" r="2.8" fill="#ffffff" opacity="0.70" />
          <!-- Climbing Green Ivy Vines & Shuttered Windows -->
          <path d="M -11 8 L -11 -3 M -3 8 L -3 -2" stroke="#487e36" stroke-width="2.4" stroke-linecap="round" />
          <rect x="-9" y="-3.5" width="3.5" height="3.5" fill="#ffdf9e" stroke="#4a3020" stroke-width="0.9" />
          <rect x="-1" y="-3.5" width="3.5" height="3.5" fill="#ffdf9e" stroke="#4a3020" stroke-width="0.9" />
          <!-- Attached Cylindrical Dark-Grey Stone Observatory/Silo Tower on Right (MarisaHouse.png) -->
          <rect x="3" y="-17" width="15" height="25" rx="3" fill="#5e646b" stroke="#22262a" stroke-width="1.3" />
          <line x1="7" y1="-17" x2="7" y2="8" stroke="#787f87" stroke-width="1.3" />
          <line x1="13" y1="-17" x2="13" y2="8" stroke="#787f87" stroke-width="1.3" />
          <path d="M 2 -16 Q 10.5 -24 19 -16 Z" fill="#454b52" stroke="#1e2226" stroke-width="1.3" />
          <rect x="8.5" y="-11" width="3" height="3.5" fill="#eae5d9" stroke="#22262a" stroke-width="0.8" />
          <rect x="8.5" y="-3" width="3" height="3.5" fill="#eae5d9" stroke="#22262a" stroke-width="0.8" />
          <!-- Foreground Stone Garden Wall & Purple Lupine Flower Spikes (MarisaHouse.png bottom-right) -->
          <rect x="-1" y="6.5" width="19" height="3.2" rx="1" fill="#858a90" stroke="#2e3236" stroke-width="0.9" />
          <polygon points="1,6.5 2.2,1.5 3.4,6.5" fill="#cbb4f0" stroke="#5e4488" stroke-width="0.6" />
          <polygon points="5,6.5 6.2,1.0 7.4,6.5" fill="#d8c4f8" stroke="#5e4488" stroke-width="0.6" />
          <polygon points="9,6.5 10.2,1.8 11.4,6.5" fill="#cbb4f0" stroke="#5e4488" stroke-width="0.6" />
          <polygon points="13,6.5 14.2,1.2 15.4,6.5" fill="#d8c4f8" stroke="#5e4488" stroke-width="0.6" />
        </g>
      `;case"hieda-estate":case"hieda":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- White Plaster Tsukiji-bei Compound Wall -->
          <rect x="-17" y="-5" width="34" height="14" rx="1.5" fill="#e8dfc8" stroke="#f7f2e6" stroke-width="2.2" />
          <rect x="-17" y="-5" width="34" height="14" rx="1.5" fill="none" stroke="#262930" stroke-width="1.1" />
          <!-- Central Koi Pond & Arched Vermilion Bridge -->
          <ellipse cx="4" cy="3" rx="9.5" ry="5.2" fill="#2e7bb5" stroke="#4a6348" stroke-width="0.9" />
          <rect x="0" y="-0.5" width="8" height="3.8" rx="1" transform="rotate(-18 4 1.5)" fill="#c82e24" stroke="#24100c" stroke-width="0.8" />
          <!-- Two-Story Black-Roofed Hieda Main Mansion -->
          <rect x="-13" y="-12" width="20" height="9" fill="#f7f2e6" stroke="#1e2226" stroke-width="1.1" />
          <polygon points="-16,-5 -11,-13 5,-13 10,-5" fill="#262930" stroke="#14161a" stroke-width="1.2" />
          <polygon points="-12,-10 -8,-18 2,-18 6,-10" fill="#323640" stroke="#14161a" stroke-width="1.1" />
          <!-- Green Courtyard Trees -->
          <circle cx="-10" cy="3.5" r="4.2" fill="#3e7432" stroke="#1b3814" stroke-width="0.8" />
          <circle cx="12" cy="-3.5" r="3.8" fill="#48843a" stroke="#1b3814" stroke-width="0.8" />
        </g>
      `;case"moriya-branch-shrine":return`
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="1" cy="10" rx="13" ry="3.5" fill="rgba(22, 12, 6, 0.30)" />
          <!-- Tapered 4-Legged Steel Lattice Tower Frame -->
          <line x1="-9" y1="9" x2="-2.2" y2="-22" stroke="#dfe3ec" stroke-width="2.2" stroke-linecap="round" />
          <line x1="9" y1="9" x2="2.2" y2="-22" stroke="#785038" stroke-width="2.2" stroke-linecap="round" />
          <!-- Horizontal Ring Struts & Diagonal X-Bracing -->
          <line x1="-7.5" y1="2" x2="7.5" y2="2" stroke="#dfe3ec" stroke-width="1.4" />
          <line x1="-5.8" y1="-6" x2="5.8" y2="-6" stroke="#dfe3ec" stroke-width="1.3" />
          <line x1="-4.0" y1="-14" x2="4.0" y2="-14" stroke="#dfe3ec" stroke-width="1.2" />
          <line x1="-2.4" y1="-22" x2="2.4" y2="-22" stroke="#dfe3ec" stroke-width="1.2" />
          <path d="M -8.5 8 L 7.2 2 L -5.5 -6 L 4.0 -14 L -2.2 -22 M 8.5 8 L -7.2 2 L 5.5 -6 L -4.0 -14 L 2.2 -22" fill="none" stroke="#8c5e42" stroke-width="1.0" />
          <!-- Overgrown Climbing Green Forest Vines (RadioTower.png) -->
          <circle cx="-5.5" cy="3" r="3.2" fill="#3e742e" stroke="#1e3c16" stroke-width="0.7" />
          <circle cx="4.5" cy="-3" r="3.0" fill="#4e8c3a" stroke="#1e3c16" stroke-width="0.7" />
          <circle cx="-2.8" cy="-10" r="2.6" fill="#3e742e" stroke="#1e3c16" stroke-width="0.7" />
          <circle cx="2.0" cy="-17" r="2.2" fill="#4e8c3a" stroke="#1e3c16" stroke-width="0.7" />
          <!-- Top Silver Lightning-Rod Antenna Mast -->
          <line x1="0" y1="-22" x2="0" y2="-31" stroke="#eef2f8" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="0" cy="-31" r="1.3" fill="#ffffff" />
        </g>
      `;case"moriya-shrine":return`
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="1.5" cy="10" rx="21" ry="4.8" fill="rgba(22, 12, 6, 0.34)" />
          <!-- Four Towering Rope-Bound Onbashira Cedar Pillars -->
          <line x1="-18" y1="-22" x2="-18" y2="9" stroke="#6e4427" stroke-width="3.4" stroke-linecap="round" />
          <line x1="18" y1="-22" x2="18" y2="9" stroke="#6e4427" stroke-width="3.4" stroke-linecap="round" />
          <line x1="-12" y1="-18" x2="-12" y2="7" stroke="#8c5a34" stroke-width="2.6" stroke-linecap="round" />
          <line x1="12" y1="-18" x2="12" y2="7" stroke="#8c5a34" stroke-width="2.6" stroke-linecap="round" />
          <!-- Elevated Honden Sanctuary behind Haiden -->
          <polygon points="-11,-10 0,-21 11,-10" fill="#225e4e" stroke="#123028" stroke-width="1.2" />
          <!-- Wide Patinated Green-Copper Roofed Haiden Worship Hall & Chigi Gables -->
          <rect x="-13" y="-3" width="26" height="11" fill="#f5eee0" stroke="#2e241b" stroke-width="1.3" />
          <polygon points="-17,-2 -11,-13 11,-13 17,-2" fill="#296e5c" stroke="#14362c" stroke-width="1.4" stroke-linejoin="round" />
          <polygon points="-7,-1 0,-9 7,-1" fill="#368570" stroke="#d9b44a" stroke-width="1.0" />
          <!-- Heavy Braided Shimenawa Rope & White Shide Streamers -->
          <path d="M -11 -1.5 Q 0 2.5 11 -1.5" fill="none" stroke="#d9b44a" stroke-width="2.0" />
          <polygon points="-5,-1 -6.5,3.5 -3.5,3.5" fill="#ffffff" />
          <polygon points="0,-0.5 -1.5,4 1.5,4" fill="#ffffff" />
          <polygon points="5,-1 3.5,3.5 6.5,3.5" fill="#ffffff" />
        </g>
      `;case"tengu-village":case"nine-heavens-waterfall":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="10" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- Craggy Cliff & Cascading White Waterfall -->
          <rect x="-16" y="-8" width="32" height="17" rx="2" fill="#6e665c" stroke="#2b2620" stroke-width="1.2" />
          <rect x="-12" y="-8" width="7" height="17" fill="#58ace0" />
          <line x1="-8.5" y1="-7" x2="-8.5" y2="8" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="3 2" />
          <!-- Arched Vermilion Suspension Bridge across Waterfall -->
          <path d="M -16 2 Q -8 -2 0 2" fill="none" stroke="#c82824" stroke-width="3.2" stroke-linecap="round" />
          <!-- Multi-Tier Red-Pillared Tengu Watchtower on Right Cliff -->
          <rect x="1" y="-12" width="12" height="18" fill="#b82824" stroke="#24100c" stroke-width="1.1" />
          <polygon points="-2,-5 7,-13 16,-5" fill="#2c3038" stroke="#14161a" stroke-width="1.2" />
          <polygon points="0,-12 7,-20 14,-12" fill="#383e48" stroke="#14161a" stroke-width="1.2" />
          <!-- Fiery Crimson & Gold Autumn Maples -->
          <circle cx="-14" cy="-9" r="4.5" fill="#cf3824" stroke="#4a140c" stroke-width="0.8" />
          <circle cx="15" cy="3" r="4.0" fill="#e08824" stroke="#4a280c" stroke-width="0.8" />
        </g>
      `;case"eientei":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="21" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <!-- Rear 3-Story Eientei Pagoda Spire (Right) & Full Moon -->
          <circle cx="-11" cy="-16" r="4.5" fill="#fff2a6" stroke="#8c6d1f" stroke-width="0.9" />
          <rect x="8" y="-19" width="7" height="18" fill="#dfd2bc" stroke="#24170e" stroke-width="1.0" />
          <polygon points="5,-11 11.5,-16 18,-11" fill="#2b3038" stroke="#14161a" stroke-width="1.1" />
          <polygon points="6,-16 11.5,-22 17,-16" fill="#2b3038" stroke="#14161a" stroke-width="1.1" />
          <line x1="11.5" y1="-22" x2="11.5" y2="-26" stroke="#d9b44a" stroke-width="1.3" />
          <!-- Grand Multi-Bay Shinden Hall with Karahafu Entrance Gable -->
          <rect x="-17" y="-3" width="32" height="10" fill="#f5eee0" stroke="#2b1e14" stroke-width="1.2" />
          <path d="M -22 -2 L -14 -12 L 13 -12 L 21 -2 Z" fill="#2b3038" stroke="#14161a" stroke-width="1.4" stroke-linejoin="round" />
          <polygon points="-6,-2 0,-8 6,-2" fill="#3a404a" stroke="#d9b44a" stroke-width="1.0" />
          <!-- Foreground Rectangular Stone Pond & Twin Bridges -->
          <rect x="-14" y="5.5" width="28" height="4.5" rx="1" fill="#2e729e" stroke="#5c564c" stroke-width="0.9" />
          <rect x="-8" y="4.8" width="3.5" height="5.8" fill="#9c6a3e" />
          <rect x="4.5" y="4.8" width="3.5" height="5.8" fill="#9c6a3e" />
        </g>
      `;case"muenzuka":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="19" ry="4.2" fill="rgba(22, 12, 6, 0.30)" />
          <!-- Weathered Wooden Outside World Gatehouse Pavilion (Left) -->
          <rect x="-16" y="-4" width="13" height="11" fill="#8c6244" stroke="#2b1c12" stroke-width="1.1" />
          <polygon points="-19,-3 -13,-12 -5,-12 0,-3" fill="#3a2c24" stroke="#1e1510" stroke-width="1.2" />
          <!-- Cascading Purple-Pink Weeping Cherry Tree (Shidarezakura) on Right -->
          <path d="M 8 8 L 8 -6 M 8 -2 L 3 -7 M 8 -3 L 13 -7" stroke="#4a2c21" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="8" cy="-10" r="8.5" fill="#d878b4" stroke="#6e2854" stroke-width="1.1" />
          <circle cx="6" cy="-12" r="5.5" fill="#f4b2dc" />
          <!-- Stone Stele Gravestones & Red Spider Lilies -->
          <rect x="-2" y="1" width="3.5" height="7" rx="1" fill="#968f84" stroke="#36312b" stroke-width="0.9" />
          <rect x="3" y="2" width="3.2" height="6" rx="1" fill="#968f84" stroke="#36312b" stroke-width="0.9" />
          <circle cx="-7" cy="8" r="2.4" fill="#d62828" />
          <circle cx="13" cy="8" r="2.4" fill="#d62828" />
        </g>
      `;case"heaven":return`
        <g class="landmark-illust" transform="translate(0, -7)">
          <!-- Billowy White Unkai Cloud Platform -->
          <path d="M -20 5 C -22 0, -14 -3, -8 0 C -4 -4, 6 -4, 10 0 C 16 -3, 22 0, 20 5 C 16 10, -16 10, -20 5 Z" fill="#fffdf7" stroke="#8c9bb0" stroke-width="1.2" />
          <!-- Golden & Vermilion Celestial Palace Pavilion -->
          <rect x="-10" y="-8" width="20" height="10" fill="#d43228" stroke="#3b1410" stroke-width="1.1" />
          <polygon points="-15,-7 -9,-16 9,-16 15,-7" fill="#e8b842" stroke="#5c4210" stroke-width="1.3" />
          <polygon points="-10,-13 0,-21 10,-13" fill="#f4ca58" stroke="#5c4210" stroke-width="1.1" />
          <!-- Pink Heavenly Peach Trees & Arched White Marble Bridge -->
          <circle cx="-14" cy="-3" r="4.5" fill="#f498b8" stroke="#7a2c48" stroke-width="0.8" />
          <circle cx="14" cy="-3" r="4.5" fill="#f498b8" stroke="#7a2c48" stroke-width="0.8" />
          <path d="M -6 5 Q 0 1 6 5" fill="none" stroke="#e8e4dc" stroke-width="2.4" stroke-linecap="round" />
        </g>
      `;case"youkai-mountain":return`
        <g class="landmark-illust" transform="translate(0, -5)">
          <polygon points="-20,9 -5,-19 10,9" fill="#6e6559" stroke="#2b2620" stroke-width="1.4" />
          <polygon points="-6,9 7,-15 20,9" fill="#857a6b" stroke="#2b2620" stroke-width="1.4" />
          <!-- Snow-Crowned Summit Ridge -->
          <polygon points="-5,-19 -11,-7 1,-7" fill="#f7f4ec" />
          <polygon points="7,-15 3,-7 11,-7" fill="#f7f4ec" />
          <!-- Multi-Colored Autumn Foothill Foliage & Drifting Mid-Slope Mist -->
          <circle cx="-13" cy="5" r="4.2" fill="#cf3824" />
          <circle cx="-5" cy="6" r="4.5" fill="#e08824" />
          <circle cx="4" cy="6" r="4.2" fill="#487e36" />
          <circle cx="13" cy="5" r="4.2" fill="#d95824" />
          <path d="M -16 -1 Q -6 -4 4 -1 T 18 -1" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.85" />
        </g>
      `;case"human-village":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="10" rx="19" ry="4.5" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="-16" y="-4" width="29" height="14" fill="#efe2c6" stroke="#3b2818" stroke-width="1.4" />
          <polygon points="13,-4 18,-1 18,10 13,10" fill="#c7b28c" stroke="#3b2818" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M -21 -3.5 Q -1 -17.5 18 -3.5 L 21 -1.5 L -19 -1.5 Z" fill="#262930" stroke="#14161a" stroke-width="1.4" stroke-linejoin="round" />
          <line x1="-10" y1="-10.5" x2="9" y2="-10.5" stroke="#d9a74a" stroke-width="1.5" stroke-linecap="round" />
          <rect x="-5.5" y="0" width="9.5" height="10" rx="4.2" fill="#2b1b0f" />
          <circle cx="-0.5" cy="-14" r="2.8" fill="#4a6b5d" stroke="#243830" stroke-width="1" />
        </g>
      `;case"myouren-temple":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="2" cy="10" rx="20" ry="4.8" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="10" y="-18" width="6.5" height="26" fill="#784e35" stroke="#24180e" stroke-width="1.1" />
          <polygon points="16.5,-18 19.5,-16 19.5,8 16.5,8" fill="#4f3220" stroke="#24180e" stroke-width="1.0" />
          <path d="M 7.5 -7.5 L 21.5 -7.5 M 8.5 -12.5 L 20.5 -12.5 M 9.5 -17.5 L 19.5 -17.5" stroke="#383e45" stroke-width="2.5" stroke-linecap="round" />
          <line x1="14" y1="-18" x2="14" y2="-24" stroke="#d9a74a" stroke-width="1.5" />
          <rect x="-17" y="-3" width="25" height="13" fill="#efe2c6" stroke="#2e2925" stroke-width="1.3" />
          <polygon points="8,-3 12,-0.5 12,10 8,10" fill="#c9b898" stroke="#2e2925" stroke-width="1.1" stroke-linejoin="round" />
          <path d="M -22 -2.5 Q -12 -14.5 -3 -16.5 Q 6 -14.5 15 -2.5 Z" fill="#454c54" stroke="#1f2226" stroke-width="1.45" stroke-linejoin="round" />
          <circle cx="-3" cy="-17" r="2.4" fill="#d9a74a" />
        </g>
      `;case"hall-of-dreams":case"mausoleum":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="18" ry="4.2" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="-15" y="-2" width="27" height="11" fill="#f5ead2" stroke="#4a3219" stroke-width="1.3" />
          <polygon points="12,-2 16,0.5 16,9 12,9" fill="#d4c29e" stroke="#4a3219" stroke-width="1.1" />
          <path d="M -20 -1.5 Q -1 -14.5 19 -1.5 Z" fill="#c8963e" stroke="#4a3219" stroke-width="1.4" />
          <path d="M -14 -8 Q -0.5 -19 13 -8 Z" fill="#dab056" stroke="#4a3219" stroke-width="1.2" />
          <circle cx="-0.5" cy="-16.5" r="2.5" fill="#fff6c2" stroke="#4a3219" stroke-width="0.9" />
        </g>
      `;case"kourindou":return`
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="16" ry="3.8" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-13" y="-4" width="22" height="13" fill="#f0e4ce" stroke="#2b1a10" stroke-width="1.3" />
          <polygon points="9,-4 13,-1.5 13,9 9,9" fill="#c7b592" stroke="#2b1a10" stroke-width="1.1" />
          <line x1="-13" y1="2" x2="9" y2="2" stroke="#5c3824" stroke-width="1.3" />
          <polygon points="-17,-3.5 0,-16 15,-3.5" fill="#2e6b56" stroke="#16382c" stroke-width="1.4" />
          <rect x="-4" y="-11" width="8" height="6" fill="#6e4228" stroke="#1b2922" stroke-width="1" />
          <circle cx="0" cy="-8" r="2.2" fill="#ffe58f" />
        </g>
      `;case"mugenkan":case"garden-of-the-sun":return`
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="17" ry="4.0" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-14" y="-5" width="26" height="13" fill="#9e382e" stroke="#2b1210" stroke-width="1.2" />
          <polygon points="-17,-4 0,-15 15,-4" fill="#323842" stroke="#181c22" stroke-width="1.3" />
          <circle cx="-11" cy="7" r="3.6" fill="#f0b924" stroke="#6e4410" stroke-width="0.7" />
          <circle cx="0" cy="7.5" r="3.6" fill="#f0b924" stroke="#6e4410" stroke-width="0.7" />
          <circle cx="11" cy="7" r="3.6" fill="#f0b924" stroke="#6e4410" stroke-width="0.7" />
        </g>
      `;case"mayohiga":return`
        <g class="landmark-illust" transform="translate(0, -5)">
          <ellipse cx="1.5" cy="9.5" rx="17" ry="4.0" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-14" y="-3" width="26" height="11" fill="#f2e6ce" stroke="#2b1e14" stroke-width="1.2" />
          <polygon points="-18,-2 -12,-13 12,-13 18,-2" fill="#383442" stroke="#1a1820" stroke-width="1.3" />
          <circle cx="-13" cy="-8" r="4.0" fill="#d94828" />
          <circle cx="14" cy="-7" r="4.0" fill="#e88824" />
        </g>
      `;case"mokous-house":return`
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1" cy="8.5" rx="13" ry="3.2" fill="rgba(22, 12, 6, 0.28)" />
          <rect x="-9" y="-1" width="18" height="9" fill="#d8c8a8" stroke="#3b2818" stroke-width="1.1" />
          <polygon points="-13,0 0,-11 13,0" fill="#8c6e42" stroke="#3b2818" stroke-width="1.2" />
          <line x1="-11" y1="8" x2="-11" y2="-10" stroke="#2e6b3e" stroke-width="2.0" />
          <line x1="11" y1="8" x2="11" y2="-11" stroke="#2e6b3e" stroke-width="2.0" />
        </g>
      `;case"three-fairies-tree":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1" cy="9.5" rx="14" ry="3.5" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-6" y="-4" width="12" height="13" rx="2" fill="#6e482c" stroke="#2b1a0e" stroke-width="1.2" />
          <circle cx="0" cy="2" r="2.8" fill="#ffdf88" stroke="#2b1a0e" stroke-width="0.8" />
          <circle cx="-7" cy="-9" r="7.5" fill="#467a38" stroke="#1e3c16" stroke-width="1.0" />
          <circle cx="7" cy="-9" r="7.5" fill="#467a38" stroke="#1e3c16" stroke-width="1.0" />
          <circle cx="0" cy="-13" r="8.5" fill="#589446" stroke="#1e3c16" stroke-width="1.1" />
        </g>
      `;case"asama-purifying-mountain":return`
        <g class="landmark-illust" transform="translate(0, -5)">
          <polygon points="-16,8 -10,-2 10,-2 16,8" fill="#7a7468" stroke="#2b2824" stroke-width="1.2" />
          <polygon points="-11,-2 -6,-10 6,-10 11,-2" fill="#948e82" stroke="#2b2824" stroke-width="1.2" />
          <polygon points="-5,-10 0,-18 5,-10" fill="#e8b842" stroke="#4a3610" stroke-width="1.1" />
        </g>
      `;case"shining-needle-castle":return`
        <g class="landmark-illust" transform="translate(0, -8)">
          <rect x="-13" y="-18" width="23" height="8" fill="#efe4ce" stroke="#2b1e16" stroke-width="1.2" />
          <polygon points="10,-18 14,-16 14,-10 10,-10" fill="#c9b898" stroke="#2b1e16" stroke-width="1.1" />
          <path d="M -18 -10 L 18 -10 L 13 -5 L -13 -5 Z" fill="#8f242c" stroke="#2b1e16" stroke-width="1.3" />
          <rect x="-9" y="-5" width="16" height="7" fill="#efe4ce" stroke="#2b1e16" stroke-width="1.2" />
          <polygon points="-13,2 13,2 0,13" fill="#6e1b22" stroke="#2b1e16" stroke-width="1.3" />
        </g>
      `;case"hakugyokurou":case"saigyou-ayakashi":return`
        <g class="landmark-illust" transform="translate(0, -7)">
          <ellipse cx="1" cy="9.5" rx="14" ry="3.6" fill="rgba(22, 12, 6, 0.28)" />
          <path d="M -13 -6 C -15 -11, -10 -16, -5 -15 C -2 -20, 4 -20, 7 -15 C 12 -16, 15 -10, 12 -5 C 10 -2, -10 -2, -13 -6 Z" fill="#f5a6c4" stroke="#8a3858" stroke-width="1.1" />
          <path d="M -9 -9 C -10 -13, -5 -18, 0 -17 C 5 -18, 9 -13, 8 -9 C 5 -6, -5 -6, -9 -9 Z" fill="#ffd1e3" stroke="#8a3858" stroke-width="1.0" />
          <path d="M 0 9 L 0 -6 M 0 -2 L -6 -8 M 0 -3 L 6 -8" stroke="#4a2c21" stroke-width="2.4" stroke-linecap="round" />
        </g>
      `;case"palace-of-earth-spirits":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="10" rx="17" ry="4.2" fill="rgba(20, 8, 18, 0.36)" />
          <rect x="-14" y="-5" width="25" height="15" fill="#4f304e" stroke="#1a0e19" stroke-width="1.3" />
          <polygon points="11,-5 15,-2.5 15,10 11,10" fill="#331c32" stroke="#1a0e19" stroke-width="1.1" />
          <polygon points="-17,-4.5 -0.5,-18.5 16,-4.5" fill="#732242" stroke="#1a0e19" stroke-width="1.4" />
          <ellipse cx="-1" cy="1" rx="6" ry="3.8" fill="#ff4d73" stroke="#ffd6e0" stroke-width="1.1" />
          <circle cx="-1" cy="1" r="1.8" fill="#240812" />
        </g>
      `;case"former-hell":case"former-capital":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <ellipse cx="1.5" cy="9.5" rx="17" ry="4" fill="rgba(22, 12, 6, 0.32)" />
          <rect x="-14" y="-1" width="25" height="10" fill="#e6d4b5" stroke="#2b1c12" stroke-width="1.3" />
          <polygon points="11,-1 15,1.5 15,9 11,9" fill="#baa482" stroke="#2b1c12" stroke-width="1.1" />
          <polygon points="-18,-1 0,-11 18,-1" fill="#593e2e" stroke="#2b1c12" stroke-width="1.3" />
          <rect x="-9" y="-10" width="18" height="6" fill="#f0e0c4" stroke="#2b1c12" stroke-width="1.2" />
          <polygon points="-13,-10 0,-19 13,-10" fill="#473023" stroke="#2b1c12" stroke-width="1.3" />
          <circle cx="-7" cy="3" r="1.8" fill="#ffae42" />
          <circle cx="6" cy="3" r="1.8" fill="#ffae42" />
        </g>
      `;case"nuclear-furnace":case"remains-of-blazing-hell":case"blazing-hell":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <polygon points="-11,9 -8,-11 8,-11 11,9" fill="#544946" stroke="#1f1715" stroke-width="1.4" />
          <line x1="-5" y1="-7" x2="-6" y2="6" stroke="#ff5e2b" stroke-width="1.6" />
          <line x1="0" y1="-7" x2="0" y2="6" stroke="#ff9d2b" stroke-width="1.6" />
          <line x1="5" y1="-7" x2="6" y2="6" stroke="#ff5e2b" stroke-width="1.6" />
          <path d="M -7 -11 Q -3 -20 0 -13 Q 4 -22 7 -11" fill="#ff4d24" stroke="#ffcf5c" stroke-width="1" />
        </g>
      `;case"lunar-capital":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <rect x="-14" y="-2" width="25" height="10" fill="#f7f4ec" stroke="#364254" stroke-width="1.3" />
          <polygon points="11,-2 15,0.5 15,8 11,8" fill="#d5d0c5" stroke="#364254" stroke-width="1.1" />
          <path d="M -19 -2 Q 0 -14 19 -2 Z" fill="#587091" stroke="#283547" stroke-width="1.4" />
          <path d="M -12 -9 Q 0 -19 12 -9 Z" fill="#748eb0" stroke="#283547" stroke-width="1.2" />
          <circle cx="0" cy="-17" r="2.8" fill="#ffe885" />
        </g>
      `;case"makai":case"pandaemonium":return`
        <g class="landmark-illust" transform="translate(0, -6)">
          <polygon points="-12,8 -7,-9 0,-4 7,-9 12,8" fill="#5e3a78" stroke="#21112e" stroke-width="1.3" />
          <polygon points="-5,8 0,-18 5,8" fill="#8f5bb3" stroke="#21112e" stroke-width="1.3" />
          <circle cx="0" cy="-12" r="2" fill="#f0c4ff" />
        </g>
      `;case"geidontei":return`
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="13" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-10" y="-2" width="18" height="10" fill="#efe2c6" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <rect x="-7" y="-1" width="11" height="4.5" fill="#2c4a6f" stroke="#1b2d45" stroke-width="0.7" />
          <polygon points="-13,-1.5 -0.5,-11.5 12,-1.5" fill="#543d2c" stroke="#24170f" stroke-width="1.3" />
          <circle cx="6.5" cy="2.2" r="2.4" fill="#ff6b4a" stroke="#4a160b" stroke-width="0.8" />
        </g>
      `;case"suzunaan":return`
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="13" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-10" y="-2" width="18" height="10" fill="#f2e6cc" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <polygon points="-13,-1.5 -0.5,-11.5 12,-1.5" fill="#465448" stroke="#1e2920" stroke-width="1.3" />
          <rect x="-5" y="-6.5" width="9" height="3.5" rx="0.8" fill="#e8d2a6" stroke="#362417" stroke-width="0.8" />
        </g>
      `;case"terakoya-school":case"terakoya":return`
        <g class="landmark-illust" transform="translate(0, -4)">
          <ellipse cx="1.2" cy="8.5" rx="14" ry="3.2" fill="rgba(22, 12, 6, 0.30)" />
          <rect x="-11" y="-2" width="19" height="10" fill="#efe2c6" stroke="#362417" stroke-width="1.2" />
          <polygon points="8,-2 11.5,0 11.5,8 8,8" fill="#c7b28c" stroke="#362417" stroke-width="1.0" />
          <polygon points="-14,-1.5 -1,-11 12,-1.5" fill="#594230" stroke="#24170f" stroke-width="1.3" />
          <circle cx="-1" cy="-12" r="2.0" fill="#d9a74a" stroke="#362417" stroke-width="0.8" />
        </g>
      `;default:return""}}function aa(e,t){const o=t.toFixed(2);switch(e){case"shrine":return`<path transform="scale(${o})" d="M -3.5 -2 L 3.5 -2 M -2.2 -2 L -2.2 3 M 2.2 -2 L 2.2 3" stroke="#fff8ec" stroke-width="1.3" stroke-linecap="round" />`;case"temple":return`<polygon transform="scale(${o})" points="0,-3.5 3.5,0 0,3.5 -3.5,0" fill="#fff8ec" />`;case"village":return`<rect transform="scale(${o})" x="-2.8" y="-2.8" width="5.6" height="5.6" fill="#fff8ec" />`;case"mountain":return`<polygon transform="scale(${o})" points="-3.5,2.5 0,-3.2 3.5,2.5" fill="#fff8ec" />`;default:return`<circle cx="0" cy="0" r="${(2.6*t).toFixed(1)}" fill="#fff8ec" />`}}function So(e,t,o,r,n,a,l){const s=n.trim().toLowerCase();let i="";for(const d of t){if(a!=="All"&&d.region!==a||l!=="All"&&d.kind!==l)continue;const c=!s||d.name_en.toLowerCase().includes(s)||d.name_jp.toLowerCase().includes(s)||d.residents.some(m=>m.toLowerCase().includes(s))||d.short_desc.toLowerCase().includes(s),h=d.id===o,f=d.x*T,w=d.y*G,b=vt[d.kind]??"#8a5a36",g=c?1:.22,$=d.importance===1?8.8:d.importance===2?6.8:5.2,p=$o(d.id,d.icon)||(d.icon?$o(d.icon):""),y=["shrine","temple","residence","village"].includes(d.kind)?`<circle cx="0" cy="0" r="${$*3}" fill="url(#lantern-radial)" class="night-only" />`:"",u=h?`
        <circle cx="0" cy="0" r="${$+10}" fill="none" stroke="#b6342a" stroke-width="2.6" class="marker-pulse-ring" />
        <circle cx="0" cy="0" r="${$+5.5}" fill="none" stroke="#d9a74a" stroke-width="2.2" />
      `:"",x=d.importance===1?1.05:d.importance===2?.85:.7;i+=`
      <g
        class="map-marker${h?" is-selected":""}"
        data-id="${d.id}"
        data-importance="${d.importance}"
        transform="translate(${f.toFixed(1)}, ${w.toFixed(1)})"
        opacity="${g}"
      >
        <g class="marker-scale-wrap">
          <circle cx="0" cy="0" r="${($+8).toFixed(1)}" fill="transparent" />
          ${y}
          ${u}
          ${p}
          <circle
            cx="0"
            cy="2.2"
            r="${($+1).toFixed(1)}"
            fill="rgba(26, 15, 8, 0.42)"
          />
          <circle
            cx="0"
            cy="0"
            r="${$}"
            fill="${b}"
            stroke="#fff8ec"
            stroke-width="${d.importance===1?2.2:1.6}"
          />
          ${aa(d.kind,x)}
        </g>
      </g>
    `}e.innerHTML=i}function ae(e,t,o,r,n){const a=new re,l=new P(new de(1,o,4),r);if(l.rotation.y=Math.PI/4,l.scale.set(e/Math.SQRT2,1,t/Math.SQRT2),l.position.y=o/2,l.castShadow=!0,a.add(l),n){const s=new P(new Y(e*.85,.35,.45),n);s.position.y=o*.92,a.add(s)}return a}function Ae(e,t,o,r,n){const a=new re,l=new P(new de(1,o,4),r);if(l.rotation.y=Math.PI/4,l.scale.set(e/Math.SQRT2,1,t/Math.SQRT2),l.position.y=o/2,l.castShadow=!0,a.add(l),n){const s=new P(new Y(.45,.35,t*.85),n);s.position.y=o*.92,a.add(s)}return a}function la(){const e=new re;e.name="landmark-human-village";const t=new N({color:15721158,roughness:.78}),o=new N({color:5519396,roughness:.85}),r=new N({color:4541524,roughness:.72}),n=new N({color:6177071,roughness:.75}),a=new N({color:14206366,roughness:.9}),l=new N({color:4423856,roughness:.25,metalness:.15}),s=new N({color:9209211,roughness:.82}),i=new N({color:14264138,roughness:.35,metalness:.6}),d=new P(new ee(86,88,.8,36),a);d.scale.set(1.38,1,.96),d.position.y=.4,d.receiveShadow=!0,e.add(d);const c=new P(new Y(10,.95,158),l);c.position.set(12,.48,0);const h=new P(new Y(13.5,.88,158),s);h.position.set(12,.44,0),e.add(h,c);for(const m of[-34,0,34]){const k=new P(new Y(15,1.8,7.5),o);k.position.set(12,1.4,m),k.castShadow=!0,e.add(k)}const f=new re;f.position.set(43.2,0,-48),f.userData.locationId="dragon-statue";const w=new P(new Y(20,.95,20),s);w.position.set(0,.48,0);const b=new P(new Y(4.5,3.8,4.5),s);b.position.set(0,2.3,0);const g=new P(new Y(2.2,5.2,2.2),s);g.position.set(0,6.2,0);const $=ae(4.2,4.2,2,r,i);$.position.set(0,8.8,0),f.add(w,b,g,$),e.add(f);const p=[[-4.8,73.6],[-105.6,-6.4],[0,-32],[-57.6,-38.4],[43.2,-48],[81.6,-6.4]],S=[-52,-34,-18,18,34,52],y=[-88,-66,-44,-24,30,50,70,88];for(const m of S)for(const k of y){if(Math.hypot(k*.76,m*1.08)>84||k===30&&Math.abs(m)===18||p.some(([M,C])=>Math.hypot(k-M,m-C)<20))continue;const I=13+Math.abs(k+m)%3*2.5,L=9.5+Math.abs(k*m)%2*2,E=4.6+Math.abs(k+m)%2*1.4,A=(k+m)%3===0,H=new re;H.position.set(k,.8,m);const O=new P(new Y(I,E,L),t);O.position.y=E/2,O.castShadow=!0,O.receiveShadow=!0;const v=ae(I+1.4,L+1.4,2.8,A?r:n);v.position.y=E,H.add(O,v),e.add(H)}const u=48;for(let m=0;m<u;m++){const k=m/u*Math.PI*2;if(Math.abs(Math.cos(k))>.985||Math.abs(Math.sin(k))>.985)continue;const I=Math.cos(k)*116,L=Math.sin(k)*80,E=new P(new Y(9.5,4.8,2.2),o);E.position.set(I,2.8,L),E.rotation.y=-k+Math.PI/2,E.castShadow=!0,e.add(E)}const x=[[0,-80,0],[0,80,0],[-116,0,Math.PI/2],[116,0,Math.PI/2]];for(const[m,k,I]of x){const L=new re;L.position.set(m,.8,k),L.rotation.y=I;const E=new P(new Y(18,6.8,7.5),t);E.position.y=3.4,E.castShadow=!0;const A=ae(20.5,9.2,4.2,r,i);A.position.y=6.8,L.add(E,A),e.add(L)}return e}function ca(){const e=new re;e.name="landmark-hakurei-shrine";const t=new N({color:13156010,roughness:.85}),o=new N({color:15918796,roughness:.75}),r=new N({color:11940906,roughness:.55}),n=new N({color:6044712,roughness:.78}),a=new N({color:14264138,roughness:.35,metalness:.6}),l=new P(new ee(36,40,2.2,24),t);l.scale.set(1.25,1,.88),l.position.y=1.1,l.receiveShadow=!0,e.add(l);const s=new P(new Y(24,9.5,15),o);s.position.set(-4,2.2+4.75,-6),s.castShadow=!0;const i=ae(28,18.5,6.5,n,a);i.position.set(-4,2.2+9.5,-6),e.add(s,i);const d=new P(new Y(15,7.2,12),o);d.position.set(16,2.2+3.6,-4),d.castShadow=!0;const c=ae(17,13.5,4.2,n);c.position.set(16,2.2+7.2,-4),e.add(d,c);const h=new re;h.position.set(-2,2.2,18);for(const g of[-7.5,7.5]){const $=new P(new ee(.85,1,14.5,12),r);$.position.set(g,7.25,0),$.castShadow=!0,h.add($)}const f=new P(new Y(21,1.3,1.6),r);f.position.set(0,14.2,0);const w=new P(new Y(17.5,.95,1.1),r);w.position.set(0,11.4,0),h.add(f,w),e.add(h);const b=new P(new Y(12,2,48),t);return b.position.set(-2,.6,46),b.rotation.x=.08,e.add(b),e}function da(){const e=new re;e.name="landmark-myouren-temple";const t=new N({color:14076594,roughness:.85}),o=new N({color:15721678,roughness:.75}),r=new N({color:7226156,roughness:.8}),n=new N({color:4344146,roughness:.7}),a=new N({color:14264138,roughness:.35,metalness:.65}),l=new P(new Y(68,1.2,48),t);l.position.y=.6,l.receiveShadow=!0,e.add(l);const s=new P(new Y(28,11,18),o);s.position.set(-6,1.2+5.5,-4),s.castShadow=!0;const i=ae(32,21,7.2,n,a);i.position.set(-6,1.2+11,-4),e.add(s,i);const d=new re;d.position.set(20,1.2,-4);for(let h=0;h<4;h++){const f=10.5-h*1.6,w=h*6.2,b=new P(new Y(f*.72,5.8,f*.72),r);b.position.y=w+2.9,b.castShadow=!0;const g=new P(new de(f*.88,2.6,4),n);g.rotation.y=Math.PI/4,g.position.y=w+5.8,g.castShadow=!0,d.add(b,g)}const c=new P(new ee(.15,.35,6.5,8),a);return c.position.y=4*6.2+2.8,d.add(c),e.add(d),e}function ha(){const e=new re;e.name="landmark-eientei";const t=new N({color:15721158,roughness:.75}),o=new N({color:3428146,roughness:.7}),r=new N({color:5191718,roughness:.82}),n=new N({color:15130576,roughness:.9}),a=new N({color:14267466,roughness:.35,metalness:.6}),l=new N({color:3892346,roughness:.7}),s=new P(new Y(54,.6,40),n);s.position.set(0,.3,0),s.receiveShadow=!0,e.add(s);const i=new P(new Y(28,9.5,16),t);i.position.set(0,4.75,0),i.castShadow=!0;const d=ae(32,19,6,o,a);d.position.set(0,9.5,0),e.add(i,d);const c=new P(new Y(6.5,4.8,34),r);c.position.set(0,2.4,-24),c.castShadow=!0;const h=Ae(8,35,2.8,o);h.position.set(0,4.8,-24),e.add(c,h);for(const[b,g,$,p]of[[0,20,56,4.2],[0,-20,56,4.2],[-26,0,4.2,42],[26,0,4.2,42]]){const S=new P(new Y($,4.5,p),r);S.position.set(b,2.25,g),S.castShadow=!0,e.add(S)}const f=new P(new Y(11,6.5,14),t);f.position.set(32,3.25,4),f.castShadow=!0;const w=Ae(13,16,3.8,l,a);return w.position.set(32,6.5,4),e.add(f,w),e}function ua(){const e=new re;e.name="landmark-moriya-shrine";const t=new N({color:15721158,roughness:.75}),o=new N({color:2647636,roughness:.68}),r=new N({color:8213035,roughness:.85}),n=new N({color:14267466,roughness:.35,metalness:.6}),a=new N({color:14205578,roughness:.85}),l=new N({color:9407104,roughness:.88}),s=new N({color:2709817,roughness:.82}),i=new P(new Y(44,1.8,36),l);i.position.set(0,.9,0),i.receiveShadow=!0,e.add(i);const d=new P(new Y(22,10,15),t);d.position.set(0,6.8,-2),d.castShadow=!0;const c=ae(25,17.5,6.2,o,n);c.position.set(0,11.8,-2),e.add(d,c);const h=new P(new ee(.95,.95,16,10),a);h.rotation.z=Math.PI/2,h.position.set(0,9.2,6.1),e.add(h);for(const[p,S]of[[-16,-12],[16,-12],[-16,12],[16,12]]){const y=new P(new ee(1.15,1.35,26,10),r);y.position.set(p,14.5,S),y.castShadow=!0,e.add(y)}const f=new P(new ee(1.1,1.6,9,7),r);f.position.set(-11,6.3,-13);const w=new P(new We(4.2,0),s);w.position.set(-11,12.2,-13);const b=new P(new We(3.1,0),s);b.position.set(-8.5,10.8,-14.2),e.add(f,w,b);const g=new P(new Y(9,6.5,11),t);g.position.set(-26,4.2,8),g.castShadow=!0;const $=Ae(10.5,12.5,3.2,o);return $.position.set(-26,7.5,8),e.add(g,$),e}function fa(){const e=new re;e.name="landmark-chireiden";const t=new N({color:5189710,roughness:.75}),o=new N({color:8004164,roughness:.65}),r=new N({color:14725708,roughness:.35,metalness:.6}),n=new N({color:2498602,roughness:.8}),a=new N({color:14207928,roughness:.8}),l=new N({color:16729344,emissive:16724736,emissiveIntensity:.85,roughness:.3}),s=new N({color:16731528,emissive:14231138,emissiveIntensity:.65,roughness:.25}),i=new P(new Y(44,1,42),n);i.position.set(0,.5,4),i.receiveShadow=!0,e.add(i);for(let b=-3;b<=3;b++)for(let g=1;g<=4;g++)if((b+g)%2===0){const $=new P(new Y(4.5,.2,4.5),a);$.position.set(b*4.5,1.05,g*4.5+2),e.add($)}const d=new P(new ee(5.2,5.6,1.4,12),n);d.position.set(0,1.2,16);const c=new P(new ee(4.2,4.2,1.5,12),l);c.position.set(0,1.25,16),e.add(d,c);const h=new P(new Y(26,14,18),t);h.position.set(0,7.5,-4),h.castShadow=!0;const f=Ae(28,20,8.5,o,r);f.position.set(0,14.5,-4),e.add(h,f);for(const b of[-16,16]){const g=new P(new Y(9,11,14),t);g.position.set(b,6,-2),g.castShadow=!0;const $=Ae(10.5,15.5,6,o,r);$.position.set(b,11.5,-2),e.add(g,$)}const w=new P(new ee(3.2,3.2,.5,16),s);return w.rotation.x=Math.PI/2,w.position.set(0,11.2,5.1),e.add(w),e}const j={plaster:new N({color:15721158,roughness:.78}),timber:new N({color:6044710,roughness:.85}),stone:new N({color:9343899,roughness:.8}),stoneDark:new N({color:5856870,roughness:.85}),roofSlate:new N({color:4344402,roughness:.72}),roofBrown:new N({color:6505262,roughness:.76}),roofCrimson:new N({color:10036265,roughness:.65}),roofBlue:new N({color:3890309,roughness:.68}),roofJade:new N({color:3106386,roughness:.68}),roofGold:new N({color:13145662,roughness:.45,metalness:.4}),toriiRed:new N({color:11940906,roughness:.55}),windowGlow:new N({color:16765557,emissive:16751918,emissiveIntensity:.7,roughness:.3}),sakuraPink:new N({color:15897788,roughness:.75}),foliageGreen:new N({color:4023874,roughness:.85})};function Co(e){const t=new re,o=e.importance===1?1.25:e.importance===2?.95:.72;if(t.scale.setScalar(o),e.id==="prismriver-mansion"||e.id==="mugenkan"||e.id==="pandaemonium"){const r=new P(new Y(11,7.5,7),j.stone);r.position.y=3.75,r.castShadow=!0;const n=ae(11.8,7.8,3.8,j.roofBlue,j.plaster);n.position.y=7.5,t.add(r,n);for(const a of[-1,1]){const l=new P(new Y(4.5,8.2,9.5),j.stone);l.position.set(a*6.5,4.1,1),l.castShadow=!0;const s=Ae(5.1,10.2,3.6,j.roofCrimson,j.plaster);s.position.set(a*6.5,8.2,1);const i=new P(new Y(1.4,3.2,.2),j.windowGlow);i.position.set(a*6.5,4.2,5.8),t.add(l,s,i)}return t}if(e.id==="hakugyokurou"||e.id==="saigyou-ayakashi"){const r=new P(new Y(14,6.5,9),j.plaster);r.position.set(-4,3.25,0),r.castShadow=!0;const n=ae(16,11,4.2,j.roofSlate);n.position.set(-4,6.5,0),t.add(r,n);const a=new P(new ee(.9,1.4,7.5,8),j.timber);a.position.set(7,3.75,0),t.add(a);for(const[l,s,i,d]of[[7,8.5,0,3.6],[4.5,7.2,1.8,2.6],[9.5,7.4,-1.5,2.7],[7.2,7,2.5,2.4]]){const c=new P(new Qt(d,1),j.sakuraPink);c.position.set(l,s,i),c.scale.set(1.2,.78,1.2),c.castShadow=!0,t.add(c)}return t}if(e.id==="shining-needle-castle"){const r=new re;r.position.y=11,r.rotation.z=Math.PI;const n=new P(new Y(11,5.5,11),j.plaster);n.position.y=2.75;const a=new P(new de(9.5,3.5,4),j.roofCrimson);a.rotation.y=Math.PI/4,a.position.y=6.5;const l=new P(new Y(7,4.5,7),j.plaster);l.position.y=9.5;const s=new P(new de(6.5,4.2,4),j.roofCrimson);return s.rotation.y=Math.PI/4,s.position.y=13.5,r.add(n,a,l,s),t.add(r),t}if(e.id==="mayohiga"||e.id==="hall-of-dreams"||e.id==="lunar-capital"||e.id==="higan"||e.id==="heaven"||e.id==="bhava-agra"){const r=new P(new Y(16,1.4,12),j.stone);r.position.y=.7;const n=new P(new Y(13,6.5,9),j.plaster);n.position.y=1.4+3.25,n.castShadow=!0;const a=e.id==="hall-of-dreams"||e.id==="heaven"||e.id==="bhava-agra"?j.roofGold:e.id==="lunar-capital"?j.roofBlue:j.roofSlate,l=ae(15.5,11.2,4.5,a);return l.position.y=1.4+6.5,t.add(r,n,l),t}if(e.id==="three-fairies-tree"){const r=new P(new ee(2.2,3,9.5,10),j.timber);r.position.y=4.75;const n=new P(new Y(1.4,2.2,.3),j.windowGlow);n.position.set(0,1.4,2.65);const a=new P(new We(5.5,1),j.foliageGreen);return a.position.y=11,a.scale.set(1.15,.9,1.15),t.add(r,n,a),t}if(e.id==="crawdad-rock"||e.id==="world-of-ice-and-snow"){const r=new N({color:7133439,roughness:.15,metalness:.25,emissive:2001100,emissiveIntensity:.35}),n=new P(new We(3.4,0),j.stoneDark);n.position.y=1.4,n.scale.set(1.3,.65,1.1),t.add(n);for(const[a,l,s,i,d,c]of[[0,0,1.4,6.8,.1,-.08],[-2.2,.8,1,4.8,-.22,.25],[2.1,-.6,1.1,5.2,.18,-.28]]){const h=new P(new de(s,i,5),r);h.position.set(a,i/2+1,l),h.rotation.set(d,0,c),t.add(h)}return t}if(e.id==="nine-heavens-waterfall"){const r=new N({color:14218495,roughness:.2,emissive:5220568,emissiveIntensity:.25}),n=new P(new Y(12,16,6),j.stoneDark);n.position.set(0,8,-2);const a=new P(new Y(5.5,16.2,1.2),r);return a.position.set(0,8,1),t.add(n,a),t}if(e.id==="moriya-ropeway"){const r=new P(new Y(8.5,5,6.5),j.plaster);r.position.y=2.5;const n=ae(9.6,7.4,2.8,j.roofJade);n.position.y=5;const a=new P(new ee(.4,.8,11.5,6),j.stoneDark);a.position.set(6.5,5.75,0);const l=new P(new Y(2.8,2.2,2),j.toriiRed);return l.position.set(6.5,8.5,2.2),t.add(r,n,a,l),t}if(e.id==="torifune-space-shrine"){const r=new N({color:8112292,roughness:.3,metalness:.5,wireframe:!0}),n=new P(new ee(8.5,7.2,2.4,12),j.stoneDark);n.position.y=14;const a=new P(new Qt(8.2,1),r);a.position.y=17.5;const l=new P(new Y(4.5,3.8,4.5),j.toriiRed);return l.position.y=17,t.add(n,a,l),t}switch(e.kind){case"shrine":{for(const s of[-2.8,2.8]){const i=new P(new ee(.38,.44,6.8,10),j.toriiRed);i.position.set(s,3.4,2.5),t.add(i)}const r=new P(new Y(7.8,.65,.75),j.toriiRed);r.position.set(0,6.6,2.5);const n=new P(new Y(6.4,.45,.55),j.toriiRed);n.position.set(0,5.2,2.5);const a=new P(new Y(6.5,4.5,5.5),j.plaster);a.position.set(0,2.25,-2.5),a.castShadow=!0;const l=ae(7.6,6.6,3,j.roofBrown);l.position.set(0,4.5,-2.5),t.add(r,n,a,l);break}case"temple":{const r=new P(new Y(9.5,5.5,7.2),j.plaster);r.position.y=2.75,r.castShadow=!0;const n=ae(11.2,8.6,3.8,j.roofSlate);n.position.y=5.5,t.add(r,n);break}case"residence":case"village":{const r=new P(new Y(8.2,5,6.4),j.plaster);r.position.y=2.5,r.castShadow=!0;const n=e.id==="alices-house"?j.roofBlue:e.id==="kourindou"?j.roofJade:j.roofBrown,a=ae(9.4,7.6,3.4,n);a.position.y=5;const l=new P(new Y(2.2,1.8,.2),j.windowGlow);l.position.set(0,2.6,3.22),t.add(r,a,l);break}case"mountain":{for(const[r,n,a,l]of[[0,0,4.2,8.5],[-3.2,1.8,2.8,5.5],[3,-1.5,2.6,5]]){const s=new P(new de(a,l,5),j.stoneDark);s.position.set(r,l/2,n),s.castShadow=!0,t.add(s)}break}case"forest":{for(const[r,n,a]of[[-2.8,-1.5,1],[2.8,-1.2,.9],[0,2.2,1.1]]){const l=new P(new ee(.3,.45,2.5,6),j.timber);l.position.set(r,1.25,n);const s=new P(new de(2.2*a,4.5*a,6),j.foliageGreen);s.position.set(r,3.8*a,n);const i=new P(new de(1.6*a,3.6*a,6),j.foliageGreen);i.position.set(r,6*a,n),t.add(l,s,i)}break}case"water":{const r=new P(new Y(4.5,.5,7.5),j.timber);r.position.y=.8,t.add(r);break}default:{const r=new P(new Y(3.2,1,3.2),j.stoneDark);r.position.y=.5;const n=new P(new ee(.85,1.05,3.8,6),j.stone);n.position.y=2.9;const a=new P(new Y(1.8,1.4,1.8),j.windowGlow);a.position.y=5.4;const l=new P(new de(2.4,1.6,6),j.stoneDark);l.position.y=6.9,t.add(r,n,a,l);break}}return t}function pa(){const e=new re;e.name="ScarletDevilMansion3D";const t=new N({color:14668734,roughness:.85}),o=new N({color:7761509,roughness:.9}),r=new N({color:2762544,roughness:.8}),n=new N({color:9379108,roughness:.65}),a=new N({color:11543854,roughness:.6}),l=new N({color:5190948,roughness:.85}),s=new N({color:15120461,roughness:.35,metalness:.65}),i=new N({color:16726832,emissive:14230318,emissiveIntensity:.55,roughness:.25}),d=new N({color:16760670,emissive:14711330,emissiveIntensity:.65,roughness:.2,transparent:!0,opacity:.9}),c=new N({color:10167990,emissive:8069026,emissiveIntensity:.6,roughness:.3}),h=new N({color:16775399,emissive:16769187,emissiveIntensity:.35,roughness:.4}),f=new N({color:4155964,roughness:.92}),w=new N({color:2378278,roughness:.9}),b=new N({color:12066090,roughness:.75}),g=new N({color:14395442,roughness:.75}),$=new N({color:13352870,roughness:.9}),p=new N({color:9837348,roughness:.8}),S=new N({color:3903141,roughness:.18,metalness:.25}),y=(W,V,te,Q,ne,ue,Ce,Re=0)=>{const le=new P(new Y(W,V,te),Q);return le.position.set(ne,ue+V/2,Ce),Re!==0&&(le.rotation.y=Re),le.castShadow=!0,le.receiveShadow=!0,e.add(le),le},u=(W,V,te,Q,ne,ue,Ce=4,Re=Math.PI/4)=>{const le=new P(new de(W,V,Ce),te);return le.position.set(Q,ne+V/2,ue),le.rotation.y=Re,le.castShadow=!0,e.add(le),le},x=(W,V,te,Q,ne)=>{const ue=new re;ue.position.set(W,V,te);const Ce=new P(new ee(.45*Q,.75*Q,3.6*Q,6),l);Ce.position.y=1.8*Q,Ce.castShadow=!0,ue.add(Ce),[[0,4.4,0,2.3],[-1.3,3.6,.9,1.75],[1.4,3.7,.8,1.7],[-1,3.8,-1.2,1.65],[1.1,3.5,-1.1,1.65],[0,5.3,.2,1.5]].forEach(([le,si,ai,li],St)=>{const ci=new N({color:ne[St%ne.length],roughness:.82}),Je=new P(new We(li*Q,0),ci);Je.position.set(le*Q,si*Q,ai*Q),Je.rotation.set(St*.5,St*.8,0),Je.castShadow=!0,ue.add(Je)}),e.add(ue)};y(88,1.4,96,o,0,0,6),y(84,.35,92,f,0,1.4,6);const m=-38,k=50,I=-41,L=41;y(82,2.4,.9,r,0,1.7,m),y(.9,2.4,88,r,I,1.7,6),y(.9,2.4,88,r,L,1.7,6),y(33,2.4,.9,r,-24.5,1.7,k),y(33,2.4,.9,r,24.5,1.7,k);for(const W of[-41,-30,-19,-8,8,19,30,41])y(1.8,4.2,1.8,n,W,1.7,k),y(2.2,.6,2.2,t,W,5.9,k);for(const W of[-1,1])y(2.8,7.5,2.8,n,W*7.5,1.7,k),y(3.2,.8,3.2,t,W*7.5,9.2,k),y(1.1,1.6,1.1,d,W*7.5,10,k),u(1.2,1.4,s,W*7.5,11.6,k,4);y(15.5,1,.8,n,0,8.2,k),y(6.2,5.8,.4,a,-3.4,1.8,k+.4,.18),y(6.2,5.8,.4,a,3.4,1.8,k+.4,-.18),y(8.5,4.8,6.5,t,-15.5,1.7,44.5),u(6.8,3.6,n,-15.5,6.5,44.5,4),y(3.5,.5,2.2,a,-15.5,4.6,41),y(10.5,.18,46,$,0,1.75,27),y(68,.18,6.5,$,0,1.75,25);const E=new P(new ee(6.8,7.2,1.2,16),t);E.position.set(0,2.3,25),e.add(E);const A=new P(new ee(6,6,.9,16),S);A.position.set(0,2.45,25),e.add(A);const H=new P(new ee(1.1,1.6,4.8,10),t);H.position.set(0,4.1,25),e.add(H);const O=new P(new de(1.6,2.4,8),s);O.position.set(0,7.2,25),e.add(O);for(const W of[-1,1])for(const V of[-1,1]){const te=W*20.5,Q=25+V*12.5;y(18,1.3,1.1,w,te,1.75,Q-6.5),y(18,1.3,1.1,w,te,1.75,Q+6.5),y(1.1,1.3,13,w,te-8.5,1.75,Q),y(1.1,1.3,13,w,te+8.5,1.75,Q),y(11.5,.65,6.5,b,te,1.75,Q),y(5.5,.85,3.2,g,te,1.75,Q)}x(-31,1.75,37,1.15,[15899832,16234188,14908317]),x(31,1.75,37,1.15,[13920808,14715448,12077596]),x(-32,1.75,12,1.25,[3038260,4027204,2378281]),x(32,1.75,12,1.25,[3038260,4027204,2378281]),y(46,2.4,28,o,0,1.7,-12),y(12,1.8,7,o,0,1.7,4.5),y(7.5,1.95,8.5,p,0,1.72,4.2),y(42,18.5,24,t,0,4.1,-12),y(42.8,1.1,24.8,l,0,12.8,-12),y(43.2,1.2,25.2,r,0,22,-12);const v=new P(new de(28.5,13.5,4),n);v.position.set(0,29.3,-12),v.rotation.y=Math.PI/4,v.scale.set(1.18,1,.72),v.castShadow=!0,e.add(v),y(13,15.5,5.5,t,0,4.1,1.8),u(9.2,7.5,a,0,19.6,1.8,4);for(const W of[-4.8,-1.8,1.8,4.8]){const V=new P(new ee(.48,.55,12.5,8),o);V.position.set(W,10.3,4.4),V.castShadow=!0,e.add(V)}y(3.6,6.2,.5,l,0,4.1,4.45);const M=new P(new ee(2.4,2.4,.5,12),i);M.rotation.x=Math.PI/2,M.position.set(0,15.2,4.55),e.add(M);for(const W of[-15.5,-10.5,10.5,15.5])y(1.3,4.2,.4,i,W,6.8,.05),y(1.3,4.2,.4,i,W,15.2,.05);const C=0,F=-15;y(10.5,22,10.5,t,C,24,F);for(const W of[-5.1,5.1])for(const V of[-5.1,5.1])y(1.4,23,1.4,l,C+W,24,F+V),u(1.3,4.2,a,C+W,47,F+V,4);y(11.4,1.2,11.4,r,C,38.5,F);for(let W=0;W<4;W++){const V=W*Math.PI/2,te=C+Math.sin(V)*5.35,Q=F+Math.cos(V)*5.35,ne=new P(new ee(2.5,2.5,.3,16),h);ne.rotation.x=Math.PI/2,ne.rotation.z=-V,ne.position.set(te,42.2,Q),e.add(ne)}u(8.2,18.5,n,C,46,F,8,Math.PI/8),u(.8,5.5,s,C,64.5,F,6,0),y(10,11.5,11,t,-23,4.1,-12),u(8.2,5.5,n,-23,15.6,-12,4);const D=-31.5,R=-12,z=new P(new ee(9.5,10.2,16.5,8),t);z.position.set(D,1.7+8.25,R),z.rotation.y=Math.PI/8,z.castShadow=!0,z.receiveShadow=!0,e.add(z);const B=new P(new ee(10.4,10.4,2.2,8),d);B.position.set(D,3.8,R),B.rotation.y=Math.PI/8,e.add(B);for(let W=0;W<8;W++){const V=W*Math.PI/4;y(1.2,14.5,2.2,o,D+Math.cos(V)*9.6,1.7,R+Math.sin(V)*9.6,-V)}u(10.8,12,n,D,18.2,R,8,Math.PI/8),u(2.2,5.5,s,D,29.8,R,6,0),y(14,13.5,16,t,24,4.1,-6),u(11.2,7.2,n,24,17.6,-6,4);const X=27.5,oe=5.5;y(11.5,2.2,9.5,o,X,1.7,oe),y(10.8,6.2,8.8,d,X,3.9,oe);for(const W of[-4.2,-1.4,1.4,4.2])y(.35,6.5,9.1,r,X+W,3.9,oe);u(7.4,4.2,d,X,10.1,oe,4),u(7.6,.6,s,X,10.1,oe,4),y(15,16.5,16,t,23.5,4.1,-22),u(11.8,8.5,a,23.5,20.6,-22,4),y(18,8.2,8,o,24,1.7,-33),y(18.6,1.2,8.6,t,24,9.9,-33);for(const[W,V]of[[32.5,-22],[-21.5,-24]]){const te=new P(new ee(4.2,4.5,23,8),t);te.position.set(W,1.7+11.5,V),te.castShadow=!0,e.add(te),u(5.2,9.5,a,W,24.7,V,8,Math.PI/8)}return y(7.5,3.2,6.5,r,34.5,1.7,-11),y(5.2,2.2,4.8,c,34.5,1.9,-11),e}const $t=new yi,Se=new Map,J="./models",qe={"scarlet-devil-mansion":{url:`${J}/scarlet-devil-mansion.glb`,scale:1.45},"human-village":{url:`${J}/human-village.glb`,scale:1.55},"hakurei-shrine":{url:`${J}/hakurei-shrine.glb`,scale:2.2},"myouren-temple":{url:`${J}/myouren-temple.glb`,scale:2.1},"hall-of-dreams":{url:`${J}/hall-of-dreams.glb`,scale:2},suzunaan:{url:`${J}/suzunaan.glb`,scale:1.5},geidontei:{url:`${J}/geidontei.glb`,scale:1.5},"terakoya-school":{url:`${J}/terakoya-school.glb`,scale:1.55},"hieda-estate":{url:`${J}/hieda-estate.glb`,scale:1.55},kourindou:{url:`${J}/kourindou.glb`,scale:1.85},"marisas-house":{url:`${J}/marisas-house.glb`,scale:1.55},"alices-house":{url:`${J}/alices-house.glb`,scale:1.55},"moriya-branch-shrine":{url:`${J}/radio-tower.glb`,scale:1.45},eientei:{url:`${J}/eientei.glb`,scale:1.55},mugenkan:{url:`${J}/mugenkan.glb`,scale:2.1},"moriya-shrine":{url:`${J}/moriya-shrine.glb`,scale:1.55},"tengu-village":{url:`${J}/tengu-village.glb`,scale:1.55},muenzuka:{url:`${J}/muenzuka.glb`,scale:1.55},heaven:{url:`${J}/heaven.glb`,scale:1.55,yOffset:88},"asama-purifying-mountain":{url:`${J}/asama-purifying-mountain.glb`,scale:2},"shining-needle-castle":{url:`${J}/shining-needle-castle.glb`,scale:2.3},hakugyokurou:{url:`${J}/hakugyokurou.glb`,scale:2.3},"palace-of-earth-spirits":{url:`${J}/palace-of-earth-spirits.glb`,scale:2.3},"nuclear-furnace":{url:`${J}/nuclear-furnace.glb`,scale:2.1},pandaemonium:{url:`${J}/pandaemonium.glb`,scale:2.3},"lunar-capital":{url:`${J}/lunar-capital.glb`,scale:2.3}},dt=new N({vertexColors:!0,roughness:.78,metalness:.06}),oi=new N({vertexColors:!0,roughness:.35,metalness:.08,emissive:new se(16751931),emissiveIntensity:.55});function ii(e){e.traverse(t=>{if(t.isMesh){const o=t;if(o.castShadow=!0,o.receiveShadow=!0,o.geometry?.attributes?.color){const r=o.name.includes("Emissive");o.material=r?oi:dt}}})}function ri(e,t){e.userData.locationId=t,ii(e)}async function Mo(e,t,o,r){const n=qe[e];if(!n)return null;try{let a=Se.get(n.url);a||(a=new Promise((i,d)=>{$t.load(n.url,c=>i(c.scene),void 0,c=>d(c))}),Se.set(n.url,a));const s=(await a).clone(!0);return o&&s.position.copy(o),n.scale&&n.scale!==1&&s.scale.setScalar(n.scale),n.rotationY&&(s.rotation.y=n.rotationY),n.yOffset&&(s.position.y+=n.yOffset),ri(s,e),t.add(s),r?.(),s}catch{return null}}async function ya(e,t){const o=`${J}/gensokyo-diorama-dressings.glb`;try{let r=Se.get(o);r||(r=new Promise((l,s)=>{$t.load(o,i=>l(i.scene),void 0,i=>s(i))}),Se.set(o,r));const a=(await r).clone(!0);return ii(a),e.add(a),t?.(),a}catch{return null}}async function ga(){const e=`${J}/gensokyo-foliage-kit.glb`;try{let t=Se.get(e);t||(t=new Promise((n,a)=>{$t.load(e,l=>n(l.scene),void 0,l=>a(l))}),Se.set(e,t));const o=await t;o.updateMatrixWorld(!0);const r={};return o.traverse(n=>{if(n.isMesh){const a=n,l=a.geometry.clone();l.applyMatrix4(a.matrixWorld),l.computeVertexNormals(),r[a.name]=l}}),r}catch{return null}}async function ma(){const e=`${J}/gensokyo-characters.glb`;try{let t=Se.get(e);t||(t=new Promise((n,a)=>{$t.load(e,l=>n(l.scene),void 0,l=>a(l))}),Se.set(e,t));const o=await t,r={};return o.traverse(n=>{if(n.isMesh){const a=n,l=a.geometry.clone(),s=a.position.clone();a.position.set(0,0,0),a.updateMatrix(),l.applyMatrix4(a.matrix),a.position.copy(s),a.updateMatrix(),l.computeVertexNormals(),r[a.name]=l}}),r}catch{return null}}const Be=T,Oe=G;function K(e,t){return[(e-.5)*Be,(t-.5)*Oe]}function zt(e,t,o){let r=!1;for(let n=0,a=o.length-1;n<o.length;a=n++){const l=o[n][0],s=o[n][1],i=o[a][0],d=o[a][1];s>t!=d>t&&e<(i-l)*(t-s)/(d-s+1e-9)+l&&(r=!r)}return r}function wa(e,t,o,r,n,a){const l=n-o,s=a-r,i=l*l+s*s;if(i<1e-12)return(e-o)*(e-o)+(t-r)*(t-r);const d=Math.max(0,Math.min(1,((e-o)*l+(t-r)*s)/i)),c=o+d*l,h=r+d*s;return(e-c)*(e-c)+(t-h)*(t-h)}function ka(e,t,o){let r=1/0;for(let n=0,a=o.length-1;n<o.length;a=n++){const l=wa(e,t,o[a][0],o[a][1],o[n][0],o[n][1]);l<r&&(r=l)}return Math.sqrt(r)}function Lo(e,t,o,r){const n=zt(e,t,o),a=ka(e,t,o);return n?$e(0,r,a+r*.5):a<r?.5*(1-$e(0,r,a)):0}function $e(e,t,o){const r=Math.max(0,Math.min(1,(o-e)/(t-e)));return r*r*(3-2*r)}function Z(e,t){let o=4+Math.sin(e*19)*Math.cos(t*15)*1.6+Math.sin((e+t)*37)*.65;const r=(e-.658)/.195,n=(t-.155)/.135,a=Math.hypot(r,n);if(a<1.38){const w=Math.atan2(n,r),b=1+.12*Math.cos(w*5+.4)+.07*Math.sin(w*9-1.1)*$e(.15,.85,a),g=Math.pow(Math.max(0,1-a/1.38),1.55),$=Math.floor(g*8)/8;o+=(g*.76+$*.24)*172*b}const l=Math.hypot((e-.688)/.044,(t-.112)/.032);l<1&&(o-=(1-l*l)*24);const s=Math.hypot((e-.252)/.115,(t-.318)/.085);if(s<1.25){const w=Math.pow(Math.max(0,1-s/1.25),1.5);o+=w*56}const i=Math.hypot((e-.91)/.085,(t-.34)/.095);i<1.2&&(o+=Math.pow(Math.max(0,1-i/1.2),1.6)*46);const d=Math.hypot((e-.38)/.11,(t-.07)/.055);d<1.1&&(o+=(1-$e(.5,1.1,d))*34);const c=Math.hypot((e-.91)/.085,(t-.11)/.065);c<1.15&&(o+=(1-$e(.55,1.15,c))*36);const h=Math.hypot((e-.685)/.105,(t-.79)/.09);h<1.05&&(o-=(1-$e(.4,1.05,h))*5.5);const f=[[.825,.745,.064,.082,7.5],[.48,.46,.062,.062,4.2],[.255,.32,.032,.038,48],[.382,.585,.028,.032,5],[.855,.47,.028,.03,5.2],[.645,.105,.03,.03,108],[.698,.148,.026,.024,126],[.752,.245,.018,.02,48],[.562,.215,.014,.014,39],[.125,.775,.028,.028,4.5],[.355,.07,.042,.032,38],[.912,.092,.038,.038,39.5]];for(const[w,b,g,$,p]of f){const S=Math.hypot((e-w)/g,(t-b)/$);if(S<1.35){const y=1-$e(.65,1.35,S);o=o*(1-y)+p*y}}return o}const xa={farmland:10269531,forest:4549436,"magic-forest":3101243,bamboo:5078342,sunflower:13150264,foothills:8160600,mountain:7761506,peak:15263455,wetland:6188628,higan:10631230,netherworld:14463172,heaven:14735032,lunar:12503256,underworld:3812136,makai:4863580,"sdm-grounds":5402188,backdoor:3424820};function ba(e,t){e.updateMatrixWorld(!0),e.traverse(o=>{if(!o.isMesh)return;const r=o,n=r.geometry.clone().toNonIndexed();n.applyMatrix4(r.matrixWorld);for(const d of Object.keys(n.attributes))d!=="position"&&d!=="normal"&&n.deleteAttribute(d);n.attributes.normal||n.computeVertexNormals();const l=(Array.isArray(r.material)?r.material[0]:r.material)?.color??new se(13421772),s=n.attributes.position.count,i=new Float32Array(s*3);for(let d=0;d<s;d++)i[d*3]=l.r,i[d*3+1]=l.g,i[d*3+2]=l.b;n.setAttribute("color",new It(i,3)),t.push(n)})}class va{constructor(t,o){q(this,"containerEl");q(this,"canvasEl");q(this,"labelsContainer");q(this,"cameraHudEl");q(this,"renderer");q(this,"scene");q(this,"camera");q(this,"controls");q(this,"ambientLight");q(this,"sunLight");q(this,"sdmPointLight");q(this,"nightPointLights",[]);q(this,"routesGroup");q(this,"activeRouteGroup");q(this,"footprintsGroup");q(this,"markersGroup");q(this,"residentsGroup");q(this,"floatingObjects",[]);q(this,"landmarkLoadPromises",[]);q(this,"terrainMesh",null);q(this,"worldDioramaGroup",null);q(this,"lakePolygons",[]);q(this,"raycaster",new Zt);q(this,"pointerDownPos",{x:0,y:0});q(this,"pickSpheres",[]);q(this,"charPickSpheres",[]);q(this,"labelEls",new Map);q(this,"charLabelEls",new Map);q(this,"viewportWidth",window.innerWidth);q(this,"viewportHeight",window.innerHeight);q(this,"labelsDirty",!0);q(this,"isActive",!1);q(this,"rafId",0);q(this,"flyAnim",null);this.containerEl=document.createElement("div"),this.containerEl.className="atlas-3d-container",this.containerEl.style.display="none",this.canvasEl=document.createElement("canvas"),this.canvasEl.className="atlas-3d-canvas",this.containerEl.appendChild(this.canvasEl),this.labelsContainer=document.createElement("div"),this.labelsContainer.className="atlas-3d-labels",this.containerEl.appendChild(this.labelsContainer),this.cameraHudEl=document.createElement("div"),this.cameraHudEl.className="atlas-3d-cam-bar",this.containerEl.appendChild(this.cameraHudEl),t.appendChild(this.containerEl),this.renderer=new gi({canvas:this.canvasEl,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=mi,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.toneMapping=wi,this.renderer.toneMappingExposure=1.08,this.scene=new ki,this.scene.background=new se(14477042),this.scene.fog=new et(14477042,38e-5),this.camera=new xi(45,window.innerWidth/window.innerHeight,2,4500),this.camera.position.set(0,920,980),this.controls=new bi(this.camera,this.canvasEl),this.controls.enableDamping=!0,this.controls.dampingFactor=.09,this.controls.maxPolarAngle=Math.PI/2-.03,this.controls.minDistance=12,this.controls.maxDistance=2200,this.controls.target.set(0,10,40),this.ambientLight=new vi(16774886,6050630,.95),this.scene.add(this.ambientLight),this.sunLight=new $i(16773846,1.65),this.sunLight.position.set(420,680,380),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=2048,this.sunLight.shadow.mapSize.height=2048,this.sunLight.shadow.camera.near=80,this.sunLight.shadow.camera.far=2100;const r=950;this.sunLight.shadow.camera.left=-r,this.sunLight.shadow.camera.right=r,this.sunLight.shadow.camera.top=r,this.sunLight.shadow.camera.bottom=-r,this.sunLight.shadow.bias=-5e-4,this.scene.add(this.sunLight);const[n,a]=K(.825,.745),l=Z(.825,.745);this.sdmPointLight=new Kt(16751682,0,180,1.5),this.sdmPointLight.position.set(n,l+28,a),this.sdmPointLight.visible=!1,this.scene.add(this.sdmPointLight);const s=[[.48,.46,16755272],[.255,.32,16749624],[.382,.585,16753730],[.855,.47,16758886],[.645,.105,16754764],[.125,.775,16732728]];for(const[p,S,y]of s){const[u,x]=K(p,S),m=Z(p,S),k=new Kt(y,0,150,1.5);k.position.set(u,m+22,x),k.visible=!1,this.scene.add(k),this.nightPointLights.push(k)}this.routesGroup=new re,this.activeRouteGroup=new re,this.footprintsGroup=new re,this.markersGroup=new re,this.residentsGroup=new re,this.scene.add(this.routesGroup),this.scene.add(this.activeRouteGroup),this.scene.add(this.footprintsGroup),this.scene.add(this.markersGroup),this.scene.add(this.residentsGroup),this.buildTerrainAndWater(o),this.buildInstancedForests(),this.build3DLandmarks(),this.build3DRoads(_.getRoutes()),this.build3DMarkersAndLabels(_.getLocations()),this.build3DCharacters(),this.mountCameraPresetBar(),this.setup3DRaycasting(),window.addEventListener("resize",()=>this.handleResize());let i="day",d=null,c=null,h=null,f="All",w="All",b="",g=!0,$=!0;_.subscribe(p=>{p.showFootprints!==g&&(g=p.showFootprints,this.footprintsGroup.visible=p.showFootprints,this.requestShadowUpdate()),p.showResidents!==$&&($=p.showResidents,this.residentsGroup.visible=p.showResidents,this.labelsDirty=!0,this.requestShadowUpdate()),this.routesGroup.visible=p.showRoutes,p.timeOfDay!==i&&(i=p.timeOfDay,this.applyTimeOfDay(p.timeOfDay)),p.computedRoute!==d&&(d=p.computedRoute,this.updateActiveRoute3D(p.computedRoute));const S=p.popupCharacterId??p.selectedCharacterId;(p.selectedId!==c||S!==h||p.regionFilter!==f||p.kindFilter!==w||p.searchQuery!==b)&&(c=p.selectedId,h=S,f=p.regionFilter,w=p.kindFilter,b=p.searchQuery,this.updateLabelFilterStates())})}requestShadowUpdate(){this.renderer.shadowMap.needsUpdate=!0}pickCharacterAtClientPos(t,o){if(!_.getState().showResidents||this.viewportWidth===0||this.viewportHeight===0)return null;const r=this.canvasEl.getBoundingClientRect();if(r.width===0||r.height===0)return null;const n=new Jt((t-r.left)/r.width*2-1,-((o-r.top)/r.height)*2+1);this.raycaster.setFromCamera(n,this.camera);const a=this.raycaster.ray;let l=null,s=1/0;for(let i=0;i<this.charPickSpheres.length;i++){const d=this.charPickSpheres[i];if(a.distanceSqToPoint(d.center)<=d.radiusSq){const h=a.origin.distanceToSquared(d.center);h<s&&(s=h,l=d.charId)}}return l}pickLocationAtClientPos(t,o){if(this.viewportWidth===0||this.viewportHeight===0)return null;const r=this.canvasEl.getBoundingClientRect();if(r.width===0||r.height===0)return null;const n=new Jt((t-r.left)/r.width*2-1,-((o-r.top)/r.height)*2+1);this.raycaster.setFromCamera(n,this.camera);const a=this.raycaster.ray;let l=null,s=1/0;for(let i=0;i<this.pickSpheres.length;i++){const d=this.pickSpheres[i];if(a.distanceSqToPoint(d.center)<=d.radiusSq){const h=a.origin.distanceToSquared(d.center);h<s&&(s=h,l=d.id)}}return l}setup3DRaycasting(){this.canvasEl.addEventListener("pointerdown",o=>{this.pointerDownPos={x:o.clientX,y:o.clientY}});let t=0;this.canvasEl.addEventListener("pointermove",o=>{if(o.buttons!==0)return;const r=performance.now();if(r-t<48)return;t=r;const a=this.pickCharacterAtClientPos(o.clientX,o.clientY)??this.pickLocationAtClientPos(o.clientX,o.clientY);this.canvasEl.style.cursor=a?"pointer":"grab"}),this.canvasEl.addEventListener("pointerup",o=>{if(o.button!==0||Math.hypot(o.clientX-this.pointerDownPos.x,o.clientY-this.pointerDownPos.y)>6)return;const n=this.pickCharacterAtClientPos(o.clientX,o.clientY);if(n){_.update({popupCharacterId:n}),this.flyToCharacter3D(n);return}const a=this.pickLocationAtClientPos(o.clientX,o.clientY);if(!a)return;const l=_.getState();l.routeMode&&(!l.routeStartId||l.routeStartId&&l.routeEndId?_.setRouteEndpoints(a,null):l.routeStartId!==a&&_.setRouteEndpoints(l.routeStartId,a)),_.update({selectedId:a,selectedCharacterId:null,popupCharacterId:null}),window.history.replaceState(null,"",`#loc=${a}`),this.flyToLocation(a)})}mountCameraPresetBar(){const[t,o]=K(.825,.745),r=Z(.825,.745),[n,a]=K(.48,.46),l=Z(.48,.46),[s,i]=K(.255,.32),d=Z(.255,.32),[c,h]=K(.855,.47),f=Z(.855,.47),[w,b]=K(.645,.105),g=Z(.645,.105),[$,p]=K(.38,.065),S=Z(.38,.065),[y,u]=K(.125,.775),x=Z(.125,.775),[m,k]=K(.92,.1),I=Z(.92,.1),L=[{id:"atlas-overview",label:"🗺️ Overview",pos:[0,860,920],target:[0,10,40]},{id:"village-3d",label:"🏘️ Human Village",pos:[n+45,l+95,a+145],target:[n,l+6,a],locId:"human-village"},{id:"hakurei-3d",label:"⛩️ Hakurei Shrine",pos:[s+28,d+46,i+82],target:[s,d+10,i],locId:"hakurei-shrine"},{id:"sdm-iso",label:"🦇 Scarlet Devil Mansion",pos:[t+88,r+78,o+128],target:[t,r+18,o+10],locId:"scarlet-devil-mansion"},{id:"eientei-3d",label:"🎋 Eientei & Bamboo",pos:[c+42,f+46,h+78],target:[c,f+8,h],locId:"eientei"},{id:"moriya-3d",label:"⛰️ Youkai Mt. & Moriya",pos:[w-55,g+52,b+88],target:[w,g+10,b],locId:"moriya-shrine"},{id:"hakugyokurou-3d",label:"🌸 Hakugyokurou",pos:[$+38,S+48,p+78],target:[$,S+10,p],locId:"hakugyokurou"},{id:"chireiden-3d",label:"🔥 Chireiden & Old Hell",pos:[y+42,x+46,u+78],target:[y,x+10,u],locId:"palace-of-earth-spirits"},{id:"lunar-3d",label:"🌕 Lunar Capital",pos:[m-42,I+46,k+78],target:[m,I+10,k],locId:"lunar-capital"}];this.cameraHudEl.innerHTML=`
      <div class="cam3d-bar-label">🎥 3D REALM &amp; LANDMARK CAMERAS (BLENDER GLB + PROCEDURAL):</div>
      <div class="cam3d-bar-pills">
        ${L.map((E,A)=>`<button class="cam3d-pill" data-idx="${A}">${E.label}</button>`).join("")}
      </div>
      <div class="cam3d-help">Click any 3D building or nameplate to inspect • Left-Drag: Orbit • Right-Drag: Pan • Scroll: Zoom</div>
    `,this.cameraHudEl.querySelectorAll(".cam3d-pill").forEach(E=>{E.addEventListener("click",()=>{const A=Number(E.getAttribute("data-idx")??0),H=L[A];H&&(this.flyToCameraPose(new U(...H.pos),new U(...H.target),950),H.locId&&(_.update({selectedId:H.locId,selectedCharacterId:null}),window.history.replaceState(null,"",`#loc=${H.locId}`)))})})}buildTerrainAndWater(t){const n=new Si(Be,Oe,250,170);n.rotateX(-Math.PI/2);const a=.024,l=t.regions.map(A=>{let H=1,O=0,v=1,M=0;for(const[C,F]of A.points)C<H&&(H=C),C>O&&(O=C),F<v&&(v=F),F>M&&(M=F);return{reg:A,color:new se(xa[A.biome]??8160600),minX:H-a,maxX:O+a,minY:v-a,maxY:M+a}}),s=.0045,i=t.lakes.filter(A=>A.points.length>=3).map(A=>{let H=0,O=0,v=1,M=0,C=1,F=0;for(const[z,B]of A.points)H+=z,O+=B,z<v&&(v=z),z>M&&(M=z),B<C&&(C=B),B>F&&(F=B);H/=A.points.length,O/=A.points.length;const R=Math.hypot(H-.685,O-.79)<.09?2.4:Z(H,O)+.85;return{lake:A,cx:H,cy:O,surfaceY:R,minX:v-s,maxX:M+s,minY:C-s,maxY:F+s}});this.lakePolygons=i.map(A=>({points:A.lake.points,surfaceY:A.surfaceY}));const d=n.attributes.position,c=new Float32Array(d.count*3),h=new se(7310926),f=new se(9413720),w=new se(7761504),b=new se(15921129),g=new se(2049384),$=new se(5181976),p=new se(12102014),S=new se;for(let A=0;A<d.count;A++){const H=d.getX(A),O=d.getZ(A),v=H/Be+.5,M=O/Oe+.5;let C=Z(v,M);const F=.5+.32*Math.sin(v*28+M*19)+.18*Math.cos(v*53-M*41);S.copy(h).lerp(f,Math.max(0,Math.min(1,F)));for(const R of l){if(v<R.minX||v>R.maxX||M<R.minY||M>R.maxY)continue;const z=Lo(v,M,R.reg.points,a);z>.001&&S.lerp(R.color,z*.92)}if(C>90){const R=Math.min(1,(C-90)/48);S.lerp(w,.45*(1-R)),S.lerp(b,R)}else if(C>26){const R=Math.min(.72,(C-26)/64);S.lerp(w,R)}const D=Math.hypot((v-.165)/.055,(M-.415)/.048);if(D<1){const R=1-$e(.25,1,D),z=.5+.5*Math.sin(v*210+M*170)*Math.cos(v*140-M*190),B=new se(6188164),X=new se(13123126);S.lerp(B,R*.78),z>.58&&S.lerp(X,R*(z-.58)*1.45)}for(const R of i){if(v<R.minX||v>R.maxX||M<R.minY||M>R.maxY)continue;const z=zt(v,M,R.lake.points),B=Lo(v,M,R.lake.points,s);if(B>.001){const X=R.surfaceY-3.6;if(z){const oe=C*(1-B)+X*B;C=Math.min(oe,R.surfaceY-.85)}else{const oe=Math.min(C,R.surfaceY+.25);C=C*(1-B*.65)+oe*(B*.65)}B<.45?S.lerp(p,B*1.4):S.lerp(R.lake.kind==="blood"?$:g,Math.min(1,(B-.25)*1.3))}}d.setY(A,C),c[A*3]=S.r,c[A*3+1]=S.g,c[A*3+2]=S.b}n.setAttribute("color",new It(c,3)),n.computeVertexNormals();const y=new N({vertexColors:!0,roughness:.86,metalness:.04}),u=new P(n,y);u.receiveShadow=!0,u.updateMatrixWorld(!0),this.terrainMesh=u,this.scene.add(u);const x=ya(this.scene,()=>this.requestShadowUpdate()).then(A=>(this.worldDioramaGroup=A,A));this.landmarkLoadPromises.push(x);const m=new N({color:2717877,roughness:.12,metalness:.32,transparent:!0,opacity:.88}),k=new N({color:9837606,roughness:.22,metalness:.18}),I=[],L=[];for(const A of i){const H=new Ci;A.lake.points.forEach(([v,M],C)=>{const[F,D]=K(v,M);C===0?H.moveTo(F,-D):H.lineTo(F,-D)}),H.closePath();const O=new Mi(H);O.rotateX(-Math.PI/2),O.translate(0,A.surfaceY,0),A.lake.kind==="blood"?L.push(O):I.push(O)}if(I.length>0){const A=we(I,!1);if(A){const H=new P(A,m);H.receiveShadow=!0,this.scene.add(H)}}if(L.length>0){const A=we(L,!1);if(A){const H=new P(A,k);H.receiveShadow=!0,this.scene.add(H)}}const E=[];for(const A of t.rivers){const H=A.points.map(([M,C])=>{const[F,D]=K(M,C),R=Z(M,C)+.55;return new U(F,R,D)}),O=new Ct(H),v=new tt(O,64,A.width*.52,6,!1);v.scale(1,.14,1),E.push(v)}if(E.length>0){const A=we(E,!1);if(A){const H=new P(A,m);H.receiveShadow=!0,this.scene.add(H)}}}buildInstancedForests(){ga().then(t=>{if(!t)return;let o=17;const r=()=>(o=o*16807%2147483647,(o-1)/2147483646),n=_.getLocations(),a=(i,d)=>{if(Math.hypot(i-.48,d-.46)<.068||Math.hypot(i-.825,d-.745)<.065||Math.hypot(i-.255,d-.32)<.036||Math.hypot(i-.382,d-.585)<.032||Math.hypot(i-.855,d-.47)<.032||Math.hypot(i-.685,d-.785)<.098||Math.hypot(i-.645,d-.105)<.032||Math.hypot(i-.698,d-.148)<.028||Math.hypot(i-.355,d-.07)<.038||Math.hypot(i-.912,d-.092)<.038)return!1;for(const c of this.lakePolygons)if(zt(i,d,c.points))return!1;for(const c of n){const h=qe[c.id]?.022:.009;if(Math.hypot(i-c.x,d-c.y)<h)return!1}for(const c of Ue)if(Math.hypot(i-c.x,d-c.y)<.007)return!1;return!0},l=new eo,s=dt;if(t.PineTree){const d=new Te(t.PineTree,s,640);d.castShadow=!0,d.receiveShadow=!0;const c=[[.42,.72,.54,.75,200],[.4,.84,.13,.36,220],[.74,.95,.56,.88,120],[.34,.62,.35,.55,100]];let h=0;for(const[f,w,b,g,$]of c)for(let p=0;p<$&&h<640;p++){const S=f+r()*(w-f),y=b+r()*(g-b);if(!a(S,y))continue;const[u,x]=K(S,y),m=Z(S,y),k=.78+r()*.65;l.position.set(u,m,x),l.scale.set(k,k,k),l.rotation.set(0,r()*Math.PI*2,0),l.updateMatrix(),d.setMatrixAt(h++,l.matrix)}d.count=h,d.instanceMatrix.needsUpdate=!0,this.scene.add(d)}if(t.AutumnTree){const d=new Te(t.AutumnTree,s,340);d.castShadow=!0,d.receiveShadow=!0;const c=[[.14,.39,.22,.65,185],[.54,.78,.12,.29,155]];let h=0;for(const[f,w,b,g,$]of c)for(let p=0;p<$&&h<340;p++){const S=f+r()*(w-f),y=b+r()*(g-b);if(!a(S,y))continue;const[u,x]=K(S,y),m=Z(S,y),k=.78+r()*.65;l.position.set(u,m,x),l.scale.set(k,k,k),l.rotation.set(0,r()*Math.PI*2,0),l.updateMatrix(),d.setMatrixAt(h++,l.matrix)}d.count=h,d.instanceMatrix.needsUpdate=!0,this.scene.add(d)}if(t.BambooCluster){const d=new Te(t.BambooCluster,s,220);d.castShadow=!0,d.receiveShadow=!0;let c=0;for(let h=0;h<220;h++){const f=.69+r()*.25,w=.33+r()*.21;if(!a(f,w))continue;const[b,g]=K(f,w),$=Z(f,w),p=.82+r()*.55;l.position.set(b,$,g),l.scale.set(p,p,p),l.rotation.set(0,r()*Math.PI*2,0),l.updateMatrix(),d.setMatrixAt(c++,l.matrix)}d.count=c,d.instanceMatrix.needsUpdate=!0,this.scene.add(d)}if(t.SakuraTree){const d=new Te(t.SakuraTree,s,240);d.castShadow=!0,d.receiveShadow=!0;const c=[[.27,.49,.03,.13,100],[.11,.22,.36,.47,60],[.21,.3,.27,.37,42],[.34,.44,.52,.63,38]];let h=0;for(const[f,w,b,g,$]of c)for(let p=0;p<$&&h<240;p++){const S=f+r()*(w-f),y=b+r()*(g-b);if(!a(S,y))continue;const[u,x]=K(S,y),m=Z(S,y),k=.8+r()*.65;l.position.set(u,m,x),l.scale.set(k,k,k),l.rotation.set(0,r()*Math.PI*2,0),l.updateMatrix(),d.setMatrixAt(h++,l.matrix)}d.count=h,d.instanceMatrix.needsUpdate=!0,this.scene.add(d)}if(t.MushroomCluster){const d=new Te(t.MushroomCluster,s,80);d.castShadow=!0;let c=0;for(let h=0;h<80;h++){const f=.45+r()*.24,w=.56+r()*.17;if(!a(f,w))continue;const[b,g]=K(f,w),$=Z(f,w),p=.75+r()*.65;l.position.set(b,$,g),l.scale.set(p,p,p),l.rotation.set(0,r()*Math.PI*2,0),l.updateMatrix(),d.setMatrixAt(c++,l.matrix)}d.count=c,d.instanceMatrix.needsUpdate=!0,this.scene.add(d)}this.requestShadowUpdate()})}build3DLandmarks(){const t=[["scarlet-devil-mansion",.825,.745,pa],["human-village",.48,.46,la],["hakurei-shrine",.255,.32,ca],["myouren-temple",.382,.585,da],["eientei",.855,.47,ha],["moriya-shrine",.645,.105,ua],["palace-of-earth-spirits",.125,.775,fa]];for(const[d,c,h,f]of t){const[w,b]=K(c,h),g=Z(c,h),$=new U(w,g,b),p=Mo(d,this.footprintsGroup,$,()=>this.requestShadowUpdate()).then(S=>{if(!S){const y=f();y.position.copy($),ri(y,d),this.footprintsGroup.add(y),this.requestShadowUpdate()}});this.landmarkLoadPromises.push(p)}const[o,r]=K(.685,.785),n=Z(.685,.785),a=new N({color:16054527,transparent:!0,opacity:.22,roughness:1,depthWrite:!1}),l=[];for(let d=0;d<3;d++){const c=new ee(85-d*14,92-d*14,.6,20);c.translate(o+(d-1)*18,n+3.2+d*2.1,r+(d-1)*12),l.push(c)}const s=[[.64,.19,105,8],[.71,.22,92,12],[.57,.21,88,6],[.65,.14,96,18]];for(const[d,c,h,f]of s){const[w,b]=K(d,c),g=Z(d,c),$=new ee(h*.88,h,1.4,20);$.translate(w,g+f,b),l.push($)}const i=we(l,!1);i&&this.scene.add(new P(i,a))}build3DRoads(t){const o=new N({color:14205848,roughness:.9}),r=new N({color:9071947,roughness:.92}),n=[],a=[];for(const l of t){if(l.kind==="portal"||l.points.length<2)continue;const s=l.points.map(([h,f])=>{const[w,b]=K(h,f),g=Z(h,f)+.55;return new U(w,g,b)}),i=new Ct(s),d=l.kind==="road"?1.6:.9,c=new tt(i,Math.max(10,s.length*6),d,5,!1);c.scale(1,.25,1),l.kind==="road"?n.push(c):a.push(c)}if(n.length>0){const l=we(n,!1);l&&this.routesGroup.add(new P(l,o))}if(a.length>0){const l=we(a,!1);l&&this.routesGroup.add(new P(l,r))}}updateActiveRoute3D(t){if(this.activeRouteGroup.clear(),!t)return;const o=new N({color:11940906,emissive:16735802,emissiveIntensity:.75,roughness:.3});if(t.segments.length>0)for(const r of t.segments){const n=r.points.map(([s,i])=>{const[d,c]=K(s,i),h=Z(s,i)+2.2;return new U(d,h,c)}),a=new Ct(n),l=new tt(a,32,2.4,8,!1);this.activeRouteGroup.add(new P(l,o))}else{const[r,n]=K(t.from.x,t.from.y),[a,l]=K(t.to.x,t.to.y),s=Z(t.from.x,t.from.y)+3,i=Z(t.to.x,t.to.y)+3,d=new Li(new U(r,s,n),new U(a,i,l)),c=new tt(d,16,2.2,8,!1);this.activeRouteGroup.add(new P(c,o))}}build3DMarkersAndLabels(t){this.markersGroup.clear(),this.labelsContainer.innerHTML="",this.labelEls.clear(),this.floatingObjects=[],this.pickSpheres=[];const o={"scarlet-devil-mansion":68,"human-village":28,"hakurei-shrine":34,"myouren-temple":36,eientei:28,"moriya-shrine":36,"palace-of-earth-spirits":34},[r,n]=K(.825,.745),a=Z(.825,.745),l={"voile-library":new U(r-31.5,a+26,n-12),"sdm-parlor-dining":new U(r+26,a+18,n+2),"sdm-gardens-east-wing":new U(r+24,a+22,n-22)},s=new Set(["shining-needle-castle","torifune-space-shrine"]),i=[],d=document.createDocumentFragment();for(const c of t){const[h,f]=K(c.x,c.y),w=Z(c.x,c.y),b=o[c.id]??(c.id==="heaven"||c.id==="bhava-agra"?114:c.id==="shining-needle-castle"?52:c.id==="tengu-village"?46:c.id==="torifune-space-shrine"?28:qe[c.id]?26:c.importance===1?16:11),g=l[c.id]?l[c.id].clone():new U(h,w+b,f),$=o[c.id]?36:qe[c.id]?26:12,p=c.id==="heaven"||c.id==="bhava-agra"?96:$*.45;if(this.pickSpheres.push({id:c.id,center:new U(h,w+p,f),radiusSq:$*$}),!o[c.id]&&!l[c.id]&&c.id!=="dragon-statue")if(qe[c.id]){const u=new U(h,w,f),x=Mo(c.id,this.markersGroup,u,()=>this.requestShadowUpdate()).then(m=>{m&&s.has(c.id)&&this.floatingObjects.push({obj:m,baseY:m.position.y,phase:(c.x*13+c.y*7)*Math.PI})});this.landmarkLoadPromises.push(x)}else if(s.has(c.id)){const u=Co(c);u.position.set(h,w,f),this.markersGroup.add(u),this.floatingObjects.push({obj:u,baseY:w,phase:(c.x*13+c.y*7)*Math.PI})}else{const u=Co(c);u.position.set(h,w,f),ba(u,i)}const S=document.createElement("div");S.className=`pin-3d-label imp-${c.importance}`,S.setAttribute("data-id",c.id);const y=vt[c.kind]??"#b6342a";S.innerHTML=`
        <span class="pin-3d-dot" style="background:${y};"></span>
        <span class="pin-3d-en">${c.name_en}</span>
        ${c.importance===1?`<span class="pin-3d-jp">${c.name_jp}</span>`:""}
      `,S.addEventListener("click",u=>{u.stopPropagation();const x=_.getState();x.routeMode&&(!x.routeStartId||x.routeStartId&&x.routeEndId?_.setRouteEndpoints(c.id,null):x.routeStartId!==c.id&&_.setRouteEndpoints(x.routeStartId,c.id)),_.update({selectedId:c.id,selectedCharacterId:null,popupCharacterId:null}),window.history.replaceState(null,"",`#loc=${c.id}`),this.flyToLocation(c.id)}),d.appendChild(S),this.labelEls.set(c.id,{el:S,worldPos:g,loc:c,filteredOut:!1,lastVis:!0,lastX:-9999,lastY:-9999})}if(this.labelsContainer.appendChild(d),i.length>0){const c=we(i,!1);if(c){const h=new P(c,dt);h.castShadow=!0,h.receiveShadow=!0,this.markersGroup.add(h)}}}build3DCharacters(){const t={heaven:89.8,"bhava-agra":89.8},o=document.createDocumentFragment(),r=[];for(const a of Ue){const[l,s]=K(a.x,a.y),i=a.id==="wakasagihime"?2.4:Z(a.x,a.y)+(t[a.locationId]??0);r.push({p:a,wx:l,wy:i,wz:s}),this.charPickSpheres.push({charId:a.id,center:new U(l,i+4.2,s),radiusSq:7.5*7.5});const d=document.createElement("div");d.className="char-3d-label",d.setAttribute("data-char-id",a.id);const c=Qe(a);d.innerHTML=`
        <img class="char-3d-pixel" src="${c}" alt="" />
        <span class="char-3d-name">${a.shortName}</span>
      `,d.style.setProperty("--char-accent",a.accentColor),d.addEventListener("click",h=>{h.stopPropagation(),_.update({popupCharacterId:a.id}),this.flyToCharacter3D(a.id)}),o.appendChild(d),this.charLabelEls.set(a.id,{el:d,worldPos:new U(l,i+9.2,s),placement:a,filteredOut:!1,lastVis:!1,lastX:-9999,lastY:-9999})}this.labelsContainer.appendChild(o);const n=(a,l)=>{const s=a.clone().toNonIndexed();s.applyMatrix4(l),s.computeVertexNormals();const i=s.attributes.position,d=s.attributes.normal,c=s.attributes.color,h=i.count,f=new Float32Array(h*3);if(c)for(let b=0;b<h;b++)f[b*3]=c.getX(b),f[b*3+1]=c.getY(b),f[b*3+2]=c.getZ(b);else f.fill(.85);const w=new _i;return w.setAttribute("position",i),w.setAttribute("normal",d),w.setAttribute("color",new It(f,3)),w};Promise.all([ma(),...this.landmarkLoadPromises]).then(([a])=>{if(!a)return;this.terrainMesh&&this.terrainMesh.updateMatrixWorld(!0),this.worldDioramaGroup&&this.worldDioramaGroup.updateMatrixWorld(!0),this.footprintsGroup.updateMatrixWorld(!0),this.markersGroup.updateMatrixWorld(!0);const l=[],s=m=>{m&&m.traverse(k=>{k.isMesh&&l.push(k)})};s(this.worldDioramaGroup),s(this.footprintsGroup),s(this.markersGroup);const i=new Zt,d=new U(0,-1,0),c=new U,h=[],f=(m,k)=>{if(this.terrainMesh){c.set(m,400,k),i.set(c,d);const E=i.intersectObject(this.terrainMesh,!1);if(E.length>0)return E[0].point.y}const I=m/Be+.5,L=k/Oe+.5;return Z(I,L)},w=(m,k)=>{for(const I of this.lakePolygons){let L=!1;const E=I.points;for(let A=0,H=E.length-1;A<E.length;H=A++){const O=E[A][0],v=E[A][1],M=E[H][0],C=E[H][1];v>k!=C>k&&m<(M-O)*(k-v)/(C-v+1e-9)+O&&(L=!L)}if(L)return!0}return!1},b=2.8,g=[[0,0],[b,0],[-b,0],[0,b],[0,-b],[b*.7,b*.7],[-b*.7,b*.7],[b*.7,-b*.7],[-b*.7,-b*.7]],$=(m,k,I)=>{if(I.id==="wakasagihime")return{clear:!0,groundY:2.4};const L=m/Be+.5,E=k/Oe+.5,A=f(m,k);if(I.locationId==="heaven"||I.locationId==="bhava-agra"){c.set(m,300,k),i.set(c,d);const M=i.intersectObjects(l,!1).filter(C=>C.point.y>100);return M.length>0?{clear:!0,groundY:M[0].point.y}:{clear:!1,groundY:A+89.8}}if(w(L,E))return{clear:!1,groundY:A};let H=A,O=1/0,v=-1/0;for(let M=0;M<g.length;M++){const[C,F]=g[M],D=m+C,R=k+F,z=M===0?A:f(D,R);c.set(D,z+160,R),i.set(c,d);const B=i.intersectObjects(l,!1).filter(oe=>oe.point.y>.05&&!oe.object.name.includes("CrustSlab"));let X=z;if(B.length>0){const oe=B[0].point.y;if(oe-z>4.8)return{clear:!1,groundY:A};X=Math.max(z,oe)}M===0&&(H=X),X<O&&(O=X),X>v&&(v=X)}return v-O>1.8?{clear:!1,groundY:H}:{clear:!0,groundY:H}},p=[],S=[],y=new eo,u=[0,.35,-.35,.75,-.75,1.15,-1.15,1.57,-1.57,2.1,-2.1,2.6,-2.6,Math.PI],x=[5,10,15,20,26,32,40,48,56,66];for(let m=0;m<r.length;m++){const k=r[m],{p:I}=k;let L=k.wx,E=k.wz,A=k.wy;const H=$(L,E,I),O=(F,D)=>h.some(([R,z])=>Math.hypot(F-R,D-z)<4.5);if(H.clear&&!O(L,E))A=H.groundY;else{let F=!1;for(const D of x){for(const R of u){const z=k.wx+Math.sin(R)*D,B=k.wz+Math.cos(R)*D;if(O(z,B))continue;const X=$(z,B,I);if(X.clear){L=z,E=B,A=X.groundY,F=!0;break}}if(F)break}}h.push([L,E]),k.wx=L,k.wy=A,k.wz=E,this.charPickSpheres[m]&&this.charPickSpheres[m].center.set(L,A+4.2,E);const v=this.charLabelEls.get(I.id);v&&v.worldPos.set(L,A+9.2,E);const M=a[`${I.id}_Opaque`],C=a[`${I.id}_Emissive`];y.position.set(L,A,E),y.rotation.set(0,(m%5-2)*.14,0),y.scale.setScalar(3.5),y.updateMatrix(),M&&p.push(n(M,y.matrix)),C&&S.push(n(C,y.matrix))}if(p.length>0){const m=we(p,!1);if(m){const k=new P(m,dt);k.castShadow=!0,k.receiveShadow=!0,this.residentsGroup.add(k)}}if(S.length>0){const m=we(S,!1);if(m){const k=new P(m,oi);k.castShadow=!1,k.receiveShadow=!1,this.residentsGroup.add(k)}}this.labelsDirty=!0,this.requestShadowUpdate()})}updateLabelFilterStates(){const t=_.getState(),o=t.searchQuery.trim().toLowerCase(),r=t.popupCharacterId??t.selectedCharacterId;for(const[n,a]of this.labelEls.entries()){const{el:l,loc:s}=a,i=n===t.selectedId;l.classList.toggle("is-selected",i);const d=t.regionFilter==="All"||s.region===t.regionFilter,c=t.kindFilter==="All"||s.kind===t.kindFilter,h=!o||s.name_en.toLowerCase().includes(o)||s.name_jp.toLowerCase().includes(o)||s.residents.some(f=>f.toLowerCase().includes(o));a.filteredOut=!d||!c||!h}for(const[n,a]of this.charLabelEls.entries()){const{el:l,placement:s}=a,i=n===r;l.classList.toggle("is-selected",i);const d=t.regionFilter==="All"||s.region===t.regionFilter,c=_.getCharacter(n),h=!o||s.shortName.toLowerCase().includes(o)||s.spotLabel.toLowerCase().includes(o)||!!(c&&(c.name_en.toLowerCase().includes(o)||c.name_jp.toLowerCase().includes(o)||c.title.toLowerCase().includes(o)));a.filteredOut=!t.showResidents||!d||!h}this.labelsDirty=!0}updateProjectedLabels(){const t=this.viewportWidth,o=this.viewportHeight,r=t*.5,n=o*.5,a=this.camera.position,l=_.getState(),s=l.selectedId,i=l.popupCharacterId??l.selectedCharacterId,d=a.y<115,c=new U;for(const[h,f]of this.labelEls.entries()){if(f.filteredOut){f.lastVis&&(f.el.style.display="none",f.lastVis=!1);continue}const{el:w,worldPos:b,loc:g}=f,$=a.distanceTo(b);if(!(h===s)&&(d&&$>195||g.importance===3&&$>340||g.importance===2&&$>780)){f.lastVis&&(w.style.display="none",f.lastVis=!1);continue}if(c.copy(b).project(this.camera),c.z>1){f.lastVis&&(w.style.display="none",f.lastVis=!1);continue}const S=c.x*r+r,y=-c.y*n+n;if(S<-80||S>t+80||y<-40||y>o+40){f.lastVis&&(w.style.display="none",f.lastVis=!1);continue}f.lastVis||(w.style.display="inline-flex",f.lastVis=!0),(Math.abs(S-f.lastX)>.35||Math.abs(y-f.lastY)>.35)&&(f.lastX=S,f.lastY=y,w.style.transform=`translate3d(${S.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`)}for(const[h,f]of this.charLabelEls.entries()){if(f.filteredOut){f.lastVis&&(f.el.style.display="none",f.lastVis=!1);continue}const{el:w,worldPos:b}=f,g=a.distanceTo(b);if(!(h===i)&&g>480){f.lastVis&&(w.style.display="none",f.lastVis=!1);continue}if(c.copy(b).project(this.camera),c.z>1){f.lastVis&&(w.style.display="none",f.lastVis=!1);continue}const p=c.x*r+r,S=-c.y*n+n;if(p<-60||p>t+60||S<-30||S>o+30){f.lastVis&&(w.style.display="none",f.lastVis=!1);continue}f.lastVis||(w.style.display="inline-flex",f.lastVis=!0),(Math.abs(p-f.lastX)>.35||Math.abs(S-f.lastY)>.35)&&(f.lastX=p,f.lastY=S,w.style.transform=`translate3d(${p.toFixed(1)}px, ${S.toFixed(1)}px, 0) translate(-50%, -100%)`)}}applyTimeOfDay(t){if(t==="day"){this.scene.background=new se(14477042),this.scene.fog=new et(14477042,38e-5),this.ambientLight.color.setHex(16774886),this.ambientLight.groundColor.setHex(6050630),this.ambientLight.intensity=.95,this.sunLight.color.setHex(16773846),this.sunLight.intensity=1.65,this.sunLight.position.set(420,680,380),this.sdmPointLight.visible=!1,this.sdmPointLight.intensity=0;for(const o of this.nightPointLights)o.visible=!1,o.intensity=0}else if(t==="dusk"){this.scene.background=new se(14261106),this.scene.fog=new et(14261106,45e-5),this.ambientLight.color.setHex(16758917),this.ambientLight.groundColor.setHex(4336164),this.ambientLight.intensity=.78,this.sunLight.color.setHex(16747586),this.sunLight.intensity=1.45,this.sunLight.position.set(-540,320,480),this.sdmPointLight.visible=!0,this.sdmPointLight.intensity=2.2;for(const o of this.nightPointLights)o.visible=!0,o.intensity=1.8}else{this.scene.background=new se(988710),this.scene.fog=new et(988710,48e-5),this.ambientLight.color.setHex(4743833),this.ambientLight.groundColor.setHex(1316900),this.ambientLight.intensity=.52,this.sunLight.color.setHex(8956671),this.sunLight.intensity=.55,this.sunLight.position.set(-320,580,-320),this.sdmPointLight.visible=!0,this.sdmPointLight.intensity=4.5;for(const o of this.nightPointLights)o.visible=!0,o.intensity=3.8}this.requestShadowUpdate()}setActive(t){if(this.isActive!==t)if(this.isActive=t,this.containerEl.style.display=t?"block":"none",t){this.handleResize(),this.updateLabelFilterStates(),this.requestShadowUpdate();const o=_.getState().selectedId;o&&this.flyToLocation(o),this.startLoop()}else this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=0)}handleResize(){if(!this.isActive)return;const t=this.containerEl.clientWidth||window.innerWidth,o=this.containerEl.clientHeight||window.innerHeight;this.viewportWidth=t,this.viewportHeight=o,this.camera.aspect=t/Math.max(1,o),this.camera.updateProjectionMatrix(),this.renderer.setSize(t,o),this.labelsDirty=!0}startLoop(){const t=new U,o=new U,r=n=>{if(!this.isActive)return;if(this.rafId=requestAnimationFrame(r),this.flyAnim){const s=Math.min(1,(n-this.flyAnim.startTime)/this.flyAnim.duration),i=1-Math.pow(1-s,3);this.camera.position.lerpVectors(this.flyAnim.fromPos,this.flyAnim.toPos,i),this.controls.target.lerpVectors(this.flyAnim.fromTarget,this.flyAnim.toTarget,i),s>=1&&(this.flyAnim=null)}const a=n*.001;for(let s=0;s<this.floatingObjects.length;s++){const i=this.floatingObjects[s];i.obj.position.y=i.baseY+Math.sin(a*1.4+i.phase)*1.8}this.controls.update(),(t.distanceToSquared(this.camera.position)>5e-4||o.distanceToSquared(this.controls.target)>5e-4||this.labelsDirty)&&(t.copy(this.camera.position),o.copy(this.controls.target),this.labelsDirty=!1,this.updateProjectedLabels()),this.renderer.render(this.scene,this.camera)};this.rafId=requestAnimationFrame(r)}flyToCameraPose(t,o,r=900){this.flyAnim={startTime:performance.now(),duration:r,fromPos:this.camera.position.clone(),fromTarget:this.controls.target.clone(),toPos:t,toTarget:o}}flyToCharacter3D(t){const o=this.charPickSpheres.find(n=>n.charId===t);if(o){const{x:n,y:a,z:l}=o.center;this.flyToCameraPose(new U(n+14,a+26,l+44),new U(n,a+1.5,l),750);return}const r=wt(t);if(r){const[n,a]=K(r.x,r.y),l=Z(r.x,r.y);this.flyToCameraPose(new U(n+14,l+28,a+44),new U(n,l+3.5,a),750)}}flyToNormalized(t,o,r=2.6){const[n,a]=K(t,o),l=Z(t,o);if(Math.hypot(t-.825,o-.745)<.025){this.flyToCameraPose(new U(n+88,l+78,a+128),new U(n,l+18,a-6),950);return}const s=Math.max(85,360/Math.max(1,r*.75));this.flyToCameraPose(new U(n+s*.25,l+s*.68,a+s*.82),new U(n,l+6,a),850)}flyToLocation(t){const[o,r]=K(.825,.745),n=Z(.825,.745);if(t==="voile-library"){this.flyToCameraPose(new U(o-96,n+54,r+32),new U(o-36,n+14,r-12),900);return}if(t==="sdm-parlor-dining"){this.flyToCameraPose(new U(o+94,n+52,r+56),new U(o+32,n+12,r+4),900);return}if(t==="sdm-gardens-east-wing"){this.flyToCameraPose(new U(o+96,n+62,r-72),new U(o+32,n+14,r-26),900);return}const a=_.getLocation(t);a&&this.flyToNormalized(a.x,a.y,2.8)}zoomByFactor(t){const o=new U().subVectors(this.camera.position,this.controls.target);o.multiplyScalar(1/t);const r=o.length();r<this.controls.minDistance&&o.setLength(this.controls.minDistance),r>this.controls.maxDistance&&o.setLength(this.controls.maxDistance),this.flyToCameraPose(new U().addVectors(this.controls.target,o),this.controls.target.clone(),300)}resetView(){this.flyToCameraPose(new U(0,860,920),new U(0,10,40),850)}}function $a(e){const t=T,o=G,r="https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui",n=[{cx:.695*t,cy:.785*o,rx:165,ry:68,cls:"cloud-drift-slow"},{cx:.785*t,cy:.755*o,rx:120,ry:52,cls:"cloud-drift-fast"},{cx:.805*t,cy:.445*o,rx:145,ry:58,cls:"cloud-drift-slow"},{cx:.305*t,cy:.155*o,rx:130,ry:48,cls:"cloud-drift-fast"},{cx:.655*t,cy:.135*o,rx:150,ry:45,cls:"cloud-drift-slow"}];let a='<g class="mist-banks" pointer-events="none">';for(const s of n)a+=`
      <ellipse
        cx="${s.cx.toFixed(1)}"
        cy="${s.cy.toFixed(1)}"
        rx="${s.rx}"
        ry="${s.ry}"
        fill="url(#mist-gradient)"
        class="${s.cls}"
      />
    `;a+="</g>";const l=[[.56*t,.015*o,240,120],[.7*t,.025*o,220,110],[.34*t,.02*o,210,105],[.82*t,.14*o,220,110]];a+='<g class="woodblock-clouds cloud-drift-slow" opacity="0.82" pointer-events="none">';for(const[s,i,d,c]of l)a+=`
      <image
        href="${r}/ukiyo-cloud-cluster.webp"
        x="${s.toFixed(1)}"
        y="${i.toFixed(1)}"
        width="${d}"
        height="${c}"
      />
    `;a+="</g>",a+='<g class="night-only" pointer-events="none">';for(let s=0;s<45;s++){const i=s*173%(t-160)+80,d=s*251%(o-140)+70,c=s%3===0?2.4:1.6,h=s%2===0?"#ffe885":"#9ef0d6";a+=`<circle cx="${i}" cy="${d}" r="${c}" fill="${h}" opacity="0.78" />`}a+="</g>",e.innerHTML=a}function Sa(e){const t=T,o=G,r="https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui",n=.555*t,a=.492*o,l=.392*t,s=.422*o;e.innerHTML=`
    <!-- 1. Great Hakurei Barrier Cartographic Boundary Ring -->
    <g class="hakurei-barrier-ring" opacity="0.68" pointer-events="none">
      <ellipse cx="${n}" cy="${a}" rx="${l}" ry="${s}" fill="none" stroke="url(#barrier-gradient)" stroke-width="6" opacity="0.22" />
      <ellipse cx="${n}" cy="${a}" rx="${l}" ry="${s}" fill="none" stroke="#8f322a" stroke-width="1.6" stroke-dasharray="14 6 3 6" />
    </g>

    <!-- 2. Outer Antique Atlas Frame & Double Key-Fret Rules -->
    <g class="atlas-outer-frame" pointer-events="none">
      <rect x="12" y="12" width="${t-24}" height="${o-24}" fill="none" stroke="var(--border-ink)" stroke-width="5.5" />
      <rect x="20" y="20" width="${t-40}" height="${o-40}" fill="none" stroke="var(--border-gold)" stroke-width="2.4" stroke-dasharray="10 4 3 4" />
      <rect x="26" y="26" width="${t-52}" height="${o-52}" fill="none" stroke="var(--border-ink)" stroke-width="1.4" />

      <!-- Corner Key-Fret Medallions -->
      <g stroke="var(--border-ink)" stroke-width="2.2" fill="var(--paper-card)">
        <rect x="12" y="12" width="32" height="32" />
        <rect x="18" y="18" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="28" cy="28" r="3.5" fill="var(--accent-hakurei)" stroke="none" />

        <rect x="${t-44}" y="12" width="32" height="32" />
        <rect x="${t-38}" y="18" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="${t-28}" cy="28" r="3.5" fill="var(--accent-hakurei)" stroke="none" />

        <rect x="12" y="${o-44}" width="32" height="32" />
        <rect x="18" y="${o-38}" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="28" cy="${o-28}" r="3.5" fill="var(--accent-hakurei)" stroke="none" />

        <rect x="${t-44}" y="${o-44}" width="32" height="32" />
        <rect x="${t-38}" y="${o-38}" width="20" height="20" fill="none" stroke="var(--border-gold)" stroke-width="1.6" />
        <circle cx="${t-28}" cy="${o-28}" r="3.5" fill="var(--accent-hakurei)" stroke="none" />
      </g>
    </g>

    <!-- 3. Hand-Painted Japanese Makimono Title Scroll Banner (Fitted cleanly inside the open parchment area) -->
    <g class="atlas-title-scroll" transform="translate(${.485*t}, 82)" pointer-events="none">
      <image
        href="${r}/title-scroll-banner.webp"
        x="-340"
        y="-70"
        width="680"
        height="150"
        preserveAspectRatio="xMidYMid meet"
      />
      <!-- Text shifted +26px right to sit squarely inside the blank parchment between the left maple leaves and right roller -->
      <text
        x="26"
        y="-2"
        text-anchor="middle"
        font-family="var(--font-display)"
        font-size="19"
        font-weight="700"
        fill="#22130b"
        stroke="#f7ebd2"
        stroke-width="3"
        paint-order="stroke"
        letter-spacing="1.6"
      >
        GENSOKYO — 幻想郷全図
      </text>
      <text
        x="26"
        y="15"
        text-anchor="middle"
        font-family="var(--font-serif)"
        font-style="italic"
        font-size="12"
        font-weight="700"
        fill="#3d2718"
        stroke="#f7ebd2"
        stroke-width="2.5"
        paint-order="stroke"
      >
        1:1 Interactive Cartographic Atlas • From Highest Peak to Deepest Underworld
      </text>
    </g>

    <!-- 4. Ornate Japanese Edo Brass & Lacquer Astrolabe Compass Rose (Placed in open eastern margin, clear of Lunar Capital) -->
    <g class="atlas-compass-rose" transform="translate(${.935*t}, ${.605*o})" pointer-events="none">
      <image
        href="${r}/compass-rose.webp"
        x="-56"
        y="-56"
        width="112"
        height="112"
      />
      <text x="0" y="-62" text-anchor="middle" font-family="var(--font-display)" font-size="14" font-weight="700" fill="var(--accent-hakurei)" stroke="var(--paper-bg)" stroke-width="3.2" paint-order="stroke">N</text>
      <text x="66" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">E</text>
      <text x="0" y="72" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">S</text>
      <text x="-66" y="5" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" stroke="var(--paper-bg)" stroke-width="3" paint-order="stroke">W</text>
    </g>
  `}function Ca(e,t){return!(e.x2<t.x1||e.x1>t.x2||e.y2<t.y1||e.y1>t.y2)}const Ma={"human-village":["bottom","right","top","left"],"terakoya-school":["top","left","right","bottom"],"human-village-market-square":["right","left","bottom","top"],suzunaan:["bottom","right","left","top"],"hieda-estate":["left","top","bottom","right"],geidontei:["left","bottom","top","right"],"dragon-statue":["right","top","left","bottom"],"kirisame-shop":["right","bottom","top","left"],"canal-of-willows":["right","bottom","left","top"]};function La(e,t,o){if(o||t>=2.2)return e;const r=e.replace(/\s*\([^)]*\)\s*/g,"").trim();return r==="Higan & Ministry of Right and Wrong"?"Higan":r==="Hall of Dreams Great Mausoleum"?"Divine Spirit Mausoleum":r==="The Underworld"?"Underworld Cavern":r||e}function _o(e,t,o,r,n,a){let l="";const s=[],i=Math.max(.42,Math.min(1.08,1/Math.pow(r,.58)));r<2&&s.push({x1:.34*T,y1:14,x2:.63*T,y2:112});for(const c of t){if(n!=="All"&&c.region!==n||a!=="All"&&c.kind!==a||c.importance===3&&r<1.5&&c.id!==o)continue;const h=c.x*T,f=c.y*G,w=(c.importance===1?10:7)*i;s.push({x1:h-w,y1:f-w,x2:h+w,y2:f+w})}const d=[...t].sort((c,h)=>c.id===o?-1:h.id===o?1:c.importance-h.importance);l+='<g class="pin-labels">';for(const c of d){if(n!=="All"&&c.region!==n||a!=="All"&&c.kind!==a)continue;const h=c.id===o;if(!h&&(c.importance===2&&r<1.25||c.importance===3&&r<2.15))continue;const f=c.x*T,w=c.y*G,b=La(c.name_en,r,h),g=c.importance===1||h||r>=1.75,$=c.importance===1?13.8:c.importance===2?12.2:11.2,p=$*i,S=b.length*($*.58)*i,y=g?(c.name_jp?.length??0)*($*.88)*i:0,u=Math.max(S,y)+20*i,x=(g?30:18)*i,m=(c.importance===1?15.5:12)*i,k=Ma[c.id]??["bottom","right","left","top"];let I=null,L=f,E=w+m,A=null;for(const F of k){let D=f,R=w;F==="bottom"?(D=f,R=w+m-3*i):F==="top"?(D=f,R=w-m-x-(c.icon?14*i:2*i)):F==="right"?(D=f+m+u/2+4*i,R=w-x/2):F==="left"&&(D=f-m-u/2-4*i,R=w-x/2);const z={x1:D-u/2-4*i,y1:R-2.5*i,x2:D+u/2+4*i,y2:R+x+2.5*i};if(!s.some(B=>Ca(z,B))){I=F,L=D,E=R,A=z;break}}if(!A&&h){const F=k[0];I=F,F==="top"?(L=f,E=w-m-x-12*i):F==="right"?(L=f+m+u/2+4*i,E=w-x/2):F==="left"?(L=f-m-u/2-4*i,E=w-x/2):(L=f,E=w+m-3*i),A={x1:L-u/2,y1:E,x2:L+u/2,y2:E+x}}if(!A||!I)continue;s.push(A);const H=g?`<tspan x="0" dy="${(12.2*i).toFixed(1)}" font-family="var(--font-jp)" font-size="${(p*.78).toFixed(1)}" fill="var(--ink-jp-accent)" font-weight="700">${c.name_jp}</tspan>`:"",O=h?"var(--accent-hakurei)":c.importance===1?"var(--border-ink)":"rgba(66, 46, 31, 0.72)",v=((h?1.8:1.25)*i).toFixed(2);let M="";if(I==="right"){const F=(f-L+8*i).toFixed(1),D=(-u/2).toFixed(1),R=(x/2).toFixed(1);M=`<line x1="${F}" y1="${R}" x2="${D}" y2="${R}" stroke="${O}" stroke-width="${(1.15*i).toFixed(2)}" stroke-dasharray="${(2.5*i).toFixed(1)} ${(2*i).toFixed(1)}" />`}else if(I==="left"){const F=(f-L-8*i).toFixed(1),D=(u/2).toFixed(1),R=(x/2).toFixed(1);M=`<line x1="${F}" y1="${R}" x2="${D}" y2="${R}" stroke="${O}" stroke-width="${(1.15*i).toFixed(2)}" stroke-dasharray="${(2.5*i).toFixed(1)} ${(2*i).toFixed(1)}" />`}const C=(12.8*i).toFixed(1);l+=`
      <g class="map-label" data-id="${c.id}" transform="translate(${L.toFixed(1)}, ${E.toFixed(1)})" style="cursor:pointer;">
        ${M}
        <rect
          x="${(-u/2).toFixed(1)}"
          y="0"
          width="${u.toFixed(1)}"
          height="${x.toFixed(1)}"
          rx="${(4*i).toFixed(1)}"
          fill="var(--paper-card)"
          fill-opacity="0.95"
          stroke="${O}"
          stroke-width="${v}"
        />
        <text
          x="0"
          y="${C}"
          text-anchor="middle"
          font-family="var(--font-serif)"
          font-size="${p.toFixed(1)}"
          font-weight="700"
          fill="var(--ink-primary)"
        >
          ${b}
          ${H}
        </text>
      </g>
    `}l+="</g>",e.innerHTML=l}function ni(e,t=!1){if(e.length<2)return"";const o=e.map(([a,l])=>[a*T,l*G]);if(o.length===2){const[a,l]=o[0],[s,i]=o[1],d=s-a,c=i-l,h=Math.hypot(d,c);if(t||h<14)return`M ${a.toFixed(1)} ${l.toFixed(1)} L ${s.toFixed(1)} ${i.toFixed(1)}`;const f=-c/h,w=d/h,b=Math.round(a+i)%2===0?1:-1,g=Math.min(26,h*.11)*b,$=a+d*.33+f*g,p=l+c*.33+w*g,S=a+d*.67-f*g*.65,y=l+c*.67-w*g*.65;return`M ${a.toFixed(1)} ${l.toFixed(1)} C ${$.toFixed(1)} ${p.toFixed(1)}, ${S.toFixed(1)} ${y.toFixed(1)}, ${s.toFixed(1)} ${i.toFixed(1)}`}let r=`M ${o[0][0].toFixed(1)} ${o[0][1].toFixed(1)} `;for(let a=1;a<o.length-1;a++){const l=o[a],s=o[a+1],i=(l[0]+s[0])/2,d=(l[1]+s[1])/2;r+=`Q ${l[0].toFixed(1)} ${l[1].toFixed(1)} ${i.toFixed(1)} ${d.toFixed(1)} `}const n=o[o.length-1];return r+=`L ${n[0].toFixed(1)} ${n[1].toFixed(1)}`,r}function _a(e,t){let o="";for(const r of t){if(r.kind==="portal")continue;const n=r.id.startsWith("vil-"),a=ni(r.points,n);n?o+=`
        <path d="${a}" fill="none" stroke="#6b4e35" stroke-width="1.6" stroke-dasharray="2.5 3.5" stroke-linecap="round" opacity="0.45" data-route="${r.id}" />
      `:r.kind==="road"?o+=`
        <g class="route-seg route-road" data-route="${r.id}">
          <path d="${a}" fill="none" stroke="var(--ink-primary)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.52" />
          <path d="${a}" fill="none" stroke="#e5d2ab" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />
        </g>
      `:r.kind==="path"?o+=`
        <path d="${a}" fill="none" stroke="#4f3622" stroke-width="1.6" stroke-dasharray="6 5" stroke-linecap="round" opacity="0.62" data-route="${r.id}" />
      `:r.kind==="secret"?o+=`
        <path d="${a}" fill="none" stroke="#7d2932" stroke-width="1.4" stroke-dasharray="3 6" stroke-linecap="round" opacity="0.48" data-route="${r.id}" />
      `:r.kind==="ropeway"?o+=`
        <g class="route-ropeway" data-route="${r.id}">
          <path d="${a}" fill="none" stroke="#2c3e50" stroke-width="1.8" stroke-dasharray="10 4 2 4" opacity="0.72" />
        </g>
      `:r.kind==="ferry"&&(o+=`
        <path d="${a}" fill="none" stroke="#245269" stroke-width="2.0" stroke-dasharray="4 6" stroke-linecap="round" opacity="0.75" data-route="${r.id}" />
      `)}o+='<g id="active-route-overlay"></g>',e.innerHTML=o}function Ea(e,t){const o=e.querySelector("#active-route-overlay");if(!o)return;if(!t){o.innerHTML="";return}let r="";if(t.segments.length>0)for(const n of t.segments){const a=ni(n.points,n.id.startsWith("vil-"));r+=`
        <path d="${a}" fill="none" stroke="rgba(255, 232, 166, 0.85)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${a}" fill="none" stroke="#b6342a" stroke-width="4.2" stroke-dasharray="10 6" stroke-linecap="round" stroke-linejoin="round" class="active-route-path" />
      `}else{const n=t.from.x*T,a=t.from.y*G,l=t.to.x*T,s=t.to.y*G;r+=`
      <line x1="${n}" y1="${a}" x2="${l}" y2="${s}" stroke="rgba(255, 232, 166, 0.85)" stroke-width="8" stroke-linecap="round" />
      <line x1="${n}" y1="${a}" x2="${l}" y2="${s}" stroke="#b6342a" stroke-width="3.8" stroke-dasharray="10 6" stroke-linecap="round" class="active-route-path" />
    `}t.hops.forEach((n,a)=>{const l=n.x*T,s=n.y*G,d=a===0||a===t.hops.length-1?11:7;r+=`
      <g transform="translate(${l.toFixed(1)}, ${s.toFixed(1)})">
        <circle cx="0" cy="0" r="${d+4}" fill="none" stroke="#b6342a" stroke-width="2" class="marker-pulse-ring" />
        <circle cx="0" cy="0" r="${d}" fill="#b6342a" stroke="#fff8ee" stroke-width="2" />
        <text x="0" y="3.5" text-anchor="middle" fill="#fff8ee" font-size="9.5" font-weight="700" font-family="var(--font-ui)">${a+1}</text>
      </g>
    `}),o.innerHTML=r}const Ia={farmland:"var(--biome-farmland)",forest:"var(--biome-forest)","magic-forest":"var(--biome-magic-forest)",bamboo:"var(--biome-bamboo)",sunflower:"var(--biome-sunflower)",foothills:"var(--biome-foothills)",mountain:"var(--biome-mountain)",peak:"var(--biome-peak)",wetland:"var(--biome-wetland)",higan:"var(--biome-higan)",netherworld:"var(--biome-netherworld)",heaven:"var(--biome-heaven)",lunar:"var(--biome-lunar)",underworld:"var(--biome-underworld)",makai:"var(--biome-makai)","sdm-grounds":"var(--biome-sdm)",backdoor:"var(--biome-backdoor)"};function qt(e){if(e.length<3)return"";const t=e.map(([n,a])=>[n*T,a*G]),o=t.length;let r="";for(let n=0;n<o;n++){const a=t[(n-1+o)%o],l=t[n],s=t[(n+1)%o],i=(a[0]+l[0])/2,d=(a[1]+l[1])/2,c=(l[0]+s[0])/2,h=(l[1]+s[1])/2;n===0&&(r+=`M ${i.toFixed(1)} ${d.toFixed(1)} `),r+=`Q ${l[0].toFixed(1)} ${l[1].toFixed(1)} ${c.toFixed(1)} ${h.toFixed(1)} `}return r+"Z"}function ie(e){const t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)}function Eo(e,t,o,r,n,a=18){const l=[];for(let s=0;s<a;s++){const i=s/a*Math.PI*2,d=1+.08*Math.sin(i*3+n)+.05*Math.cos(i*5-n*1.7)+.03*Math.sin(i*7+n*.5),c=e+Math.cos(i)*o*d,h=t+Math.sin(i)*r*d;l.push([c,h])}return qt(l)}function Pa(e,t){let o="";const r=.48*T,n=.46*G;o+='<g class="cartographic-graticule" opacity="0.22" pointer-events="none">';for(let y=.1;y<=.9;y+=.1){const u=(y*T).toFixed(1);o+=`<line x1="${u}" y1="28" x2="${u}" y2="${G-28}" stroke="var(--ink-secondary)" stroke-width="0.7" stroke-dasharray="4 6" />`}for(let y=.1;y<=.9;y+=.1){const u=(y*G).toFixed(1);o+=`<line x1="28" y1="${u}" x2="${T-28}" y2="${u}" stroke="var(--ink-secondary)" stroke-width="0.7" stroke-dasharray="4 6" />`}for(let y=0;y<16;y++){const u=y*Math.PI/8,x=(r+Math.cos(u)*T).toFixed(1),m=(n+Math.sin(u)*G).toFixed(1);o+=`<line x1="${r.toFixed(1)}" y1="${n.toFixed(1)}" x2="${x}" y2="${m}" stroke="var(--border-gold)" stroke-width="0.8" />`}o+="</g>";const l=qt([[.14,.22],[.35,.14],[.65,.08],[.84,.14],[.94,.34],[.94,.62],[.88,.84],[.66,.9],[.42,.82],[.26,.66],[.14,.46]]);o+=`<path d="${l}" fill="var(--biome-foothills)" fill-opacity="0.32" stroke="var(--biome-foothills)" stroke-width="45" stroke-opacity="0.18" stroke-linejoin="round" />`;for(const y of t.regions){const u=qt(y.points),x=Ia[y.biome]??"var(--biome-foothills)";o+=`<path d="${u}" fill="none" stroke="${x}" stroke-width="36" stroke-opacity="0.12" stroke-linejoin="round" stroke-linecap="round" />`,o+=`<path d="${u}" fill="none" stroke="${x}" stroke-width="18" stroke-opacity="0.18" stroke-linejoin="round" stroke-linecap="round" />`,o+=`<path d="${u}" fill="${x}" fill-opacity="0.38" stroke="${x}" stroke-width="6" stroke-opacity="0.28" stroke-linejoin="round" data-biome="${y.id}" />`}const s=[{rx:.175,ry:.112,fill:"#9e9275",op:.38,seed:1.1},{rx:.15,ry:.096,fill:"#948870",op:.45,seed:2.3},{rx:.126,ry:.08,fill:"#a39883",op:.52,seed:3.7},{rx:.104,ry:.066,fill:"#b3aa98",op:.58,seed:4.9},{rx:.082,ry:.052,fill:"#c7c0b2",op:.64,seed:6.2},{rx:.062,ry:.039,fill:"#dbd6ca",op:.7,seed:7.5},{rx:.042,ry:.026,fill:"#efece4",op:.76,seed:8.8}];o+='<g class="youkai-mountain-terraces">';for(const y of s){const u=Eo(.658,.155,y.rx,y.ry,y.seed,22);o+=`<path d="${u}" fill="${y.fill}" fill-opacity="${y.op}" stroke="var(--ink-primary)" stroke-width="1.1" stroke-opacity="0.45" />`,o+=`<path d="${u}" fill="none" stroke="var(--ink-secondary)" stroke-width="2.6" stroke-dasharray="1.2 5.5" stroke-opacity="0.32" />`}const i=[{rx:.095,ry:.064,fill:"#a89b7c",op:.36,seed:2.1},{rx:.072,ry:.048,fill:"#9a8c6f",op:.44,seed:3.4},{rx:.048,ry:.032,fill:"#b5a88b",op:.52,seed:5.1}];for(const y of i){const u=Eo(.252,.318,y.rx,y.ry,y.seed,16);o+=`<path d="${u}" fill="${y.fill}" fill-opacity="${y.op}" stroke="var(--ink-primary)" stroke-width="1.0" stroke-opacity="0.40" />`,o+=`<path d="${u}" fill="none" stroke="var(--ink-secondary)" stroke-width="2.2" stroke-dasharray="1.2 6" stroke-opacity="0.28" />`}o+="</g>";const d="https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui",c=[[.21,.29,250,188],[.32,.34,230,172],[.2,.48,240,180],[.22,.57,250,188],[.34,.56,260,195],[.42,.62,230,172],[.49,.61,250,188],[.56,.65,280,210],[.65,.63,260,195],[.52,.72,240,180],[.55,.25,250,188],[.65,.24,240,180],[.75,.24,250,188]],h=[[.73,.37,250,188],[.85,.35,260,195],[.75,.47,240,180],[.82,.43,235,176],[.91,.46,235,176]];o+='<g class="painted-cartographic-stamps" pointer-events="none">',o+=`
    <image
      href="${d}/mountain-range-stamp.webp"
      x="${(.39*T).toFixed(1)}"
      y="${(.012*G).toFixed(1)}"
      width="${(.45*T).toFixed(1)}"
      height="${(.225*G).toFixed(1)}"
      preserveAspectRatio="none"
      opacity="0.90"
    />
    <image
      href="${d}/mountain-range-stamp.webp"
      x="${(.13*T).toFixed(1)}"
      y="${(.185*G).toFixed(1)}"
      width="${(.25*T).toFixed(1)}"
      height="${(.145*G).toFixed(1)}"
      preserveAspectRatio="none"
      opacity="0.80"
    />
  `;for(const[y,u,x,m]of c)o+=`
      <image
        href="${d}/autumn-forest-canopy.webp"
        x="${(y*T-x/2).toFixed(1)}"
        y="${(u*G-m/2).toFixed(1)}"
        width="${x}"
        height="${m}"
        opacity="0.84"
      />
    `;for(const[y,u,x,m]of h)o+=`
      <image
        href="${d}/bamboo-grove-cluster.webp"
        x="${(y*T-x/2).toFixed(1)}"
        y="${(u*G-m/2).toFixed(1)}"
        width="${x}"
        height="${m}"
        opacity="0.88"
      />
    `;o+="</g>";const f=[[.49,.16,1,!1],[.57,.14,1.15,!1],[.65,.14,1.2,!0],[.74,.16,1.1,!1],[.81,.19,.95,!1],[.52,.21,.92,!1],[.64,.21,1.05,!1],[.74,.21,.98,!1],[.17,.31,.98,!1],[.29,.31,.95,!1],[.18,.37,.9,!1],[.86,.28,1.05,!1],[.91,.3,1.15,!1],[.94,.34,1.05,!1],[.92,.67,1,!1]];o+='<g class="mountain-hachures" opacity="0.48">';for(const[y,u,x,m]of f){const k=y*T,I=u*G,L=44*x,E=28*x,A=m?`<path d="M 0 ${(-E*.62).toFixed(1)} L ${(-L*.32).toFixed(1)} ${(-E*.14).toFixed(1)} L ${(-L*.12).toFixed(1)} ${(-E*.22).toFixed(1)} L 0 ${(-E*.1).toFixed(1)} L ${(L*.16).toFixed(1)} ${(-E*.2).toFixed(1)} L ${(L*.32).toFixed(1)} ${(-E*.12).toFixed(1)} Z" fill="#f7f4ec" opacity="0.82" />`:"";o+=`
      <g transform="translate(${k.toFixed(1)}, ${I.toFixed(1)})">
        <!-- Sunlit Western Slope -->
        <path d="M ${-L} ${E*.42} L ${-L*.48} ${-E*.1} L 0 ${-E*.62} L ${L*.48} ${-E*.08} L ${L} ${E*.42} Z" fill="var(--biome-mountain)" fill-opacity="0.62" />
        <!-- Shaded Eastern Face -->
        <path d="M 0 ${-E*.62} L ${L*.48} ${-E*.08} L ${L} ${E*.42} L ${L*.08} ${E*.42} L ${-L*.06} ${E*.05} Z" fill="var(--ink-primary)" fill-opacity="0.22" />
        ${A}
        <!-- Outer Ink Ridge Contour -->
        <path d="M ${-L} ${E*.42} L ${-L*.48} ${-E*.1} L 0 ${-E*.62} L ${L*.48} ${-E*.08} L ${L} ${E*.42}" fill="none" stroke="var(--ink-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Center Spine & Cliff Hachure Strokes -->
        <path d="M 0 ${-E*.62} L ${-L*.06} ${E*.05} L ${L*.08} ${E*.36} M ${L*.18} ${-E*.32} L ${L*.32} ${E*.28} M ${L*.36} ${-E*.12} L ${L*.52} ${E*.32} M ${-L*.22} ${-E*.25} L ${-L*.38} ${E*.22}" fill="none" stroke="var(--ink-secondary)" stroke-width="1.0" stroke-opacity="0.68" stroke-linecap="round" />
      </g>
    `}o+="</g>",o+='<g class="flora-details" opacity="0.58">';const w=(y,u,x,m,k=1)=>`
    <g transform="translate(${y.toFixed(1)}, ${u.toFixed(1)}) scale(${k.toFixed(2)})">
      <ellipse cx="0.5" cy="5.8" rx="9.5" ry="3.0" fill="rgba(26, 15, 8, 0.22)" />
      <!-- Gnarled East-Asian Ink Trunk & Forked Boughs -->
      <path d="M -2.5 5.8 Q -2.2 1.8 -4.4 -1.6 M 2.2 5.8 Q 1.8 1.5 4.2 -1.4 M -0.2 5.8 L 0 -3.8" fill="none" stroke="#362214" stroke-width="1.45" stroke-linecap="round" />
      <!-- Lower Shaded Foliage Cloud Crown -->
      <path d="M -8.6 -0.8 C -10.4 -3.8, -7.8 -7.4, -4.2 -6.8 C -2.2 -9.6, 2.4 -9.6, 4.4 -6.8 C 8.0 -7.2, 10.4 -3.6, 8.4 -0.6 C 9.2 1.8, 5.6 3.0, 2.4 2.2 C 0 3.2, -2.6 3.0, -4.6 2.0 C -7.6 2.8, -9.4 1.2, -8.6 -0.8 Z" fill="${m}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Upper Sunlit Scalloped Foliage Crown -->
      <path d="M -6.4 -3.2 C -7.8 -6.2, -4.8 -9.4, -1.6 -8.6 C 0.4 -11.2, 4.2 -10.2, 5.4 -7.4 C 7.8 -6.6, 7.6 -3.2, 5.2 -2.0 C 2.6 -0.8, -3.2 -0.8, -6.4 -3.2 Z" fill="${x}" stroke="var(--ink-primary)" stroke-width="0.8" stroke-linejoin="round" />
      <!-- Ink Brush Texture & Highlight -->
      <path d="M -3.5 -6.8 Q 0 -8.8 3.5 -6.5 M -5.2 -2.5 Q -2.5 -4.0 0.5 -2.8" fill="none" stroke="#fff8e7" stroke-width="0.65" opacity="0.42" stroke-linecap="round" />
    </g>
  `,b=(y,u,x,m=1)=>`
    <g transform="translate(${y.toFixed(1)}, ${u.toFixed(1)}) scale(${m.toFixed(2)})">
      <ellipse cx="0.5" cy="7.2" rx="8.0" ry="2.5" fill="rgba(26, 15, 8, 0.22)" />
      <!-- Curved Resinous Pine Trunk -->
      <path d="M -0.4 7.5 Q -1.2 1.5 0.2 -9.5 M -0.6 1.5 L -4.5 -0.8 M 0.2 -2.5 L 4.4 -4.5" fill="none" stroke="#3b2416" stroke-width="1.5" stroke-linecap="round" />
      <!-- Bottom Tier Pine Needle Pad -->
      <path d="M -8.8 3.6 Q -4.5 -0.8 0 -0.2 Q 4.5 -0.8 8.8 3.6 Q 4.2 4.6 0 4.0 Q -4.2 4.6 -8.8 3.6 Z" fill="${x}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Middle Tier Pine Needle Pad -->
      <path d="M -7.2 -1.6 Q -3.5 -5.8 0 -5.2 Q 3.5 -5.8 7.2 -1.6 Q 3.2 -0.8 0 -1.2 Q -3.2 -0.8 -7.2 -1.6 Z" fill="${x}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Crown Tier Pine Needle Pad -->
      <path d="M -5.0 -6.6 Q 0 -11.8 5.0 -6.6 Q 0 -5.8 -5.0 -6.6 Z" fill="${x}" stroke="var(--ink-primary)" stroke-width="0.85" stroke-linejoin="round" />
      <!-- Ink Needle Hachure Accents -->
      <path d="M -5.2 2.2 L -3.2 0.8 M 3.2 0.8 L 5.2 2.2 M -3.8 -3.0 L -1.8 -4.4 M 1.8 -4.4 L 3.8 -3.0" stroke="rgba(255,248,231,0.32)" stroke-width="0.65" stroke-linecap="round" />
    </g>
  `,g=[[.15,.38,.24,.44,48],[.14,.3,.44,.66,42],[.27,.45,.5,.67,52],[.52,.72,.66,.75,28]],$=[["#cc5f2b","#9e3e1c"],["#d98a2b","#b06818"],["#547846","#3c5931"],["#68874d","#496334"],["#b84327","#872b16"]];let p=1;for(const[y,u,x,m,k]of g)for(let I=0;I<k;I++){p++;const L=y+ie(p*1.3)*(u-y),E=x+ie(p*2.7)*(m-x);if(Math.hypot((L-.48)*1.3,(E-.46)*1.7)<.115||Math.hypot(L-.255,E-.32)<.032||Math.hypot(L-.382,E-.585)<.032)continue;const A=L*T,H=E*G,O=.82+ie(p*3.9)*.42;if(I%3===0)o+=b(A,H,I%6===0?"#35543c":"#466944",O);else{const[v,M]=$[I%$.length];o+=w(A,H,v,M,O)}}for(let y=0;y<72;y++){p++;const u=.445+ie(p*1.9)*.255,x=.565+ie(p*3.1)*.185;if(u>.58&&x>.7)continue;const m=u*T,k=x*G,I=.85+ie(p*4.3)*.45;if(y%5===0){const L=y%10===0?"#8b4899":"#b83b5e";o+=`
        <g transform="translate(${m.toFixed(1)}, ${k.toFixed(1)}) scale(${I.toFixed(2)})">
          <ellipse cx="0" cy="5.5" rx="6" ry="2" fill="rgba(26, 15, 8, 0.25)" />
          <path d="M -2.2 5.5 L -1.2 -0.5 L 1.2 -0.5 L 2.2 5.5 Z" fill="#efe4ce" stroke="var(--ink-primary)" stroke-width="0.7" />
          <path d="M -7 1 Q 0 -8 7 1 Z" fill="${L}" stroke="var(--ink-primary)" stroke-width="0.9" />
          <circle cx="-2.5" cy="-2.2" r="1.2" fill="#fff2a6" />
          <circle cx="2.2" cy="-1.6" r="1.0" fill="#fff2a6" />
          <circle cx="0" cy="-4.2" r="0.9" fill="#fff2a6" />
        </g>
      `}else y%2===0?o+=b(m,k,y%4===0?"#2b4a37":"#385e46",I):o+=w(m,k,"#436b4f","#2d4d38",I)}for(let y=0;y<68;y++){p++;const u=.42+ie(p*2.1)*.4,x=.15+ie(p*3.7)*.19;if(Math.hypot(u-.66,x-.14)<.065)continue;const m=u*T,k=x*G,I=.8+ie(p*5.1)*.4;if(y%3!==0)o+=b(m,k,y%2===0?"#3d5e42":"#4f7048",I);else{const[L,E]=$[y%$.length];o+=w(m,k,L,E,I*.92)}}for(let y=0;y<78;y++){p++;const u=.675+ie(p*1.7)*.265,x=.32+ie(p*2.9)*.215;if(Math.hypot(u-.855,x-.47)<.038)continue;const m=u*T,k=x*G,I=.85+ie(p*4.7)*.38;o+=`
      <g transform="translate(${m.toFixed(1)}, ${k.toFixed(1)}) scale(${I.toFixed(2)})">
        <ellipse cx="2" cy="11" rx="7" ry="2.2" fill="rgba(26, 15, 8, 0.18)" />
        <line x1="-3" y1="10" x2="-3.5" y2="-12" stroke="#234d30" stroke-width="2.0" />
        <line x1="1.5" y1="11" x2="2" y2="-14" stroke="#2e633e" stroke-width="2.1" />
        <line x1="6" y1="10" x2="7" y2="-10" stroke="#3c7a4f" stroke-width="1.8" />
        <!-- Bamboo Node Rings -->
        <path d="M -4.5 -4 L -2 -4 M 0.5 -6 L 3 -6 M 5.5 -2 L 8 -2" stroke="#a8cfa8" stroke-width="0.9" />
        <!-- Feathery Bamboo Canopy -->
        <path d="M -3.5 -10 Q -10 -14 -13 -9 M -3 -6 Q -9 -9 -11 -4 M 2 -13 Q -4 -17 -7 -12 M 2 -9 Q 8 -13 11 -8 M 7 -8 Q 13 -11 15 -6" fill="none" stroke="#285936" stroke-width="1.45" stroke-linecap="round" />
      </g>
    `}for(let y=0;y<24;y++){p++;const u=(.29+ie(p*2.3)*.19)*T,x=(.038+ie(p*3.3)*.08)*G;o+=w(u,x,"#f2a7c3","#d97a9e",.9)}for(let y=0;y<34;y++){p++;const u=(.725+ie(p*1.5)*.19)*T,x=(.54+ie(p*2.5)*.115)*G;o+=`
      <g transform="translate(${u.toFixed(1)}, ${x.toFixed(1)})">
        <line x1="0" y1="0" x2="0" y2="6.5" stroke="#3d632e" stroke-width="1.5" />
        <circle cx="0" cy="0" r="5" fill="#f0b924" stroke="#8c5a14" stroke-width="0.8" />
        <circle cx="0" cy="0" r="2.2" fill="#4f3111" />
      </g>
    `}const S=[[.05,.26,.05,.23,28],[.13,.29,.38,.48,24]];for(const[y,u,x,m,k]of S)for(let I=0;I<k;I++){p++;const L=(y+ie(p*1.8)*(u-y))*T,E=(x+ie(p*2.8)*(m-x))*G;o+=`
        <g transform="translate(${L.toFixed(1)}, ${E.toFixed(1)})">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#3c5938" stroke-width="1" />
          <circle cx="0" cy="0" r="3.4" fill="#d62828" />
          <path d="M -4.5 -2 L 4.5 2 M -4.5 2 L 4.5 -2 M 0 -4.8 L 0 4.2" stroke="#9e1414" stroke-width="0.95" />
        </g>
      `}o+="</g>",e.innerHTML=o}function Fa(e){const t=.48*T,o=.46*G;let r="";const n=[-58,-40,-22,22,40,58],a=[-98,-76,-54,-32,32,54,76,98];for(const x of n)for(const m of a){if(Math.hypot(m*.8,x*1.12)>98||m===32&&Math.abs(x)===22)continue;const k=16.5+Math.abs(x+m)%3*3,I=10.5+Math.abs(x*m)%2*2.2,L=4.2,E=3.2,A=(x+m)%3===0,H=A?"#3e444a":(x+m)%2===0?"#5c412e":"#4a3324",O=A?"#575f68":(x+m)%2===0?"#78573f":"#634632",v=A?"#c4ccd4":"#e0cba8",M=+(k/2).toFixed(1),C=+(I/2).toFixed(1);r+=`
        <g transform="translate(${(t+m).toFixed(1)}, ${(o+x).toFixed(1)})">
          <!-- 2.5D Cast Ground Shadow -->
          <polygon points="${-M+2.2},${C+L+1.8} ${M+E+2.5},${C+L+1.8} ${M+E+2.5},${-C+2.5} ${-M+2.2},${-C+2.5}" fill="rgba(22, 12, 6, 0.32)" />
          <!-- Sunlit Front Timber & White-Plaster Facade Wall -->
          <rect x="${-M+1}" y="${C-.8}" width="${k-2}" height="${L}" fill="#efe2c6" stroke="#24170f" stroke-width="0.9" />
          <!-- Traditional Wooden Koshi Lattice & Doorway on Front Wall -->
          <line x1="${-M+4}" y1="${C-.5}" x2="${-M+4}" y2="${C+L-.8}" stroke="#4a321f" stroke-width="1.2" />
          <line x1="0" y1="${C-.5}" x2="0" y2="${C+L-.8}" stroke="#3b2616" stroke-width="1.8" />
          <line x1="${M-4}" y1="${C-.5}" x2="${M-4}" y2="${C+L-.8}" stroke="#4a321f" stroke-width="1.2" />
          <!-- Shaded Eastern Side Wall (2.5D Depth Extrusion) -->
          <polygon points="${M-1},${-C+1.5} ${M+E},${-C+3.2} ${M+E},${C+L-.8} ${M-1},${C+L-.8}" fill="#c4b08b" stroke="#24170f" stroke-width="0.9" stroke-linejoin="round" />
          <!-- Pitched Irimoya Roof — North Slope (Darker) -->
          <polygon points="${-M},0 ${-M+2.8},${-C} ${M-2.2},${-C} ${M+.8},0" fill="${H}" stroke="#21140c" stroke-width="1.0" stroke-linejoin="round" />
          <!-- Pitched Irimoya Roof — South Overhanging Slope (Sunlit) -->
          <polygon points="${-M-.6},${C} ${-M},0 ${M+.8},0 ${M+1.2},${C}" fill="${O}" stroke="#21140c" stroke-width="1.0" stroke-linejoin="round" />
          <!-- Eastern Roof Gable Triangle -->
          <polygon points="${M-2.2},${-C} ${M+E+.4},${.8} ${M+1.2},${C}" fill="${H}" stroke="#21140c" stroke-width="0.95" stroke-linejoin="round" />
          <!-- Raised Ornamental Roof Ridge Beam (棟) -->
          <line x1="${-M+2.4}" y1="0" x2="${M-1.5}" y2="0" stroke="${v}" stroke-width="1.35" stroke-linecap="round" />
        </g>
      `}let l="",s=11;for(let x=-216;x<=216;x+=38)for(let m=-124;m<=124;m+=28){s++;const k=Math.hypot(x*.82,m*1.15);if(k<134||k>208||Math.abs(x-6)<35||Math.abs(m)<25)continue;const I=(ie(s*1.3)-.5)*4.5,L=(ie(s*2.1)-.5)*4.2,E=(ie(s*3.7)-.5)*4.5,A=(ie(s*5.3)-.5)*4.2,H=Math.atan2(m,x)*180/Math.PI*.12,O=(-14.5+I).toFixed(1),v=(-9.2+L).toFixed(1),M=(14.5+E).toFixed(1),C=(-8.8-I*.6).toFixed(1),F=(14.2-L).toFixed(1),D=(9.2+A).toFixed(1),R=(-14.2-E*.6).toFixed(1),z=(8.8-A*.5).toFixed(1),X=s%3===0?"rgba(138, 172, 134, 0.28)":s%2===0?"rgba(168, 184, 112, 0.26)":"rgba(214, 198, 138, 0.24)";l+=`
        <g transform="translate(${(t+x+I).toFixed(1)}, ${(o+m+L).toFixed(1)}) rotate(${H.toFixed(1)})">
          <!-- Irregular Hand-Inked Earth Bund Perimeter (Double-Stroke Sketchy Linework) -->
          <path d="M ${O} ${v} L ${M} ${C} L ${F} ${D} L ${R} ${z} Z" fill="${X}" stroke="#6e5d3c" stroke-width="1.05" stroke-opacity="0.65" stroke-linejoin="round" />
          <path d="M ${(+O+.8).toFixed(1)} ${(+v+.6).toFixed(1)} L ${(+M-.6).toFixed(1)} ${(+C+.8).toFixed(1)} L ${(+F-.8).toFixed(1)} ${(+D-.6).toFixed(1)} L ${(+R+.6).toFixed(1)} ${(+z-.5).toFixed(1)} Z" fill="none" stroke="#4f4128" stroke-width="0.55" stroke-opacity="0.42" />
          <!-- Hand-Inked Hachure Rice Shoot Rows -->
          <path d="M -10.5 -4.2 L 10.5 -3.8 M -10.2 0.2 L 10.2 0.5 M -10.0 4.4 L 10.0 4.6" stroke="#5c733e" stroke-width="0.8" stroke-dasharray="2.2 2.8" stroke-linecap="round" opacity="0.68" />
        </g>
      `}const i=.255*T,d=.32*G,c=.825*T,h=.745*G,f=.382*T,w=.585*G,b=.855*T,g=.47*G,$=.032*T,p=.682*G,S=.268*T,y=.285*G;let u="";for(let x=0;x<24;x++){const m=$+12+x*(S-24)/24,k=(S-24)/24,I=10+x*17%18;u+=`<polygon points="${m.toFixed(1)},${(p+4).toFixed(1)} ${(m+k/2).toFixed(1)},${(p+4+I).toFixed(1)} ${(m+k).toFixed(1)},${(p+4).toFixed(1)}" fill="#3b2d29" stroke="var(--border-ink)" stroke-width="0.9" opacity="0.78" />`}e.innerHTML=`
    <!-- Hand-Inked Irregular Rice Paddies Surrounding Village -->
    <g class="village-paddies">${l}</g>

    <!-- 1. HUMAN VILLAGE 1:1 WALLED PALISADE, STREET GRID & DRAGON CANAL (2.5D Isometric Centerpiece) -->
    <g class="footprint-human-village">
      <!-- Village Ground Clearing with Soft Hand-Inked Outer Earth Rim -->
      <ellipse cx="${t}" cy="${o}" rx="125" ry="85" fill="#dfd0b2" fill-opacity="0.85" stroke="#8c7353" stroke-width="2" stroke-dasharray="10 4" />

      <!-- Internal Main Street & Cross Lanes -->
      <line x1="${t-122}" y1="${o}" x2="${t+122}" y2="${o}" stroke="#bfa67a" stroke-width="11.5" />
      <line x1="${t-122}" y1="${o}" x2="${t+122}" y2="${o}" stroke="#e8d8b8" stroke-width="7.5" />
      <line x1="${t-64}" y1="${o-76}" x2="${t-64}" y2="${o+76}" stroke="#cbb48c" stroke-width="5.5" />
      <line x1="${t+64}" y1="${o-76}" x2="${t+64}" y2="${o+76}" stroke="#cbb48c" stroke-width="5.5" />
      <line x1="${t-108}" y1="${o-31}" x2="${t+108}" y2="${o-31}" stroke="#cbb48c" stroke-width="5" />
      <line x1="${t-108}" y1="${o+31}" x2="${t+108}" y2="${o+31}" stroke="#cbb48c" stroke-width="5" />

      <!-- Stone-Lined Dragon Canal (Canal of Willows) bisecting the Village North-to-South -->
      <path d="M ${t+14} ${o-83} Q ${t+10} ${o} ${t+15} ${o+83}" fill="none" stroke="#4a3f35" stroke-width="13" />
      <path d="M ${t+14} ${o-83} Q ${t+10} ${o} ${t+15} ${o+83}" fill="none" stroke="var(--water-fill)" stroke-width="8.5" />
      <path d="M ${t+14} ${o-83} Q ${t+10} ${o} ${t+15} ${o+83}" fill="none" stroke="#d8eef7" stroke-width="2" stroke-dasharray="6 8" class="river-flow-anim" />

      <!-- Three 2.5D Arched Vermilion Bridges across the Dragon Canal (Humanvillage-thumb.png) -->
      <g stroke="#2a120d" stroke-width="1.1">
        <rect x="${t+4}" y="${o-34}" width="18" height="7.5" rx="1.5" fill="rgba(20,12,6,0.28)" />
        <rect x="${t+3.5}" y="${o-35.5}" width="18" height="7" rx="1.5" fill="#c82e24" />
        <line x1="${t+4.5}" y1="${o-35}" x2="${t+20.5}" y2="${o-35}" stroke="#ff9888" stroke-width="0.9" />

        <rect x="${t+3}" y="${o-3.5}" width="19" height="9.5" rx="2" fill="rgba(20,12,6,0.30)" />
        <rect x="${t+2.5}" y="${o-5}" width="19" height="9" rx="2" fill="#d43228" />
        <line x1="${t+3.5}" y1="${o-4.2}" x2="${t+20.5}" y2="${o-4.2}" stroke="#ff9888" stroke-width="1.0" />

        <rect x="${t+5}" y="${o+29}" width="18" height="7.5" rx="1.5" fill="rgba(20,12,6,0.28)" />
        <rect x="${t+4.5}" y="${o+27.5}" width="18" height="7" rx="1.5" fill="#c82e24" />
        <line x1="${t+5.5}" y1="${o+28.2}" x2="${t+21.5}" y2="${o+28.2}" stroke="#ff9888" stroke-width="0.9" />
      </g>

      <!-- Walled Hieda Clan Estate in NW Quarter with Koi Pond & Arched Vermilion Bridge (Humanvillage-thumb.png) -->
      <g transform="translate(${t-58}, ${o-40})">
        <rect x="-26" y="-20" width="52" height="40" rx="2" fill="#e6dec8" stroke="#f5f0e6" stroke-width="2.4" />
        <rect x="-26" y="-20" width="52" height="40" rx="2" fill="none" stroke="#262930" stroke-width="1.2" />
        <!-- Strolling Koi Pond & Arched Vermilion Bridge -->
        <ellipse cx="6" cy="4" rx="14" ry="9" fill="#2e7bb5" stroke="#5a6e58" stroke-width="1.0" />
        <rect x="1" y="-2" width="10" height="4.5" rx="1" transform="rotate(-18 6 0)" fill="#c82e24" stroke="#24100c" stroke-width="0.8" />
        <!-- Two-Story Black-Roofed Hieda Main Mansion -->
        <rect x="-20" y="-16" width="26" height="12" fill="#f5f0e6" stroke="#1e2026" stroke-width="1.0" />
        <polygon points="-22,-6 -18,-17 4,-17 8,-6" fill="#262930" stroke="#14161a" stroke-width="1.1" />
        <polygon points="-17,-9 -14,-15 0,-15 3,-9" fill="#353942" stroke="#14161a" stroke-width="0.9" />
        <!-- Lush Green Garden Trees -->
        <circle cx="-12" cy="8" r="5.5" fill="#3e7432" stroke="#1e3c18" stroke-width="0.8" />
        <circle cx="18" cy="-8" r="5.0" fill="#48843a" stroke="#1e3c18" stroke-width="0.8" />
      </g>

      <!-- Market Square Central Flagstone Plaza, Dragon Statue & Fire Watchtower (Yagura) -->
      <rect x="${t-26}" y="${o-16}" width="38" height="32" rx="3" fill="#ead9b7" stroke="#6b4e35" stroke-width="1.4" />
      <path d="M ${t-22} ${o-8} L ${t+8} ${o-8} M ${t-22} ${o+8} L ${t+8} ${o+8} M ${t-7} ${o-14} L ${t-7} ${o+14}" stroke="#b89f74" stroke-width="0.7" opacity="0.65" />
      <ellipse cx="${t-6}" cy="${o+2}" rx="6.5" ry="4" fill="rgba(26,15,8,0.28)" />
      <circle cx="${t-7}" cy="${o}" r="5.8" fill="#9e9585" stroke="#3b3228" stroke-width="1.2" />
      <circle cx="${t-7}" cy="${o-1.2}" r="2.5" fill="#4a6b5d" stroke="#243830" stroke-width="0.8" />
      <!-- Village Fire Watchtower (Yagura) -->
      <g transform="translate(${t+25}, ${o-14})">
        <rect x="-4" y="-12" width="8" height="14" fill="#3b2516" stroke="#1e120a" stroke-width="1.0" />
        <polygon points="-6,-11 0,-17 6,-11" fill="#262930" stroke="#14161a" stroke-width="1.0" />
        <circle cx="0" cy="-9" r="1.8" fill="#d9a74a" />
      </g>

      <!-- Individual 2.5D Isometric Village Houses -->
      ${r}

      <!-- Outer Timber Stake Palisade Wall (2.5D Upright Log Ring & Shadow) -->
      <ellipse cx="${t+2}" cy="${o+2.5}" rx="126.5" ry="86.5" fill="none" stroke="rgba(22, 12, 6, 0.28)" stroke-width="7" />
      <ellipse cx="${t}" cy="${o}" rx="126" ry="86" fill="none" stroke="#24150c" stroke-width="6.5" />
      <ellipse cx="${t}" cy="${o}" rx="126" ry="86" fill="none" stroke="#855b3b" stroke-width="4.5" stroke-dasharray="2.5 2.0" />
      <ellipse cx="${t}" cy="${o}" rx="122.5" ry="82.5" fill="none" stroke="#3b2314" stroke-width="1.2" />

      <!-- Four 2.5D Palisade Gate Watchtowers (North, South, West, East Yagura-mon) -->
      <!-- North Gatehouse -->
      <g transform="translate(${t}, ${o-86})">
        <rect x="-13" y="-4" width="26" height="12" fill="rgba(20,12,6,0.32)" />
        <rect x="-12" y="-3" width="24" height="8" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <rect x="-4.5" y="-2" width="9" height="7" rx="2" fill="#2a180d" />
        <polygon points="-16,-2 -12,-10 12,-10 16,-2" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="-11" y1="-6" x2="11" y2="-6" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
      <!-- South Gatehouse -->
      <g transform="translate(${t}, ${o+86})">
        <rect x="-13" y="-4" width="26" height="12" fill="rgba(20,12,6,0.32)" />
        <rect x="-12" y="-3" width="24" height="8" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <rect x="-4.5" y="-2" width="9" height="7" rx="2" fill="#2a180d" />
        <polygon points="-16,-2 -12,-10 12,-10 16,-2" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="-11" y1="-6" x2="11" y2="-6" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
      <!-- West Gatehouse -->
      <g transform="translate(${t-126}, ${o})">
        <rect x="-6" y="-12" width="15" height="25" fill="rgba(20,12,6,0.32)" />
        <rect x="-6" y="-11" width="12" height="22" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <polygon points="-8,-13 0,-15 8,-13 8,13 0,15 -8,13" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
      <!-- East Gatehouse -->
      <g transform="translate(${t+126}, ${o})">
        <rect x="-6" y="-12" width="15" height="25" fill="rgba(20,12,6,0.32)" />
        <rect x="-6" y="-11" width="12" height="22" fill="#dfd0b2" stroke="#24150c" stroke-width="1.2" />
        <polygon points="-8,-13 0,-15 8,-13 8,13 0,15 -8,13" fill="#4a3525" stroke="#1f1108" stroke-width="1.3" stroke-linejoin="round" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#d8c3a0" stroke-width="1.2" />
      </g>
    </g>

    <!-- 2. HAKUREI SHRINE 2.5D HILLTOP COMPOUND & LONG STONE STAIRCASE -->
    <g class="footprint-hakurei-shrine" transform="translate(${i}, ${d})">
      <!-- Hand-Inked Swept Shrine Courtyard & Stone Retaining Wall -->
      <path d="M -52 -2 C -50 -24, -26 -36, 2 -35 C 30 -36, 52 -22, 53 0 C 51 22, 28 33, 0 33 C -28 33, -51 20, -52 -2 Z" fill="#d9cbb0" fill-opacity="0.88" stroke="#594535" stroke-width="2.2" />
      <ellipse cx="0" cy="-2" rx="45" ry="27" fill="#e8dcc2" fill-opacity="0.85" stroke="#8c735b" stroke-width="1" stroke-dasharray="6 4" />
      <!-- Long Stone Staircase descending South-Southeast toward the Village road -->
      <path d="M -8 24 L -16 98 L 12 98 L 8 24 Z" fill="#bfb5a4" stroke="#453a30" stroke-width="1.6" />
      <path d="M -9 34 L 9 34 M -10 44 L 10 44 M -11 54 L 11 54 M -12 64 L 12 64 M -13 74 L 12 74 M -14 84 L 12 84 M -15 93 L 12 93" stroke="#5e5246" stroke-width="1.3" />
      <!-- Stone Lanterns (Tōrō) flanking the stairs -->
      <circle cx="-13" cy="28" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="13" cy="28" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="-19" cy="96" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <circle cx="16" cy="96" r="3.5" fill="#8c8275" stroke="#2e2822" stroke-width="1" />
      <!-- 2.5D Honden Main Hall & Living Quarters Footprints -->
      <rect x="-25" y="-18" width="38" height="22" rx="2" fill="rgba(22,12,6,0.30)" />
      <rect x="-24" y="-6" width="34" height="6" fill="#efe2c6" stroke="#26120e" stroke-width="1.1" />
      <polygon points="-28,-5 -22,-22 10,-22 14,-5" fill="#7a2820" stroke="#26120e" stroke-width="1.4" stroke-linejoin="round" />
      <line x1="-19" y1="-13.5" x2="7" y2="-13.5" stroke="#d9a74a" stroke-width="1.3" />
      <rect x="14" y="-12" width="22" height="14" rx="1.5" fill="#6b4c35" stroke="#26120e" stroke-width="1.3" />
    </g>

    <!-- 3. SCARLET DEVIL MANSION 2.5D GOTHIC ESTATE, VOILE ROTUNDA, CLOCK TOWER & ROSE GARDENS -->
    <g class="footprint-sdm" transform="translate(${c}, ${h})">
      <!-- Wrought-Iron Wall & Estate Plinth -->
      <rect x="-54" y="-58" width="108" height="116" rx="4" fill="rgba(128, 36, 44, 0.18)" stroke="#3d1217" stroke-width="2.2" />
      <rect x="-50" y="-54" width="100" height="108" rx="3" fill="none" stroke="#9e2a33" stroke-width="1.1" stroke-dasharray="6 3" />
      <!-- South Forecourt Parterre Rose Beds & Central Marble Fountain -->
      <rect x="-38" y="8" width="24" height="16" rx="2" fill="rgba(46, 82, 52, 0.45)" stroke="#294a2e" stroke-width="1.4" />
      <rect x="14" y="8" width="24" height="16" rx="2" fill="rgba(46, 82, 52, 0.45)" stroke="#294a2e" stroke-width="1.4" />
      <rect x="-38" y="30" width="24" height="16" rx="2" fill="rgba(46, 82, 52, 0.45)" stroke="#294a2e" stroke-width="1.4" />
      <rect x="14" y="30" width="24" height="16" rx="2" fill="rgba(46, 82, 52, 0.45)" stroke="#294a2e" stroke-width="1.4" />
      <circle cx="0" cy="26" r="7.5" fill="#e8dfd1" stroke="#5c4e44" stroke-width="1.4" />
      <circle cx="0" cy="26" r="5" fill="#b6342a" />
      <!-- West Wing: Voile Magic Library Rotunda -->
      <circle cx="-36" cy="-16" r="14" fill="#6e1820" stroke="#21080a" stroke-width="1.6" />
      <circle cx="-36" cy="-16" r="9.5" fill="#2b2838" stroke="#4e8072" stroke-width="1.2" />
      <!-- Main Gothic Hall, East Wing & Central Square Midnight Clock Tower -->
      <rect x="-26" y="-32" width="52" height="30" rx="2" fill="#7d1e26" stroke="#21080a" stroke-width="1.8" />
      <rect x="20" y="-30" width="20" height="26" rx="2" fill="#6e1820" stroke="#21080a" stroke-width="1.5" />
      <circle cx="30" cy="-2" r="8.5" fill="#e5b548" fill-opacity="0.78" stroke="#5c3d1e" stroke-width="1.2" />
      <rect x="-10" y="-28" width="20" height="20" rx="2" fill="#2b2838" stroke="#f0d080" stroke-width="1.8" />
      <circle cx="0" cy="-18" r="4.5" fill="#fff6d6" stroke="#d9a74a" stroke-width="1.2" />
    </g>

    <!-- 4. MYOUREN TEMPLE 2.5D MONASTERY, PAGODA & ORGANIC STONE COURTYARD -->
    <g class="footprint-myouren" transform="translate(${f}, ${w})">
      <ellipse cx="-4" cy="0" rx="64" ry="42" fill="rgba(186, 174, 146, 0.28)" />
      <path d="M -46 -26 L -18 -31 L 24 -30 L 44 -22 L 47 18 L 36 29 L -8 32 L -44 26 L -50 2 Z" fill="rgba(222, 210, 184, 0.62)" stroke="#4a3e33" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M -42 -22 L 22 -26 L 41 -18 L 42 15 L 32 25 L -40 22 Z" fill="none" stroke="#7a6855" stroke-width="0.9" stroke-dasharray="5 4" />
      <path d="M -6 10 L -6 34 L 6 34 L 6 10 Z" fill="#c7bba4" stroke="#54473b" stroke-width="1.0" />
      <rect x="-12" y="26" width="24" height="7" rx="1.5" fill="#5c3d28" stroke="#24160d" stroke-width="1.2" />
      <rect x="-27" y="-17" width="46" height="27" rx="2" fill="rgba(20, 14, 10, 0.34)" />
      <rect x="-26" y="1" width="42" height="6.5" fill="#efe4ce" stroke="#1e2226" stroke-width="1.1" />
      <polygon points="-30,2 -24,-21 16,-21 20,2" fill="#464d54" stroke="#1e2226" stroke-width="1.5" stroke-linejoin="round" />
      <polygon points="-25,-3 -20,-17 12,-17 15,-3" fill="#576069" stroke="#1e2226" stroke-width="0.9" stroke-linejoin="round" />
      <line x1="-16" y1="-10" x2="8" y2="-10" stroke="#d9a74a" stroke-width="1.4" stroke-linecap="round" />
      <rect x="23" y="-15" width="16" height="17" rx="1.5" fill="rgba(20, 14, 10, 0.34)" />
      <rect x="23" y="-5" width="14" height="5" fill="#dfd0b4" stroke="#24170f" stroke-width="1.0" />
      <polygon points="20,-4 24,-17 36,-17 40,-4" fill="#5e4332" stroke="#1e2226" stroke-width="1.3" stroke-linejoin="round" />
      <polygon points="22,-8 25,-19 35,-19 38,-8" fill="#464d54" stroke="#1e2226" stroke-width="1.1" stroke-linejoin="round" />
      <circle cx="30" cy="-13" r="2.2" fill="#d9a74a" stroke="#1e2226" stroke-width="0.8" />
      <g transform="translate(-66, -6)" fill="#968f84" stroke="#36312b" stroke-width="1">
        <ellipse cx="-2" cy="0" rx="20" ry="18" fill="rgba(140, 134, 122, 0.22)" stroke="none" />
        <rect x="-14" y="-12" width="5" height="9.5" rx="1.5" />
        <rect x="-4" y="-14" width="5" height="11.5" rx="1.5" />
        <rect x="6" y="-11" width="5" height="9" rx="1.5" />
        <rect x="-12" y="3" width="5" height="9.5" rx="1.5" />
        <rect x="-1" y="2" width="5" height="10.5" rx="1.5" />
        <rect x="8" y="4" width="5" height="8.5" rx="1.5" />
      </g>
    </g>

    <!-- 5. EIENTEI 2.5D WALLED BAMBOO PALACE, LOTUS POND & REAR PAGODA (eintei ref.png) -->
    <g class="footprint-eientei" transform="translate(${b}, ${g})">
      <!-- Walled Rectangular Tsukiji-bei Compound -->
      <rect x="-52" y="-38" width="104" height="76" rx="3" fill="#e6dcc6" fill-opacity="0.86" stroke="#f5f0e6" stroke-width="3.2" />
      <rect x="-52" y="-38" width="104" height="76" rx="3" fill="none" stroke="#2c323b" stroke-width="1.6" />
      <!-- Covered Perimeter Kairō Verandas -->
      <rect x="-46" y="-32" width="92" height="64" rx="2" fill="none" stroke="#5c3824" stroke-width="3.5" />
      <!-- Central Rectangular Stone-Rimmed Lotus Pond & Twin Footbridges (eintei ref.png) -->
      <rect x="-26" y="4" width="52" height="18" rx="2" fill="#2e729e" stroke="#7a7468" stroke-width="1.3" />
      <rect x="-15" y="2" width="6" height="22" rx="1" fill="#9c6a3e" stroke="#2a180d" stroke-width="0.9" />
      <rect x="9" y="2" width="6" height="22" rx="1" fill="#9c6a3e" stroke="#2a180d" stroke-width="0.9" />
      <!-- Grand Multi-Bay Shinden Main Hall with Karahafu Entrance Gable -->
      <rect x="-32" y="-20" width="64" height="22" rx="2" fill="rgba(20, 12, 6, 0.32)" />
      <rect x="-30" y="-4" width="60" height="5.5" fill="#f5f0e6" stroke="#24170e" stroke-width="1.0" />
      <polygon points="-35,-2 -28,-22 28,-22 35,-2" fill="#2b3038" stroke="#16191e" stroke-width="1.5" stroke-linejoin="round" />
      <polygon points="-10,-1 0,-11 10,-1" fill="#3a404a" stroke="#d9b44a" stroke-width="1.1" />
      <line x1="-22" y1="-12" x2="22" y2="-12" stroke="#d9b44a" stroke-width="1.4" stroke-linecap="round" />
      <!-- Rear 3-Story Eientei Pagoda Tower (eintei ref.png top-right) -->
      <g transform="translate(26, -28)">
        <polygon points="-11,4 -8,-6 8,-6 11,4" fill="#2b3038" stroke="#16191e" stroke-width="1.1" />
        <polygon points="-9,-3 -6,-12 6,-12 9,-3" fill="#353b45" stroke="#16191e" stroke-width="1.0" />
        <polygon points="-7,-9 0,-18 7,-9" fill="#2b3038" stroke="#16191e" stroke-width="1.0" />
        <line x1="0" y1="-18" x2="0" y2="-24" stroke="#d9b44a" stroke-width="1.4" />
      </g>
      <!-- South Chumon Gatehouse -->
      <rect x="-12" y="33" width="24" height="8" rx="1.5" fill="#2b3038" stroke="#16191e" stroke-width="1.2" />
    </g>

    <!-- 5B. MORIYA SHRINE, WIND GOD'S LAKE, TWIN DOCKS & FOUR ONBASHIRA (mountain shrine top shot.png) -->
    <g class="footprint-moriya" transform="translate(${.645*T}, ${.105*G})">
      <!-- Heart-Shaped Wind God's Lake behind Compound with Sacred Weeping-Tree Island -->
      <path d="M -8 -22 C -14 -44, 16 -54, 34 -38 C 54 -50, 74 -30, 58 -10 C 46 6, 12 4, -8 -22 Z" fill="#2874ad" stroke="#5e6858" stroke-width="2.0" />
      <ellipse cx="28" cy="-26" rx="9" ry="6.5" fill="#689452" stroke="#2d4a22" stroke-width="1.0" />
      <circle cx="28" cy="-28" r="6" fill="#48823c" stroke="#1e3c18" stroke-width="0.9" />
      <!-- Twin Lakeside Wooden Boat Docks -->
      <rect x="4" y="-22" width="12" height="4.5" transform="rotate(-24 4 -22)" fill="#9c6a3e" stroke="#2a180d" stroke-width="0.9" />
      <rect x="36" y="-14" width="12" height="4.5" transform="rotate(20 36 -14)" fill="#9c6a3e" stroke="#2a180d" stroke-width="0.9" />
      <!-- Stepped Stone Courtyard & Retaining Terrace -->
      <rect x="-42" y="-24" width="76" height="54" rx="4" fill="#dfd6c3" stroke="#5c5346" stroke-width="2.0" />
      <rect x="-38" y="-20" width="68" height="46" rx="3" fill="#ebe3d2" stroke="#8c8070" stroke-width="1.0" stroke-dasharray="5 3" />
      <!-- South Stone Approach Stairs & Grand Vermilion Torii -->
      <path d="M -10 28 L -14 54 L 6 54 L 2 28 Z" fill="#c4bba8" stroke="#4f463d" stroke-width="1.4" />
      <line x1="-14" y1="42" x2="6" y2="42" stroke="#c82824" stroke-width="3.2" stroke-linecap="round" />
      <!-- Twin Outer Chigi Gate Pavilions (detailed shrine sides.png) -->
      <polygon points="-34,24 -28,14 -16,14 -12,24" fill="#2e7866" stroke="#163830" stroke-width="1.1" />
      <polygon points="4,24 8,14 20,14 26,24" fill="#2e7866" stroke="#163830" stroke-width="1.1" />
      <!-- Elevated Honden Sanctuary & Red Bridge Corridor behind Haiden -->
      <polygon points="-20,-10 -15,-23 7,-23 12,-10" fill="#246354" stroke="#123028" stroke-width="1.3" />
      <rect x="-7" y="-11" width="6" height="8" fill="#c82824" />
      <!-- Wide Patinated Green-Copper Roofed Haiden Worship Hall -->
      <rect x="-26" y="4" width="44" height="6" fill="#f5eee0" stroke="#2e241b" stroke-width="1.0" />
      <polygon points="-30,5 -22,-9 14,-9 22,5" fill="#2e7866" stroke="#14362c" stroke-width="1.5" stroke-linejoin="round" />
      <polygon points="-11,5 -4,-3 3,5" fill="#3b8c78" stroke="#d9b44a" stroke-width="1.0" />
      <!-- Four Sacred Towering Rope-Bound Onbashira Cedar Pillars -->
      <circle cx="-34" cy="-16" r="4.8" fill="#6b4226" stroke="#f5f2eb" stroke-width="1.4" />
      <circle cx="26" cy="-16" r="4.8" fill="#6b4226" stroke="#f5f2eb" stroke-width="1.4" />
      <circle cx="-34" cy="20" r="4.8" fill="#6b4226" stroke="#f5f2eb" stroke-width="1.4" />
      <circle cx="26" cy="20" r="4.8" fill="#6b4226" stroke="#f5f2eb" stroke-width="1.4" />
    </g>

    <!-- 5C. TENGU VILLAGE & WATERFALL OF NINE HEAVENS CLIFFSIDE COMPOUND (yokai mountain.png) -->
    <g class="footprint-tengu-village" transform="translate(${.698*T}, ${.145*G})">
      <ellipse cx="0" cy="2" rx="36" ry="24" fill="rgba(138, 128, 114, 0.52)" stroke="#4a4238" stroke-width="1.6" />
      <!-- Cascading Waterfall Stream & Vermilion Suspension Bridge -->
      <path d="M -18 -20 Q -12 0 -16 22" fill="none" stroke="#68b8e8" stroke-width="7" opacity="0.75" />
      <path d="M -18 -20 Q -12 0 -16 22" fill="none" stroke="#e8f8ff" stroke-width="2.5" stroke-dasharray="4 4" />
      <rect x="-24" y="-2" width="18" height="5" rx="1" fill="#c82824" stroke="#24100c" stroke-width="0.9" />
      <!-- Red-Pillared Multi-Tier Tengu Watchtower & Terraced Townhouses -->
      <rect x="2" y="-6" width="18" height="14" fill="#b82824" stroke="#24100c" stroke-width="1.0" />
      <polygon points="-1,-5 4,-16 18,-16 23,-5" fill="#2c3038" stroke="#14161a" stroke-width="1.2" />
      <polygon points="2,-12 6,-21 16,-21 20,-12" fill="#383e48" stroke="#14161a" stroke-width="1.1" />
      <circle cx="-24" cy="-12" r="6" fill="#c83824" stroke="#4a160c" stroke-width="0.8" />
      <circle cx="24" cy="10" r="5.5" fill="#d97824" stroke="#4a240c" stroke-width="0.8" />
    </g>

    <!-- 5D. MUENZUKA WEEPING CHERRY GROVE & OUTSIDE WORLD GATEHOUSE (magenzuka ref.png) -->
    <g class="footprint-muenzuka" transform="translate(${.165*T}, ${.415*G})">
      <ellipse cx="0" cy="0" rx="42" ry="28" fill="rgba(216, 198, 212, 0.52)" stroke="#6e5468" stroke-width="1.5" stroke-dasharray="6 3" />
      <!-- Weathered Wooden Outside World Pavilion on Left -->
      <rect x="-28" y="-8" width="18" height="12" fill="#8c6244" stroke="#2b1c12" stroke-width="1.1" />
      <polygon points="-31,-7 -25,-16 -13,-16 -7,-7" fill="#3a2c24" stroke="#1e1510" stroke-width="1.2" />
      <!-- Semicircle of Purple-Pink Weeping Cherry (Shidarezakura) Trees -->
      <circle cx="0" cy="-16" r="10" fill="#d878b4" stroke="#6e2854" stroke-width="1.0" />
      <circle cx="18" cy="-10" r="11" fill="#e48cc4" stroke="#6e2854" stroke-width="1.0" />
      <circle cx="22" cy="6" r="9.5" fill="#d878b4" stroke="#6e2854" stroke-width="1.0" />
      <!-- Stone Gravestones & Red Spider Lily Clusters -->
      <rect x="-6" y="-2" width="4" height="7" rx="1" fill="#968f84" stroke="#36312b" stroke-width="0.8" />
      <rect x="4" y="1" width="4" height="7" rx="1" fill="#968f84" stroke="#36312b" stroke-width="0.8" />
      <circle cx="-12" cy="12" r="3.2" fill="#d62828" />
      <circle cx="8" cy="14" r="3.2" fill="#d62828" />
    </g>

    <!-- 5E. HAKUGYOKUROU GRAND STAIRCASE & SAIGYOU AYAKASHI -->
    <g class="footprint-hakugyokurou" transform="translate(${.38*T}, ${.065*G})">
      <rect x="-36" y="-24" width="72" height="44" rx="4" fill="rgba(238, 230, 224, 0.68)" stroke="#6e5a66" stroke-width="1.6" />
      <path d="M -8 20 L -10 46 L 10 46 L 8 20 Z" fill="#e6e0d6" stroke="#6e5a66" stroke-width="1.3" />
      <polygon points="-26,4 -20,-14 4,-14 10,4" fill="#3e4252" stroke="#1e2029" stroke-width="1.4" />
      <circle cx="20" cy="-4" r="12" fill="rgba(200, 104, 180, 0.65)" stroke="#7a326b" stroke-width="1.4" />
    </g>

    <!-- 5F. PALACE OF THE EARTH SPIRITS (CHIREIDEN) -->
    <g class="footprint-chireiden" transform="translate(${.125*T}, ${.775*G})">
      <rect x="-30" y="-24" width="60" height="48" rx="3" fill="rgba(54, 34, 42, 0.55)" stroke="#24141a" stroke-width="1.8" />
      <circle cx="0" cy="12" r="7" fill="#ff5518" fill-opacity="0.7" stroke="#24141a" stroke-width="1.2" />
      <polygon points="-22,2 -16,-16 16,-16 22,2" fill="#5e3442" stroke="#1f1d29" stroke-width="1.5" />
      <circle cx="0" cy="-6" r="4.2" fill="#ff487e" stroke="#f0d080" stroke-width="1" />
    </g>

    <!-- 6. ARMIXI-STYLE KEY-FRET (雷文) REALM CARTOUCHES (Underworld, Makai, The Moon) -->
    <g class="realm-cartouche-frames" opacity="0.92">
      <!-- 6A. UNDERWORLD & FORMER HELL SUBTERRANEAN CAVERN CARTOUCHE -->
      <rect x="${$}" y="${p}" width="${S}" height="${y}" rx="6" fill="rgba(34, 24, 22, 0.24)" stroke="var(--border-ink)" stroke-width="7" />
      <rect x="${$}" y="${p}" width="${S}" height="${y}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3.2" stroke-dasharray="8 4 2 4" />
      <rect x="${$+4}" y="${p+4}" width="${S-8}" height="${y-8}" rx="4" fill="none" stroke="var(--border-ink)" stroke-width="1.2" />
      <!-- Hanging Cavern Stalactites along the top ceiling -->
      ${u}
      <!-- Subterranean Lava Cracks & Hellfire Glow in Blazing Hell -->
      <path d="M ${.06*T} ${.91*G} Q ${.11*T} ${.89*G} ${.16*T} ${.92*G} T ${.24*T} ${.9*G}" fill="none" stroke="#ff542e" stroke-width="2.5" stroke-dasharray="6 4" opacity="0.75" />
      <rect x="${$+12}" y="${p+14}" width="398" height="24" rx="4" fill="var(--paper-card)" fill-opacity="0.96" stroke="var(--border-ink)" stroke-width="1.5" />
      <text x="${$+211}" y="${p+30}" text-anchor="middle" font-family="var(--font-display)" font-size="12.5" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.4">UNDERWORLD &amp; FORMER HELL (地底・旧地獄)</text>

      <!-- 6B. MAKAI DEMON REALM CARTOUCHE -->
      <rect x="${.032*T}" y="${.482*G}" width="${.138*T}" height="${.178*G}" rx="6" fill="rgba(72, 48, 92, 0.18)" stroke="var(--border-ink)" stroke-width="6.5" />
      <rect x="${.032*T}" y="${.482*G}" width="${.138*T}" height="${.178*G}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3" stroke-dasharray="8 4 2 4" />
      <rect x="${.038*T}" y="${.49*G}" width="168" height="22" rx="4" fill="var(--paper-card)" fill-opacity="0.96" stroke="var(--border-ink)" stroke-width="1.4" />
      <text x="${.038*T+84}" y="${.49*G+15}" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.3">MAKAI (魔界)</text>

      <!-- 6C. THE MOON & DREAM WORLD CELESTIAL CARTOUCHE (Armixi Lunar Sphere Homage) -->
      <rect x="${.822*T}" y="${.026*G}" width="${.152*T}" height="${.252*G}" rx="6" fill="rgba(186, 198, 218, 0.22)" stroke="var(--border-ink)" stroke-width="6.5" />
      <rect x="${.822*T}" y="${.026*G}" width="${.152*T}" height="${.252*G}" rx="6" fill="none" stroke="var(--border-gold)" stroke-width="3" stroke-dasharray="8 4 2 4" />
      <!-- Lunar Sphere Ring around the Lunar Capital -->
      <circle cx="${.902*T}" cy="${.112*G}" r="58" fill="rgba(242, 238, 225, 0.55)" stroke="var(--border-ink)" stroke-width="2.2" />
      <circle cx="${.902*T}" cy="${.112*G}" r="52" fill="none" stroke="var(--border-gold)" stroke-width="1.2" stroke-dasharray="5 3" />
      <rect x="${.828*T}" y="${.034*G}" width="268" height="22" rx="4" fill="var(--paper-card)" fill-opacity="0.96" stroke="var(--border-ink)" stroke-width="1.4" />
      <text x="${.828*T+134}" y="${.034*G+15}" text-anchor="middle" font-family="var(--font-display)" font-size="12" font-weight="700" fill="var(--ink-primary)" letter-spacing="1.3">THE MOON &amp; DREAM (月の都)</text>
    </g>
  `}function Aa(e){if(e.length<3)return"";const t=e.map(([n,a])=>[n*T,a*G]),o=t.length;let r="";for(let n=0;n<o;n++){const a=t[(n-1+o)%o],l=t[n],s=t[(n+1)%o],i=(a[0]+l[0])/2,d=(a[1]+l[1])/2,c=(l[0]+s[0])/2,h=(l[1]+s[1])/2;n===0&&(r+=`M ${i.toFixed(1)} ${d.toFixed(1)} `),r+=`Q ${l[0].toFixed(1)} ${l[1].toFixed(1)} ${c.toFixed(1)} ${h.toFixed(1)} `}return r+"Z"}function Ra(e){if(e.length<2)return"";const t=e.map(([n,a])=>[n*T,a*G]);let o=`M ${t[0][0].toFixed(1)} ${t[0][1].toFixed(1)} `;for(let n=1;n<t.length-1;n++){const a=t[n],l=t[n+1],s=(a[0]+l[0])/2,i=(a[1]+l[1])/2;o+=`Q ${a[0].toFixed(1)} ${a[1].toFixed(1)} ${s.toFixed(1)} ${i.toFixed(1)} `}const r=t[t.length-1];return o+=`L ${r[0].toFixed(1)} ${r[1].toFixed(1)}`,o}function Ta(e,t){let o="";for(const c of t.rivers){const h=Ra(c.points),f=c.id.includes("sanzu"),w=f?"#2b1e26":"#4a3d2e",b=f?"#6b5b66":"#c9b894",g=f?"#3c5d75":"var(--water-fill)",$=f?"#263f52":"var(--water-deep)";o+=`
      <g class="river-group" data-river="${c.id}">
        <path d="${h}" fill="none" stroke="${w}" stroke-width="${c.width+6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.62" />
        <path d="${h}" fill="none" stroke="${b}" stroke-width="${c.width+3.2}" stroke-linecap="round" stroke-linejoin="round" opacity="0.78" />
        <path d="${h}" fill="none" stroke="${g}" stroke-width="${c.width}" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${h}" fill="none" stroke="${$}" stroke-width="${(c.width*.52).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.65" />
        <path d="${h}" fill="none" stroke="#e2f3fa" stroke-width="${Math.max(1.3,c.width*.25).toFixed(1)}" stroke-dasharray="10 14" stroke-linecap="round" opacity="0.75" class="river-flow-anim" />
      </g>
    `}const r=.655*T,n=.145*G;o+=`
    <g class="waterfall-nine-heavens" transform="translate(${r.toFixed(1)}, ${n.toFixed(1)})">
      <!-- Cliff Escarpment Rocks flanking the Waterfall -->
      <polygon points="-22,-14 -8,-18 -4,16 -24,12" fill="#6b6154" stroke="var(--ink-primary)" stroke-width="1.3" />
      <polygon points="8,-18 22,-14 24,12 4,16" fill="#595045" stroke="var(--ink-primary)" stroke-width="1.3" />
      <!-- Cascading Whitewater Chute -->
      <path d="M -7 -16 L 7 -16 L 11 18 L -11 18 Z" fill="#8dc4db" stroke="#345b70" stroke-width="1.1" />
      <path d="M -5 -15 L -7 16 M 0 -16 L 0 17 M 5 -15 L 7 16" stroke="#f2fbff" stroke-width="2.0" stroke-dasharray="5 3" class="river-flow-anim" />
      <!-- Plunge Pool Foam at Base -->
      <ellipse cx="0" cy="19" rx="15" ry="5.5" fill="#e6f7fc" stroke="#78a3b8" stroke-width="1.2" opacity="0.9" />
    </g>
  `;for(const c of t.lakes){const h=Aa(c.points),f=c.kind==="blood",w=f?"#3b0c10":"#4a3d2e",b=f?"#6e1d24":"#d2c29d",g=f?"#8f242c":"var(--water-fill)",$=f?"#4d1015":"var(--water-stroke)",p=f?"#e07b82":"#d2ebf7",S=c.points.reduce((u,x)=>u+x[0],0)/c.points.length*T,y=c.points.reduce((u,x)=>u+x[1],0)/c.points.length*G;o+=`
      <g class="lake-group" data-lake="${c.id}">
        <path d="${h}" fill="none" stroke="${w}" stroke-width="6.5" stroke-linejoin="round" opacity="0.55" />
        <path d="${h}" fill="none" stroke="${b}" stroke-width="3.8" stroke-linejoin="round" opacity="0.82" />
        <path d="${h}" fill="${g}" fill-opacity="0.92" stroke="${$}" stroke-width="2.0" />
        <g transform="translate(${S.toFixed(1)}, ${y.toFixed(1)}) scale(0.92) translate(${(-S).toFixed(1)}, ${(-y).toFixed(1)})">
          <path d="${h}" fill="var(--water-deep)" fill-opacity="0.32" stroke="${p}" stroke-width="1.3" stroke-dasharray="10 6" opacity="0.72" />
        </g>
        <g transform="translate(${S.toFixed(1)}, ${y.toFixed(1)}) scale(0.80) translate(${(-S).toFixed(1)}, ${(-y).toFixed(1)})">
          <path d="${h}" fill="var(--water-deep)" fill-opacity="0.28" stroke="${p}" stroke-width="1.0" stroke-dasharray="6 8" opacity="0.52" />
        </g>
      </g>
    `}const a=.655*T,l=.878*G;o+=`
    <g class="misty-lake-shore-rocks" transform="translate(${a.toFixed(1)}, ${l.toFixed(1)})">
      <polygon points="-28,6 -18,-8 -6,4" fill="#7a7062" stroke="var(--ink-primary)" stroke-width="1.2" />
      <polygon points="-10,8 0,-12 12,6" fill="#8c8273" stroke="var(--ink-primary)" stroke-width="1.2" />
      <polygon points="8,7 18,-6 28,5" fill="#6b6255" stroke="var(--ink-primary)" stroke-width="1.2" />
      <circle cx="-18" cy="-12" r="2.2" fill="#a8e6ff" stroke="#24526b" stroke-width="0.8" />
    </g>
  `;const s=[[.64,.77],[.7,.76],[.74,.78],[.66,.82],[.72,.83],[.688,.112],[.298,.125],[.305,.168],[.275,.218]];o+='<g class="water-waves" stroke="#e4f4fc" stroke-width="1.3" fill="none" opacity="0.75">';for(const[c,h]of s){const f=c*T,w=h*G;o+=`<path d="M ${f-14} ${w} Q ${f-7} ${w-4.5} ${f} ${w} T ${f+14} ${w}" />`,o+=`<path d="M ${f-9} ${w+6} Q ${f-2} ${w+2} ${f+5} ${w+6} T ${f+17} ${w+6}" />`}o+="</g>";const i=.304*T,d=.145*G;o+=`
    <g class="sanzu-ferryboat" transform="translate(${i.toFixed(1)}, ${d.toFixed(1)}) rotate(-18)">
      <path d="M -11 0 Q 0 5 11 0 L 8 4 L -8 4 Z" fill="#5c3a24" stroke="#1f1108" stroke-width="1.1" />
      <line x1="-2" y1="0" x2="4" y2="-8" stroke="#2a180d" stroke-width="1.2" />
      <circle cx="-2" cy="-5" r="2.2" fill="#b6342a" />
    </g>
  `,e.innerHTML=o}class Na{constructor(t,o){q(this,"viewportEl");q(this,"svgEl");q(this,"cameraGroup");q(this,"atlas3d",null);q(this,"terrainData");q(this,"terrainGroup");q(this,"waterGroup");q(this,"footprintsGroup");q(this,"roadsGroup");q(this,"borderGroup");q(this,"atmoGroup");q(this,"markersGroup");q(this,"labelsGroup");q(this,"residentsGroup");q(this,"tooltipEl");q(this,"zoomBehavior");this.terrainData=o;const r=document.createElement("div");r.className="atlas-viewport",this.viewportEl=r,this.svgEl=document.createElementNS("http://www.w3.org/2000/svg","svg"),this.svgEl.setAttribute("class","atlas-svg"),this.svgEl.setAttribute("viewBox",`0 0 ${T} ${G}`),this.svgEl.setAttribute("preserveAspectRatio","xMidYMid slice"),this.svgEl.innerHTML=`
      <defs>
        <!-- Parchment Base Radial Gradient -->
        <radialGradient id="parchment-grad" cx="50%" cy="48%" r="65%">
          <stop offset="0%" stop-color="var(--paper-bg)" />
          <stop offset="75%" stop-color="var(--paper-bg)" />
          <stop offset="100%" stop-color="var(--paper-edge)" />
        </radialGradient>

        <!-- Lantern Radial Gradient (Night Mode) -->
        <radialGradient id="lantern-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffcf5c" stop-opacity="0.72" />
          <stop offset="55%" stop-color="#ff8c3b" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#ff8c3b" stop-opacity="0" />
        </radialGradient>

        <!-- Mist Radial Gradient -->
        <radialGradient id="mist-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f7f4ec" stop-opacity="0.48" />
          <stop offset="65%" stop-color="#e8e2d5" stop-opacity="0.20" />
          <stop offset="100%" stop-color="#e8e2d5" stop-opacity="0" />
        </radialGradient>

        <!-- Great Hakurei Barrier Gradient -->
        <linearGradient id="barrier-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b6342a" />
          <stop offset="50%" stop-color="#8b4899" />
          <stop offset="100%" stop-color="#c8963e" />
        </linearGradient>
      </defs>

      <g id="camera">
        <rect id="layer-paper" x="-400" y="-300" width="${T+800}" height="${G+600}" fill="url(#parchment-grad)" />
        <image
          class="parchment-tex-img"
          href="https://cdn.jsdelivr.net/gh/Remilya/gensokyo-assets@main/ui/parchment-texture.webp"
          x="-400"
          y="-300"
          width="${T+800}"
          height="${G+600}"
          preserveAspectRatio="none"
          opacity="0.88"
          pointer-events="none"
        />
        <g id="layer-terrain"></g>
        <g id="layer-water"></g>
        <g id="layer-footprints"></g>
        <g id="layer-roads"></g>
        <g id="layer-border"></g>
        <g id="layer-atmosphere"></g>
        <g id="layer-markers"></g>
        <g id="layer-labels"></g>
        <g id="layer-residents"></g>
      </g>
    `;const n=document.createElement("div");n.className="atlas-vignette",this.tooltipEl=document.createElement("div"),this.tooltipEl.className="map-tooltip",r.appendChild(this.svgEl),r.appendChild(n),r.appendChild(this.tooltipEl),t.appendChild(r),this.cameraGroup=this.svgEl.querySelector("#camera"),this.terrainGroup=this.svgEl.querySelector("#layer-terrain"),this.waterGroup=this.svgEl.querySelector("#layer-water"),this.footprintsGroup=this.svgEl.querySelector("#layer-footprints"),this.roadsGroup=this.svgEl.querySelector("#layer-roads"),this.borderGroup=this.svgEl.querySelector("#layer-border"),this.atmoGroup=this.svgEl.querySelector("#layer-atmosphere"),this.markersGroup=this.svgEl.querySelector("#layer-markers"),this.labelsGroup=this.svgEl.querySelector("#layer-labels"),this.residentsGroup=this.svgEl.querySelector("#layer-residents"),this.svgEl.style.setProperty("--marker-inv-scale","1"),this.svgEl.classList.add("hide-tier-3"),Pa(this.terrainGroup,o),Ta(this.waterGroup,o),Fa(this.footprintsGroup),_a(this.roadsGroup,_.getRoutes()),Sa(this.borderGroup),$a(this.atmoGroup);let a=0,l=null,s=0;const i=k=>k<1.15?0:k<1.55?1:k<2.05?2:k<2.65?3:4;this.zoomBehavior=ia().clickDistance(6).scaleExtent([.65,9]).translateExtent([[-300,-250],[T+300,G+250]]).on("start",()=>{window.clearTimeout(s)}).on("zoom",k=>{const I=k.transform;this.svgEl.classList.add("is-interacting"),this.tooltipEl.classList.remove("visible"),this.cameraGroup.setAttribute("transform",`translate(${I.x.toFixed(1)},${I.y.toFixed(1)}) scale(${I.k.toFixed(4)})`),l=I,a||(a=window.requestAnimationFrame(()=>{if(a=0,!l)return;const L=l,E=Math.max(.42,Math.min(1.15,1/Math.pow(L.k,.55)));this.svgEl.style.setProperty("--marker-inv-scale",E.toFixed(3));const A=!!_.getState().searchQuery.trim();this.svgEl.classList.toggle("hide-tier-3",L.k<1.5&&!A),_.update({zoom:{x:L.x,y:L.y,k:L.k}})}))}).on("end",()=>{s=window.setTimeout(()=>{this.svgEl.classList.remove("is-interacting")},120)}),fe(this.svgEl).call(this.zoomBehavior);let d=null;this.cameraGroup.addEventListener("mousemove",k=>{if(this.svgEl.classList.contains("is-interacting"))return;const I=k.target.closest(".map-resident, .map-marker, .map-label");if(!I){d!==null&&(d=null,this.tooltipEl.classList.remove("visible"));return}if(I.classList.contains("map-resident")){const H=I.getAttribute("data-char-id");if(!H)return;const O=`char:${H}`;if(O!==d){d=O;const C=_.getCharacter(H),F=wt(H),D=F?Qe(F):"";this.tooltipEl.innerHTML=`
            <div style="display:flex;align-items:center;gap:8px;">
              ${D?`<img src="${D}" style="width:28px;height:32px;image-rendering:pixelated;flex-shrink:0;" alt="" />`:""}
              <div>
                <div>
                  <span class="tooltip-title">${C?.name_en??F?.shortName??H}</span>
                  <span class="tooltip-jp">${C?.name_jp??""}</span>
                </div>
                <div class="tooltip-desc" style="color:var(--accent-hakurei);font-weight:600;">
                  ${C?.title?`“${C.title}”`:C?.species??""}
                </div>
                <div class="tooltip-desc" style="font-size:11px;opacity:0.85;">
                  📍 ${F?.spotLabel??""} • Click for profile card
                </div>
              </div>
            </div>
          `,this.tooltipEl.classList.add("visible")}const v=Math.min(window.innerWidth-300,k.clientX+14),M=Math.min(window.innerHeight-110,k.clientY+14);this.tooltipEl.style.transform=`translate3d(${v}px, ${M}px, 0)`;return}const L=I.getAttribute("data-id");if(!L)return;if(L!==d){d=L;const H=_.getLocation(L);if(!H)return;this.tooltipEl.innerHTML=`
          <div>
            <span class="tooltip-title">${H.name_en}</span>
            <span class="tooltip-jp">${H.name_jp}</span>
          </div>
          <div class="tooltip-desc">${H.short_desc}</div>
        `,this.tooltipEl.classList.add("visible")}const E=Math.min(window.innerWidth-285,k.clientX+14),A=Math.min(window.innerHeight-100,k.clientY+14);this.tooltipEl.style.transform=`translate3d(${E}px, ${A}px, 0)`}),this.svgEl.addEventListener("mouseleave",()=>{d=null,this.tooltipEl.classList.remove("visible")});let c=0,h=0,f=null,w=0;const b=k=>{const I=performance.now();if(!(I-w<80)){if(w=I,k){if(k.classList.contains("map-resident")){const A=k.getAttribute("data-char-id");A&&_.update({popupCharacterId:A});return}const L=k.getAttribute("data-id");if(!L)return;const E=_.getState();E.routeMode&&(!E.routeStartId||E.routeStartId&&E.routeEndId?_.setRouteEndpoints(L,null):E.routeStartId!==L&&_.setRouteEndpoints(E.routeStartId,L)),_.update({selectedId:L,selectedCharacterId:null,popupCharacterId:null}),window.history.replaceState(null,"",`#loc=${L}`);return}(_.getState().selectedId||_.getState().selectedCharacterId||_.getState().popupCharacterId)&&(_.update({selectedId:null,selectedCharacterId:null,popupCharacterId:null}),window.history.replaceState(null,"",window.location.pathname+window.location.search))}};this.svgEl.addEventListener("pointerdown",k=>{k.button===0&&(c=k.clientX,h=k.clientY,f=k.target.closest(".map-resident, .map-marker, .map-label"))},{capture:!0}),this.svgEl.addEventListener("pointerup",k=>{if(k.button!==0||Math.hypot(k.clientX-c,k.clientY-h)>8)return;const L=k.target.closest(".map-resident, .map-marker, .map-label")??f;b(L)},{capture:!0}),this.svgEl.addEventListener("click",k=>{if(k.defaultPrevented)return;const I=k.target.closest(".map-resident, .map-marker, .map-label");b(I)});let g=i(1),$=null,p=null,S="",y="All",u="All",x=_.getState().computedRoute,m=!1;_.subscribe(k=>{k.view3d!==m&&(m=k.view3d,this.svgEl.style.display=k.view3d?"none":"block",this.ensure3D()?.setActive(k.view3d)),this.footprintsGroup.style.display=k.showFootprints?"block":"none",this.roadsGroup.style.display=k.showRoutes?"block":"none",this.residentsGroup.style.display=k.showResidents?"block":"none",k.computedRoute!==x&&(x=k.computedRoute,Ea(this.roadsGroup,k.computedRoute));const I=k.popupCharacterId??k.selectedCharacterId,L=I!==p||k.searchQuery!==S||k.regionFilter!==y,E=k.selectedId!==$||k.searchQuery!==S||k.regionFilter!==y||k.kindFilter!==u,A=i(k.zoom.k),H=A!==g;if(L&&(p=I,vo(this.residentsGroup,I,k.searchQuery,k.regionFilter)),E){$=k.selectedId,S=k.searchQuery,y=k.regionFilter,u=k.kindFilter;const O=!!k.searchQuery.trim();this.svgEl.classList.toggle("hide-tier-3",k.zoom.k<1.5&&!O),So(this.markersGroup,_.getLocations(),k.selectedId,k.zoom.k,k.searchQuery,k.regionFilter,k.kindFilter)}(E||H)&&(g=A,_o(this.labelsGroup,_.getLocations(),k.selectedId,k.zoom.k,k.regionFilter,k.kindFilter))}),So(this.markersGroup,_.getLocations(),null,1,"","All","All"),_o(this.labelsGroup,_.getLocations(),null,1,"All","All"),vo(this.residentsGroup,null,"","All")}ensure3D(){return this.atlas3d||(this.atlas3d=new va(this.viewportEl,this.terrainData)),this.atlas3d}zoomByFactor(t){if(_.getState().view3d){this.ensure3D().zoomByFactor(t);return}fe(this.svgEl).call(this.zoomBehavior.scaleBy,t)}resetView(){if(_.getState().view3d){this.ensure3D().resetView();return}fe(this.svgEl).call(this.zoomBehavior.transform,mt)}flyToNormalized(t,o,r=2.6){if(_.getState().view3d){this.ensure3D().flyToNormalized(t,o,r);return}const n=this.svgEl.getBoundingClientRect(),a=T/Math.max(1,n.width),l=G/Math.max(1,n.height),s=Math.max(a,l),i=T/2,d=G/2,c=t*T,h=o*G,f=i-c*r*(1/Math.max(.5,s*0+1)),w=d-h*r,b=mt.translate(f,w).scale(r);fe(this.svgEl).call(this.zoomBehavior.transform,b)}flyToLocation(t,o=2.6){const r=_.getLocation(t);r&&this.flyToNormalized(r.x,r.y,o)}}function Da(e,t){const o=document.createElement("div");o.className="route-planner-banner",o.style.display="none",e.appendChild(o);const r=document.createElement("div");r.className="hud-bottom-left";const n=[["shrine","Shrine (神社)"],["temple","Temple (寺院)"],["village","Village (里)"],["residence","Estate / Shop"],["landmark","Landmark"],["forest","Forest / Woods"],["mountain","Mountain Peak"],["water","Lake / River"],["otherworld","Otherworld"]];r.innerHTML=`
    <div class="legend-card">
      <div class="legend-title">ATLAS LEGEND &amp; FILTER</div>
      <div class="legend-grid">
        ${n.map(([S,y])=>`
          <div class="legend-item" data-kind="${S}">
            <span class="legend-swatch" style="background:${vt[S]};"></span>
            <span>${y}</span>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="scale-bar-card">
      <div class="scale-bar-graphic" style="width: 140px;">
        <div class="scale-seg-dark"></div>
        <div class="scale-seg-light"></div>
        <div class="scale-seg-dark"></div>
        <div class="scale-seg-light"></div>
      </div>
      <div class="scale-bar-labels" id="scale-bar-labels">
        <span>0</span>
        <span id="scale-mid-label">500 m</span>
        <span id="scale-end-label">1.0 km (~14 min walk)</span>
      </div>
    </div>
  `,e.appendChild(r),r.querySelectorAll(".legend-item").forEach(S=>{S.addEventListener("click",()=>{const y=S.getAttribute("data-kind"),x=_.getState().kindFilter===y?"All":y;_.update({kindFilter:x});const m=document.querySelector("#filter-kind");m&&(m.value=x)})});const a=document.createElement("div");a.className="hud-bottom-right",a.id="hud-bottom-right",a.innerHTML=`
    <div class="control-toolbar">
      <button class="ctrl-btn" id="btn-toggle-3d" title="Toggle Interactive Three.js 3D Map &amp; Landmark Models">🧊 3D Map</button>
      <button class="ctrl-btn active" id="btn-toggle-residents" title="Toggle Pixel-Art &amp; 3D Character Residents">👾 Residents</button>
      <button class="ctrl-btn" id="btn-zoom-in" title="Zoom In (+)">＋</button>
      <button class="ctrl-btn" id="btn-zoom-out" title="Zoom Out (-)">－</button>
      <button class="ctrl-btn" id="btn-zoom-reset" title="Reset View">⟲</button>
      <button class="ctrl-btn" id="btn-toggle-route" title="Toggle Overland Travel &amp; Route Calculator">🧭 Route Planner</button>
      <button class="ctrl-btn active" id="btn-toggle-footprints" title="Toggle 1:1 Architectural Building Footprints">🏘️ 1:1 Scale</button>
      <button class="ctrl-btn" id="btn-cycle-time" title="Switch Day / Autumn Dusk / Night Mode">☀️ Day</button>
    </div>
  `,e.appendChild(a);const l=a.querySelector("#btn-toggle-3d");l.addEventListener("click",()=>{const S=!_.getState().view3d;_.update({view3d:S})});const s=a.querySelector("#btn-toggle-residents");s.addEventListener("click",()=>{const S=!_.getState().showResidents;_.update({showResidents:S}),s.classList.toggle("active",S)}),a.querySelector("#btn-zoom-in")?.addEventListener("click",()=>t.zoomByFactor(1.4)),a.querySelector("#btn-zoom-out")?.addEventListener("click",()=>t.zoomByFactor(1/1.4)),a.querySelector("#btn-zoom-reset")?.addEventListener("click",()=>t.resetView());const i=a.querySelector("#btn-toggle-route");i.addEventListener("click",()=>{const S=_.getState(),y=!S.routeMode;_.update({routeMode:y}),y&&!S.routeStartId&&!S.routeEndId?_.setRouteEndpoints("human-village","scarlet-devil-mansion"):y||_.setRouteEndpoints(null,null)});const d=a.querySelector("#btn-toggle-footprints");d.addEventListener("click",()=>{const S=!_.getState().showFootprints;_.update({showFootprints:S}),d.classList.toggle("active",S)});const c=a.querySelector("#btn-cycle-time"),h=["day","dusk","night"],f={day:"☀️ Day",dusk:"🍁 Dusk",night:"🌙 Night"};c.addEventListener("click",()=>{const S=_.getState().timeOfDay,y=h[(h.indexOf(S)+1)%h.length];_.update({timeOfDay:y}),document.documentElement.setAttribute("data-theme",y),c.textContent=f[y]});function w(){const S=_.getState();if(i.classList.toggle("active",S.routeMode),!S.routeMode){o.style.display="none";return}o.style.display="flex";const y=_.getLocations(),u=y.map(I=>`<option value="${I.id}" ${I.id===S.routeStartId?"selected":""}>${I.name_en} (${I.region})</option>`).join(""),x=y.map(I=>`<option value="${I.id}" ${I.id===S.routeEndId?"selected":""}>${I.name_en} (${I.region})</option>`).join(""),m=S.computedRoute,k=m?`
        <div class="route-summary-box">
          <div class="route-stats-line">
            <span>🚶 Walk: <strong>${m.totalMinutes} min</strong> (${m.totalKm} km)</span>
            <span>🧹 Flight: <strong>~${m.flightMinutes} min</strong> (${m.crowKm} km crow-flies)</span>
            <span>📍 Waypoints: <strong>${m.hops.length}</strong></span>
          </div>
          <div class="route-hops-line">
            <strong>Route Path:</strong> ${m.hops.map(I=>I.name_en).join(" → ")}
          </div>
          <div style="display:flex;gap:8px;margin-top:4px;">
            <button class="hud-chip-btn" id="btn-copy-route">📋 Copy Route Summary</button>
            <button class="hud-chip-btn" id="btn-swap-route">⇄ Reverse Route</button>
          </div>
        </div>
      `:'<div style="font-size:12px;color:var(--ink-secondary);">Click any two pins on the map or choose from the dropdowns above to calculate walking time and waypoints.</div>';o.innerHTML=`
      <div class="route-planner-header">
        <span class="route-planner-title">🧭 GENSOKYO 1:1 OVERLAND ROUTE &amp; TRAVEL CALCULATOR</span>
        <button class="hud-chip-btn" id="btn-close-route">✕ Close</button>
      </div>
      <div class="route-selectors">
        <select class="route-select" id="route-start-select">
          <option value="">— Select Departure —</option>
          ${u}
        </select>
        <span style="font-weight:700;color:var(--accent-hakurei);">→</span>
        <select class="route-select" id="route-end-select">
          <option value="">— Select Destination —</option>
          ${x}
        </select>
      </div>
      ${k}
    `,o.querySelector("#btn-close-route")?.addEventListener("click",()=>{_.update({routeMode:!1}),_.setRouteEndpoints(null,null)}),o.querySelector("#route-start-select")?.addEventListener("change",I=>{const L=I.target.value||null;_.setRouteEndpoints(L,_.getState().routeEndId)}),o.querySelector("#route-end-select")?.addEventListener("change",I=>{const L=I.target.value||null;_.setRouteEndpoints(_.getState().routeStartId,L)}),o.querySelector("#btn-swap-route")?.addEventListener("click",()=>{const I=_.getState();_.setRouteEndpoints(I.routeEndId,I.routeStartId)}),o.querySelector("#btn-copy-route")?.addEventListener("click",I=>{if(!m)return;const L=I.currentTarget,E=m.hops.map(H=>H.name_en).join(" → "),A=`${m.from.name_en} → ${m.to.name_en} (~${m.totalMinutes} min walk, ${m.totalKm} km) via ${E}`;navigator.clipboard?.writeText(A),L.textContent="✓ Copied Route Summary!",setTimeout(()=>{L.textContent="📋 Copy Route Summary"},1800)})}let b=!1,g=null,$=null,p=1;_.subscribe(S=>{if(l.classList.toggle("active",S.view3d),l.textContent=S.view3d?"📜 2D Map":"🧊 3D Map",(S.routeMode!==b||S.routeStartId!==g||S.routeEndId!==$)&&(b=S.routeMode,g=S.routeStartId,$=S.routeEndId,w()),Math.abs(S.zoom.k-p)>.05){p=S.zoom.k;const y=1.4/S.zoom.k,u=document.getElementById("scale-mid-label"),x=document.getElementById("scale-end-label");if(u&&x)if(y>=1)u.textContent=`${(y/2).toFixed(1)} km`,x.textContent=`${y.toFixed(1)} km (~${Math.round(y*14)}m walk)`;else{const m=Math.round(y*1e3);u.textContent=`${Math.round(m/2)} m`,x.textContent=`${m} m (~${Math.max(1,Math.round(y*14))}m walk)`}}})}function Ga(e,t){const o=document.getElementById("hud-bottom-right");if(!o)return;const r=document.createElement("div");r.className="minimap-card";const n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("viewBox",`0 0 ${T} ${G}`),n.setAttribute("width","100%"),n.setAttribute("height","100%");const a=e.lakes.map(c=>`<polygon points="${c.points.map(([f,w])=>`${(f*T).toFixed(0)},${(w*G).toFixed(0)}`).join(" ")}" fill="var(--water-fill)" opacity="0.85" />`).join(""),l=_.getLocations().filter(c=>c.importance<=2).map(c=>`<circle cx="${(c.x*T).toFixed(0)}" cy="${(c.y*G).toFixed(0)}" r="${c.importance===1?30:18}" fill="${vt[c.kind]}" stroke="#fff" stroke-width="6" />`).join("");n.innerHTML=`
    <rect x="0" y="0" width="${T}" height="${G}" fill="var(--paper-bg)" />
    ${a}
    ${l}
    <rect id="minimap-view-rect" x="0" y="0" width="${T}" height="${G}" fill="rgba(182, 52, 42, 0.12)" stroke="#b6342a" stroke-width="24" />
  `,r.appendChild(n),o.insertBefore(r,o.firstChild);const s=n.querySelector("#minimap-view-rect");_.subscribe(c=>{const h=c.zoom.k,f=Math.max(0,-c.zoom.x/h),w=Math.max(0,-c.zoom.y/h),b=Math.min(T,T/h),g=Math.min(G,G/h);s.setAttribute("x",f.toFixed(0)),s.setAttribute("y",w.toFixed(0)),s.setAttribute("width",b.toFixed(0)),s.setAttribute("height",g.toFixed(0))});function i(c){const h=r.getBoundingClientRect(),f=Math.max(.04,Math.min(.96,(c.clientX-h.left)/h.width)),w=Math.max(.04,Math.min(.96,(c.clientY-h.top)/h.height)),b=Math.max(1.8,_.getState().zoom.k);t.flyToNormalized(f,w,b)}let d=!1;r.addEventListener("mousedown",c=>{d=!0,i(c)}),window.addEventListener("mousemove",c=>{d&&i(c)}),window.addEventListener("mouseup",()=>{d=!1})}function Ha(e,t){const o=document.createElement("div");o.className="resident-rpg-card",o.style.display="none",e.appendChild(o);let r=null;function n(a){if(!a){o.style.display="none",o.classList.remove("is-open");return}const l=_.getCharacter(a),s=wt(a);if(!l&&!s){o.style.display="none";return}const i=s?.accentColor??"#d83848",d=s?.outfitPrimary??"#282434",c=s?Qe(s):"",h=s?.locationId??l?.home_location_ids?.[0]??null,f=_.getLocation(h),w=s?Ue.filter($=>$.id!==s.id&&($.locationId===s.locationId||Math.hypot($.x-s.x,$.y-s.y)<.085)).slice(0,6):[],b=w.length>0?`
          <div class="rpg-card-nearby">
            <span class="rpg-nearby-label">Nearby:</span>
            <div class="rpg-nearby-list">
              ${w.map($=>`
                  <button
                    class="rpg-nearby-btn"
                    data-near-id="${$.id}"
                    title="${$.shortName} — ${$.spotLabel}"
                  >
                    <img src="${Qe($)}" alt="${$.shortName}" />
                    <span>${$.shortName}</span>
                  </button>
                `).join("")}
            </div>
          </div>
        `:"";o.style.setProperty("--rpg-accent",i),o.style.setProperty("--rpg-primary",d),o.style.display="block",requestAnimationFrame(()=>o.classList.add("is-open")),o.innerHTML=`
      <div class="rpg-card-header">
        <div class="rpg-avatar-stage">
          <div class="rpg-pixel-frame" title="Chibi Pixel Sprite">
            ${c?`<img class="rpg-pixel-sprite" src="${c}" alt="${l?.name_en??s?.shortName}" />`:""}
          </div>
          ${l?.sprite_url?`
                <div class="rpg-dairi-thumb" id="rpg-dairi-open" title="Click to open full Chronicle">
                  <img src="${l.sprite_url}" alt="${l.name_en}" loading="eager" />
                </div>
              `:""}
        </div>

        <div class="rpg-title-col">
          <div class="rpg-badges-row">
            <span class="rpg-species-badge">${l?.species??"Resident"}</span>
            ${s?`<span class="rpg-spot-badge">📍 ${s.spotLabel}</span>`:""}
          </div>
          <h3 class="rpg-char-name">${l?.name_en??s?.shortName}</h3>
          <div class="rpg-char-jp">
            <span>${l?.name_jp??""}</span>
            ${l?.title?`<span class="rpg-char-epithet">• “${l.title}”</span>`:""}
          </div>
        </div>

        <button class="rpg-card-close" id="rpg-btn-close" title="Close (Esc)">✕</button>
      </div>

      ${s?.quote?`
            <div class="rpg-dialogue-box">
              <span class="rpg-dialogue-speaker">${s.shortName}:</span>
              <p class="rpg-dialogue-text">${s.quote}</p>
            </div>
          `:""}

      <div class="rpg-stats-grid">
        ${l?.abilities?`
              <div class="rpg-stat-item">
                <span class="rpg-stat-label">✨ Ability</span>
                <span class="rpg-stat-val">${l.abilities}</span>
              </div>
            `:""}
        ${l?.theme_music?`
              <div class="rpg-stat-item">
                <span class="rpg-stat-label">🎵 Theme</span>
                <span class="rpg-stat-val">${l.theme_music}</span>
              </div>
            `:""}
      </div>

      ${b}

      <div class="rpg-card-actions">
        <button class="rpg-action-primary" id="rpg-btn-full-dossier">
          📖 Open Full Chronicle ▸
        </button>
        ${f?`
              <button class="rpg-action-secondary" id="rpg-btn-inspect-loc">
                ⛩️ ${f.name_en}
              </button>
            `:""}
      </div>
    `,o.querySelector("#rpg-btn-close")?.addEventListener("click",()=>{_.update({popupCharacterId:null})});const g=()=>{l&&(_.update({selectedId:h,selectedCharacterId:l.id,popupCharacterId:null}),window.history.replaceState(null,"",`#char=${l.id}`))};o.querySelector("#rpg-btn-full-dossier")?.addEventListener("click",g),o.querySelector("#rpg-dairi-open")?.addEventListener("click",g),o.querySelector("#rpg-btn-inspect-loc")?.addEventListener("click",()=>{h&&(_.update({selectedId:h,selectedCharacterId:null,popupCharacterId:null}),window.history.replaceState(null,"",`#loc=${h}`))}),o.querySelectorAll(".rpg-nearby-btn").forEach($=>{$.addEventListener("click",()=>{const p=$.getAttribute("data-near-id");if(!p)return;const S=wt(p);_.update({popupCharacterId:p}),_.getState().view3d&&t.atlas3d?t.atlas3d.flyToCharacter3D(p):S&&t.flyToNormalized(S.x,S.y,Math.max(_.getState().zoom.k,2.5))})})}_.subscribe(a=>{a.popupCharacterId!==r&&(r=a.popupCharacterId,n(a.popupCharacterId))})}const za=["All","Heartland","Hakurei","Forest of Magic","Misty Lake","Bamboo Forest","Youkai Mountain","Netherworld","Underworld","Otherworld"],qa=["All","shrine","temple","residence","village","landmark","water","mountain","forest","otherworld"],Io=[{label:"🗺️ Full Atlas",x:.5,y:.5,k:1,reset:!0},{label:"🏘️ Human Village 1:1",x:.48,y:.465,k:3.4},{label:"⛩️ Hakurei Ridge",x:.25,y:.34,k:2.6},{label:"🍄 Forest of Magic",x:.565,y:.655,k:2.6},{label:"🦇 Misty Lake & SDM",x:.745,y:.765,k:2.5},{label:"🎍 Bamboo & Eientei",x:.815,y:.485,k:2.4},{label:"⛰️ Youkai Mountain",x:.655,y:.175,k:2.3},{label:"🌸 Sanzu & Netherworld",x:.295,y:.115,k:2.3},{label:"🔥 Old Hell & Chireiden",x:.165,y:.825,k:2.5},{label:"🌙 Makai & Lunar",x:.9,y:.125,k:2.6}];function Ba(e,t){const o=document.createElement("div");o.className="hud-top-left",o.innerHTML=`
    <div class="search-box-wrap">
      <span class="search-icon">🔍</span>
      <input
        id="atlas-search-input"
        class="search-input"
        type="text"
        placeholder="Search 100 locations, kanji, or residents (Reimu, SDM, 紅魔館)..."
        autocomplete="off"
      />
      <kbd class="search-kbd">/</kbd>
    </div>
    <div class="filter-row">
      <select id="filter-region" class="hud-select" title="Filter by Region">
        ${za.map(c=>`<option value="${c}">${c==="All"?"All Regions (9)":c}</option>`).join("")}
      </select>
      <select id="filter-kind" class="hud-select" title="Filter by Category">
        ${qa.map(c=>`<option value="${c}">${c==="All"?"All Types":c.toUpperCase()}</option>`).join("")}
      </select>
      <button id="btn-clear-filters" class="hud-chip-btn" style="display:none;">✕ Reset</button>
    </div>
    <div id="search-results-box" class="search-results-dropdown" style="display:none;"></div>
  `,e.appendChild(o);const r=o.querySelector("#atlas-search-input"),n=o.querySelector("#filter-region"),a=o.querySelector("#filter-kind"),l=o.querySelector("#btn-clear-filters"),s=o.querySelector("#search-results-box");function i(){const c=_.getState(),h=c.searchQuery.trim().toLowerCase(),f=!!h||c.regionFilter!=="All"||c.kindFilter!=="All";if(l.style.display=f?"inline-block":"none",!h){s.style.display="none";return}const w=_.getCharacters().filter(p=>p.name_en.toLowerCase().includes(h)||p.name_jp.toLowerCase().includes(h)||p.title.toLowerCase().includes(h)||p.species.toLowerCase().includes(h)).slice(0,5),b=_.getLocations().filter(p=>c.regionFilter!=="All"&&p.region!==c.regionFilter||c.kindFilter!=="All"&&p.kind!==c.kindFilter?!1:p.name_en.toLowerCase().includes(h)||p.name_jp.toLowerCase().includes(h)||p.residents.some(S=>S.toLowerCase().includes(h))||p.short_desc.toLowerCase().includes(h)).slice(0,9);if(w.length===0&&b.length===0){s.style.display="block",s.innerHTML='<div style="padding:10px 12px;font-size:12.5px;color:var(--ink-muted);">No matching characters or locations found in Gensokyo.</div>';return}s.style.display="block";const g=w.map(p=>`
        <div class="search-result-item" data-char-id="${p.id}">
          <div>
            <span class="search-result-title">👤 ${p.name_en}</span>
            <span class="search-result-jp">${p.name_jp}</span>
            <div class="search-result-meta">${p.title||p.species} • ${p.species}</div>
          </div>
          <span class="badge canon">Character</span>
        </div>
      `).join(""),$=b.map(p=>`
        <div class="search-result-item" data-id="${p.id}">
          <div>
            <span class="search-result-title">📍 ${p.name_en}</span>
            <span class="search-result-jp">${p.name_jp}</span>
            <div class="search-result-meta">${p.region} • ${p.residents.slice(0,3).join(", ")||p.kind}</div>
          </div>
          <span class="badge">${p.kind}</span>
        </div>
      `).join("");s.innerHTML=g+$,s.querySelectorAll(".search-result-item").forEach(p=>{p.addEventListener("click",()=>{const S=p.getAttribute("data-char-id");if(S){const x=_.getCharacter(S)?.home_location_ids?.[0]??null;_.update({selectedId:x,selectedCharacterId:S,searchQuery:""}),r.value="",s.style.display="none",x&&t.flyToLocation(x,2.6),window.history.replaceState(null,"",`#char=${S}`);return}const y=p.getAttribute("data-id");y&&(_.update({selectedId:y,selectedCharacterId:null,searchQuery:""}),r.value="",s.style.display="none",t.flyToLocation(y,2.8),window.history.replaceState(null,"",`#loc=${y}`))})})}r.addEventListener("input",()=>{_.update({searchQuery:r.value}),i()}),n.addEventListener("change",()=>{_.update({regionFilter:n.value}),i()}),a.addEventListener("change",()=>{_.update({kindFilter:a.value}),i()}),l.addEventListener("click",()=>{r.value="",n.value="All",a.value="All",_.update({searchQuery:"",regionFilter:"All",kindFilter:"All"}),i()});const d=document.createElement("div");d.className="hud-top-center",d.innerHTML=Io.map((c,h)=>`<button class="realm-pill ${h===0?"active":""}" data-idx="${h}">${c.label}</button>`).join(""),e.appendChild(d),d.querySelectorAll(".realm-pill").forEach(c=>{c.addEventListener("click",()=>{d.querySelectorAll(".realm-pill").forEach(w=>w.classList.remove("active")),c.classList.add("active");const h=Number(c.getAttribute("data-idx")??0),f=Io[h];f&&(f.reset?t.resetView():t.flyToNormalized(f.x,f.y,f.k))})}),window.addEventListener("keydown",c=>{if(c.key==="/"&&document.activeElement!==r)c.preventDefault(),r.focus(),r.select();else if(c.key==="Escape")if(s.style.display!=="none")s.style.display="none";else if(_.getState().popupCharacterId)_.update({popupCharacterId:null});else if(_.getState().selectedCharacterId){const h=_.getState().selectedId;_.update({selectedCharacterId:null}),window.history.replaceState(null,"",h?`#loc=${h}`:window.location.pathname)}else _.getState().selectedId?(_.update({selectedId:null}),window.history.replaceState(null,"",window.location.pathname)):_.getState().routeMode&&_.update({routeMode:!1,routeStartId:null,routeEndId:null,computedRoute:null})})}function Et(e,t,o){return!e||e.length===0?`<div style="font-size:12px;color:var(--ink-muted);font-style:italic;">${o}</div>`:`
    <div class="char-rel-list">
      ${e.map(r=>{const n=_.getCharacter(r.id)??_.getCharacter(r.name),a=n?void 0:_.getLocation(r.id),l=n?`data-char-id="${n.id}" class="char-rel-card ${t} is-clickable"`:a?`data-loc-id="${a.id}" class="char-rel-card ${t} is-clickable"`:`class="char-rel-card ${t}"`,s=n?`<span class="char-rel-Sub">${n.name_jp||n.species} ▸</span>`:a?'<span class="char-rel-Sub">📍 Location ▸</span>':"";return`
            <div ${l}>
              <div class="char-rel-header">
                <span class="char-rel-name">${r.name}</span>
                ${s}
              </div>
              <div class="char-rel-summary">${r.summary}</div>
            </div>
          `}).join("")}
    </div>
  `}function Oa(e,t){const o=document.createElement("aside");o.className="side-panel",e.appendChild(o);let r=null,n=null;function a(s,i){const d=(s.home_location_ids??[]).map(b=>_.getLocation(b)).filter(b=>!!b),c=d.length>0?d.map(b=>`<span class="chip conn-chip" data-target="${b.id}">⛩️ ${b.name_en} <small style="opacity:0.75;">(${b.name_jp})</small></span>`).join(""):'<span style="font-size:12px;color:var(--ink-muted);">Wandering across Gensokyo</span>',h=s.key_facts&&s.key_facts.length>0?`
          <ul class="char-facts-list">
            ${s.key_facts.map(b=>`<li>${b}</li>`).join("")}
          </ul>
        `:"",f=s.sprite_url?`
        <div class="char-portrait-stage" id="char-portrait-stage" title="Click to toggle full standing portrait">
          <div class="char-portrait-glow"></div>
          <img
            class="char-portrait-img"
            src="${s.sprite_url}"
            alt="${s.name_en} standing sprite"
            loading="eager"
            decoding="async"
          />
          <div class="char-portrait-caption">
            <span>🎨 Illustration: Dairi</span>
            <span class="char-portrait-zoom-hint">⤢ Click to expand</span>
          </div>
        </div>
      `:"";o.innerHTML=`
      <div class="side-panel-header char-dossier-header">
        <div class="char-nav-bar">
          ${i?`<button class="hud-chip-btn" id="btn-back-loc">← Back to ${i.name_en}</button>`:d[0]?`<button class="hud-chip-btn" id="btn-back-loc">⛩️ Go to ${d[0].name_en}</button>`:"<span></span>"}
          <button class="side-panel-close" title="Close (Esc)" style="position:static;">✕</button>
        </div>
        <div class="panel-badges" style="margin-top:6px;">
          <span class="badge canon">👤 Character Chronicle</span>
          <span class="badge">${s.species}</span>
          ${s.age?`<span class="badge">${s.age}</span>`:""}
        </div>
        <h2 class="panel-title-en">${s.name_en}</h2>
        <div class="panel-title-jp">${s.name_jp} ${s.title?`• <em>${s.title}</em>`:""}</div>
        ${s.tagline?`<div class="char-tagline">${s.tagline}</div>`:""}
      </div>

      <div class="side-panel-body">
        ${f}

        <div class="panel-actions-row">
          ${d[0]?`<button class="panel-action-btn" id="btn-fly-char-home">📍 Focus ${d[0].name_en}</button>`:""}
          <a
            href="${s.wiki_url}"
            target="_blank"
            rel="noopener noreferrer"
            class="panel-action-btn"
            style="text-decoration:none;text-align:center;"
          >📖 Official Touhou Wiki ↗</a>
        </div>

        <div>
          <div class="panel-section-title">Who They Are</div>
          <p class="panel-lore-text">${s.who_they_are}</p>
          ${h}
        </div>

        <div>
          <div class="panel-section-title">Profile &amp; Signature Powers</div>
          <div class="atlas-spatial-box">
            <div class="atlas-spatial-item"><strong>Role &amp; Occupation:</strong> ${s.occupation}</div>
            <div class="atlas-spatial-item"><strong>Signature Abilities:</strong> ${s.abilities}</div>
            ${s.theme_music?`<div class="atlas-spatial-item"><strong>Signature Theme:</strong> ♪ ${s.theme_music}</div>`:""}
            <div class="atlas-spatial-item"><strong>Debut Appearance:</strong> ${s.first_appearance}</div>
          </div>
        </div>

        <div>
          <div class="panel-section-title">Personality &amp; Demeanor</div>
          <div class="char-personality-box">${s.personality}</div>
        </div>

        <div>
          <div class="panel-section-title">💚 Who They Like — Friends, Family &amp; Allies</div>
          ${Et(s.allies,"ally","Independent spirit with few formal alliances.")}
        </div>

        <div>
          <div class="panel-section-title">⚔️ Enemies, Rivals &amp; Friction</div>
          ${Et(s.rivals,"rival","No sworn arch-enemies recorded outside friendly Spell Card duels.")}
        </div>

        ${s.acquaintances&&s.acquaintances.length>0?`
        <div>
          <div class="panel-section-title">🤝 Notable Associates &amp; Encounters</div>
          ${Et(s.acquaintances,"acq","")}
        </div>`:""}

        <div>
          <div class="panel-section-title">⛩️ Associated Haunts &amp; Locations</div>
          <div class="chip-list">${c}</div>
        </div>
      </div>
    `,o.querySelector(".side-panel-close")?.addEventListener("click",()=>{_.update({selectedId:null,selectedCharacterId:null}),window.history.replaceState(null,"",window.location.pathname)}),o.querySelector("#btn-back-loc")?.addEventListener("click",()=>{const b=i?.id??d[0]?.id??null;_.update({selectedId:b,selectedCharacterId:null}),b&&(t.flyToLocation(b,2.5),window.history.replaceState(null,"",`#loc=${b}`))}),o.querySelector("#btn-fly-char-home")?.addEventListener("click",()=>{d[0]&&t.flyToLocation(d[0].id,2.6)});const w=o.querySelector("#char-portrait-stage");if(w){const b=w.querySelector(".char-portrait-img"),g=w.querySelector(".char-portrait-zoom-hint");b?.addEventListener("error",()=>{w.style.display="none"}),w.addEventListener("click",()=>{const $=w.classList.toggle("is-expanded");g&&(g.textContent=$?"⤡ Click to compact":"⤢ Click to expand")})}o.querySelectorAll(".char-rel-card.is-clickable").forEach(b=>{b.addEventListener("click",()=>{const g=b.getAttribute("data-char-id"),$=b.getAttribute("data-loc-id");if(g){const S=_.getCharacter(g)?.home_location_ids?.[0]??_.getState().selectedId;_.update({selectedId:S,selectedCharacterId:g}),S&&t.flyToLocation(S,2.5),window.history.replaceState(null,"",`#char=${g}`),o.querySelector(".side-panel-body")?.scrollTo({top:0,behavior:"smooth"})}else $&&(_.update({selectedId:$,selectedCharacterId:null}),t.flyToLocation($,2.5),window.history.replaceState(null,"",`#loc=${$}`))})}),o.querySelectorAll(".conn-chip").forEach(b=>{b.addEventListener("click",()=>{const g=b.getAttribute("data-target");g&&(_.update({selectedId:g,selectedCharacterId:null}),t.flyToLocation(g,2.5),window.history.replaceState(null,"",`#loc=${g}`))})})}function l(s){const i=s.residents??[],d=i.length>0?i.map($=>{const p=_.getCharacter($);return p?`<span class="chip resident-chip has-dossier" data-char-id="${p.id}" title="Open Character Chronicle for ${p.name_en}">👤 ${$} <strong style="color:var(--accent-hakurei);">▸</strong></span>`:`<span class="chip resident-chip" data-resident="${$.replace(/"/g,"&quot;")}">👤 ${$}</span>`}).join(""):'<span style="font-size:12px;color:var(--ink-muted);">Uninhabited / Wandering spirits</span>',c=(s.connected_ids??[]).map($=>_.getLocation($)).filter($=>!!$),h=c.length>0?c.map($=>`<span class="chip conn-chip" data-target="${$.id}">🧭 ${$.name_en}</span>`).join(""):'<span style="font-size:12px;color:var(--ink-muted);">Use Route Planner to compute overland path</span>',f=(s.sources??[]).map($=>`<span class="badge">${$}</span>`).join(" "),w=s.image_url?`
        <div class="loc-reference-stage" id="loc-reference-stage" title="Click to toggle full canonical reference illustration">
          <img
            class="loc-reference-img"
            src="${s.image_url}"
            alt="${s.name_en} canonical reference"
            loading="eager"
            decoding="async"
          />
          <div class="char-portrait-caption">
            <span>🖼️ ${s.image_caption??"Official Touhou Canon Reference"}</span>
            <span class="char-portrait-zoom-hint">⤢ Expand</span>
          </div>
        </div>
      `:"",b=s.visual_blueprint?`
        <div class="loc-blueprint-box">
          <div class="loc-blueprint-label">🏛️ Canonical Architecture &amp; 3D Blueprint</div>
          <div class="loc-blueprint-text">${s.visual_blueprint}</div>
        </div>
      `:"";o.innerHTML=`
      <div class="side-panel-header">
        <button class="side-panel-close" title="Close (Esc)">✕</button>
        <div class="panel-badges">
          <span class="badge">${s.region}</span>
          <span class="badge">${s.kind}</span>
          <span class="badge ${s.confidence}">${s.confidence==="canon"?"✓ Official Canon":"✦ Fanon / Atlas"}</span>
        </div>
        <h2 class="panel-title-en">${s.name_en}</h2>
        <div class="panel-title-jp">${s.name_jp}</div>
      </div>

      <div class="side-panel-body">
        ${w}

        <div class="panel-actions-row">
          <button class="panel-action-btn" id="btn-inspect-3d">🧊 Inspect in 3D</button>
          <button class="panel-action-btn" id="btn-route-start">🚩 Route From Here</button>
          <button class="panel-action-btn" id="btn-route-end">🏁 Route To Here</button>
          <button class="panel-action-btn" id="btn-copy-citation">📋 Copy Atlas Note</button>
        </div>

        ${b}

        <div>
          <div class="panel-section-title">Overview &amp; Lore</div>
          <p class="panel-lore-text">${s.long_desc}</p>
        </div>

        <div>
          <div class="panel-section-title">Geography &amp; Travel Notes</div>
          <div class="atlas-spatial-box">
            <div class="atlas-spatial-item"><strong>Coordinates &amp; Sector:</strong> ${s.atlas_sector??s.region}</div>
            <div class="atlas-spatial-item"><strong>Travel Distance &amp; Time:</strong> ${s.travel_time??"See Route Planner"}</div>
            <div class="atlas-spatial-item"><strong>Approach Route &amp; Waypoints:</strong> ${s.approach_route??s.placement_note}</div>
            <div class="atlas-spatial-item"><strong>Local Customs &amp; Jurisdiction:</strong> ${s.local_customs??"Standard Gensokyo customs apply."}</div>
          </div>
        </div>

        <div>
          <div class="panel-section-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>Notable Residents &amp; Figures</span>
            <span style="font-size:10px;color:var(--accent-hakurei);font-family:var(--font-sans);text-transform:none;font-weight:600;">Click a character to read dossier ▸</span>
          </div>
          <div class="chip-list">${d}</div>
        </div>

        ${s.wiki_sublocations&&s.wiki_sublocations.length>0?`
        <div>
          <div class="panel-section-title">Canonical Sub-Locations (Touhou Wiki)</div>
          <div class="chip-list">
            ${s.wiki_sublocations.map($=>`<span class="badge">🏛️ ${$}</span>`).join("")}
          </div>
        </div>`:""}

        ${s.wiki_summary?`
        <div>
          <div class="panel-section-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>📖 Official Touhou Wiki Canon</span>
            ${s.wiki_url?`<a href="${s.wiki_url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-hakurei);text-decoration:none;font-weight:700;">↗ Touhou Wiki</a>`:""}
          </div>
          <div style="font-size:12.5px;line-height:1.5;color:var(--ink-secondary);max-height:190px;overflow-y:auto;background:var(--paper-card-alt);padding:8px 10px;border-radius:6px;border:1px solid rgba(90,70,56,0.25);white-space:pre-line;">${s.wiki_summary.slice(0,1200)}${s.wiki_summary.length>1200?"…":""}</div>
        </div>`:""}

        <div>
          <div class="panel-section-title">Direct Connected Waypoints</div>
          <div class="chip-list">${h}</div>
        </div>

        <div>
          <div class="panel-section-title">Cartographic &amp; Canon Provenance</div>
          <div style="font-size:12px;color:var(--ink-secondary);line-height:1.45;margin-bottom:6px;">
            <strong>First Appearance:</strong> ${s.first_appearance}<br/>
            <strong>Placement Note:</strong> ${s.placement_note} (${(s.x*100).toFixed(1)}%, ${(s.y*100).toFixed(1)}%)
          </div>
          <div class="panel-badges">${f}</div>
        </div>
      </div>
    `,o.querySelector(".side-panel-close")?.addEventListener("click",()=>{_.update({selectedId:null,selectedCharacterId:null}),window.history.replaceState(null,"",window.location.pathname)});const g=o.querySelector("#loc-reference-stage");if(g){const $=g.querySelector(".loc-reference-img"),p=g.querySelector(".char-portrait-zoom-hint");$?.addEventListener("error",()=>{g.style.display="none"}),g.addEventListener("click",()=>{const S=g.classList.toggle("is-expanded");p&&(p.textContent=S?"⤡ Compact":"⤢ Expand")})}o.querySelector("#btn-inspect-3d")?.addEventListener("click",()=>{_.update({view3d:!0}),t.flyToLocation(s.id,3)}),o.querySelector("#btn-route-start")?.addEventListener("click",()=>{const $=_.getState().routeEndId??(s.id==="human-village"?"hakurei-shrine":"human-village");_.update({routeMode:!0}),_.setRouteEndpoints(s.id,$)}),o.querySelector("#btn-route-end")?.addEventListener("click",()=>{const $=_.getState().routeStartId??(s.id==="human-village"?"hakurei-shrine":"human-village");_.update({routeMode:!0}),_.setRouteEndpoints($,s.id)}),o.querySelector("#btn-copy-citation")?.addEventListener("click",$=>{const p=$.currentTarget,S=`${s.name_en} (${s.name_jp}) — ${s.atlas_sector??s.region} | Travel: ${s.travel_time??"N/A"} | Route: ${s.approach_route??s.placement_note}`;navigator.clipboard?.writeText(S);const y=p.textContent;p.textContent="✓ Copied to Clipboard!",setTimeout(()=>{p.textContent=y},1800)}),o.querySelectorAll(".resident-chip").forEach($=>{$.addEventListener("click",()=>{const p=$.getAttribute("data-char-id");if(p){_.update({selectedCharacterId:p}),window.history.replaceState(null,"",`#char=${p}`),o.querySelector(".side-panel-body")?.scrollTo({top:0,behavior:"smooth"});return}const S=$.getAttribute("data-resident")??"";_.update({searchQuery:S});const y=document.querySelector("#atlas-search-input");y&&(y.value=S)})}),o.querySelectorAll(".conn-chip").forEach($=>{$.addEventListener("click",()=>{const p=$.getAttribute("data-target");p&&(_.update({selectedId:p,selectedCharacterId:null}),t.flyToLocation(p,2.5),window.history.replaceState(null,"",`#loc=${p}`))})})}_.subscribe(s=>{if(!(s.selectedId===r&&s.selectedCharacterId===n)){if(r=s.selectedId,n=s.selectedCharacterId,!r&&!n){o.classList.remove("open"),document.body.classList.remove("panel-open");return}if(o.classList.add("open"),document.body.classList.add("panel-open"),n){const i=_.getCharacter(n);if(i){const d=r?_.getLocation(r):void 0;a(i,d);return}}if(r){const i=_.getLocation(r);i&&l(i)}}})}function Wa(){const e=document.getElementById("app");if(!e)return;_.initData(fi,pi,ui);const t=new Na(e,Ut);Ba(e,t),Da(e,t),Ga(Ut,t),Ha(e,t),Oa(e,t);const o=window.location.hash;if(o.startsWith("#loc=")){const r=decodeURIComponent(o.slice(5));_.getLocation(r)&&setTimeout(()=>{_.update({selectedId:r,selectedCharacterId:null}),t.flyToLocation(r,2.5)},120)}else if(o.startsWith("#char=")){const r=decodeURIComponent(o.slice(6)),n=_.getCharacter(r);n&&setTimeout(()=>{const a=n.home_location_ids?.[0]??null;_.update({selectedId:a,selectedCharacterId:n.id}),a&&t.flyToLocation(a,2.5)},120)}}Wa();
