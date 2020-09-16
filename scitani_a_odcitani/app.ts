class View {
    game: Game;
    nazev_hry: string;

    varianty: string[][] = [ // [ nazev, id tlacitka reprezentujici variantu, povolene operace, rezim, limit]
        /* 1  */["Sčítání do 10",                       "A2", "+",  "all", "10"], 
        /* 2  */["Odčítaní od 10",                      "A3", "-",  "all", "10"], 
        /* 3  */["Sčítání do 20 bez přechodu desítek",  "A5", "+",  "bez", "20 10"], // napad jak zjistit ctvrtou varibale
        /* 4  */["Odčítaní od 20 bez přechodu desítek", "A6", "-",  "bez", "20 10"], // 20 10 jestli split.length > 1 :)
        /* 5  */["Počítání do 20 bez přechodu desítek", "A7", "+-", "bez", "20"], 
        /* 6  */["Sčítání do 20",                       "B3", "+",  "all", "20"],
        /* 7  */["Odčítaní od 20",                      "B4", "-",  "all", "20"],
        /* 8  */["Počítání do 20",                      "B5", "+-", "all", "20"],
        /* 9  */["Sčítání desítek",                     "B6", "+",  "des", "100"],
        /* 10 */["Odčítání desítek",                    "B7", "-",  "des", "100"],
        /* 11 */["Sčítání do 100 bez přechodu desítek", "C2", "+",  "bez", "100"],
        /* 12 */["Odčítání od 100 bez přechodu desítek","C3", "-",  "bez", "100"],
        /* 13 */["Sčítání do 100",                      "C5", "+",  "all", "100"],
        /* 14 */["Odčítaní od 100",                     "C6", "-",  "all", "100"],
        /* 15 */["Počítání do 100",                     "C7", "+-", "all", "100"]
    ];

    constructor(game: Game) {
        this.game = game;
        let el = document.getElementById("portal");
        //document.addEventListener("mousedown", ev => { console.log(`Mouse clicked at ${ev.x}, ${ev.y}`); });
        el.addEventListener("mousedown", ev => { window.location.href = "../portal.html"; });
        for(let i: number = 0; i < this.varianty.length; ++i) {
            let a: string[] = this.varianty[i]; 
            document.getElementById(a[1]).addEventListener("mousedown", ev => {
                this.nazev_hry = a[0]; 
                game.play(a[2], a[3], a[4]);
                this.display_drag_count(); 
            });
        }
    }

    display_drag_count() {

    }

    redraw() {
        // code to come 
    }

}

class Game {
    public exercise_count: number =  -9;
    public answers_player: number[][] = new Array(21);
    public total_incorrect: number = 0;
    public questions: string[] = new Array(21).fill("");

    private higher_limit: number; // maximum result 
    private lower_limit: number = 0; // minimum result 
    private answers: number[] = new Array(21).fill(-9);
    private current_problem: number = 1;

    constructor() {
        for(let i : 1; i < 21; ++i)
            this.answers_player = new Array(0);
        /*  method play: accept type of game: operation (+,-), mode (all, bez prechodu, desitky), limit (upper, if whitespace index 1 is lower limit)
         *                 this method will generate the whole exercise for 20 problems holding an array of problems in strings questions and array of numbers as answers 
         *  
         *  method update_count: updates how many exercises user has chosen to play and sets the game on bool to true
         *  method eval_answer: recieves answer from player, and returns true or false, depending to corectness of answer ,record all false answers
         *  method get_next: upon request from class view after correct answer sends next exercise  
         * 
         *  history of answers is saved to answers_player: number[][], questions are stored in questions: string, sum of wrong answers at total_incorrect: number. 
         */                                                 
    }

    private randint(min: number, max: number): number { //The maximum is inclusive and the minimum is inclusive 
        min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1) + min); 
    }

    public play(operace: string, rezim: string, limit: string): void {   // initialize the game before knowing total count exercises, 
        function randint(min: number, max: number): number { /*inclusive min and max */ min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1) + min); } console.log(`operace: ${operace}, rezim: ${rezim}, limit: ${limit}`);
        let split_limit: string[] = limit.split(" ");
        if(split_limit.length != 1) 
            this.lower_limit = parseInt(split_limit[1]);
        this.higher_limit = parseInt(split_limit[0]);

        // generate exercises:
        for(let i: number = 1; i < 21; ++i) {
            let local_op: string = "+";
            if(operace == "+-" && (Math.random() < 0.5)) local_op = "-";
            if(operace == "-") local_op = "-";

            let a: number = randint(this.lower_limit, this.higher_limit);
            let b: number;
            if(local_op == "+") {
                b = randint(0, (this.higher_limit - a));
                if(rezim == "bez") {
                    let units: number = a % 10; // + => 0 b = <0, 9>, 1 b = <0, 8> , 2 b = <0, 7>, .... 8 b = <0, 1>, 9 b <0, 0>
                    b = randint(0, (9 - units)); 
                }
            } else /* operace minus */ {
                b = randint(0, (a - this.lower_limit));
                if(rezim == "bez") {
                    let units: number = a % 10; // - => 0 b = <0, 0>, 1 b = <0, 1> , 2 b = <0, 2>, .... 8 b = <0, 8>, 9 b <0, 9>
                    b = randint(0, units); 
                }
            }
            if(rezim == "des") {
                a = Math.floor(a / 10) * 10;
                b = Math.floor(b / 10) * 10;
            }
            this.questions[i] = `${a} ${local_op} ${b}`;
            this.answers[i] = a + b;
            if(local_op == "-") this.answers[i] = a - b;
        }
    }

    public update_count(count: number): void { this.exercise_count = count; }
    public get_next(): string { return this.questions[this.current_problem]; }
    public eval_answer(x: number): boolean { 
        if(x == this.answers[this.current_problem]) { 
            this.answers_player[this.current_problem].push(x);
            this.current_problem += 1; 
            return true;
        }
        this.answers_player[this.current_problem].push(x);
        this.total_incorrect += 1;
        return false;
    }
}

/* ------------- run: ------------ */
let game: Game = new Game();
let view: View = new View(game);