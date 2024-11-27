const THREE = require('three');
var loader = new THREE.FileLoader();
let vertex;
let fragment;

class Background {
    constructor() {
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);
        const canvas = this.canvas = document.querySelector('.webgl');
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setClearColor(0x6a041a);
        this.clock = new THREE.Clock();
        this.loadShaders().then(() => {
            this.createScene();
            this.tick();
        });
    }

    async loadShaders() {
        vertex = await loader.loadAsync('./shaders/vertex.glsl');
        fragment = await loader.loadAsync('./shaders/fragment.glsl');
    }

    createScene() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        const geometry = new THREE.IcosahedronGeometry(1, 30);
        this.uniforms = {
            uTime: { value: 0.0 }
        };
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: this.uniforms
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.position.z = 5;
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        const elapsedTime = this.clock.getElapsedTime();
        this.uniforms.uTime.value = elapsedTime;
        this.renderer.render(this.scene, this.camera);
    }

    // resize() {
    //     this.sizes.width = window.innerWidth;
    //     this.sizes.height = window.innerHeight;
    //     this.camera.aspect = this.sizes.width / this.sizes.height;
    //     this.camera.updateProjectionMatrix();
    //     this.renderer.setSize(this.sizes.width, this.sizes.height);
    // }
}

module.exports = { Background };