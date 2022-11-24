import { Ship } from "./ship";

type Vector2 = MatterJS.Vector

export class Gun extends Phaser.GameObjects.Sprite{

    private ship!: Ship;
    private pivot!: Vector2;
    readonly GUN_TURN_SPEED = Math.PI/2;

    constructor(ship: Ship, tex: string){
        super(ship.getScene(), 0, 0, tex);
        this.ship = ship;
        this.setOrigin(0.14,0.54);
        ship.getScene().anims.createFromAseprite(tex);
        ship.setGun(this);
        ship.getScene().add.existing(this);  
    }

    fire(): void{
        this.play("Fire", true);
    }

    protected preUpdate(t: number, dt: number): void {
        
        super.preUpdate(t, dt);

        this.pivot = this.ship.getCenter().lerp(this.ship.getLeftCenter(), 0.2);
        this.setPosition(this.pivot.x, this.pivot.y);

    }

}