import { Stopwatch } from '~/Stopwatch'
import { LevelSelect } from '~/LevelSelect'
import { Block } from '~/Block'

export default class MyScene extends Phaser.Scene {
    cursors!: any //define this class later
    stopwatch!: Stopwatch
    ls!: LevelSelect

    currentMap = 9

    paused = false
    moved = false
    falling = false

    wall!: Phaser.Tilemaps.StaticTilemapLayer
    block!: Phaser.Tilemaps.StaticTilemapLayer
    target!: Phaser.Tilemaps.StaticTilemapLayer
    gravity!: Phaser.Tilemaps.StaticTilemapLayer
    spike!: Phaser.Tilemaps.StaticTilemapLayer

    blocks!: Array<Block>
    targets!: Array<Phaser.Tilemaps.Tile>
    gravitys!: Array<Phaser.Tilemaps.Tile>
    spikes!: Array<Phaser.Tilemaps.Tile>

    undoStack!: Array<Array<Block>>
    constructor() {
        super('hello-world')
    }

    init() {
    }

    preload() {
        this.load.image('block', 'BASIC_II.png');
        this.load.image('bg', 'BASIC_BG_II.png');
        this.load.image('grav', 'gravs.png');
        this.load.image('spike', 'Spike.png');

        // const colors = ['white', 'grey', 'black', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
        // for (let c in colors)
        //     this.load.image(c, c + '.png')
        this.load.image('white', 'white.png')
        this.load.image('grey', 'grey.png')
        this.load.image('black', 'black.png')
        this.load.image('red', 'red.png')
        this.load.image('yellow', 'yellow.png')
        this.load.image('green', 'green.png')
        this.load.image('cyan', 'cyan.png')
        this.load.image('blue', 'blue.png')
        this.load.image('purple', 'purple.png')

        this.load.image('bg1', 'bg1.png')

        // Load the export Tiled JSON
        let max = 16
        for (let current = 1; current <= max; current++)
            this.load.tilemapTiledJSON('map' + current, "" + current + '.json')
    }

    create() {
        this.game.canvas.oncontextmenu = (e) => e.preventDefault()      //comment this before building for some reason...
        this.cursors = this.input.keyboard.addKeys(
            {
                'UP': Phaser.Input.Keyboard.KeyCodes.UP,
                'DOWN': Phaser.Input.Keyboard.KeyCodes.DOWN,
                'LEFT': Phaser.Input.Keyboard.KeyCodes.LEFT,
                'RIGHT': Phaser.Input.Keyboard.KeyCodes.RIGHT,
                'ESC': Phaser.Input.Keyboard.KeyCodes.ESC,
                'G': Phaser.Input.Keyboard.KeyCodes.G,
                'R': Phaser.Input.Keyboard.KeyCodes.R,
                'Z': Phaser.Input.Keyboard.KeyCodes.Z
            })

        this.add.image(400, 300, 'bg1')
        this.blocks = []
        this.targets = []
        this.gravitys = []
        this.spikes = []
        this.createMap('map' + this.currentMap)

        this.undoStack = []

        this.paused = false
        this.moved = false
        this.falling = false


        //draw last
        this.stopwatch = new Stopwatch(this, 4, 4)

        this.ls = new LevelSelect(this)
        this.ls.selected = this.currentMap - 1
        this.ls.setVisible(false)
    }


    createMap(currentMap: string) {
        const map = this.make.tilemap({ key: currentMap })

        const block = map.addTilesetImage('BASIC_II', 'block')
        const bg = map.addTilesetImage('BASIC_BG_II', 'bg')
        const grav = map.addTilesetImage('gravs', 'grav')
        const spike = map.addTilesetImage('Spike', 'spike')

        this.wall = map.createStaticLayer('Wall', block, 32, 92).setScale(2)
        this.block = map.createStaticLayer('Block', block, 32, 92).setVisible(false)
        this.target = map.createStaticLayer('Target', bg, 32, 92).setScale(2)
        this.gravity = map.createStaticLayer('Gravity', grav, 32, 92)?.setScale(2)
        this.spike = map.createStaticLayer('Spike', spike, 32, 92)?.setScale(2) //why are there lines...
        // map.createStaticLayer('Misc', tileset, 0, 8)

        for (let x = 0; x < 23; x++)
            for (let y = 0; y < 13; y++) {
                let current = this.block.getTileAt(x, y, true)
                if (current.index != -1) {
                    let t = new Block(this, x, y, current.index)
                    t.enable()
                    this.blocks.push(t)
                }

                current = this.target.getTileAt(x, y, true)
                if (current.index != -1)
                    this.targets.push(current)

                current = this.gravity?.getTileAt(x, y, true)
                if (current && current.index != -1)
                    this.gravitys.push(current)

                current = this.spike?.getTileAt(x, y, true)
                if (current && current.index != -1)
                    this.spikes.push(current)

            }
    }

    counter = 0

    update(time, delta) {
        //pause
        if (Phaser.Input.Keyboard.JustDown(this.cursors.ESC)) {
            this.paused = !this.paused
            this.ls.setVisible(this.paused)
        }
        if (this.paused) {
            this.ls.update()
            return
        }

        //reset
        if (Phaser.Input.Keyboard.JustDown(this.cursors.R)) {
            this.sys.displayList.shutdown()
            this.create()
        }

        //undo //the bug is that when you undo back to 0 you arent moving a copy or something and then you can misplace state 
        if (Phaser.Input.Keyboard.JustDown(this.cursors.Z)) {
            //console.debug(this.undoStack.length)
            if (this.undoStack.length > 1) {
                for (let i = 0; i < this.blocks.length; i++) {
                    this.blocks[i].image.setInteractive(false) //do i need this?
                    this.blocks[i].image.destroy()
                }
                this.undoStack.pop()
                this.blocks = []
                let l = this.undoStack.length
                for (let i = 0; i < this.undoStack[l - 1].length; i++) {
                    let t = new Block(this, this.undoStack[l - 1][i].x, this.undoStack[l - 1][i].y, this.undoStack[l - 1][i].index)
                    t.dir = this.undoStack[l - 1][i].dir
                    t.enable()
                    this.blocks.push(t)
                }
            }
        }

        //update stuff
        this.stopwatch.update(delta)

        for (let i = 0; i < this.blocks.length; i++)
            this.blocks[i].updateDir()

        this.falling = false
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].checkFloating())
                this.falling = true
        }
        if (this.falling)
            this.counter += delta
        if (this.counter > 100) { //slow down gravity
            for (let i = 0; i < this.blocks.length; i++) {
                if (this.blocks[i].checkFloating())
                    this.blocks[i].applyGrav()
            }
            this.counter = 0
        }

        //game rules

        //spikes destroy blocks
        for (let i = 0; i < this.spikes.length; i++) {
            for (let j = 0; j < this.blocks.length; j++) {
                if (this.spikes[i].x == this.blocks[j].x && this.spikes[i].y == this.blocks[j].y) {
                    this.blocks[j].image.destroy()
                    this.blocks.splice(j, 1)
                }
            }
        }

        //all targets on blocks with matching color = win
        for (let i = 0; i < this.targets.length; i++) {
            let targetHasBox = false
            for (let j = 0; j < this.blocks.length; j++) {
                if (this.targets[i].x == this.blocks[j].x && this.targets[i].y == this.blocks[j].y && this.targets[i].index == this.blocks[j].index + 12) {
                    targetHasBox = true
                    break
                }
            }
            if (!targetHasBox)
                break
            if (i == this.targets.length - 1) {
                this.currentMap++
                this.sys.displayList.shutdown()
                this.create()
            }
        }

        //update undo stack
        if (this.undoStack.length == 0 || (this.moved && !this.falling)) {
            this.moved = false
            //lets just copy the whole list why not
            let state: Array<Block> = []
            for (let i = 0; i < this.blocks.length; i++) {
                let t = new Block(this, this.blocks[i].x, this.blocks[i].y, this.blocks[i].index)
                t.dir = this.blocks[i].dir
                state.push(t)
            }
            this.undoStack.push(state)
        }
    }
    spaceIsClear(x: integer, y: integer): boolean {
        if (this.wall.getTileAt(x, y, true).index != -1)
            return false
        //check blocks
        for (let i = 0; i < this.blocks.length; i++)
            if (this.blocks[i].x == x && this.blocks[i].y == y)
                return false
        //check gates

        return true
    }
    printUndoStack() {
        console.debug("===")
        for (let i = 0; i < this.undoStack.length; i++) {
            //for (let j = 0; j < this.undoStack[i].length; j++) {
            console.debug("(" + this.undoStack[i][1].x + " " + this.undoStack[i][1].y + ")")
            //}
        }
    }
}
