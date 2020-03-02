# FirstRabbitMQApp
 
to run server: 
  * cd node
  * npm run dev


RABBIT MQ

server requires RabbitMQ to be running:
    * to start RabbitMQ: 
      * c:\Program Files\RabbitMQ Server\rabbitmq_server-3.8.2\sbin>net start rabbitmq

RabbitMQ Management Console:
  * http://localhost:15672/
  * username: guest
  * password: guest

Known issue - all exchanges get deleted out of the blue
  * to fix: 
    * run RabbitMQ command prompt as administrator (from start menu)
    * run this command: rabbitmqctl reset