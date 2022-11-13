class Ship extends Phaser.Physics.Arcade.Sprite{
    
    private isEngineOn: boolean = false;
    private destination!: Phaser.Math.Vector2;
    
    
    readonly TURN_SPEED = Math.PI/5;

    constructor(scene: Phaser.Scene, x: number,y :number, tex: string){
        super(scene, x, y, tex)

        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.destination = this.body.position;
    }

    engineOn(speed: number): void{
        this.isEngineOn = true;
        const newSpeed = Phaser.Math.Vector2.UP.clone().setLength(speed);
        this.body.velocity.setFromObject(newSpeed)
    }

    engineOff(): void {
        if (!this.isEngineOn) return;
        this.isEngineOn = false;
        this.steerTo(this.body.position);
    }

    steerTo(dest: Phaser.Math.Vector2): void{
        this.destination = dest;
    }

    protected preUpdate(t: number, dt: number): void {

        if (this.body.velocity.length() <= 0) return;
        if (this.destination) {
   
            const targetAngleRad = Phaser.Math.Angle.BetweenPoints(
                this,
                this.destination
            ) + Math.PI/2;

            this.rotation = Phaser.Math.Angle.RotateTo(
                this.rotation,
                targetAngleRad,
                this.TURN_SPEED * 0.0005 * dt
            );
            this.body.velocity.setToPolar(
                this.rotation - Math.PI/2,
                this.body.velocity.length()
            );

        };

    }


}

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

        // this.source = this.physics.add.image(400, 300, 'battleship');
        this.source = new Ship(this, 400, 300, 'battleship')
        
        this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa, alpha: 0.5} });

        this.input.on('pointerup', function (pointer: Phaser.Input.Pointer) {
            
            scene.target.x = pointer.x;
            scene.target.y = pointer.y;

            scene.source.engineOn(20);
            scene.source.steerTo(scene.target);
           
            //scene.physics.moveToObject(scene.source, scene.target, 200);

        });
    
    }
  
    update(): void {
        
        this.graphics.clear();
        this.graphics.strokeLineShape(new Phaser.Geom.Line(this.source.body.center.x, this.source.body.center.y, this.target.x, this.target.y));

        this.graphics.lineStyle(4, 0xff0000,1);

        this.graphics.strokeLineShape(
            new Phaser.Geom.Line(
                this.source.body.center.x, this.source.body.center.y, 
                this.source.body.velocity.x * 3 + this.source.body.center.x,
                this.source.body.velocity.y * 3 + this.source.body.center.y
            )
        );
    }
  

}