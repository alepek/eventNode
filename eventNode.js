/*
* An event node that can be connected to other instances of itself. 
* When an event is triggered the event will propagate over the connected network of event nodes.
* Each node only triggers once, and when it does it notifies all connected nodes.
* Since all nodes have a two-way connection they will notify whoever notified them, but no extra action is taken on any subsequent notifictaions.
*/

function eventNode()
{
    // Private variables
    var events = [];
    var listeners = {};
    var triggers = [];
    var nodes = [];
    var myUniqueIdentifier = getGuid();
    
    // Private functions
    function isFunction(functionToCheck)
    {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };
    function s4()
    {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    };
    function getGuid()
    {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };
    function getNodeIndex(node)
    {
        for (var i = 0; i < nodes.length; i++)
        {
            if (nodes[i].getIdentifier() == id)
                return i;
        }
    };

    // Public functions
    this.getIdentifier = function()
    {
        return myUniqueIdentifier;
    };
    this.hasEvent = function(eventName)
    {
        if (eventName && events.indexOf(eventName) !== -1 && listeners[eventName])
            return true;
        return false;
    };
    this.hasEventListener = function(eventName, eventListener)
    {
        return this.hasEvent(eventName)
            && isFunction(eventListener)
            && listeners[eventName].indexOf(eventListener) !== -1;
    };
    this.hasNode = function(node)
    {
        var id = node.getIdentifier();
        for (var i = 0; i < nodes.length; i++)
        {
            if (nodes[i].getIdentifier() == id)
                return true;
        }
        return false;
    };
    
    this.addEvent = function(eventName)
    {
        if (!this.hasEvent(eventName))
        {
            events.push(eventName);
            listeners[eventName] = [];
            return true;
        }
        return false;
    };
    this.addEventListener = function(eventName, eventListener)
    {
        if (this.hasEvent(eventName) && isFunction(eventListener))
        {
            listeners[eventName].push(eventListener);
            return true;
        }
        return false;
    };
    this.removeEventListener = function(eventName, eventListener)
    {
        if (this.hasEventListener(eventListener))
        {
            return listeners.splice(listeners[eventName].indexOf(eventListener), 1);
        }
        return false;
    };

    this.connectNode = function(node)
    {
        if (this.hasNode(node))
            return false;
        nodes.push(node);
        node.connectNode(this);
        return true;
    };
    this.disconnectNode = function(node)
    {
        if (this.hasNode(node))
        {
            nodes.splice(getNodeIndex(node), 1);
            node.disconnectNode(this);
            return true;
        }
        return false;
    };

    this.triggerEvent = function(eventName, triggeredNodes)
    {
        var triggered = triggeredNodes || [];
        if (triggered.indexOf(myUniqueIdentifier) !== -1)
            return; // we've already triggered!
        triggered.push(myUniqueIdentifier);
        
        // trigger local listeners
        if (this.hasEvent(eventName))
        {
            var targets = listeners[eventName];
            for (var i = 0; i < targets.length; i++)
            {
                try
                { targets[i]();}
                catch(error)
                {}
            }
        }
        // trigger remote listeners
        if(nodes.length)
        {
            for (var j = 0; j < nodes.length; j++)
            {
                var node = nodes[j];
                node.triggerEvent(eventName, triggered);
            }
        }
    };
}

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

    pr3.addEventListener("test1", getLogger("pr4 test1"));
    pr3.addEventListener("test4", getLogger("pr4 test4"));
    pr3.addEventListener("test8", getLogger("pr4 test8"));

    pr1.triggerEvent("test1");
    pr2.triggerEvent("test2");
    pr3.triggerEvent("test3");
    pr4.triggerEvent("test4");

    pr1.connectNode(pr2);
    pr1.connectNode(pr3);
    pr1.connectNode(pr4);
    // After this point, all nodes are effectively connected and the events below should 
    // propagate between the nodes.

    pr1.triggerEvent("test1");
    pr2.triggerEvent("test2");
    pr3.triggerEvent("test3");
    pr4.triggerEvent("test4");
});