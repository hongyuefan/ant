var store =  require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
        goodPrefeb:{
            default:null,
            type:cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        var goodIds = store.getGoodIds();
        for (var goodId of goodIds) {
            let prop = store.getGoodId(goodId);
            let good = cc.instantiate(this.goodPrefeb);
            good.getComponent("shopgood").init(prop);
            this.node.addChild(good);
        }

    },

    // update (dt) {},
});