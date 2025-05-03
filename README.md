# Welcome!

# Project overview

A realtime order and delivery system built with modern technologies, enabling seamless order tracking, status updates, and delivery coordination between customers, vendors, and delivery personnel using WebSockets.

## System Architecture

![image](https://res.cloudinary.com/dmbkzc6yo/image/upload/v1746264956/zoxcf2ulxxmuenbwo9by.svg)

## Stack used

- **Frontend**: React.js, TailwindCSS, AntD
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB 
- **DevOps**: Docker, Docker Compose, Nginx, AWS EC2
- **Others**: WebSockets, JWT, REST API

## Folder Structure
```
root/
├── backend/                 # Node.js backend
│   ├── deployment/          # Docker, Nginx, deployment configs
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schema/
│   │   ├── seed/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validators/
│   ├── .env
│   ├── Makefile
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/                # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── ui/
│   │   │   └── views/
│   │   ├── context/
│   │   ├── helpers/
│   │   ├── pages/
│   │   ├── routers/
│   │   └── utils/
│   ├── .env
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── package.json
│   └── README.md
└── README.md                # Project overview
```
## Setup instructions

 `` git clone https://github.com/tikamchand/realtime-order-and-delivery-system.git``
 
 ** Start application **
 
 ``cd realtime-order-and-delivery-system/backend``
 
 **Frontend**
 ``cd frontend``
 
 ``npm install``
 
 ``npm run dev``
 
 
  ***OR***
  
  ``docker build -t frontend-app .``
    
**Backend**
``cd backend``

``npm install``

``make start (This will start the container for DB,backend & frontend)``


>Frontend(if run through docker) : http://localhost:3000

>Backend : http://localhost:8080

>Mongo-express : http://localhost:8081


## Hosting & Deployment

-   Provision an Ubuntu EC2 instance.
    
-   Install Docker and Docker Compose.
    
-   Clone the repository and update `.env`.
    
-   Run `docker-compose up --build -d`.
       
-   Set up **Nginx reverse proxy**  for backend api and mongo-express.
    


# WebSocket Flow Explanation


-   Client connects via Socket.IO to the backend.
    
-   Each user joins a room based on their user ID.
    
-   Events:
    
    -   `accept_order` → when delivery partner accepts order
        
    -   `order_status_updated` → notify user
                
-   Disconnect logic handles cleanup and reconnection.
## Scaling plan

- How you would add Redis for socket scaling 
> Integrate Redis with `socket.io-redis` adapter
- Horizontal scaling using Load Balancer
> 1. Deploy multiple backend instances.
 > 2. Place them behind an **AWS Application Load Balancer** or **NGINX Load Balancer**.    
> 3. Sticky sessions can be used or handled via Redis pub/sub.
