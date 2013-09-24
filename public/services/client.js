var client = angular.module('Client',['ui.bootstrap']); 

client.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/protokoll',
        {templateUrl: 'partials/protokoll', controller: ProtokollCtrl});

    $routeProvider.otherwise({redirectTo: '/index'});

    }
]);

client.factory('socket', function ($rootScope) {
    
    var socket  = io.connect();
    var log     = []; 
    console.log("client connected vio socket");
    console.log(socket);

        
    return {
        
        register : function(command,callback) {
            log.push({ date : new Date(), command : "REGISTER", data : command} )
            socket.on(command,callback); 
        },
        
        getLog : function() { return log; },
        getSocketEvents : function() { return socket.$events; },
       
        once: function (eventName, callback) {
            log.push({ date : new Date(), command : "once:" + eventName} )
            socket.once(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
      
        on: function (eventName, callback) {
            
            log.push({ date : new Date(), command : "on:" + eventName} )
            socket.on(eventName, function () {
                var args = arguments;
                
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            log.push({ date : new Date(), command : "emit:" + eventName, data : data} );
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

client.service("io",function(socket) {
    
    
    
    this.once = function(event,data,callback)
    { 
        socket.emit(event,data); 
        socket.once(event,callback); 
    }
    
    this.register = function(event,callback)
    {  socket.on(event,callback);  }
    
    this.emit = function(event,data){ socket.emit(event,data); }
    
    
})
