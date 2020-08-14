
cc.Class({
    extends: cc.Component,

    properties: {
       shopPrefeb:{
           default:null,
           type:cc.Prefab,
       }
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.callBackTouch, this);
        cc.game.on("good_buy_event",this.goodBuy,this);
    },

    callBackTouch(){
        let shop = cc.instantiate(this.shopPrefeb);
        shop.parent = this.node.parent;
        shop.setPosition(0,0);
    },

    goodBuy(spriteFrame){  
        var good = new cc.Node("good");
        this.node.getParent().getComponent("scenceQueen").addNodeToNurse(good);
    },

    start () {

    },

    // update (dt) {},
});
