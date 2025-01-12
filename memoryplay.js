let n;
let timeoutID; //ישמש לאיפוס ולהפעלת טיימרים למשחק
let lastMoveTime = Date.now(); // זמן המהלך האחרון
let countdownTimer = 30; // הזמן שנותר (בניות זמן של 30 שניות)
let countdownInterval; // משתנה לאחסון interval עבור ספירה לאחור
let attempts = 0; // משתנה לספירת הניסיונות

window.clicklevel = function clicklevel(level) {

    // הסתרת ההודעה "please choose a level"
    const chooseLevelMessage = document.getElementById("chooseLevelMessage");
    if (chooseLevelMessage) {
        chooseLevelMessage.style.display = "none"; // מסתיר את ההודעה של לבחור רמה אם אנחנו לא בתפריט הראשי
    }
    const instructions = document.getElementById("instructions");
    if (instructions) instructions.style.display = "none";


    menu.style.display = "none";   //הסתרת התפריט
    gameBoard.style.display = "grid"; //קביעת תצוגת גריד לפי הצגת מטריצה
    backToMenuButton.style.display = "inline-block";  //מציג כפתור חזרה לתפריט

    // חישוב גודל המטריצה
    const size = Math.ceil(Math.sqrt(level)); // מספר העמודות במטריצה
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // חלוקה שווה לעמודות
    gameBoard.style.gap  = "5px"; // רווחים בין הקלפים

    // מנקה את לוח המשחק לפני יצירת קלפים חדשים 
    gameBoard.innerHTML = '';

   
    const cardsArray = [];  // יצירת מערך קלפים
    for (let i = 1; i <= level / 2; i++) {
        cardsArray.push(i);
        cardsArray.push(i);
    }

    // ערבוב הקלפים וקבלת סדר שונה
    cardsArray.sort(() => Math.random() - 0.5);

    // יצירת קלפים והוספתם ללוח
    cardsArray.forEach((cardValue) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.value = cardValue; // ערך הקלף
        card.textContent = ""; // התוכן מוסתר בהתחלה

        // אירוע לחיצה
        card.onclick = function () {
            handleCardClick(this);
        };

        gameBoard.appendChild(card);         //מוסיף את הקלף לגייםבורד
    });

    // יצירת אלמנט להצגת הזמן
    const timerDisplay = document.createElement("div");
    timerDisplay.id = "timerDisplay";
    timerDisplay.style.fontSize = "20px";
    timerDisplay.style.marginTop = "10px";
    timerDisplay.textContent = `Time left: ${countdownTimer} seconds`;
    gameBoard.appendChild(timerDisplay);

    // התחלת זמן timeout
    resetTimeout();
};


let firstCard = null;
let secondCard = null;
let lockBoard = false;

function handleCardClick(card) {
    // עדכון הזמן של המהלך האחרון
    lastMoveTime = Date.now();
    
    // איפוס זמן timeout
    resetTimeout();

    if (lockBoard || card.classList.contains("open")) return;

    card.classList.add("open");
    card.textContent = card.dataset.value; // חשיפת הערך של הקלף

    if (!firstCard) {
        // הקלף הראשון שנבחר
        firstCard = card;
    } else {
        // הקלף השני שנבחר
        secondCard = card;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        // התאמה
        firstCard = null;
        secondCard = null;
        attempts++; // ספירת ניסיון נוסף
        checkWin(); // בדוק אם כל הקלפים פתוחים
    } else {
        // אין התאמה - הפוך את הקלפים
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("open");
            secondCard.classList.remove("open");
            firstCard.textContent = "";
            secondCard.textContent = "";
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }, 1000);
    }
}

function checkWin() {
    const allCards = document.querySelectorAll(".card");
    const allOpen = Array.from(allCards).every(card => card.classList.contains("open")); // בדיקה אם כל הקלפים פתוחים
    if (allOpen) {
        // במקרה של ניצחון, הסר את השעון מיידית
        clearInterval(countdownInterval); // עצירת ספירת הזמן
        const timerDisplay = document.getElementById("timerDisplay");
        if (timerDisplay) {
            timerDisplay.remove(); // הסרת השעון
        }

        // יצירת הודעה על הצלחה
        const winMessage = document.createElement("div");
        winMessage.textContent = `You did it, you tried ${attempts} times`;      
        winMessage.style.textAlign = "center";
        winMessage.style.fontSize = "24px";
        winMessage.style.color = "green";
        winMessage.style.marginTop = "20px";
        winMessage.id = "winMessage";

        // הוספת ההודעה ללוח המשחק
        const gameBoard = document.getElementById("gameBoard");
        gameBoard.appendChild(winMessage);

        
    }
}

function restartgame() {
    const gameBoard = document.getElementById("gameBoard");
    const menu = document.getElementById("menu");
    gameBoard.style.display = "none"; // הסתרת לוח המשחק
    menu.style.display = "flex"; // הצגת תפריט בחירת רמה
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    clearTimeout(timeoutID); // עצירת ה-timeout
    clearInterval(countdownInterval); // עצירת ספירת הזמן
    document.getElementById("timerDisplay")?.remove(); // הסרת הצגת הזמן שנותר
    attempts = 0; // איפוס ספירת הניסיונות
}

function resetTimeout() {
    // עצירת ה-timeout הקודם (אם היה)
    clearTimeout(timeoutID);
    clearInterval(countdownInterval); // עצירת ספירת הזמן הקודמת

    // אתחול הזמן מחדש
    countdownTimer = 30; // זמן התחלה של 30 שניות

    // עדכון זמן הצגת הזמן שנותר
    const timerDisplay = document.getElementById("timerDisplay");
    timerDisplay.textContent = `Time left: ${countdownTimer} seconds`;

    // התחלת ספירה לאחור
    countdownInterval = setInterval(() => {
        countdownTimer--;
        timerDisplay.textContent = `Time left: ${countdownTimer} seconds`;

        // אם הזמן נגמר, הצגת ההודעה והתחלת משחק חדש
        if (countdownTimer <= 0) {
            clearInterval(countdownInterval); // עצירת ספירת הזמן
            const winMessage = document.createElement("div");
            winMessage.textContent = "You loose";  // הודעה על הפסד
            restartgame(); // אתחול המשחק
        }
    }, 1000); // עדכון כל שנייה
}


function backToMenu() {
    const gameBoard = document.getElementById("gameBoard");
    const menu = document.getElementById("menu");
    const backToMenuButton = document.getElementById("backToMenuButton");

    // הסתרת לוח המשחק והצגת התפריט
    gameBoard.style.display = "none";
    menu.style.display = "flex";

    // הסתרת כפתור חזרה לתפריט
    backToMenuButton.style.display = "none";

    // עצירת ספירת זמן
    clearInterval(countdownInterval); // עצירת ספירת הזמן
    clearTimeout(timeoutID); // עצירת ה-timeout
    document.getElementById("timerDisplay")?.remove(); // הסרת הצגת הזמן שנותר
    attempts = 0; // איפוס ספירת הניסיונות
}