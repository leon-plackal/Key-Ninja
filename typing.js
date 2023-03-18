const words = 'modest fire resist execution colony silver manufacturer current scramble volunteer economics race mushroom oh occupation victory recruit job legislation carbon like dollar century angel endorse appeal jacket method thank is bet insight drown graze cluster ignite excitement sign wrong congress'.split(' ');

function addClass(el, name){
    el.className += ' '+name
}
function removeClass(el, name){
    el = el.className.replace(name, '')
}


// get random words from array
function randomWord() {
    const randomIndex = Math.ceil(Math.random() * words.length);
    return words[randomIndex];
}

// put words into separate divs
function formatWord(word) {
    // each word in a div, each letter in a span
    return `<div class="word">
                <span class="letter">
                    ${word.split('').join('</span><span class="letter">')}
                </span>
            </div>`;
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
})

newGame()