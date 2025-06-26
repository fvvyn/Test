// シーン、カメラ、レンダラー設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 環境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// コントロール設定
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// 🔧 ここを追加（GLTFLoaderのインスタンス）
const loader = new THREE.GLTFLoader();

// base.glb の読み込み
loader.load(
  'base.glb',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('エラー発生:', error);
  }
);

// カメラ位置設定
camera.position.set(0, 1, 5);

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// リサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

