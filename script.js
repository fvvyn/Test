const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// 環境マップ設定
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

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 2.5;
controls.enableZoom = false;
controls.enablePan = false;

let model, pivot;
let isUserInteracting = false;

controls.addEventListener('start', () => {
  isUserInteracting = true;

  // 操作中は片面表示（オプション）
  if (model) {
    model.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.FrontSide;
      }
    });
  }
});

controls.addEventListener('end', () => {
  isUserInteracting = false;

  // 操作終了後、両面に戻す
  if (model) {
    model.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide;
      }
    });
  }
});

// モデル読み込み
const loader = new THREE.GLTFLoader();
loader.load('fvvynmetal.glb', function (gltf) {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.metalness = 1.0;
      child.material.roughness = 0.1;
      child.material.color = new THREE.Color(0xffffff);
      child.material.side = THREE.DoubleSide;
    }
  });

  model.scale.setScalar(1.0);
  model.position.set(0, 0, 0);

  pivot = new THREE.Object3D();
  pivot.add(model);
  scene.add(pivot);
}, undefined, function (error) {
  console.error('モデル読み込みエラー:', error);
});

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  if (pivot && !isUserInteracting) {
    pivot.rotation.y += 0.06; // ← 自動回転スピード
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
