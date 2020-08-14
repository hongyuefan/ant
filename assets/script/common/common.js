
var common = {
    TransToNeedTime(speed){
       return 4.2 - (speed / 250);
    },
    TransToSpeed(needtime) {
        return 250*(4.2-needtime);
    },
    TransToCost(value){
        return Math.round(value);
    },
};

module.exports = common;