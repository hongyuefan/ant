// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var com = require("../common/common");
var store = require("../store/store");

cc.Class({
    extends: cc.Component,

    properties: {
        antPrefeb:{
            default: null,
            type: cc.Prefab,
        },
        bingPrefeb:{
            default: null,
            type: cc.Prefab,
        },
        monsterPrefeb:{
            default: null,
            type: cc.Prefab,
        },
        accPrefeb:{
            default: null,
            type: cc.Prefab,
        },
        eggPrefeb:{
            default: null,
            type: cc.Prefab,
        },
        bombPrefeb:{
            default: null,
            type: cc.Prefab,
        },
        golds:{
            default:null,
            type:cc.Node,
        },
        ants: {
            default: [],
            type: cc.Node,
        },
        monsters: {
            default: [],
            type: cc.Node,
        },
        factory:{
            default:null,
            type:cc.Node,
          },
        goods:{
            default:null,
            type:cc.Prefab,
        },
        count: {
            default:0,
            type:cc.Integer,
        },
        touchCount:{
            default:4,
            type:cc.Integer,
        },
        touchStartPos:{
            default:new cc.v2,
        },
        topRight:{
            default:new cc.v2,
        },
        bottomLeft:{
            default:new cc.v2,
        },
        touchHigh:{
            default:8,
        },
        touchLow:{
            default:4,
        },
        foodHigh:{
            default:9,
        },
        foodLow:{
            default:1,
        },
        bars:{
            default:null,
            type:cc.ProgressBar,
        },
        onBtn:{
            default:null,
            type:cc.Button,
        },
        total:{
            default:1,
        },
        rewardedVideoAd :{
            default:null,
        },
        tipsPrefeb:{
            default:null,
            type:cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
      this.touchCount = 1;
      this.total = 1;
      this.topRight = cc.v2(this.node.width/2,this.node.height/2);
      this.bottomLeft = cc.v2(-this.node.width/2,-this.node.height/2);
      this.foodLow = 1;
     
      cc.game.on(store.searchSceneId+store.update,this.updateAnt,this);
      cc.game.on("insert_search_ant",this.insertAnt,this);

      this.schedule(this.callBacKeeper,10, cc.macro.REPEAT_FOREVER);
    },

    callBacKeeper(){
        wx.postMessage({
            messageType: 0,
            score: store.total_golds,
        });
    },

    btnAdPlay(){
        // this.rewardedVideoAd.show()
        // .catch(err => {
        //     this.rewardedVideoAd.load()
        //     .then(() => this.rewardedVideoAd.show())
        // })
    },

    btnInsertBA(){
        var comBtn = this.onBtn.getComponent("btn_ant");
        if(comBtn.getProgress() == 0){
            this.insertBing();
            comBtn.reset();
        } 
    },
    insertMonster(){
        let t = cc.instantiate(this.monsterPrefeb);
        t.getComponent("monster").target = this.factory.position;
        t.parent = this.node;
        t.setPosition(this.getRandomPos());
        this.monsters.push(t);


        let tips = cc.instantiate(this.tipsPrefeb);
            tips.parent = this.node.getChildByName("btnAnt");
            tips.setPosition(0,-25);
    },
    insertBing(){
        var pos = this.getRandomPos();
        let m = this.getList();
        if (m != null) {
            pos = m.position;
        }
        cc.game.emit("tips","天降奇兵！");
        let t = cc.instantiate(this.bingPrefeb);
        t.getComponent("bingant").target = pos;
        t.parent = this.node;
        t.setPosition(pos.x, this.topRight.y);
        t.runAction(cc.jumpTo(1, pos, 0, 1));
    },
    getList() {
        if (this.monsters.length>0){
            let node = this.monsters[0];
            if (!node.isValid){
                this.removeElement();
                return null
            }
            return this.monsters[0];
        }
        return null;
    },
    removeElement(){
        this.monsters.splice(0,1);
    },


    insertAnt(){
        var antId =  store.getSearchAntIds().length;
        let t = cc.instantiate(this.antPrefeb);
        t.getComponent("searchant").needtime =com.TransToNeedTime(50);
        t.getComponent("searchant").id = antId;
        t.getComponent("searchant").power = 50;
        t.parent = this.node;
        t.setPosition(0,0);
        this.ants.push(t);

        store.putAntProperty(store.searchSceneId,antId,50,50,0,0,0);
        store.putSearchAntIds(antId);
    },

    accelerateSpeed(){
        for (var ant of this.ants) {
            ant.getComponent("searchant").movespeed *= 3;
        }
    },

    initScene(){
        this.touchHigh = store.touch_high;
        this.touchLow = store.touch_low;
        for (var antId of store.getSearchAntIds())
        {
            var ant = store.getAntProperty(store.searchSceneId,antId);
            let t = cc.instantiate(this.antPrefeb);
            t.getComponent("searchant").needtime =com.TransToNeedTime(ant.speed);
            t.getComponent("searchant").id = antId;
            t.getComponent("searchant").power = ant.power;
            t.parent = this.node;
            t.setPosition(0,0);
            this.ants.push(t);
            if (ant.power > this.foodHigh){
                this.foodHigh = ant.power;
            }
        }
    },

    updateAnt(msg) {
        for (var ant of this.ants) {
            if (ant.getComponent("searchant").id == msg.id) {
                if (msg.power > 0) {
                    if (msg.power > this.foodHigh) {
                        this.foodHigh = msg.power;
                    }
                }
                ant.getComponent("searchant").updateAnt(msg.speed,msg.power);
                store.updateAntProperty(store.searchSceneId,msg.id,msg);
                return;
            }
        }
    },

    generateGood(){
        let good = cc.instantiate(this.goods);
        let weigth = this.random(this.foodLow,this.foodHigh)
        good.getComponent("searchgoods").weight = weigth;
        cc.loader.loadRes("search_goods/" + this.random(1,2).toString(), function (err, texture) {
           good.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }); 
        good.parent = this.node;
        good.setScale(0.9*weigth/(this.foodHigh-this.foodLow)+0.8-(0.9*this.foodLow/(this.foodHigh-this.foodLow)));
        good.setPosition(this.getRandomPos());
        good.runAction(cc.sequence(cc.scaleTo(0.5,1.1),cc.scaleTo(0.5,1))).repeatForever();

        good.once(cc.Node.EventType.TOUCH_START,function(){
            good.getComponent("searchgoods").canselSchedule();
            good.stopAllActions();
            this.addGoodToAnts(good);
        }, this);
    },

    btnAudit(){
        store.updateAudit();
        cc.game.emit("music_touch");
    },

  

    insertGood(){ 
        if(store.getAudit()){
            let audi = this.getComponent(cc.AudioSource);
            audi.play();
        }
        this.setBar(this.touchCount);
        if (this.touchCount <=0 ){
            let rand = this.random(1,100);
            let rate = 100 - this.ants.length;
            if (rate <= 94) {
                rate = 94;
            }
            let accRate = 45 - (this.ants.length-1)*10;
            if(accRate < 30) {
                accRate = 30;
            }
            if(rand < 10){
                 let bomb = cc.instantiate(this.bombPrefeb);
                 bomb.parent = this.node;
                 bomb.setPosition(this.getRandomPos());
                 bomb.runAction(cc.sequence(cc.scaleTo(0.5,1.1),cc.scaleTo(0.5,1))).repeatForever();
                 this.addGoodToAnts(bomb);
            }else if (rand > rate){
                for(var i = 0; i < this.ants.length; i++) {
                    this.generateGood();
                }
            }else if (rand > 50 && rand < 55){
                  let egg = cc.instantiate(this.eggPrefeb);  
                  egg.parent = this.node;
                  egg.setPosition(this.getRandomPos());
                  this.addGoodToAnts(egg);
            }else if (rand > 25 && rand < accRate){
                  let acc = cc.instantiate(this.accPrefeb);
                  acc.parent = this.node;
                  acc.setPosition(this.getRandomPos());
                  acc.on(cc.Node.EventType.TOUCH_START,function(){
                    acc.getComponent("searchacc").playAcc();
                    this.accelerateSpeed();
                    cc.game.emit("tips","蚁速翻倍！");
                  }, this);
                  this.generateGood();
            }else if (rand > 70 && rand < 94){
                  this.insertMonster();
                  this.generateGood();
            }else{
                 this.generateGood();
            }
            this.touchCount = 5 + this.ants.length*2;
            if(this.touchCount > 16){
                this.touchCount = 16;
            }
            this.total = this.touchCount;
            return
        }
        this.touchCount--;
    },

    setBar(count){
        this.bars.progress = (this.total - count)/this.total;
    },

    addGoodToAnts(good){
        var index = 0;
        var min = 1000;
        for(let i=0;i<this.ants.length;i++){
            var ant = this.ants[i].getComponent("searchant");
            var length = ant.goodsList.length;
            if(length == 0) {
                ant.insertList(good);
                return;
            }else{
                if (length < min) {
                    min = length;
                    index = i;
                }
            }
        }
        this.ants[index].getComponent("searchant").insertList(good);
    },

    getRandomPos() {
        let x = this.random(this.bottomLeft.x/3*2,this.topRight.x/3*2);
        let y = this.random(0,this.topRight.y/4*3);
        return cc.v2(x,y)
    },

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;   
    },

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.initScene(); 
        this.node.getChildByName("factory").zIndex = cc.macro.MAX_ZINDEX;
        this.node.getChildByName("grass").zIndex = cc.macro.MAX_ZINDEX;
        //this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'xxxx' });

    },

    // listening(){
    //     this.rewardedVideoAd.onClose(res => {
    //         if (res && res.isEnded || res === undefined) {
    //             for(var i = 0; i < 10; i++) {
    //                 this.generateGood();
    //             }
    //         }
    //         else {
    //             return;
    //         }
    //     })
    // }
});
