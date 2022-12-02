import { ITurret } from "./turrets";

type Vector2 = MatterJS.Vector

interface IWorldActor{
    getWorld(): Phaser.Physics.Matter.World;
    getScene(): Phaser.Scene;
}

export interface IShip{
    setTurret(turret: ITurret): void;
    fire(): void;
    aim(target: Vector2): void;
    steer(target: Vector2): void;
    engineOn(): void;
    engineOff(): void; 
}

interface IShipConfig{
    mass?: number,
    friction?: number,
    turnSpeed?: number,
    textureId: string,
}

const DefaultShipConfig: IShipConfig = {
    textureId: 'default',
    mass: 5000,
    friction: 0.1,
    turnSpeed: Math.PI / 7
}

export class BaseShip extends Phaser.Physics.Matter.Sprite implements IWorldActor, IShip{
    
    private turnSpeed: number;
    private isEngineOn: boolean = false;
    private destination!: Vector2 | undefined;
    private turret!: ITurret;
    private matterWorld!: Phaser.Physics.Matter.World;
    private waterTrail!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(world: Phaser.Physics.Matter.World, x: number,y :number, conf: IShipConfig){

        conf = {...DefaultShipConfig, ...conf};

        super(world, x, y, conf.textureId, 0, {
            mass: conf.mass,
            frictionAir: conf.friction,
            vertices: [{"x":-50,"y":-3},{"x":-39,"y":-18},{"x":12,"y":-18},{"x":33,"y":-12},{"x":51,"y":0},{"x":34,"y":11},{"x":12,"y":18},{"x":-39,"y":18},{"x":-50,"y":3}]
        });

        this.turnSpeed = conf.turnSpeed || Math.PI/7;

        this.matterWorld = world;
        const trail = world.scene.add.particles('boat_1_trail');;
        this.waterTrail = trail.createEmitter({
            gravityX: 0,
            gravityY: 0,
            follow: this,
            alpha: {
                start: 1,
                end: 0,
                ease: 'Quadratic.Out'
            },
            lifespan: 8000,
            maxParticles: 100,
            frequency: 500,
            scale: {
                start: 1, 
                end: 5,
                ease: 'Quadratic.Out'
            },
            blendMode:'add'
        }).stop();

        world.scene.add.existing(this); 
        world.add(this);

    }

    getWorld(): Phaser.Physics.Matter.World{
        return this.matterWorld;
    }

    getScene(): Phaser.Scene{
        return this.world.scene;
    }

    setTurret(turret: ITurret): void{
        this.turret = turret;
    }

    fire(): void{
        this.turret.fire();
    }

    engineOn(): void{
        this.isEngineOn = true;
        this.waterTrail.start();
    }

    engineOff(): void {
        if (!this.isEngineOn) return;
        this.isEngineOn = false;
        this.steer(this.body.position);
        this.waterTrail.stop()
    }

    aim(target: Vector2): void{
        this.turret.track(target);
    }

    steer(dest: Vector2): void{
        this.destination = dest;
    }

    protected preUpdate(t: number, dt: number): void {

        super.preUpdate(t, dt);
        
        if (this.destination) {
   
            const targetAngleRad = Phaser.Math.Angle.BetweenPoints(
                this,
                this.destination
            ) ;
            
            
            const RadRotationDelta = Phaser.Math.Angle.RotateTo(
                this.rotation,
                targetAngleRad,
                this.turnSpeed * 0.001 * dt
            );

            this.setAngle(Phaser.Math.RadToDeg(RadRotationDelta));

        };

        if (this.isEngineOn){
            this.thrust(0.5)
        }

    }

}

export class LightBoat extends BaseShip{

    readonly TURN_SPEED = Math.PI/7;

    constructor(world: Phaser.Physics.Matter.World, x: number,y :number){

        super(world, x, y, {
            textureId: 'green_boat',
            mass: 5000,
            friction: 0.1,
            turnSpeed: Math.PI / 7
        });

    }
}