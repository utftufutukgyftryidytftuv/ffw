"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react");const t=e.createContext(null);class s{value="";touched=!1;error="";name="";getForm=null;listeners=[];constructor({name:e,value:t="",touched:s=!1,error:i="",getForm:l}){this.getForm=l,this.name=e,this.value=t,this.touched=s,this.error=i}setError(e){this.error=e,this.triggerListeners()}setTouched(e){this.touched=e,this.triggerListeners()}set(e){this.value=e,this.triggerListeners()}async validate(){const e=this.getForm().validateSchema.fields[this.name];if(e)try{await e.validate(this.value)}catch(e){this.setError(e.errors[0])}}onChange=e=>{this.set(e.target.value),this.getForm().options.validateOnChange&&this.validate()};onBlur=()=>{this.setTouched(!0),this.getForm().options.validateOnBlur&&this.validate()};getInputField=()=>({value:this.value,name:this.name,onChange:this.onChange,onBlur:this.onBlur});getSelectField=()=>({value:this.value,name:this.name,onChange:e=>{this.value=e,this.touched=!0,this.triggerListeners(),(this.getForm().options.validateOnChange||this.getForm().options.validateOnBlur)&&this.validate()},onBlur:this.onBlur});triggerListeners(){this.listeners.forEach((e=>e(this)))}}function i(e,t){return new Proxy(e,{get:(s,i)=>"fields"===i||"f"===i?new Proxy(e.fields,{get:(e,s)=>(function(e){if(!t.includes(e))throw new Error(`You don't have access to field with name - ${e}`)}(s),e[s])}):{__proto__:s}})}class l{options={validateOnChange:!0,validateOnBlur:!0};fields={};f=null;validateSchema=null;globalListeners=[];globalFieldListener=e=>{this.globalListeners.forEach((t=>t(e)))};constructor({initValues:e,validateSchema:t,options:i}){this.f=this.fields,this.validateSchema=t,this.options={...this.options,...i},Object.entries(e).forEach((([e,t])=>{this.fields[e]=new s({name:e,value:t,getForm:()=>this})}))}_addGlobalListener(e){0===this.globalListeners.length&&Object.values(this.fields).forEach((e=>{e.listeners.push(this.globalFieldListener)})),this.globalListeners.push(e)}_removeGlobalListener(e){this.globalListeners=this.globalListeners.filter((t=>e!==t)),0===this.globalListeners.length&&Object.values(this.fields).forEach((e=>{e.listeners=e.listeners.filter((e=>this.globalFieldListener!==e))}))}_addField(e,t){this.fields[e]=t,this.globalListeners.length&&this.fields[e].listeners.push(this.globalFieldListener)}getValues(){return Object.entries(this.fields).reduce(((e,[t,s])=>(e[t]=s.value,e)),{})}}const r=t.Provider;exports.FfsProvider=r,exports.useFfs=function(...l){const r=e.useContext(t),[,n]=e.useState(null);e.useMemo((()=>{l.forEach((e=>{!function(e,t){e.fields[t]||e._addField(t,new s({name:t,getForm:()=>e,value:""}))}(r,e)}))}),l);const o=e.useMemo((()=>"development"===process.env.NODE_ENV?i(r,l):null),[]);return e.useEffect((()=>{const e=()=>{n({})};return 0===l.length?r._addGlobalListener(e):l.forEach((t=>{r.fields[t].listeners=[...r.fields[t].listeners,e]})),()=>{0===l.length?r._addGlobalListener(e):l.forEach((t=>{r.fields[t].listeners=r.fields[t].listeners.filter((t=>t!==e))}))}}),l),"development"===process.env.NODE_ENV?o:r},exports.useGlobalFfs=function(t){return e.useMemo((()=>new l(t)),[])};
