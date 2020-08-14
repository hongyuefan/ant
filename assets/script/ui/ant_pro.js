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
       childPrefeb:{
           default:null,
           type:cc.Prefab,
       },
       antname:{
           default:null,
           type:cc.Label,
       }
    },


    start () {
    },

    insert(items){
        this.antname.string = items.antname;
        var main =  this.node.getChildByName("main");
        for (var item of items.ants) {
            let t = cc.instantiate(this.childPrefeb);
            t.getComponent("ant_ui_child").insert(items.antid,items.sceneid,item.title,item.value,item.cost);
            t.parent = main;
        }
    },

    onClose(){
        this.node.destroy();
    }
});
