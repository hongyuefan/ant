var encrypt = require('./encryptjs');
var secretkey= 'open_sesame';

var store = {
        userId:"",
        golds:0,
        total_golds:0,
        touch_high:0,
        touch_low:0,
        searchAntIds:[],
        defenAntIds: [],
        queenAntIds: [],
        searchSceneId:"",
        defenSceneId:"",
        queenSceneId:"",
        eggsNums:0,
        good_ids:[],
        version:0,
        speedTime:0,
        totalTime:0,
        gold_status:0,
        egg_status:0,
        ant_status:0,
        audit:true,



    onLoad () {

        this.touch_high = 8;
        this.touch_low = 4;
        this.searchSceneId = "ssid";
        this.defenSceneId  = "dsid";
        this.queenSceneId  = "qsid";
        this.totalTime = 28800000;
        this.audit = true;

        this.loadSearchAntIds();

        if (this.searchAntIds == null || this.searchAntIds.length == 0) {
            this.initOnce();
        }else{
            this.loadGolds();
            this.loadTotalGolds();
            this.loadSearchAntIds();
            this.loadEggs();
            this.loadGoodIds();
            this.loadVersion();
            this.getStatus();
            this.loadAudit();
        }
    },

    initOnce(){
        this.putGolds(0);
        this.putTotalGolds(0);
        this.putVersion(0);
        this.putStatus(0,0,0);

        this.putGood(1,"蚁卵",500,"ico_egg");

        this.resetEggs();

        this.putAntProperty(this.searchSceneId,0,50,50,0,0,0);
        this.putSearchAntIds(0);

        this.setHatchRate(40,40,40);

        this.setItem("audit",true);
    },

    loadVersion(){
        this.version = JSON.parse(this.getItem("version"));
    },

    putVersion(version){
        this.version = version;
        this.setItem("version",version);
    },

    loadAudit(){
        this.audit =JSON.parse(this.getItem("audit"));
    },

    updateAudit(){
        this.audit = !this.audit;
        this.setItem("audit",this.audit);
    },

    getAudit(){
        return this.audit;
    },

    getVersion(){
        return this.version;
    },

    loadGoodIds(){
        this.good_ids = JSON.parse(this.getItem("goods_ids"));
    },

    getGoodIds(){
        return this.good_ids;
    },

    resetGoodIds(){
        this.good_ids = [];
    },

    putGood(id,name,price,frame){
        this.good_ids.push(id);
        this.setItem("goods_"+id,JSON.stringify({"id":id,"name":name,"price":price,"frame":frame}));
        this.setItem("goods_ids",JSON.stringify(this.good_ids));
    },

    putStatus(gold,egg,ant){
        this.gold_status = gold;
        this.egg_status = egg;
        this.ant_status = ant;
        this.setItem("status",JSON.stringify({"gold_status":gold,"egg_status":egg,"ant_status":ant}));
    },

    getStatus(){
        let status = JSON.parse(this.getItem("status"));
        this.gold_status = status.gold_status;
        this.egg_status = status.egg_status;
        this.ant_status = status.ant_status;
    },

    updateTotalTime(tm){
        this.totalTime = tm;
    },

    updateSpeedTime(tm){
        this.speedTime = tm;
        this.setItem("speed_time",this.speedTime);
    },

    putSpeedTime(){
        this.speedTime = Date.parse(new Date());
        this.setItem("speed_time",this.speedTime);
    },

    loadSpeedTime(){
        this.speedTime = this.getItem("speed_time");
    },

    getSpeedTime(){
        return this.speedTime;
    },

    getGoodId(id){
        return JSON.parse(this.getItem("goods_"+id));
    },

    setHatchRate(search,defen,queen){
        var rates = this.getItem("hatch_rate");
        if (isNaN(rates) || rates == null || rates.length == 0){
            this.setItem("hatch_rate",JSON.stringify({"search_rate":search,"defen_rate":defen,"queen_rate":queen}));
            return;
        }
        rates = JSON.parse(rates);
        if(search !=null && search >= 0){
            rates.search_rate = search
        }
        if(defen != null && defen >=0){
            rates.defen_rate = defen;
        }
        if(queen != null && queen >=0){
            rates.queen_rate = queen;
        }
        this.setItem("hatch_rate",JSON.stringify(rates));
        return;
    },

    getHatchRate(){
        var rates = this.getItem("hatch_rate");
        if (rates != null) {
            return JSON.parse(rates);
        }
    },

    putTimestamp(){
        this.setItem("last_login",Date.parse(new Date()));
    },

    getTimestamp(){
        return this.getItem("last_login");
    },

    putSearchAntIds(id){ 
        this.searchAntIds.push(id);
        this.setItem("search_ant_ids",JSON.stringify(this.searchAntIds));
    },


    // setItem(key,value){
    //     var encrypted = encrypt.encrypt(value,secretkey,256);
    //      cc.sys.localStorage.setItem(key,encrypted);
    //  },
 
    //  getItem(key){
    //      var value = cc.sys.localStorage.getItem(key);
    //      if (value != null){
    //          return encrypt.decrypt(value,secretkey,256);
    //      }
    //      return null;
    //  },

    setItem(key,value){
        cc.sys.localStorage.setItem(this.userId+key,value);
    },

    getItem(key){
        var value = cc.sys.localStorage.getItem(this.userId+key);
        return value;
    },

    getSearchAntIds(){
        return this.searchAntIds;
    },

    loadSearchAntIds(){
        var tmp = this.getItem("search_ant_ids");
        if(tmp == null || tmp.length == 0){
            this.searchAntIds = [];
        }else{
            this.searchAntIds = JSON.parse(tmp);
        } 
    },

    putDefenAntIds(id){
        this.defenAntIds.push(id);
        this.setItem("defen_ant_ids",JSON.stringify(this.defenAntIds));
    },

    removeDefenAntIds(id){
        for(var index=0;index<this.defenAntIds.length;index++){
            if(this.defenAntIds[index]==id){
                this.defenAntIds.splice(index,1);
            }
        }
        this.setItem("defen_ant_ids",JSON.stringify(this.defenAntIds));
        this.removeAnt(this.defenSceneId,id);
    },

    getDefenAntIds(){
        return this.defenAntIds;
    },

    loadDefenAntIds(){
        this.defenAntIds = JSON.parse(this.getItem("defen_ant_ids"));
    },

    putQueenAntIds(id){
        this.queenAntIds.push(id);
        this.setItem("queen_ant_ids",JSON.stringify(this.queenAntIds));
    },

    getQueenAntIds(){
        return this.queenAntIds;
    },

    loadQueenAntIds(){
        this.queenAntIds = JSON.parse(this.getItem("queen_ant_ids"));
    },

    setUserId(userId){
        this.userId = userId;
    },

    getUserId(){
        return this.userId;
    },

    putAntProperty(sceneId,antId,speed,power,blood,attact,hardwork){
        this.setItem(sceneId.toString() + antId.toString(),JSON.stringify({"id":antId,"speed":speed,"power":power,"blood":blood,"attact":attact,"hardwork":hardwork}));
    },

    updateAntProperty(sceneId,antId,prop){
        var ant = this.getAntProperty(sceneId,antId);
        if (prop.speed != null && prop.speed != 0){
            ant.speed = prop.speed;
        }
        if (prop.power != null && prop.power != 0){
            ant.power = prop.power;
        }
        if (prop.blood != null && prop.blood != 0){
            ant.blood = prop.blood;
        }
        if (prop.attact != null && prop.attact != 0){
            ant.attact = prop.attact;
        }
        if (prop.hardwork != null && prop.hardwork != 0){
            ant.hardwork = prop.hardwork;
        }
        this.setItem(sceneId.toString() + antId.toString(),JSON.stringify(ant));
    },

    getAntProperty(sceneId,antId) {
        var tmp = this.getItem(sceneId.toString() + antId.toString());
        return JSON.parse(tmp);
    },

    removeAnt(sceneId,antId){
        cc.sys.localStorage.removeItem(sceneId.toString() + antId.toString());
    },

    putTotalGolds(golds){
        this.total_golds = parseInt(golds);
        this.setItem("ant_total_golds",this.total_golds);
    },
    getTotalGolds(){
        return this.total_golds;
    },

    loadTotalGolds(){
        this.total_golds = parseInt(this.getItem("ant_total_golds"));
    },

    updateTotalGolds(golds){
        this.total_golds = parseInt(this.total_golds) + parseInt(golds);
        this.setItem("ant_total_golds",this.total_golds);
    },

    putGolds(golds){
        this.golds = parseInt(golds);
        this.setItem("ant_golds",this.golds);
    },

    getGolds(){
        return this.golds;
    },

    loadGolds(){
        this.golds = parseInt(this.getItem("ant_golds"));
    },

    updateGolds(golds){
        this.golds = parseInt(this.golds) + parseInt(golds);
        if(this.golds < 0){
            this.golds = 0;
        }
        this.setItem("ant_golds",this.golds);
        if(golds > 0){
            this.updateTotalGolds(golds);
        }
    },

    resetEggs(){
        this.eggsNums = 0;
        this.setItem("ant_eggs",this.eggsNums);
    },

    loadEggs(){
        this.eggsNums = parseInt(this.getItem("ant_eggs"));
    },

    getEggs(){
        return this.eggsNums;
    },

    updateEggs(n){
        this.eggsNums += n;
        this.setItem("ant_eggs",this.eggsNums);
    },

};

module.exports = store;