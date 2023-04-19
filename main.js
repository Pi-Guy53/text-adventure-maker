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

        if (modalTitle.value != '' && isUnique(modalTitle.value)) {

            tPlot.id = modalTitle.value;
            tPlot.sprite.id = modalTitle.value;
        }

        log('~~~~~check');

        // for (let i = 0; i < plotList.length; i++) {
        //     let tempText = '';
        //     tempText = plotList[i].text;
        //     tempText = tempText.split('::'); //split at the links

        //     //log(tempText);

        //     plotList[i].text = '';

        //     for (let g = 0; g < tempText.length; g++) {
        //         tempText[g] = tempText[g].split('>>');

        //         log(tempText[g]);

        //         if (tempText[g][0] == tempPlotID) {
        //             tempText[g][0] = `::${modalTitle.value}>>`;
        //             log(tempText[g], "found");
        //         }

        //         plotList[i].text += tempText[g];
        //     }


        //     log(tempText, "temp");
        // }

        //log(tempText);
        // for (let i = 0; i < plotList.length; i++) {
        //     for (let l = 0; l < plotList[i].links.length; l++) {

        //         if (plotList[i].links[l].link == tempPlotID) {
        //             plotList[i].links[l].link = modalTitle.value;

        //             console.log(plotList[i].links[l].link);
        //         }
        //     }
        // }

        log('~~~~~End check');

        //if (txt.length > 0) {
        tPlot.txtBox.text = tPlot.id;//"       " + txt.slice(0, plotPreviewLength).trim() + "..."; //add preview text to the plot
        //}
        //else {
        //    tPlot.txtBox.text = "~empty~";
        //}

        console.log(tPlot.text);

        modalD.value = '';
        modalTitle.value = '';
        tempPlotID = '';
    }

    setPreview();
});

function isUnique(str) {

    if (findPlotByID(str) == false) {
        return true;
    }

    return false;
}

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
        modalTitle.value = '';
        tempPlotID = '';
    }

    setPreview();
});

addPlot(); //TESTING
addPlot();
addPlot();

//creats a new plot
function addPlot(inputText, inputId) {
    let plotS = PIXI.Sprite.from('img/plot.png');
    let tId

    if (inputId != null) {
        tId = inputId;
    }
    else {
        tId = "plot-" + totalPlotLength;
    }

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

    plotTitle = new PIXI.Text(tId, plotTxtStyle);
    plotTitle.anchor.set(.5, .5);
    plotTitle.scale.x = 1;
    plotTitle.scale.y = 1.25;
    plotTitle.resolution = 2;

    //add plot to the plot list
    plotList.push(new Plot('', tId, plotS, plotTitle));

    let p = plotList[plotList.length - 1];

    plotTitle.value = tId;
    if (inputText != null) {
        // plotTitle.text = tId;//"       " + inputText.slice(0, plotPreviewLength).trim() + "...";
        findPlotByID(tId).text = inputText;
    }

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
            modalTitle.value = tPlot.id;
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

            p.x = plotS.x;
            p.y = plotS.y;

            drawAllLines();

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

function deleteAllPlots() {
    for (let i = 0; i < plotList.length; i++) {
        app.stage.removeChild(plotList[i].sprite);
    }

    plotList = [];
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

    log(e);

    let x = lerp(e.clientX, 0, screen.width, 0, app.view.width);
    let y = lerp(e.clientY, 0, screen.height, 0, app.view.height);

    tPlot.sprite.x = x;
    tPlot.sprite.y = y;

    hideContextMenu();
}

function contextDuplicate() {
    if (contextPlotId != -1 && contextPlotId != 'stage') {
        //console.log('duplicated');
        let selectedPlot = findPlotByID(contextPlotId)
        addPlot(selectedPlot.text);

        let newPlot = plotList[plotList.length - 1]
        newPlot.sprite.x = selectedPlot.sprite.x + 25;
        newPlot.sprite.y = selectedPlot.sprite.y + 25;
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
        modalTitle.value = tPlot.id;
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

    if (findPlotByID(str[1]) != false) {
        tPlot.links.push({ display: str[0], link: str[1] });
    }

    log(tPlot.links[tPlot.links.length - 1]);
}

function setPreview() {
    log('generating preview');

    for (let i = 0; i < plotList.length; i++) {
        plotList[i].links = [];
        parseTextForCmd(plotList[i].id);
    }

    showNewPlot(plotList[0].id); //!NEED TO MAKE DYNAMIC
    drawAllLines();
}

let lineArr = [];

function drawConnectingLine(a, b) {
    let line = new PIXI.Graphics();
    line.lineStyle(2, 0x446644);

    let hd = b.x - a.x;
    let vd = b.y - a.y;

    let s = Math.sign(hd);

    line.moveTo(a.x + (s * 10), a.y);

    //draw to center
    line.lineTo(a.x + (s * 10), a.y + (vd / 2));
    line.lineTo(a.x + (hd / 2), a.y + (vd / 2));

    //draw arrow
    line.lineStyle(2, 0x778877);
    line.lineTo(a.x + ((hd - (s * 10)) / 2), a.y + ((vd + 10) / 2));
    line.lineTo(a.x + (hd / 2), a.y + (vd / 2));
    line.lineTo(a.x + ((hd - (s * 10)) / 2), a.y + ((vd - 10) / 2));
    line.lineTo(a.x + (hd / 2), a.y + (vd / 2));
    line.lineStyle(2, 0x446644);

    //draw to end
    line.lineTo(a.x + hd, a.y + (vd / 2));
    line.lineTo(a.x + hd, a.y + vd);

    lineArr.push(line);

    app.stage.addChild(line);
}

function destroyAllLines() {
    for (let i = 0; i < lineArr.length; i++) {
        lineArr[i].destroy();
    }

    lineArr = [];
}

function drawAllLines() {

    destroyAllLines();

    for (let p = 0; p < plotList.length; p++) {
        for (let l = 0; l < plotList[p].links.length; l++) {
            drawConnectingLine(plotList[p].sprite, findPlotByID(plotList[p].links[l].link).sprite);

            //log(findPlotByID(plotList[p].links[l].link));
        }
    }

    // move all plots to front of page
    for (let i = 0; i < plotList.length; i++) {
        app.stage.removeChild(plotList[i].sprite);
        app.stage.addChild(plotList[i].sprite);;
    }
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

    let lineCheck = txt.split("\n");
    log(lineCheck);

    for (let i = 0; i < tPlot.text.length; i++) {
        if (txt[i] == '<' && txt[i + 1] == '<') {
            cmd = true;
        }

        if (!cmd) {
            storyText.innerHTML += txt[i];

            for (let l = 0; l < lineCheck.length; l++) {
                if (i == lineCheck[l].length) {
                    storyText.innerHTML += '</p><p>';
                }
            }
        }

        if (cmd == true && txt[i] == '>' && txt[i + 1] == '>') {
            cmd = false;
            storyText.innerHTML += ` <span class ="plotLink" onclick = 'showNewPlot("${tPlot.links[cIndex].link}")'> ${tPlot.links[cIndex].display} </span>`;
            cIndex++;
            i++;
        }
    }

}

let loadPlotList = [];

function loadFromSave() {
    deleteAllPlots();

    for (let i = app.stage.children.length; i > 0; i--) {
        app.stage.removeChild(app.stage.children[0]);
    }

    loadPlotList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLOT_SAVE_LIST_KEY)) || [];

    pullPlotsFromLoad();
    setPreview();
}

function pullPlotsFromLoad() {
    for (let i = 0; i < loadPlotList.length; i++) {
        addPlot(loadPlotList[i].text, loadPlotList[i].id);
        let tPlot = plotList[plotList.length - 1];

        tPlot.sprite.x = loadPlotList[i].x;
        tPlot.sprite.y = loadPlotList[i].y;
        tPlot.x = loadPlotList[i].x;
        tPlot.y = loadPlotList[i].y;

        console.log(loadPlotList[i].x, loadPlotList[i].y);
    }
}

function save() {
    log(plotList);

    let arr = plotList;

    for (let i = 0; i < arr.length; i++) {
        arr[i].sprite = null;
        arr[i].txtBox = null;
    }

    log(plotList);

    log(JSON.stringify(arr));
    localStorage.setItem(LOCAL_STORAGE_PLOT_SAVE_LIST_KEY, JSON.stringify(arr));

    loadFromSave();
}