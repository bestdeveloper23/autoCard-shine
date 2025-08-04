import * as THREE from 'three';
import { BoxGeometry } from '../libs/geometry/Box.js';
import { SphereGeometry2 } from '../libs/geometry/Sphere.js';

class DashboardScenePreview {
  
  static generatePreview(canvas, projectData) {
    try {
      const container = canvas.parentNode;
      const containerWidth = container.offsetWidth || 300;
      const containerHeight = container.offsetHeight || 180;
      
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true, 
        alpha: false 
      });
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const bgColor = isDark ? 0x2a2a2a : 0xf5f5f5;
      renderer.setClearColor(bgColor);

      // Create scene
      const scene = new THREE.Scene();

      const gridSize = 100; 
      const grid1 = new THREE.GridHelper(gridSize, 100, 0x888888);
      grid1.material.color.setHex(0x888888);
      grid1.material.vertexColors = false;
      scene.add(grid1);
      
      const grid2 = new THREE.GridHelper(gridSize, 10, 0x222222);
      grid2.material.color.setHex(0x222222);
      grid2.material.vertexColors = false;
      scene.add(grid2);

      if (projectData && projectData.scene) {
        DashboardScenePreview.addObjects(scene, projectData.scene, gridSize);
      }

      const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 0);
      camera.position.set(15, 25, 5); 
      camera.lookAt(0, 0, 0);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(30, 30, 15);
      scene.add(directionalLight);

      // Render the scene
      renderer.render(scene, camera);
      
      // Cleanup
      renderer.dispose();
      scene.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      
      return true;
      
    } catch (error) {
      console.error('Error generating scene preview:', error);
      return false;
    }
  }
  static addObjects(scene, sceneData, gridSize = 100) {
    if (!sceneData || !sceneData.object || !sceneData.object.children) {
      return;
    }

    const scaleFactor = gridSize / 3000; // Adjust scale factor based on grid size (100/3000)
    const DEFAULT_COLOR = 0xff5c5c;

    function processObject(obj) {
      if (obj.type === 'Mesh' && obj.name && obj.geometry) {
        const position = obj.matrix ? [obj.matrix[12], obj.matrix[13], obj.matrix[14]] : [0, 0, 0];
        
        let geometry = null;
        if (obj.name === 'Box') {
          geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); // Slightly bigger for the larger grid
        } else if (obj.name === 'Sphere') {
          geometry = new THREE.SphereGeometry(1.2, 16, 16); // Slightly bigger
        } else {
          geometry = new THREE.BoxGeometry(2, 2, 2); // Bigger fallback
        }
        
        const material = new THREE.MeshLambertMaterial({ color: DEFAULT_COLOR });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
          position[0] * scaleFactor,
          position[1] * scaleFactor,
          position[2] * scaleFactor
        );
        
        mesh.scale.set(3.5, 3.5, 3.5); // Increased scale for better visibility
        scene.add(mesh);
      }
      
      if (obj.children) {
        obj.children.forEach(child => processObject(child));
      }
    }
    
    processObject(sceneData.object);
  }
}

export { DashboardScenePreview };