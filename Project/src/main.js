import* as THREE from 'three'
import{GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'

// made gameplay scene
const GameplayScene = new THREE.Scene();

// made perspective camera

const MainCamera=new THREE.PerspectiveCamera
(
70,
window.innerWidth/window.innerHeight,
0.1,
30
)
MainCamera.position.set(0, 2, 5);
// made canvas
const Canvas= document.querySelector('canvas.three')

// made renderer
const Renderer=new THREE.WebGLRenderer({canvas:Canvas,antialias:true});


// import player
const ModelLoader=new GLTFLoader();
let player;
ModelLoader.load('/Models/Model Idle.glb',(gltf)=>
{
   player=gltf.scene;
   player.rotation.y=135
   GameplayScene.add(player)

})



// made light
const light = new THREE.DirectionalLight(
  'white', 2);
light.position.set(5, 10, 5);


GameplayScene.add(MainCamera,light)
// made update 

const Update=()=>{

Renderer.render(GameplayScene,MainCamera)
  requestAnimationFrame(Update)
}
Update()

// add listener

addEventListener('resize',()=>{
Renderer.setSize(window.innerWidth,window.innerHeight)
MainCamera.aspect=window.innerWidth/window.innerHeight;
MainCamera.updateProjectionMatrix()
})

// PlayerMovement
const Keys={}
function PlayerMovement()
{
  if(player)
  {
    
  }
}