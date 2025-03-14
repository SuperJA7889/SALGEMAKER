var imageSpaces = [null,"shop.png",null,null,"good.png","bad.png","rulebook.png"];
var extraImages = [];
var defTypes = 7;
var textTypeSpaces = ["Start","Shop","End",null,"Good Space","Bad Space","Rulebook"];

const board = document.getElementById("board")
var currentMode = 1;
var currentSpaceType = 0;

var spacesBoard = [];

const spaceSize = 30;
const lineSize = 30;

var otherconnection = -1;

var bst = [element("b1"),element("b2"),element("b3"),element("b4"),element("b5")];
var bstep = 0;

function element(id)
{
    return document.getElementById(id);
}

function saveBoard()
{
    let saveString = "";

    if (textTypeSpaces.length > defTypes)
    {
        
        for (var s = defTypes; s < textTypeSpaces.length; s++)
        {
            saveString = saveString + textTypeSpaces[s] + "^^^";
            saveString = saveString + extraImages[s - defTypes] + "^^^"
        }
    }
    saveString = saveString + ";";
    
    spacesBoard.forEach((space) => {
        
        saveString = saveString + (parseInt(frompx(space.newElement.style.left)) + spaceSize / 2) + "px,";
        saveString = saveString + (parseInt(frompx(space.newElement.style.top)) + spaceSize / 2) + "px,";
        saveString = saveString + space.spaceType + ",";
        
        space.connections.forEach(connection => {

            saveString = saveString + arrayFind(spacesBoard,connection) + "-"; 

        });

        saveString = saveString + ";";

    });
    return saveString;
}

element("clearboard").addEventListener("click",function (event)
{
    console.log(spacesBoard);
    clearBoard();
    console.log(spacesBoard);
});

function loadBoard(savecode)
{
    let spaces = savecode.split(";");
    let extraI = spaces[0].split("^^^");

    
    for (var s = 0; s < extraI.length - 1; s++)
    {
        if ((s / 2) - Math.floor(s/2) == 0)
        {
            textTypeSpaces.push(extraI[s]);
        }
        else
        {
            extraImages.push(extraI[s]);
        }
    }

    bstupdate();

    for (var s = 1; s < spaces.length - 1; s++)
    {
        
        let space = spaces[s];
        let attributes = space.split(",")

        new boardSpace(parseInt(frompx(attributes[0])),parseInt(frompx(attributes[1])),parseInt(attributes[2]));

        
    }

    for (var s = 1; s < spaces.length - 1; s++)
    {
        let space = spaces[s];
        let attributes = space.split(",")
        let connections = attributes[3].split("-");

        for (var c = 0; c < connections.length - 1; c++)
        {   
            softConnectSpaces(spacesBoard[parseInt(connections[c])],spacesBoard[s - 1]);


        }
            
    }
}

function clearBoard()
{
    extraImages = [];
    textTypeSpaces.splice(defTypes);
    bstupdate();

    console.log("clearing");
    while ( spacesBoard.length > 0)
    {
        destroySpace(spacesBoard[0]);
    }
    
}

element("loadbutton").addEventListener("click" , function (event)
{
    console.log("loading!.>>");
    clearBoard();
    loadBoard(element("loadinput").value);
});

element("save").addEventListener("click",function (event)
{
    console.log(saveBoard());
    navigator.clipboard.writeText(saveBoard()).then(
    () => {
        element("savecode").innerHTML = "Board copied to clipboard!";
    },
    () => {
        element("savecode").innerHTML = "Failed to save. Please try again.";
    });
    
});

bst.forEach((button,i) => {
    button.addEventListener("click",function ()
    {
        if (i + bstep * 5 < textTypeSpaces.length)
        {
            console.log(i + bstep * 5);
            currentSpaceType = i + bstep * 5;
            console.log(currentSpaceType);
        }
    })
});

function updatebstep()
{
    if (bstep < 0)
        {
            bstep = 0;
        }
    
        if ( bstep > Math.ceil( ( textTypeSpaces.length - 1) / 5 ) )
        {
            bstep = Math.ceil((textTypeSpaces.length - 1) / 5);
        }
}

element("bback").addEventListener("click",function (event)
{
    bstep = bstep - 1;
    updatebstep();
    bstupdate();
    
});

element("bnext").addEventListener("click",function (event)
{
    console.log("next");
    bstep = bstep + 1;
    console.log(bstep);
    updatebstep();
    console.log(bstep);
    bstupdate();
    
});

element("badd").addEventListener("click",function ()
{
    textTypeSpaces[textTypeSpaces.length] = element("newb").value;

    extraImages.push(element("bfile").value);

    bstupdate();
});



element("bremove").addEventListener("click",function ()
{
    if (textTypeSpaces.length > 7)
    {
        textTypeSpaces.splice(textTypeSpaces.length - 1,1);
        extraImages.splice(extraImages - 1,1);
        bstupdate();
    }
});

function bstupdate()
{
    
    for (var i = 0; i < bst.length; i++)
    {
        if (i + bstep * 5 >= textTypeSpaces.length)
        {
            bst[i].innerHTML = "-------";
        }
        else
        {
            bst[i].innerHTML = textTypeSpaces[i + bstep * 5];
        }
    
    }
}

bstupdate();





function arrayFind(array,obj)
{
    if (array)
    {
        let f = (x) => x == obj;
        return array.findIndex(f);
    }
    return -1;
    
}

const buildButtons = [element("m1"),element("m2")];

buildButtons.forEach((v,i) => {
    v.addEventListener("click",function (e)
    {
        currentMode = i + 1;
    });
});

function frompx(s)
{
    var returnString = "";
    for (var i = 0; i < s.length - 2; i++)
    {
        returnString = returnString + s[i];
    }
    return parseInt(returnString);
}

// function createLine(x1, y1, x2, y2) {
//     console.log("made line!");
    
//     var newLine = document.createElement("img");
//     newLine.src = "line.png";
//     newLine.style.position = "absolute";

//     // Calculate center position
//     let centerX = (x1 + x2) / 2;
//     let centerY = (y1 + y2) / 2;

//     // Calculate length and angle
//     let length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
//     let theta = Math.atan2(y2 - y1, x2 - x1);

//     // Set styles correctly
//     newLine.style.left = centerX + "px";
//     newLine.style.top = centerY + "px";
//     newLine.style.width = length + "px";
//     newLine.style.height = "10px"; // Assuming fixed thickness
//     newLine.style.transform = `rotate(${theta}rad)`;
//     newLine.style.transformOrigin = "center";

//     newLine.classList.add("line");
//     document.body.appendChild(newLine);
// }

function createLine(x1, y1, x2, y2) {
    console.log("Made line!");

    var newLine = document.createElement("img");
    newLine.src = "line.png";
    newLine.style.position = "absolute";

    // Calculate midpoint
    let centerX = (x1 + x2) / 2;
    let centerY = (y1 + y2) / 2;

    // Calculate length and angle
    let length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) + 90;

    // Set styles
    newLine.style.left = centerX + "px";
    newLine.style.top = centerY + "px";
    newLine.style.width = lineSize + "px"; // Scale image to match line length
    newLine.style.height = length + "px"; // Maintain aspect ratio
    newLine.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`; // Center it correctly

    newLine.classList.add("line");
    board.appendChild(newLine);
    return newLine;
}
// function createLine(x1,y1,x2,y2)
// {
//     console.log("made line!");
//     var newLine = document.createElement("img");
//     newLine.src = "line.png";
//     newLine.style.position = "absolute";
//     console.log((x1 + x2))
//     console.log(x1);
//     console.log(x2);
//     newLine.style.left = Math.round((x1 + x2)  / 2) + "px";
//     newLine.style.top = Math.round((y1 + y2) / 2) + "px";
//     console.log(newLine.style.left);
//     console.log(newLine.style.top);
//     console.log(newLine.style.width);
//     console.log(newLine.style.height);
//     newLine.style.width = Math.abs(x2 - x1) + "px";
//     newLine.style.height = Math.abs(y2 - y1)+ "px";
//     newLine.classList.add("line");
//     board.appendChild(newLine);
   
// }

 // var newLine = document.createElement("img");
    // newLine.src = "line.png";
    // newLine.style.position = "absolute";
    // var theta = Math.atan2((y2-y1),(x2-x1));
    // newLine.ariaOrientation = theta;
    // newLine.width = toString(Math.sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)) + "px";
    // newLine.height = "10" + "px";
    // newLine.top = (y1 + y2) / 2;
    // newLine.left = (x1 + x2) / 2;
    // document.body.appendChild(newLine);

    function deleteConnections(space)
    {
        
        space.connections.forEach((c,i) => {
            

            let other = space.connections[i];
            let indexOther = arrayFind(other.connections,space);
            console.log("index other " + indexOther);

            other.connections.splice(indexOther,1);
            
        });

        space.connections.forEach((c,i) => {
            let line = space.connectionLineObjects[i];
            let other = space.connections[i];
            let indexOther = arrayFind(other.connectionLineObjects,line);
            other.connectionLineObjects.splice(indexOther,1);

            line.remove();
        })

        space.connectionLineObjects = [];
        space.connections = [];

    }

function destroySpace(spaceinstance)
{
    if (spaceinstance.newText)
    {
        spaceinstance.newText.remove();
    }
    spaceinstance.newElement.remove();
    spaceinstance.newdiv.remove();
    deleteConnections(spaceinstance);
    spacesBoard.splice(arrayFind(spacesBoard,spaceinstance),1);
}

function connectSpaces(connect1,spaceinstance)
{
    if (!(connect1 == spaceinstance))
        {
                
            console.log("connect2");
            let oldConnection = arrayFind(connect1.connections,spaceinstance);

            if (oldConnection == -1)
            {
                let line = createLine(frompx(connect1.newElement.style.left) + (spaceSize / 2),frompx(connect1.newElement.style.top) + (spaceSize / 2),frompx(spaceinstance.newElement.style.left) + (spaceSize / 2),frompx(spaceinstance.newElement.style.top + (spaceSize / 2)) + (spaceSize / 2));
                
                spaceinstance.connectionLineObjects.push(line);
                connect1.connectionLineObjects.push(line);
                
                spaceinstance.connections.push(connect1);
                connect1.connections.push(spaceinstance);

                connect1 = -1;
            }
            else
            {
                let oldthisconnection = arrayFind(spaceinstance.connections,connect1);

                connect1.connections.splice(oldConnection,1);

                if (!(oldthisconnection == -1))
                {
                    spaceinstance.connections.splice(oldthisconnection,1);
                    spaceinstance.connectionLineObjects.splice(oldthisconnection,1);
                }
                let line = connect1.connectionLineObjects[oldConnection];
                connect1.connectionLineObjects.splice(oldConnection,1);
                
                line.remove();
                

            }
        }
}

function softConnectSpaces(connect1,spaceinstance)
{
    if (!(connect1 == spaceinstance))
    {
                
            console.log("connect2");
            
            let oldConnection = arrayFind(connect1.connections,spaceinstance);

            if (oldConnection == -1)
            {
                let line = createLine(frompx(connect1.newElement.style.left) + (spaceSize / 2),frompx(connect1.newElement.style.top) + (spaceSize / 2),frompx(spaceinstance.newElement.style.left) + (spaceSize / 2),frompx(spaceinstance.newElement.style.top + (spaceSize / 2)) + (spaceSize / 2));
                
                spaceinstance.connectionLineObjects.push(line);
                connect1.connectionLineObjects.push(line);
                
                spaceinstance.connections.push(connect1);
                connect1.connections.push(spaceinstance);

            }
    }
}

class boardSpace
{
    
    
    
    constructor(posx,posy,spaceType)
    {
        this.spaceType = spaceType;
        this.connections = new Array();
        console.log(this.connections);
        this.connectionLineObjects = new Array();
        

        
        var newdiv = document.createElement("div")
        newdiv.classList.add("space")
        this.newdiv = newdiv;
        var newElement = document.createElement("img");
        newElement.draggable = false;
        newElement.classList.add("spaceimg");

        if (spaceType <= imageSpaces.length && (imageSpaces[spaceType]))
        {
            var img = imageSpaces[spaceType];
            newElement.src = img;
        }
        else
        {
            var img = extraImages[spaceType - imageSpaces.length];
            if (img)
            {
                newElement.src = img;
            }
        }
        
        newElement.style.position = "absolute";
        newElement.style.left = posx - spaceSize / 2 + "px";
        newElement.style.top = posy - spaceSize / 2 + "px";
        this.newElement = newElement;
        
        
        
        var newText = null;
        if (!(textTypeSpaces[spaceType] == null))
        {
            console.log("creating text");
             newText = document.createElement("h1")
        
            newText.classList.add("spaceText");
            newText.style.position = "absolute";
            
            newText.style.left = posx - spaceSize / 2 + "px";
            newText.style.top = posy - spaceSize + "px";
            newText.innerHTML = textTypeSpaces[spaceType];

            newText.onselectstart = function t()
            {
                return false;
            };

            this.newText = newText;
        }
        
        
        
        let spaceinstance = this;
        newElement.addEventListener("click",function ()
        {
            if (currentMode == 1)
            {
                destroySpace(spaceinstance);
            }

            if (currentMode == 2)
            {
                if (otherconnection == -1)
                {
                    console.log("connect1");
                    console.log(newElement);
                    
                    otherconnection = spaceinstance;
                }
                else
                {
                    connectSpaces(otherconnection,spaceinstance);
                    otherconnection = -1;
                }

                
            }
        });
        
        board.appendChild(newdiv);
        newdiv.appendChild(newElement);

        if (newText)
        {
            
        newdiv.appendChild(newText);
        }
        spacesBoard.push(this);
    }
}

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    console.log("click!");
    if (currentMode == 1)
    {
        console.log("mode is good");
        if (event.button == 2)
        {
            console.log("new space!");
            console.log(event.x)
            console.log(event.y)
            new boardSpace(event.pageX,event.pageY,currentSpaceType);
        }
    }
});


