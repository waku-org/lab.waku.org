import{B as G,s as xe,k as A,c as $,e as K,t as X,n as et,i as tt,I as nt,b as j,d as st,f as V,h as it,j as p,l as q}from"./index-CBcRH9LY.js";const at=/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/,rt=/^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;class ct extends G{constructor({domain:t}){super(`Invalid domain "${xe(t)}".`,{metaMessages:["Must be a valid EIP-712 domain."]})}}class ot extends G{constructor({primaryType:t,types:n}){super(`Invalid primary type \`${t}\` must be one of \`${JSON.stringify(Object.keys(n))}\`.`,{docsPath:"/api/glossary/Errors#typeddatainvalidprimarytypeerror",metaMessages:["Check that the primary type is a key in `types`."]})}}class ut extends G{constructor({type:t}){super(`Struct type "${t}" is invalid.`,{metaMessages:["Struct type must not be a Solidity type."],name:"InvalidStructTypeError"})}}function dt(e){const{domain:t={},message:n,primaryType:s}=e,c={EIP712Domain:Et({domain:t}),...e.types};ht({domain:t,message:n,primaryType:s,types:c});const i=["0x1901"];return t&&i.push(lt({domain:t,types:c})),s!=="EIP712Domain"&&i.push(Q({data:n,primaryType:s,types:c})),A($(i))}function lt({domain:e,types:t}){return Q({data:e,primaryType:"EIP712Domain",types:t})}function Q({data:e,primaryType:t,types:n}){const s=z({data:e,primaryType:t,types:n});return A(s)}function z({data:e,primaryType:t,types:n}){const s=[{type:"bytes32"}],c=[ft({primaryType:t,types:n})];for(const i of n[t]){const[u,l]=Y({types:n,name:i.name,type:i.type,value:e[i.name]});s.push(u),c.push(l)}return K(s,c)}function ft({primaryType:e,types:t}){const n=X(gt({primaryType:e,types:t}));return A(n)}function gt({primaryType:e,types:t}){let n="";const s=J({primaryType:e,types:t});s.delete(e);const c=[e,...Array.from(s).sort()];for(const i of c)n+=`${i}(${t[i].map(({name:u,type:l})=>`${l} ${u}`).join(",")})`;return n}function J({primaryType:e,types:t},n=new Set){const s=e.match(/^\w*/u),c=s==null?void 0:s[0];if(n.has(c)||t[c]===void 0)return n;n.add(c);for(const i of t[c])J({primaryType:i.type,types:t},n);return n}function Y({types:e,name:t,type:n,value:s}){if(e[n]!==void 0)return[{type:"bytes32"},A(z({data:s,primaryType:n,types:e}))];if(n==="bytes")return s=`0x${(s.length%2?"0":"")+s.slice(2)}`,[{type:"bytes32"},A(s)];if(n==="string")return[{type:"bytes32"},A(X(s))];if(n.lastIndexOf("]")===n.length-1){const c=n.slice(0,n.lastIndexOf("[")),i=s.map(u=>Y({name:t,type:c,types:e,value:u}));return[{type:"bytes32"},A(K(i.map(([u])=>u),i.map(([,u])=>u)))]}return[{type:n},s]}function ht(e){const{domain:t,message:n,primaryType:s,types:c}=e,i=(u,l)=>{for(const h of u){const{name:v,type:f}=h,E=l[v],D=f.match(rt);if(D&&(typeof E=="number"||typeof E=="bigint")){const[B,S,H]=D;et(E,{signed:S==="int",size:Number.parseInt(H)/8})}if(f==="address"&&typeof E=="string"&&!tt(E))throw new nt({address:E});const w=f.match(at);if(w){const[B,S]=w;if(S&&j(E)!==Number.parseInt(S))throw new st({expectedSize:Number.parseInt(S),givenSize:j(E)})}const P=c[f];P&&(yt(f),i(P,E))}};if(c.EIP712Domain&&t){if(typeof t!="object")throw new ct({domain:t});i(c.EIP712Domain,t)}if(s!=="EIP712Domain")if(c[s])i(c[s],n);else throw new ot({primaryType:s,types:c})}function Et({domain:e}){return[typeof(e==null?void 0:e.name)=="string"&&{name:"name",type:"string"},(e==null?void 0:e.version)&&{name:"version",type:"string"},typeof(e==null?void 0:e.chainId)=="number"&&{name:"chainId",type:"uint256"},(e==null?void 0:e.verifyingContract)&&{name:"verifyingContract",type:"address"},(e==null?void 0:e.salt)&&{name:"salt",type:"bytes32"}].filter(Boolean)}function yt(e){if(e==="address"||e==="bool"||e==="string"||e.startsWith("bytes")||e.startsWith("uint")||e.startsWith("int"))throw new ut({type:e})}const _t=`Ethereum Signed Message:
`;function Tt(e){const t=typeof e=="string"?V(e):typeof e.raw=="string"?e.raw:it(e.raw),n=V(`${_t}${j(t)}`);return $([n,t])}function vt(e,t){return A(Tt(e),t)}const Z=()=>"9.1.0",It=e=>e.toString(16).padStart(2,"0"),mt=e=>{const t=new Uint8Array(e/2);return window.crypto.getRandomValues(t),Array.from(t,It).join("")},At=()=>typeof window<"u"?mt(10):new Date().getTime().toString(36);class C{}C.makeRequest=(e,t)=>({id:At(),method:e,params:t,env:{sdkVersion:Z()}});C.makeResponse=(e,t,n)=>({id:e,success:!0,version:n,data:t});C.makeErrorResponse=(e,t,n)=>({id:e,success:!1,error:t,version:n});var g;(function(e){e.sendTransactions="sendTransactions",e.rpcCall="rpcCall",e.getChainInfo="getChainInfo",e.getSafeInfo="getSafeInfo",e.getTxBySafeTxHash="getTxBySafeTxHash",e.getSafeBalances="getSafeBalances",e.signMessage="signMessage",e.signTypedMessage="signTypedMessage",e.getEnvironmentInfo="getEnvironmentInfo",e.getOffChainSignature="getOffChainSignature",e.requestAddressBook="requestAddressBook",e.wallet_getPermissions="wallet_getPermissions",e.wallet_requestPermissions="wallet_requestPermissions"})(g||(g={}));var R;(function(e){e.requestAddressBook="requestAddressBook"})(R||(R={}));class St{constructor(t=null,n=!1){this.allowedOrigins=null,this.callbacks=new Map,this.debugMode=!1,this.isServer=typeof window>"u",this.isValidMessage=({origin:s,data:c,source:i})=>{const u=!c,l=!this.isServer&&i===window.parent,h=typeof c.version<"u"&&parseInt(c.version.split(".")[0]),v=typeof h=="number"&&h>=1;let f=!0;return Array.isArray(this.allowedOrigins)&&(f=this.allowedOrigins.find(E=>E.test(s))!==void 0),!u&&l&&v&&f},this.logIncomingMessage=s=>{console.info(`Safe Apps SDK v1: A message was received from origin ${s.origin}. `,s.data)},this.onParentMessage=s=>{this.isValidMessage(s)&&(this.debugMode&&this.logIncomingMessage(s),this.handleIncomingMessage(s.data))},this.handleIncomingMessage=s=>{const{id:c}=s,i=this.callbacks.get(c);i&&(i(s),this.callbacks.delete(c))},this.send=(s,c)=>{const i=C.makeRequest(s,c);if(this.isServer)throw new Error("Window doesn't exist");return window.parent.postMessage(i,"*"),new Promise((u,l)=>{this.callbacks.set(i.id,h=>{if(!h.success){l(new Error(h.error));return}u(h)})})},this.allowedOrigins=t,this.debugMode=n,this.isServer||window.addEventListener("message",this.onParentMessage)}}const W=e=>typeof e=="object"&&e!=null&&"domain"in e&&"types"in e&&"message"in e;var b={},_={},T={},k=p&&p.__awaiter||function(e,t,n,s){function c(i){return i instanceof n?i:new n(function(u){u(i)})}return new(n||(n=Promise))(function(i,u){function l(f){try{v(s.next(f))}catch(E){u(E)}}function h(f){try{v(s.throw(f))}catch(E){u(E)}}function v(f){f.done?i(f.value):c(f.value).then(l,h)}v((s=s.apply(e,t||[])).next())})};Object.defineProperty(T,"__esModule",{value:!0});T.getData=T.fetchData=T.stringifyQuery=T.insertParams=void 0;const Ot=e=>typeof e=="object"&&e!==null&&"code"in e&&"message"in e;function pt(e,t,n){return e.replace(new RegExp(`\\{${t}\\}`,"g"),n)}function bt(e,t){return t?Object.keys(t).reduce((n,s)=>pt(n,s,String(t[s])),e):e}T.insertParams=bt;function Nt(e){if(!e)return"";const t=new URLSearchParams;Object.keys(e).forEach(s=>{e[s]!=null&&t.append(s,String(e[s]))});const n=t.toString();return n?`?${n}`:""}T.stringifyQuery=Nt;function x(e){return k(this,void 0,void 0,function*(){let t;try{t=yield e.json()}catch{t={}}if(!e.ok){const n=Ot(t)?`CGW error - ${t.code}: ${t.message}`:`CGW error - status ${e.statusText}`;throw new Error(n)}return t})}function Ct(e,t,n,s,c){return k(this,void 0,void 0,function*(){const i=Object.assign({"Content-Type":"application/json"},s),u={method:t??"POST",headers:i};c&&(u.credentials=c),n!=null&&(u.body=typeof n=="string"?n:JSON.stringify(n));const l=yield fetch(e,u);return x(l)})}T.fetchData=Ct;function Dt(e,t,n){return k(this,void 0,void 0,function*(){const s={method:"GET"};t&&(s.headers=Object.assign(Object.assign({},t),{"Content-Type":"application/json"})),n&&(s.credentials=n);const c=yield fetch(e,s);return x(c)})}T.getData=Dt;Object.defineProperty(_,"__esModule",{value:!0});_.getEndpoint=_.deleteEndpoint=_.putEndpoint=_.postEndpoint=void 0;const O=T;function M(e,t,n,s){const c=(0,O.insertParams)(t,n),i=(0,O.stringifyQuery)(s);return`${e}${c}${i}`}function wt(e,t,n){const s=M(e,t,n==null?void 0:n.path,n==null?void 0:n.query);return(0,O.fetchData)(s,"POST",n==null?void 0:n.body,n==null?void 0:n.headers,n==null?void 0:n.credentials)}_.postEndpoint=wt;function Pt(e,t,n){const s=M(e,t,n==null?void 0:n.path,n==null?void 0:n.query);return(0,O.fetchData)(s,"PUT",n==null?void 0:n.body,n==null?void 0:n.headers,n==null?void 0:n.credentials)}_.putEndpoint=Pt;function Rt(e,t,n){const s=M(e,t,n==null?void 0:n.path,n==null?void 0:n.query);return(0,O.fetchData)(s,"DELETE",n==null?void 0:n.body,n==null?void 0:n.headers,n==null?void 0:n.credentials)}_.deleteEndpoint=Rt;function Mt(e,t,n,s){if(s)return(0,O.getData)(s,void 0,n==null?void 0:n.credentials);const c=M(e,t,n==null?void 0:n.path,n==null?void 0:n.query);return(0,O.getData)(c,n==null?void 0:n.headers,n==null?void 0:n.credentials)}_.getEndpoint=Mt;var L={};Object.defineProperty(L,"__esModule",{value:!0});L.DEFAULT_BASE_URL=void 0;L.DEFAULT_BASE_URL="https://safe-client.safe.global";var ee={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.ImplementationVersionState=void 0,function(t){t.UP_TO_DATE="UP_TO_DATE",t.OUTDATED="OUTDATED",t.UNKNOWN="UNKNOWN"}(e.ImplementationVersionState||(e.ImplementationVersionState={}))})(ee);var te={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.SafeAppSocialPlatforms=e.SafeAppFeatures=e.SafeAppAccessPolicyTypes=void 0,function(t){t.NoRestrictions="NO_RESTRICTIONS",t.DomainAllowlist="DOMAIN_ALLOWLIST"}(e.SafeAppAccessPolicyTypes||(e.SafeAppAccessPolicyTypes={})),function(t){t.BATCHED_TRANSACTIONS="BATCHED_TRANSACTIONS"}(e.SafeAppFeatures||(e.SafeAppFeatures={})),function(t){t.TWITTER="TWITTER",t.GITHUB="GITHUB",t.DISCORD="DISCORD"}(e.SafeAppSocialPlatforms||(e.SafeAppSocialPlatforms={}))})(te);var ne={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.LabelValue=e.StartTimeValue=e.DurationType=e.DetailedExecutionInfoType=e.TransactionListItemType=e.ConflictType=e.TransactionInfoType=e.SettingsInfoType=e.TransactionTokenType=e.TransferDirection=e.TransactionStatus=e.Operation=void 0,function(t){t[t.CALL=0]="CALL",t[t.DELEGATE=1]="DELEGATE"}(e.Operation||(e.Operation={})),function(t){t.AWAITING_CONFIRMATIONS="AWAITING_CONFIRMATIONS",t.AWAITING_EXECUTION="AWAITING_EXECUTION",t.CANCELLED="CANCELLED",t.FAILED="FAILED",t.SUCCESS="SUCCESS"}(e.TransactionStatus||(e.TransactionStatus={})),function(t){t.INCOMING="INCOMING",t.OUTGOING="OUTGOING",t.UNKNOWN="UNKNOWN"}(e.TransferDirection||(e.TransferDirection={})),function(t){t.ERC20="ERC20",t.ERC721="ERC721",t.NATIVE_COIN="NATIVE_COIN"}(e.TransactionTokenType||(e.TransactionTokenType={})),function(t){t.SET_FALLBACK_HANDLER="SET_FALLBACK_HANDLER",t.ADD_OWNER="ADD_OWNER",t.REMOVE_OWNER="REMOVE_OWNER",t.SWAP_OWNER="SWAP_OWNER",t.CHANGE_THRESHOLD="CHANGE_THRESHOLD",t.CHANGE_IMPLEMENTATION="CHANGE_IMPLEMENTATION",t.ENABLE_MODULE="ENABLE_MODULE",t.DISABLE_MODULE="DISABLE_MODULE",t.SET_GUARD="SET_GUARD",t.DELETE_GUARD="DELETE_GUARD"}(e.SettingsInfoType||(e.SettingsInfoType={})),function(t){t.TRANSFER="Transfer",t.SETTINGS_CHANGE="SettingsChange",t.CUSTOM="Custom",t.CREATION="Creation",t.SWAP_ORDER="SwapOrder",t.TWAP_ORDER="TwapOrder",t.SWAP_TRANSFER="SwapTransfer"}(e.TransactionInfoType||(e.TransactionInfoType={})),function(t){t.NONE="None",t.HAS_NEXT="HasNext",t.END="End"}(e.ConflictType||(e.ConflictType={})),function(t){t.TRANSACTION="TRANSACTION",t.LABEL="LABEL",t.CONFLICT_HEADER="CONFLICT_HEADER",t.DATE_LABEL="DATE_LABEL"}(e.TransactionListItemType||(e.TransactionListItemType={})),function(t){t.MULTISIG="MULTISIG",t.MODULE="MODULE"}(e.DetailedExecutionInfoType||(e.DetailedExecutionInfoType={})),function(t){t.AUTO="AUTO",t.LIMIT_DURATION="LIMIT_DURATION"}(e.DurationType||(e.DurationType={})),function(t){t.AT_MINING_TIME="AT_MINING_TIME",t.AT_EPOCH="AT_EPOCH"}(e.StartTimeValue||(e.StartTimeValue={})),function(t){t.Queued="Queued",t.Next="Next"}(e.LabelValue||(e.LabelValue={}))})(ne);var se={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.FEATURES=e.GAS_PRICE_TYPE=e.RPC_AUTHENTICATION=void 0,function(t){t.API_KEY_PATH="API_KEY_PATH",t.NO_AUTHENTICATION="NO_AUTHENTICATION",t.UNKNOWN="UNKNOWN"}(e.RPC_AUTHENTICATION||(e.RPC_AUTHENTICATION={})),function(t){t.ORACLE="ORACLE",t.FIXED="FIXED",t.FIXED_1559="FIXED1559",t.UNKNOWN="UNKNOWN"}(e.GAS_PRICE_TYPE||(e.GAS_PRICE_TYPE={})),function(t){t.ERC721="ERC721",t.SAFE_APPS="SAFE_APPS",t.CONTRACT_INTERACTION="CONTRACT_INTERACTION",t.DOMAIN_LOOKUP="DOMAIN_LOOKUP",t.SPENDING_LIMIT="SPENDING_LIMIT",t.EIP1559="EIP1559",t.SAFE_TX_GAS_OPTIONAL="SAFE_TX_GAS_OPTIONAL",t.TX_SIMULATION="TX_SIMULATION",t.EIP1271="EIP1271"}(e.FEATURES||(e.FEATURES={}))})(se);var ie={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.TokenType=void 0,function(t){t.ERC20="ERC20",t.ERC721="ERC721",t.NATIVE_TOKEN="NATIVE_TOKEN"}(e.TokenType||(e.TokenType={}))})(ie);var ae={};Object.defineProperty(ae,"__esModule",{value:!0});var re={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.ConfirmationViewTypes=void 0,function(t){t.COW_SWAP_ORDER="COW_SWAP_ORDER",t.COW_SWAP_TWAP_ORDER="COW_SWAP_TWAP_ORDER"}(e.ConfirmationViewTypes||(e.ConfirmationViewTypes={}))})(re);var ce={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.SafeMessageStatus=e.SafeMessageListItemType=void 0,function(t){t.DATE_LABEL="DATE_LABEL",t.MESSAGE="MESSAGE"}(e.SafeMessageListItemType||(e.SafeMessageListItemType={})),function(t){t.NEEDS_CONFIRMATION="NEEDS_CONFIRMATION",t.CONFIRMED="CONFIRMED"}(e.SafeMessageStatus||(e.SafeMessageStatus={}))})(ce);var oe={};(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.DeviceType=void 0,function(t){t.ANDROID="ANDROID",t.IOS="IOS",t.WEB="WEB"}(e.DeviceType||(e.DeviceType={}))})(oe);var ue={};Object.defineProperty(ue,"__esModule",{value:!0});(function(e){var t=p&&p.__createBinding||(Object.create?function(a,r,o,d){d===void 0&&(d=o);var m=Object.getOwnPropertyDescriptor(r,o);(!m||("get"in m?!r.__esModule:m.writable||m.configurable))&&(m={enumerable:!0,get:function(){return r[o]}}),Object.defineProperty(a,d,m)}:function(a,r,o,d){d===void 0&&(d=o),a[d]=r[o]}),n=p&&p.__exportStar||function(a,r){for(var o in a)o!=="default"&&!Object.prototype.hasOwnProperty.call(r,o)&&t(r,a,o)};Object.defineProperty(e,"__esModule",{value:!0}),e.deleteAccount=e.getAccount=e.createAccount=e.verifyAuth=e.getAuthNonce=e.getContract=e.getSafeOverviews=e.unsubscribeAll=e.unsubscribeSingle=e.registerRecoveryModule=e.deleteRegisteredEmail=e.getRegisteredEmail=e.verifyEmail=e.resendEmailVerificationCode=e.changeEmail=e.registerEmail=e.unregisterDevice=e.unregisterSafe=e.registerDevice=e.getDelegates=e.confirmSafeMessage=e.proposeSafeMessage=e.getSafeMessage=e.getSafeMessages=e.getDecodedData=e.getMasterCopies=e.getSafeApps=e.getChainConfig=e.getChainsConfig=e.getConfirmationView=e.proposeTransaction=e.getNonces=e.postSafeGasEstimation=e.deleteTransaction=e.getTransactionDetails=e.getTransactionQueue=e.getTransactionHistory=e.getCollectiblesPage=e.getCollectibles=e.getAllOwnedSafes=e.getOwnedSafes=e.getFiatCurrencies=e.getBalances=e.getMultisigTransactions=e.getModuleTransactions=e.getIncomingTransfers=e.getSafeInfo=e.getRelayCount=e.relayTransaction=e.setBaseUrl=void 0,e.putAccountDataSettings=e.getAccountDataSettings=e.getAccountDataTypes=void 0;const s=_,c=L;n(ee,e),n(te,e),n(ne,e),n(se,e),n(ie,e),n(ae,e),n(re,e),n(ce,e),n(oe,e),n(ue,e);let i=c.DEFAULT_BASE_URL;const u=a=>{i=a};e.setBaseUrl=u;function l(a,r){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/relay",{path:{chainId:a},body:r})}e.relayTransaction=l;function h(a,r){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/relay/{address}",{path:{chainId:a,address:r}})}e.getRelayCount=h;function v(a,r){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{address}",{path:{chainId:a,address:r}})}e.getSafeInfo=v;function f(a,r,o,d){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{address}/incoming-transfers/",{path:{chainId:a,address:r},query:o},d)}e.getIncomingTransfers=f;function E(a,r,o,d){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{address}/module-transactions/",{path:{chainId:a,address:r},query:o},d)}e.getModuleTransactions=E;function D(a,r,o,d){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{address}/multisig-transactions/",{path:{chainId:a,address:r},query:o},d)}e.getMultisigTransactions=D;function w(a,r,o="usd",d={}){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{address}/balances/{currency}",{path:{chainId:a,address:r,currency:o},query:d})}e.getBalances=w;function P(){return(0,s.getEndpoint)(i,"/v1/balances/supported-fiat-codes")}e.getFiatCurrencies=P;function B(a,r){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/owners/{address}/safes",{path:{chainId:a,address:r}})}e.getOwnedSafes=B;function S(a){return(0,s.getEndpoint)(i,"/v1/owners/{address}/safes",{path:{address:a}})}e.getAllOwnedSafes=S;function H(a,r,o={}){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{address}/collectibles",{path:{chainId:a,address:r},query:o})}e.getCollectibles=H;function fe(a,r,o={},d){return(0,s.getEndpoint)(i,"/v2/chains/{chainId}/safes/{address}/collectibles",{path:{chainId:a,address:r},query:o},d)}e.getCollectiblesPage=fe;function ge(a,r,o={},d){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/transactions/history",{path:{chainId:a,safe_address:r},query:o},d)}e.getTransactionHistory=ge;function he(a,r,o={},d){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/transactions/queued",{path:{chainId:a,safe_address:r},query:o},d)}e.getTransactionQueue=he;function Ee(a,r){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/transactions/{transactionId}",{path:{chainId:a,transactionId:r}})}e.getTransactionDetails=Ee;function ye(a,r,o){return(0,s.deleteEndpoint)(i,"/v1/chains/{chainId}/transactions/{safeTxHash}",{path:{chainId:a,safeTxHash:r},body:{signature:o}})}e.deleteTransaction=ye;function _e(a,r,o){return(0,s.postEndpoint)(i,"/v2/chains/{chainId}/safes/{safe_address}/multisig-transactions/estimations",{path:{chainId:a,safe_address:r},body:o})}e.postSafeGasEstimation=_e;function Te(a,r){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/nonces",{path:{chainId:a,safe_address:r}})}e.getNonces=Te;function ve(a,r,o){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/transactions/{safe_address}/propose",{path:{chainId:a,safe_address:r},body:o})}e.proposeTransaction=ve;function Ie(a,r,o,d){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/views/transaction-confirmation",{path:{chainId:a,safe_address:r},body:{data:o,to:d}})}e.getConfirmationView=Ie;function me(a){return(0,s.getEndpoint)(i,"/v1/chains",{query:a})}e.getChainsConfig=me;function Ae(a){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}",{path:{chainId:a}})}e.getChainConfig=Ae;function Se(a,r={}){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safe-apps",{path:{chainId:a},query:r})}e.getSafeApps=Se;function Oe(a){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/about/master-copies",{path:{chainId:a}})}e.getMasterCopies=Oe;function pe(a,r,o){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/data-decoder",{path:{chainId:a},body:{data:r,to:o}})}e.getDecodedData=pe;function be(a,r,o){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/messages",{path:{chainId:a,safe_address:r},query:{}},o)}e.getSafeMessages=be;function Ne(a,r){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/messages/{message_hash}",{path:{chainId:a,message_hash:r}})}e.getSafeMessage=Ne;function Ce(a,r,o){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/messages",{path:{chainId:a,safe_address:r},body:o})}e.proposeSafeMessage=Ce;function De(a,r,o){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/messages/{message_hash}/signatures",{path:{chainId:a,message_hash:r},body:o})}e.confirmSafeMessage=De;function we(a,r={}){return(0,s.getEndpoint)(i,"/v2/chains/{chainId}/delegates",{path:{chainId:a},query:r})}e.getDelegates=we;function Pe(a){return(0,s.postEndpoint)(i,"/v1/register/notifications",{body:a})}e.registerDevice=Pe;function Re(a,r,o){return(0,s.deleteEndpoint)(i,"/v1/chains/{chainId}/notifications/devices/{uuid}/safes/{safe_address}",{path:{chainId:a,safe_address:r,uuid:o}})}e.unregisterSafe=Re;function Me(a,r){return(0,s.deleteEndpoint)(i,"/v1/chains/{chainId}/notifications/devices/{uuid}",{path:{chainId:a,uuid:r}})}e.unregisterDevice=Me;function Le(a,r,o,d){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/emails",{path:{chainId:a,safe_address:r},body:o,headers:d})}e.registerEmail=Le;function Be(a,r,o,d,m){return(0,s.putEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/emails/{signer}",{path:{chainId:a,safe_address:r,signer:o},body:d,headers:m})}e.changeEmail=Be;function He(a,r,o){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/emails/{signer}/verify-resend",{path:{chainId:a,safe_address:r,signer:o},body:""})}e.resendEmailVerificationCode=He;function je(a,r,o,d){return(0,s.putEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/emails/{signer}/verify",{path:{chainId:a,safe_address:r,signer:o},body:d})}e.verifyEmail=je;function Ue(a,r,o,d){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/emails/{signer}",{path:{chainId:a,safe_address:r,signer:o},headers:d})}e.getRegisteredEmail=Ue;function Ge(a,r,o,d){return(0,s.deleteEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/emails/{signer}",{path:{chainId:a,safe_address:r,signer:o},headers:d})}e.deleteRegisteredEmail=Ge;function We(a,r,o){return(0,s.postEndpoint)(i,"/v1/chains/{chainId}/safes/{safe_address}/recovery",{path:{chainId:a,safe_address:r},body:o})}e.registerRecoveryModule=We;function ke(a){return(0,s.deleteEndpoint)(i,"/v1/subscriptions",{query:a})}e.unsubscribeSingle=ke;function Ve(a){return(0,s.deleteEndpoint)(i,"/v1/subscriptions/all",{query:a})}e.unsubscribeAll=Ve;function qe(a,r){return(0,s.getEndpoint)(i,"/v1/safes",{query:Object.assign(Object.assign({},r),{safes:a.join(",")})})}e.getSafeOverviews=qe;function Fe(a,r){return(0,s.getEndpoint)(i,"/v1/chains/{chainId}/contracts/{contractAddress}",{path:{chainId:a,contractAddress:r}})}e.getContract=Fe;function $e(){return(0,s.getEndpoint)(i,"/v1/auth/nonce",{credentials:"include"})}e.getAuthNonce=$e;function Ke(a){return(0,s.postEndpoint)(i,"/v1/auth/verify",{body:a,credentials:"include"})}e.verifyAuth=Ke;function Xe(a){return(0,s.postEndpoint)(i,"/v1/accounts",{body:a,credentials:"include"})}e.createAccount=Xe;function Qe(a){return(0,s.getEndpoint)(i,"/v1/accounts/{address}",{path:{address:a},credentials:"include"})}e.getAccount=Qe;function ze(a){return(0,s.deleteEndpoint)(i,"/v1/accounts/{address}",{path:{address:a},credentials:"include"})}e.deleteAccount=ze;function Je(){return(0,s.getEndpoint)(i,"/v1/accounts/data-types")}e.getAccountDataTypes=Je;function Ye(a){return(0,s.getEndpoint)(i,"/v1/accounts/{address}/data-settings",{path:{address:a},credentials:"include"})}e.getAccountDataSettings=Ye;function Ze(a,r){return(0,s.putEndpoint)(i,"/v1/accounts/{address}/data-settings",{path:{address:a},body:r,credentials:"include"})}e.putAccountDataSettings=Ze})(b);class Lt{constructor(t){this.communicator=t}async getBySafeTxHash(t){if(!t)throw new Error("Invalid safeTxHash");return(await this.communicator.send(g.getTxBySafeTxHash,{safeTxHash:t})).data}async signMessage(t){const n={message:t};return(await this.communicator.send(g.signMessage,n)).data}async signTypedMessage(t){if(!W(t))throw new Error("Invalid typed data");return(await this.communicator.send(g.signTypedMessage,{typedData:t})).data}async send({txs:t,params:n}){if(!t||!t.length)throw new Error("No transactions were passed");const s={txs:t,params:n};return(await this.communicator.send(g.sendTransactions,s)).data}}const y={eth_call:"eth_call",eth_gasPrice:"eth_gasPrice",eth_getLogs:"eth_getLogs",eth_getBalance:"eth_getBalance",eth_getCode:"eth_getCode",eth_getBlockByHash:"eth_getBlockByHash",eth_getBlockByNumber:"eth_getBlockByNumber",eth_getStorageAt:"eth_getStorageAt",eth_getTransactionByHash:"eth_getTransactionByHash",eth_getTransactionReceipt:"eth_getTransactionReceipt",eth_getTransactionCount:"eth_getTransactionCount",eth_estimateGas:"eth_estimateGas",safe_setSettings:"safe_setSettings"},I={defaultBlockParam:(e="latest")=>e,returnFullTxObjectParam:(e=!1)=>e,blockNumberToHex:e=>Number.isInteger(e)?`0x${e.toString(16)}`:e};class Bt{constructor(t){this.communicator=t,this.call=this.buildRequest({call:y.eth_call,formatters:[null,I.defaultBlockParam]}),this.getBalance=this.buildRequest({call:y.eth_getBalance,formatters:[null,I.defaultBlockParam]}),this.getCode=this.buildRequest({call:y.eth_getCode,formatters:[null,I.defaultBlockParam]}),this.getStorageAt=this.buildRequest({call:y.eth_getStorageAt,formatters:[null,I.blockNumberToHex,I.defaultBlockParam]}),this.getPastLogs=this.buildRequest({call:y.eth_getLogs}),this.getBlockByHash=this.buildRequest({call:y.eth_getBlockByHash,formatters:[null,I.returnFullTxObjectParam]}),this.getBlockByNumber=this.buildRequest({call:y.eth_getBlockByNumber,formatters:[I.blockNumberToHex,I.returnFullTxObjectParam]}),this.getTransactionByHash=this.buildRequest({call:y.eth_getTransactionByHash}),this.getTransactionReceipt=this.buildRequest({call:y.eth_getTransactionReceipt}),this.getTransactionCount=this.buildRequest({call:y.eth_getTransactionCount,formatters:[null,I.defaultBlockParam]}),this.getGasPrice=this.buildRequest({call:y.eth_gasPrice}),this.getEstimateGas=n=>this.buildRequest({call:y.eth_estimateGas})([n]),this.setSafeSettings=this.buildRequest({call:y.safe_setSettings})}buildRequest(t){const{call:n,formatters:s}=t;return async c=>{s&&Array.isArray(c)&&s.forEach((l,h)=>{l&&(c[h]=l(c[h]))});const i={call:n,params:c||[]};return(await this.communicator.send(g.rpcCall,i)).data}}}const Ht="0x1626ba7e",jt="0x20c13b0b",U=4001;class N extends Error{constructor(t,n,s){super(t),this.code=n,this.data=s,Object.setPrototypeOf(this,N.prototype)}}class de{constructor(t){this.communicator=t}async getPermissions(){return(await this.communicator.send(g.wallet_getPermissions,void 0)).data}async requestPermissions(t){if(!this.isPermissionRequestValid(t))throw new N("Permissions request is invalid",U);try{return(await this.communicator.send(g.wallet_requestPermissions,t)).data}catch{throw new N("Permissions rejected",U)}}isPermissionRequestValid(t){return t.every(n=>typeof n=="object"?Object.keys(n).every(s=>!!Object.values(R).includes(s)):!1)}}const F=(e,t)=>t.some(n=>n.parentCapability===e),Ut=()=>(e,t,n)=>{const s=n.value;return n.value=async function(){const c=new de(this.communicator);let i=await c.getPermissions();if(F(t,i)||(i=await c.requestPermissions([{[t]:{}}])),!F(t,i))throw new N("Permissions rejected",U);return s.apply(this)},n};var Gt=function(e,t,n,s){var c=arguments.length,i=c<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,n):s,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,s);else for(var l=e.length-1;l>=0;l--)(u=e[l])&&(i=(c<3?u(i):c>3?u(t,n,i):u(t,n))||i);return c>3&&i&&Object.defineProperty(t,n,i),i};class le{constructor(t){this.communicator=t}async getChainInfo(){return(await this.communicator.send(g.getChainInfo,void 0)).data}async getInfo(){return(await this.communicator.send(g.getSafeInfo,void 0)).data}async experimental_getBalances({currency:t="usd"}={}){return(await this.communicator.send(g.getSafeBalances,{currency:t})).data}async check1271Signature(t,n="0x"){const s=await this.getInfo(),c=q({abi:[{constant:!1,inputs:[{name:"_dataHash",type:"bytes32"},{name:"_signature",type:"bytes"}],name:"isValidSignature",outputs:[{name:"",type:"bytes4"}],payable:!1,stateMutability:"nonpayable",type:"function"}],functionName:"isValidSignature",args:[t,n]}),i={call:y.eth_call,params:[{to:s.safeAddress,data:c},"latest"]};try{return(await this.communicator.send(g.rpcCall,i)).data.slice(0,10).toLowerCase()===Ht}catch{return!1}}async check1271SignatureBytes(t,n="0x"){const s=await this.getInfo(),c=q({abi:[{constant:!1,inputs:[{name:"_data",type:"bytes"},{name:"_signature",type:"bytes"}],name:"isValidSignature",outputs:[{name:"",type:"bytes4"}],payable:!1,stateMutability:"nonpayable",type:"function"}],functionName:"isValidSignature",args:[t,n]}),i={call:y.eth_call,params:[{to:s.safeAddress,data:c},"latest"]};try{return(await this.communicator.send(g.rpcCall,i)).data.slice(0,10).toLowerCase()===jt}catch{return!1}}calculateMessageHash(t){return vt(t)}calculateTypedMessageHash(t){const n=typeof t.domain.chainId=="object"?t.domain.chainId.toNumber():Number(t.domain.chainId);let s=t.primaryType;if(!s){const c=Object.values(t.types),i=Object.keys(t.types).filter(u=>c.every(l=>l.every(({type:h})=>h.replace("[","").replace("]","")!==u)));if(i.length===0||i.length>1)throw new Error("Please specify primaryType");s=i[0]}return dt({message:t.message,domain:{...t.domain,chainId:n,verifyingContract:t.domain.verifyingContract,salt:t.domain.salt},types:t.types,primaryType:s})}async getOffChainSignature(t){return(await this.communicator.send(g.getOffChainSignature,t)).data}async isMessageSigned(t,n="0x"){let s;if(typeof t=="string"&&(s=async()=>{const c=this.calculateMessageHash(t);return await this.isMessageHashSigned(c,n)}),W(t)&&(s=async()=>{const c=this.calculateTypedMessageHash(t);return await this.isMessageHashSigned(c,n)}),s)return await s();throw new Error("Invalid message type")}async isMessageHashSigned(t,n="0x"){const s=[this.check1271Signature.bind(this),this.check1271SignatureBytes.bind(this)];for(const c of s)if(await c(t,n))return!0;return!1}async getEnvironmentInfo(){return(await this.communicator.send(g.getEnvironmentInfo,void 0)).data}async requestAddressBook(){return(await this.communicator.send(g.requestAddressBook,void 0)).data}}Gt([Ut()],le.prototype,"requestAddressBook",null);class Wt{constructor(t={}){const{allowedDomains:n=null,debug:s=!1}=t;this.communicator=new St(n,s),this.eth=new Bt(this.communicator),this.txs=new Lt(this.communicator),this.safe=new le(this.communicator),this.wallet=new de(this.communicator)}}const Vt=Object.freeze(Object.defineProperty({__proto__:null,MessageFormatter:C,get Methods(){return g},Operation:b.Operation,RPC_CALLS:y,get RestrictedMethods(){return R},TokenType:b.TokenType,TransactionStatus:b.TransactionStatus,TransferDirection:b.TransferDirection,default:Wt,getSDKVersion:Z,isObjectEIP712TypedData:W},Symbol.toStringTag,{value:"Module"}));export{Vt as e};