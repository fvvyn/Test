const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// HDR環境マップでシルバー反射
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
new THREE.RGBELoader()
  .setPath('https://rawcdn.githack.com/mrdoob/three.js/dev/examples/textures/equirectangular/')
  .load('royal_esplanade_1k.hdr', function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
  });

// ライト設定
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// カメラ操作
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

let model, pivot;
let isUserInteracting = false;
controls.addEventListener('start', () => isUserInteracting = true);
controls.addEventListener('end', () => isUserInteracting = false);

// ロゴ読み込み（Blenderで原点調整済み）
const loader = new THREE.GLTFLoader();
loader.load('fvvynmetal.glb', function (gltf) {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.metalness = 1.0;
      child.material.roughness = 0.1;
      child.material.color = new THREE.Color(0xffffff);
    }
  });

  // そのまま追加（位置ズレなし前提！）
  pivot = new THREE.Object3D();
  pivot.add(model);
  scene.add(pivot);
}, undefined, function (error) {
  console.error('モデル読み込みエラー:', error);
});

// カメラ位置
camera.position.set(0, 0, 5);

// アニメーション
function animate() {
  requestAnimationFrame(animate);
  if (pivot && !isUserInteracting) {
    pivot.rotation.y += 0.01;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

// リサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
