
var store = require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
       goodName:{
           default:"",
       },
       goodId:{
           default:0,
       },
       goodPrice:{
           default:0,
       },
       priceLebel:{
           default:null,
           type:cc.Label,
       },
       frame:{
           default:"",
       },
       ico:{
           default:null,
           type:cc.Node,
       },
       dlgPrefeb:{
            default:null,
            type:cc.Prefab,
       },
       dialog:{
           default:null,
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    },

    touchStart(){
        this.onShowDlg();
        this.dialog.getComponent("dialog").onClick("购买蚁卵将花费"+ this.goodPrice.toString() +"奶酪，是否确定购买？",function(self){
            return;
        },function(self){
            if ( isNaN(store.getGolds()) || store.getGolds() < parseInt(self.goodPrice)){
                cc.game.emit("tips","奶酪不足");
                return;
            }
            self.runBuyAction();
            cc.game.emit("updateGolds",-parseInt(self.goodPrice));
            cc.game.emit("updateEggs",1);
            cc.game.emit("tips",self.goodName+"购买成功");
        },this);
    },

    runBuyAction(){
        var action = cc.spawn(cc.scaleTo(0.3, 2),cc.fadeTo(0.3,0));
        this.node.runAction(cc.sequence(action,cc.callFunc(function(){
            this.node.scale = 1;
            this.node.opacity = 255;
        },this)));
    },

    onShowDlg(){
        this.dialog = cc.instantiate(this.dlgPrefeb);
        this.dialog.parent = this.node.parent.parent;
        this.dialog.setPosition(0,0);
    },

    init(prop){
        this.goodId = prop.id;
        this.goodPrice = prop.price*store.getSearchAntIds().length;
        this.goodName = prop.name;
        this.frame = prop.frame;
        var self = this;
        cc.loader.loadRes("foods/"+this.frame, function (err, texture) {
            self.ico.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }); 
    },

    start () {
        this.priceLebel.string = this.goodPrice;
    },

    // update (dt) {},
});
