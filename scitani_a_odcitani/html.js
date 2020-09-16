"use strict";
var kolik_prikladu = `    
    <p id="nazev_tema">Sčítání do 20</p>
    <p id="otazka">Kolik příkladů chceš spočítat?</p>
    <p id="pocet">5</p>
    <div id="tabule"></div>
    <div class="container">
        <div class="seekbar">
        <div class="fill"></div>
        <div class="handle"></div>
        </div>
    </div>
    <div id="hrajem" class="button2 ice green">Jedeme!</div>
`;
var hra = `
    <p id="nazev_tema"></p>
    <div id="tabule"></div>
    <p id="priklad"></p>
    <input type="number" onblur="this.focus()" autocomplete="off" id="odpoved" name="odpoved" min="0" max="100" value="" step="1" autofocus/>
    <input type="submit" value=">>" id="tlacitko">
    <div id="herni_tabule"></div>
`;
