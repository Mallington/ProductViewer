// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

var r = 'https://threejs.org/examples/textures/cube/Bridge2/';
var urls = [r + 'posx.jpg', r + 'negx.jpg',
r + 'posy.jpg', r + 'negy.jpg',
r + 'posz.jpg', r + 'negz.jpg'];

textureCube = new THREE.CubeTextureLoader().load(urls);
textureCube.encoding = THREE.sRGBEncoding;
var material = new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: textureCube, shading: THREE.SmoothShading });

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry(1, 1, 1);
var cube = new THREE.Mesh(geometry, material);

// Add cube to Scene
scene.add(cube);

var light = new THREE.PointLight(0xff0000, 10, 100);
light.position.set(50, 50, 50);
scene.add(light);

// Render Loop
var render = function () {
    requestAnimationFrame(render);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
};

render();