class Character {
    _life = 1;
    maxLife = 1;
    attack = 0;
    defense = 0;
    canAttack = true;
    type = 'system';

    constructor(name) {
        this.name = name
    }

    get life() {
        return this._life <= 0 ? (0) : this._life
    }

    set life(newLife) {
        this._life = newLife < 0 ? 0 : newLife
    }
}

class Knight extends Character {
    constructor(name) {
        super(name)
        this.life = 100;
        this.attack = 11;
        this.defense = 8;
        this.maxLife = this.life;
        this.type = 'hero';
    }
}

class Sorcerer extends Character {
    constructor(name) {
        super(name)
        this.life = 70;
        this.attack = 15;
        this.defense = 3;
        this.maxLife = this.life;
        this.type = 'hero';
    }
}

class LittleMonster extends Character {
    constructor() {
        super("Hydreigon (Little Monster)")
        this.life = 40;
        this.attack = 5;
        this.defense = 4;
        this.maxLife = this.life;
        this.type = 'monster';
    }
}

class BigMonster extends Character {
    constructor() {
        super("Rayquaza (Big Monster)")
        this.life = 120;
        this.attack = 16;
        this.defense = 6;
        this.maxLife = this.life;
        this.type = 'monster';
    }
}

class Stage {
    constructor(fighter1, fighter2, fighter1El, fighter2El, logObject, setImageCallback) {
        this.fighter1 = fighter1
        this.fighter2 = fighter2
        this.fighter1El = fighter1El
        this.fighter2El = fighter2El
        this.log = logObject
        this.turn = 'fighter1';
        this.setImage = setImageCallback;
    }

    start() {
        this.update()

        this.fighter1El.querySelector("#charAttackButton").addEventListener("click", () => {
            this.doAttack(this.fighter1, this.fighter2)
        });
        this.fighter2El.querySelector("#monsterAttackButton").addEventListener("click", () => {
            this.doAttack(this.fighter2, this.fighter1)
        });

        this.toggleButtons();
    }

    doAttack(attacking, attacked) {
        if (attacking.life <= 0) {
            this.log.addMessage(`${attacking.name} (Morto) não pode atacar.`, 'system');
            return;
        }

        if (attacked.life <= 0) {
            this.log.addMessage(`${attacking.name} está atacando um cadáver!`, 'system');
            return
        }

        if (!attacking.canAttack) {
            this.log.addMessage(`${attacking.name} não pode atacar. (Máximo 1x por turno)`, 'system');
            return;
        }

        this.setImage(attacking.name, 'attack');
        this.setImage(attacked.name, 'attacked');


        let attackFactor = (Math.random() * 2).toFixed(2)
        let defenseFactor = (Math.random() * 2).toFixed(2)

        let baseDamage = attacking.attack * attackFactor;
        let effectiveDefense = attacked.defense * defenseFactor;
        
        let damageTaken = baseDamage - effectiveDefense;
        let extraAttack = false;
        let lifeBefore = attacked.life;

        if (damageTaken > 0) {
            attacked.life -= damageTaken;
            let lifeAfter = attacked.life;

            this.log.addMessage(`${attacking.name} causou ${damageTaken.toFixed(2)} de dano em ${attacked.name}. (Vida: ${lifeBefore} -> ${lifeAfter})`, attacking.type);
            
            if (damageTaken.toFixed(2) <= 1) { 
                extraAttack = true;
                this.log.addMessage(`${attacking.name} ganhou um ataque extra! O ataque foi fraco (${damageTaken.toFixed(2)} de dano).`, 'system');
            }

        } else {
            damageTaken = 0;
            
            extraAttack = true;
            this.log.addMessage(`${attacked.name} defendeu o ataque de ${attacking.name} totalmente!`, attacked.type);
            this.log.addMessage(`${attacking.name} ganhou um ataque extra! (Ataque fraco)`, 'system');

            if (parseFloat(attacked.life) < attacked.maxLife) {
                let healAmount = attacked.maxLife * 0.05;
                let newLife = parseFloat(attacked.life) + healAmount;
                
                if (newLife > attacked.maxLife) {
                    healAmount = attacked.maxLife - parseFloat(attacked.life);
                    attacked.life = attacked.maxLife;
                } else {
                    attacked.life = newLife;
                }
                
                this.log.addMessage(`${attacked.name} recuperou ${healAmount.toFixed(2)} de vida ao defender o ataque.`, attacked.type);
            }
        }
        
        if (extraAttack) {
             attacking.canAttack = true; 
        } else {
            attacking.canAttack = false;
        }

        this.update()

        if (attacked.life <= 0) {
            this.log.addMessage(`${attacked.name} foi derrotado! ${attacking.name} VENCEU!`, 'system');
            this.setImage(attacking.name, 'win');
            this.setImage(attacked.name, 'death');
            this.toggleButtons();
            return;
        } 

        if (!extraAttack) {
            this.toggleTurn();
        } else {
            this.toggleButtons();
        }
    }

    toggleTurn() {
        this.fighter1.canAttack = (this.turn === 'fighter2');
        this.fighter2.canAttack = (this.turn === 'fighter1');
        
        this.turn = this.turn === 'fighter1' ? 'fighter2' : 'fighter1';
        this.toggleButtons();
    }
    
    toggleButtons() {
        const f1AttackBtn = this.fighter1El.querySelector("#charAttackButton");
        const f2AttackBtn = this.fighter2El.querySelector("#monsterAttackButton");

        if (this.fighter1.life <= 0 || this.fighter2.life <= 0) {
            f1AttackBtn.disabled = true;
            f2AttackBtn.disabled = true;
            return;
        }
        
        f1AttackBtn.disabled = !(this.turn === 'fighter1' && this.fighter1.canAttack);
        f2AttackBtn.disabled = !(this.turn === 'fighter2' && this.fighter2.canAttack);
        
        if (this.turn === 'fighter1' && this.fighter1.canAttack) {
            this.log.addMessage(`É a vez de ${this.fighter1.name}!`, 'system');
        } else if (this.turn === 'fighter2' && this.fighter2.canAttack) {
            this.log.addMessage(`É a vez de ${this.fighter2.name}!`, 'system');
        }
    }

    update() {
        this.fighter1El.querySelector(".name").innerHTML = `${this.fighter1.name} - ${this.fighter1.life.toFixed(2)} HP`
        let f1pct = (this.fighter1.life / this.fighter1.maxLife) * 100
        this.fighter1El.querySelector(".bar").style.width = `${f1pct}%`

        this.fighter2El.querySelector(".name").innerHTML = `${this.fighter2.name} - ${this.fighter2.life.toFixed(2)} HP`
        let f2pct = (this.fighter2.life / this.fighter2.maxLife) * 100
        this.fighter2El.querySelector(".bar").style.width = `${f2pct}%`
    }
}

class Log {
    list = []
    maxMessages = 10;

    constructor(listEl) {
        this.listEl = listEl;
    }

    addMessage(msg, type = 'system') {
        this.list.push({ msg, type });
        if (this.list.length > this.maxMessages) {
            this.list.shift();
        }
        this.render();
    }

    render() {
        this.listEl.innerHTML = '';
        for (let i in this.list) {
            this.listEl.innerHTML += `<li class="${this.list[i].type}">${this.list[i].msg}</li>`;
        }
    }

}
