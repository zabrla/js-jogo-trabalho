let char = null;
let monster = new BigMonster();

const log = new Log(document.querySelector(".log"));
const stageEl = document.querySelector('#gameScreen');
const selectionEl = document.querySelector('#selectionScreen');

const charEl = document.querySelector('#char');
const monsterEl = document.querySelector('#monster');
const charImageEl = document.querySelector('#charImage');
const monsterImageEl = document.querySelector('#monsterImage');

document.querySelector('#selectKnight').addEventListener('click', () => startGame('Knight'));
document.querySelector('#selectSorcerer').addEventListener('click', () => startGame('Sorcerer'));


function setCharacterImage(characterName, state) {
    let charType = null;
    let imageEl = null;
    let folderName = '';
    let fileNamePrefix = '';

    if (char && characterName === char.name) {
        charType = char.constructor.name.toLowerCase();
        imageEl = charImageEl;
        folderName = charType;
        fileNamePrefix = charType;
    } else if (characterName === monster.name) {
        imageEl = monsterImageEl;
        
        if (monster instanceof BigMonster) {
            folderName = 'big_monster';
            fileNamePrefix = 'big_monster';
        } else if (monster instanceof LittleMonster) {
            folderName = 'little_monster';
            fileNamePrefix = 'little_monster';
        }
    } else {
        return;
    }
    
    let pathBase = 'assets/img';
    
    let imagePath = `${pathBase}/${folderName}/${fileNamePrefix}-${state}.gif`;
    imageEl.src = imagePath;
    imageEl.alt = `${characterName} ${state}`;
}

function startGame(heroType) {
    if (heroType === 'Knight') {
        char = new Knight('Laios (Knight)');
    } else if (heroType === 'Sorcerer') {
        char = new Sorcerer('Marcille (Sorcerer)');
    }
    
    if (Math.random() < 0.5) {
        monster = new LittleMonster();
    } else {
        monster = new BigMonster();
    }
    
    setCharacterImage(char.name, 'idle');
    setCharacterImage(monster.name, 'idle');

    const stage = new Stage(
        char,
        monster,
        charEl,
        monsterEl,
        log,
        setCharacterImage
    );
    
    stage.start();
    log.addMessage(`A Batalha começou! ${char.name} vs ${monster.name}!`, 'system');

    selectionEl.classList.add('hidden');
    stageEl.classList.remove('hidden');
}

stageEl.classList.add('hidden');
selectionEl.classList.remove('hidden');