
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
        }
    }

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
 
  
});