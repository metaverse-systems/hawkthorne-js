(this["webpackJsonphawkthorne-js"]=this["webpackJsonphawkthorne-js"]||[]).push([[0],{18:function(t){t.exports=JSON.parse('["abed-castle-interior","abed-cave","acschool","admin-hallway","baseball","black-caverns-2","black-caverns-3","black-caverns","blacksmith","blacksmith-upstairs","borchert-hallway","castle-hawkthorne-entrance","castle-hawkthorne-room-1","castle-hawkthorne-room-2","castle-hawkthorne-room-3","castle-hawkthorne-room-4","castle-hawkthorne-throne","castle-hawkthorne","class-basement","class-hallway-2","class-hallway","deans-closet2","deans-closet","deans-office-2","deans-office","dorm-lobby","forest-2","forest-hidden","forest","frozencave-2","frozencave-3","frozencave","gay-island-2","gay-island-3","gay-island-4","gay-island","gazette-office-2","gazette-office","greendale-anthropology","greendale-biology","greendale-englishmemorial","greendale-exterior","greendale-fry","greendale-ladders","greendale-quad","hallway","house","lab","mens-bathroom","new-abedtown","parking-lot","potteryclass","rainbow-bar","rave-hallway","seabluff","secretwritersgarden","sophieb","studyroom","sunchamber","tavern","test-level","town","trampoline","treeline","upstairs","valley-2","valley-3","valley-chili-fields-2","valley-chili-fields","valley-goat-cave","valley-goat-farm","valley-hills-2","valley-hills","valley-sandpits-2","valley-sandpits-entrance","valley-sandpits","valley-tacotown","valley","vents-2","vents","village-forest-2","village-forest-3","village-forest-4","village-forest-acornpeak-2","village-forest-acornpeak","village-forest-mines-2","village-forest-mines-3","village-forest-mines-entrance","village-forest-mines-return","village-forest-mines-room","village-forest-mines-storage-room","village-forest-mines","village-forest-stonerspeak-2","village-forest-stonerspeak-return","village-forest-stonerspeak","village-forest","village-treeline","winterwonderland2","winterwonderland","womens-bathroom"]')},23:function(t,e,n){},24:function(t,e,n){},38:function(t,e,n){"use strict";n.r(e);var o=n(6),i=n.n(o),a=n(15),r=n.n(a),s=(n(23),n(0)),c=n(16),l=n(4),h=n(3),p=(n(24),n(17)),d=n.n(p),u=n(2),m=n(7),f=function t(e,n,o,i){var a=this;Object(s.a)(this,t),this.draw=function(t,e,n,o){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};void 0===i.scale&&(i.scale=1);var r=1,s=0,c=1,l=0,h=n,p=o;if(!0===i.flipHorizontal&&(r=-1,s=a.canvas.width,h=a.canvas.width-n-a.spriteWidth),!0===i.flipVertical&&(c=-1,l=a.canvas.height,p=a.canvas.height-o-a.spriteHeight),i.flipDiagonal)return a.context.save(),a.context.translate(n,o),a.context.rotate(Math.PI/180*270),a.context.drawImage(a.sheet,t*a.spriteWidth,e*a.spriteHeight,a.spriteWidth,a.spriteHeight,-a.spriteWidth,0,a.spriteWidth*i.scale,a.spriteHeight*i.scale),void a.context.restore();i.flipVertical||i.flipHorizontal?(a.context.save(),a.context.translate(s,l),a.context.scale(r,c),a.context.drawImage(a.sheet,t*a.spriteWidth,e*a.spriteHeight,a.spriteWidth,a.spriteHeight,h,p,a.spriteWidth*i.scale,a.spriteHeight*i.scale),a.context.restore()):a.context.drawImage(a.sheet,t*a.spriteWidth,e*a.spriteHeight,a.spriteWidth,a.spriteHeight,n,o,a.spriteWidth*i.scale,a.spriteHeight*i.scale)},this.sheet=new Image,this.sheet.src=n,this.spriteWidth=o,this.spriteHeight=i,this.canvas=e,this.context=e.getContext("2d")},b=function t(e,n,o,i,a){var r=this;Object(s.a)(this,t),this.animate=function(t,e,n,o,i){var a=!1;if(r.animation!==t&&(r.animation=t,a=!0),r.direction!==e&&(r.direction=e,a=!0),a){r.frame=0,r.loop=[];var s=r.characterMap[t],c=[];Array.isArray(s)?(r.repeat=s[0],c=s[1]):(r.repeat=s[e][0],c=s[e][1]),c.forEach((function(t){var e=t.split(","),n=Object(m.a)(e,2),o=n[0],i=n[1];if(-1!==o.search("-"))for(var a=o.split("-"),s=Object(m.a)(a,2),c=s[0],l=s[1],h=c;h<=l;h++)r.loop.push({x:h-1,y:i-1});else r.loop.push({x:o-1,y:i-1})}))}r.draw(n,o,i)},this.draw=function(t,e,n){0!==r.loop.length&&(r.sheet.draw(r.loop[r.frame].x,r.loop[r.frame].y,t,e,n),r.frame++,r.frame===r.loop.length&&(r.frame=0))},this.sheet=new f(e,n,o,i),this.frame=0,this.animation="",this.direction="",this.repeat="",this.loop=[],this.characterMap=a},g=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).sprite=new b(t.canvas,t.url,t.width,t.height,t.characterMap),o.Type="SpriteComponent",o}return n}(u.Component),v=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).sprite=new f(t.canvas,t.url,t.width,t.height),o.Type="StaticSpriteComponent",o}return n}(u.Component),y=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).Type="TilesheetComponent",o}return n}(u.Component),C=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).tilesheet=t.tilesheet,o.width=t.width,o.height=t.height,o.x=t.x,o.y=t.y,o.options=t.options,o.Type="TileComponent",o}return n}(u.Component),w=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).x=t.x,o.y=t.y,o.Type="PositionComponent",o}return n}(u.Component),j=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).points=t.points,o.Type="PolygonComponent",o}return n}(u.Component),x=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).points=t.points,o.Type="PolylineComponent",o}return n}(u.Component),O=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),void 0===t&&(t={}),(o=e.call(this,t)).Init=function(){o.Container.Components.TilesheetComponent={},o.Container.Components.TileComponent={},o.Container.Components.PositionComponent={},o.Container.Components.SpriteComponent={},o.Container.Components.StaticSpriteComponent={},o.Container.Components.PolygonComponent={}},o.ConfigUpdate=function(t){Object.keys(t).forEach((function(e){o.config[e]=t[e]}))},o.Update=function(){if(void 0!==o.config.board){var t=o.config.board.getContext("2d");t.clearRect(0,0,o.config.board.width,o.config.board.height),void 0!==o.Container.Components.TilesheetComponent&&Object.keys(o.Container.Components.TilesheetComponent).forEach((function(t){var e=o.Container.Components.TilesheetComponent[t];void 0===o.tilesheets[e.url]&&(o.tilesheets[e.url]=new f(o.config.board,e.url,e.width,e.height),o.Container.Entity(t).destroy())})),void 0!==o.Container.Components.TileComponent&&Object.keys(o.Container.Components.TileComponent).forEach((function(t){var e=o.Container.Components.TileComponent[t],n=o.Container.Components.PositionComponent[t];o.tilesheets[e.tilesheet].draw(e.x,e.y,n.x*e.width,n.y*e.height,e.options)})),void 0!==o.Container.Components.StaticSpriteComponent&&Object.keys(o.Container.Components.StaticSpriteComponent).forEach((function(t){var e=o.Container.Components.StaticSpriteComponent[t],n=o.Container.Components.PositionComponent[t];e.sprite&&e.sprite.draw(0,0,n.x,n.y,e.options)})),void 0!==o.Container.Components.SpriteComponent&&Object.keys(o.Container.Components.SpriteComponent).forEach((function(t){var e=o.Container.Components.SpriteComponent[t],n=o.Container.Components.PositionComponent[t];e.sprite&&e.sprite.animate(e.animation,e.direction,n.x,n.y,{})})),void 0!==o.Container.Components.PolygonComponent&&Object.keys(o.Container.Components.PolygonComponent).forEach((function(e){var n=o.Container.Components.PolygonComponent[e],i=o.Container.Components.PositionComponent[e];t.strokeStyle="#0f0",t.beginPath(),t.moveTo(i.x,i.y),n.points.forEach((function(e){var n=parseInt(e.x)+parseInt(i.x),o=parseInt(e.y)+parseInt(i.y);t.lineTo(n,o)})),t.lineTo(i.x,i.y),t.closePath(),t.stroke()})),void 0!==o.Container.Components.PolylineComponent&&Object.keys(o.Container.Components.PolylineComponent).forEach((function(e){var n=o.Container.Components.PolylineComponent[e],i=o.Container.Components.PositionComponent[e];t.strokeStyle="#f00",t.beginPath(),t.moveTo(i.x,i.y),n.points.forEach((function(e){var n=parseInt(e.x)+parseInt(i.x),o=parseInt(e.y)+parseInt(i.y);t.lineTo(n,o)})),t.lineTo(i.x,i.y),t.closePath(),t.stroke()}))}},o.Handle="DrawingSystem",o.tilesheets={},o}return n}(u.System),k=n(28),S=function t(e){Object(s.a)(this,t);for(var n=0;n<e.attributes.length;n++){var o=e.attributes[n].name,i=e.attributes[n].textContent;this[o]=i}this.objects=[];for(var a=0;a<e.childNodes.length;a++){var r=e.childNodes[a].nodeName;switch(r){case"object":this.objects.push(new E(e.childNodes[a]));break;case"#text":break;default:console.log("ObjectGroup: Unknown node "+r)}}},E=function t(e){Object(s.a)(this,t);for(var n=0;n<e.attributes.length;n++){var o=e.attributes[n].name,i=e.attributes[n].textContent;this[o]=i}for(var a=0;a<e.childNodes.length;a++){var r=e.childNodes[a].nodeName;switch(r){case"polyline":this.polyline=new P(e.childNodes[a]);break;case"polygon":this.polygon=new N(e.childNodes[a]);break;case"properties":this.properties=new M(e.childNodes[a]);break;case"#text":break;default:console.log("TMX_Object: Unknown node "+r)}}},N=function t(e){var n=this;Object(s.a)(this,t),this.points=[];for(var o={},i=0;i<e.attributes.length;i++){var a=e.attributes[i].name,r=e.attributes[i].textContent;o[a]=r}void 0!==o.points&&o.points.split(" ").forEach((function(t){var e=t.split(","),o=Object(m.a)(e,2),i=o[0],a=o[1];n.points.push({x:i-0,y:a-0})}))},P=function t(e){Object(s.a)(this,t),this.points=new N(e).points},T=function t(e){Object(s.a)(this,t);for(var n=0;n<e.childNodes.length;n++){var o=e.childNodes[n].nodeName;switch(o){case"property":for(var i=e.childNodes[n].attributes,a=0;a<i.length;a++){var r=i[a].name,c=i[a].textContent;this[r]=c}break;case"#text":break;default:console.log("Unknown node "+o)}}},M=function t(e){Object(s.a)(this,t);for(var n=0;n<e.childNodes.length;n++){var o=e.childNodes[n].nodeName;switch(o){case"property":for(var i=e.childNodes[n].attributes,a="",r="",c=0;c<i.length;c++)"name"===i[c].name&&(a=i[c].textContent),"value"===i[c].name&&(r=i[c].textContent);this[a]=r;break;case"#text":break;default:console.log("Unknown node "+o)}}},I=function t(e){Object(s.a)(this,t);for(var n=0;n<e.attributes.length;n++){var o=e.attributes[n].name,i=e.attributes[n].textContent;this[o]=i}for(var a=0;a<e.childNodes.length;a++){var r=e.childNodes[a].nodeName;switch(r){case"properties":this.properties=new T(e.childNodes[a]);break;case"image":this.image=new W(e.childNodes[a]);break;case"#text":break;default:console.log("Tileset: Unknown node "+r)}}},H=function t(e){Object(s.a)(this,t);for(var n=0;n<e.attributes.length;n++){var o=e.attributes[n].name,i=e.attributes[n].textContent;this[o]=i}for(var a=0;a<e.childNodes.length;a++){var r=e.childNodes[a].nodeName;switch(r){case"#text":break;case"data":this.tiles=new z(e.childNodes[a]).tiles;break;case"properties":this.properties=new T(e.childNodes[a]);break;default:console.log("Layer: Unknown node "+r)}}},z=function t(e){Object(s.a)(this,t);for(var n=0;n<e.attributes.length;n++){var o=e.attributes[n].name,i=e.attributes[n].textContent;this[o]=i}var a=atob(e.innerHTML),r=k.inflate(a);this.tiles=[];for(var c=0;c<r.length;c+=4){var l=(r[c+3]<<24)+(r[c+2]<<16)+(r[c+1]<<8)+r[c+0],h={};2147483648&l&&(h.flipHorizontal=!0,l^=2147483648),1073741824&l&&(h.flipVertical=!0,l^=1073741824),536870912&l&&(h.flipDiagonal=!0,l^=536870912),h.id=l-1,this.tiles.push(h)}},W=function t(e){Object(s.a)(this,t);for(var n=0;n<e.attributes.length;n++){var o=e.attributes[n].name,i=e.attributes[n].textContent;this[o]=i}},U=function t(e){var n=this;Object(s.a)(this,t),fetch(e).then((function(t){return t.text()})).then((function(t){for(var e=(new DOMParser).parseFromString(t,"text/xml").getElementsByTagName("map")[0],o=0;o<e.attributes.length;o++){var i=e.attributes[o].name,a=e.attributes[o].textContent;"version"!==i&&(n[i]=a)}n.tilesets=[],n.layers=[],n.objectgroups=[];for(var r=0;r<e.childNodes.length;r++){var s=e.childNodes[r].nodeName;switch(s){case"properties":n.properties=new M(e.childNodes[r]);break;case"tileset":n.tilesets.push(new I(e.childNodes[r]));break;case"layer":n.layers.push(new H(e.childNodes[r]));break;case"objectgroup":n.objectgroups.push(new S(e.childNodes[r]));break;case"#text":break;default:console.log("Unknown node "+s)}}}))},B=n(18),D=n(1),V=new u.Manager,F="https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master",L=F+"/src/images/characters/",A=["abed","britta","chang","duncan","garrett","guzman","leonard","rich","troy","vicedean","annie","buddy","dean","fatneil","gilbert","jeff","pierce","shirley","vaughn","vicki"],R=function(t){Object(l.a)(n,t);var e=Object(h.a)(n);function n(t){var o;return Object(s.a)(this,n),(o=e.call(this,t)).componentDidMount=function(){o.handleResize(),fetch("https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master/src/character_map.json").then((function(t){return t.json()})).then((function(t){o.setState({characterMap:t},(function(){o.initializeMap()}))})),A.forEach((function(t){fetch("https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master/src/characters/"+t+".json").then((function(t){return t.json()})).then((function(e){var n=Object.assign({},o.state.characters);n[t]=e,o.setState({characters:n})}))}))},o.handleResize=function(){var t=window.innerWidth,e=window.innerHeight;null!==o.state.drawingSystem&&o.state.drawingSystem.ConfigUpdate({height:e,width:t,board:document.getElementById("board")})},o.initializeMap=function(){var t=new U(F+"/src/maps/"+o.state.map+".tmx");setTimeout((function(){var e=document.getElementById("board");if(e.width=t.width*t.tilewidth,e.height=t.height*t.tileheight,o.state.drawingSystem.ConfigUpdate({width:e.width,height:e.height}),console.log(t),void 0!==t.properties.soundtrack){var n=t.properties.soundtrack,i="";i=-1!==n.search("ogg")?F+"/src/"+n:"https://raw.githubusercontent.com/hawkthorne/hawkthorne-journey/master/src/audio/music/"+t.properties.soundtrack+".ogg",o.setState({music:i}),document.getElementById("rap").play()}else document.getElementById("rap").pause(),o.setState({music:""});t.layers.forEach((function(e){o.buildLayer(e,t.tilesets[0])})),t.objectgroups.forEach((function(t){t.objects.forEach((function(t){o.buildObject(t)}))})),console.log(o.world)}),500)},o.initializePlayer=function(){var t=document.getElementById("board"),e=L+o.state.playerCharacter+"/"+o.state.playerCostume+".png",n=o.world.Entity("player");n.Component(new w(o.state.levelStart)),n.Component(new g({canvas:t,url:e,width:48,height:48,characterMap:o.state.characterMap,animation:o.state.animation,direction:o.state.direction}))},o.initializeCharacters=function(){var t=document.getElementById("board"),e=50,n=200;A.forEach((function(i){var a=L+i+"/base.png",r=o.world.Entity();r.Component(new w({x:e,y:n})),r.Component(new g({canvas:t,url:a,width:48,height:48,characterMap:o.state.characterMap,animation:o.state.animation,direction:o.state.direction})),(e+=50)>450&&(e=0,n+=50)}))},o.buildObject=function(t){if("sprite"!==t.type){if("door"===t.type){if("main"!==t.name)return;o.setState({levelStart:{x:t.x-0,y:t.y-0}},(function(){o.initializePlayer()}))}void 0===t.polygon?void 0===t.polyline||o.buildPolyline(t):o.buildPolygon(t)}else o.buildSprite(t)},o.buildPolygon=function(t){var e=o.world.Entity();e.Component(new w({x:t.x,y:t.y})),e.Component(new j({points:t.polygon.points}))},o.buildPolyline=function(t){var e=o.world.Entity();e.Component(new w({x:t.x,y:t.y})),e.Component(new x({points:t.polyline.points}))},o.buildSprite=function(t){var e=F+"/src/"+t.properties.sheet,n=o.world.Entity();n.Component(new w({x:t.x,y:t.y}));var i={flipHorizontal:"true"===t.properties.flip};n.Component(new v({canvas:document.getElementById("board"),url:e,width:t.properties.width,height:t.properties.height,x:t.x,y:t.y,options:i}))},o.buildLayer=function(t,e){var n=F+"/src/images/"+e.image.source,i=e.tilewidth,a=e.tileheight,r=e.image.width/i,s=o.world.Entity();s.Component(new y({url:n,width:i,height:a}));for(var c=t.width,l=t.height,h=0,p=0;p<l;p++)for(var d=0;d<c;d++){var u=t.tiles[h].id;if(-1!==u){var m=u%r,f=(u-m)/r,b={};!0===t.tiles[h].flipHorizontal&&(b.flipHorizontal=!0),!0===t.tiles[h].flipVertical&&(b.flipVertical=!0),!0===t.tiles[h].flipDiagonal&&(b.flipDiagonal=!0),(s=o.world.Entity()).Component(new w({x:d,y:p})),s.Component(new C({tilesheet:n,width:i,height:a,x:m,y:f,options:b})),h++}else h++}},o.changeAnimation=function(t){o.setState({animation:t.target.value},(function(){o.updateSpriteComponent()}))},o.changeDirection=function(t){o.setState({direction:t.target.value},(function(){o.updateSpriteComponent()}))},o.updateSpriteComponent=function(){Object.keys(o.world.Components.SpriteComponent).forEach((function(t){o.world.Components.SpriteComponent[t].animation=o.state.animation,o.world.Components.SpriteComponent[t].direction=o.state.direction}))},o.destroyMap=function(){Object.keys(o.world.Components.TileComponent).forEach((function(t){o.world.Entity(t).destroy()})),Object.keys(o.world.Components.StaticSpriteComponent).forEach((function(t){o.world.Entity(t).destroy()})),Object.keys(o.world.Components.PolygonComponent).forEach((function(t){o.world.Entity(t).destroy()})),void 0!==o.world.Components.PolylineComponent&&Object.keys(o.world.Components.PolylineComponent).forEach((function(t){o.world.Entity(t).destroy()}))},o.changeMap=function(t){o.destroyMap(),o.setState({map:t.target.value},(function(){o.initializeMap()}))},o.volume=function(t){o.setState({volume:t.target.volume})},o.state={music:"",volume:.25,map:"studyroom",animation:"idle",direction:"right",characterMap:{},characters:{},drawingSystem:new O({width:window.innerWidth,height:window.innerHeight}),levelStart:{x:0,y:0},playerCharacter:"annie",playerCostume:"santa"},o.world=V.Container(),o.world.System(o.state.drawingSystem),o.world.Start(250),o}return Object(c.a)(n,[{key:"render",value:function(){return Object(D.jsxs)("div",{children:[Object(D.jsx)("canvas",{id:"board",width:"1280",height:"720"}),Object(D.jsxs)("div",{style:{float:"right"},children:[Object(D.jsx)("label",{htmlFor:"map",children:"Choose map:"}),Object(D.jsx)("br",{}),Object(D.jsx)("select",{id:"map",defaultValue:this.state.map,onChange:this.changeMap,children:B.map((function(t,e){return Object(D.jsx)("option",{children:t},e)}))}),Object(D.jsx)("br",{}),Object(D.jsx)("br",{}),Object(D.jsx)("label",{htmlFor:"animation",children:"Choose animation:"}),Object(D.jsx)("br",{}),Object(D.jsx)("select",{id:"animation",defaultValue:this.state.animation,onChange:this.changeAnimation,children:Object.keys(this.state.characterMap).map((function(t,e){return Object(D.jsx)("option",{children:t},e)}))}),Object(D.jsx)("br",{}),Object(D.jsx)("br",{}),Object(D.jsx)("label",{htmlFor:"direction",children:"Choose direction:"}),Object(D.jsx)("br",{}),Object(D.jsxs)("select",{id:"direction",defaultValue:this.state.direction,onChange:this.changeDirection,children:[Object(D.jsx)("option",{value:"left",children:"Left"}),Object(D.jsx)("option",{value:"right",children:"Right"})]}),Object(D.jsx)("br",{}),Object(D.jsx)("br",{}),Object(D.jsx)(d.a,{id:"rap",src:this.state.music,loop:!0,controls:!0,onVolumeChanged:this.volume,volume:this.state.volume})]})]})}}]),n}(o.Component),J=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,39)).then((function(e){var n=e.getCLS,o=e.getFID,i=e.getFCP,a=e.getLCP,r=e.getTTFB;n(t),o(t),i(t),a(t),r(t)}))};r.a.render(Object(D.jsx)(i.a.StrictMode,{children:Object(D.jsx)(R,{})}),document.getElementById("root")),J()}},[[38,1,2]]]);
//# sourceMappingURL=main.fdc0bdab.chunk.js.map