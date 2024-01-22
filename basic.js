const scoreText = document.getElementById('score');
const textUrl = 'https://catfact.ninja/fact';
const funFact = document.getElementById('funFact');
const fallingFish = document.getElementById('fallingFish');
const myCat = document.getElementById('myCat');

const fishNum = 10;
var score = 0;
var fishList = [];
var leaderFish = {
    vPos: -30
};

class Fish
{
    constructor(hPos = 0)
    {
        this.hPos = hPos;
        this.vPos = 0;
    }
}

function init() 
{
    const width = window.innerWidth;
    for (var i = 0; i < fishNum; i++)
    {
        let fish = new Fish(width*i/fishNum + 10);
        fishList.push(fish);

        let item = document.createElement("div");
        item.id = "Item " + i;
        item.style.position = 'absolute';
        item.style.top = fish.vPos + 'px';
        item.style.left = fish.hPos + 'px';
        item.style.height = 50 + 'px';
        item.style.width = 50 + 'px';
        item.style.backgroundColor  = 'transparent';
        document.body.appendChild(item);

        let img = document.createElement('img');
        img.src = 'assets/fish.png';
        img.style.height = '100%';
        img.style.width = '100%';
        item.appendChild(img);
    }
}

async function updateBackground(){}

async function updateText() 
{
    try {
        const response = await fetch(textUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        funFact.textContent = data.fact;
    } 
    catch (error) {
        console.error('Error fetching text:', error);
        funFact.textContent = 'Failed to fetch response.';
    }
}

async function animateFish() 
{
    leaderFish.vPos += 5;
    if (leaderFish.vPos >= window.innerHeight) leaderFish.vPos = -50;
    fallingFish.style.top = leaderFish.vPos + 'px';
    
    for (var i = 0; i < fishNum; i++)
    {
        let fish = fishList[i];
        const fishDiv = document.getElementById("Item " + i);
        fish.vPos += 5;
        if (fish.vPos >= window.innerHeight) fish.vPos = -50;
        fishDiv.style.top = fish.vPos + 'px';
    } 
}

async function controlCat()
{
    let positionX = window.innerWidth / 2;
    const blockSpeed = 20;
  
    function moveBlock() {
      myCat.style.left = positionX + 'px';
    }
  
    function handleKeyPress(event) 
    {
        if (event.key === 'ArrowRight') {
            positionX += blockSpeed;
        }
        else if (event.key === 'ArrowLeft') {
            positionX -= blockSpeed;
        }
        positionX = Math.max(0, Math.min(positionX, window.innerWidth - myCat.clientWidth));
        moveBlock();
    }
  
    document.addEventListener('keydown', handleKeyPress);
    moveBlock();
}

function collisionChecker(rect1, rect2, fish) 
{
    if (rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top &&
        rect1.left < rect2.right &&
        rect1.right > rect2.left) 
        {
            score+=100;
            scoreText.textContent = score;
            fish.vPos = -300;
        }
    }

function updateScore()
{
    const fishRect = fallingFish.getBoundingClientRect();
    const catRect = myCat.getBoundingClientRect();
    collisionChecker(fishRect, catRect, leaderFish);

    for (var i = 0; i < fishNum; i++)
    {
        let fish = fishList[i];
        const fishRect = document.getElementById("Item " + i).getBoundingClientRect();
        collisionChecker(fishRect, catRect, fish);
    }
}
    
function start() 
{
    init();
    updateBackground();
    updateText();
    setInterval(updateText, 2000);
    setInterval(updateScore, 100);
    animateFish();
    setInterval(animateFish, 10);
    controlCat();
}

document.addEventListener('DOMContentLoaded', start);