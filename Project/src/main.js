import* as THREE from 'three'
import{GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

// made gameplay scene
const GameplayScene = new THREE.Scene();

// made perspective camera

const MainCamera=new THREE.PerspectiveCamera
(
30,
window.innerWidth/window.innerHeight,
0.1,
1000
)

// made canvas
const Canvas= document.querySelector('canvas.three')

// made renderer
const Renderer=new THREE.WebGLRenderer({canvas:Canvas,antialias:true});
//const controls=new OrbitControls(MainCamera,Renderer.domElement)
//controls.enableDamping=true

// import player
const ModelLoader=new GLTFLoader();
let player;
let animMixer;
let idle
let jump
let walk
ModelLoader.load('/Models/Player.glb',(gltf)=>
{
   player=gltf.scene;
   player.rotation.y=135
   GameplayScene.add(player)

 animMixer=new THREE.AnimationMixer(player)
 idle=animMixer.clipAction(gltf.animations[4])
 jump=animMixer.clipAction(gltf.animations[3])
  walk=animMixer.clipAction(gltf.animations[1])
idle.play()

})


let currentAction;

function fadeToAction(newAction, duration = 0.3) {
  if (currentAction !== newAction) {
    if (currentAction) {
      currentAction.fadeOut(duration);
    }
    newAction.reset().fadeIn(duration).play();
    currentAction = newAction;
  }
}


// made light
const light = new THREE.DirectionalLight(
  'white', 5);
light.position.set(5, 10, 5);


GameplayScene.add(MainCamera,light)
// made skybox
const skyboxLoader=new THREE.TextureLoader()

 const skybox= skyboxLoader.load('/Skybox/Sky0002_Day.png')

GameplayScene.background=skybox
// Made Environmert
const GroundMesh=new THREE.BoxGeometry
(
  5,0.1,1000

)
const groundLoader=new THREE.TextureLoader()
const groundtexture=groundLoader.load('/Textures/dark-rocks-texture.jpg')
groundtexture.wrapS=THREE.MirroredRepeatWrapping
groundtexture.wrapT=THREE.MirroredRepeatWrapping
groundtexture.repeat.set(2,70)


const GroundMat=new THREE.MeshStandardMaterial
({
  color:"gray",
  map:groundtexture,
  roughnessMap:groundtexture,

 
 
  
}

)

const Ground=new THREE.Mesh(GroundMesh,GroundMat);

GameplayScene.add(Ground)


// add window resize listener

addEventListener('resize',()=>{
Renderer.setSize(window.innerWidth,window.innerHeight)
MainCamera.aspect=window.innerWidth/window.innerHeight;
MainCamera.updateProjectionMatrix()
})

// Get Input
const Keys={}
addEventListener('keydown',(event)=>{
  Keys[event.key.toLowerCase() || event.key.toUpperCase()]=true;
})
addEventListener('keyup',(event)=>{
  Keys[event.key.toLowerCase() || event.key.toUpperCase()]=false;
})
// raycast
const raycaster=new THREE.Raycaster()
const down=new THREE.Vector3(0,-1,0)
function CheckGround()
{
  if(player!=null)
  {

    const origin = player.position.clone();
    origin.y += 0.5; // just above the feet

    raycaster.set(origin, down);
    const intersects = raycaster.intersectObjects([Ground], true);

    if (intersects.length > 0) {
      return intersects[0]; // return the intersection data
    }
  }
  return null;
}
// PlayerMovement
function PlayerMovement(delta) {
  if (player) {
    if (Keys["w"] || Keys["s"] || Keys["a"] || Keys["d"]) {
      // move player
      if (Keys["w"]) player.position.z -= 2 * delta;
      if (Keys["s"]) player.position.z += 2 * delta;
      if (Keys["d"]) player.position.x += 2 * delta;
      if (Keys["a"]) player.position.x -= 2 * delta;

      fadeToAction(walk); // smoothly switch to walk
    } else {
      fadeToAction(idle); // smoothly switch back to idle
    }
    const hit = CheckGround();
if (hit) {
  // put player on top of ground
  player.position.y = hit.point.y + 1; // +1 = half player height
} else {
  // apply gravity
  player.position.y -= 5 * delta;
}
   
  }
}
const Cameraoffset=new THREE.Vector3(0,2,10)
function CameraMovement()
{
  if(player!=null)
  {
 const camerapos=new THREE.Vector3().copy( player.position).add(Cameraoffset)
 MainCamera.position.copy(camerapos)


  }


}

// player aniamtions

// made update 
const clock=new THREE.Clock();
let currentTime;
let previousTime;

const Update=()=>{
  currentTime=clock.getElapsedTime()
  let delta=currentTime-previousTime
  previousTime=currentTime
  if (animMixer) animMixer.update(delta); 
PlayerMovement(delta)
CameraMovement()


Renderer.render(GameplayScene,MainCamera)
  requestAnimationFrame(Update)
}
Update()