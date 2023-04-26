const log = console.log;

log("Online");

let modalDialog = document.getElementsByClassName("modalDialog")[0];
if (modalDialog != null) {
    modalDialog.className = "modalDialog-hidden";
}
let tempPlotID;

let plotList = [];
let totalPlotLength = 0; //num of all plots ever made

let allStories = [];

let contextPlotId;

let offsetX = 0, offsetY = 0;
let mouseDown = false;

let plotPreviewLength = 50;

const LOCAL_STORAGE_PLOT_SAVE_LIST_KEY = 'storyPlots.list';
const LOCAL_STORAGE_PLOT_SAVE_ALL_STORIES_KEY = 'storyPlots.allStories';
const LOCAL_STORAGE_PLOT_SAVE_LIST_INDEX_KEY = 'storyPlots.indexString';

if (modalDialog != null) {
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

            log('~~~~~check');

            if (modalTitle.value != '' && isUnique(modalTitle.value)) {

                tPlot.id = modalTitle.value;
                tPlot.sprite.id = modalTitle.value;

                for (let i = 0; i < plotList.length; i++) {
                    for (let l = 0; l < plotList[i].links.length; l++) {
                        if (plotList[i].links[l].link == tempPlotID) {
                            let tempLText = '';

                            let tx1 = plotList[i].text.slice(0, plotList[i].links[l].linkStart);
                            let tx2 = plotList[i].text.slice(plotList[i].links[l].linkStart, plotList[i].links[l].linkEnd);
                            let tx3 = plotList[i].text.slice(plotList[i].links[l].linkEnd, plotList[i].text.length);

                            tx2 = tx2.split('::')[0] + '::';

                            // log(tx1);
                            // log(tx2);
                            // log(tx3); 
                            // log('slices!!');

                            tempLText = tx1 + tx2 + modalTitle.value + tx3;
                            // log(tempLText);
                            plotList[i].text = tempLText;
                        }
                    }
                }
            }
            else if (modalTitle.value != tPlot.id) {
                alert("A Plot's title must be unique and cannot be empty");
            }

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

}

function isUnique(str) {

    if (findPlotByID(str) == false) {
        return true;
    }

    return false;
}

// addPlot(); //TESTING
// addPlot();
// addPlot();

//creats a new plot
function addPlot(inputText, inputId) {
    let plotS = PIXI.Sprite.from('../img/plot-white.png');
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
        // setTimeout(() => {
        //     if (mouseDown) {
        //         plotS.dragging = true;
        //         app.stage.removeChild(plotS);
        //         app.stage.addChild(plotS);
        //     }
        // }, 75);

        // offsetX = 0;//plotS.x - e.data.global.x;
        // offsetY = 0;//plotS.y - e.data.global.y;
    });

    // plotS.addEventListener('mouseout', (e) => {
    //     if (plotS.dragging) {
    //         plotS.dragging = false;
    //         mouseDown = false;
    //     }
    // });

    plotS.addEventListener("mousemove", function (e) {
        //console.log(e);

        if (mouseDown) { //plotS.dragging
            //console.log(e);
            plotS.x = Math.min(Math.max(e.data.global.x + offsetX, 0), app.view.width);
            plotS.y = Math.min(Math.max(e.data.global.y + offsetY, 0), app.view.height);

            p.x = plotS.x;
            p.y = plotS.y;

            plotS.dragging = true;

            drawAllLines();

            //console.log(e.data.global.y + offsetY, plotS.x, plotS.y);
        }
    });
}

//Prevent right clicks on the page for a custom context meun
//would prefer to just add to the existing one, but not sure how to do that RN
if (app != null) {
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
}

//deletes the specified plot
function deletePlot(id) {
    console.log(plotList);

    const removedPlot = plotList.find(item => item.id == id);
    plotList = plotList.filter(item => item.id !== id);

    app.stage.removeChild(removedPlot.sprite);

    console.log(plotList);
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

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

let x;
let y;

app.stage.addEventListener('mousemove', (e) => {
    // log(e.global.x, e.global.y);
    x = e.global.x;
    y = e.global.y;
});

function contextNew(e) {
    addPlot();

    let tPlot = plotList[plotList.length - 1];

    //log(e);

    // let x = lerp(e.clientX, 0, screen.width, app.x, app.view.width);
    // let y = lerp(e.clientY, 0, screen.height, app.y, app.view.height);

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

    setPreview();

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

    setPreview();
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
            runCommand(txt.slice(cmdS, cmdE), tPlot, cmdS, cmdE);
        }
    }

    //log(txt);
}

function runCommand(str, tPlot, cS, cE) {
    //log(str);
    str = str.split('::');

    str[0] = str[0].trim();
    str[1] = str[1].trim();

    log(str);

    if (findPlotByID(str[1]) != false) {
        tPlot.links.push({ display: str[0], link: str[1], linkStart: cS, linkEnd: cE });
    }
    else {
        tPlot.links.push({ display: str[0], link: -99, linkStart: cS, linkEnd: cE });
    }

    log(str);

    log(tPlot.links[tPlot.links.length - 1], '~~~~~~~~~~~~~~~~~~~~~~~~~');
}

function setPreview() {
    log('generating preview');

    for (let i = 0; i < plotList.length; i++) {
        plotList[i].links = [];
        parseTextForCmd(plotList[i].id);
        //log(plotList[i].links, "links", i);
    }

    for (let i = 0; i < plotList.length; i++) {
        plotList[i].sprite.tint = 0xffffff;
    }

    plotList[0].sprite.tint = 0xffff00;

    showNewPlot(plotList[0].id); //!NEED TO MAKE DYNAMIC
    drawAllLines();
}

let lineArr = [];

function drawConnectingLine(a, b) {

    if (a != null && b != null) {
        let line = new PIXI.Graphics();
        line.lineStyle(3, 0x003300);

        let hd = b.x - a.x;
        let vd = b.y - a.y;

        let s = Math.sign(hd);

        line.moveTo(a.x + (s * 10), a.y);

        //draw to center
        line.lineTo(a.x + (s * 10), a.y + (vd / 2));
        line.lineTo(a.x + (hd / 2), a.y + (vd / 2));

        //draw arrow
        line.lineStyle(3, 0x336633);
        line.lineTo(a.x + ((hd - (s * 15)) / 2), a.y + ((vd + 15) / 2));
        line.lineTo(a.x + (hd / 2), a.y + (vd / 2));
        line.lineTo(a.x + ((hd - (s * 15)) / 2), a.y + ((vd - 15) / 2));
        line.lineTo(a.x + (hd / 2), a.y + (vd / 2));
        line.lineStyle(3, 0x003300);

        //draw to end
        line.lineTo(a.x + hd, a.y + (vd / 2));
        line.lineTo(a.x + hd, a.y + vd);

        lineArr.push(line);

        app.stage.addChild(line);
    }
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

    let linkedList = '';

    for (let i = 0; i < tPlot.text.length; i++) {
        if (txt[i] == '<' && txt[i + 1] == '<') {
            cmd = true;
        }

        if (!cmd) {
            linkedList += txt[i];
        }

        // for (let l = 0; l < lineCheck.length; l++) {
        //     if (i == lineCheck[l].length) {
        //         storyText.innerHTML += '</p><p>';
        //     }
        // }

        if (cmd == true && txt[i] == '>' && txt[i + 1] == '>') {
            cmd = false;

            if (tPlot.links[cIndex].link != -99) {
                linkedList += `<span class ="plotLink" onclick = 'showNewPlot("${tPlot.links[cIndex]?.link}")'> ${tPlot.links[cIndex]?.display} </span>`;
            }
            else {
                linkedList += `<span> ${tPlot.links[cIndex]?.display} </span>`;
            }

            cIndex++;
            i++;
        }
    }

    let lineCheck = linkedList.split("\n").join('<br>');
    storyText.innerHTML = lineCheck;
}

let loadPlotList = [];

//!modify to pull from an allStories Index
function loadFromSave() {
    deleteAllPlots();

    for (let i = app.stage.children.length; i > 0; i--) {
        app.stage.removeChild(app.stage.children[0]);
    }

    loadPlotList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLOT_SAVE_LIST_KEY)) || [];

    pullPlotsFromLoad();
    setPreview();
}

//!modify to pull from an allStories Index
//? May remove this one

function loadFromUserSaveInput(userInput) {
    deleteAllPlots();

    for (let i = app.stage.children.length; i > 0; i--) {
        app.stage.removeChild(app.stage.children[0]);
    }

    loadPlotList = JSON.parse(userInput) || [];

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

        //console.log(loadPlotList[i].x, loadPlotList[i].y);
    }
}

//!Modify to save to the proper allStories index
function save() {
    log(plotList);

    let arr = plotList;

    for (let i = 0; i < arr.length; i++) {
        arr[i].sprite = null;
        arr[i].txtBox = null;
    }

    //log(plotList);

    //log(JSON.stringify(arr));
    localStorage.setItem(LOCAL_STORAGE_PLOT_SAVE_LIST_KEY, JSON.stringify(arr));
    localStorage.setItem(LOCAL_STORAGE_PLOT_SAVE_ALL_STORIES_KEY, JSON.stringify(allStories));

    loadFromSave();
}

function downloadSave() {
    save();

    download('save', localStorage.getItem(LOCAL_STORAGE_PLOT_SAVE_LIST_KEY));
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + '.plothole');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function droppedFile() {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        //console.log(file);
        if (file.name.split('.')[1] == "plothole") {
            loadFromUserSaveInput(reader.result);
        }
        else {
            console.error('Wrong file type: .' + file.name.split('.')[1] + ' is not a valid extension, please use a .plothole file');

            let msg = 'Wrong file type: .' + file.name.split('.')[1] + ' is not a valid extension, please use a .plothole file';

            displayuploadError(msg);
        }

    });

    if (file) {
        reader.readAsText(file);
    }

}

function displayuploadError(msg) {

    let dz = document.querySelector('.dropzone-error-hidden');
    if (dz != null) {
        dz.className = 'dropzone-error';
        dz.innerHTML = '<br> <span>' + msg + '</span>';
    }

    setTimeout(() => {
        let dez = document.querySelector('.dropzone-error');
        if (dez != null) {
            dez.className = 'dropzone-error-hidden';
        }
    }, 6000);
}

//Story selector

function initAllStories() {

    allStories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLOT_SAVE_ALL_STORIES_KEY)) || [];

    let grid = document.querySelector('#story-grid');
    grid.innerHTML = '';

    if (grid != null) {
        allStories.forEach(element => {
            log(element.innerPlots);

            grid.innerHTML += `<a id = ${element.name} class = 'storyBlock' href="html/editStory.html" onclick="storySelected(id);">${element.name}</a>`;
        });
    }
}

function nameStory() {
    let nameModal = document.querySelector('.save-name-modal-hidden');
    if (nameModal != null) {
        nameModal.className = "save-name-modal";
        nameModal.querySelector('input').value = 'untitled';
    }
}

function cancelStoryNaming() {
    let nameModal = document.querySelector('.save-name-modal');
    if (nameModal != null) {
        nameModal.className = "save-name-modal-hidden";
    }
}

function createStory(sName, fillPlots) {
    log(sName);

    let nameModal = document.querySelector('.save-name-modal');
    if (nameModal != null) {
        nameModal.className = "save-name-modal-hidden";
    }

    let grid = document.querySelector('#story-grid');
    grid.innerHTML += `<a id = ${sName} class = 'storyBlock' href="html/editStory.html" onclick="storySelected(id);">${sName}</a>`;

    if (fillPlots == [] || fillPlots == null) {
        allStories.push({ name: sName, innerPlots: [] });
    }
    else {
        allStories.push({ name: sName, innerPlots: fillPlots });
    }

    localStorage.setItem(LOCAL_STORAGE_PLOT_SAVE_ALL_STORIES_KEY, JSON.stringify(allStories));
}

function deleteStory(id) {
    allStories = allStories.filter(item => item.name !== id);
    localStorage.setItem(LOCAL_STORAGE_PLOT_SAVE_ALL_STORIES_KEY, JSON.stringify(allStories));

    log(allStories);

    initAllStories();
}

function storySelected(id) {
    log(id);
    let sIndex = storyIndexFromName(id);

    if (sIndex != -999) {
        localStorage.setItem(LOCAL_STORAGE_PLOT_SAVE_LIST_INDEX_KEY, sIndex);
    }
}

function storyIndexFromName(name) {
    for (let i = 0; i < allStories.length; i++) {
        if (allStories[i].name == name) {
            return i;
        }
    }

    return -999;
}