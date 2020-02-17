import Layout from '../components/MyLayout';

var amqp = require('amqplib/callback_api');


function initMessageLog(){
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue('', {
                exclusive: true
            }, function(error2, q) {
                if (error2) {
                    throw error2;
                }
                var correlationId = generateUuid();
                var num = 3

                console.log(' [x] Requesting fib(%d)', num);

                channel.consume(q.queue, function(msg) {
                    if (msg.properties.correlationId === correlationId) {
                        console.log(' [.] Got %s', msg.content.toString());
                        setTimeout(function() {
                            connection.close();
                            process.exit(0);
                        }, 500);
                    }
                }, {
                    noAck: true
                });

                channel.sendToQueue('rpc_queue',
                    Buffer.from("request"), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
            });
        });
    });
}

function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }

export default function Index(){
    initMessageLog();
    return (
        <Layout>
            <p>Hello Rabbit MQ</p>
        </Layout>
    );
}