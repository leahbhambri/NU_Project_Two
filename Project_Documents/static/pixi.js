var app; 

        function initPixi() {
            app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight/6});
            // document.body.appendChild(app.view);
            document.getElementById("pixi-ripple").appendChild(app.view);
            image = new PIXI.Sprite.from("PixiImages/water.jpg");
            image.width = window.innerWidth;
            image.height = window.innerHeight/6;
            app.stage.addChild(image);

            displacementSprite = new PIXI.Sprite.from("PixiImages/Clouds.jpg");
            displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
            displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            app.stage.addChild(displacementSprite);
            app.stage.filters = [displacementFilter];
            animate();
            // for (var i = app.stage.children.length - 1; i >= 0; i--) {	app.stage.removeChild(app.stage.children[i]);}; 
            
        }
        function animate() {
        displacementSprite.x += 10;
        displacementSprite.y += 4;
        // image.x += 10;
        // image.y += 4;

        requestAnimationFrame(animate);

        
    }
    initPixi();