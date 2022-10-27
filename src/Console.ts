import { Scene } from 'phaser';


export class Console {

    scene: Scene
    log: Array<String>
    open = false

    bgColor = new Phaser.Display.Color(0, 128, 128, 0.2);
    textColor = new Phaser.Display.Color(0, 256, 0);

    // Rectangle cmd;

    cursor = 0;
    current = "";



    constructor(scene: Scene) {
        this.scene = scene
        this.log = new Array<String>()
        this.log.push("--START OF LOG--")

    }

    update() {

        //     Input input = gc.getInput();

        //     if (input.isKeyPressed(Input.KEY_UP)) {
        //         current = log.getFirst(); // I mean this is only 1 level of history but how much can you ask for
        //     }
        //     if (input.isKeyPressed(Input.KEY_DOWN)) {
        //         current = "";
        //     }

        //     // This is a good idea but it will make stuff more complicated too maybe i
        //     // actually should make textfield.java
        //     //		if (input.isKeyPressed(Input.KEY_LEFT) && cursor > 0) {
        //     //			cursor--;
        //     //		}
        //     //
        //     //		if (input.isKeyPressed(Input.KEY_RIGHT)) {
        //     //			cursor++;
        //     //		}

        //     if (input.isKeyPressed(Input.KEY_ENTER)) {
        //         log.addFirst(current);
        //         parse(current);
        //         current = "";
        //     }

        //     if (input.isKeyPressed(Input.KEY_BACK) && !current.equals("")) {
        //         current = current.substring(0, current.length() - 1);
        //     }

        //     for (int i = 0; i < 51; i++) // 0-51 is bad test this better
        //     if (input.isKeyPressed(i)) {
        //         current += Input.getKeyName(i);
        //     }
        //     if (input.isKeyPressed(Input.KEY_SPACE))
        //         current += " ";

        //     int camX = Game.camera.getX();
        //     int camY = Game.camera.getY();

        //     cmd = new Rectangle(camX, camY, Game.width, 700);

    }

    parse(input: String) {
        //     String tokens[] = input.split(" "); // I guess its always uppercase atm should i change that?
        //     switch (tokens[0]) {
        //         case "MAP":
        //             tokens[1].toLowerCase();
        //             File f = new File("tiledmaps/" + tokens[1] + ".tmx");
        //             if (f.isFile() && !f.isDirectory()) {
        //                 Game.map = new TiledMap("tiledmaps/" + tokens[1] + ".tmx");
        //             } else {
        //                 log.addFirst("ERROR: Map file not found.");
        //             }
        //             break;
        //         case "RESOLUTION":
        //             if (tokens.length >= 3) {
        //                 try {
        //                     Integer.parseInt(tokens[2]);
        //                     Game.width = Integer.parseInt(tokens[1]);
        //                     Game.height = Integer.parseInt(tokens[2]);
        //                 } catch (NumberFormatException e) {
        //                     log.addFirst("ERROR: Resolution parameters must be integers");
        //                 }
        //             }
        //         case "FULLSCREEN":
        //         case "FS":
        //             if (tokens[1].equals("0")) {
        //                 Game.width = 1024;
        //                 Game.height = 768;
        //                 Game.fullscreen = false;
        //             }
        //             if (tokens[1].equals("1")) {
        //                 Game.width = 1920;
        //                 Game.height = 1080;
        //                 Game.fullscreen = true;
        //             }
        //             ((AppGameContainer) gc).setDisplayMode(Game.width, Game.height, Game.fullscreen);
        //             break;
        //     }
    }

    // 	public void render() {
    //     if (open) {
    //         g.setColor(bgColor);
    //         g.fill(cmd);

    //         tf.render(gc, g);

    //         int height = (int) cmd.getMaxY() - 64;
    //         g.setColor(textColor);
    //         for (String s : log) {
    //             g.drawString(s, 16, height);
    //             height -= 16;
    //         }
    //     }

    //     g.setColor(Color.white);
    // }
}
