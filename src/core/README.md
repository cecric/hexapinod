# The core directory

It contains the bundles of your application. It is the core of your system with all its intelligence.
Each bundle can contain the following folders :
```
core
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

## Use Cases

The folder usecases contain the usecases of your core application. Each Use Cases class should inherit from the UseCases of our framework (or of a subclass of UseCases if you write your own).
By convention, the usecases should be written in files with *.usecases.ts* at the end. It is like a controller, in a use case you actions must be static functions.
For example : 
```typescript
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';

export class YourSpecificUsecases extends UseCases {

    public static async yourSpecificCaseAction (): Promise<any> {
        ...
    }

}
```

## Services

To create a new service, you have to create a class is a file here. The file should end with *.service.ts* by convention but also to be loaded dynamically by the service manager.
The name of the class should end with service and have the same name than the name of file.

Example :
The class RepositoriesService should be into the file repositories.service.ts to be loaded dynamically and **inherit from the class Service**

Then you should call the service in the usescases or other service with the service manager. It manage the instances of a regular service :
```typescript
import { RepositoriesService } from '@core/services/repositories.service';
import ServiceManager from '@core/services/servicemanager';
    
const repositoriesService: RepositoriesService = ServiceManager.get<RepositoriesService>(RepositoriesService.name);
```

### Validator
To make the validation of the JSON input, we bring into the framework the famous library AJV which allow to make some validation. The validation schema are described into the folder validator by following the rules of AJV. We recommends to read the documentation of them.
By convention and to allow dynamic loading, they should be bring into typescript file ending by *.schema.ts*
To call the validation, you should use the validator service included in the hexapinod module.

## Interfaces

### Repositories 

### Models

## Events Listeners

## Models

## Exceptions

