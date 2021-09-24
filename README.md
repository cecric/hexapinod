# Hexapinod

Hexagonal Architecture API Framework/Skeleton in TypeScript and using nodeJS with expressJS

## Why this Framework/Skeleton ?

Since I use typescript in my nodejs project, I didn't find a good architecture bootstrap or framework that suit my needs. And I practiced a lot the hexagonal architecture in projects and I thought it is a vey good architecture for code projects. All API project I made used expressJS, so we add a preconfigured version of expressJS.

## How to install ?

We didn't make an installer yet, so you have to pull the project.
  git pull https://github.com/cecric/hexapinod.git

You can also pull and extract into a folder :
  git archive | tar -xzf

Then you only have to install the package. The package.json is already made with the needed packages inside.
  npm install

## How to launch ?

While you developp, you can launch the server in debug mod with the following command :
  npm run serve
Or
  npm run test

If you want to launch the test :
  npm run test
  
If you want to launch the server in build mode, you have to compile first and the launch it with node :
  npm run build
  node dist/bundle.js server

You can launch other command line that you defined by using other parameters in your call, for example :
  node dist/bundle.js test

