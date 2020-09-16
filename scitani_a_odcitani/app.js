"use strict";
class View {
    constructor(game) {
        this.varianty = [
            /* 1  */ ["Sčítání do 10", "A2", "+", "all", "10"],
            /* 2  */ ["Odčítaní od 10", "A3", "-", "all", "10"],
            /* 3  */ ["Sčítání do 20 bez přechodu desítek", "A5", "+", "bez", "20 10"],
            /* 4  */ ["Odčítaní od 20 bez přechodu desítek", "A6", "-", "bez", "20 10"],
            /* 5  */ ["Počítání do 20 bez přechodu desítek", "A7", "+-", "bez", "20"],
            /* 6  */ ["Sčítání do 20", "B3", "+", "all", "20"],
            /* 7  */ ["Odčítaní od 20", "B4", "-", "all", "20"],
            /* 8  */ ["Počítání do 20", "B5", "+-", "all", "20"],
            /* 9  */ ["Sčítání desítek", "B6", "+", "des", "100"],
            /* 10 */ ["Odčítání desítek", "B7", "-", "des", "100"],
            /* 11 */ ["Sčítání do 100 bez přechodu desítek", "C2", "+", "bez", "100"],
            /* 12 */ ["Odčítání od 100 bez přechodu desítek", "C3", "-", "bez", "100"],
            /* 13 */ ["Sčítání do 100", "C5", "+", "all", "100"],
            /* 14 */ ["Odčítaní od 100", "C6", "-", "all", "100"],
            /* 15 */ ["Počítání do 100", "C7", "+-", "all", "100"]
        ];
        this.game = game;
        let el = document.getElementById("portal");
        //document.addEventListener("mousedown", ev => { console.log(`Mouse clicked at ${ev.x}, ${ev.y}`); });
        el.addEventListener("mousedown", ev => { window.location.href = "../portal.html"; });
        for (let i = 0; i < this.varianty.length; ++i) {
            let a = this.varianty[i];
            document.getElementById(a[1]).addEventListener("mousedown", ev => {
                this.nazev_hry = a[0];
                game.play(a[2], a[3], a[4]);
                this.redraw();
            });
        }
    }
    redraw() {
        // code to come 
    }
}
class Game {
    constructor() {
        // some code to come
    }
    play(operace, rezim, limit) {
        this.game_on = true;
        console.log(`operace: ${operace}, rezim: ${rezim}, limit: ${limit}`);
    }
}
/* ------------- run: ------------ */
let game = new Game();
let view = new View(game);
