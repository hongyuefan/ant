var store = require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
       goldslb:{
           default:null,
           type:cc.Label,
       },
       shopPrefeb:{
           default:null,
           type:cc.Prefab,
       },
       tipsPrefeb:{
        default:null,
        type:cc.Prefab,
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.on("updateGolds",this.updateGolds,this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.callBackTouch, this);
    },

    callBackTouch(){
        let shop = cc.instantiate(this.shopPrefeb);
        shop.parent = this.node.parent.parent;
        shop.setPosition(0,0);
    },

    updateGolds(golds){
        store.updateGolds(golds);
        let gold = store.getGolds()
        this.goldslb.string = gold;
        if(gold > 200 && store.gold_status == 0){
            let tips = cc.instantiate(this.tipsPrefeb);
            tips.parent = this.node;
            tips.setPosition(0,-25);
            store.putStatus(1,store.egg_status,store.ant_status);
        }
    },

    start () {
        this.goldslb.string = store.getGolds();
    },

    // update (dt) {},
});
