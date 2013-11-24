
/// TESTS
jQuery(document).ready(function ()
{
    var pr1 = new eventNode();
    var pr2 = new eventNode();
    var pr3 = new eventNode();
    var pr4 = new eventNode();
    
    function getLogger(message)
    {
        var msg = message;
        return function()
        {
            console.log(msg);
        };
    };

    pr1.addEvent("test1");
    pr1.addEvent("test2");
    pr1.addEvent("test3");
    pr1.addEvent("test4");
    
    pr1.addEventListener("test1", getLogger("pr1 test1"));
    pr1.addEventListener("test2", getLogger("pr1 test2"));
    pr1.addEventListener("test3", getLogger("pr1 test3"));
    pr1.addEventListener("test4", getLogger("pr1 test4"));

    pr2.addEvent("test2");
    pr2.addEvent("test3");
    pr2.addEvent("test4");
    
    pr2.addEventListener("test2", getLogger("pr2 test2"));
    pr2.addEventListener("test3", getLogger("pr2 test3"));
    pr2.addEventListener("test4", getLogger("pr2 test4"));

    pr3.addEvent("test3");
    pr3.addEvent("test4");
    
    pr3.addEventListener("test3", getLogger("pr3 test3"));
    pr3.addEventListener("test4", getLogger("pr3 test4"));
    
    pr4.addEvent("test1");
    pr4.addEvent("test4");
    pr4.addEvent("test8");

    pr4.addEventListener("test1", getLogger("pr4 test1"));
    pr4.addEventListener("test4", getLogger("pr4 test4"));
    pr4.addEventListener("test8", getLogger("pr4 test8"));

  console.log("Non-connected node tests:");
    pr1.triggerEvent("test1");
    pr2.triggerEvent("test2");
    pr3.triggerEvent("test3");
    pr4.triggerEvent("test4");

    pr1.connectNode(pr2);
    pr2.connectNode(pr3);
    pr3.connectNode(pr4);
    // After this point, all nodes are effectively connected and the events below should 
    // propagate between the nodes.
  	console.log("Connnected node tests:");
    pr1.triggerEvent("test1");
    pr2.triggerEvent("test2");
    pr3.triggerEvent("test3");
    pr4.triggerEvent("test4");
    
    // But just to be sure that we don't have any strange behavior, let's run the tests with all nodes connected to eachother.
    pr1.connectNode(pr2);
    pr1.connectNode(pr3);
    pr1.connectNode(pr4);
    
    pr2.connectNode(pr1);
    pr2.connectNode(pr3);
    pr2.connectNode(pr4);
    
    pr3.connectNode(pr1);
    pr3.connectNode(pr2);
    pr3.connectNode(pr4);
    
    pr4.connectNode(pr1);
    pr4.connectNode(pr2);
    pr4.connectNode(pr3);
    
    console.log("Completely connnected node tests:");
    pr1.triggerEvent("test1");
    pr2.triggerEvent("test2");
    pr3.triggerEvent("test3");
    pr4.triggerEvent("test4");

  	console.log("Network should now contain four nodes.");
 
  	console.log("Nodes in network from pr1:"+pr1.getNetworkNodes().length)
  	console.log("Nodes in network from pr2:"+pr2.getNetworkNodes().length)
  	console.log("Creating a more complex network and connecting it...");

  	var a1 = new eventNode();
  	var a2 = new eventNode();
  	var a3 = new eventNode();
  	var a4 = new eventNode();
  	var a5 = new eventNode();
  	var a6 = new eventNode();
  	var a7 = new eventNode();
  	var a8 = new eventNode();
  	var a9 = new eventNode();

  	console.log("Network should now contain nine nodes.");

  	a1.connectNode(a2);
  	a2.connectNode(a3);
  	a3.connectNode(a9);
  	a9.connectNode(a8);
  	a8.connectNode(a7);
  	a7.connectNode(a6);
  	a6.connectNode(a4);
  	a4.connectNode(a5);

  	console.log("Nodes in network from a1: "+ a1.getNetworkNodes().length);
  	console.log("Nodes in network from a5: "+ a5.getNetworkNodes().length);
  	console.log("Nodes in network from a9: "+ a9.getNetworkNodes().length);

  	console.log("Network node identifiers:\n"+ a9.getNetworkIdentifiers().join(",\n"));  

  	console.log("Adding events FringeTester to nodes a1 and a4...");
  	console.log("Adding events ThreeTester to nodes a1, a6 and a9...");

  	a1.addEvent("FringeTester");
  	a4.addEvent("FringeTester");

  	a6.addEvent("ThreeTester");
  	a1.addEvent("ThreeTester");
  	a9.addEvent("ThreeTester");

  	console.log("Does a1 have the event FringeTester? " + a1.hasEvent("FringeTester"));
  	console.log("Does a2 have the event FringeTester? " + a2.hasEvent("FringeTester"));
  	console.log("Does a3 have the event FringeTester? " + a3.hasEvent("FringeTester"));
  	console.log("Does a4 have the event FringeTester? " + a4.hasEvent("FringeTester"));
  	console.log("Does a5 have the event FringeTester? " + a5.hasEvent("FringeTester"));

  	console.log("Does the network connected to a2 have the event FringeTester? " + 
  		a2.networkHasEvent("FringeTester"));
  	console.log("Does the network connected to a3 have the event FringeTester? " + 
  		a3.networkHasEvent("FringeTester"));
  	console.log("Does the network connected to a4 have the event FringeTester? " + 
  		a4.networkHasEvent("FringeTester"));

  	console.log("Does a1 have the event ThreeTester? " + a1.hasEvent("ThreeTester"));
  	console.log("Does a2 have the event ThreeTester? " + a2.hasEvent("ThreeTester"));
  	console.log("Does a5 have the event ThreeTester? " + a5.hasEvent("ThreeTester"));
  	console.log("Does a6 have the event ThreeTester? " + a6.hasEvent("ThreeTester"));
  	console.log("Does a8 have the event ThreeTester? " + a8.hasEvent("ThreeTester"));
  	console.log("Does a9 have the event ThreeTester? " + a9.hasEvent("ThreeTester"));


  	console.log("Does the network connected to a2 have the event ThreeTester? " + 
  		a2.networkHasEvent("ThreeTester"));
  	console.log("Does the network connected to a3 have the event ThreeTester? " + 
  		a3.networkHasEvent("ThreeTester"));
  	console.log("Does the network connected to a8 have the event ThreeTester? " + 
  		a8.networkHasEvent("ThreeTester")); 	

  	console.log("Does the network connected to a8 have the event DoesNotExist? " + 
  		a8.networkHasEvent("DoesNotExist"));
  	console.log("Does the network connected to a2 have the event DoesNotExist? " + 
  		a2.networkHasEvent("DoesNotExist"));

  	console.log("And now, let's connect the aX network to the prX network!");

  	a1.connectNode(pr1);

  	console.log("Does the network connected to a1 have the event test1? " + 
  		a1.networkHasEvent("test1"));
  	console.log("Does the network connected to a9 have the event test1? " + 
  		a9.networkHasEvent("test1"));
  	console.log("Does the network connected to pr3 have the event ThreeTester? " + 
  		pr3.networkHasEvent("ThreeTester"));

  	console.log("And let's disconnect the two networks, and rerun.");
  	pr1.disconnectNode(a1);

  	console.log("Does the network connected to a1 have the event test1? " + 
  		a1.networkHasEvent("test1"));
  	console.log("Does the network connected to a9 have the event test1? " + 
  		a9.networkHasEvent("test1"));
  	console.log("Does the network connected to pr3 have the event ThreeTester? " + 
  		pr3.networkHasEvent("ThreeTester"));

  	console.log("Now let's separate the aX network into two networks by splitting at a9, and adding an event to either.")
  	a9.disconnectNode(a8);

  	a9.addEvent("FirstNetwork");
  	a8.addEvent("SecondNetwork");

  	console.log("Does the network connected to a9 have the event FirstNetwork? " + 
  		a9.networkHasEvent("FirstNetwork"));
  	console.log("Does the network connected to a9 have the event SecondNetwork? " + 
  		a9.networkHasEvent("SecondNetwork"));
  	console.log("Does the network connected to a8 have the event FirstNetwork? " + 
  		a8.networkHasEvent("FirstNetwork"));	
  	console.log("Does the network connected to a8 have the event SecondNetwork? " + 
  		a8.networkHasEvent("SecondNetwork"));

  	console.log("Reconnecting networks via nodes a4 and a3 and rerunning tests.")
  	a4.connectNode(a3);

  	console.log("Does the network connected to a9 have the event FirstNetwork? " + 
  		a9.networkHasEvent("FirstNetwork"));
  	console.log("Does the network connected to a9 have the event SecondNetwork? " + 
  		a9.networkHasEvent("SecondNetwork"));
  	console.log("Does the network connected to a8 have the event FirstNetwork? " + 
  		a8.networkHasEvent("FirstNetwork"));	
  	console.log("Does the network connected to a8 have the event SecondNetwork? " + 
  		a8.networkHasEvent("SecondNetwork"));
});