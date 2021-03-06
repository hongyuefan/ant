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
        anim:{
            default:null,
            type:cc.Animation,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
        this.anim.on('stop',this.onStop,this);
    },

    start () {

    },

    playBomb(){
        this.anim.play();
        if(store.getAudit()){
            let audi = this.getComponent(cc.AudioSource);
            audi.play();
        }
    },

    onStop(){
        this.node.destroy();
    }

    // update (dt) {},
});
