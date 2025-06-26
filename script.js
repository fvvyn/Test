// シーン、カメラ、レンダラー設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // 背景を白に設定
document.body.appendChild(renderer.domElement);

// 環境光（やや控えめに）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// 方向性ライト（メインの明かり）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// オプション：ヘミスフィアライトで自然な反射光
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// カメラ操作
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// GLTFモデル読み込み
const loader = new THREE.GLTFLoader();
loader.load(
  'base.glb',
  function (gltf) {
    const model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide; // ★ 追加！
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
