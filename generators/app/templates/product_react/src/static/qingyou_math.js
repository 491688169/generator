var htmlLatexRender=function(){function h(a){return Math.max(a.clientHeight,a.scrollHeight)}function e(a,c){return null==a||1!=a.nodeType?null:a.getAttribute(c)}function k(a,c,b){switch(typeof c){case "object":for(var d in c)a.style[d]=c[d];break;case "string":a.style[c]=b}}function p(a,c){if(null==a)return null;try{if(!0==c){var b=a.parentNode;if(b.nextElementSibling)return b.nextElementSibling;for(;b=b.nextSibling;)if(1==b.nodeType)return b}else{if(a.nextElementSibling)return a.nextElementSibling;
for(;a=a.nextSibling;)if(1==a.nodeType)return a}}catch(d){}return null}function m(a,c){if(null!=a&&null!=c){var b=a.children||a.childNodes;c(a);for(var d=0;d<b.length;d++)m(b[d],c)}}function l(a,c,b,d){if(null!=a){++d;for(var f=a.children||a.childNodes,g=0;g<f.length;g++)a=f[g],1==a.nodeType&&(b(a)&&c.push({n:a,d:d}),l(a,c,b,d))}}function q(a){var c=[],b=0;l(a,c,function(a){if(e(a,"hassize"))return!0},0);for(b=0;b<c.length;b++)c[b].h=h(c[b].n.parentNode),c[b].w=Math.max(c[b].n.parentNode.clientWidth,
c[b].n.parentNode.scrollWidth),c[b].s=parseInt(e(c[b].n,"hassize")),c[b].f=e(c[b].n,"dealflag");for(b=0;b<c.length;b++)if(0>c[b].s)switch(a=e(c[b].n,"mathtag"),a){case "msup_sup":r(c[b]);break;case "msub_sub":s(c[b]);break;case "msubsup_sup":t(c[b])}else u(c[b])}function u(a){var c=[],b;l(a.n,c,function(a){if(e(a,"muststretch"))return!0},0);if(!(1>c.length))if(b=e(c[0].n,"muststretch"),"v"==b){if(b=(a.h-a.s)/c.length,0<b)for(a=0;a<c.length;a++)c[a].n.style.height=b+"px"}else if(b=(a.w-a.s)/c.length,
0<b)for(a=0;a<c.length;a++)c[a].n.style.width=b+"px"}function t(a){var c=p(a.n),b=h(a.n),d=h(c);a=a.h-(b+d);0<a&&k(c,"marginTop",a+"px")}function r(a){if(a.f){var c=h(a.n.parentNode);0<c&&k(a.n,"verticalAlign",3*c/4+"px")}}function s(a){a.f&&0<h(a.n.parentNode)&&k(a.n,"verticalAlign","-100%")}function n(a){if(!(null==a||8==a.nodeType||1>a.childNodes.length||/input|form|math|iframe|textarea|pre|svg/.test(a.nodeName)))for(var c,b,d,f,g=a.childNodes.length-1;-1<g;g--)if(3!=a.childNodes[g].nodeType)n(a.childNodes[g]);
else{c=a.childNodes[g].nodeValue.replace(/sin/g,"\u253d").replace(/cos/g,"\u253e").replace(/tan/g,"\u253f").replace(/lim/g,"\u2540");c=c.replace(/\-/g,"\u2212").replace(/=/g,"\uff1d").replace(/\\+/g,"\uff0b");b=document.createDocumentFragment();for(var e=0;e<c.length;e++){f=c.charAt(e);switch(f){case "\u253d":f="sin";break;case "\u253e":f="cos";break;case "\u253f":f="tan";break;case "\u2540":f="lim";break;default:if(/[a-z]/i.test(f)){d=document.createElement("font");d.className="MathJye_mi";d.appendChild(document.createTextNode(f));
b.appendChild(d);continue}}b.appendChild(document.createTextNode(f))}a.replaceChild(b,a.childNodes[g])}}this.LayOut=function(a,c){for(var b=a.getElementsByTagName("span"),d=0;d<b.length;d++)"math"==e(b[d],"mathtag")&&(n(b[d]),c&&m(b[d],function(a){if(1==a.nodeType)switch(e(a,"muststretch")){case "v":a.style.height="1px";break;case "h":a.style.width="1px"}}),"1"==e(b[d],"dealflag")&&q(b[d]))}};
var MathJye = Object;
try {
    MathJye = new htmlLatexRender();
} catch (e) { }

$(function () {
    try {
        MathJye.LayOut(document.body);
    } catch (e) { }
});
