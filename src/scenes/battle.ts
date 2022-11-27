import { Ship } from "../objects/ship";
import { Gun } from "../objects/gun";
import AnimatedTiles from 'phaser-animated-tiles-phaser3.5';

export class BattleScene extends Phaser.Scene {
    
    private animatedTiles!: Phaser.Plugins.ScenePlugin;
    
    private target: Phaser.Math.Vector2 = new Phaser.Math.Vector2(400, 300);
    private dest!: Phaser.GameObjects.Sprite;
    private source!: Ship;
    private graphics!: Phaser.GameObjects.Graphics;

    constructor() {
      super({
        key: 'BattleScene'
      });
    }
    
    preload(): void{
        this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    create(): void {

        const scene = this;
        const camera = this.cameras.main;

        const map = this.make.tilemap({ key: 'map'});
        const tileset = map.addTilesetImage('animated-tileset');
        map.createLayer(0, tileset);

        this.animatedTiles.init(map);
        
        this.dest = this.add.sprite(0, 0, 'destination_point');
        this.dest.visible = false;
        this.anims.createFromAseprite('destination_point')
           
        this.source = new Ship(this.matter.world, 400, 300, 'green_boat');
        new Gun(this.source, 'green_cannon');
              
        this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa, alpha: 0.5} });
        
        camera.startFollow(this.source, false, 0.04, 0.04);

        this.input.on(
            'wheel', 
            (
                pointer: Phaser.Input.Pointer,
                gameObjects: Array<Phaser.GameObjects.GameObject>,
                deltaX: number, deltaY: number, deltaZ: number
            ) => 
            {  
                camera.zoom -= deltaY * 0.001;
                camera.zoom = Phaser.Math.Clamp(camera.zoom, 0.4, 1)
    
            }
        );

        this.input.on('pointerup', function (pointer: Phaser.Input.Pointer) {
            
            scene.target.x = pointer.worldX;
            scene.target.y = pointer.worldY;

            scene.dest.setPosition(pointer.worldX, pointer.worldY);
            scene.dest.visible = true;
            scene.dest.play({
                key:'pulse',
                repeat: -1
            });

            scene.source.engineOn();
            scene.source.steerTo(scene.target); 
           
        });

        this.input.on('pointermove', function (pointer: Phaser.Input.Pointer) {
            scene.source.targetTo({x: pointer.worldX, y: pointer.worldY})
        });

    
    }
  
    update(): void {
        
        this.graphics.clear();
        this.graphics.strokeLineShape(
            new Phaser.Geom.Line(
                this.source.getCenter().x,
                this.source.getCenter().y,
                this.target.x,
                this.target.y
        ));
        
        /*
        this.graphics.lineStyle(4, 0xff0000, 0.7);        
        this.graphics.strokeLineShape(
            new Phaser.Geom.Line(
                this.source.getCenter().x, this.source.getCenter().y, 
                this.source.body.velocity.x * 300 + this.source.getCenter().x,
                this.source.body.velocity.y * 300 + this.source.getCenter().y
            )
        );
        */
    }
  

}