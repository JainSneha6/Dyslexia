// utils/puzzles.js

const puzzles = {
    dog: {
        word: 'DOG',
        tiles: ['D', 'O', 'G', 'R', 'S', 'T', 'N', 'E', 'H'], // Mix of correct and random letters
        correctWord: ['D', 'O', 'G'],
        image: '/gifs/dog.gif',
        voice: 'sounds/dog.mp3'
    },
    cat: {
        word: 'CAT',
        tiles: ['C', 'A', 'T', 'R', 'S', 'T', 'N', 'E', 'H'], // Mix of correct and random letters
        correctWord: ['C', 'A', 'T'],
        image: '/gifs/cat.gif',
        voice: 'sounds/cat.mp3'
    },
    rat: {
        word: 'RAT',
        tiles: ['R', 'A', 'T', 'R', 'S', 'T', 'N', 'E', 'H'], // Mix of correct and random letters
        correctWord: ['R', 'A', 'T'],
        image: '/gifs/rat.gif',
        voice: 'sounds/rat.mp3'
    },
    fox: {
        word: 'FOX',
        tiles: ['F', 'O', 'X', 'B', 'R', 'T', 'M', 'A', 'L'],
        correctWord: ['F', 'O', 'X'],
        image: '/gifs/fox.gif',
        voice: 'sounds/fox.mp3'
    }
};

export default puzzles;
