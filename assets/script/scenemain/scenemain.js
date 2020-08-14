var store = require("../store/store");
//var socket = require("../network/websocket");

cc.Class({
    extends: cc.Component,

    properties: {
        camera:{
            default:null,
            type:cc.Node,
        },
        search:{
            default:null,
            type:cc.Node,
        },
        defen:{
            default:null,
            type:cc.Node,
        },
        queen:{
            default:null,
            type:cc.Node,
        },
        needTime:{
            default:1,
            type:cc.Float,
        },
        moveSpeed:{
            default:0,
            type:cc.Float,
        },
        status:{
            default:0,
            type:cc.Integer,
        },
        touchStartPos:{
            default: new cc.v2,
        },
        currentScene:{
            default:1,
            type:cc.Integer,
        },
        judgeMent:{
            default:10,
            type:cc.Float,
        },
        version:{
            default:0,
            type:cc.Integer,
        }
    },


    onLoad () {
        store.userId = "ant_game_";
        store.onLoad();
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        // this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);  
        //this.registNetworkHandler();
        //this.schedule(this.pingPong,12, cc.macro.REPEAT_FOREVER);
    },

    // registNetworkHandler(){
    //     socket.RegistFunc(10001,this.getGoods,this);
    //     socket.RegistFunc(10003,this.updateGoods,this);
    // },

    // getGoods(msg,self){
    //     if(msg != null ){
    //         self.version = msg.version;
    //         if(msg.version > store.getVersion()){
    //             socket.SendMsg(10003,{});
    //         }
    //     }
    // },

    // updateGoods(msg,self){
    //     if(msg != null ){
    //         if(msg.goods.length >0 ){
    //             store.resetGoodIds();
    //             for(var good of msg.goods){
    //                 store.putGood(good.id,good.name,good.price,good.frame);
    //             }
    //         } 
    //         store.putVersion(self.version); 
    //     }
    // },

    // pingPong(){
    //     socket.SendMsg(10002,{"uuid":store.userId,"total_golds":store.getTotalGolds()});
    //     socket.SendMsg(10001,{});
    // },

    onDestroy(){
        //socket.SendMsg(10002,{"uuid":store.userId,"total_golds":store.getTotalGolds()});
    },

    start () {
        this.needTime = 2;
        this.currentScene = 1;
        this.moveSpeed = this.node.height/this.needTime;
        this.judgeMent = this.moveSpeed/cc.game.getFrameRate();
    },

    touchMove(event){
        if (this.currentScene == 1) {        
            if (this.touchStartPos != null && (this.node.convertToNodeSpaceAR(event.getLocation()).y-this.touchStartPos.y) > this.node.height/5){
                this.status = 2;
            }
        }else if (this.currentScene == 2) {
           
            if (this.touchStartPos != null && (this.touchStartPos.y - this.node.convertToNodeSpaceAR(event.getLocation()).y) >  this.node.height/5){
               this.status = 1;
            }
            if (this.touchStartPos != null && (this.node.convertToNodeSpaceAR(event.getLocation()).y-this.touchStartPos.y) >  this.node.height/5){
               this.status = 3;
            }
        }else if (this.currentScene == 3) {
            if (this.touchStartPos != null && (this.touchStartPos.y - this.node.convertToNodeSpaceAR(event.getLocation()).y) >  this.node.height/5){
                this.status = 2;
            }
        }
    },

    touchStart(event) {
        this.touchStartPos = this.node.convertToNodeSpaceAR(event.getLocation());
    },

    touchEnd(event) {
        this.touchStartPos = null;
    },

    moveToSearch(dt){
        let dir = this.search.getPosition().y - this.camera.getPosition().y;

        if (Math.abs(dir) <= this.judgeMent){
            this.currentScene = 1;
            this.status = 0;
            return
        }
        this.camera.y += (this.moveSpeed*dt* (dir/Math.abs(dir)));
    },

    moveToDefen(dt){
        let dir = this.defen.getPosition().y - this.camera.getPosition().y;

        if (Math.abs(dir) <= this.judgeMent){
            this.currentScene = 2;
            this.status = 0;
            return
        }
        this.camera.y += (this.moveSpeed*dt* (dir/Math.abs(dir)));
    },

    moveToQueen(dt){
        let dir = this.queen.getPosition().y - this.camera.getPosition().y;
        if (Math.abs(dir) <= this.judgeMent){
            this.currentScene = 3;
            this.status = 0;
            return
        }
        this.camera.y += (this.moveSpeed*dt* (dir/Math.abs(dir)));
    },

    update (dt) {
        if (this.status == 1){
            this.moveToSearch(dt);
        }else if (this.status == 2){
            this.moveToDefen(dt);
        }else if (this.status == 3){
            this.moveToQueen(dt);
        }
    },
});
