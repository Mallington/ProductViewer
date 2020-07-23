# ProductViewer
Built for the purposes of visualising customisable printed products in various environments and lighting conditions.
## Example Usage
## HTML
```HTML
<canvas width="1000px" height="500px" id="maincanvas"></canvas>
<script src="./build/viewer.js"></script>
```
## Javascript
```javascript
var viewer = new ProductViewer(document.getElementById("maincanvas"));
var textureMap = { frontCover: "book/nx.png", binding: "book/nz.png", backCover: "book/px.png" };
var card = new CardObject(1.5, 2, 0.3, 0.03, textureMap, null);
viewer.addCard(card);
```
## Preview
<p align="center">
  <img height="250" src="https://github.com/Mallington/ProductViewer/blob/dev/docs/animations/main.gif?raw=true">
</p>
