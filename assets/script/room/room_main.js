var store =  require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
       eggs_count:0,
       egg_prefeb:{
           default:null,
           type : cc.Prefab,
       },
       ratePrefeb:{
           default:null,
           type:cc.Prefab,
       },
       tmpEgg:{
           default:null,
           type:cc.Node,
       },
       egg:{
           default:null,
           type:cc.Node,
       },
       eggs:{
            default:[],
            type:cc.Node,
       },
       egglabel:{
        default:null,
        type:cc.Label,
       },
       searchAnt:{
           default:null,
           type:cc.Node,
       },
       searchcount:{
        default:null,
        type:cc.Label,
       },
       searchcountN:{
           default:0,
       },
       status:{
           default:0,
       },
       target:{
           default:new cc.Vec2,
       },
       dialog:{
           default:null,
       },
       dlgPrefeb:{
        default:null,
        type:cc.Prefab,
       },
       search_rate:{
           default:0,
           type:cc.Float,
       },
    },

    onLoad () {

        cc.game.on("hatch_event",this.hatchEmit,this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);  
        this.egg.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);

        var rates = store.getHatchRate();
        this.search_rate = rates.search_rate;
    },

    touchMove(event){
        event.stopPropagation();
        if(this.tmpEgg != null && this.status == 0){
            if(this.judgeDistance(this.tmpEgg.getPosition(),this.searchAnt.getPosition())){
                this.searchcountN++;
                this.searchcount.string = this.searchcountN;
                this.tmpEgg.getComponent("room_egg").antype = "search";
                this.eggs.push(this.tmpEgg);
                return;
            }
            var pos = this.node.convertToNodeSpaceAR(cc.v2(event.getLocation().x,event.getLocation().y));
            this.tmpEgg.setPosition(pos.x,pos.y);
        }
    },

    btnSearch(){
        for (var i=0;i<this.eggs.length;i++){
            if (this.eggs[i].getComponent("room_egg").antype == "search"){
                this.eggs[i].destroy();
                this.eggs.splice(i,1);
                if(this.searchcountN > 0) {
                    this.searchcountN--;
                    this.eggs_count++;
                }
                break;
            }
        } 
        this.searchcount.string = this.searchcountN;
        this.egglabel.string = this.eggs_count;
    },
    btnClose(){
        this.node.destroy();
    },

    hatchEmit(rate){
        var cost = this.searchcountN*200;
        if(cost <= 0) {
            return;
        }
        this.dialog = cc.instantiate(this.dlgPrefeb);
        this.dialog.parent = this.node;
        this.dialog.setPosition(0,0);
        this.dialog.getComponent("dialog").onClick("本次孵化将消耗"+ cost.toString() +"奶酪，是否确定？",function(self){
            return;
        },function(self){
            if(cost <= 0 || isNaN(store.getGolds()) || store.getGolds()<cost){
                cc.game.emit("tips","奶酪不足");
                return;
            }
            cc.game.emit("updateGolds",-cost);
            self.hatchSearch(rate*100);
            self.removeHatchedEggs();
            cc.game.emit("update_ant_count");
        },this);
    },

    btnHatch(){
        var count = this.searchcountN;
        if(count > 0){
            var rateDlg = cc.instantiate(this.ratePrefeb);
            var rate = (this.search_rate - (store.searchAntIds.length-1)*20);
            if(rate < 15){
                rate = 15
            }
            rateDlg.getComponent("room_rate").rate = rate/100;
            rateDlg.parent = this.node;
        }
        
    },

    removeHatchedEggs(){
        for (var i=0;i<this.eggs.length;i++){
            if (this.eggs[i].getComponent("room_egg").antype != ""){
                this.eggs[i].destroy();
                delete this.eggs[i];
            }
        } 
        this.eggs = new Array();
    },

    hatchSearch(rate){
        for (var index=0;index < this.searchcountN;index++){
            let rand = this.random(1,100);
            if(rand <= rate){
                cc.game.emit("tips","恭喜！工蚁孵化成功！");
                cc.game.emit("insert_search_ant");
            }else{
                cc.game.emit("tips","很遗憾！工蚁孵化失败！");
            }
        }
        cc.game.emit("updateEggs",-this.searchcountN);
        this.searchcountN = 0;
        this.searchcount.string = this.searchcountN;
    },

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower+1)) + lower;   
    },

    touchStart(event){
        if (this.eggs_count > 0) {
            this.tmpEgg = cc.instantiate(this.egg_prefeb);
            this.tmpEgg.parent = this.node;
            this.tmpEgg.setPosition(this.node.convertToNodeSpaceAR(event.getLocation()));
            this.status = 0;
            this.eggs_count --;
            this.egglabel.string = this.eggs_count;
        }
        
    },

    touchCancel(event){
        if (this.tmpEgg != null && this.status == 0){
            this.tmpEgg.runAction(cc.moveTo(0.2, this.egg.getPosition()));
            this.eggs_count ++;
            this.egglabel.string = this.eggs_count;
        }
        
    },

    judgeDistance(from,to){
        let dir = to.sub(from);
        if (dir.mag() < 50){ 
            this.status = 1;
            this.tmpEgg.setPosition(to);
            return true;
        }
        return false;
    },

    start () {
        this.egglabel.string = this.eggs_count;
    },

    update(){

    }
});
