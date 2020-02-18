# FirstRabbitMQApp
 
to run server: 
  * cd node
  * npm run dev
 
server depends on fable project:
  * to compile:
    * cd fable
	* cd cd server
	* npm run-script build
	  * see webpack.config to find target JS file

server requires RabbitMQ to be running:
    * to start RabbitMQ: 
      * c:\Program Files\RabbitMQ Server\rabbitmq_server-3.8.2\sbin>net start rabbitmq

RabbitMQ Management Console:
  * http://localhost:15672/
  * admin
  * rabbitmq