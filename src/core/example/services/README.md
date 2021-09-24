# Services
To create a new service, you have to create a class is a file here. The file should end with '.service.ts' to be loaded dynamically by the service manager.
The name of the class should end with service and have the same name than the name of file.
Example :
The class RepositoriesService should be into the file repositories.service.ts to be loaded dynamically

Then you should call the service in the usescases or other service with the service manager. It manage the instances of a regular service :
```typescript
import { RepositoriesService } from '@core/services/repositories.service';
import ServiceManager from '@core/services/servicemanager';
    
const repositoriesService: RepositoriesService = ServiceManager.get<RepositoriesService>(RepositoriesService.name);
```
