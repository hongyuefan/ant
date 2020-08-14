var store = require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
        eggslb:{
            default:null,
            type:cc.Label,
        },
        hatch:{
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
         cc.game.on("updateEggs",this.updateEggs,this);
         this.node.on(cc.Node.EventType.TOUCH_START,this.callBackTouch, this);
     },

     callBackTouch(){
        var hatch = cc.instantiate(this.hatch);
        hatch.getComponent("room_main").eggs_count = store.getEggs();
        hatch.parent = this.node.parent.parent;
        hatch.zIndex = cc.macro.MAX_ZINDEX;
        hatch.setPosition(0,0);
    },
 
     updateEggs(count){
         store.updateEggs(count);
         this.eggslb.string = store.getEggs();
         if(count > 0 && store.egg_status == 0){
            let tips = cc.instantiate(this.tipsPrefeb);
            tips.parent = this.node;
            tips.setPosition(0,-25);
            store.putStatus(store.gold_status,1,store.ant_status);
        }
     },

     start () {
         this.eggslb.string = store.getEggs();
     },
});
