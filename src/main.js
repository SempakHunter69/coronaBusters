import CoronaBusterScene from './scenes/CoronaBusterScene';
import { AUTO, Scale, Game } from 'phaser';
import GameOverScene from './scenes/GameOverScene';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: AUTO,
    wwidth: 400, //----------->1. canvas width 
    height: 620, //----------->2. canvas height
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }, //--------> 3. gravitasi 0 agar pesawat tidak jatuh
        },
    },
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        CoronaBusterScene, GameOverScene,
    ]
};

export default new Game(config);