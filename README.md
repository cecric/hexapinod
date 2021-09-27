# Hexapinod

Hexagonal Architecture API Framework/Skeleton in TypeScript and using nodeJS with expressJS.

## Why this Framework/Skeleton ?

Since I use typescript in my nodejs projects, I didn't find good architectures skeletons or frameworks that suit my needs. I practiced a lot the hexagonal architecture in projects and I think it is a vey good architecture for code projects to works with small/medium team. The aim of this project is to help developers to start a new REST API project (GraphQL will come soon) and concentrate only on their business code.
All API project I made used expressJS, and all of them start with the same code. That's the reason why we add a preconfigured initialization of expressJS. 

We aim to use a KISS (Keep It Simple, Stupid) strategy to build it, so we didn't take all the the names and the required interfaces from the hexagonal architecture which could be very complicated to implement.
We took the hexagonal structure in the following folders :
```
src
+-- application : This contain the code of the input part.
+-- infrastructure : This contain the code to link with your 
+-- core : this contain your business core. It is also called 'Domain' in literature.
+-- dependencies : This contain the dependencies that could be used in the three previous part or our framework structure.
```

The 'core' folder will contain your bundles and will contain in theses bundles the following structure

src
+-- core
    +-- MyBundle
        +-- usecases : This contain the entry point of your bundles. It is the equivalent of controllers.
        +-- services : This contain the services for your bundles. The service have the intelligent part of your bundle (algorithms).
            +-- validator : This contain the AJV validators that you could use to validate JSON inputs
        +-- interfaces
            +-- repositories : This describe the interface to be used by your repositories into the infrastructure
            +-- models : This could describe the interface for your models accepted and returned by the usecases (optionnal part)
        +-- events : Contain the event listeners
        +-- models : Contain the models classes that describe your data (for example, equivalent of an entity in Symfony PHP)
        +-- exceptions : Contain the exceptions.

### Comments
It doesn't involve any ORM currently, except a self made quite simple code to populate object with the result of a query. I am not convinced by the existings ORM. If you have any suggestions about it, feel free to propose.

## Prerequisites

NodeJS v12 or above (it could also works on lower version of node, but we did not test it), and that's it.
The following commands are for linux debian, but it might work on Windows and MacOS too.

## Installation

We didn't make an installer yet, so you have to pull the project in a temporary folder.
```
cd /my/temporary/folder
git clone https://github.com/cecric/hexapinod.git
```

You can then extract into your project folder :
```
cd ./hexapinod
git archive master | tar -xzf /my/project/folder
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

# Contributing
Feel free to use it in your projects and to fix some issues you can find by submiting a pull requests. Please let me know if you have any suggestions to improve this framework structure or some features you want/need!
And if you want [to buy me a coffee](https://www.buymeacoffee.com/cecric), I will be the most happy developper in the world.

# License 
This project is licensed under the MIT license.
