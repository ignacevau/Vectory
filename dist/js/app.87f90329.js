(function(t){function e(e){for(var o,c,r=e[0],s=e[1],l=e[2],d=0,h=[];d<r.length;d++)c=r[d],i[c]&&h.push(i[c][0]),i[c]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(t[o]=s[o]);u&&u(e);while(h.length)h.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],o=!0,r=1;r<n.length;r++){var s=n[r];0!==i[s]&&(o=!1)}o&&(a.splice(e--,1),t=c(c.s=n[0]))}return t}var o={},i={app:0},a=[];function c(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=o,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)c.d(n,o,function(e){return t[e]}.bind(null,o));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],s=r.push.bind(r);r.push=e,r=r.slice();for(var l=0;l<r.length;l++)e(r[l]);var u=s;a.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"04e8":function(t,e,n){"use strict";var o=n("9e9c"),i=n.n(o);i.a},1:function(t,e){},1739:function(t,e,n){},2:function(t,e){},"29ec":function(t,e,n){},"38b4":function(t,e,n){},"397d":function(t,e,n){"use strict";var o=n("628c"),i=n.n(o);i.a},"54b7":function(t,e,n){t.exports=n.p+"img/tool-select.e30c9c20.png"},"56d7":function(t,e,n){"use strict";n.r(e);var o=n("d225"),i=(n("cadf"),n("551c"),n("f751"),n("097d"),n("2b0e")),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},c=[],r=n("2877"),s={},l=Object(r["a"])(s,a,c,!1,null,null,null),u=l.exports,d=n("8c4f"),h=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"home"},[n("HelloWorld")],1)},f=[],p=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"hello"},[n("art-board"),n("header-bar"),n("div",{staticClass:"content"},[n("sidebar-left"),n("div",{ref:"main",staticClass:"main"},[n("footer-bar")],1),n("sidebar-right")],1)],1)},m=[],g=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},E=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"art-board"},[n("canvas",{staticClass:"canvas",attrs:{id:"canvas",resize:""}})])}],A=n("768b"),v=(n("c5f6"),n("cebc")),b=n("2222"),T=n.n(b),C=n("2f62"),O={name:"ArtBoard",methods:Object(v["a"])({},Object(C["c"])(["SET_TOOLSELECT","SET_TOOLPOINTER","SET_TOOLPEN","SET_TOOLCIRCLE","DELETE_SELECT"])),mounted:function(){Number.prototype.clamp=function(t,e){return Math.min(Math.max(this,t),e)},T.a.install(window),T.a.setup("canvas"),settings.handleSize=6,settings.hitTolerance=7;var t=this,e=new Tool,n=new Tool,o=new Tool,i=new Tool;t.SET_TOOLSELECT(e),t.SET_TOOLPOINTER(n),t.SET_TOOLPEN(o),t.SET_TOOLCIRCLE(i);var a=T.a.view,c=0,r=document.querySelector("#canvas");function s(t,e){var n=a.viewToProject(e),o=u(a.zoom,t,a.center,n),i=Object(A["a"])(o,2);a.zoom=i[0],c=i[1],a.center=a.center.add(c),a.draw(),settings.hitTolerance=(7/a.zoom).clamp(0,17)}function l(t,e){var n=1.05;return e>0?t/n:e<0?t*n:void 0}function u(t,e,n,o){var i=l(t,e).clamp(.2,10),a=t/i,c=o.subtract(n),r=o.subtract(c.multiply(a)).subtract(n);return[i,r]}r.onwheel=function(t){zt.$emit("zoom"),t.preventDefault();var e=new Point(t.clientX,t.clientY);s(t.deltaY,e)};var d={del:!1,shift:!1,control:!1,z:!1};function h(e){d.del||"Delete"!=e.code||d.control||d.shift?d.shift||"ShiftLeft"!=e.code?d.control||"ControlLeft"!=e.code?d.z||"z"!=e.key||(d.z=!0):(d.control=!0,zt.$emit("control")):(d.shift=!0,zt.$emit("shift")):(d.del=!0,t.DELETE_SELECT(),zt.$emit("delete_selection")),d.z&&d.control&&zt.$emit("undo")}document.onkeydown=h,document.onkeyup=function(t){"ControlLeft"==t.code&&zt.$emit("control_up"),"z"!=t.key?("Delete"==t.code&&(d.del=!1),d.control=!1,d.shift=!1,d.del=!1,d.z=!1):d.z=!1}}},w=O,L=(n("397d"),Object(r["a"])(w,g,E,!1,null,"6b6c900c",null)),S=L.exports,P=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"sidebar-left"},[o("div",{ref:"left",staticClass:"resize"},[o("div",{staticClass:"top-bar"},[o("span",{staticClass:"collapse-btn",on:{click:t.collapse}},[o("img",{class:{flip:!t.collapsed},staticStyle:{"max-height":"70%","max-width":"80%",margin:"0px 0px 1px 1px"},attrs:{src:n("e070")}})])]),o("tool-select"),o("tool-pointer"),o("tool-pen"),o("tool-circle")],1),o("div",{staticClass:"handler",attrs:{ondragstart:"return false;"},on:{mousedown:t.drag}},[o("div",{staticStyle:{"background-color":"white",height:"2vh",width:"1px",flex:"0 0 auto"}})])])},D=[],x=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tool",{attrs:{imgSource:"tool-pen.png"},on:{isActive:t.setActive}})},_=[],y=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"toolDiv"},[n("span",{class:{tool:!0,"tools-active":t.active},attrs:{id:"tool-select"},on:{click:function(e){return t.select()}}},[n("img",{staticClass:"tool-img",attrs:{src:t.imgUrl(),ondragstart:"return false;"}})])])},I=[],R=n("9142"),j={name:"Tool",mounted:function(){var t=this;this.active=this.propsActive,zt.$on("deselect",function(e){e.element!=t&&(t.active=!1)})},data:function(){return{active:!1}},props:["imgSource","propsActive"],methods:{imgUrl:function(){return R("./"+this.imgSource)},select:function(){zt.$emit("deselect",{element:this}),this.active=!0,this.$emit("isActive")}}},B=j,M=(n("b37f"),Object(r["a"])(B,y,I,!1,null,"eae04e32",null)),k=M.exports,Q={name:"ToolPen",computed:Object(v["a"])({},Object(C["d"])(["ACTIVE","TOOLPEN"])),components:{Tool:k},methods:Object(v["a"])({},Object(C["c"])(["SET_ACTIVE","ADD_SHAPE"]),{setActive:function(){this.SET_ACTIVE("pen"),this.TOOLPEN.activate()}}),mounted:function(){var t,e=this,n=0;e.TOOLPEN.onMouseDown=function(e){t=new Path,t.strokeColor="black",n=0,project.activeLayer.selected=!1},e.TOOLPEN.onMouseDrag=function(e){t.add(e.point),n+=e.delta.length},e.TOOLPEN.onMouseUp=function(o){n<3?t.remove():(t.smooth(),t.simplify(),t.selected=!0,t,t.selectable=!0,e.ADD_SHAPE(t))}}},H=Q,J=Object(r["a"])(H,x,_,!1,null,"c7e40374",null),z=J.exports,N=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tool",{attrs:{imgSource:"tool-pointer.png"},on:{isActive:t.setActive}})},U=[],X={name:"ToolPointer",computed:Object(v["a"])({},Object(C["d"])(["ACTIVE","TOOLPOINTER"])),components:{Tool:k},methods:Object(v["a"])({},Object(C["c"])(["SET_ACTIVE","ADD_SHAPE"]),{setActive:function(){this.SET_ACTIVE("pointer"),this.TOOLPOINTER.activate()}}),mounted:function(){}},W=X,q=Object(r["a"])(W,N,U,!1,null,"a0f54396",null),K=q.exports,V=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tool",{attrs:{imgSource:"tool-select.png"},on:{isActive:t.setActive}})},G=[],Y=n("75fc"),F=(n("20d6"),n("7f7f"),n("a4bb")),Z=n.n(F),$=(n("ac6a"),{name:"ToolSelect",computed:Object(v["a"])({},Object(C["d"])(["ACTIVE","TOOLSELECT","OBJECTS","SELECTED","ACTIONS"])),components:{Tool:k},methods:Object(v["a"])({},Object(C["c"])(["SET_ACTIVE","ADD_SHAPE","ADD_SELECT","CLEAR_SELECT","DELETE_SELECT","ADD_ACTION","UNDO"]),{setActive:function(){this.SET_ACTIVE("select"),this.TOOLSELECT.activate()}}),mounted:function(){var t,e,n,o=this,i=(document.querySelector("#tool-select"),!1),a=new Path;a.selectable=!1;var c,r,s,l,u,d,h=new Path,f={topLeft:null,topMiddle:null,topRight:null,leftCenter:null,rightCenter:null,bottomLeft:null,bottomMiddle:null,bottomRight:null},p=7/view.zoom,m=2/view.zoom,g={hover:!1,scaling:!1,pivot:null,dir:"",scale_facH:null,scale_facW:null},E=null,A=new Path,v=[],b=!1,C=!1,O=!1,w=!1,L={height:null,width:null,pivot:null,center:null},S={move:new Nt("move",{startPos:null,endPos:null,paths:null}),scale:new Nt("scale",{paths:null,pivot:null,handle_init:null,handle_end:null,lockX:!1,lockY:!1})};function P(){h.remove(),Z()(f).forEach(function(t,e){f[t]&&f[t].remove()})}function D(t){if(t&&(n=t),n){h=Path.Rectangle(n),h.strokeColor="black",h.selectable=!1,h.strokeWidth=.5/view.zoom;var e=n.point.subtract(p/2),o=new Point(n.point.x+n.width/2,n.point.y).subtract(p/2),i=new Point(n.point.x+n.width,n.point.y).subtract(p/2),a=new Point(n.point.x,n.point.y+n.height/2).subtract(p/2),c=new Point(n.point.x+n.width,n.point.y+n.height/2).subtract(p/2),r=new Point(n.point.x,n.point.y+n.height).subtract(p/2),s=new Point(n.point.x+n.width/2,n.point.y+n.height).subtract(p/2),l=new Point(n.point.x+n.width,n.point.y+n.height).subtract(p/2),u=new Rectangle(e,p),d=new Rectangle(o,p),g=new Rectangle(i,p),E=new Rectangle(a,p),A=new Rectangle(c,p),v=new Rectangle(r,p),b=new Rectangle(s,p),T=new Rectangle(l,p);f.topLeft=Path.Rectangle(u),f.topMiddle=Path.Rectangle(d),f.topRight=Path.Rectangle(g),f.leftCenter=Path.Rectangle(E),f.rightCenter=Path.Rectangle(A),f.bottomLeft=Path.Rectangle(v),f.bottomMiddle=Path.Rectangle(b),f.bottomRight=Path.Rectangle(T),Z()(f).forEach(function(t,e){f[t]&&(f[t].type="transformPoint")}),f.topLeft.cursorType="nw-resize",f.bottomRight.cursorType="nw-resize",f.topMiddle.cursorType="n-resize",f.bottomMiddle.cursorType="n-resize",f.topRight.cursorType="ne-resize",f.bottomLeft.cursorType="ne-resize",f.leftCenter.cursorType="e-resize",f.rightCenter.cursorType="e-resize",f.topLeft.name="topLeft",f.topRight.name="topRight",f.topMiddle.name="topCenter",f.leftCenter.name="leftCenter",f.rightCenter.name="rightCenter",f.bottomLeft.name="bottomLeft",f.bottomMiddle.name="bottomCenter",f.bottomRight.name="bottomRight",Z()(f).forEach(function(t,e){f[t]&&(f[t].selectable=!1,f[t].strokeColor="blue",f[t].fillColor="white",f[t].strokeWidth=m)})}}function x(t){P(),t?D(t):D()}function _(t,e,n,o){if(t){var i=t,a=o.center.add(o.center.subtract(t));return e&&(i=new Point(a.x,i.y)),n&&(i=new Point(i.x,a.y)),i}alert("warning: 001")}function y(){if(0!=v.length){for(var t=[],e=0;e<v.length;e++)t.push(v[e].clone());var n=new CompoundPath({children:t}),o=n.bounds;return n.remove(),o}}function I(){c>0&&b&&!w?(g.scale_facH=-g.scale_facH,b=!1):c<0&&!b&&!w&&(g.scale_facH=-g.scale_facH,b=!0),r>0&&!C&&!O&&(g.scale_facW=-g.scale_facW,C=!0),r<0&&C&&!O&&(g.scale_facW=-g.scale_facW,C=!1)}function R(){for(var e=L.center.subtract(h.bounds.center),n=0;n<v.length;n++)v[n].translate(e);h.position=L.center,u=new Point(L.center.x,L.center.y),S.scale.data.pivot=u,j(t)}function j(t){l=t.point.subtract(s),s=t.point;if(g.dragging){for(var e=0;e<v.length;e++)v[e].translate(l);return h.translate(l),n=h.bounds,void Z()(f).forEach(function(t,e){f[t].translate(l)})}if(g.scaling){var o=h.bounds;if(w?g.scale_facH=1:(c=t.point.subtract(u).y,g.scale_facH=Math.abs(c)/o.height),O?g.scale_facW=1:(r=t.point.subtract(u).x,g.scale_facW=Math.abs(r)/o.width),Math.abs(g.scale_facH)<.1&&!w)return;if(Math.abs(g.scale_facW)<.1&&!O)return;if(t.modifiers.shift||I(),t.modifiers.shift){var i=Math.min(Math.abs(g.scale_facH),Math.abs(g.scale_facW));w?i=Math.abs(g.scale_facW):O&&(i=Math.abs(g.scale_facH)),g.scale_facH=i,g.scale_facW=i}t.modifiers.control&&(O||(g.scale_facW*=2),w||(g.scale_facH*=2));for(e=0;e<v.length;e++)v[e].scale(g.scale_facW,g.scale_facH,u);h.scale(g.scale_facW,g.scale_facH,u),Z()(f).forEach(function(t,e){f[t].remove()})}}o.TOOLSELECT.onMouseDown=function(t){if(i=!0,s=t.point,g.dragging)S.move=new Nt("move",{paths:v,startPos:t.point,endPos:null});else{if(P(),g.hover){var n=y();switch(g.scaling=!0,D(),g.dir=t.item.name,u=_(n[g.dir],!0,!0,n),L.width=n.width,L.height=n.height,L.pivot=new Point(u.x,u.y),L.center=new Point(n.center.x,n.center.y),g.dir){case"bottomLeft":b=!1,C=!1,O=!1,w=!1;break;case"topLeft":b=!0,C=!1,O=!1,w=!1;break;case"bottomRight":b=!1,C=!0,O=!1,w=!1;break;case"topRight":b=!0,C=!0,O=!1,w=!1;break;case"bottomCenter":b=!1,C=!1,O=!0,w=!1;break;case"topCenter":b=!0,C=!1,O=!0,w=!1;break;case"leftCenter":b=!1,C=!1,O=!1,w=!0;break;case"rightCenter":b=!1,C=!0,O=!1,w=!0;break}return t.modifiers.control&&R(),S.scale=new Nt("scale",{paths:v,pivot:L.pivot,lockX:O,lockY:w,handle_init:n[g.dir],handle_end:null}),void j(t)}h=new Path,e||(v=[]),a&&(a.remove(),e&&!e.selected&&e.selectable&&(t.modifiers.shift?(e.selected=!0,o.ADD_SELECT(e),v.push(e)):(project.activeLayer.selected=!1,e.selected=!0,v=[],o.CLEAR_SELECT(),o.ADD_SELECT(e),v.push(e)),D(y()))),t.item||(project.activeLayer.selected=!1,o.CLEAR_SELECT(),E=t.point)}},o.TOOLSELECT.onMouseMove=function(c){if(t=c,i&&j(c),document.body.style.cursor="default",g.hover=!1,e&&(e=null,a.remove()),c.item&&(e=c.item,e.selectable&&!e.selected?(a=e.clone(),a.strokeColor="#33b5ff",a.strokeWidth=2/T.a.view.zoom,a.selectable=!1):"transformPoint"==e.type&&(document.body.style.cursor=e.cursorType,g.hover=!0,g.pivot=e.opposite)),E&&!g.hover){A.remove(),d=new Rectangle(E,c.point),A=Path.Rectangle(d),A.selectable=!1,A.dashArray=[4/view.zoom,3/view.zoom],A.strokeColor="black",A.strokeWidth=.5/view.zoom;for(var r=new Rectangle(E,c.point),s=0;s<o.OBJECTS.length;s++)if(A.intersects(o.OBJECTS[s]))o.OBJECTS[s].selected||(o.OBJECTS[s].selected=!0,v.push(o.OBJECTS[s]));else if(o.OBJECTS[s].isInside(r))o.OBJECTS[s].selected||(o.OBJECTS[s].selected=!0,v.push(o.OBJECTS[s]));else{o.OBJECTS[s].selected=!1;var l=v.findIndex(function(t){return t===o.OBJECTS[s]});-1!=l&&v.splice(l,1)}}g.dragging=!1,0!=o.SELECTED.length&&(!c.point.isInside(n)||g.hover||g.scaling||(document.body.style.cursor="move",g.dragging=!0))},o.TOOLSELECT.onMouseUp=function(t){i=!1;var e=!1;if(E=null,A.remove(),0!=v.length){if(g.scaling){O=!1,w=!1;y();S.scale.data.handle_end=_(u,!0,!0,h.bounds),o.ADD_ACTION(S.scale),g.scaling=!1,e=!0}if(g.dragging&&(S.move.data.endPos=t.point,o.ADD_ACTION(S.move),g.dragging=!1,e=!0),P(),D(y()),!e){o.CLEAR_SELECT();for(var n=0;n<v.length;n++)o.ADD_SELECT(v[n])}}},zt.$on("zoom",function(){h.strokeWidth=.5/view.zoom,p=7/view.zoom,m=2/view.zoom,v.length>0&&x()}),zt.$on("undo",function(){if(o.ACTIONS.length>0){o.UNDO(),v=Object(Y["a"])(o.SELECTED);for(var t=0;t<v.length;t++)v[t].selected=!0;x(y())}}),zt.$on("delete_selection",function(){v=[],P()}),zt.$on("shift",function(){if(g.scaling){for(var e,n=y(),o=L.height/n.height,i=L.width/n.width,a=0;a<v.length;a++)v[a].scale(i,o,u);h.scale(i,o,u),e=O?Math.abs(c):w?Math.abs(r):Math.min(Math.abs(c),Math.abs(r));var s=e/Math.min(L.width,L.height);for(a=0;a<v.length;a++)v[a].scale(s,s,u);h.scale(s,s,u),j(t)}}),zt.$on("control",function(){g.scaling&&R()}),zt.$on("control_up",function(){if(g.scaling){u=new Point(L.pivot.x,L.pivot.y),S.scale.data.pivot=u;var e;h.bounds;c=t.point.subtract(u).y,r=t.point.subtract(u).x,c>=0&&r>=0?(e=h.bounds.topLeft,b=!1,C=!0):c>=0&&r<0?(e=h.bounds.topRight,b=!1,C=!1):c<0&&r>=0?(e=h.bounds.bottomLeft,b=!0,C=!0):c<0&&r<0&&(e=h.bounds.bottomRight,b=!0,C=!1);var n=L.pivot.subtract(e);O?n.x=0:w&&(n.y=0),h.translate(n);for(var o=0;o<v.length;o++)v[o].translate(n);j(t)}})}}),tt=$,et=Object(r["a"])(tt,V,G,!1,null,"74f024c4",null),nt=et.exports,ot=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tool",{attrs:{imgSource:"tool-circle.png"},on:{isActive:t.setActive}})},it=[],at=(n("0b21"),{name:"ToolCircle",computed:Object(v["a"])({},Object(C["d"])(["ACTIVE","TOOLCIRCLE"])),components:{Tool:k},methods:Object(v["a"])({},Object(C["c"])(["SET_ACTIVE","ADD_SHAPE"]),{setActive:function(){this.SET_ACTIVE("pen"),this.TOOLCIRCLE.activate()}}),mounted:function(){var t,e,n=this;n.TOOLCIRCLE.onMouseDown=function(n){t=new Path,e=n.point,project.activeLayer.selected=!1},n.TOOLCIRCLE.onMouseDrag=function(n){var o;if(t.remove(),n.modifiers.shift)n.modifiers.control?(a=e.getDistance(n.point),i=e):(a=Math.max(Math.abs(e.x-n.point.x),Math.abs(e.y-n.point.y))/2,i=new Point(e.x+a/2*Math.sign(n.point.x-e.x),e.y+a/2*Math.sign(n.point.y-e.y))),t=Path.Circle(i,a);else if(n.modifiers.control){var i=e,a=[n.point.x-e.x,n.point.y-e.y];t=Path.Ellipse({center:i,radius:a})}else{var c=e,r=n.point;o=new Rectangle(c,r),t=Path.Ellipse(o)}t.strokeColor="black"},n.TOOLCIRCLE.onMouseUp=function(e){e.delta.length<3?t.remove():(t.selected=!0,t,t.selectable=!0,n.ADD_SHAPE(t))}}}),ct=at,rt=Object(r["a"])(ct,ot,it,!1,null,"21c0b687",null),st=rt.exports,lt={name:"SidebarLeft",components:{ToolPen:z,ToolPointer:K,ToolSelect:nt,ToolCircle:st},data:function(){return{dragging:!1,collapsed:!0,minWidth:50,maxWidth:90}},mounted:function(){window.addEventListener("mousemove",this.resize),window.addEventListener("mouseup",this.undrag),this.$refs.left.style.width=this.minWidth+"px"},methods:{resize:function(t){this.dragging&&(this.$refs.left.style.width=this.clamp(t.clientX-3,this.minWidth,this.maxWidth)+"px",this.$refs.left.style.width==this.minWidth+"px"?this.collapsed=!0:this.collapsed=!1)},drag:function(){this.dragging=!0},undrag:function(){this.dragging=!1},collapse:function(){this.collapsed?(this.$refs.left.style.width=this.maxWidth+"px",this.collapsed=!1):(this.$refs.left.style.width=this.minWidth+"px",this.collapsed=!0)}},computed:Object(v["a"])({},Object(C["b"])(["clamp"]))},ut=lt,dt=(n("a1c6"),Object(r["a"])(ut,P,D,!1,null,"f5ebbb76",null)),ht=dt.exports,ft=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"sidebar-right"},[o("div",{staticClass:"handler",attrs:{ondragstart:"return false;"},on:{mousedown:t.drag}},[o("div",{staticStyle:{"background-color":"white",height:"2vh",width:"1px",flex:"0 0 auto"}})]),o("div",{ref:"right",staticClass:"resize"},[o("div",{staticClass:"top-bar"},[o("span",{staticClass:"collapse-btn",on:{click:t.collapse}},[o("img",{class:{flip:t.collapsed},staticStyle:{"max-height":"70%","max-width":"80%",margin:"0px 0px 1px 1px"},attrs:{src:n("e070")}})])]),o("span",{staticStyle:{width:"90px"}})])])},pt=[],mt={name:"SidebarRight",data:function(){return{dragging:!1,collapsed:!0,minWidth:90,maxWidth:200}},mounted:function(){window.addEventListener("mousemove",this.resize),window.addEventListener("mouseup",this.undrag),this.$refs.right.style.width=this.minWidth+"px"},methods:{resize:function(t){this.dragging&&(this.$refs.right.style.width=this.clamp(window.innerWidth-(t.clientX+3),this.minWidth,this.maxWidth)+"px",this.$refs.right.style.width==this.minWidth+"px"?this.collapsed=!0:this.collapsed=!1)},drag:function(){this.dragging=!0},undrag:function(){this.dragging=!1},collapse:function(){this.collapsed?(this.$refs.right.style.width=this.maxWidth+"px",this.collapsed=!1):(this.$refs.right.style.width=this.minWidth+"px",this.collapsed=!0)}},computed:Object(v["a"])({},Object(C["b"])(["clamp"]))},gt=mt,Et=(n("ebf1"),Object(r["a"])(gt,ft,pt,!1,null,"2a633b52",null)),At=Et.exports,vt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",{staticClass:"header-bar"})},bt=[],Tt={name:"HeaderBar"},Ct=Tt,Ot=(n("eef4"),Object(r["a"])(Ct,vt,bt,!1,null,"4ddd94f0",null)),wt=Ot.exports,Lt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("footer",{staticClass:"footer-bar"})},St=[],Pt={name:"FooterBar"},Dt=Pt,xt=(n("80d3"),Object(r["a"])(Dt,Lt,St,!1,null,"45c82e96",null)),_t=xt.exports,yt={name:"HelloWorld",components:{SidebarLeft:ht,SidebarRight:At,HeaderBar:wt,FooterBar:_t,ArtBoard:S}},It=yt,Rt=(n("04e8"),Object(r["a"])(It,p,m,!1,null,"5c3c1a11",null)),jt=Rt.exports,Bt={name:"home",components:{HelloWorld:jt},methods:{test:function(){alert("test")}}},Mt=Bt,kt=(n("cccb"),Object(r["a"])(Mt,h,f,!1,null,null,null)),Qt=kt.exports;i["a"].use(d["a"]);var Ht=new d["a"]({mode:"history",base:"/",routes:[{path:"/",name:"home",component:Qt}]});i["a"].use(C["a"]);var Jt=new C["a"].Store({state:{ACTIVE:"",TOOLSELECT:null,TOOLPOINTER:null,TOOLPEN:null,TOOLCIRCLE:null,OBJECTS:[],SELECTED:[],ACTIONS:[]},mutations:{SET_ACTIVE:function(t,e){t.ACTIVE=e},SET_TOOLSELECT:function(t,e){t.TOOLSELECT=e},SET_TOOLPOINTER:function(t,e){t.TOOLPOINTER=e},SET_TOOLPEN:function(t,e){t.TOOLPEN=e},SET_TOOLCIRCLE:function(t,e){t.TOOLCIRCLE=e},ADD_SHAPE:function(t,e){t.OBJECTS.push(e)},ADD_SELECT:function(t,e){t.SELECTED.push(e)},CLEAR_SELECT:function(t){t.SELECTED=[]},DELETE_SELECT:function(t){for(var e=t.SELECTED.length-1;e>=0;e--){t.SELECTED[e].remove();var n=t.OBJECTS.findIndex(function(n){return n===t.SELECTED[e]});t.OBJECTS.splice(n,1),t.SELECTED.pop()}},ADD_ACTION:function(t,e){t.ACTIONS.push(e)},UNDO:function(t){if(!(t.ACTIONS.length<=0)){var e=t.ACTIONS.pop();switch(e.type){case"move":for(var n=e.data.startPos.subtract(e.data.endPos),o=0;o<e.data.paths.length;o++)e.data.paths[o].translate(n);t.SELECTED=e.data.paths;break;case"scale":var i=e.data.pivot,a=e.data.handle_init,c=e.data.handle_end,r=1,s=1;e.data.lockY||(r=a.subtract(i).y/c.subtract(i).y),e.data.lockX||(s=a.subtract(i).x/c.subtract(i).x);for(o=0;o<e.data.paths.length;o++)e.data.paths[o].scale(s,r,i);t.SELECTED=e.data.paths;break}}}},getters:{clamp:function(t){return function(t,e,n){return t<e?e:t>n?n:t}}}});n.d(e,"bus",function(){return zt}),n.d(e,"Action",function(){return Nt}),i["a"].config.productionTip=!1;var zt=new i["a"],Nt=function t(e,n){Object(o["a"])(this,t),this.type=e,this.data=n};new i["a"]({router:Ht,store:Jt,render:function(t){return t(u)}}).$mount("#app")},"597f":function(t,e){t.exports="data:image/png;base64,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"},"628c":function(t,e,n){},"80d3":function(t,e,n){"use strict";var o=n("1739"),i=n.n(o);i.a},"87cf":function(t,e,n){},9142:function(t,e,n){var o={"./collapse.png":"e070","./tool-circle.png":"be55","./tool-pen.png":"597f","./tool-pointer.png":"a584","./tool-select.png":"54b7"};function i(t){var e=a(t);return n(e)}function a(t){var e=o[t];if(!(e+1)){var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}return e}i.keys=function(){return Object.keys(o)},i.resolve=a,t.exports=i,i.id="9142"},"9e9c":function(t,e,n){},a1c6:function(t,e,n){"use strict";var o=n("87cf"),i=n.n(o);i.a},a584:function(t,e,n){t.exports=n.p+"img/tool-pointer.ae8b7311.png"},b37f:function(t,e,n){"use strict";var o=n("e71e"),i=n.n(o);i.a},be55:function(t,e,n){t.exports=n.p+"img/tool-circle.e8fcf1fd.png"},cccb:function(t,e,n){"use strict";var o=n("d563"),i=n.n(o);i.a},d563:function(t,e,n){},e070:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAATCAYAAACUef2IAAAACXBIWXMAAAsSAAALEgHS3X78AAAA60lEQVQ4jbXUwQ2CQBAF0C/xrqXQAXr/BzsQK5AW7IAOgB6mAO1AO7EDzJLRjMCsHNZJgDD5+7KwsKu+7/GPWoeTiFz1viXZemERqQHkAO4kqxic6bXQoxGRMpLPNXcWEXcCFu5ML4Zb7BjDB5hkuQTX13RagmdmUFI8Gw1Khmczg5LgEziCHxbitQsb/GZauZML+GWcc2F9/MK0nk4uQNU4Nwsr2phWR7J20PDXbrT1AFDOwg46WTwH3ZGczjgV+gWnRD9watTO+CeqFRbwJ2rhJaitKBpq2OgB7MOJ5HvD9yp8r1vd6F0UAF7LdZ7Jn4ritwAAAABJRU5ErkJggg=="},e71e:function(t,e,n){},ebf1:function(t,e,n){"use strict";var o=n("38b4"),i=n.n(o);i.a},eef4:function(t,e,n){"use strict";var o=n("29ec"),i=n.n(o);i.a}});
//# sourceMappingURL=app.87f90329.js.map