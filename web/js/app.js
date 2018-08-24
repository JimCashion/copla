var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('intro', introState);
game.state.add('run', runState);


game.state.start('boot');