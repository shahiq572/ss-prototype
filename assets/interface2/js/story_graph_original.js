/* <blockquote class="twitter-tweet" data-dnt="true" data-theme="light">
<p lang="en" dir="ltr">Super Bowl LVII was history in the making.👏 
<a href="https://t.co/iBEMfblpJd">pic.twitter.com/iBEMfblpJd</a></p>&mdash; NFL (@NFL) 
<a href="https://twitter.com/NFL/status/1625247189449449472?ref_src=twsrc%5Etfw">February 13, 2023</a>
</blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
*/
// {
    //   "id": 0,
    //   "tag": "op",
    //   "title": "Summary 1",
    //   "desc": "He did the dam@ge himslf to judiciary   Who is he??? He did the dam@ge himslf to judiciary   Who is he???",
    //   "sentColorCode": "#b3b3b3"
    // },

var d3Div = document.getElementById("aaa");
var width = d3Div.offsetWidth;
var height = d3Div.offsetHeight;

var cardWidth = 350;
var cardHeight = 350;


var nodes = []
d3.json("/assets/interface2/js/graph.json", function(error, graph) {
    if(error) console.log("ERROR OCCUR: "+JSON.stringify(error, null, 2))
    updateGraphs(graph.nodes)

})

function updateGraphs(nodesArr) {
    nodes = nodesArr

    var links = [
       
    ]
    
    for(var i=1; i<nodes.length;i++) {
       links.push( { "source": 0, "target": i } )
    }
    
    var svg = d3.select("svg")
                    .attr("width", width)
                    .attr("height", height);
    
    var linkSelection = svg
                    .selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);
    
    var nodeSelection = svg
                    .selectAll("foreignObject")
                    .data(nodes)
                    .enter()
                    .append("foreignObject")
                        .attr("width", cardWidth+"px")
                        .attr("height", cardHeight+"px")
                        .call(d3.drag()
                            .on("start", dragStart)
                            .on("drag", drag)
                            .on("end", dragEnd))
                                .html( function(d) {
                                    if(d.tag == "twitter") {
                                        return `
                                        <div class="card card_design" id="twitter_card">
                                            <div class="row">
                                                <span class="dot" style="background-color: ${d.sentColorCode}"></span>
                                            </div>
                                            <div class="row valign-center" style="margin: 0px;">
                                                <div class="col s3">
                                                    <img src="../assets/interface2/icons/twitter.png" alt="" class="circle responsive-img" style="width: 40px; height: 40px;">
                                                </div>
                                                <div class="col s9">
                                                    <a class="title" href="${d.link}" style="margin: 0px;"><b>${d.title}</b></a>
                                                    <small style=" color: #a7a7a7">${d.subtitle}</small>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <p class="twitter_content minimize" textLength="50">${d.body}</p>
                                                
                                                <p class="posted_at"><small><b>Posted At: </b>18 March 2016</small></p>
                                            </div>
                                        </div>
                                        
                                    `} else if(d.tag == "youtube"){
                                        return `
                                        <div class="card card_design" id="youtube_card">
                                            <div class="center" id="card_icon">
                                                <img src="../assets/interface2/icons/youtube.png" class="center" alt="twitter" >
                                            </div>
                                            <div class="row valign-center" style="margin: 0px;">
                                                <div class="col s3">
                                                    <img src="../assets/interface2/icons/youtube.png" alt="" class="circle responsive-img" style="width: 40px; height: 40px;">
                                                </div>
                                                <div class="col s9">
                                                    <h6 class="title" style="margin: 0px;">${d.title}</h6>
                                                    <small style=" color: #a7a7a7">alijamaal09</small>
                                                </div>
                                            </div>
                                            <video class="responsive-video" controls>
                                                <source src="https://www.youtube.com/watch?v=DR8zh6beUuw" type="video/mp4">
                                            </video>
                                            <div class="row">
                                                <p class="youtube_content">${d.body}</p>
                                                <p class="posted_at"><small><b>Posted At: </b>18 March 2016</small></p>
                                            </div>
                                            
                                        </div>
                                    `} else {
                                        return `
                                            <div class="card card_design" id="op_card">
                                                <div class="row">
                                                    <span class="sentiment circle responsive-img" style="background-color: ${d.sentColorCode}"></span>
                                                </div>
                                                <div class="center title_div">
                                                    <h2> ${d.title} </h2>
                                                </div>
                                                <div class="desc_div">
                                                    <p  class="minimize" textLength="100"> ${d.body} </p>
                                                </div>
                                            </div>
                                    `}
                                });
    
    // var nodeDiv = nodeSelection
    //                 .append("xhtml:div")
    //                     .classed("card", true)
    //                     .classed("card_design", true);
    
    // var titleDiv = nodeDiv
    //                 .append("div")
    //                     .classed("center", true)
    //                     .classed("title_div", true)
    //                         .append("h2")
    //                             .text(d => d.title)
    
    // var descDiv = nodeDiv
    //                 .append("div")
    //                     .classed("desc_div", true)
    //                         .append("p")
    //                             .text(d => d.desc)
    
    
    
    var simulation = d3.forceSimulation(nodes);
    simulation
        .force('center', d3.forceCenter(width/2-cardWidth, height/2))
        .force("links", d3.forceLink(links)
                                .id(d => d.id))
        // .force('nodes', d3.forceManyBody().strength(""+cardHeight*-1).distanceMin(cardHeight).distanceMax(cardHeight*2))
        .force("collide", d3.forceCollide(function(d) {
            return document.getElementById(d.tag+"_card").clientHeight/1.1
          }))
        .on('tick', (d, i) => {
            
            nodeSelection
                // .attr('x', d => d.id==0?width/2-cardWidth/2:d.x)
                // .attr('y', d => d.id==0?height/2-cardHeight:d.y)
                .attr('x', d=>d.x)
                .attr('y', d=>d.y)
    
                // TO fix root node at center
                nodes[0].fx = width/2 - cardWidth/2;
                nodes[0].fy = height/2 - cardHeight/4;      
                nodes[0].fixed = true;  
    
    
            linkSelection
                .attr("x1", d => d.source.x + cardWidth/2)
                .attr("y1", d => d.source.y/2 + cardHeight/2)
                .attr("x2", d => d.target.x + cardWidth/2)
                .attr("y2", d => d.target.y + cardHeight/2);
        });
    
    function dragStart(d) {
        console.log("Starting to drag");
        simulation.alphaTarget(0.5).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function drag(d) {
        console.log("Dragging");
        d.fx = validate(d3.event.x, 0, width);
        d.fy = validate(d3.event.y, 0, height);
    }
    
    function dragEnd(d) {
        console.log("Done Dragging ");
        // if (!d3.event.active) simulation.alphaTarget(0);
        // d.fx = d3.event.x;
        // d.fy = d3.event.y;
        
        d3.event.sourceEvent.stopPropagation();
    }
    
    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = true);
      }
    
      function validate(x, a, b) {
        if (x < a) x = a;
        if (x > b) x = b;
        return x;
    }
    
    function validate(x, a, b) {
        if (x < a) x = a;
        if (x > b) x = b;
        return x;
    }

}
