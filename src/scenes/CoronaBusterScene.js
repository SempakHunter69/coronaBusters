import Phaser from "phaser";
import FallingObject from "./FallingObject";
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
        this.enemies = undefined;
        this.enemySpeed = 50;
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
        this.load.image('enemy', 'assets/enemy.png');
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
        this.enemies = this.physics.add.group({
            classType: FallingObject,
            maxSize: 10, //-----> banyaknya enemy dalam satu grup
            runChildUpdate: true,
        });
        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 5000), //--------> Delay random  rentang 1-5 detik
            callback: this.spawnEnemy,
            callbackScope: this, //--------------------> Memanggil method bernama spawnEnemy
            loop: true,
        });

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

    spawnEnemy() {
        const config = {
            speed: 15, //-----------> Mengatur kecepatan dan besar rotasi dari enemy
            rotation: 0.1
        };
        // @ts-ignore
        const enemy = this.enemies.get(0, 0, 'enemy', config);
        const positionX = Phaser.Math.Between(50, 350); //-----> Mengambil angka acak dari 50-350
        if (enemy) {
            enemy.spawn(positionX); //--------------> Memanggil method spawn dengan parameter nilai posisi sumbux
        }
    }
}