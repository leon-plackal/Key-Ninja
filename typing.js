const words = 'modest fire resist execution colony silver manufacturer current scramble volunteer economics race mushroom oh occupation victory recruit job legislation carbon like dollar century angel endorse appeal jacket method thank is bet insight drown graze cluster ignite excitement sign wrong congress'.split(' ');
const gameTime = 3*1000;
window.timer = null
window.gameStart = null;

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


function newGame(){
    // clear div upon new game
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) { 
        // fill divs with random words
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current')
    addClass(document.querySelector('.letter'), 'current')
    window.timer = null
}

function getWPM() {
    const words = [...document.querySelectorAll('.word')];
}

function gameOver() {
    clearInterval(window.timer)
    addClass(document.getElementById('game'), 'over')
    document.getElementById('info').innerHTML = `WPM: ${getWPM}`
}

document.getElementById('game').addEventListener('keyup', ev => {
    // key is the pressed key when typing
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

    console.log({key, expected})

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
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';


    //move lines
    if (currentWord.getBoundingClientRect().top > 260){
        const words = document.getElementById('words')
        const margin = parseInt(words.style.marginTop || '0px')
        words.style.marginTop = (margin - 35) +'px'

    }
})

newGame()