/**
 * Created by Administrator on 2016/7/1.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var mongo = require("mongodb");
// Connection URL



function User(){}

User.connectDB=connectDB;
User.insertDocuments=insertDocuments;
User.updateDocument=updateDocument;
User.deleteDocument=deleteDocument;
User.deleteDocuments=deleteDocuments;
User.findDocuments=findDocuments;


module.exports = User;


/**
 * 连接服务器
 * @param url
 * @param callback
 */
function connectDB(url,callback){
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("成功连接到数据库服务器");
        //crud
        //db.close();
        callback(db);
    });
}


/**
 * 向数据库插入数据
 * @param db
 * @param callback
 * @param collections
 * @param insertTmp
 */
function insertDocuments(db,collections,insertTmp, callback) {
    var collection = db.collection(collections);
    collection.insertMany(insertTmp,//[{a : 1}, {a : 2}, {a : 3}]
        function(err, result) {
        console.log("向"+collections+"添加数据"+insertTmp+"成功");
        callback(result);
    });
}

/**
 * 向数据库更新数据  $set  $push
 * @param db
 * @param callback
 * @param collections
 * @param updateTmp
 */
function updateDocument(db,collections,updateTmp1,updateTmp, callback) {
    var collection = db.collection(collections);
    collection.updateOne(updateTmp1,updateTmp, function(err, result) {
            console.log("向"+collections+updateTmp1+"更新数据"+updateTmp+"成功");
            callback(result);
        });
}
/**
 * 向数据库删除数据  一个数据
 * @param db
 * @param callback
 * @param collections
 * @param deleteTmp
 */
function deleteDocument(db,collections,deleteTmp, callback) {
    var collection = db.collection(collections);
    collection.deleteOne(deleteTmp, function(err, result) {
        console.log("向"+collections+"删除数据"+deleteTmp+"成功");
        callback(result);
    });
}
/**
 * 向数据库删除数据  所有数据
 * @param db
 * @param callback
 * @param collections
 * @param deleteTmp
 */
function deleteDocuments(db,collections,deleteTmp, callback) {
    var collection = db.collection(collections);
    collection.deleteMany(deleteTmp, function(err, result) {
        console.log("向"+collections+"删除数据"+deleteTmp+"成功");
        callback(result);
    });
}
/**
 * 向数据库查找数据
 * @param db
 * @param callback
 * @param collections
 * @param limit
 * @param findTmp
 */
function findDocuments(db, collections,limit,findTmp,callback) {
    var collection = db.collection(collections);
    if(findTmp){
        if( limit && (typeof limit==="number")){
            console.log(findTmp);
            collection.find(findTmp).limit(limit).toArray(function(err, docs) {
                console.log("向"+collections+"查询符合条件的 "+limit+" 个数据"+docs+"成功");
                console.dir(docs);
                callback(docs);
            });
        }else{
            console.log(findTmp);
            collection.find(findTmp).toArray(function(err, docs) {
                console.log("向"+collections+"查询符合条件的"+"所有数据"+docs+"成功");
                console.dir(docs);
                callback(docs);
            });
        }

    }else {
        if( limit && (typeof limit==="number")){
            collection.find().limit(limit).toArray(function(err, docs) {
                console.log("向"+collections+"查询 "+limit+" 个数据"+docs+"成功");
                console.dir(docs);
                callback(docs);
            });
        }else{
            collection.find().toArray(function(err, docs) {
                console.log("向"+collections+"查询 "+"所有数据"+docs+"成功");
                console.dir(docs);
                callback(docs);
            });
        }
    }

}