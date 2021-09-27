# Hexapinod

Hexagonal Architecture API Framework/Skeleton in TypeScript and using nodeJS with expressJS.

## Why this Framework/Skeleton ?

Since I use typescript in my nodejs projects, I didn't find good architectures skeletons or frameworks that suit my needs. I practiced a lot the hexagonal architecture in projects and I think it is a vey good architecture for code projects to works with small/medium team. The aim of this project is to help developers to start a new REST API project (GraphQL will come soon) and concentrate only on their business code.
All API project I made used expressJS, and all of them start with the same code. That's the reason why we add a preconfigured initialization of expressJS. 

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
