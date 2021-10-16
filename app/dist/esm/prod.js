import{createContext as e,useContext as t,useState as s,useMemo as i,useEffect as l}from"react";const r=e(null);class n{value="";touched=!1;error="";name="";getForm=null;listeners=[];constructor({name:e,value:t="",touched:s=!1,error:i="",getForm:l}){this.getForm=l,this.name=e,this.value=t,this.touched=s,this.error=i}setError(e){this.error=e,this.triggerListeners()}setTouched(e){this.touched=e,this.triggerListeners()}set(e){this.value=e,this.triggerListeners()}async validate(){const e=this.getForm().validateSchema.fields[this.name];if(e)try{await e.validate(this.value)}catch(e){this.setError(e.errors[0])}}onChange=e=>{this.set(e.target.value),this.getForm().options.validateOnChange&&this.validate()};onBlur=()=>{this.setTouched(!0),this.getForm().options.validateOnBlur&&this.validate()};getInputField=()=>({value:this.value,name:this.name,onChange:this.onChange,onBlur:this.onBlur});getSelectField=()=>({value:this.value,name:this.name,onChange:e=>{this.value=e,this.touched=!0,this.triggerListeners(),(this.getForm().options.validateOnChange||this.getForm().options.validateOnBlur)&&this.validate()},onBlur:this.onBlur});triggerListeners(){this.listeners.forEach((e=>e(this)))}}function a(e,t){return new Proxy(e,{get:(s,i)=>"fields"===i||"f"===i?new Proxy(e.fields,{get:(e,s)=>(function(e){if(!t.includes(e))throw new Error(`You don't have access to field with name - ${e}`)}(s),e[s])}):{__proto__:s}})}function o(...e){const o=t(r),[,h]=s(null);return i((()=>{e.forEach((e=>{!function(e,t){e.fields[t]||e._addField(t,new n({name:t,getForm:()=>e}))}(o,e)}))}),e),i((()=>"development"===process.env.NODE_ENV?a(o,e):null),[]),l((()=>{const t=()=>{h({})};return 0===e.length?o._addGlobalListener(t):e.forEach((e=>{o.fields[e].listeners=[...o.fields[e].listeners,t]})),()=>{0===e.length?o._addGlobalListener(t):e.forEach((e=>{o.fields[e].listeners=o.fields[e].listeners.filter((e=>e!==t))}))}}),e),o}class h{options={validateOnChange:!0,validateOnBlur:!0};fields={};f=null;validateSchema=null;globalListeners=[];globalFieldListener=e=>{this.globalListeners.forEach((t=>t(e)))};constructor({initValues:e,validateSchema:t,options:s}){this.f=this.fields,this.validateSchema=t,this.options={...this.options,...s},Object.entries(e).forEach((([e,t])=>{this.fields[e]=new n({name:e,value:t,getForm:()=>this})}))}_addGlobalListener(e){0===this.globalListeners.length&&Object.values(this.fields).forEach((e=>{e.listeners.push(this.globalFieldListener)})),this.globalListeners.push(e)}_removeGlobalListener(e){this.globalListeners=this.globalListeners.filter((t=>e!==t)),0===this.globalListeners.length&&Object.values(this.fields).forEach((e=>{e.listeners=e.listeners.filter((e=>this.globalFieldListener!==e))}))}_addField(e,t){this.fields[e]=t,this.globalListeners.length&&this.fields[e].listeners.push(this.globalListeners)}getValues(){return Object.entries(this.fields).reduce(((e,[t,s])=>(e[t]=s.value,e)),{})}}function d(...e){return i((()=>new h(...e)),[])}const u=r.Provider;export{u as FfsProvider,o as useFfs,d as useGlobalFfs};
