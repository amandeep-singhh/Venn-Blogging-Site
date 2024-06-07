const storeinSession=(key,value)=>{
    return sessionStorage.setItem(key,value);
}
const lookInSession=(key,value)=>{
    return sessionStorage.getItem(key);
}
const removeFromSession=(key,value)=>{
    return sessionStorage.removeItem(key);
}

export {storeinSession,lookInSession,removeFromSession}