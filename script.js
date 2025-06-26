// Three.js シーン初期化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // 背景を白に
document.body.appendChild(renderer.domElement);

// 光源設定
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// カメラ操作（OrbitControls）
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// モデルとユーザー操作フラグ
let model;
let isUserInteracting = false;

// ユーザー操作の検出（OrbitControls）
controls.addEventListener('start', () => {
  isUserInteracting = true;
});
controls.addEventListener('end', () => {
  isUserInteracting = false;
});

// モデル読み込み（GLTF）
const loader = new THREE.GLTFLoader();
loader.load(
  'base.glb',
  function (gltf) {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide;
        child.material.transparent = false;
        child.material.opacity = 1.0;
        if (child.material.color) {
          child.material.color.set(0xffffff);
        }
      }
    });

    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('エラー発生:', error);
  }
);

// カメラ位置
camera.position.set(0, 1, 5);

// 描画ループ
function animate() {
  requestAnimationFrame(animate);

  // 自動回転（ユーザー操作中でない場合）
  if (model && !isUserInteracting) {
    model.rotation.y += 0.005;
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
