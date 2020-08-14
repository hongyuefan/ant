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
      msg:{
         default:null,
         type:cc.Label,
      },
      title:{
          default:"",
      },
    },

    start () {
        switch (this.title){
            case "蚁速":
                this.msg.string = "蚂蚁的移动速度，速度越快，搬运奶酪越迅捷";
                break;
            case "蚁力":
                this.msg.string = "蚂蚁的力量值，力量越强捕获奶酪的能力越大，探索到的奶酪越大";
                break;
            case "蚁攻":
                this.msg.string = "兵蚁的攻击力";
                break;
            case "血量":
                this.msg.string = "兵蚁的血量";
                break;
        }
    },

    onClose(){
        this.node.destroy();
    }
});
