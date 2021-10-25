# Hexapinod

Hexagonal Architecture API Framework/Skeleton in TypeScript and using nodeJS with expressJS.

## Why this Framework/Skeleton ?

Since I used typescript in my nodejs projects, I didn't find good architectures skeletons or frameworks that suit my needs. I practiced a lot the **hexagonal architecture** in projects and I find it is a vey good architecture for code projects to works with small/medium sized team. The aim of this project is to help developers to start a new REST API project (GraphQL will come soon) and concentrate only on their business code.
All nodejs API project I made used expressJS which is pretty complete and simple, and all of them start with the same code. That's the reason why it includes a preconfigured initialization of expressJS. 
It use also the following projects for example (full list in package.json)
- [Express JS](https://expressjs.com/)
- [commander](https://github.com/tj/commander.js#readme)
- [Luxon](https://moment.github.io/luxon/#/)
- [Chalk](https://github.com/chalk/chalk)
- [AJV](https://ajv.js.org/) 
- [TypeORM](https://typeorm.io/#/) 

I aim to use a **KISS** (**Keep It Simple, Stupid**) strategy to build it, so I didn't take all the the names and the required interfaces from the hexagonal architecture which could be very complex (if you want to explore the complete hexagonal architecture, I recommend to read the following post: [DDD, Hexagonal, Onion, Clean, CQRS, ... How I put it all together](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/) from @hgraca).
I bring the hexagonal structure with the following folders:
```
src
+-- application : This contain the code of the adapters for your input part. In our case, we integrate the REST Api input, the CLI input and the test input. SocketIO and GraphQL will come later.
+-- infrastructure : This contain the code of your adapters for your infrastructure. Commonly, it contains repositories with the queries for your databases.
+-- core : this contain your business core. It is also called 'Domain' in literature.
+-- dependencies : This contain the dependencies libraries that could be used in the three previous part. It also contain the automatic loaders and the base class from the framework.
```

The 'core' folder will contain your bundles and theses bundles should follow the following structure:
```
src
+-- core
    +-- MyBundle
        +-- usecases : This contain the entry point of your bundles. It is the equivalent of controllers in classic MVC frameworks.
        +-- services : This contain the services for your bundles. The service contain the intelligent part of your bundle (your algorithms for example).
            +-- validator : This contain the AJV validators that you could use to validate JSON inputs
        +-- interfaces
            +-- repositories : This describe the interface to be used by your repositories into the infrastructure
            +-- models : This could describe the interface for your models accepted and returned by the usecases (optionnal part)
        +-- eventslisteners : Contain the event listeners
        +-- models : Contain the models classes that describe your data (for example, equivalent of an entity in Symfony PHP)
        +-- exceptions : Contain the exceptions.
```

### Comments
This project use currently TypeORM and also an internal ORM quite simple code to populate object with the result of a query.
I added a wrapper to call command line from typeOrm directly with the framework.


## Prerequisites

NodeJS v12 or above (it could also works on lower version of node, but we did not test it), and that's it.
The following commands are for linux debian, but it might work on Windows and MacOS too.

## Installation

I didn't make an installer yet, so you have to pull the project in a temporary folder.
```
mkdir /tmp/mytemporaryfolder
cd /tmp/mytemporaryfolder
git clone https://github.com/cecric/hexapinod.git
```

You can then extract into your project folder (replace of course /my/project/folder by your destination for the project) :
```
mkdir /my/project/folder
cd ./hexapinod
git archive --format=tar.gz v1.0.2 > hexapinod-1.0.2.tar.gz
tar -xzf ./hexapinod-1.0.2.tar.gz -C /my/project/folder
rm -rf /tmp/mytemporaryfolder
cd /my/project/folder
```

Then you only have to install the package. The package.json is already made with the needed packages inside.
```
npm install
```

## Usage

While you developp, you can launch the server in debug mod with the following command :
```
npm run serve
```
Or
```
npm run test
```

If you want to launch the test :
```
npm run test
```
  
If you want to launch the server in build mode, you have to compile first and the launch it with node :
```
npm run build
node dist/bundle.js server
```

You can launch other command line that you defined by using other parameters in your call, for example :
```
node dist/bundle.js test
```

### ORM specifics
#### TypeORM
To perform ORM manipulation (in our case TypeORM), you can use the command line. To adapt to our specific directory structure, we wrapped the TypeORM CLI commands into a command line from the executable, like that :
```
npm run cli typeorm 
```

Or if you have already compiled the project :
```
node dist/bundle.js typeorm <typeorm-command>...
```

Before starting anything with the ORM, you have to update the configurations with your needs into the folder:
```
config/dependencies/typeorm.json
```

#### Our native ORM
The native ORM I included into this framework is not a real ORM, but it will helps you if you don't want to use an ORM for any reason in your project (that's up to you), but still make requests to your database. 
It only support mariadb/mysql databases at this time (PostgreSQL will come soon) and before start anything you have to update the configurations with your needs into the folder:
```
config/dependencies/mysql-manager.json
```

# Contributing
Feel free to use it in your projects and to fix some issues you can find by submiting a pull requests. Please let me know if you have any suggestions to improve this framework structure or some features you want/need!
And if you want [to buy me a coffee](https://www.buymeacoffee.com/cecric), I will be the most happy developper in the world.

# Roadmap and upcoming releases
Here you will find a list of the next features to include into the project and the upcoming development:
- Add GraphQL requests
- Add postgreSQL support on native ORM.
- Add right management on serialization of models.
- Add nosql (mongodb, redis and elasticsearch) support on native ORM.

## Upcoming release
- v1.0.3 - Release: 
  - Add API documentation system ([OpenAPI](https://www.openapis.org/) and [APIDocJS](https://apidocjs.com/))
  - Add Socket.IO full support
  - Add documentation to use it with [pm2](https://pm2.keymetrics.io/)

## Releases
- v1.0.2 - Pre-release: 
  - Add of TypeORM support and improvement of directory structure and documentation.
  - Add comments on published code (JSDoc/Tsdoc)
- v1.0.1 - Pre-release: fix a small issue on the first commit.
- v1.0.0 - Pre-release: first release, includes the hexagonal architecture.


# License 
This project is licensed under the MIT license.
