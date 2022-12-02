import { ITurret, SingleTurret } from "./turrets";

export interface IProjectile{
    fire(): void;
}

class LightShell extends Phaser.Physics.Matter.Sprite implements IProjectile{
    
    constructor(world: Phaser.Physics.Matter.World, x: number, y:number, tex: string){
        super(world, x, y, tex)
    }

    fire(): void {
        throw new Error('not implemented')
    }
}