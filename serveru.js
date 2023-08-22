const { urlencoded } = require("express");
var expressKuch=require("express");
var app=expressKuch();
var fileuploader=require("express-fileupload");
// var fileuploader=require("express-fileupload");
var path=require("path");
var mysql=require("mysql");
//         port   behavior
app.use(fileuploader());
app.use(expressKuch.urlencoded('extended:true'));

app.use(expressKuch.static("public"));

app.listen(2207,function(){
    console.log("Server Started");
})

var dbConfigurationObject={
    host:"localhost",//fixed
    user:"root",//pwd
    password:"", //""
    database:"medical_project" //ur own database name 
}

var refDB=mysql.createConnection(dbConfigurationObject);
refDB.connect(function(err)
{
    if(err)
    {
        console.log(err)
    }
    else{
        console.log("Mysql connectedd successsfully");
    }
}); 



app.get("/index",function(req,resp)
{
    var fullPath=path.join(__dirname,"public","index.html");
    resp.sendFile(fullPath);
    console.log("done");
})



app.get("/signup-process",function(req,resp)
{
    var dataAry=[req.query.txtemail,req.query.pwd,req.query.utype,1];
    refDB.query("insert into index1 values(?,?,?,?)",dataAry,function(err,result){

        console.log(req.query.txtemail);
        if(err)
        {
            resp.send(err);
        }
        else
        {
            resp.send("SIGNED UP SUCCESSFULLY");
        }
    })

})

app.get("/login-process",function(req,resp){
   
    refDB.query("select * from index1 where email=? and pwd=? and status=1",[req.query.lgemail,req.query.lgpwd],function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/update-process",function(req,resp){
    var dataAry=[req.query.newpwd,req.query.stgemail,req.query.oldpwd];

    refDB.query("select * from index1 where email=? and pwd=?",[req.query.stgemail,req.query.oldpwd],function(err,result){
        if(err)
        {
            resp.send("Invalid");
        }
        else if(result.length==1)
        {
            refDB.query("update index1 set pwd=? where email=? and pwd=?",dataAry,function(err,result){
                if(err)
                resp.send(err);
                else
                resp.send("UPDATED SUCCESSFULLY");
            })
        }
        else
        {
            resp.send("INVALID");
        }
    })
})


app.post("/save-donor-profile",function(req,resp){
    var fname=req.body.email+"-"+req.files.proofpic.name;
    var des=process.cwd()+"/public/uploads/"+fname;
    req.files.proofpic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
    })

    var fnamef=req.body.email+"-"+req.files.profilepic.name;
    var dest=process.cwd()+"/public/uploads/"+fnamef;
    req.files.profilepic.mv(dest,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
    })

    var dataAry=[req.body.email,req.body.dname,req.body.mobileid,req.body.idaddress,req.body.cityid,req.body.idproof,req.body.timeid,fname,fnamef];//use names
   refDB.query("insert into dprofile values(?,?,?,?,?,?,?,?,?)",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully");
   })
})

app.get("/getkuch",function(req,resp)
{
    //0/1 records
       refDB.query("select * from dprofile where email=?",[req.query.email],function(err,resultAryOfObjects)
       {
            if(err)
                resp.send(err);
               
            else
                resp.send(resultAryOfObjects);;
       })
})

app.post("/update-donor-profile",function(req,resp){
       var fnamef;
    fnamef=req.body.email+"-"+req.files.proofpic.name;
    var des=process.cwd()+"/public/uploads/"+fnamef;
    req.files.proofpic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
    })

   var fnameg=req.body.email+"-"+req.files.profilepic.name;
    var dest=process.cwd()+"/public/uploads/"+fnameg;
    req.files.profilepic.mv(dest,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
    })


    var dataAry=[req.body.dname,req.body.mobileid,req.body.idaddress,req.body.cityid,req.body.idproof,req.body.timeid,fnamef,fnameg,req.body.email]
    refDB.query("update dprofile set name=? ,mobile=?,address=?,city=?,prooftype=?,timings=?,proofpic=?,profilepic=? where email=?",dataAry,function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send("Updated Sucessfully");
    })
})

app.get("/chkEmailKuch",function(req,resp)
{
    //0/1 records
       refDB.query("select * from index1 where email=?",[req.query.txtemail],function(err,resultAryOfObjects)
       {
            if(err)
                resp.send(err);
                else
                if(resultAryOfObjects.length==0)
                {
                    resp.send("Available...");
                }
                else
                resp.send("Already Occupied...");;
       })
})

app.post("/listing-process",function(req,resp){
    var fname3=req.body.email+"-"+req.files.proofpic.name;
    var des=process.cwd()+"/public/uploads/"+fname3;
    req.files.proofpic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
    })

    var dataAry=[req.body.email,req.body.medname,req.body.packingid,req.body.idquantity,req.body.dateid,req.body.idcompany,fname3,req.body.desid,req.body.cdateid];
    refDB.query("insert into medicines values(?,?,?,?,?,?,?,?,?)",dataAry,function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send("Listing Done");

    })

})

app.all("/fetchAllRecords",function(req,resp){
    refDB.query("select * from index1", function(err,resultAryOfObjects){
        if(err)
        resp.send(err);
        else
        resp.send(resultAryOfObjects);
    })
})

app.get("/block",function(req,resp){
   
   refDB.query("update index1 set status=? where email=?",[0,req.query.email],function(err,result)
   {
    if(err)
    resp.send(err);
    else
    resp.send("UPDATED");
   })

})

app.get("/resume",function(req,resp){
   
    refDB.query("update index1 set status=? where email=?",[1,req.query.email],function(err,result)
    {
     if(err)
     resp.send(err);
     else
     resp.send("UPDATED");
    })
 
 })
 app.all("/fetchAllRecords2",function(req,resp){
    refDB.query("select * from dprofile ",function(err,resultAryOfObjects){
        if(err)
        resp.send(err);
        else
        resp.send(resultAryOfObjects);
    })
})
app.get("/delete-donor",function(req,res)
{                                //table col name
    refDB.query("delete from dprofile where email=?",[req.query.email],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy....");
    })
})
app.all("/fetchAllRecords3",function(req,resp){
    refDB.query("select * from index1 where utype=? ",['Needy'],function(err,resultAryOfObjects){
        if(err)
        resp.send(err);
        else
        resp.send(resultAryOfObjects);
    })
})
app.get("/delete-needy",function(req,res)
{                                //table col name
    refDB.query("delete from index1 where email=?",[req.query.email],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy.... ");
    })
})

app.get ("/fetchCities",function(req,resp){
    refDB.query("select distinct city from dprofile ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })
})
app.get ("/fetchMedicine",function(req,resp){
    refDB.query("select * from medicines inner join dprofile on medicines.email=dprofile.email where dprofile.city=?",[req.query.cityx],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })
})

app.get("/fetchSomeRecords",function(req,resp)
{
    refDB.query("select * from medicines where medicines=?",[req.query.medicine],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})

app.get ("/fetchInfo",function(req,resp){
    refDB.query("select * from dprofile where email=?",[req.query.emailid],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })
})

app.all("/fetchListedMeds",function(req,resp){
    refDB.query("select * from medicines where email=?",[req.query.email], function(err,resultAryOfObjects){
        if(err)
        resp.send(err);
        else
        resp.send(resultAryOfObjects);
    })
})
app.get("/dounlist",function(req,res)
{                                //table col name
    refDB.query("delete from medicines where email=?",[req.query.email],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy.... Badhaiiiii");
    })
})