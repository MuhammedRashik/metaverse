import { useEffect, useState } from "react"

export const useInput= ()=>{
    const [input,setInput]=useState({
        forward:false,
        backword:false,
        left:false,
        right:false,
        shift:false
    })

    const keys:any={
        KeyW:"forward",
        ArrowUp:"forward",
        KeyA:"left",
        ArrowLeft:"left",
        KeyS:"backword",
        ArrowDown:"backword",
        KeyD:"right",
        ArrowRight:"right",
        ShiftLeft:"shift",
        ShiftRight:"shift"
    }

const findKey=(key:any)=>keys[key]

useEffect(()=>{
    const handleDown=(e:any)=>{
       
        
        setInput((m)=>({...m,[findKey(e.code)]:true}))
    }

    const handleUp=(e:any)=>{
        setInput((m)=>({...m,[findKey(e.code)]:false}))

    }
document.addEventListener("keydown",handleDown)
document.addEventListener("keyup",handleUp)

return ()=>{
    document.addEventListener("keydown",handleDown)
document.addEventListener("keyup",handleUp)
}
},[])
    return input
}