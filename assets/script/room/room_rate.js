

cc.Class({
    extends: cc.Component,

    properties: {
        rateBar:{
            default:null,
            type:cc.ProgressBar,
        },
        rateLabel:{
            default:null,
            type:cc.Label,
        },
        rate:{
            default:0,
            type:cc.Float,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    onHatch(){
        cc.game.emit("hatch_event",this.rate);  
        this.node.destroy();
    },

    start () {
        this.rateBar.progress = this.rate;
        this.rateLabel.string = parseInt(this.rateBar.progress*100).toString()  + "%"
    },

    onUpgrade(){
        // this.rate = this.rate + 0.1;
        // if (this.rate > 0.6) {
        //     this.rate = 0.6;
        // }
        // this.rateLabel.string = parseInt(this.rate*100).toString()  + "%"

        cc.game.emit("tips","抱歉，此功能暂未开放！");
    },

    update (dt) {
        if(this.rate > this.rateBar.progress){
            this.rateBar.progress += 0.02
            if(this.rateBar.progress > this.rate){
                this.rateBar.progress = this.rate;
            }
            this.rateLabel.string = parseInt(this.rateBar.progress*100).toString()  + "%"
        }
    },

    onClose(){
        this.node.destroy();
    }
});
