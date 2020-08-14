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
        tipsPrefeb:{
            default:null,
            type:cc.Prefab,
        },
        tips:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.on("tips",this.callBack,this);
    },

    callBack(msg){
        if (this.tips == null){
            this.tips = cc.instantiate(this.tipsPrefeb);
            this.tips.getComponent("tips").msg = msg;
            this.tips.parent = this.node;

            this.tips.runAction(cc.sequence(cc.fadeTo(2,0),cc.callFunc(function(){
                this.tips.destroy();
                this.tips = null;
            },this)));
        }
    },

    start () {

    },

    // update (dt) {},
});
