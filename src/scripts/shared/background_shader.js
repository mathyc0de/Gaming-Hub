const THREE = require('three')
var loader = new THREE.FileLoader();
let vertex;
let fragment;

class Background {
    constructor() {
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
          }
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);
        const canvas = this.canvas = document.querySelector('.webgl')
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setClearColor(0x6a041a);
        this.loadShaders().then(() => this.render())
    }

    async loadShaders() {
        vertex = await loader.loadAsync('./shaders/vertex.glsl')
        fragment = await loader.loadAsync('./shaders/fragment.glsl')
    }
    render() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        const geometry = new THREE.IcosahedronGeometry(1,30);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment
            });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.position.z = 5;
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        console.log(innerWidth)
        this.sizes.width = innerWidth
        this.sizes.height = innerHeight
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.sizes.width, this.sizes.height)
    }

}


module.exports = { Background };