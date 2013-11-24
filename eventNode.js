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
           .toString(16).substring(1);
    };
    function getGuid()
    {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
    };
    function getNodeIndex(node)
    {
        var id = node.getIdentifier();
        for (var i = 0; i < nodes.length; i++)
        {
            if (nodes[i].getIdentifier() === id)
                return i;
        }
    };
    function createUniqueArray(array) 
    {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) 
        {
            for(var j=i+1; j<a.length; ++j) 
            {
                if(a[i].getIdentifier() === a[j].getIdentifier())
                    a.splice(j--, 1);
            }
        }
        return a;
    };

    // Public functions
    this.getNetworkNodes = function(scouredNodes)
    {
        // retrieves all nodes in the network.
        var scoured = scouredNodes || [];
        for (var i = scoured.length - 1; i >= 0; i--) 
        {
            var node = scoured[i]
            if(node.getIdentifier() === this.getIdentifier())
                return scoured;
        };

        scoured.push(this);        
        if(nodes.length)
        {
            for (var j = 0; j < nodes.length; j++)
            {
                var node = nodes[j];
                var otherIdentifiers = node.getNetworkNodes(scoured);
                if(otherIdentifiers && otherIdentifiers.length)
                    scoured = createUniqueArray(otherIdentifiers.concat(scoured));
            }
        }
        return scoured;
    };    
    this.getNetworkIdentifiers = function()
    {
        var networkNodes = this.getNetworkNodes();
        var identifiers = [];
        for (var i = networkNodes.length - 1; i >= 0; i--) 
        {
            identifiers.push(networkNodes[i].getIdentifier())
        };
        return identifiers;
    }
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
    this.networkHasEvent = function(eventName)
    {
        var nodesInNetwork = this.getNetworkNodes();
        for (var i = nodesInNetwork.length - 1; i >= 0; i--) {
            var node = nodesInNetwork[i];
            if(node.hasEvent(eventName))
                return true;
        };
        return false;
    };
    this.hasEventListener = function(eventName, eventListener)
    {
        return this.hasEvent(eventName)
            && isFunction(eventListener)
            && listeners[eventName].indexOf(eventListener) !== -1;
    };
    this.networkHasEventListener = function(eventName, eventListener)
    {
        var nodesInNetwork = this.getNetworkNodes();
        for (var i = nodesInNetwork.length - 1; i >= 0; i--) {
            var node = nodesInNetwork[i];
            if(node.hasEventListener(eventName, eventListener))
                return true;
        };
        return false;
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
        if (this.networkHasEvent(eventName) && isFunction(eventListener))
        {
            if(!this.hasEvent(eventName))
                this.addEvent(eventName);
            // As it is now, each node needs to contain an event to be able to provide listening options for it.            
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
        if (this.hasNode(node) || node.getIdentifier() == this.getIdentifier())
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
};


function eventNetwork()
{
    // an eventNetwork is a set of eventNodes. Its purpose is to remove the need for the user to
    // track and maintain the connections between nodes. You could also call it an eventpool.
    // Whether this is needed/desired is not yet determined.

    // Private variables
    networks = [];
    nodes = [];
    // Private functions
    function networkContainsNode(node)
    {

    }
    // Public variables

    // Public functions
    this.addNode = function(node)
    {

    };
    this.removeNode = function(node)
    {

    };
    this.connectToNetwork = function(network)
    {

    };
    this.disconnectNetwork = function(network)
    {

    };
}
