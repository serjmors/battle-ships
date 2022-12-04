import { safeJsonParse, ParseResult } from "../utils/safeJson";

type Vector2Type = {x: number, y: number}
interface ShipDescriptor{
    key: string,
    turretId: string,
    origin: Vector2Type,
    turretOrigin: Vector2Type,
    collider: Array<Vector2Type>
}

function isShipDescriptor(o: any): o is ShipDescriptor {
    return "key" in o && typeof(o.key) == 'string' 
           && "turretId" in o && typeof(o.turretId) == 'string'
           && "origin" in o && typeof(o.origin) == 'object'
           && "turretOrigin" in o && typeof(o.turretOrigin) == 'object'
           && "collider" in o && typeof(o.collider) == 'object'
}

export class EditorScene extends Phaser.Scene {
    
    private lastClickTimestamp: number = 0;
    private vertices: Array<Phaser.GameObjects.Sprite> = [];
    private polyline!: Phaser.GameObjects.Graphics;
    private background!: Phaser.GameObjects.Graphics;
    private polyUpdateNeeded: boolean = true;
    private isDragging: boolean = false;

    private sprite!: Phaser.GameObjects.Sprite;
    private origin!: Phaser.GameObjects.Sprite;
    private turretOrigin!: Phaser.GameObjects.Sprite;
    private descriptor!: ShipDescriptor;

    private keyText!: HTMLInputElement;
    private turretKeyText!: HTMLInputElement;
    private descriptorText!: HTMLTextAreaElement;

    constructor() {
      super({
        key: 'EditorScene'
      });
    }

    preload(): void {
        this.load.setBaseURL('assets/images');
        this.load.image('editor/vertex');
        this.load.image('editor/anchor');
        this.load.image('editor/turretAnchor');

        this.descriptorText = document.getElementById("desciptor") as HTMLTextAreaElement;
        this.keyText = document.getElementById("key") as HTMLInputElement;
        this.turretKeyText = document.getElementById("turretId") as HTMLInputElement;
    }
    
    addVertex(position: Vector2Type): Phaser.GameObjects.Sprite | undefined{

        const vertex = this.physics.add
                .sprite(
                    position.x,
                    position.y,
                    'editor/vertex'
                ).setInteractive({ useHandCursor: true })
                 .setAlpha(0.7)
                 .setCollideWorldBounds(true)
                 .setBodySize(1, 1)

        this.input.setDraggable(vertex);
        this.vertices.push(vertex);

        vertex.on('pointerdown', (pointer: Phaser.Input.Pointer) =>{
            if (pointer.rightButtonDown()){
                const idx: number = this.vertices.indexOf(vertex);
                if (idx > -1) this.vertices.splice(idx, 1);
                vertex.destroy();
                this.polyUpdateNeeded = true;
            }
            pointer.event.stopPropagation();
        })
        return vertex;
    }

    clearVertices(): void{
        this.vertices.forEach( v => v.destroy())
        this.vertices = [];
    }

    addOrigin(origin: Vector2Type){

        if (!this.origin){
            this.origin = this.add.sprite(
                0, 0,
                'editor/anchor'
            );
        }
        const originPosition = utils.originToPoint(origin, this.sprite);
        this.origin.setPosition(originPosition.x, originPosition.y).setInteractive();
        this.input.setDraggable(this.origin);
        this.children.bringToTop(this.origin);
    }

    addTurretOrigin(origin: Vector2Type){

        if (!this.turretOrigin){
            this.turretOrigin = this.add.sprite(
                0, 0,
                'editor/turretAnchor'
            );
        }
        const originPosition = utils.originToPoint(origin, this.sprite);        
        this.turretOrigin.setPosition(originPosition.x, originPosition.y).setInteractive();
        this.input.setDraggable(this.turretOrigin);
        this.children.bringToTop(this.turretOrigin);
    }

    loadDescriptor(descriptor: ShipDescriptor){

        this.descriptor = descriptor;
        this.updateDescriptorText();

        if (this.sprite) {
            this.sprite.destroy();
            this.textures.remove(this.descriptor.key);
        };
        this.load.setBaseURL('assets/images');
        this.load.image(this.descriptor.key);
        this.load.once(Phaser.Loader.Events.COMPLETE, () => {  
            this.sprite = this.add.sprite(0, 0, this.descriptor.key);
            
            if (!this.background)
            this.background = this.add.graphics({
                fillStyle:{
                    alpha: 0.7,
                    color: 0x000000
                },
                lineStyle: {
                    width: 0.7,
                    alpha: 1,
                    color: 	0x708090
                }
            });
            this.background.clear();
            this.background.strokeRect(
                this.sprite.getTopLeft().x, this.sprite.getTopLeft().y,
                this.sprite.width, this.sprite.height
            )

            this.add.grid(
                this.sprite.x, this.sprite.y,
                this.sprite.width, this.sprite.height, 4, 4,
                0xA9A9A9
            ).setAltFillStyle(0xDCDCDC)
            .setOutlineStyle();
            
            this.children.bringToTop(this.sprite);
            this.clearVertices();
            this.descriptor.collider.forEach( v => this.addVertex(v) )
            this.cameras.main.centerOn(this.sprite.x, this.sprite.y);
            this.children.bringToTop(this.polyline);
            this.addOrigin(this.descriptor.origin);
            this.addTurretOrigin(this.descriptor.turretOrigin);
            this.physics.world.setBounds(
                this.sprite.getTopLeft().x,
                this.sprite.getTopLeft().y,
                this.sprite.width,
                this.sprite.height
            );

            this.keyText.value = this.descriptor.key.trim();
            this.turretKeyText.value = this.descriptor.turretId.trim();
            this.polyUpdateNeeded = true;
        })
        this.load.start();
    }

    updateDescriptor(): ShipDescriptor{
    

        this.descriptor.collider = this.vertices.map( v => ({ x: v.x, y: v.y }));
        this.descriptor.origin = utils.pointToOrigin({x: this.origin.x, y: this.origin.y}, this.sprite);
        this.descriptor.turretOrigin = utils.pointToOrigin({x: this.turretOrigin.x, y:this.turretOrigin.y}, this.sprite);

        this.descriptor.key = this.keyText.value.trim();
        this.descriptor.turretId = this.turretKeyText.value.trim();

        return this.descriptor;
    }

    updateDescriptorText(): void{
        this.descriptorText.value = JSON.stringify(
            this.descriptor, undefined, 1
        )
    }

    create(): void {
        
        const camera = this.cameras.main;
        const scene = this;

        camera.setBackgroundColor('rgba(128, 128, 128)')

        this.polyline = this.add.graphics({
            lineStyle:{
                alpha: 0.5,
                color: 0xff0000,
                width: 0.4
            },
            fillStyle:{
                color: 0x00FFAA,
                alpha: 0.2
            },
            x: 0, y: 0
        });

        this.input.on(
            'wheel', 
            (
                _pointer: Phaser.Input.Pointer,
                _gameObjects: Array<Phaser.GameObjects.GameObject>,
                _deltaX: number, deltaY: number, _deltaZ: number
            ) => 
            {  
                camera.zoom -= deltaY * 0.001;
                camera.zoom = Phaser.Math.Clamp(camera.zoom, 0.4, 6)
            }
        );

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => { 
            if (pointer.leftButtonDown() && pointer.downTime - this.lastClickTimestamp <= 250){
                scene.addVertex({
                    x: +pointer.worldX.toFixed(0),
                    y: +pointer.worldY.toFixed(0)
                });
                this.polyUpdateNeeded = true;
            }
            this.lastClickTimestamp = pointer.downTime;
        });

        this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Matter.Sprite) => {

            gameObject.setTint(0xff0000);
            this.isDragging = true;
    
        });

        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Matter.Sprite) => {
            
            const newX = Phaser.Math.Clamp(
                +pointer.worldX.toFixed(0),
                this.physics.world.bounds.left, this.physics.world.bounds.right
            );
            const newY = Phaser.Math.Clamp(
                +pointer.worldY.toFixed(0),
                this.physics.world.bounds.top, this.physics.world.bounds.bottom
            );
            gameObject.setPosition(newX, newY);
            this.polyUpdateNeeded = true;
        });

        this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject:  Phaser.Physics.Matter.Sprite) => {
            gameObject.clearTint();
            scene.isDragging = false;
            scene.updateDescriptor();
            scene.updateDescriptorText();
        });

        this.input.on('pointerup', (_pointer: Phaser.Input.Pointer) => {
            
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging && pointer.leftButtonDown()){

                const movementX = pointer.prevPosition.x - pointer.position.x;
                const movementY = pointer.prevPosition.y - pointer.position.y;
                
                camera.scrollX += movementX / camera.zoom;
                camera.scrollY += movementY / camera.zoom;
            }
        });

        document.getElementById("save")!.onclick = async () => {
            const fileHandle = await window.showSaveFilePicker({
                types:[{
                    description: 'Ship descriptor',
                    accept: {'application/json': ['.json']},
                }]
            });
            const fileStream = await fileHandle.createWritable();

            this.updateDescriptor();
            const content = new Blob([
                JSON.stringify(this.descriptor, undefined, '\t')
            ])
            await fileStream.write(content);
            await fileStream.close()
        }

        document.getElementById("descriptor_picker")!.onchange = e => {
            
            const target = e.currentTarget as any;
            const file = target.files[0];

            if (!file) return;
            const reader: FileReader = new FileReader();
            reader.onload = e => {
                const content: string = e!.target!.result?.toString() || '';
                const result: ParseResult<ShipDescriptor>  = safeJsonParse(isShipDescriptor)(content);
                if (result.hasError){
                    console.error(`Cant load content cause ${reader.error}`)
                }else{
                    scene.loadDescriptor(result.parsed);
                }
            };
            reader.readAsText(file);

        };
    }

    update(_time: number, _delta: number): void {

        if(this.vertices.length > 1 && this.polyUpdateNeeded){
            this.polyline.clear();
            const points = this.vertices.map( v => ({x:v.x, y:v.y}));
            this.polyline.fillPoints(points, true, true);
            this.polyline.strokePath()
            this.polyUpdateNeeded = false;
        }

    }

}

const utils = {

    pointToOrigin: function (worldPosition: Vector2Type, sprite: Phaser.GameObjects.Sprite): Vector2Type{
        const localCoords = sprite.getLocalPoint(worldPosition.x, worldPosition.y);
        return {
            x: +(localCoords.x / sprite.width).toFixed(2),
            y: +(localCoords.y / sprite.height).toFixed(2)
        }
    },

    originToPoint: function(origin: Vector2Type, sprite: Phaser.GameObjects.Sprite): Vector2Type{
     
        return {
            x : sprite.getLeftCenter().lerp(sprite.getRightCenter(), origin.x).x,
            y : sprite.getTopCenter().lerp(sprite.getBottomCenter(), origin.y).y
        }
    
    }
}