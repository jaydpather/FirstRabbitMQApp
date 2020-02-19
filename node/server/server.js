var amqp = require('amqplib/callback_api');

const { Worker } = require('worker_threads')

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if(!pathname.endsWith(".js") && !pathname.includes("_next"))
    {
        console.log("RECEIVED REQUEST FOR: " + pathname);
        var response = await callRPC();
        console.log("received response: " + response);
    }

    handle(req, res, parsedUrl)
    
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

function initMessageLog(resolve){
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
                        response = msg.content.toString();
                        resolve(response);
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

function callRPC(request) {
    return new Promise(resolve => initMessageLog(resolve));
}