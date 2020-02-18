var amqp = require('amqplib/callback_api');

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    console.log("RECEIVED REQUEST FOR: " + pathname);
    if(!pathname.endsWith(".js") && !pathname.includes("_next"))
        initMessageLog();

    handle(req, res, parsedUrl)
    console.log("returning from server");
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

function consumeCallBack(msg) {
    if (msg.properties.correlationId === correlationId) {
        console.log(' [.] Got %s', msg.content.toString());
        response = msg.content.toString();
    }
}

function assertQueueCallBack(error2, q) {
    if (error2) {
        throw error2;
    }
    console.log("queue asserted");
    var correlationId = generateUuid();
    var num = 3

    console.log(' [x] Requesting fib(%d)', num);

    channel.consume(q.queue, consumeCallBack, {
        noAck: true
    });

    channel.sendToQueue('rpc_queue',
        Buffer.from("request"), {
            correlationId: correlationId,
            replyTo: q.queue
        });
    console.log("sent to queue");
}

function createChannelCallBack(error1, channel) {
    if (error1) {
        throw error1;
    }
    console.log("channel created");
    channel.assertQueue('', {
        exclusive: false,
        //durable: true, //todo: how to change to false?
    }, assertQueueCallBack);
}
function connectCallBack(error0, connection) {
      
    if (error0) {
        throw error0;
    }
    console.log("connected");
    connection.createChannel(createChannelCallBack);
}

function initMessageLog(){
    amqp.connect('amqp://localhost', connectCallBack);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}
