import { EditorScene } from './scenes/editor'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Battle-ships-editor',
  version: '1.0',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 800,
  },
  type: Phaser.AUTO,
  parent: 'editor',
  disableContextMenu: true,
  scene: [
    EditorScene
  ],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false,
  },
  physics: {
    default: 'arcade'
  },
  backgroundColor: '#000000',
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false
  }
};