import { ITurret, SingleTurret } from "./turrets";

export interface IProjectile{
   
}

export class Projectile extends Phaser.Physics.Matter.Sprite implements IProjectile{
    private static objectPool: Phaser.GameObjects.Group;  
}