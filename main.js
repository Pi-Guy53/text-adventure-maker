console.log("Online");

let modalDialog = document.getElementsByClassName("modalDialog")[0];
modalDialog.className = "modalDialog-hidden";
let tempPlotID;

let plotList = []

document.querySelector('#modalButton-save').addEventListener('click', () => {
    // console.log(modalDialog);
    modalDialog.className = "modalDialog-hidden";

    if (tempPlotID != '') {
        let tPlot = findPlotByID(tempPlotID);

        let modalD = document.querySelector('#modalText');
        let modalTitle = document.querySelector('#modalTitle');

        tPlot.text = modalD.value;

        //console.log(tempPlotID);
        console.log(tPlot.text);

        modalD.value = '';
        modalTitle.innerHTML = '';
        tempPlotID = '';
    }
});

document.querySelector('#modalButton-cancel').addEventListener('click', () => {
    // console.log(modalDialog);
    modalDialog.className = "modalDialog-hidden";

    if (tempPlotID != '') {
        let modalD = document.querySelector('#modalText');
        let modalTitle = document.querySelector('#modalTitle');

        //console.log(tempPlotID);
        let tPlot = findPlotByID(tempPlotID);
        console.log(tPlot.text);

        modalD.value = '';
        modalTitle.innerHTML = '';
        tempPlotID = '';
    }
});

addPlot(); //TESTING
addPlot();
addPlot();

function addPlot() {
    let plotS = PIXI.Sprite.from('img/plot.png');
    let tId = "plot-" + plotList.length;

    plotS.anchor.set(.5, .5);
    plotS.width = 100;
    plotS.height = plotS.width * .75;

    plotS.x = 60 + plotList.length * 110;
    plotS.y = 75;

    plotS.id = tId;
    plotList.push(new Plot('', tId, plotS));

    plotS.eventMode = 'static';
    //plotS.interactive = true;

    plotTitle = new PIXI.Text(tId);
    plotTitle.anchor.set(.5, 1.5);
    plotTitle.width = plotS.width * .5;

    plotS.addChild(plotTitle);
    app.stage.addChild(plotS);

    plotS.addEventListener("mouseup", (e) => {
        modalDialog.className = "modalDialog";
        tempPlotID = e.target.id;

        let modalD = document.querySelector('#modalText');
        let modalTitle = document.querySelector('#modalTitle');

        let tPlot = findPlotByID(tempPlotID);

        modalD.value = tPlot.text;
        modalTitle.innerHTML = tPlot.id;

        //console.log(e);
    });

    plotS.addEventListener("rightdown", (e) => {
        e.preventDefault();
        console.log(e);

        //input custom menu
    });
}

//Prevent right clicks on the page for a custom context meun
//would prefer to just add to the existing one, but not sure how to do that RN
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    //input custom menu
});

function deletePlot(id) {

    console.log(plotList);

    const removedPlot = plotList.find(item => item.id == id);
    plotList = plotList.filter(item => item.id !== id);

    app.stage.removeChild(removedPlot.sprite);

    console.log(plotList);

    renderPlots();
}

function findPlotByID(id) {
    for (let i = 0; i < plotList.length; i++) {
        if (plotList[i].id == id) {
            return plotList[i];
        }
    }

    return false;
}

function renderPlots() {
    for (let i = 0; i < plotList.length; i++) {
        plotList[i].sprite.x = 60 + (i * 110);
        plotList[i].sprite.y = 75;
    }
}

console.log(plotList);

//!Window.localStorage
//Store data on the local browser


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