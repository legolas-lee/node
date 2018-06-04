/**
 * Created by kreta on 2018/6/3.
 */
module.exports = function makeSql(opition) {
    var data=opition.data;
    var table=opition.table;
    var operate=opition.operate;
    //console.log(opition)
    switch(operate)
    {
        //查询
        case 'SELECT':
            var sql='SELECT '+opition.field+' FROM '+table;
            if(opition.queryterm){
                sql+=' WHERE '+opition.queryterm;
            }
            return sql;
            break;
        //删除
        case 'DELETE':
            if(opition.queryterm){
                var sql='DELETE FROM '+table+' WHERE '+opition.queryterm;
            }
            else{
                console.log("你想把整把表删了吗？")
            }
            return sql;
            break;
        //单条插入
        case 'INSERT':
            var arrkey=[];
            for(var item in data){
                arrkey.push(item)
            };
            //var strkey=arrkey.join(",");
            var arrvalue=[];
            for(var item in data){
                arrvalue.push('"'+data[item]+'"')
            };
            //var strvalue=arrvalue.join(",");
            var sql='INSERT INTO '+table+'('+arrkey+') VALUES('+arrvalue+')';
            return sql;
            break;
        //单条更新
        case 'UPDATE':
            var arr=[];
            for(var item in data){
                arr.push(item+'="'+data[item]+'"')
            };
            //var str=arr.join(",");
            var sql='UPDATE '+table+' SET '+arr+' WHERE ID='+data.ID;
            return sql;
            break;
    }
}