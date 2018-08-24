//  custom text class 'class'
//  in case
CustomText = function (game, x, y, text, style) {

    Phaser.Text.call(this, game, x, y, text, style);

    this.anchor.set(0);

};

CustomText.prototype = Object.create(Phaser.Text.prototype);
CustomText.prototype.constructor = CustomText;

CustomText.prototype.update = function() {

};

