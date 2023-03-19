const words = 'how may if will line well then than out where place look back we man for on these lead since only any year leave consider ask any small you general word also however house nation we follow keep become move there make would call because way long after among us write zebra zoom system down back around be here child last think thought possible perhaps group another against towards brain potato script split imposter suspect theme'.split(' ');
var gameTime = 30*1000;
window.timer = null
window.gameStart = null;

//theme change
// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}// function to toggle between light and dark theme
function toggleTheme() {
   if (localStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
   } else {
       setTheme('theme-dark');
   }
}// Immediately invoked function to set the theme on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-dark') {
       setTheme('theme-dark');
   } else {
       setTheme('theme-light');
   }
})();

//user timers
document.getElementById('60').addEventListener('click', () => {
    gameTime = 60*1000;
    document.getElementById('info').innerHTML = (gameTime/1000) + ''
    clearInterval(window.timer)
    newGame()
  });
document.getElementById('30').addEventListener('click', () => {
    gameTime = 30*1000;
    document.getElementById('info').innerHTML = (gameTime/1000) + ''
    clearInterval(window.timer)
    newGame()
});
document.getElementById('15').addEventListener('click', () => {
    gameTime = 15*1000;
    document.getElementById('info').innerHTML = (gameTime/1000) + ''
    clearInterval(window.timer)
    newGame()
});

//class modifiers
function addClass(el,name) {
    el.className += ' '+name;
  }
  function removeClass(el,name) {
    el.className = el.className.replace(name,'');
  }


// get random words from array
function randomWord() {
    const randomIndex = Math.ceil(Math.random() * words.length);
    return words[randomIndex-1];
}

// put words into separate divs
function formatWord(word) {
    // each word in a div, each letter in a span
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

//start new game
function newGame(){
    // remove game over class if exists
    document.getElementById('game').classList.remove("over")

    // postiion cursor
    cursor.style.transform = `translateX(${0 + 'px'})`
    cursor.style.top = 285+'px';
    cursor.style.left = 520+'px'

    // clear div upon new game
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) { 
        // fill divs with random words
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current')
    addClass(document.querySelector('.letter'), 'current')
    //fill second timer
    document.getElementById('info').innerHTML = (gameTime/1000) + 's'
    window.timer = null
    window.gameStart = null;
}

function getWPM() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const typedWords = words.slice(0, words.indexOf(lastTypedWord));
    const currentWord = typedWords.fill(word => {
      const letters = [...word.children]
      const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'))
      const correctLetters = letters.filter(letter => letter.className.includes('correct'))
        return incorrectLetters.length === 0 && correctLetters.length === letters.length
    })
    return currentWord.length / gameTime * 60000
}

function gameOver() {
    clearInterval(window.timer)
    addClass(document.getElementById('game'), 'over')
    const result = getWPM()
    document.getElementById('info').innerHTML = `WPM: ${result}`
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current')
    const expected = currentLetter?.innerHTML || ' '
    const isLetter = key.length === 1 && key !== ' '
    const isSpace = key === ' '
    const isBackspace = key === 'Backspace'
    const isFirstLetter = currentLetter === currentWord.firstChild

    if (document.querySelector('#game.over')){
        return;
    }

    // game timer
    if (!window.timer && isLetter) {
        window.timer = setInterval( () => {
            if (!window.gameStart){
                window.gameStart = (new Date()).getTime()
            }
            const currentTime = (new Date()).getTime()
            const msPassed = currentTime - window.gameStart
            const sPassed = Math.round(msPassed/1000)
            const secondsLeft = (gameTime / 1000) - sPassed
            if (secondsLeft <= 0) {
                gameOver()
                return;
            }
            document.getElementById('info').innerHTML = secondsLeft + ''
        }, 1000)
    }

    if (isLetter){
        if (currentLetter){
            // if key is expected, add correct else add incorrect (changes colors via css states)
            addClass(currentLetter, key===expected ? 'correct' : 'incorrect')
            removeClass(currentLetter, 'current')
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current')
            }
            
        }else{
            const incorrectLetter = document.createElement('span')
            incorrectLetter.innerHTML  = key
            incorrectLetter.className = 'letter incorrect extra'
            currentWord.appendChild(incorrectLetter)
        }
    }
    if (isSpace){
        if (expected !== ' '){
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')]
            lettersToInvalidate.forEach(letter =>{
                addClass(letter, 'incorrect')
            })
        }
        removeClass(currentWord, 'current')
        addClass(currentWord.nextSibling, 'current')
        if (currentLetter){
            removeClass(currentLetter, 'current')
        }
        addClass(currentWord.nextSibling.firstChild, 'current')
    }

    if (isBackspace){
        if (currentLetter && isFirstLetter){
            //make previous word current
            removeClass(currentWord, 'current')
            addClass(currentWord.previousSibling, 'current')
            removeClass(currentLetter, 'current')
            addClass(currentWord.previousSibling.lastChild, 'current')
            removeClass(currentWord.previousSibling.lastChild, 'incorrect')
            removeClass(currentWord.previousSibling.lastChild, 'correct')
        }
        if (currentLetter && !isFirstLetter){
            // move back one, invalidate current letter
            removeClass(currentLetter, 'current')
            addClass(currentLetter.previousSibling, 'current')
            removeClass(currentLetter.previousSibling, 'incorrect')
            removeClass(currentLetter.previousSibling, 'correct')
        }
        if (!currentLetter){
            addClass(currentWord.lastChild, 'current')
            removeClass(currentWord.lastChild, 'incorrect')
            removeClass(currentWord.lastChild, 'correct')
        }
    }
    //move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    const transformation = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right']
    // smoother the cursor movement with transform
    cursor.style.transform = `translateX(${transformation - 520 + 'px'})`;

    //move lines vertically
    if (currentWord.getBoundingClientRect().top > 320){
        const words = document.getElementById('words')
        const margin = parseInt(words.style.marginTop || '0px')
        words.style.marginTop = (margin - 35) +'px'
    }
})

//click/UI functions
    //new game button
    document.getElementById('newGameBtn').addEventListener('click', () => {
        gameOver();
        newGame();
    });
    //tab to reset
    document.addEventListener('keydown', function(e){
        if(e.key == 'Tab'){
            e.preventDefault();
            const words = document.getElementById('words')
            words.style.marginTop = (0) +'px'
        gameOver();
        newGame();
        }
    })
    //reset button (same as reset button)
    document.getElementById('reset').addEventListener('click', () => {
        gameOver();
        newGame();
    });
newGame()