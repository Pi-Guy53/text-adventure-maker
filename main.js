console.log("Online");

let modalDialog = document.getElementsByClassName("modalDialog")[0];
modalDialog.className = "modalDialog-hidden";
let tempPlotID;

let plotList = [];
let totalPlotLength = 0; //num of all plots ever made

let contextPlotId;

let offsetX = 0, offsetY = 0;

//Save And Close Modal
document.querySelector('#modalButton-save').addEventListener('click', () => {
    // console.log(modalDialog);
    modalDialog.className = "modalDialog-hidden";

    if (tempPlotID != '') {
        let tPlot = findPlotByID(tempPlotID);
        tPlot.sprite.tint = 0xffffff; //remove selected tint

        let modalD = document.querySelector('#modalText');
        let modalTitle = document.querySelector('#modalTitle');

        tPlot.text = modalD.value; //set the inner text to what the user typed
        let txt = modalD.value;

        if (txt.length > 0) {
            tPlot.txtBox.text = "       " + txt.slice(0, 56).trim() + "..."; //add preview text to the plot
        }
        else {
            tPlot.txtBox.text = "~empty~";
        }

        console.log(tPlot.text);

        modalD.value = '';
        modalTitle.innerHTML = '';
        tempPlotID = '';
    }
});

//Close Without Saving Modal
document.querySelector('#modalButton-cancel').addEventListener('click', () => {
    // console.log(modalDialog);
    modalDialog.className = "modalDialog-hidden";

    if (tempPlotID != '') {
        let tPlot = findPlotByID(tempPlotID);
        tPlot.sprite.tint = 0xffffff;//remove selected tint

        let modalD = document.querySelector('#modalText');
        let modalTitle = document.querySelector('#modalTitle');

        console.log(tPlot.text);

        modalD.value = '';
        modalTitle.innerHTML = '';
        tempPlotID = '';
    }
});

addPlot(); //TESTING
addPlot();
addPlot();

//creats a new plot
function addPlot(inputText) {
    let plotS = PIXI.Sprite.from('img/plot.png');
    let tId = "plot-" + totalPlotLength;
    totalPlotLength++;

    plotS.anchor.set(.5, .5);
    plotS.width = 100;
    plotS.height = plotS.width * .75;

    plotS.x = 60 + plotList.length * 110;
    plotS.y = 75;

    plotS.id = tId;

    plotS.eventMode = 'static'; //new interaction api
    //plotS.interactive = true;

    let plotTxtStyle = new PIXI.TextStyle({
        wordWrap: true,
        fontSize: 16
    });

    plotTitle = new PIXI.Text('~empty~', plotTxtStyle);
    plotTitle.anchor.set(.5, .5);
    plotTitle.scale.x = 1;
    plotTitle.scale.y = 1.25;
    plotTitle.resolution = 2;

    //add plot to the plot list
    plotList.push(new Plot('', tId, plotS, plotTitle));


    if (inputText != null) {
        plotTitle.text = "       " + inputText.slice(0, 56).trim() + "...";
        findPlotByID(tId).text = inputText;
    }

    //add children
    plotS.addChild(plotTitle);
    app.stage.addChild(plotS);

    plotS.addEventListener("mouseup", (e) => {
        if(plotS.dragging)
        {
            plotS.dragging = false;
        }
        else
        {
            modalDialog.className = "modalDialog";
            tempPlotID = e.target.id;

            let modalD = document.querySelector('#modalText');
            let modalTitle = document.querySelector('#modalTitle');

            let tPlot = findPlotByID(tempPlotID);

            for (let i = 0; i < plotList.length; i++) { //removes the tint for all plots
                plotList[i].sprite.tint = 0xffffff;
            }

            tPlot.sprite.tint = 0xaaaaaa;

            modalD.value = tPlot.text;
            modalTitle.innerHTML = tPlot.id;
        }
    });

    plotS.addEventListener("rightup", (e) => {
        e.preventDefault();
        showContextMenu(e.client.x, e.client.y, e.target.id);
        
        console.log(e);
    });

    plotS.dragging = false;

    plotS.addEventListener("mousedown", function (e) {
        plotS.dragging = true;
        offsetX = plotS.x - e.data.global.x;
        offsetY = plotS.y - e.data.global.y;
    });

    //console.log(app.view.width, app.view.height);

    // const h = app.stage.height;

    plotS.addEventListener("mousemove", function (e) {
        //console.log(e);
        if (plotS.dragging) {
            //console.log(e);
            plotS.x = Math.min(Math.max(e.data.global.x + offsetX, 0), app.view.width);
            plotS.y = Math.min(Math.max(e.data.global.y + offsetY, 0), app.view.height);

            console.log(e.data.global.y + offsetY, plotS.x, plotS.y);
        }
    });

    //plotS.addEventListener("contextmenu", (e) => { e.preventDefault(); });
}

//Prevent right clicks on the page for a custom context meun
//would prefer to just add to the existing one, but not sure how to do that RN
app.view.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

app.view.addEventListener("mousedown", (e) => {
    if(e.button == 2)
    {
        e.preventDefault();
        hideContextMenu();
    }
});

app.view.addEventListener("click", (e) => {
    e.preventDefault();
    hideContextMenu();
});

//deletes the specified plot
function deletePlot(id) {

    console.log(plotList);

    const removedPlot = plotList.find(item => item.id == id);
    plotList = plotList.filter(item => item.id !== id);

    app.stage.removeChild(removedPlot.sprite);

    console.log(plotList);

    renderPlots();
}

//finds a plot using the given id
function findPlotByID(id) {
    for (let i = 0; i < plotList.length; i++) {
        if (plotList[i].id == id) {
            return plotList[i];
        }
    }

    return false;
}

//render the plots into a grid //Will be removed once I had custom plot positions
function renderPlots() {
    for (let i = 0; i < plotList.length; i++) {
        plotList[i].sprite.x = 60 + (i * 110);
        plotList[i].sprite.y = 75;
    }
}

//ContextMenu functions
function showContextMenu(posX, posY, plotId) {
    contextPlotId = plotId;

    const hiddenContextMenu = document.querySelector('.context-wrapper-hidden');
    if (hiddenContextMenu != null) {
        hiddenContextMenu.className = 'context-wrapper';
    }
    const contextMenu = document.querySelector('.context-wrapper');

    posY = window.scrollY + posY;

    contextMenu.innerHTML += `<style>
    .context-wrapper {
        position: absolute;
        left: ${posX}px;
        top: ${posY}px;
    }
    </style>`;
}

function hideContextMenu() {
    const contextMenu = document.querySelector('.context-wrapper');

    if (contextMenu != null) {
        contextMenu.className = 'context-wrapper-hidden';
    }
}

function contextDuplicate() {
    if (contextPlotId != -1) {
        //console.log('duplicated');
    }

    hideContextMenu();
    contextPlotId = -1;
}

function contextEdit() {
    if (contextPlotId != -1) {
        //console.log('edited');
    }

    hideContextMenu();
    contextPlotId = -1;
}

function contextDelete() {
    if (contextPlotId != -1) {
        //console.log('deleted');
    }

    hideContextMenu();
    contextPlotId = -1;
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