

import { Canvas} from '@react-three/fiber'
import {HomeTownModel} from '../Models/Home'

import { Physics } from '@react-three/cannon'

import {WhiteTshirtGirlModel} from '../Models/WhiteTshirtGirl'


const MetaHome=()=>{
  



    return (
        <>
        <div className="w-screen h-screen fixed">

       <Canvas shadows  >
     
        <ambientLight intensity={2}/>
       <directionalLight  />
       {/* <Helper type={} args={[10,'blue']} /> */}
       
     
  
  <Physics gravity={[0, -6.003, 0]} allowSleep={false} broadphase="SAP">
   

    <WhiteTshirtGirlModel/>
     <HomeTownModel />
   
    </Physics> 
       </Canvas>
        </div>

       
        </>
    )
}

export default MetaHome





  
