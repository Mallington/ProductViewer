THREE.Object3D.prototype.updateMatrix = function () {
  this.matrix.compose(this.position, this.quaternion, this.scale);

  if (this.pivot && this.pivot.isVector3) {
    var px = this.pivot.x;
    var py = this.pivot.y;
    var pz = this.pivot.z;

    var te = this.matrix.elements;

    te[12] += px - te[0] * px - te[4] * py - te[8] * pz;
    te[13] += py - te[1] * px - te[5] * py - te[9] * pz;
    te[14] += pz - te[2] * px - te[6] * py - te[10] * pz;
  }

  this.matrixWorldNeedsUpdate = true;
};

class CardObject {
  //Generate a mesh for each render mode and adds it to a list
  constructor(scene, width, height, thickness, pageRatio) {
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.allPieces = new THREE.Group();

    this.generatePieces(this.allPieces, pageRatio);
    scene.add(this.allPieces);
  }

  generatePieces(group, pageRatio) {
    var frontMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x444444,
    });
    var backMaterial = new THREE.MeshPhongMaterial({
      color: 0x001f,
      emissive: 0x444444,
    });

    this.front = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.thickness * (1 - pageRatio), 4, 4, 1),
      frontMaterial
    );
    this.back = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.thickness * (1 - pageRatio), 4, 4, 1),
      frontMaterial
    );

    var frontGroup = new THREE.Group();
    this.front.pivot = new THREE.Vector3(-this.width / 2, 0, -(this.thickness * pageRatio) / 2);
    frontGroup.add(this.front);
    frontGroup.position.set(0, 0, this.thickness / 2);

    group.add(this.back, frontGroup);
  }

  setOpenAngle(angle) {
    this.front.rotation.y = -angle;
  }

  update() {}
}
