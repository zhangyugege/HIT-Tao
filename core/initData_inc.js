/**
 * Created by Administrator on 2016/6/30.
 */
var user=require("../lib/database_func");
var data=require("../config/data");
var setting=require("../config/settings");
/**
 * 初始化函数
 */
function init(){}

init.initData=initData;
init.findDB=findDB;

module.exports = init;



/**
 * 开始的初始化工作  添加数据库的数据
 * @param host
 * @param port
 * @param dbName
 */
function initData(host,port,dbName){
    //开启数据库
    user.openDatabase(host,port,dbName)
        .then(function(db){
            //依次插入数据库
            for( var type in data ){
                for(var i=0;i<data[type].length;i++){
                    //console.log(type,data[type][i]);
                    insertDB(db, type, data[type][i]);
                }
            }
        })
        .done(function(data){
            console.log('promise执行成功');
        },function(err){
           console.log("promise执行失败:"+err);
        });

}

/**
 * 连接数据集合并查询数据，查询前几个limit()
 * @param db
 * @param collectionName
 */
function findDB(db){

    var deferred = Q.defer();
    user.openCollection(db,"test")
        .then(user.findCollectionLimit)
        .done(function(data){
            console.log('findDB promise执行成功'+data);
            deferred.resolve(data);
        },function(err){
            console.log("findDB promise执行失败:"+err);
            deferred.reject(err);
        });
    return deferred.promise;
}



/**
 * 将data的数据插入到db中
 * @param db
 * @param collectionName
 * @param insertTmp
 */
function insertDB(db,collectionName,insertTmp){

    user.openCollection(db,collectionName,insertTmp)
        .then(user.insertCollection)
        .then(user.findCollectionNoCondition)
        .done(function(data){
            console.log('promise执行成功');
        },function(err){
            console.log("promise执行失败:"+err);
        });

}
