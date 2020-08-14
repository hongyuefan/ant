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
       notice:{
           default:null,
           type:cc.Label,
       },
       tmpCansel:{
           default:null,
       },
       tmpOK:{
           default:null,
       },
       context:{
           default:null,
       }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onClick(notice,canselCallback,okCallback,self){
        this.context = self;
        this.notice.string = notice;
        this.tmpCansel = canselCallback;
        this.tmpOK = okCallback;
    },

    onCansel(){
        this.tmpCansel(this.context);
        this.node.destroy();
    },

    onOK(){
        this.tmpOK(this.context);
        this.node.destroy();
    }

    // update (dt) {},
});
