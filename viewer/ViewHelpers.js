function createControls(camera, renderer) {


    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = [65, 83, 68];
    return controls
}

function bindObjectToKeys(scene, cube) {
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

function markVertices(object, draw) {
    if (object.type == "Mesh") {
        for (var vert in object.geometry.vertices) {
            var p = object.geometry.vertices[vert];
            var marker = draw();
            marker.position.set(p.x, p.y, p.z);
            object.add(marker);
        }
    }
    else if (object.type == "Group") {
        object.children.forEach((child) => markVertices(child));
    }
    else {
        throw "Unsupported object type: " + object.type;
    }
}