console.log("Online");

let app = new PIXI.Application({
    width: 800,
    heigth: 450,
    backgroundColor: 0xdddddd
}); // 16:9 * 50

app.view.id = "stage";
document.body.appendChild(app.view);

window.addEventListener('load', () => {

    let modalDialog = document.getElementsByClassName("modalDialog")[0];
    modalDialog.className = "modalDialog-hidden";
    let tempPlotID;

    let plotList = []

    document.querySelector('#modalButton-save').addEventListener('click', () =>
    {
        // console.log(modalDialog);
        modalDialog.className  = "modalDialog-hidden";

        if(tempPlotID != '')
        {
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

    document.querySelector('#modalButton-cancel').addEventListener('click', () =>
    {
        // console.log(modalDialog);
        modalDialog.className  = "modalDialog-hidden";

        if(tempPlotID != '')
        {
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

    function addPlot()
    {
        let plotS = PIXI.Sprite.from('img/plot.png');
        let tId = "plot"+plotList.length;

        plotS.x = plotList.length * 150;

        plotS.id = tId;
        plotList.push(new Plot('', tId, plotS));

        plotS.interactive = true;

        app.stage.addChild(plotS);

        plotS.addEventListener("click", (e) =>
        {
            modalDialog.className  = "modalDialog";
            tempPlotID = e.target.id;
    
            let modalD = document.querySelector('#modalText');
            let modalTitle = document.querySelector('#modalTitle');

            let tPlot = findPlotByID(tempPlotID);

            modalD.value = tPlot.text;
            modalTitle.innerHTML = tPlot.id;

            //console.log(e);
        });
    }

    function findPlotByID(id)
    {
        for(let i = 0; i < plotList.length; i++)
        {
            if(plotList[i].id == id)
            {
                return plotList[i];
            }
        }

        return false;
    }

    console.log(plotList);

});

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