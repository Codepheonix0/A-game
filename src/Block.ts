import { Scene } from "phaser"
import MyScene from "./scenes/MyScene"

export class Block {


    scene: MyScene
    x: integer
    y: integer
    index: integer
    size = 32
    dir = direction.DOWN

    image!: Phaser.GameObjects.Image
    imageKey = 'white'

    constructor(scene: MyScene, x: integer, y: integer, index: integer) {
        this.scene = scene
        this.x = x
        this.y = y
        this.index = index

        const colors = ['white', 'grey', 'black', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
        if (index >= 1 && index <= 10)
            this.imageKey = colors[index - 1]
    }
    enable() {
        this.image = this.scene.add.image(this.x * 32 + 32 + 16, this.y * 32 + 92 + 16, this.imageKey).setScale(2)
        this.image.setInteractive()
        this.image.on('pointerdown', (a) => {
            if (this.scene.falling)
                return
            if (this.dir == direction.UP || this.dir == direction.DOWN) {
                if (a.buttons == 1 && this.scene.spaceIsClear(this.x - 1, this.y)) {
                    this.image.x -= this.size
                    this.x--
                    this.scene.moved = true
                }
                if (a.buttons == 2 && this.scene.spaceIsClear(this.x + 1, this.y)) {
                    this.image.x += this.size
                    this.x++
                    this.scene.moved = true
                }
            }
            else {
                if (a.buttons == 1 && this.scene.spaceIsClear(this.x, this.y - 1)) {
                    this.image.y -= this.size
                    this.y--
                    this.scene.moved = true
                }
                if (a.buttons == 2 && this.scene.spaceIsClear(this.x, this.y + 1)) {
                    this.image.y += this.size
                    this.y++
                    this.scene.moved = true
                }
            }
        })
    }

    updateDir() {
        //see if im on grav
        for (let i = 0; i < this.scene.gravitys.length; i++) {
            if (this.x == this.scene.gravitys[i].x && this.y == this.scene.gravitys[i].y) {
                this.dir = this.scene.gravitys[i].index - 25
                //i am so also change same color blocks
                for (let j = 0; j < this.scene.blocks.length; j++) {
                    if (this.scene.blocks[j].index == this.index)
                        this.scene.blocks[j].dir = this.dir
                }
                break
            }
        }
    }
    checkFloating(): boolean {
        let nextX = this.x
        let nextY = this.y
        if (this.dir == direction.UP)
            nextY--
        if (this.dir == direction.DOWN)
            nextY++
        if (this.dir == direction.LEFT)
            nextX--
        if (this.dir == direction.RIGHT)
            nextX++

        return this.scene.spaceIsClear(nextX, nextY)
    }
    applyGrav() {
        if (this.dir == direction.DOWN) {
            this.image.y += this.size
            this.y++
        }
        if (this.dir == direction.UP) {
            this.image.y -= this.size
            this.y--
        }
        if (this.dir == direction.LEFT) {
            this.image.x -= this.size
            this.x--
        }
        if (this.dir == direction.RIGHT) {
            this.image.x += this.size
            this.x++
        }
    }
}

export enum direction {
    DOWN, LEFT, UP, RIGHT
}