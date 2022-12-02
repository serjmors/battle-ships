import { LoaderScene } from './scenes/loader'
import { BattleScene } from './scenes/battle'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Battle-ships',
  version: '1.0',
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  type: Phaser.AUTO,
  parent: 'game',
  disableContextMenu: true,
  scene: [
    LoaderScene,
    BattleScene
  ],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false,
  },
  physics: {
    default: 'matter',
    matter: {
        enableSleeping: true,
        gravity: {
            y: 0
        },
        debug: {
            showBody: true,
            showStaticBody: true,
            //showAxes: true
        }
    }
  },
  backgroundColor: '#000000',
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true
  }
};