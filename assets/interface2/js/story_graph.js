
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
var data_json = d3.json(dataToLoad, function(error, graph) {
    if(error) console.log("ERROR OCCUR: "+JSON.stringify(error, null, 2))
    graph_json = graph;
    updateGraphs(graph.nodes, graph.links);

})

function updateGraphs(nodesArr, linksArr, centerNodeId = 0) {
    
    // filter out the elements whose source is not 0
    var links = linksArr.filter(function(link) {
        return link.source == centerNodeId;
    });

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

    // Calculate the center of the SVG
    var cx = width / 2;
    var cy = height / 2;

    // Calculate the radius for the nodes, it should be less than half of the SVG's width or height
    var radius = Math.min(width, height) / 2.3; // div 2.5

    nodes = nodes.map((d, i) => {
        var x_val, y_val;
        /** @todo randomly displace x vals to get that graphy effect*/

        if(d.id == centerNodeId) { // check if it is the first node
            x_val = (cx - cardWidth / 2);
            y_val =  (cy - cardHeight / 1.5);
        } else {
            var angle = (2 * Math.PI * (i - 1)) / (nodes.length - 1); // calculate the angle for this node
            x_val =  (cx + radius * Math.cos(angle) - cardWidth / 1.8);
            y_val =  (cy + radius * Math.sin(angle) - cardHeight / 1.7);  // div 1.9
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
                        .attr("x", (cx - cardWidth/2) + "px")
                        .attr("y", (cy - cardHeight/1.5) + "px")
                        // .on("click", clickNode)
                        // .call(d3.drag()
                        //     .on("drag", drag))
                            .html( function(d) {
                                if(d.tag == "twitter") {
                                    return `
                                    <div class="card card_design" id="twitter_card">
                                        <!--div class="row">
                                            <span class="dot" style="background-color: ${d.sentColorCode}"></span>
                                        </div-->
                                        <a href="${d.link}" target="_blank" data-goal="${d.goal}">
                                            <div class="row valign-center" style="margin: 0px;">
                                                <div class="col s3">
                                                    <img src="../assets/interface2/icons/twitter.png" alt="" class="circle responsive-img" style="width: 40px; height: 40px;">
                                                </div>
                                                <div class="col s9">
                                                    <p class="title" style="margin: 0px;"><b>${d.title}</b></p>
                                                    <small style=" color: #a7a7a7">${d.subtitle}</small>
                                                </div>
                                            </div>
                                        </a>
                                        <div class="row">
                                            <div class="col s12">
                                                <p class="twitter_content minimize" textLength="50">${d.body}</p>
                                            </div>
                                            <div class="col s9">
                                                <p class="posted_at"><small><b>Posted At: </b>${d.date ? d.date : "19 Apr 2022"}</small></p>
                                            </div>
                                            <div class="col sm">
                                                <button class="icon-button" title="Expand Related Results" onClick="clickNode(${d.id})">
                                                    <img src="../assets/interface2/icons/both-3.png" alt="expand" class="icon-button static" style="width: 34px; height: 34px;" >
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                `} 
                                else if(d.tag == "article") {
                                    return `
                                    <div class="card card_design" id="twitter_card">
                                        <a href="${d.link}" target="_blank" data-goal="${d.goal}">
                                            <div class="row valign-center" style="margin: 0px;">
                                                <div class="col s3">
                                                    <img src="../assets/interface2/icons/news_icon.png" alt="" class="circle responsive-img" style="width: 40px; height: 40px;">
                                                </div>
                                                <div class="col s9">
                                                    <p class="title" style="margin: 0px;"><b>${d.title}</b></p>
                                                    <small style=" color: #a7a7a7">${d.subtitle}</small>
                                                </div>
                                            </div>
                                        </a>
                                        <div class="row">
                                            <div class="col s12">
                                                <p class="twitter_content minimize" textLength="50">${d.body}</p>
                                            </div>
                                            <div class="col s9">
                                                <p class="posted_at"><small><b>Posted At: </b>${d.date}</small></p>
                                            </div>
                                            <div class="col sm">
                                                <button class="icon-button" title="Expand Related Results" onClick="clickNode(${d.id})">
                                                    <img src="../assets/interface2/icons/both-3.png" alt="expand" class="icon-button static" style="width: 34px; height: 34px;" >
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `}
                                else if(d.tag == "youtube"){
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
                                                <p text-length="50"> ${d.body} </p>
                                            </div>
                                            <button class="icon-button" title="Expand Related Results" onClick="clickNode(${d.id})">
                                                <img src="../assets/interface2/icons/both-3.png" alt="expand" class="icon-button static" style="width: 30px; height: 30px;" >
                                            </button>
                                        </div>
                                `}
                            })
                    .style("opacity", 0.5)
                    .transition()
                    .duration(700)
                    .style("opacity", 1)
                    .ease(d3.easeCircleOut)
                    .attr("x", d => d.x + "px")
                    .attr("y", d => d.y + "px");
        
    
    // var simulation = d3.forceSimulation(nodes);
    // simulation
        // .force('center', d3.forceCenter((cx - cardWidth / 2), (cy - cardHeight / 1.5)))
        // .force("links", d3.forceLink(links).id(d => d.id));

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
            .attr("x2", d => d.source.x + cardWidth / 2.3)
            .attr("y2", d => d.source.y + cardHeight / 4)
            // .style("opacity", 0) 
            .transition()
            .duration(600)
            // .style("opacity", 1)
            .attr("x2", d => d.target.x + cardWidth / 2.5)
            .attr("y2", d => d.target.y + cardHeight / 4);

        attachListenerToAnchors();

        }


    // Define the clickNode function
    function clickNode(clickedNodeId) {
        console.log("\n CLikced node: " + clickedNodeId);
        clickCount++;
        sessionStorage.setItem("clickCounter", clickCount);
        
        updateGraphs(graph_json.nodes, graph_json.links, clickedNodeId);
    }


    function attachListenerToAnchors() {
        const anchors = document.getElementsByTagName('a');
        
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].addEventListener('click', function(event) {
                const isGoal = event.currentTarget.getAttribute("data-goal") == 'true';
                event.preventDefault();
                clickCount++;
                sessionStorage.setItem(taskname.slice(-2)+"_clickCounter", clickCount);


                // console.log("click count", isGoal, event.currentTarget);

                if (isGoal == true) {
                    const timeTaken = Date.now() - sessionStorage.getItem(taskname.slice(-2)+"_timestart");

                    const data = {
                        name: taskname,
                        clickCount: clickCount,
                        timeTaken: timeTaken/1000
                    };
    
                    fetch('/save-results', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                    alert('Task Complete. Please click OK and close the tab.');
                    
                    sessionStorage.removeItem(taskname.slice(-2)+"_clickCounter");
                    sessionStorage.removeItem(taskname.slice(-2)+"_timestart");
                    clickCount  = 0;
                    sessionStorage.setItem(taskname.slice(-2)+"_timestart", Date.now());
                }
            });
        }
    }
