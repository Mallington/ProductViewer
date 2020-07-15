function createControls(camera, renderer) {


    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = [65, 83, 68];
    return controls

}
export default class ProductViewer extends THREE.Scene {

    constructor(canvas) {
        super();
        this.rot = 0;
        this.dir = 1;
        this.drawCanvas = canvas;
        this.lastUpdate = Date.now()
        this.init();
        this.animate = this.animate.bind(this);
        this.animate();
    }


    addHelper(scene, cube) {
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
    draw360Background(scene, image) {
        var geometry = new THREE.SphereBufferGeometry(500, 60, 40);

        geometry.scale(-1, 1, 1);

        var texture = new THREE.TextureLoader().load(image);
        var material = new THREE.MeshBasicMaterial({ map: texture });

        var mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
    }

    init() {
        this.camera = new THREE.PerspectiveCamera(45, this.drawCanvas.width / this.drawCanvas.height, 0.1, 1000);
        this.camera.position.set(-15, 10, 20);

        // Basic ambient lighting.
        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.ambientLight.intensity = 0.7;
        this.add(this.ambientLight);


        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.drawCanvas });
        this.renderer.setSize(this.drawCanvas.width / window.devicePixelRatio, this.drawCanvas.height / window.devicePixelRatio);
        this.renderer.setPixelRatio(window.devicePixelRatio); // HiDPI/retina rendering
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        var r = 'https://threejs.org/examples/textures/cube/Bridge2/';
        var urls = [r + 'posx.jpg', r + 'negx.jpg',
        r + 'posy.jpg', r + 'negy.jpg',
        r + 'posz.jpg', r + 'negz.jpg'];

        var envTexture = new THREE.CubeTextureLoader().load(urls);

        this.background = envTexture;
        this.card = new CardObject(1.5, 2, 0.3, 0.03, envTexture);
        this.add(this.card);
        this.card.scale.set(5, 5, 5);
        this.card.position.set(100.24019505512533, 38, 57.03019959486946);
        this.card.rotation.set(-1.5707963267948966, 0, -1.9234240736264039)

        this.loadGLTF('/scenes/office_interior/scene.gltf', this);

        this.controls = createControls(this.camera, this.renderer);
        this.controls.target = this.card.position;


        //controls.

        //controls.minPolarAngle = controls.maxPolarAngle = 1.57079

        /*controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enablePan = false;
        controls.enableZoom = false; */
    }
    animate() {
        /* if (this.card != undefined) {
             this.dir = this.rot > Math.PI / 4 || this.rot < 0 ? -this.dir : this.dir;
             this.card.front.rotation.y = -((this.rot += 0.001 * this.dir));
         } */

        this.controls.update();
        requestAnimationFrame(this.animate);
        this.renderer.render(this, this.camera);
        this.lastUpdate = Date.now();
    }

    drawAxis(scene, length) {
        scene.add(drawAxisLine("red", length, 0, 0));
        scene.add(drawAxisLine("red", -length, 0, 0));

        scene.add(drawAxisLine("green", 0, length, 0));
        scene.add(drawAxisLine("green", 0, -length, 0));

        scene.add(drawAxisLine("blue", 0, 0, length));
        scene.add(drawAxisLine("blue", 0, 0, -length));
    }
    drawAxisLine(color, endX, endY, endZ) {
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

    loadTexture(base) {
        var material = new THREE.CubeTextureLoader().load([`${base}/posx.jpg`, `${base}/negx.jpg`, `${base}/posy.jpg`, `${base}/negy.jpg`, `${base}/posz.jpg`, `${base}/negz.jpg`]);
        material.encoding = THREE.sRGBEncoding;
        return material;
    }

    loadGLTF(location, scene) {
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

    loadeTexturedModel(file, scene) {
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
}

//export { ProductViewer };