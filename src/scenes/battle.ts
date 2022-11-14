import { Ship } from "../objects/ship";


export class BattleScene extends Phaser.Scene {
    
    private target: Phaser.Math.Vector2 = new Phaser.Math.Vector2(400, 300);
    private source!: Ship;
    private graphics!: Phaser.GameObjects.Graphics;

    constructor() {
      super({
        key: 'BattleScene'
      });
    }

    preload(): void{
        this.load.image('battleship', 'assets/sprites/battleship-hull.png');
    }
    
    create(): void {
        const scene = this;

        this.source = new Ship(this.matter.world, 400, 300, 'battleship')        
        this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa, alpha: 0.5} });
        
        this.input.on('pointerup', function (pointer: Phaser.Input.Pointer) {
            
            scene.target.x = pointer.x;
            scene.target.y = pointer.y;

            scene.source.engineOn();
            scene.source.steerTo(scene.target);
           
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

        this.graphics.lineStyle(4, 0xff0000, 0.7);        
        this.graphics.strokeLineShape(
            new Phaser.Geom.Line(
                this.source.getCenter().x, this.source.getCenter().y, 
                this.source.body.velocity.x * 300 + this.source.getCenter().x,
                this.source.body.velocity.y * 300 + this.source.getCenter().y
            )
        );
    }
  

}