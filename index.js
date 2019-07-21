const http=require("http");


var fs=require("fs");

var url=require("url");

var replace=require("./replace");

var obj=fs.readFileSync("data.json");

var jsonObj=JSON.parse(obj);

var templateProduct=fs.readFileSync("./templates/template-product.html").toString();
var templateCard=fs.readFileSync("./templates/template-card.html").toString();
var templateOverview=fs.readFileSync("./templates/template-overview.html").toString();

const server=http.createServer(function(req,res){
    var MakeCard=function(templateCard,json){
        return replace(templateCard,json)
    }
   console.log("url requested" + req.url);
    var path=req.url;
    console.log(url.parse(path,true));
    var id=url.parse(path,true).query.id;
    console.log(id);
    var path=url.parse(path,true).pathname;

    if(path=="/products"){



    var ProductHtml=replace(templateProduct,jsonObj[id]);
    res.writeHead(200,{"content-type":"text/html"});
        res.end(ProductHtml);
    }
   
    else if(path=="/"||path=="/overview"){
        res.writeHead(200,{"content-type":"text/html"});

        var cardArr="";
        for(let i=0;i<jsonObj.length;i++){
            cardArr+=MakeCard(templateCard,jsonObj[i]);
             }
             let OverviewHtml= templateOverview.replace("{%PRODUCT_CARDS%}",cardArr);
       
             res.end(OverviewHtml);
        
    }
    else if(path=="/api"){
    var obj=fs.readFileSync("./data.json");
    res.writeHead(200,{"content-type":"application/json"})
    res.end(obj);
}
    else{ res.writeHead(400);
        res.end("404 Error page not found")
    }
    
});
var port=process.env.PORT||80;
server.listen(port);
console.log("Server has started at port "+port);