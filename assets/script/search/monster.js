// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
            default:new cc.Vec2,
        },
        blood:{
            default:0,
        }
    },

    onLoad(){
        this.topRight = cc.v2(this.node.parent.width/2,this.node.parent.height/2);
        this.bottomLeft = cc.v2(-this.node.parent.width/2,-this.node.parent.height/2);
        this.blood = this.random(1,3);
    },

   
    turnRound(targe,tm) {
        let position = this.node.getPosition();
        let ran = Math.atan2(targe.y-position.y,targe.x-position.x);
        let angle = 90-(ran*180/(Math.PI));
        this.node.runAction(cc.rotateTo(tm,angle));
    },

    getRandomPos() {
        let x = this.random(this.bottomLeft.x/3*2,this.topRight.x/3*2);
        let y = this.random(0,this.topRight.y/3*2);
        return cc.v2(x,y)
    },

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower+1)) + lower;   
    },



    start () {
        this.movespeed = this.topRight.y/10;
    },

    update (dt) {
        let dir = this.target.sub(this.node.getPosition());
        if (dir.mag() < this.movespeed*dt){
            return
        }
        dir.normalizeSelf();
        this.node.x += dt*dir.x*this.movespeed;
        this.node.y += dt*dir.y*this.movespeed;
        return;
    },

    onCollisionEnter: function (other, self) {
        this.checkCollistion(other,self);
    },

    checkCollistion:function(other,self){
        switch (other.node.name ){
            case "bingAnt":
                this.blood --;
                if(this.blood <= 0) {
                    self.node.destroy();
                }
                break;
            case "factory":
               cc.game.emit("updateGolds",-50);
               self.node.destroy();
               break;
        }
    },
});
