type Vector2 = MatterJS.Vector

export class Ship extends Phaser.Physics.Matter.Sprite{
    
    private isEngineOn: boolean = false;
    private destination!: Vector2;    
    
    readonly TURN_SPEED = Math.PI/7;

    constructor(world: Phaser.Physics.Matter.World, x: number,y :number, tex: string){
        super(world, x, y, tex);

        world.add(this);
        world.scene.add.existing(this);
        this.setMass(5000);
        this.setFrictionAir(0.1)

        this.destination = this.body.position;
    }

    engineOn(): void{
        this.isEngineOn = true;
    }

    engineOff(): void {
        if (!this.isEngineOn) return;
        this.isEngineOn = false;
        this.steerTo(this.body.position);
    }

    steerTo(dest: Vector2): void{
        this.destination = dest;
    }

    protected preUpdate(_: number, dt: number): void {

        if (this.destination) {
   
            const targetAngleRad = Phaser.Math.Angle.BetweenPoints(
                this,
                this.destination
            ) + Math.PI/2;
            
            
            const RadRotationDelta = Phaser.Math.Angle.RotateTo(
                this.rotation,
                targetAngleRad,
                this.TURN_SPEED * 0.0005 * dt
            );

            this.setAngle(Phaser.Math.RadToDeg(RadRotationDelta));

        };

        if (this.isEngineOn){
            this.thrustLeft(0.5)
        }

    }

}