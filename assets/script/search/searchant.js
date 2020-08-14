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
        movespeed:{
            default:100,
            type:cc.Float,
        },
        _movespeed:{
            default:100,
            type:cc.Float,
        },
        propPrefeb:{
            default:null,
            type:cc.Prefab,
        },
        needtime:{
            default:0,
            type:cc.Float,
        },
        status:{
            default:0,
            type:cc.Integer,
        },
        target:{
            default:new cc.Vec2,
        },
        randpos:{
            default:new cc.Vec2,
        },
        isCarring:{
            default:false,
        },
        goodsList:{
            default:[],
        },
        isPause:{
            default:false,
        },
        currNode:{
            default:null,
            type:cc.Node,
        },
        topRight:{
            default:new cc.v2,
        },
        bottomLeft:{
            default:new cc.v2,
        },
        id:{
            default:0,
        },
        power:{
            default:0,
        },
        anim:{
            default:null,
            type:cc.Animation,
        },
        tipsPrefeb:{
            default:null,
            type:cc.Prefab,
        }
    },

    checkCollistion:function(other,self){
        switch (other.node.name ){
            case "goods":
                if (this.currNode == other.node) {
                    other.node.getComponent("searchgoods").isCarried = true;
                    other.node.setParent(this.node); 
                    other.node.setPosition(cc.v2(0,60));
                    let ratio = other.node.getComponent("searchgoods").weight/this.power;
                    this.movespeed *= (1-4*(ratio>1?1:ratio)/5);
                    this.target = this.node.getParent().getChildByName("factory").position;
                    this.turnRound(this.target,0.5);
                    this.status = 2;
                }
                break;
            case "factory":
                let goods = this.node.getChildByName("goods");
                if (goods != null){
                    goods.destroy();
                    this.movespeed = this._movespeed;
                    this.removeElement();
                    cc.game.emit("updateGolds",goods.getComponent("searchgoods").weight);
                    this.status = 3;
                }
                let egg = this.node.getChildByName("egg");
                if (egg != null){
                    egg.destroy();
                    this.movespeed = this._movespeed;
                    this.removeElement();
                    cc.game.emit("updateEggs",1);
                    this.status = 3;
                }
                break;
            case "bomb":
                if (this.currNode == other.node) {
                    other.node.getComponent("searchbomb").playBomb();
                    this.anim.pause();
                    this.movespeed = 0;
                    this.status = 2;
                    this.scheduleOnce(function(){
                        this.movespeed = this._movespeed;
                        this.removeElement();
                        this.status = 3;
                        this.anim.resume();
                    }, 3);
                }
                break;

            case "egg":
                    if (this.currNode == other.node) {
                        other.node.setParent(this.node); 
                        other.node.setPosition(cc.v2(0,60));
                        this.target = this.node.getParent().getChildByName("factory").position;
                        this.turnRound(this.target,0.5);
                        this.status = 2;
                    }
                    break;
        }
    },

    updateAnt(speed,power){
        if(speed > 0){
            this.needtime = com.TransToNeedTime(speed);
            this._movespeed =  this.topRight.y/this.needtime*2;
        }
        if(power > 0){
            this.power = power;
        }
    },

    onCollisionStay: function (other,self) {
        if (this.currNode == other.node && this.status == 1) {
            this.status = 3;
            this.movespeed = 2*this.movespeed;
        }       
    },

    onCollisionEnter: function (other, self) {
        this.checkCollistion(other,self);
    },

    insertList( v ){
        this.goodsList.push(v);
    },

    getList() {
        if (this.goodsList.length>0){
            let node = this.goodsList[0];
            if (!node.isValid){
                this.removeElement();
                return null
            }
            return this.goodsList[0];
        }
        return null;
    },

    removeElement(){
        this.goodsList.splice(0,1);
    },

    turnRound(targe,tm) {
        let position = this.node.getPosition();
        let ran = Math.atan2(targe.y-position.y,targe.x-position.x);
        let angle = 90-(ran*180/(Math.PI));
        this.node.runAction(cc.rotateTo(tm,angle));
    },

    callBacKeeper(){
        if (store.golds > 100 && store.ant_status == 0) {
            let tips = cc.instantiate(this.tipsPrefeb);
            tips.parent = this.node;
            tips.setPosition(0,-35);
            store.putStatus(store.gold_status,store.egg_status,1);
        }
        if (this.status == 3) {
            this.currNode = this.getList();
            if (this.currNode != null && this.currNode.isValid){
                this.status = 1;
                this.target = this.currNode.getPosition();
                this.turnRound(this.target,0.5);
            }else{
                this.removeElement();
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:
 
    onLoad () {
        this.topRight = cc.v2(this.node.parent.width/2,this.node.parent.height/2);
        this.bottomLeft = cc.v2(-this.node.parent.width/2,-this.node.parent.height/2);
        this.schedule(this.callBacKeeper,1, cc.macro.REPEAT_FOREVER);
        this.node.on(cc.Node.EventType.TOUCH_START,this.callBackTouch, this);
        this.anim = this.getComponent(cc.Animation);
        this.anim.on('stop',this.onStop,this);
    },

    callBackTouch(){
       var prop = cc.instantiate(this.propPrefeb);
       prop.getComponent("ant_pro").insert({ "antname":"工蚁","sceneid": store.searchSceneId,"antid":this.id,"ants":[{"title":"蚁速","value":com.TransToSpeed(this.needtime),cost:com.TransToCost(com.TransToSpeed(this.needtime)*10)},{"title":"蚁力","value":this.power,cost:this.power*10}]});
       prop.zIndex = cc.macro.MAX_ZINDEX;
       prop.parent = this.node.parent;
       prop.setPosition(0,0);
    },


    getRandomPos() {
        let x = this.random(this.bottomLeft.x/3*2,this.topRight.x/3*2);
        let y = this.random(0,this.topRight.y/3*2);
        return cc.v2(x,y)
    },

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower+1)) + lower;   
    },

    onStop(){
        this.anim.play()
    },

    start () {
        this.movespeed = this.topRight.y/this.needtime*2;
        this._movespeed = this.movespeed;
        this.status = 3;
        this.randTurnRound(0.5);
        this.anim.play()
    },

    running(dt) {
            let dir = this.target.sub(this.node.getPosition());
            if (dir.mag() < this.movespeed*dt){
                if(this.status == 3) {
                    this.randTurnRound(dt);
                }
                return
            }
            dir.normalizeSelf();
            if(this.status == 1 || this.status == 2){
                this.node.x += dt*dir.x*this.movespeed;
                this.node.y += dt*dir.y*this.movespeed;
            }else{
                this.node.x += dt*dir.x*(this.movespeed/5);
                this.node.y += dt*dir.y*(this.movespeed/5);
            }
            return 
    },

    randTurnRound(dt) {
        this.target = this.getRandomPos();    
        this.turnRound(this.target,dt);
    },

    update (dt) {   
       this.running(dt);
    },
});
