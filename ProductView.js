"use strict";

init();
animate();
var rot = 0;
var dir = 1;
var camera, scene, renderer, ambientLight, controls;

var lastUpdate = Date.now();

var constructLinesGroup, card;
new THREE.BoxBufferGeometry

function draw360Background(scene, image) {
    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);

    geometry.scale(-1, 1, 1);

    var texture = new THREE.TextureLoader().load(image);
    var material = new THREE.MeshBasicMaterial({ map: texture });

    var mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
}

function init() {
    scene = new THREE.Scene();
    constructLinesGroup = new THREE.Group();
    // Set up the camera, move it to (3, 4, 5) and look at the origin (0, 0, 0).
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-15, 10, 20);

    // Basic ambient lighting.
    ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 0.7;
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // HiDPI/retina rendering
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#800000");

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    constructLinesGroup.add(new THREE.GridHelper(10, 20, 0xffffff));
    drawAxis(constructLinesGroup, 500);
    scene.add(constructLinesGroup);

    var urls = [
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png'
    ];
    var enivromentTexture = new THREE.CubeTextureLoader()
        .setPath('cubeMaps/bookstore/')
        .load(urls);
    scene.background = enivromentTexture;

    card = new CardObject(scene, 0.15, 0.2, 0.03, 0.2, enivromentTexture);
    card.front.material.needsUpdate = true;
    scene.add(card);

    //draw360Background(scene, "bookStore.jpg");

    // Handle resizing of the browser window.
    window.addEventListener("resize", handleResize, false);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    /*controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enablePan = false;
    controls.enableZoom = false; */
}
function animate() {
    if (card != undefined) {
        dir = rot > Math.PI / 4 || rot < 0 ? -dir : dir;
        card.openEvenly((rot += 0.001 * dir));
    }

    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    lastUpdate = Date.now();
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function drawAxis(scene, length) {
    scene.add(drawAxisLine("red", length, 0, 0));
    scene.add(drawAxisLine("red", -length, 0, 0));

    scene.add(drawAxisLine("green", 0, length, 0));
    scene.add(drawAxisLine("green", 0, -length, 0));

    scene.add(drawAxisLine("blue", 0, 0, length));
    scene.add(drawAxisLine("blue", 0, 0, -length));
}
function drawAxisLine(color, endX, endY, endZ) {
    var lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 1,
        linecap: "round", //ignored by WebGLRenderer
        linejoin: "round", //ignored by WebGLRenderer
    });

    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(endX, endY, endZ));
    var line = new THREE.Line(lineGeometry, lineMaterial);
    return line;
}