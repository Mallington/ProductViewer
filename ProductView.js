//import { VRButton } from "./VRButton.js";
init();
animate();
var rot = 0;
var dir = 1;
var camera, scene, renderer, ambientLight, controls;

var lastUpdate = Date.now();

var constructLinesGroup, card;
new THREE.BoxBufferGeometry
function helper(scene, cube) {
    window.onkeypress = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        var amount = 1;
        console.log(key);
        switch (key) {
            case 87: //forwards
                cube.position.x += amount;
                break;
            case 83: //backwards
                cube.position.x -= amount;
                break;
            case 65: //left
                cube.position.z -= amount;
                break;
            case 68: //up
                cube.position.z += amount;
                break;
            case 93: //up
                cube.position.y += amount;
                break;
            case 92: //down
                cube.position.y -= amount;
                break;

        }
        if (key == 38) {
            cube.position.x += amount;
        } else if (key == 40) {
            cube.position.x -= amount;
        }
    };
}
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
    //renderer.setClearColor("#FFFFFF");

    renderer.autoClear = false;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;


    document.body.appendChild(renderer.domElement);

    constructLinesGroup.add(new THREE.GridHelper(10, 20, 0xffffff));
    drawAxis(constructLinesGroup, 500);
    //scene.add(constructLinesGroup);

    var r = 'https://threejs.org/examples/textures/cube/Bridge2/';
    var urls = [r + 'posx.jpg', r + 'negx.jpg',
    r + 'posy.jpg', r + 'negy.jpg',
    r + 'posz.jpg', r + 'negz.jpg'];

    var envTexture = new THREE.CubeTextureLoader().load(urls);

    scene.background = envTexture;
    var anonymous = '{"scale":{"x":5,"y":5,"z":5},"position":{"x":100.24019505512533,"y":38,"z":57.03019959486946},"rotation":{"_x":-1.5707963267948966,"_y":0,"_z":-1.9234240736264039,"_order":"XYZ"},"width":1.5,"height":2,"thickness":0.3}';
    card = new CardObject(1.5, 2, 0.3, 0.03, envTexture);
    scene.add(card);
    card.scale.set(5, 5, 5);
    card.position.set(100.24019505512533, 38, 57.03019959486946);
    card.rotation.set(-1.5707963267948966, 0, -1.9234240736264039)


    //loadeTexturedModel('models/room', scene);
    loadGLTF('scenes/office_interior/scene.gltf', scene);
    helper(scene, card);

    /*new THREE.CubeTextureLoader()
        .setPath('cubemaps/bridge/')
        .load(

            // urls of images used in the cube texture
            [
                'posx.jpg',
                'negx.jpg',
                'posy.jpg',
                'negy.jpg',
                'posz.jpg',
                'negz.jpg'
            ],

            // what to do when loading is over
            function (cubeTexture) {
                console.log('Background');
                // CUBE TEXTURE is also an option for a background
                scene.background = cubeTexture;

                renderer.render(scene, camera);

            }

        ); */


    //draw360Background(scene, "bookStore.jpg");

    // Handle resizing of the browser window.
    window.addEventListener("resize", handleResize, false);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = card.position;

    /*controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enablePan = false;
    controls.enableZoom = false; */
}
function animate() {
    if (card != undefined) {
        dir = rot > Math.PI / 4 || rot < 0 ? -dir : dir;
        card.front.rotation.y = -((rot += 0.001 * dir));
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

function loadTexture(base) {
    var material = new THREE.CubeTextureLoader().load([`${base}/posx.jpg`, `${base}/negx.jpg`, `${base}/posy.jpg`, `${base}/negy.jpg`, `${base}/posz.jpg`, `${base}/negz.jpg`]);
    material.encoding = THREE.sRGBEncoding;
    return material;
}

function loadGLTF(location, scene) {
    var loader = new THREE.GLTFLoader();
    loader.load(
        // resource URL
        location,
        // called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            console.log(gltf.cameras);

        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );
}

function loadeTexturedModel(file, scene) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(file + '.mtl', function (materials) {

        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load(file + '.obj', function (mesh) {

            mesh.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(mesh);
            mesh.position.set(-1200, -75, 30);
            mesh.rotation.y = -Math.PI / 4;
        });

    });
}