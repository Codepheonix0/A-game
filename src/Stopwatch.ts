import { Scene } from 'phaser';

export class Stopwatch {

    isRunning = true;
    msRunning = 0;
    scene: Scene;
    time: Phaser.GameObjects.Text

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene
        this.time = this.scene.add.text(x, y, this.msRunning.toString());
    }
    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        this.msRunning = 0;
    }

    update(delta: number) {
        if (this.isRunning)
            this.msRunning += delta;
        let date = new Date(this.msRunning)
        this.time.setText(Stopwatch.msToTime(this.msRunning))
    }

    static msToTime(ms: number): string {
        let date = new Date(ms)
        return date.getMinutes().toString() + ":" + Stopwatch.padLeft(date.getSeconds().toString(), "0", 2)
    }
    static padLeft(text: string, padChar: string, size: number): string {
        return (String(padChar).repeat(size) + text).substr((size * -1), size);
    }
}
