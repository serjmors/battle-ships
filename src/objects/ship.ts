import { Gun } from "./gun";

type Vector2 = MatterJS.Vector

export class Ship extends Phaser.Physics.Matter.Sprite{
    
    private isEngineOn: boolean = false;
    private destination!: Vector2;
    private target!: Vector2;
    private gun!: Phaser.GameObjects.Sprite;
    
    private matterWorld!: Phaser.Physics.Matter.World;

    private waterTrail!: Phaser.GameObjects.Particles.ParticleEmitter;
    
    readonly SHIP_TURN_SPEED = Math.PI/7;
    readonly GUN_TURN_SPEED = Math.PI/2;

    constructor(world: Phaser.Physics.Matter.World, x: number,y :number, tex: string, frame?: number){

        super(world, x, y, tex, frame, {
            mass: 5000,
            frictionAir: 0.1
        });

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
        });

        world.scene.add.existing(this); 
        world.add(this);
       
        this.destination = this.body.position;
        
        this.setInteractive().on(
            'pointerup', (pointer: Phaser.Input.Pointer,
            localX: number, localY: number, event: any) =>
        {
            event.stopPropagation();
            console.log('selected');
        });

    }

    setGun(gun: Gun){
        this.gun = gun;
    }

    getWorld(): Phaser.Physics.Matter.World{
        return this.matterWorld;
    }
    getScene(): Phaser.Scene{
        return this.world.scene;
    }

    fire(): void{
        this.gun.play("Fire", true);
    }

    engineOn(): void{
        this.isEngineOn = true;
        this.waterTrail.start();
    }

    engineOff(): void {
        if (!this.isEngineOn) return;
        this.isEngineOn = false;
        this.steerTo(this.body.position);
        this.waterTrail.stop()
    }

    targetTo(target: Vector2): void{
        this.target = target;
    }

    steerTo(dest: Vector2): void{
        this.destination = dest;
    }

    protected preUpdate(t: number, dt: number): void {

        super.preUpdate(t, dt);

        if (this.target){

            const targetAngleRad = Phaser.Math.Angle.BetweenPoints(
                this.gun,
                this.target
            ) ;

            const RadRotationDelta = Phaser.Math.Angle.RotateTo(
                this.gun.rotation,
                targetAngleRad,
                this.GUN_TURN_SPEED * 0.001 * dt
            );

            this.gun.setAngle(Phaser.Math.RadToDeg(RadRotationDelta));

        }
        
        if (this.destination) {
   
            const targetAngleRad = Phaser.Math.Angle.BetweenPoints(
                this,
                this.destination
            ) ;
            
            
            const RadRotationDelta = Phaser.Math.Angle.RotateTo(
                this.rotation,
                targetAngleRad,
                this.SHIP_TURN_SPEED * 0.001 * dt
            );

            this.setAngle(Phaser.Math.RadToDeg(RadRotationDelta));

        };

        if (this.isEngineOn){
            this.thrust(0.5)
        }

    }

}