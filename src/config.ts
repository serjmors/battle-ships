import {BattleScene} from './scenes/battle'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Battle-ships',
  version: '1.0',
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [
    BattleScene
  ],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true }
};