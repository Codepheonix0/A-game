import { Scene } from 'phaser';
import MyScene from './scenes/MyScene';

export class LevelSelect {

    scene: MyScene
    private cursors!: any

    private bg: Phaser.GameObjects.Rectangle
    //private div: Phaser.GameObjects.Rectangle
    private levels: Array<Phaser.GameObjects.Arc>
    private levelNums: Array<Phaser.GameObjects.Text>
    private LEVEL_SELECT: Phaser.GameObjects.Text
    private underlineLS: Phaser.GameObjects.Rectangle

    selected = 1
    constructor(scene: MyScene) {
        this.scene = scene
        this.cursors = scene.input.keyboard.addKeys(
            {
                'UP': Phaser.Input.Keyboard.KeyCodes.UP,
                'DOWN': Phaser.Input.Keyboard.KeyCodes.DOWN,
                'LEFT': Phaser.Input.Keyboard.KeyCodes.LEFT,
                'RIGHT': Phaser.Input.Keyboard.KeyCodes.RIGHT,
                'SPACE': Phaser.Input.Keyboard.KeyCodes.SPACE,
            })

        this.bg = this.scene.add.rectangle(400, 300, 800, 600, 0x0088FF)
        //this.div = this.scene.add.rectangle(400, 300, 4, 600, 0xFFFFFF)
        this.levels = new Array<Phaser.GameObjects.Arc>()
        this.levelNums = new Array<Phaser.GameObjects.Text>()
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                this.levels.push(this.scene.add.circle(x * 96 + 256, y * 96 + 160, 32, 0xFFFFFF))
                let t = this.scene.add.text(x * 96 + 256, y * 96 + 160, "" + (y * 4 + x + 1)).setColor("black")
                t.x -= t.width / 2
                t.y -= t.height / 2
                this.levelNums.push(t)
            }
        }
        this.LEVEL_SELECT = this.scene.add.text(400, 64, "LEVEL SELECT")
        this.LEVEL_SELECT.x -= this.LEVEL_SELECT.width / 2
        this.underlineLS = this.scene.add.rectangle(this.LEVEL_SELECT.x + this.LEVEL_SELECT.width / 2, this.LEVEL_SELECT.y + 20, this.LEVEL_SELECT.width, 4, 0xFFFFFF)
    }

    update() {
        if (!this.bg.visible)
            return

        if (Phaser.Input.Keyboard.JustDown(this.cursors.SPACE)) {
            //Change the map
            this.scene.currentMap = this.selected + 1
            this.scene.sys.displayList.shutdown()
            this.scene.create()
            this.setVisible(false)
            this.scene.paused = false
            return;
        }

        this.levels[this.selected].fillColor = 0xFFFFFF

        if (Phaser.Input.Keyboard.JustDown(this.cursors.UP))
            this.selected -= 4
        if (Phaser.Input.Keyboard.JustDown(this.cursors.DOWN))
            this.selected += 4
        if (Phaser.Input.Keyboard.JustDown(this.cursors.RIGHT))
            this.selected += 1
        if (Phaser.Input.Keyboard.JustDown(this.cursors.LEFT))
            this.selected -= 1

        this.selected = Math.max(0, this.selected)
        this.selected = Math.min(this.selected, this.levels.length - 1)

        //this.selected %= this.levels.length //how does negative mod work? it doesnt

        this.levels[this.selected].fillColor = 0xFFFF00

    }
    setVisible(show: boolean) {
        this.bg.setVisible(show)
        //this.div.setVisible(show)
        for (let i in this.levels) {
            this.levels[i].setVisible(show)
            this.levelNums[i].setVisible(show)
        }
        this.LEVEL_SELECT.setVisible(show)
        this.underlineLS.setVisible(show)
    }
}