/**
 * Created by Administrator on 2016/6/30.
 */

function setting(){
    this.connectFlag=false;
    this.host="localhost";
    this.port=27017;
    this.DB="test";
}
 var settin=new setting();
module.exports = settin;