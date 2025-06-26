const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// 💡 光源（強め & 全方向）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 10, 10);
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// カメラ操作
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let model;
const loader = new THREE.GLTFLoader();
loader.load(
  'fvvyn.glb',
  (gltf) => {
    model = gltf.scene;
    model.scale.set(10, 10, 10);
    model.position.set(0, 0, 0);

    // 🎨 質感を強制的に金属に上書き！
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xdddddd,
          metalness: 1.0,
          roughness: 0.1,
          side: THREE.DoubleSide
        });
      }
    });

    scene.add(model);
  },
  undefined,
  (err) => console.error('読み込みエラー:', err)
);

camera.position.set(0, 2, 5);

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
