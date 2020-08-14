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
       bar:{
           default:null,
           type:cc.ProgressBar,
       }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.bar.progress = 1;
    },

    reset(){
        this.bar.progress = 1;
    },

    getProgress(){
        return this.bar.progress;
    },

    update (dt) {
        var progress = this.bar.progress;
        if (progress >= 0.01) {
            progress -= 0.01;
        }else {
            progress = 0;
        }
        this.bar.progress = progress;
    },
});
