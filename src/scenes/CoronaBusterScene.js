import Phaser from "phaser";
export default class CoronaBusterScene extends Phaser.Scene {
    constructor() {
        super("corona-buster-scene");
    }
    init() {
        this.clouds = undefined;
        this.nav_left = false;
        this.nav_right = false;
        this.shoot = false;
        this.player = undefined;
        this.speed = 100;
    }

    preload() {
        this.load.image("background", "assets/bg_layer1.png");
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('left-btn', 'assets/left-btn.png');
        this.load.image('right-btn', 'assets/right-btn.png');
        this.load.image('shoot-btn', 'assets/shoot-btn.png');
        this.load.spritesheet("player", "assets/ship.png", {
            frameWidth: 66,
            frameHeight: 66,
        });
    }
    create() {
        const gameWidht = this.scale.width * 0.5;
        const gameHeight = this.scale.height * 0.5;
        this.add.image(gameWidht, gameHeight, "background");
        this.clouds = this.physics.add.group({
            key: "cloud",
            repeat: 10, //----------------------> coba ganti angkanya menjadi lebih besar atau kecil
        });

        Phaser.Actions.RandomRectangle(this.clouds.getChildren(), this.physics.world.bounds);
        this.createButton();
        this.player = this.createPlayer();


    }
    update(time) {
        this.clouds.children.iterate((child) => {
            child.setVelocityY(20); //----------------> Semua awan bergerak kebawah dengan kecepatan 20.
        });
        this.clouds.children.iterate((child) => { //-----------> untuk setiap awan dalam kumpulan awan
            child.setVelocityY(20); //----------> bergerak kebawah
            if (child.y > this.scale.height) { //---------->  jika melewati batas bawah
                child.x = Phaser.Math.Between(10, 400); //----------> posisi awan dipindah ke atas layout
                child.y = 0;
            }
        });
        this.movePlayer(this.player, time);

    }

    createButton() {
        this.input.addPointer(3)

        let shoot = this.add.image(320, 550, 'shoot-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

        let nav_left = this.add.image(50, 550, 'left-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

        let nav_right = this.add.image(nav_left.x + nav_left.displayWidth + 20, 550, 'right-btn').setInteractive().setDepth(0.5).setAlpha(0.8)
        nav_left.on(
            "pointerdown",
            () => { //---------> Ketika pointerup (diklik) maka properti nav left akan bernilai true
                this.nav_left = true;
            },
            this
        );
        nav_left.on(
            "pointerout",
            () => { //----------> Ketika pointerout (tidak diklik) maka properti nav left akan bernilai false
                this.nav_left = false;
            },
            this
        );
        nav_right.on(
            "pointerdown",
            () => {
                this.nav_right = true;
            },
            this
        );
        nav_right.on(
            "pointerout",
            () => {
                this.nav_right = false;
            },
            this
        );
        shoot.on(
            "pointerdown",
            () => {
                this.shoot = true;
            },
            this
        );
        shoot.on(
            "pointerout",
            () => {
                this.shoot = false;
            },
            this
        );
    }

    movePlayer(player, time) {
        if (this.nav_left) {
            player.setVelocityX(this.speed * -1);
            player.anims.play("left", true);
            player.setFlipX(false);
        } else if (this.nav_right) {
            player.setVelocityX(this.speed);
            player.anims.play("right", true);
            player.setFlipX(true);
        } else {
            player.setVelocityX(0);
            player.anims.play("turn");
        }
    }

    createPlayer() {
        const player = this.physics.add.sprite(200, 450, 'player')
        player.setCollideWorldBounds(true)
        this.anims.create({
            key: "turn",
            frames: [{
                key: "player",
                frame: 0,
            }, ],
        });
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", {
                start: 1,
                end: 2,
            }),
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", {
                start: 1,
                end: 2,
            }),
        });
        return player
    }
}