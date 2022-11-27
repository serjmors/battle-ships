export class LoaderScene extends Phaser.Scene {
    
    constructor() {
      super({
        key: 'LoaderScene'
      });
    }

    preload(): void {
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        const thisScene = this.scene;
        
        this.load.on('progress', function (value: number) {
            percentText.setText(value * 100 + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file: Phaser.Loader.File) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            
            thisScene.start("BattleScene");
        });

        this.loadAssets()
    }
    
    create(): void {
    
    }

    private loadAssets(): void{

        this.load.setBaseURL('assets');

        this.load.image('green_boat'  , 'images/boat_1_green.png');
        this.load.aseprite('green_cannon', 'images/light_cannon_green.png', 'images/light_cannon_green.json');
        this.load.aseprite('destination_point', 'images/destination-point.png', 'images/destination-point.json');

        this.load.image('animated-tileset', 'images/animated-water-sand.png');  
        this.load.tilemapTiledJSON('map', 'maps/test-level.json');

    }
  
}