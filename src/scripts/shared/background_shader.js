// background_shader.js

const THREE = require('three');



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
        this.renderer.setClearColor(0x0005f);
        this.render()
        this.animate = this.animate.bind(this); // Bind the animate method to the correct context
    }


    render() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0xef8311 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.position.z = 5;
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
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