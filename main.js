console.log("Online");

let app = new PIXI.Application({
    width: window.visualViewport.width * .9,
    heigth: 450,
    backgroundColor: 0xdddddd
}); // 16:9 * 50

app.view.id = "stage";
document.body.appendChild(app.view);

// let scene1BG = PIXI.Sprite.from('img/bg-two.png');
// scene1BG.width = app.view.width;
// scene1BG.height = app.view.height;
// app.stage.addChild(scene1BG);

// let fish1 = PIXI.Sprite.from("img/fish-1.png");
// fish1.x = 200;
// fish1.y = 100;
// fish1.anchor.set(.5);
// fish1.rotation = 45;
// fish1.tint = 0xffaaaa;
// fish1.width = 100;
// fish1.scale.x = 2;