
var d3Div = document.getElementById("aaa");
var width = d3Div.offsetWidth;
var height = d3Div.offsetHeight + 100;

var cardWidth = 350;
var cardHeight = 300;

var currentNode = 0;

var graph_json;

var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

var nodes = []
var data_json = d3.json("/assets/interface2/js/graph.json", function(error, graph) {
    if(error) console.log("ERROR OCCUR: "+JSON.stringify(error, null, 2))
    graph_json = graph;
    updateGraphs(graph.nodes, graph.links);

})

function updateGraphs(nodesArr, linksArr, centerNodeId = 3) {
    
    console.log("old links: ", links);
    
    // filter out the elements whose source is not 0
    var links = linksArr.filter(function(link) {
        return link.source == centerNodeId;
    });

    console.log("new links: ", links);
    
    // # Code kept incase link selection logic needed
    /*for( var i=1; i<nodes.length;i++) {
    //    links.push( { "source": 0, "target": i } )
        if(nodes[i].id) {
            nodes[i].remove();
        }
    }*/

    
    

    nodes = links.map(function(link) {
        return nodesArr.find(function(node) {
            return node.id === link.target;
        });
    });


    // The actual center node since we only fecthed thae targets
    nodes.push(nodesArr.find(e => e.id == centerNodeId))

    console.log(nodes);

    // Calculate the center of the SVG
    var cx = width / 2;
    var cy = height / 2;

    // Calculate the radius for the nodes, it should be less than half of the SVG's width or height
    var radius = Math.min(width, height) / 2.5;

    nodes = nodes.map((d, i) => {
        var x_val, y_val;
        /** @todo randomly displace x vals to get that graphy effect*/

        if(d.id == centerNodeId) { // check if it is the first node
            x_val = (cx - cardWidth / 2);
            y_val =  (cy - cardHeight / 1.5);
        } else {
            var angle = (2 * Math.PI * (i - 1)) / (nodes.length - 1); // calculate the angle for this node
            x_val =  (cx + radius * Math.cos(angle) - cardWidth / 2);
            y_val =  (cy + radius * Math.sin(angle) - cardHeight / 1.9);
        }
        
        return {
            ...d,
            x: Math.abs(x_val),
            y: Math.abs(y_val)
        };
    });

    // # code for assigning nodes to links without force()
    links = links.map(link => {
        return {
            ...link,
            source: nodes.find(node => node.id === link.source),
            target: nodes.find(node => node.id === link.target)
        };
    });


    // remove all old nodes
    svg.selectAll("foreignObject").remove();

    // append new ones
    var nodeSelection = svg
                    .selectAll("foreignObject")
                    .data(nodes)
                    .enter()
                    .append("foreignObject")
                        .attr("width", cardWidth+"px")
                        .attr("height", cardHeight+"px")
                        .attr("x", d => d.x + "px")
                        .attr("y", d => d.y + "px")
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
        

   
    
    // var simulation = d3.forceSimulation(nodes);
    // simulation
        // .force('center', d3.forceCenter((cx - cardWidth / 2), (cy - cardHeight / 1.5)))
        // .force("links", d3.forceLink(links).id(d => d.id));
        /*
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
            //     .attr("x1", function (d) {
            //             console.log('link for node: '+d.id, d.source.x, d.source.y, d.target.x, d.target.y);
            //             return d.source.x + cardWidth / 2;
            //         })
            //     .attr("y1", d => d.source.y/2 + cardHeight/2)
            //     .attr("x2", d => d.target.x + cardWidth/2)
            //     .attr("y2", d => d.target.y + cardHeight/2);

            // nodeSelection.attr('style', d => `left:${d.x}px;top:${d.y}px`);


            linkSelection
                .attr("x1", d => d.source.x + cardWidth/2)
                .attr("y1", d => d.source.y + cardHeight/2)
                .attr("x2", d => d.target.x + cardWidth/2)
                .attr("y2", d => d.target.y + cardHeight/2); 
        });
        // .force('collide',d3.forceCollide().radius(60).iterations(2));
        */

        // remove all old links
        svg.selectAll("line").remove();
        
        let linkSelection = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .lower()
            .attr("class","d3-graph-links")
            .attr("stroke", "silver")
            .attr("stroke-width", 2)
            .attr("x1", d => d.source.x + cardWidth / 2.3)
            .attr("y1", d => d.source.y + cardHeight / 4)
            .attr("x2", d => d.target.x + cardWidth / 2.5)
            .attr("y2", d => d.target.y + cardHeight / 4);
  
}


    // Define the clickNode function
    function clickNode(d) {
        console.log("\n CLikced node: "+d.id);
        
        // Extract the clicked node's ID
        var clickedNodeId = d.id;
    
        // clear canvas
        // var svg = d3.select("svg")
    
    
        // make some global var that has the json for nodes
        // follow similar code structure as updateGraph and make another function for creating graph
        
        // first update new nodes and fetch childs put them in data
        // and call exit().remove() to remove old nodes
    
        
        // Shift the layout to make the clicked node the center
        // simulation
        //   .force("x", d3.forceX().strength(0.1).x(width / 2))
        //   .force("y", d3.forceY().strength(0.1).y(height / 2))
        //   .force(
        //     "center",
        //     d3.forceCenter().x(width / 2).y(height / 2)
        //   )
        //   .alphaTarget(0.5) // Trigger the animation effect
        //   .restart(); // Restart the simulation
      
        // Reposition the nodes and links
        // nodeSelection
        //   .transition()
        //   .duration(500)
        //   .attr("transform", function (d) {
        //     return "translate(" + (d.x = d.initX) + "," + (d.y = d.initY) + ")";
        //   });

        console.log("fulldata:", graph_json);
        updateGraphs(graph_json.nodes, graph_json.links, clickedNodeId);
      }

