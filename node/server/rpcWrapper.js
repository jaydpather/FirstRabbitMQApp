const { workerData, parentPort } = require('worker_threads')
var amqp = require('amqplib/callback_api');

function initMessageLog(){
    var response = null;
    amqp.connect('amqp://localhost', function(error0, connection) {
        
        if (error0) {
            throw error0;
        }
        console.log("connected");
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            console.log("channel created");
            channel.assertQueue('', {
                exclusive: false
            }, function(error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log("queue asserted");
                var correlationId = generateUuid();
                var num = 3
  
                console.log(' [x] Requesting fib(%d)', num);
  
                channel.consume(q.queue, function(msg) {
                    if (msg.properties.correlationId === correlationId) {
                        console.log(' [.] Got %s', msg.content.toString());
                        response = "response to: " + msg.content.toString();
                        parentPort.postMessage(response);
                    }
                }, {
                    noAck: true
                });
  
                channel.sendToQueue('rpc_queue',
                    Buffer.from("request"), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
                console.log("sent to queue");
            });
        });
    });
  }
  
  function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }

  initMessageLog();