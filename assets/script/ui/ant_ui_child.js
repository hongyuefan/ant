
var store = require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
       title:{
           default:null,
           type:cc.Label,
       },
       value:{
           default:null,
           type:cc.Label,
       },
       showPrefeb:{
            default:null,
            type:cc.Prefab,
       },
       dlgPrefeb:{
            default:null,
            type:cc.Prefab,
       },
       costs:{
          default:0,
       },
       upgrate:{
          default:null,
          type:cc.Button,
       },
       antid:{
           default:0,
       },
       sceneid:{
           default:"",
       },
       dialog:{
           default:null,
       }
    },

    insert(antid,sceneid,title,value,cost){
        this.title.string = title;
        this.value.string =  Math.round(value);
        this.costs = cost;
        this.sceneid = sceneid;
        this.antid = antid;
    },

    onLoad(){
        this.title.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    },

    touchStart(){
        var showInfo = cc.instantiate(this.showPrefeb);
        showInfo.getComponent("showmsg").title = this.title.string;
        showInfo.parent = this.node.parent.parent;
        showInfo.setPosition(0,0);
    },

    onShowDlg(){
        this.dialog = cc.instantiate(this.dlgPrefeb);
        this.dialog.parent = this.node.parent.parent;
        this.dialog.setPosition(0,0);
    },

    onUpgrade(){
       
        switch (this.title.string){
            case "蚁速":
                    if (parseInt(this.value.string) >= 800) {
                        cc.game.emit("tips","已达到最大移动速度");
                        return;
                    }
                    this.onShowDlg();
                    this.dialog.getComponent("dialog").onClick("本次强化将消耗"+ this.costs.toString() +"奶酪，是否确定？",function(self){
                        return;
                    },function(self){
                        if ( isNaN(store.getGolds()) || store.getGolds() < self.costs) {
                            cc.game.emit("tips","奶酪不足");
                            return;
                        }
                        cc.game.emit("updateGolds",-self.costs);
                        self.value.string = parseInt(self.value.string) + 50;
                        cc.game.emit(self.sceneid.toString()+store.update,{"id":self.antid,"speed":parseInt(self.value.string)});
                        self.costs = parseInt(self.value.string)*10;
                    },this);
                    break;
            case "蚁力":
                    if (parseInt(this.value.string) >= 1000) {
                        cc.game.emit("tips","已达到最大蚁力");
                        return;
                    }
                    this.onShowDlg();
                    this.dialog.getComponent("dialog").onClick("本次强化将消耗"+ this.costs.toString() +"奶酪，是否确定？",function(self){
                        return;
                    },function(self){
                        if ( isNaN(store.getGolds()) || store.getGolds() < self.costs) {
                            cc.game.emit("tips","奶酪不足");
                            return;
                        }
                        cc.game.emit("updateGolds",-self.costs);
                        self.value.string = parseInt(self.value.string) + 50;
                        cc.game.emit(self.sceneid.toString()+store.update,{"id":self.antid,"power":parseInt(self.value.string)});
                        self.costs = parseInt(self.value.string)*10;
                    },this);
                    break;
            default:
                return;
        };
    },

    // update (dt) {},
});
