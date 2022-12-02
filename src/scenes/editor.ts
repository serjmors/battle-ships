const spriteId = 'boat_1_green'

export class EditorScene extends Phaser.Scene {
    
    private lastClickTimestamp: number = 0;
    private vertices: Array<Phaser.GameObjects.Sprite> = [];
    private graphics!: Phaser.GameObjects.Graphics;
    private polyUpdateNeeded: boolean = true;
    private isDragging: boolean = false;
    private target!: Phaser.GameObjects.Sprite;

    constructor() {
      super({
        key: 'EditorScene'
      });
    }

    preload(): void {
        
        this.load.setBaseURL('assets/images');
        this.load.image('editor/vertex');
        this.load.image('editor/anchor');

        this.load.image(spriteId)
    }
    
    create(): void {
        
        const camera = this.cameras.main;
        const scene = this;

        camera.setBackgroundColor('rgba(128, 128, 128)')
        this.target = this.add.sprite(0, 0, spriteId);
        this.cameras.main.centerOn(this.target.x, this.target.y);

        this.graphics = this.add.graphics({
            lineStyle:{
                alpha: 0.5,
                color: 0xff0000,
                width: 1
            },
            fillStyle:{
                color: 0x00FFAA,
                alpha: 0.2
            },
            x: 0, y: 0
        });

        this.input.keyboard.on('keydown-SPACE', () =>{
            console.log(
                JSON.stringify(
                    this.vertices.map(
                        v => {return {x: v.x, y: v.y }}
                    ) 
                )
            )
            
        });

        this.input.on(
            'wheel', 
            (
                pointer: Phaser.Input.Pointer,
                gameObjects: Array<Phaser.GameObjects.GameObject>,
                deltaX: number, deltaY: number, deltaZ: number
            ) => 
            {  
                camera.zoom -= deltaY * 0.001;
                camera.zoom = Phaser.Math.Clamp(camera.zoom, 0.4, 6)
    
            }
        );

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => { 
            if (pointer.leftButtonDown() && pointer.downTime - this.lastClickTimestamp <= 250){
               const vertex = this.add.sprite(+pointer.worldX.toFixed(0), +pointer.worldY.toFixed(0), 'editor/vertex').setInteractive({ useHandCursor: true });
               vertex.setAlpha(0.7)
               scene.input.setDraggable(vertex);
               this.vertices.push(vertex);
               this.polyUpdateNeeded = true;
            }
            this.lastClickTimestamp = pointer.downTime;
        });

        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Matter.Sprite) => {

            gameObject.setTint(0xff0000);
            this.isDragging = true;
    
        });

        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.Physics.Matter.Sprite) => {
            
            gameObject.setPosition(+pointer.worldX.toFixed(0), +pointer.worldY.toFixed(0));
            this.polyUpdateNeeded = true;

        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject:  Phaser.Physics.Matter.Sprite) => {
            gameObject.clearTint();
            this.isDragging = false;
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging && pointer.leftButtonDown()){

                const movementX = pointer.prevPosition.x - pointer.position.x;
                const movementY = pointer.prevPosition.y - pointer.position.y;
                
                camera.scrollX += movementX / camera.zoom;
                camera.scrollY += movementY / camera.zoom;
            }
        });

        /*this.input.on('pointerup', () => {
            var input = document.createElement("INPUT");
            input.setAttribute("type", "file"); 
            input.setAttribute("id", "fileinput");
            document.body.appendChild(input);
            input.addEventListener(
                "change",
                e => console.log(URL.createObjectURL(e.currentTarget?.files[0]))
            );
            input.click();
            document.body.removeChild(input);
        }
        )

        document.getElementById("sprite_texture").onchange = function(e){
            console.log(e.target.files);
            new Phaser.Textures.Texture()
            scene.load.image(spriteId, )
            scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
                // texture loaded so use instead of the placeholder
                this.tar.setTexture(cardName)
            })
            this.load.start()
        };*/
    }

    update(time: number, delta: number): void {

        if(this.vertices.length > 1 && this.polyUpdateNeeded){
            this.graphics.clear();
            const points = this.vertices.map( v =>  { return {x:v.x, y:v.y} } )
            this.graphics.fillPoints(points, true, true);
            this.graphics.strokePath()
            this.polyUpdateNeeded = false;
        }

    }

 
}