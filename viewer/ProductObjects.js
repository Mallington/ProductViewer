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



class CardObject extends THREE.Group {
  //Generate a mesh for each render mode and adds it to a list
  constructor(width, height, thickness, pageRatio, texture, enviroment) {
    super();
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.enviroment = enviroment;
    this.texture = texture;
    this.buildPieces(this, pageRatio, enviroment, texture);
  }

  jsonifyCard(cardObj) {
    var anonymous = {
      scale: cardObj.scale,
      position: cardObj.position,
      rotation: cardObj.rotation,
      width: cardObj.width,
      height: cardObj.height,
      thickness: cardObj.thickness
    };
    return JSON.stringify(anonymous)
  }

  loadTextures(dict, loader, enviroment) {
    var ret = dict.map((texture) => (texture != null) ? loader.load(texture) : null);
    ret = ret.map((side) => new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: enviroment, map: side, combine: THREE.MixOperation, reflectivity: 0.1 }));
    return ret;
  }

  buildPieces(group, pageRatio, enviroment, texture) {
    var loader = new THREE.TextureLoader();

    var frontDict = [
      texture["pagesRight"],
      texture["binding"],
      texture["pagesTop"],
      texture["pagesBottom"],
      texture["frontCover"],
      texture["leftInsidePage"],
    ];
    var frontMaterial = this.loadTextures(frontDict, loader, enviroment);

    var backDict = [
      texture["pagesRight"],
      texture["binding"],
      texture["pagesTop"],
      texture["pagesBottom"],
      texture["rightInsidePage"],
      texture["backCover"],
    ];
    var backMaterial = this.loadTextures(backDict, loader, enviroment);

    this.front = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.thickness * pageRatio, 4, 4, 1),
      frontMaterial
    );
    this.front.pivot = new THREE.Vector3(-this.width / 2, 0, -(this.thickness * pageRatio) / 2);
    var frontGroup = new THREE.Group();
    frontGroup.add(this.front);
    frontGroup.position.set(0, 0, (this.thickness * pageRatio) / 2);

    this.back = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.thickness * (1 - pageRatio), 4, 4, 1),
      backMaterial
    );
    this.back.pivot = new THREE.Vector3(-this.width / 2, 0, (this.thickness * (1 - pageRatio)) / 2);
    var backGroup = new THREE.Group();
    backGroup.add(this.back);
    backGroup.position.set(0, 0, (-this.thickness * (1 - pageRatio)) / 2);

    group.add(backGroup, frontGroup);
  }

  openEvenly(angle) {
    this.front.rotation.y = -angle;
    this.back.rotation.y = angle;
  }

  setRatio(pageRatio) {
    this.children = [];
    var frontR = this.front.y;
    var backR = this.back.rotation;
    this.buildPieces(this, pageRatio, this.enviroment, this.texture);

    //this.front.y = frontR;
  }
}
