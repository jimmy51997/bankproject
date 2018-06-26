To start the aws server for this node project, follow the following guidelines 

1) open git bash 
2)copy your ipv4 public id from the instance on AWS EC2 (https://ap-south-1.console.aws.amazon.com/ec2/v2/home?region=ap-south-1#Instances:sort=instanceState)
3)Go to the project directory in git bash using cd command
4)type  ssh -i "node.pem" ubuntu@1
5)type forever start --minUptime 604800000 app.js

Done. The node application is up and running. Use the link given in the same link to open the application. 