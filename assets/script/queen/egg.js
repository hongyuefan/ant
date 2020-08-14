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
      status:{
          default:false,
      },
      isCarried:{
          default:false,
      }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.node.on(cc.Node.EventType.TOUCH_START,this.callBackTouch, this);
        //this.schedule(this.callBacKeeper,20, cc.macro.REPEAT_FOREVER);
    },

    callBackTouch(event){
        if (!this.status){
            this.node.getParent().getComponent("scenceQueen").addNodeToNurse(this.node);
            this.status = true;
        } 
    },

    callBacKeeper(){
        if(!this.isCarried){
            this.unschedule(this.callBacKeeper);
            this.node.destroy();
        }
    },

    start () {

    },

    // update (dt) {},
});
