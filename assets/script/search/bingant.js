// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var store = require("../store/store");
cc.Class({
    extends: cc.Component,

    properties: {
        movespeed:{
            default:100,
            type:cc.Float,
        },
        needtime:{
            default:0,
            type:cc.Float,
        },
        topRight:{
            default:new cc.v2,
        },
        bottomLeft:{
            default:new cc.v2,
        },
        target:{
            default:new cc.v2,
        },
        blood:{
            default:0,
        },
        anim:{
            default:null,
            type:cc.Animation,
        },
        dentist:{
            default:new cc.v2,
        }
    },

    onLoad(){
        this.topRight = cc.v2(this.node.parent.width/2,this.node.parent.height/2);
        this.bottomLeft = cc.v2(-this.node.parent.width/2,-this.node.parent.height/2);
        this.blood = 100;
        this.anim = this.getComponent(cc.Animation);
        this.anim.on('stop',this.onStop,this);
    },
    onStop(){
        this.node.destroy();
    },
    playBomb(){
        this.anim.play();
        if(store.getAudit()){
            let audi = this.getComponent(cc.AudioSource);
            audi.play();
        }
    },
    getRandomPos() {
        let x = this.random(this.bottomLeft.x/3*2,this.topRight.x/3*2);
        let y = this.random(0,this.topRight.y/3*2);
        return cc.v2(x,y)
    },

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower+1)) + lower;   
    },

    onCollisionEnter: function (other, self) {
        switch (other.node.name ){
            case "monster":
                this.playBomb();
                break;
            case "factory":
                this.node.destroy();
                break;
        }
       
    },

    start () {
        this.movespeed = this.topRight.y/2;
        this.dentist = cc.v2(this.target.x,this.bottomLeft.y);
    },

    update (dt) {
        let dir = this.dentist.sub(this.node.getPosition());
        if (dir.mag() < this.movespeed*dt){
            this.node.destroy();
            return
        }
        dir.normalizeSelf();
        this.node.x += dt*dir.x*this.movespeed;
        this.node.y += dt*dir.y*this.movespeed;
        return;
    },
});
