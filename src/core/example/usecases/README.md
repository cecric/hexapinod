# UseCases

The folder usecases contain the usecases of your core application. Each Use Cases class should inherit from the UseCases of our framework (or of a subclass of UseCases if you write your own).
By convention, the usecases should be written in files with .usecases.ts at the end. It is like a controller, in a use case you actions must be static functions.
For example : 
```typescript
import { UseCases } from '@dependencies/hexapinod-framework/usecases/usecases';

export class YourSpecificUsecases extends UseCases {

    public static async yourSpecificCaseAction (): Promise<any> {
        ...
    }

}
```