import { BaseShip } from "./ships";

type Vector2 = MatterJS.Vector

export interface ITurret{
    readonly TURN_SPEED: number;
    track(target: Vector2): void;
    stopTracking(): void;
    fire(): void;
}

class BaseTurret extends Phaser.GameObjects.Sprite implements ITurret{
    
    readonly TURN_SPEED = Math.PI/2;
    
    protected ship!: BaseShip;
    protected pivot!: Vector2;
    protected target!: Vector2 | undefined;

    constructor(ship: BaseShip, tex:string){
        super(ship.getScene(), 0, 0, tex);
        this.ship = ship;
        ship.getScene().anims.createFromAseprite(tex);
        ship.setTurret(this);
        ship.getScene().add.existing(this);
    };

    protected turretOrigin(): Vector2{
        return this.ship.getCenter()
    }

    protected projectileOrigin(): Vector2{
        throw new Error('not implemented')
    } 

    protected preUpdate(t: number, dt: number): void {
        super.preUpdate(t, dt);

        this.pivot = this.turretOrigin();
        this.setPosition(this.pivot.x, this.pivot.y);

        if (this.target){

            const targetAngleRad = Phaser.Math.Angle.BetweenPoints(
                this.pivot,
                this.target
            ) ;

            const RadRotationDelta = Phaser.Math.Angle.RotateTo(
                this.rotation,
                targetAngleRad,
                this.TURN_SPEED * 0.001 * dt
            );

            this.setAngle(Phaser.Math.RadToDeg(RadRotationDelta));

        }
    }

    track(target: Vector2): void{
        this.target = target;
    }

    stopTracking(): void{
        this.target = undefined;
    }

    
    fire(): void{
        this.play("Fire", true)
    }

}

export class SingleTurret extends BaseTurret{

    readonly TURN_SPEED = Math.PI/2;

    constructor(ship: BaseShip, tex: string){ 
        super(ship, tex); 
        this.setOrigin(0.14, 0.54);
    }

    protected projectileOrigin(): Vector2 {
        return this.getCenter().lerp(this.getRightCenter(), 0.65)
    }

    protected turretOrigin(): Vector2 {
        return this.ship.getCenter().lerp(this.ship.getLeftCenter(), 0.2)
    }

    fire(): void {
        super.fire();
    }

}