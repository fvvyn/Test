// Three.js 初期設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // 背景白
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// 光源
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// カメラ操作
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 自動回転用
let model;
let isUserInteracting = false;
controls.addEventListener('start', () => isUserInteracting = true);
controls.addEventListener('end', () => isUserInteracting = false);

// GLB読み込み
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

        // ✨ 金属質感に調整（必要に応じて）
        if ('metalness' in child.material) {
          child.material.metalness = 1.0;
        }
        if ('roughness' in child.material) {
          child.material.roughness = 0.1;
        }
      }
    });

    model.scale.set(10, 10, 10); // 拡大
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('読み込みエラー:', error);
  }
);

// カメラ位置
camera.position.set(0, 1, 5);

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  if (model && !isUserInteracting) {
    model.rotation.y += 0.015;
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
