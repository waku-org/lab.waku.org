(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[421],{4033:function(e,t,n){e.exports=n(94)},7660:function(e,t,n){"use strict";let r,i,o,l,c,s,u,a,d,p,b,y,h,f,m,g,k,w,T,E,I,L,D,C,R,A,U,S,P,v,_,N,B,O,q,F,X,Y;n.d(t,{UF:function(){return tW},Mf:function(){return tV},oQ:function(){return tP}});var K,$,G,V,x,W,z,M,H,j,J,Q,Z,ee,et,en,er,ei,eo,el,ec,es,eu,ea,ed,ep,eb,ey,eh,ef,em,eg,ek,ew,eT,eE,eI,eL,eD,eC,eR,eA,eU,eS,eP,ev,e_,eN,eB,eO,eq,eF,eX,eY,eK,e$,eG,eV,ex,eW,ez,eM,eH,ej,eJ,eQ,eZ,e0,e2,e3,e1,e8,e6,e4,e7,e5,e9,te,tt,tn,tr,ti,to=n(6995);(K=eP||(eP={})).codec=()=>(null==r&&(r=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.proof&&e.proof.byteLength>0&&(t.uint32(10),t.bytes(e.proof)),null!=e.merkleRoot&&e.merkleRoot.byteLength>0&&(t.uint32(18),t.bytes(e.merkleRoot)),null!=e.epoch&&e.epoch.byteLength>0&&(t.uint32(26),t.bytes(e.epoch)),null!=e.shareX&&e.shareX.byteLength>0&&(t.uint32(34),t.bytes(e.shareX)),null!=e.shareY&&e.shareY.byteLength>0&&(t.uint32(42),t.bytes(e.shareY)),null!=e.nullifier&&e.nullifier.byteLength>0&&(t.uint32(50),t.bytes(e.nullifier)),null!=e.rlnIdentifier&&e.rlnIdentifier.byteLength>0&&(t.uint32(58),t.bytes(e.rlnIdentifier)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={proof:new Uint8Array(0),merkleRoot:new Uint8Array(0),epoch:new Uint8Array(0),shareX:new Uint8Array(0),shareY:new Uint8Array(0),nullifier:new Uint8Array(0),rlnIdentifier:new Uint8Array(0)},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.proof=e.bytes();break;case 2:n.merkleRoot=e.bytes();break;case 3:n.epoch=e.bytes();break;case 4:n.shareX=e.bytes();break;case 5:n.shareY=e.bytes();break;case 6:n.nullifier=e.bytes();break;case 7:n.rlnIdentifier=e.bytes();break;default:e.skipType(7&t)}}return n})),r),K.encode=e=>(0,to.LE)(e,K.codec()),K.decode=e=>(0,to.C6)(e,K.codec()),($=ev||(ev={})).codec=()=>(null==i&&(i=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.payload&&e.payload.byteLength>0&&(t.uint32(10),t.bytes(e.payload)),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(18),t.string(e.contentTopic)),null!=e.version&&(t.uint32(24),t.uint32(e.version)),null!=e.timestamp&&(t.uint32(80),t.sint64(e.timestamp)),null!=e.meta&&(t.uint32(90),t.bytes(e.meta)),null!=e.rateLimitProof&&(t.uint32(170),eP.codec().encode(e.rateLimitProof,t)),null!=e.ephemeral&&(t.uint32(248),t.bool(e.ephemeral)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={payload:new Uint8Array(0),contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.payload=e.bytes();break;case 2:n.contentTopic=e.string();break;case 3:n.version=e.uint32();break;case 10:n.timestamp=e.sint64();break;case 11:n.meta=e.bytes();break;case 21:n.rateLimitProof=eP.codec().decode(e,e.uint32());break;case 31:n.ephemeral=e.bool();break;default:e.skipType(7&t)}}return n})),i),$.encode=e=>(0,to.LE)(e,$.codec()),$.decode=e=>(0,to.C6)(e,$.codec()),(V=(G=e_||(e_={})).ContentFilter||(G.ContentFilter={})).codec=()=>(null==l&&(l=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(10),t.string(e.contentTopic)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();t>>>3==1?n.contentTopic=e.string():e.skipType(7&t)}return n})),l),V.encode=e=>(0,to.LE)(e,V.codec()),V.decode=e=>(0,to.C6)(e,V.codec()),G.codec=()=>(null==o&&(o=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.subscribe&&!1!==e.subscribe&&(t.uint32(8),t.bool(e.subscribe)),null!=e.topic&&""!==e.topic&&(t.uint32(18),t.string(e.topic)),null!=e.contentFilters)for(let n of e.contentFilters)t.uint32(26),G.ContentFilter.codec().encode(n,t);!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={subscribe:!1,topic:"",contentFilters:[]},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.subscribe=e.bool();break;case 2:n.topic=e.string();break;case 3:n.contentFilters.push(G.ContentFilter.codec().decode(e,e.uint32()));break;default:e.skipType(7&t)}}return n})),o),G.encode=e=>(0,to.LE)(e,G.codec()),G.decode=e=>(0,to.C6)(e,G.codec()),(x=eN||(eN={})).codec=()=>(null==c&&(c=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.messages)for(let n of e.messages)t.uint32(10),eq.codec().encode(n,t);!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={messages:[]},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();t>>>3==1?n.messages.push(eq.codec().decode(e,e.uint32())):e.skipType(7&t)}return n})),c),x.encode=e=>(0,to.LE)(e,x.codec()),x.decode=e=>(0,to.C6)(e,x.codec()),(W=eB||(eB={})).codec=()=>(null==s&&(s=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.requestId&&""!==e.requestId&&(t.uint32(10),t.string(e.requestId)),null!=e.request&&(t.uint32(18),e_.codec().encode(e.request,t)),null!=e.push&&(t.uint32(26),eN.codec().encode(e.push,t)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={requestId:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.requestId=e.string();break;case 2:n.request=e_.codec().decode(e,e.uint32());break;case 3:n.push=eN.codec().decode(e,e.uint32());break;default:e.skipType(7&t)}}return n})),s),W.encode=e=>(0,to.LE)(e,W.codec()),W.decode=e=>(0,to.C6)(e,W.codec()),(z=eO||(eO={})).codec=()=>(null==u&&(u=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.proof&&e.proof.byteLength>0&&(t.uint32(10),t.bytes(e.proof)),null!=e.merkleRoot&&e.merkleRoot.byteLength>0&&(t.uint32(18),t.bytes(e.merkleRoot)),null!=e.epoch&&e.epoch.byteLength>0&&(t.uint32(26),t.bytes(e.epoch)),null!=e.shareX&&e.shareX.byteLength>0&&(t.uint32(34),t.bytes(e.shareX)),null!=e.shareY&&e.shareY.byteLength>0&&(t.uint32(42),t.bytes(e.shareY)),null!=e.nullifier&&e.nullifier.byteLength>0&&(t.uint32(50),t.bytes(e.nullifier)),null!=e.rlnIdentifier&&e.rlnIdentifier.byteLength>0&&(t.uint32(58),t.bytes(e.rlnIdentifier)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={proof:new Uint8Array(0),merkleRoot:new Uint8Array(0),epoch:new Uint8Array(0),shareX:new Uint8Array(0),shareY:new Uint8Array(0),nullifier:new Uint8Array(0),rlnIdentifier:new Uint8Array(0)},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.proof=e.bytes();break;case 2:n.merkleRoot=e.bytes();break;case 3:n.epoch=e.bytes();break;case 4:n.shareX=e.bytes();break;case 5:n.shareY=e.bytes();break;case 6:n.nullifier=e.bytes();break;case 7:n.rlnIdentifier=e.bytes();break;default:e.skipType(7&t)}}return n})),u),z.encode=e=>(0,to.LE)(e,z.codec()),z.decode=e=>(0,to.C6)(e,z.codec()),(M=eq||(eq={})).codec=()=>(null==a&&(a=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.payload&&e.payload.byteLength>0&&(t.uint32(10),t.bytes(e.payload)),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(18),t.string(e.contentTopic)),null!=e.version&&(t.uint32(24),t.uint32(e.version)),null!=e.timestamp&&(t.uint32(80),t.sint64(e.timestamp)),null!=e.meta&&(t.uint32(90),t.bytes(e.meta)),null!=e.rateLimitProof&&(t.uint32(170),eO.codec().encode(e.rateLimitProof,t)),null!=e.ephemeral&&(t.uint32(248),t.bool(e.ephemeral)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={payload:new Uint8Array(0),contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.payload=e.bytes();break;case 2:n.contentTopic=e.string();break;case 3:n.version=e.uint32();break;case 10:n.timestamp=e.sint64();break;case 11:n.meta=e.bytes();break;case 21:n.rateLimitProof=eO.codec().decode(e,e.uint32());break;case 31:n.ephemeral=e.bool();break;default:e.skipType(7&t)}}return n})),a),M.encode=e=>(0,to.LE)(e,M.codec()),M.decode=e=>(0,to.C6)(e,M.codec()),(H=eF||(eF={})).codec=()=>(null==d&&(d=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(18),t.string(e.contentTopic)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();t>>>3==2?n.contentTopic=e.string():e.skipType(7&t)}return n})),d),H.encode=e=>(0,to.LE)(e,H.codec()),H.decode=e=>(0,to.C6)(e,H.codec()),(J=p=(j=eX||(eX={})).FilterSubscribeType||(j.FilterSubscribeType={})).SUBSCRIBER_PING="SUBSCRIBER_PING",J.SUBSCRIBE="SUBSCRIBE",J.UNSUBSCRIBE="UNSUBSCRIBE",J.UNSUBSCRIBE_ALL="UNSUBSCRIBE_ALL",(Q=b||(b={}))[Q.SUBSCRIBER_PING=0]="SUBSCRIBER_PING",Q[Q.SUBSCRIBE=1]="SUBSCRIBE",Q[Q.UNSUBSCRIBE=2]="UNSUBSCRIBE",Q[Q.UNSUBSCRIBE_ALL=3]="UNSUBSCRIBE_ALL",(p=j.FilterSubscribeType||(j.FilterSubscribeType={})).codec=()=>(0,to.Ji)(b),j.codec=()=>(null==y&&(y=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.requestId&&""!==e.requestId&&(t.uint32(10),t.string(e.requestId)),null!=e.filterSubscribeType&&0!==b[e.filterSubscribeType]&&(t.uint32(16),j.FilterSubscribeType.codec().encode(e.filterSubscribeType,t)),null!=e.pubsubTopic&&(t.uint32(82),t.string(e.pubsubTopic)),null!=e.contentTopics)for(let n of e.contentTopics)t.uint32(90),t.string(n);!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={requestId:"",filterSubscribeType:p.SUBSCRIBER_PING,contentTopics:[]},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.requestId=e.string();break;case 2:n.filterSubscribeType=j.FilterSubscribeType.codec().decode(e);break;case 10:n.pubsubTopic=e.string();break;case 11:n.contentTopics.push(e.string());break;default:e.skipType(7&t)}}return n})),y),j.encode=e=>(0,to.LE)(e,j.codec()),j.decode=e=>(0,to.C6)(e,j.codec()),(Z=eY||(eY={})).codec=()=>(null==h&&(h=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.requestId&&""!==e.requestId&&(t.uint32(10),t.string(e.requestId)),null!=e.statusCode&&0!==e.statusCode&&(t.uint32(80),t.uint32(e.statusCode)),null!=e.statusDesc&&(t.uint32(90),t.string(e.statusDesc)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={requestId:"",statusCode:0},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.requestId=e.string();break;case 10:n.statusCode=e.uint32();break;case 11:n.statusDesc=e.string();break;default:e.skipType(7&t)}}return n})),h),Z.encode=e=>(0,to.LE)(e,Z.codec()),Z.decode=e=>(0,to.C6)(e,Z.codec()),(ee=eK||(eK={})).codec=()=>(null==f&&(f=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.wakuMessage&&(t.uint32(10),eG.codec().encode(e.wakuMessage,t)),null!=e.pubsubTopic&&(t.uint32(18),t.string(e.pubsubTopic)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.wakuMessage=eG.codec().decode(e,e.uint32());break;case 2:n.pubsubTopic=e.string();break;default:e.skipType(7&t)}}return n})),f),ee.encode=e=>(0,to.LE)(e,ee.codec()),ee.decode=e=>(0,to.C6)(e,ee.codec()),(et=e$||(e$={})).codec=()=>(null==m&&(m=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.proof&&e.proof.byteLength>0&&(t.uint32(10),t.bytes(e.proof)),null!=e.merkleRoot&&e.merkleRoot.byteLength>0&&(t.uint32(18),t.bytes(e.merkleRoot)),null!=e.epoch&&e.epoch.byteLength>0&&(t.uint32(26),t.bytes(e.epoch)),null!=e.shareX&&e.shareX.byteLength>0&&(t.uint32(34),t.bytes(e.shareX)),null!=e.shareY&&e.shareY.byteLength>0&&(t.uint32(42),t.bytes(e.shareY)),null!=e.nullifier&&e.nullifier.byteLength>0&&(t.uint32(50),t.bytes(e.nullifier)),null!=e.rlnIdentifier&&e.rlnIdentifier.byteLength>0&&(t.uint32(58),t.bytes(e.rlnIdentifier)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={proof:new Uint8Array(0),merkleRoot:new Uint8Array(0),epoch:new Uint8Array(0),shareX:new Uint8Array(0),shareY:new Uint8Array(0),nullifier:new Uint8Array(0),rlnIdentifier:new Uint8Array(0)},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.proof=e.bytes();break;case 2:n.merkleRoot=e.bytes();break;case 3:n.epoch=e.bytes();break;case 4:n.shareX=e.bytes();break;case 5:n.shareY=e.bytes();break;case 6:n.nullifier=e.bytes();break;case 7:n.rlnIdentifier=e.bytes();break;default:e.skipType(7&t)}}return n})),m),et.encode=e=>(0,to.LE)(e,et.codec()),et.decode=e=>(0,to.C6)(e,et.codec()),(en=eG||(eG={})).codec=()=>(null==g&&(g=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.payload&&e.payload.byteLength>0&&(t.uint32(10),t.bytes(e.payload)),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(18),t.string(e.contentTopic)),null!=e.version&&(t.uint32(24),t.uint32(e.version)),null!=e.timestamp&&(t.uint32(80),t.sint64(e.timestamp)),null!=e.meta&&(t.uint32(90),t.bytes(e.meta)),null!=e.rateLimitProof&&(t.uint32(170),e$.codec().encode(e.rateLimitProof,t)),null!=e.ephemeral&&(t.uint32(248),t.bool(e.ephemeral)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={payload:new Uint8Array(0),contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.payload=e.bytes();break;case 2:n.contentTopic=e.string();break;case 3:n.version=e.uint32();break;case 10:n.timestamp=e.sint64();break;case 11:n.meta=e.bytes();break;case 21:n.rateLimitProof=e$.codec().decode(e,e.uint32());break;case 31:n.ephemeral=e.bool();break;default:e.skipType(7&t)}}return n})),g),en.encode=e=>(0,to.LE)(e,en.codec()),en.decode=e=>(0,to.C6)(e,en.codec()),(er=eV||(eV={})).codec=()=>(null==k&&(k=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.pubsubTopic&&""!==e.pubsubTopic&&(t.uint32(10),t.string(e.pubsubTopic)),null!=e.message&&(t.uint32(18),eM.codec().encode(e.message,t)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={pubsubTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.pubsubTopic=e.string();break;case 2:n.message=eM.codec().decode(e,e.uint32());break;default:e.skipType(7&t)}}return n})),k),er.encode=e=>(0,to.LE)(e,er.codec()),er.decode=e=>(0,to.C6)(e,er.codec()),(ei=ex||(ex={})).codec=()=>(null==w&&(w=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.isSuccess&&!1!==e.isSuccess&&(t.uint32(8),t.bool(e.isSuccess)),null!=e.info&&(t.uint32(18),t.string(e.info)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={isSuccess:!1},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.isSuccess=e.bool();break;case 2:n.info=e.string();break;default:e.skipType(7&t)}}return n})),w),ei.encode=e=>(0,to.LE)(e,ei.codec()),ei.decode=e=>(0,to.C6)(e,ei.codec()),(eo=eW||(eW={})).codec=()=>(null==T&&(T=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.requestId&&""!==e.requestId&&(t.uint32(10),t.string(e.requestId)),null!=e.request&&(t.uint32(18),eV.codec().encode(e.request,t)),null!=e.response&&(t.uint32(26),ex.codec().encode(e.response,t)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={requestId:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.requestId=e.string();break;case 2:n.request=eV.codec().decode(e,e.uint32());break;case 3:n.response=ex.codec().decode(e,e.uint32());break;default:e.skipType(7&t)}}return n})),T),eo.encode=e=>(0,to.LE)(e,eo.codec()),eo.decode=e=>(0,to.C6)(e,eo.codec()),(el=ez||(ez={})).codec=()=>(null==E&&(E=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.proof&&e.proof.byteLength>0&&(t.uint32(10),t.bytes(e.proof)),null!=e.merkleRoot&&e.merkleRoot.byteLength>0&&(t.uint32(18),t.bytes(e.merkleRoot)),null!=e.epoch&&e.epoch.byteLength>0&&(t.uint32(26),t.bytes(e.epoch)),null!=e.shareX&&e.shareX.byteLength>0&&(t.uint32(34),t.bytes(e.shareX)),null!=e.shareY&&e.shareY.byteLength>0&&(t.uint32(42),t.bytes(e.shareY)),null!=e.nullifier&&e.nullifier.byteLength>0&&(t.uint32(50),t.bytes(e.nullifier)),null!=e.rlnIdentifier&&e.rlnIdentifier.byteLength>0&&(t.uint32(58),t.bytes(e.rlnIdentifier)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={proof:new Uint8Array(0),merkleRoot:new Uint8Array(0),epoch:new Uint8Array(0),shareX:new Uint8Array(0),shareY:new Uint8Array(0),nullifier:new Uint8Array(0),rlnIdentifier:new Uint8Array(0)},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.proof=e.bytes();break;case 2:n.merkleRoot=e.bytes();break;case 3:n.epoch=e.bytes();break;case 4:n.shareX=e.bytes();break;case 5:n.shareY=e.bytes();break;case 6:n.nullifier=e.bytes();break;case 7:n.rlnIdentifier=e.bytes();break;default:e.skipType(7&t)}}return n})),E),el.encode=e=>(0,to.LE)(e,el.codec()),el.decode=e=>(0,to.C6)(e,el.codec()),(ec=eM||(eM={})).codec=()=>(null==I&&(I=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.payload&&e.payload.byteLength>0&&(t.uint32(10),t.bytes(e.payload)),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(18),t.string(e.contentTopic)),null!=e.version&&(t.uint32(24),t.uint32(e.version)),null!=e.timestamp&&(t.uint32(80),t.sint64(e.timestamp)),null!=e.meta&&(t.uint32(90),t.bytes(e.meta)),null!=e.rateLimitProof&&(t.uint32(170),ez.codec().encode(e.rateLimitProof,t)),null!=e.ephemeral&&(t.uint32(248),t.bool(e.ephemeral)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={payload:new Uint8Array(0),contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.payload=e.bytes();break;case 2:n.contentTopic=e.string();break;case 3:n.version=e.uint32();break;case 10:n.timestamp=e.sint64();break;case 11:n.meta=e.bytes();break;case 21:n.rateLimitProof=ez.codec().decode(e,e.uint32());break;case 31:n.ephemeral=e.bool();break;default:e.skipType(7&t)}}return n})),I),ec.encode=e=>(0,to.LE)(e,ec.codec()),ec.decode=e=>(0,to.C6)(e,ec.codec()),(es=eH||(eH={})).codec=()=>(null==L&&(L=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.digest&&e.digest.byteLength>0&&(t.uint32(10),t.bytes(e.digest)),null!=e.receiverTime&&0n!==e.receiverTime&&(t.uint32(16),t.sint64(e.receiverTime)),null!=e.senderTime&&0n!==e.senderTime&&(t.uint32(24),t.sint64(e.senderTime)),null!=e.pubsubTopic&&""!==e.pubsubTopic&&(t.uint32(34),t.string(e.pubsubTopic)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={digest:new Uint8Array(0),receiverTime:0n,senderTime:0n,pubsubTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.digest=e.bytes();break;case 2:n.receiverTime=e.sint64();break;case 3:n.senderTime=e.sint64();break;case 4:n.pubsubTopic=e.string();break;default:e.skipType(7&t)}}return n})),L),es.encode=e=>(0,to.LE)(e,es.codec()),es.decode=e=>(0,to.C6)(e,es.codec()),(ea=(eu=ej||(ej={})).Direction||(eu.Direction={})).BACKWARD="BACKWARD",ea.FORWARD="FORWARD",(ed=D||(D={}))[ed.BACKWARD=0]="BACKWARD",ed[ed.FORWARD=1]="FORWARD",(eu.Direction||(eu.Direction={})).codec=()=>(0,to.Ji)(D),eu.codec=()=>(null==C&&(C=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.pageSize&&(t.uint32(8),t.uint64(e.pageSize)),null!=e.cursor&&(t.uint32(18),eH.codec().encode(e.cursor,t)),null!=e.direction&&(t.uint32(24),eu.Direction.codec().encode(e.direction,t)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.pageSize=e.uint64();break;case 2:n.cursor=eH.codec().decode(e,e.uint32());break;case 3:n.direction=eu.Direction.codec().decode(e);break;default:e.skipType(7&t)}}return n})),C),eu.encode=e=>(0,to.LE)(e,eu.codec()),eu.decode=e=>(0,to.C6)(e,eu.codec()),(ep=eJ||(eJ={})).codec=()=>(null==R&&(R=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(10),t.string(e.contentTopic)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();t>>>3==1?n.contentTopic=e.string():e.skipType(7&t)}return n})),R),ep.encode=e=>(0,to.LE)(e,ep.codec()),ep.decode=e=>(0,to.C6)(e,ep.codec()),(eb=eQ||(eQ={})).codec=()=>(null==A&&(A=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.pubsubTopic&&(t.uint32(18),t.string(e.pubsubTopic)),null!=e.contentFilters)for(let n of e.contentFilters)t.uint32(26),eJ.codec().encode(n,t);null!=e.pagingInfo&&(t.uint32(34),ej.codec().encode(e.pagingInfo,t)),null!=e.startTime&&(t.uint32(40),t.sint64(e.startTime)),null!=e.endTime&&(t.uint32(48),t.sint64(e.endTime)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={contentFilters:[]},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 2:n.pubsubTopic=e.string();break;case 3:n.contentFilters.push(eJ.codec().decode(e,e.uint32()));break;case 4:n.pagingInfo=ej.codec().decode(e,e.uint32());break;case 5:n.startTime=e.sint64();break;case 6:n.endTime=e.sint64();break;default:e.skipType(7&t)}}return n})),A),eb.encode=e=>(0,to.LE)(e,eb.codec()),eb.decode=e=>(0,to.C6)(e,eb.codec()),(eh=U=(ey=eZ||(eZ={})).HistoryError||(ey.HistoryError={})).NONE="NONE",eh.INVALID_CURSOR="INVALID_CURSOR",(ef=S||(S={}))[ef.NONE=0]="NONE",ef[ef.INVALID_CURSOR=1]="INVALID_CURSOR",(U=ey.HistoryError||(ey.HistoryError={})).codec=()=>(0,to.Ji)(S),ey.codec=()=>(null==P&&(P=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.messages)for(let n of e.messages)t.uint32(18),e3.codec().encode(n,t);null!=e.pagingInfo&&(t.uint32(26),ej.codec().encode(e.pagingInfo,t)),null!=e.error&&0!==S[e.error]&&(t.uint32(32),ey.HistoryError.codec().encode(e.error,t)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={messages:[],error:U.NONE},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 2:n.messages.push(e3.codec().decode(e,e.uint32()));break;case 3:n.pagingInfo=ej.codec().decode(e,e.uint32());break;case 4:n.error=ey.HistoryError.codec().decode(e);break;default:e.skipType(7&t)}}return n})),P),ey.encode=e=>(0,to.LE)(e,ey.codec()),ey.decode=e=>(0,to.C6)(e,ey.codec()),(em=e0||(e0={})).codec=()=>(null==v&&(v=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.requestId&&""!==e.requestId&&(t.uint32(10),t.string(e.requestId)),null!=e.query&&(t.uint32(18),eQ.codec().encode(e.query,t)),null!=e.response&&(t.uint32(26),eZ.codec().encode(e.response,t)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={requestId:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.requestId=e.string();break;case 2:n.query=eQ.codec().decode(e,e.uint32());break;case 3:n.response=eZ.codec().decode(e,e.uint32());break;default:e.skipType(7&t)}}return n})),v),em.encode=e=>(0,to.LE)(e,em.codec()),em.decode=e=>(0,to.C6)(e,em.codec()),(eg=e2||(e2={})).codec=()=>(null==_&&(_=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.proof&&e.proof.byteLength>0&&(t.uint32(10),t.bytes(e.proof)),null!=e.merkleRoot&&e.merkleRoot.byteLength>0&&(t.uint32(18),t.bytes(e.merkleRoot)),null!=e.epoch&&e.epoch.byteLength>0&&(t.uint32(26),t.bytes(e.epoch)),null!=e.shareX&&e.shareX.byteLength>0&&(t.uint32(34),t.bytes(e.shareX)),null!=e.shareY&&e.shareY.byteLength>0&&(t.uint32(42),t.bytes(e.shareY)),null!=e.nullifier&&e.nullifier.byteLength>0&&(t.uint32(50),t.bytes(e.nullifier)),null!=e.rlnIdentifier&&e.rlnIdentifier.byteLength>0&&(t.uint32(58),t.bytes(e.rlnIdentifier)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={proof:new Uint8Array(0),merkleRoot:new Uint8Array(0),epoch:new Uint8Array(0),shareX:new Uint8Array(0),shareY:new Uint8Array(0),nullifier:new Uint8Array(0),rlnIdentifier:new Uint8Array(0)},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.proof=e.bytes();break;case 2:n.merkleRoot=e.bytes();break;case 3:n.epoch=e.bytes();break;case 4:n.shareX=e.bytes();break;case 5:n.shareY=e.bytes();break;case 6:n.nullifier=e.bytes();break;case 7:n.rlnIdentifier=e.bytes();break;default:e.skipType(7&t)}}return n})),_),eg.encode=e=>(0,to.LE)(e,eg.codec()),eg.decode=e=>(0,to.C6)(e,eg.codec()),(ek=e3||(e3={})).codec=()=>(null==N&&(N=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.payload&&e.payload.byteLength>0&&(t.uint32(10),t.bytes(e.payload)),null!=e.contentTopic&&""!==e.contentTopic&&(t.uint32(18),t.string(e.contentTopic)),null!=e.version&&(t.uint32(24),t.uint32(e.version)),null!=e.timestamp&&(t.uint32(80),t.sint64(e.timestamp)),null!=e.meta&&(t.uint32(90),t.bytes(e.meta)),null!=e.rateLimitProof&&(t.uint32(170),e2.codec().encode(e.rateLimitProof,t)),null!=e.ephemeral&&(t.uint32(248),t.bool(e.ephemeral)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={payload:new Uint8Array(0),contentTopic:""},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.payload=e.bytes();break;case 2:n.contentTopic=e.string();break;case 3:n.version=e.uint32();break;case 10:n.timestamp=e.sint64();break;case 11:n.meta=e.bytes();break;case 21:n.rateLimitProof=e2.codec().decode(e,e.uint32());break;case 31:n.ephemeral=e.bool();break;default:e.skipType(7&t)}}return n})),N),ek.encode=e=>(0,to.LE)(e,ek.codec()),ek.decode=e=>(0,to.C6)(e,ek.codec()),(ew=e1||(e1={})).codec=()=>(null==B&&(B=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.enr&&(t.uint32(10),t.bytes(e.enr)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();t>>>3==1?n.enr=e.bytes():e.skipType(7&t)}return n})),B),ew.encode=e=>(0,to.LE)(e,ew.codec()),ew.decode=e=>(0,to.C6)(e,ew.codec()),(eT=e8||(e8={})).codec=()=>(null==O&&(O=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.numPeers&&(t.uint32(8),t.uint64(e.numPeers)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();t>>>3==1?n.numPeers=e.uint64():e.skipType(7&t)}return n})),O),eT.encode=e=>(0,to.LE)(e,eT.codec()),eT.decode=e=>(0,to.C6)(e,eT.codec()),(eE=e6||(e6={})).codec=()=>(null==q&&(q=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.peerInfos)for(let n of e.peerInfos)t.uint32(10),e1.codec().encode(n,t);!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={peerInfos:[]},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();t>>>3==1?n.peerInfos.push(e1.codec().decode(e,e.uint32())):e.skipType(7&t)}return n})),q),eE.encode=e=>(0,to.LE)(e,eE.codec()),eE.decode=e=>(0,to.C6)(e,eE.codec()),(eI=e4||(e4={})).codec=()=>(null==F&&(F=(0,to.yw)((e,t,n={})=>{!1!==n.lengthDelimited&&t.fork(),null!=e.query&&(t.uint32(10),e8.codec().encode(e.query,t)),null!=e.response&&(t.uint32(18),e6.codec().encode(e.response,t)),!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.query=e8.codec().decode(e,e.uint32());break;case 2:n.response=e6.codec().decode(e,e.uint32());break;default:e.skipType(7&t)}}return n})),F),eI.encode=e=>(0,to.LE)(e,eI.codec()),eI.decode=e=>(0,to.C6)(e,eI.codec()),(eL=e7||(e7={})).codec=()=>(null==X&&(X=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.clusterId&&(t.uint32(8),t.uint32(e.clusterId)),null!=e.shards)for(let n of e.shards)t.uint32(16),t.uint32(n);!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={shards:[]},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.clusterId=e.uint32();break;case 2:n.shards.push(e.uint32());break;default:e.skipType(7&t)}}return n})),X),eL.encode=e=>(0,to.LE)(e,eL.codec()),eL.decode=e=>(0,to.C6)(e,eL.codec()),(eD=e5||(e5={})).codec=()=>(null==Y&&(Y=(0,to.yw)((e,t,n={})=>{if(!1!==n.lengthDelimited&&t.fork(),null!=e.clusterId&&(t.uint32(8),t.uint32(e.clusterId)),null!=e.shards)for(let n of e.shards)t.uint32(16),t.uint32(n);!1!==n.lengthDelimited&&t.ldelim()},(e,t)=>{let n={shards:[]},r=null==t?e.len:e.pos+t;for(;e.pos<r;){let t=e.uint32();switch(t>>>3){case 1:n.clusterId=e.uint32();break;case 2:n.shards.push(e.uint32());break;default:e.skipType(7&t)}}return n})),Y),eD.encode=e=>(0,to.LE)(e,eD.codec()),eD.decode=e=>(0,to.C6)(e,eD.codec()),(eC=e9||(e9={})).Relay="relay",eC.Store="store",eC.LightPush="lightpush",eC.Filter="filter",(eR=te||(te={})).GENERIC_FAIL="Generic error",eR.ENCODE_FAILED="Failed to encode",eR.DECODE_FAILED="Failed to decode",eR.EMPTY_PAYLOAD="Payload is empty",eR.SIZE_TOO_BIG="Size is too big",eR.TOPIC_NOT_CONFIGURED="Topic not configured",eR.NO_PEER_AVAILABLE="No peer available",eR.REMOTE_PEER_FAULT="Remote peer fault",eR.REMOTE_PEER_REJECTED="Remote peer rejected",eR.REQUEST_TIMEOUT="Request timeout",(eA=tt||(tt={})).BACKWARD="backward",eA.FORWARD="forward",(eU=tn||(tn={})).BOOTSTRAP="bootstrap",eU.PEER_EXCHANGE="peer-exchange",eU.LOCAL="local-peer-cache",(eS=tr||(tr={})).PEER_DISCOVERY_BOOTSTRAP="peer:discovery:bootstrap",eS.PEER_DISCOVERY_PEER_EXCHANGE="peer:discovery:peer-exchange",eS.PEER_CONNECT_BOOTSTRAP="peer:connected:bootstrap",eS.PEER_CONNECT_PEER_EXCHANGE="peer:connected:peer-exchange",(ti||(ti={})).CONNECTION_STATUS="waku:connection";let tl="/waku/2/default-waku/proto";var tc=n(2223);n(7519);var ts=n(4461);let tu="waku";class ta{_info;_warn;_error;static createDebugNamespace(e,t){return t?`${tu}:${e}:${t}`:`${tu}:${e}`}constructor(e){this._info=ts(ta.createDebugNamespace("info",e)),this._warn=ts(ta.createDebugNamespace("warn",e)),this._error=ts(ta.createDebugNamespace("error",e))}get info(){return this._info}get warn(){return this._warn}get error(){return this._error}log(e,...t){let n=this[e];n(...t)}}let td=new ta("message:version-0"),tp=BigInt(1e6);class tb{pubsubTopic;proto;constructor(e,t){this.pubsubTopic=e,this.proto=t}get ephemeral(){return!!this.proto.ephemeral}get payload(){return this.proto.payload}get contentTopic(){return this.proto.contentTopic}get _rawTimestamp(){return this.proto.timestamp}get timestamp(){try{if(this.proto.timestamp){let e=this.proto.timestamp/tp;return new Date(Number(e))}return}catch(e){return}}get meta(){return this.proto.meta}get version(){return this.proto.version??0}get rateLimitProof(){return this.proto.rateLimitProof}}class ty{pubsubTopic;contentTopic;constructor(e,t){if(this.pubsubTopic=e,this.contentTopic=t,!t||""===t)throw Error("Content topic must be specified")}fromWireToProtoObj(e){let t=ev.decode(e);return Promise.resolve({payload:t.payload,contentTopic:t.contentTopic,version:t.version??void 0,timestamp:t.timestamp??void 0,meta:t.meta??void 0,rateLimitProof:t.rateLimitProof??void 0,ephemeral:t.ephemeral??!1})}async fromProtoObj(e,t){return t.version?(td.error("Failed to decode due to incorrect version, expected:",0,", actual:",t.version),Promise.resolve(void 0)):new tb(e,t)}}var th=n(9802);function tf(e){if("string"==typeof e){let t=e.replace(/^0x/i,"");return(0,tc.m)(t.toLowerCase(),"base16")}return e}let tm=e=>(0,tc.m)(e,"utf8");function tg(e,t){let n=t??e.reduce((e,t)=>e+t.length,0),r=new Uint8Array(n),i=0;for(let t of e)r.set(t,i),i+=t.length;return r}let tk=e=>{if(void 0===e.clusterId||void 0===e.shard)throw Error("Invalid shard");return`/waku/2/rs/${e.clusterId}/${e.shard}`};function tw(e,t=tl){return"string"==typeof t?t:t?t.shard?tk(t):function(e,t=1,n=8){let r=function(e,t=8){let{application:n,version:r}=function(e){let t=e.split("/");if(t.length<5||t.length>6)throw Error("Content topic format is invalid");let n=0;if(6==t.length){if(isNaN(n=parseInt(t[1])))throw Error("Invalid generation field in content topic");if(n>0)throw Error("Generation greater than 0 is not supported")}let r=t.splice(-4);if(0==r[0].length)throw Error("Application field cannot be empty");if(0==r[1].length)throw Error("Version field cannot be empty");if(0==r[2].length)throw Error("Topic name field cannot be empty");if(0==r[3].length)throw Error("Encoding field cannot be empty");return{generation:n,application:r[0],version:r[1],topicName:r[2],encoding:r[3]}}(e),i=(0,th.J)(tg([tm(n),tm(r)])),o=new DataView(i.buffer.slice(-8));return Number(o.getBigUint64(0,!1)%BigInt(t))}(e,n);return`/waku/2/rs/${t}/${r}`}(e,t.clusterId):tl}let tT="waku";class tE{_info;_warn;_error;static createDebugNamespace(e,t){return t?`${tT}:${e}:${t}`:`${tT}:${e}`}constructor(e){this._info=ts(tE.createDebugNamespace("info",e)),this._warn=ts(tE.createDebugNamespace("warn",e)),this._error=ts(tE.createDebugNamespace("error",e))}get info(){return this._info}get warn(){return this._warn}get error(){return this._error}log(e,...t){let n=this[e];n(...t)}}var tI=n(7761),tL=n(4755),tD=n(6398);let tC={keySize:32,ivSize:12,algorithm:{name:"AES-GCM",length:128}},tR=BigInt(1e6),tA={node:tI,web:"object"==typeof self&&"crypto"in self?self.crypto:void 0};function tU(){if(tA.web)return tA.web.subtle;if(tA.node)return tA.node.webcrypto.subtle;throw Error("The environment doesn't have Crypto Subtle API (if in the browser, be sure to use to be in a secure context, ie, https)")}let tS=tL.P6.randomBytes;function tP(){return tS(tC.keySize)}async function tv(e,t){let[n,r]=await tL.Xx(e,t,{recovered:!0,der:!1});return tg([n,new Uint8Array([r])],n.length+1)}function t_(e){return new Uint8Array(tD.keccak256.arrayBuffer(e))}tL.P6.sha256,tL.$3;var tN=n(1363);class tB extends tb{signature;signaturePublicKey;_decodedPayload;constructor(e,t,n,r,i){super(e,t),this.signature=r,this.signaturePublicKey=i,this._decodedPayload=n}get payload(){return this._decodedPayload}verifySignature(e){return!!this.signaturePublicKey&&(0,tN.f)(this.signaturePublicKey,e)}}async function tO(e,t,n){return tU().importKey("raw",t,tC.algorithm,!1,["encrypt"]).then(t=>tU().encrypt({iv:e,...tC.algorithm},t,n)).then(e=>new Uint8Array(e))}async function tq(e,t,n){return tU().importKey("raw",t,tC.algorithm,!1,["decrypt"]).then(t=>tU().decrypt({iv:e,...tC.algorithm},t,n)).then(e=>new Uint8Array(e))}async function tF(e,t){let n=tS(tC.ivSize),r=await tO(n,tf(t),e);return tg([r,n])}async function tX(e,t){let n=e.length-tC.ivSize,r=e.slice(0,n),i=e.slice(n);return tq(i,tf(t),r)}function tY(e){let t=1;for(let n=e.length;n>=256;n/=256)t++;return t}async function tK(e,t){let n=new Uint8Array([0]);n=function(e,t){let n=tY(t),r=new Uint8Array(4),i=new DataView(r.buffer);return i.setUint32(0,t.length,!0),e=tg([e,r=r.slice(0,n)]),e[0]|=n,e}(n,e),n=tg([n,e]);let r=1+tY(e)+e.length;t&&(r+=65);let i=r%256,o=256-i,l=tS(o);if(l.length!==o||!(o<=3)&&-1===l.findIndex(e=>0!==e))throw Error("failed to generate random padding of size "+o);if(n=tg([n,l]),t){n[0]|=4;let e=t_(n),r=await tv(e,t);n=tg([n,r])}return n}let t$=new tE("message-encryption:symmetric");class tG{pubsubTopic;contentTopic;symKey;sigPrivKey;ephemeral;metaSetter;constructor(e,t,n,r,i=!1,o){if(this.pubsubTopic=e,this.contentTopic=t,this.symKey=n,this.sigPrivKey=r,this.ephemeral=i,this.metaSetter=o,!t||""===t)throw Error("Content topic must be specified")}async toWire(e){let t=await this.toProtoObj(e);if(t)return eq.encode(t)}async toProtoObj(e){let t=e.timestamp??new Date,n=await tK(e.payload,this.sigPrivKey),r=await tF(n,this.symKey),i={payload:r,version:1,contentTopic:this.contentTopic,timestamp:BigInt(t.valueOf())*tR,meta:void 0,rateLimitProof:e.rateLimitProof,ephemeral:this.ephemeral};if(this.metaSetter){let e=this.metaSetter(i);return{...i,meta:e}}return i}}function tV({pubsubTopic:e=tl,pubsubTopicShardInfo:t,contentTopic:n,symKey:r,sigPrivKey:i,ephemeral:o=!1,metaSetter:l}){return new tG(tw(n,e??t),n,r,i,o,l)}class tx extends ty{symKey;constructor(e,t,n){super(e,t),this.symKey=n}async fromProtoObj(e,t){let n;let r=t.payload;if(1!==t.version){t$.error("Failed to decrypt due to incorrect version, expected:",1,", actual:",t.version);return}try{n=await tX(r,this.symKey)}catch(e){t$.error(`Failed to decrypt message using asymmetric decryption for contentTopic: ${this.contentTopic}`,e);return}if(!n){t$.error(`Failed to decrypt payload for contentTopic ${this.contentTopic}`);return}let i=function(e){let t;let n=function(e){let t=new DataView(e.buffer);return 3&t.getUint8(0)}(e);if(0===n)return;let r=function(e,t){let n=e.slice(1,1+t);t<4&&(n=tg([n,new Uint8Array(4-t)],4));let r=new DataView(n.buffer);return r.getInt32(0,!0)}(e,n),i=1+n,o=e.slice(i,i+r),l=function(e){let t=new DataView(e.buffer);return(4&t.getUint8(0))==4}(e);if(l){let n=e.slice(e.length-65,e.length),r=l?t_(e.slice(0,e.length-65)):t_(e),i=function(e,t){let n=new DataView(t.slice(64).buffer),r=n.getUint8(0),i=tL.Pc.fromCompact(t.slice(0,64));return tL.LO(e,i,r,!1)}(r,n);t={signature:n,publicKey:i}}return{payload:o,sig:t}}(n);if(!i){t$.error(`Failed to decode payload for contentTopic ${this.contentTopic}`);return}return t$.info("Message decrypted",t),new tB(e,t,i.payload,i.sig?.signature,i.sig?.publicKey)}}function tW(e,t,n=tl){return new tx(tw(e,n),e,t)}}}]);