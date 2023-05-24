
var d3Div = document.getElementById("aaa");
var width = d3Div.offsetWidth;
var height = d3Div.offsetHeight + 100;

var cardWidth = 350;
var cardHeight = 300;

var currentNode = 0;

var nodes = []
var data_json = d3.json("/assets/interface2/js/graph.json", function(error, graph) {
    if(error) console.log("ERROR OCCUR: "+JSON.stringify(error, null, 2))
    updateGraphs(graph.nodes, graph.links)

})

function updateGraphs(nodesArr, linksArr) {
    // nodes = nodesArr
    // filter out the elements whose source is not 0

    var links = linksArr.filter(function(link) {
        return link.source === 0;
    });
    
    console.log("links arr: ",links);
    
    /*for( var i=1; i<nodes.length;i++) {
    //    links.push( { "source": 0, "target": i } )
        if(nodes[i].id) {
            nodes[i].remove();
        }
    } */

    nodes = links.map(function(link) {
        return nodesArr.find(function(node) {
            return node.id === link.target;
        });
    });

    nodes.push(nodesArr[0])

    console.log("nodes arr: ",nodes);
    

    // Your existing D3.js code for creating links and nodes goes here...

    // ... your link and node selection logic

    var svg = d3.select("svg")
                    .attr("width", width)
                    .attr("height", height);
    
    var linkSelection = svg
                    .selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                        .attr("stroke", "silver")
                        .attr("stroke-width", 2);
    
    // To fix root node at center
    nodes[3].fx = width/2 - cardWidth/2;
    nodes[3].fy = height/2 - cardHeight/2;    

    // Calculate the center of the SVG
    var cx = width / 2;
    var cy = height / 2;

    // Calculate the radius for the nodes, it should be less than half of the SVG's width or height
    var radius = Math.min(width, height) / 2.5;

    var nodeSelection = svg
                    .selectAll("foreignObject")
                    .data(nodes)
                    .enter()
                    .append("foreignObject")
                        .attr("width", cardWidth+"px")
                        .attr("height", cardHeight+"px")
                        .attr("x", function(d, i) {
                            x_val = 0;
                            if(d.id == 0) { // check if it is the first node
                                x_val = (cx - cardWidth / 2);
                            } else {
                                /** @todo randomly displace x vals to get that graphy effect*/
                                var angle = (2 * Math.PI * (i - 1)) / (nodes.length - 1); // calculate the angle for this node
                                x_val =  (cx + radius * Math.cos(angle) - cardWidth / 2);
                            }
                            console.log("val of d: ",d.id,"val of i: "+i,"x val = ", x_val);
                            return Math.abs(x_val) + "px";
                        })
                        .attr("y", function(d, i) {
                            if(d.id == 0) { // check if it is the first node
                                y_val =  (cy - cardHeight / 1.5);
                            } else {
                                var angle = (2 * Math.PI * (i - 1)) / (nodes.length - 1); // calculate the angle for this node
                                y_val =  (cy + radius * Math.sin(angle) - cardHeight / 2);
                            }
                            console.log("y val = ", y_val);
                            return Math.abs(y_val) + "px";
                        })
                        .on("click", clickNode)
                        // .call(d3.drag()
                        //     .on("drag", drag))
                            .html( function(d) {
                                if(d.tag == "twitter") {
                                    return `
                                    <div class="card card_design" id="twitter_card">
                                        <!--div class="row">
                                            <span class="dot" style="background-color: ${d.sentColorCode}"></span>
                                        </div-->
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
                                                <p  class="minimize" text-length="50"> ${d.body} </p>
                                            </div>
                                        </div>
                                `}
                            });
        
    
    
     
     // Add node positions
    //  nodeSelection.forEach((node, i) => {
         
    //  });

    // nodeSelection.attr('x', d=>d.x).attr('y', d=>d.y)
    // nodeSelection.attr('style', d => `left:${d.x}px;top:${d.y}px`);


   

    var simulation = d3.forceSimulation(nodes);
    simulation
        .force('center', d3.forceCenter(width/2-cardWidth, height/2))
        .force("links", d3.forceLink(links)
                                .id(d => d.id))
        // .force('nodes', d3.forceManyBody().strength(""+cardHeight*-1).distanceMin(cardHeight).distanceMax(cardHeight*2))
        // .force("collide", d3.forceCollide(function(d) {
        //     return document.getElementById(d.tag+"_card").clientHeight/1.1
        //   }))
        .on('tick', (d, i) => {
            // nodeSelection.attr('x', d=>d.x).attr('y', d=>d.y)
    
                // TO fix root node at center
            //     nodes[0].fx = width/2 - cardWidth/2;
            //     nodes[0].fy = height/2 - cardHeight/4;      
            //     nodes[0].fixed = true;  
    
            // linkSelection
            //     .attr("x1", d => d.source.x + cardWidth/2)
            //     .attr("y1", d => d.source.y/2 + cardHeight/2)
            //     .attr("x2", d => d.target.x + cardWidth/2)
            //     .attr("y2", d => d.target.y + cardHeight/2);

            // nodeSelection.attr('style', d => `left:${d.x}px;top:${d.y}px`);


            // linkSelection
            //     .attr("x1", d => d.source.x + cardWidth/2)
            //     .attr("y1", d => d.source.y + cardHeight/2)
            //     .attr("x2", d => d.target.x + cardWidth/2)
            //     .attr("y2", d => d.target.y + cardHeight/2);
        });
        // .force('collide',d3.forceCollide().radius(60).iterations(2));
    
    // Define the clickNode function
function clickNode(d) {
    console.log("\n CLikced node: "+d.id);
    
    // Extract the clicked node's ID
    var clickedNodeId = d.id;

    // clear canvas
    var svg = d3.select("svg")


    // make some global var that has the json for nodes
    // follow similar code structure as updateGraph and make another function for creating graph
    
    // first update new nodes and fetch childs put them in data
    // and call exit().remove() to remove old nodes

    return;
    
    // Shift the layout to make the clicked node the center
    simulation
      .force("x", d3.forceX().strength(0.1).x(width / 2))
      .force("y", d3.forceY().strength(0.1).y(height / 2))
      .force(
        "center",
        d3.forceCenter().x(width / 2).y(height / 2)
      )
      .alphaTarget(0.5) // Trigger the animation effect
      .restart(); // Restart the simulation
  
    // Reposition the nodes and links
    node
      .transition()
      .duration(500)
      .attr("transform", function (d) {
        return "translate(" + (d.x = d.initX) + "," + (d.y = d.initY) + ")";
      });
  
    link
      .transition()
      .duration(500)
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
  }
  
}
