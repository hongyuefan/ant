// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var store =  require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
        antsLabel:{
            default:null,
            type:cc.Label,
        },
        auditSoure:{
            default:null,
            type:cc.AudioSource,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.on("update_ant_count",this.showAntCount,this);
        cc.game.on("music_touch",this.judgePlay,this);
    },

    showAntCount(){
        this.antsLabel.string = store.getSearchAntIds().length.toString();
    },

    start () {
        this.showAntCount();
        this.auditSoure = this.getComponent(cc.AudioSource);
        this.auditSoure.loop = true;
        this.judgePlay();
    },

    judgePlay(){
        if(store.getAudit()){
            this.auditSoure.play();
        }else{
            this.auditSoure.stop();
        }
    }


    // update (dt) {},
});
