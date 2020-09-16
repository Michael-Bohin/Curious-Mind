"use strict";
class View {
    constructor() {
        this.pocet_odpovedi = 0;
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
        let el = document.getElementById("portal");
        //document.addEventListener("mousedown", ev => { console.log(`Mouse clicked at ${ev.x}, ${ev.y}`); });
        if (el !== null)
            el.addEventListener("mousedown", ev => { window.location.href = "../portal.html"; });
        for (let i = 0; i < this.varianty.length; ++i) {
            let a = this.varianty[i];
            if (document.getElementById(a[1]) !== null)
                document.getElementById(a[1]).addEventListener("mousedown", ev => {
                    this.nazev_hry = a[0];
                    game.play(a[2], a[3], a[4]);
                    this.display_drag_count();
                });
        }
    }
    display_drag_count() {
        document.body.innerHTML = kolik_prikladu;
        document.getElementById("nazev_tema").innerHTML = this.nazev_hry;
        var seek = document.querySelector('.seekbar');
        var fill = document.querySelector('.fill');
        var handle = document.querySelector('.handle'); /* !!!!!! */
        var msg = document.getElementById('pocet');
        document.getElementById('hrajem').addEventListener('mousedown', function (e) { view.display_game(parseInt(msg.innerHTML)); });
        function clamp(min, val, max) { return Math.min(Math.max(min, val), max); }
        function pocet(val) { return 5 + Math.floor(val * 15); }
        let mousedown = false;
        seek.addEventListener('mousedown', function (e) {
            mousedown = true;
            var p = (e.clientX - seek.offsetLeft) / seek.clientWidth;
            clamp(0, p, 5);
            fill.style.width = p * 100 + '%';
            msg.innerHTML = `${pocet(clamp(0, p, 5))}`;
        });
        seek.addEventListener('mouseup', function (e) {
            if (!mousedown)
                return;
            mousedown = false;
            var p = (e.clientX - seek.offsetLeft) / seek.clientWidth;
            clamp(0, p, 1);
            fill.style.width = p * 100 + '%';
        });
        window.addEventListener('mousemove', function (e) {
            if (!mousedown)
                return;
            var p = (e.clientX - seek.offsetLeft) / seek.clientWidth;
            clamp(0, p, 1);
            fill.style.width = p * 100 + '%';
            msg.innerHTML = `${pocet(clamp(0, p, 1))}`;
        });
    }
    display_game(c) {
        game.update_count(c);
        document.body.innerHTML = hra;
        for (let i = 1; i < 21; ++i)
            document.body.innerHTML += `<p class="odp" id="odp${i}"></p>`;
        document.getElementById("nazev_tema").innerHTML = view.nazev_hry; // well what can I say. pointing to the class from inside the class
        document.addEventListener("keydown", ev => { if (ev.key == "Enter")
            this.post_answer(); });
        document.getElementById("tlacitko").addEventListener("mousedown", ev => { this.post_answer(); });
        document.getElementById("priklad").innerHTML = game.get_next() + " =";
    }
    post_answer() {
        var inputValue = document.getElementById("odpoved").value;
        document.getElementById("odpoved").value = ""; // reset to empty string 
        console.log(`user's current answer is: ${inputValue}`);
        let pr = document.getElementById("priklad");
        this.pocet_odpovedi += 1;
        console.log(`pocet odpovedi: ${this.pocet_odpovedi}`);
        let odp = document.getElementById(`odp${this.pocet_odpovedi}`);
        odp.innerHTML = `${pr.innerHTML} ${inputValue}`;
        if (game.eval_answer(parseInt(inputValue))) {
            pr.innerHTML = game.get_next() + " =";
        }
        else {
            odp.style.left = "1300px";
            if (this.pocet_odpovedi > 10)
                odp.style.left = "1460px";
            odp.style.height = "42px";
            odp.className = "odp button fire";
        }
        if ((this.pocet_odpovedi - game.total_incorrect) == game.exercise_count)
            this.end_game();
    }
    end_game() {
        console.log("ending game");
        this.remove_ids(["priklad", "tlacitko", "odpoved"]);
        this.add_ice_btn([["Hrát znovu", "rep"], ["Sčítání a odčítání", "submenu"], ["&#8617 Portál", "portal2"]]);
        if (game.total_incorrect == 0) {
            let audio = new Audio('./Victory.mp3');
            audio.play();
            document.body.innerHTML += `<p id="gg_win">Skvělý! Všechny příklady máš dobře. </p> `;
        }
        else {
            // add text with nice we made through, check where you can improve 
            // Pěkně, našel jsou všechny správné odpovědi. Koukni na ty příklady, na které jsi potřeboval víc pokusů.
            let temp = document.body.innerHTML;
            document.body.innerHTML = temp + `<p id="gg_improve1">Pěkně, našel jsi všechny správné odpovědi.</p> <p id="gg_improve2">Koukni na ty příklady, na které jsi potřeboval víc pokusů. :) </p> `;
            this.mistakes_move();
        }
        document.getElementById("rep").addEventListener("mousedown", this.restart);
        document.getElementById("submenu").addEventListener("mousedown", function () { window.location.reload(); });
        document.getElementById("portal2").addEventListener("mousedown", function () { window.location.href = "../portal.html"; });
    }
    restart() {
        console.log("restarting:");
        game.restart();
        document.body.innerHTML = hra;
        for (let i = 1; i < 21; ++i)
            document.body.innerHTML += `<p class="odp" id="odp${i}"></p>`;
        document.getElementById("nazev_tema").innerHTML = view.nazev_hry;
        document.getElementById("priklad").innerHTML = game.get_next() + " =";
        view.pocet_odpovedi = 0;
    }
    remove_ids(ids) {
        for (let i = 0; i < ids.length; ++i) {
            let element = document.getElementById(ids[i]);
            element.parentNode.removeChild(element);
        }
    }
    add_ice_btn(input) {
        let temp_body = document.body.innerHTML;
        for (let i = 0; i < input.length; ++i) {
            temp_body = temp_body + ` <div id="${input[i][1]}" class="button2 ice green">${input[i][0]}</div> `;
        }
        document.body.innerHTML = temp_body;
    }
    mistakes_move() {
        // move mistakes, at least one is guaranteed 
        console.log('moving mistakes');
        const init_left = 330;
        const spacing = 200;
        let counter = 0;
        let g = game;
        for (let i = 1; i <= (game.total_incorrect + game.exercise_count); ++i) {
            if (counter == 5) {
                break; // move at most 5 mistakes, due to space reasons
            }
            let el = document.getElementById(`odp${i}`);
            let text = el.innerHTML;
            let qq = text.split("=")[0];
            let aa = text.split("=")[1];
            let q = eval(qq);
            let a = parseInt(aa);
            if (q != a) { // mistake has been made at this index
                counter += 1;
                el.style.top = "450px";
                el.style.left = `${init_left + ((counter - 1) * spacing)}px`;
            }
        }
    }
}
/* ------------- run: ------------ */
var game = new Game();
var view = new View();
