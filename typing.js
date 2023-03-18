const words = 'modest fire resist execution colony silver manufacturer current scramble volunteer economics race mushroom oh occupation victory recruit job legislation carbon like dollar century angel endorse appeal jacket method thank is bet insight drown graze cluster ignite excitement sign wrong congress'.split(' ');

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
}


document.getElementById('game').addEventListener('keyup', ev => {
    // key is the pressed key when typing
    const key = ev.key
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current')
    const expected = currentLetter?.innerHTML || ' '
    const isLetter = key.length === 1 && key !== ' '
    const isSpace = key === ' '

    console.log({key, expected})
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

})

newGame()