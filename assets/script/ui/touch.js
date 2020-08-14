cc.Class({
    extends: cc.Component,

    properties: {
        pos:{
            default:new cc.Vec2,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    },

    touchStart(){
        this.node.destroy();
    },

    start () {
        var action = cc.jumpTo(1, this.node.getPosition(), 15, 1);
        this.node.runAction(action).repeatForever();
    },

    // update (dt) {},
});
