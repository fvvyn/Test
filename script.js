// Three.js 初期設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // 背景：白
renderer.outputEncoding = THREE.sRGBEncoding; // 色の補正（大事）
document.body.appendChild(renderer.domElement);

// 光源（環境光＋方向性ライト＋ヘミスフィア）
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// カメラ操作コントロール
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;       
controls.dampingFactor = 0.05;

// 自動回転制御
let model;
let isUserInteracting = false;
controls.addEventListener('start', () => isUserInteracting = true);
controls.addEventListener('end', () => isUserInteracting = false);

// モデル読み込み
const loader = new THREE.GLTFLoader();
loader.load(
  'fvvyn.glb',
  function (gltf) {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide;
        child.material.transparent = false;
        child.material.opacity = 1.0;

        // ✨ 金属っぽい質感
        child.material.metalness = 1.0;
        child.material.roughness = 0.1;

        // 色を固定したい場合だけ↓
        // child.material.color.set(0xdddddd);
      }
    });

    // 🔍 小さかったら拡大
    model.scale.set(10, 10, 10);
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('エラー発生:', error);
  }
);

// カメラ初期位置
camera.position.set(0, 1, 5);

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  // ⏱ 自動回転（触ってないときだけ）
  if (model && !isUserInteracting) {
    model.rotation.y += 0.015; // ← 少し速め
  }

  controls.update(); // 惰性効果
  renderer.render(scene, camera);
}
animate();

// リサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
