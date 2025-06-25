// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 環境光＆方向光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// コントロール（マウスで回転できる）
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// GLTFLoaderでdog.glbを読み込む
const loader = new THREE.GLTFLoader();
loader.load('dog.glb', function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0, 0, 0);
}, undefined, function (error) {
  console.error('エラー発生:', error);
});

// カメラ位置
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
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
