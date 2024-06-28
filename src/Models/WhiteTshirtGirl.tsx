import * as THREE from 'three'
import{  useEffect, useRef } from 'react'
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from 'react-three-fiber'
import { useInput } from '../utils/customHook/useUnpute'


let walkDirection=new THREE.Vector3();
let rotationAngle=new THREE.Vector3(0,1,0)
let rotationQuarternion=new THREE.Quaternion()
let camaraTarget=new THREE.Vector3()




type ActionName = 'idle' | 'run' | 'talk' | 'walk'
interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}


const directionOffset=({forward,backword,left,right}:any)=>{
 var directionOffset=0;
 if(forward){
   if(left){
    directionOffset= Math.PI /4
   }else if(right){
    directionOffset= -Math.PI /4

   }
 }else if(backword){
  if(left){
    directionOffset= Math.PI / 4 + Math.PI/2
   }else if(right){
    directionOffset= -Math.PI / 4 - Math.PI/2

   }else{
    directionOffset=Math.PI
   }
 }else if(left){
  directionOffset= Math.PI/2
 }else if(right){
  directionOffset= -Math.PI /2
 }

 return directionOffset
}

export function WhiteTshirtGirlModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials, animations }:any = useGLTF('../Models/whiteTshirtGirl.gltf') 
  const { actions } = useAnimations(animations, group)
  const { backword, forward, left, right, shift } = useInput()
  const currentAction = useRef<ActionName>('idle')
  const controlRef:any = useRef<typeof OrbitControls>()
  const { camera } = useThree()
 





  const updateCamaraTarget=(moveX:number,moveZ:number)=>{
    camera.position.x +=moveX
    camera.position.z +=moveZ

   if(group.current){
    
    
    camaraTarget.x = group.current?.position.x
    camaraTarget.y = group.current?.position.y + 2
    camaraTarget.z = group.current?.position.z

    if(controlRef.current) {
     

      
      controlRef.current.target = camaraTarget
    }


   }

  } 

//insial rendering for user
  useEffect(()=>{
 actions.idle?.reset().play()
  },[])
  useEffect(() => {
    let action: ActionName = 'idle'
    if (forward || backword || left || right) {
      action = 'walk'
      if (shift) {
        action = 'run'
      }
    } else {
      action = 'idle'
    }

    if (currentAction.current !== action) {
      const nextToPlay = actions[action]
      const current = actions[currentAction.current]
      if (current) {
        current.fadeOut(0.3)
      }
      if (nextToPlay) {
        nextToPlay.reset().fadeIn(0.3).play()
      }
      currentAction.current = action
    }
  }, [backword, forward, left, right, shift, actions])

  useFrame((state, delta) => {
   
    
    if (currentAction.current === 'run' || currentAction.current === 'walk') {
      if (group.current) {
        let angleYCamaraDirection=Math.atan2(
          camera.position.x - group.current.position.x,
          camera.position.z - group.current.position.z
        )

let newDirectionOffset=directionOffset({
  forward,backword,left,right
})

rotationQuarternion.setFromAxisAngle(
  rotationAngle,
  angleYCamaraDirection + newDirectionOffset
)

console.log(rotationAngle)
group.current.quaternion.rotateTowards(rotationQuarternion,0.2)


camera.getWorldDirection(walkDirection)
walkDirection.y=0;
walkDirection.normalize()
walkDirection.applyAxisAngle(rotationAngle,newDirectionOffset)


const velocity=currentAction.current=='run' ? 10: 5

const moveX=walkDirection.x * velocity *delta
const moveZ=walkDirection.z * velocity *delta

group.current.position.x += moveX
group.current.position.z += moveZ

updateCamaraTarget(moveX,moveZ)

      }


      
    }


  })

  return (
    <>
      <OrbitControls ref={controlRef} />
      <group ref={group} {...props} dispose={null}>
        <group name="Scene" >
          <group name="Armature002" position={[0, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI]} scale={0.012}>
            <primitive object={nodes.mixamorig2Hips} />
            <skinnedMesh name="Ch22_Body" geometry={nodes.Ch22_Body.geometry} material={materials.Ch22_body} skeleton={nodes.Ch22_Body.skeleton} />
            <skinnedMesh name="Ch22_Eyelashes" geometry={nodes.Ch22_Eyelashes.geometry} material={materials.Ch22_hair} skeleton={nodes.Ch22_Eyelashes.skeleton} />
            <skinnedMesh name="Ch22_Hair" geometry={nodes.Ch22_Hair.geometry} material={materials.Ch22_hair} skeleton={nodes.Ch22_Hair.skeleton} />
            <skinnedMesh name="Ch22_Pants" geometry={nodes.Ch22_Pants.geometry} material={materials.Ch22_body} skeleton={nodes.Ch22_Pants.skeleton} />
            <skinnedMesh name="Ch22_Shirt" geometry={nodes.Ch22_Shirt.geometry} material={materials.Ch22_body} skeleton={nodes.Ch22_Shirt.skeleton} />
            <skinnedMesh name="Ch22_Sneakers" geometry={nodes.Ch22_Sneakers.geometry} material={materials.Ch22_body} skeleton={nodes.Ch22_Sneakers.skeleton} />
          </group>
        </group>
      </group>
    </>
  )
}

useGLTF.preload('../Models/whiteTshirtGirl.gltf')
