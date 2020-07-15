class ProductViewer extends THREE.Scene {

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
    init() {
        this.camera = new THREE.PerspectiveCamera(45, this.drawCanvas.width / this.drawCanvas.height, 0.1, 1000);
        this.camera.position.set(-15, 10, 20);

        // Basic ambient lighting.
        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.ambientLight.intensity = 0.7;
        this.add(this.ambientLight);


        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.drawCanvas });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(this.drawCanvas.width / window.devicePixelRatio, this.drawCanvas.height / window.devicePixelRatio);
        this.renderer.setPixelRatio(window.devicePixelRatio); // HiDPI/retina rendering
        //this.renderer.autoClear = false;
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

        loadGLTF('/scenes/office_interior/scene.gltf', this);

        this.controls = createControls(this.camera, this.renderer);
        this.controls.target = this.card.position;
    }
    animate() {
        this.controls.update();
        requestAnimationFrame(this.animate);
        this.renderer.render(this, this.camera);
        this.lastUpdate = Date.now();
    }
}