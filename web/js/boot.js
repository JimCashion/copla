var bootState = {

	create: function () {

		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = "#4488AA";
		game.state.start('load');
		
	}
}