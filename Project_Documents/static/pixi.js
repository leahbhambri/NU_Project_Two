// var app; 

//         function initPixi() {
//             app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
//             // document.body.appendChild(app.view);
//             document.body.appendChild(app.view);
//             var image = new PIXI.Sprite.from("images/CleanvsDirtyWater.jpg");
//             image.width = window.innerWidth;
//             // image.height = window.innerHeight;
//             image.height = "500px";
//             app.stage.addChild(image);

//             displacementSprite = new PIXI.Sprite.from("images/Clouds.jpg");
//             displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
//             displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
//             app.stage.addChild(displacementSprite);
//             app.stage.filters = [displacementFilter];
//             animate();
//         }
//         function animate() {
//         displacementSprite.x += 10;
//         displacementSprite.y += 4;
//         requestAnimationFrame(animate);
//     }
//     initPixi();