class ProductViewer extends THREE.Scene {

    constructor(canvas) {
        super();
        this.rot = 0;
        this.dir = 1;
        this.drawCanvas = canvas;
        this.lastUpdate = Date.now()
        this.init();
        this.animate = this.animate.bind(this);
        this.update = true;
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


        /*var r = 'https://threejs.org/examples/textures/cube/Bridge2/';
        var urls = [r + 'posx.jpg', r + 'negx.jpg',
        r + 'posy.jpg', r + 'negy.jpg',
        r + 'posz.jpg', r + 'negz.jpg'];

        var envTexture = new THREE.CubeTextureLoader().load(urls);

        this.background = envTexture;

        loadGLTF('/scenes/office_interior/scene.gltf', this); */

        this.controls = createControls(this.camera, this.renderer);
        var temp = this.controls.update;
        this.controls.update = () => { temp(); this.update = true; };

        this.update = true;
    }
    animate() {
        //this.controls.update();
        requestAnimationFrame(this.animate);

        if (this.update) {
            this.renderer.render(this, this.camera);
            console.log("r");
            this.update = false;
        }

        this.lastUpdate = Date.now();
    }

    addCard(card) {
        this.controls.target = card.position;
        this.add(card);
    }
}