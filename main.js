const log = console.log;

log("Online");

let modalDialog = document.getElementsByClassName("modalDialog")[0];
modalDialog.className = "modalDialog-hidden";
let tempPlotID;

let plotList = [];
let totalPlotLength = 0; //num of all plots ever made

let contextPlotId;

let offsetX = 0, offsetY = 0;
let mouseDown = false;

let plotPreviewLength = 50;

const LOCAL_STORAGE_PLOT_SAVE_LIST_KEY = 'storyPlots.list';

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

        //if (txt.length > 0) {
        tPlot.txtBox.text = tempPlotID;//"       " + txt.slice(0, plotPreviewLength).trim() + "..."; //add preview text to the plot
        //}
        //else {
        //    tPlot.txtBox.text = "~empty~";
        //}

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

    //if (inputText != null) {
    plotTitle.text = tId;//"       " + inputText.slice(0, plotPreviewLength).trim() + "...";
    findPlotByID(tId).text = inputText;
    //}

    //add children
    plotS.addChild(plotTitle);
    app.stage.addChild(plotS);

    plotS.addEventListener("mouseup", (e) => {
        if (plotS.dragging) {
            plotS.dragging = false;
            mouseDown = false;
        }
        else {
            mouseDown = false;
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
        showContextMenu(e.clientX, e.clientY, e.target.id);

        //console.log(e);
    });

    plotS.dragging = false;

    plotS.addEventListener("mousedown", function (e) {
        mouseDown = true;
        setTimeout(() => {
            if (mouseDown) {
                plotS.dragging = true;
                app.stage.removeChild(plotS);
                app.stage.addChild(plotS);
            }
        }, 75);

        offsetX = 0;//plotS.x - e.data.global.x;
        offsetY = 0;//plotS.y - e.data.global.y;
    });

    plotS.addEventListener('mouseout', (e) => {
        if (plotS.dragging) {
            plotS.dragging = false;
            mouseDown = false;
        }
    });

    //console.log(app.view.width, app.view.height);

    // const h = app.stage.height;

    plotS.addEventListener("mousemove", function (e) {
        //console.log(e);

        if (plotS.dragging) {
            //console.log(e);
            plotS.x = Math.min(Math.max(e.data.global.x + offsetX, 0), app.view.width);
            plotS.y = Math.min(Math.max(e.data.global.y + offsetY, 0), app.view.height);

            //console.log(e.data.global.y + offsetY, plotS.x, plotS.y);
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
    if (e.button == 2) {
        e.preventDefault();
        //hideContextMenu();
        showContextMenu(e.clientX, e.clientY, e.target.id);
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
    /*
    for (let i = 0; i < plotList.length; i++) {
        plotList[i].sprite.x = 60 + (i * 110);
        plotList[i].sprite.y = 75;
    }
    */
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

function contextNew(e) {
    addPlot();

    let tPlot = plotList[plotList.length - 1];

    console.log(app.stage.x);

    tPlot.sprite.x = e.x;
    tPlot.sprite.y = window.scrollY + e.y;

    hideContextMenu();
}

function contextDuplicate() {
    if (contextPlotId != -1 && contextPlotId != 'stage') {
        //console.log('duplicated');
        addPlot(findPlotByID(contextPlotId).text);
    }

    hideContextMenu();
    contextPlotId = -1;
}

function contextEdit() {
    if (contextPlotId != -1 && contextPlotId != 'stage') {
        //console.log('edited');
        modalDialog.className = "modalDialog";
        tempPlotID = contextPlotId;

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

    hideContextMenu();
    contextPlotId = -1;
}

function contextDelete() {
    if (contextPlotId != -1 && contextPlotId != 'stage') {
        //console.log('deleted');
        deletePlot(contextPlotId);

        if (tempPlotID == contextPlotId) {
            modalDialog.className = "modalDialog-hidden";
        }
    }

    hideContextMenu();
    contextPlotId = -1;
}

function lerp(p, a1, a2, b1, b2) {
    let scale1 = a2 - a1;
    let delta = (p - a1) / scale1;
    let scale2 = b2 - b1;
    return (scale2 * delta) + b1;
}

log(plotList);

/*
cmd keys
<< start command
>> close command
only link text for now
<< Display text :: plotID >>
*/

function parseTextForCmd(plotIdtoParse) {
    let tPlot = findPlotByID(plotIdtoParse);
    let txt = '';
    txt += tPlot.text;

    let cmdS = 0;
    let cmdE = 0;

    for (let i = 0; i < txt.length; i++) {
        if (txt[i] == '<' && txt[i + 1] == '<') {
            cmdS = i + 2;
        }

        if (txt[i] == '>' && txt[i + 1] == '>') {
            cmdE = i;
            runCommand(txt.slice(cmdS, cmdE), tPlot);
        }
    }

    //log(txt);
}

function runCommand(str, tPlot) {
    log(str);
    str = str.split('::');

    str[0] = str[0].trim();
    str[1] = str[1].trim();

    tPlot.links.push({ display: str[0], link: str[1] });

    log(tPlot.links[tPlot.links.length - 1]);
}

function setPreview() {
    log('generating preview');

    for (let i = 0; i < plotList.length; i++) {
        plotList[i].links = [];
        parseTextForCmd(plotList[i].id);
    }

    showNewPlot('plot-0');
}

function showNewPlot(newPlotId) {

    //parseTextForCmd(newPlotId);
    let storyText = document.querySelector('#text-content');
    let storyHeader = document.querySelector('#text-title');

    let cIndex = 0;
    let cmd = false;

    let tPlot = findPlotByID(newPlotId);
    let txt = tPlot.text;

    storyText.innerHTML = '';
    storyHeader.innerHTML = tPlot.id;

    console.log(txt);

    for (let i = 0; i < tPlot.text.length; i++) {
        if (txt[i] == '<' && txt[i + 1] == '<') {
            cmd = true;
        }

        if (!cmd) {
            storyText.innerHTML += txt[i];
        }

        if (cmd == true && txt[i] == '>' && txt[i + 1] == '>') {
            cmd = false;
            storyText.innerHTML += `<span class ="plotLink" onclick = 'showNewPlot("${tPlot.links[cIndex].link}")'> ${tPlot.links[cIndex].display} </span>`;
            cIndex++;
            i++;
        }
    }

}

function loadFromSave() {
    plotList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLOT_SAVE_LIST_KEY)) || [];
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_PLOT_SAVE_LIST_KEY, JSON.stringify(plotList));
}


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