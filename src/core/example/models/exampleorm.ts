import { Model } from '@dependencies/hexapinod-framework/model/model';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ExampleOrm extends Model {

    @PrimaryColumn()
    protected id: number;

    @Column()
    protected example: string;

    @Column()
    protected dateExample: Date;

    @Model.STRING()
    public setExample (_example: string): Model {
      this.example = _example;
      return this;
    }

    public getExample (): string {
      return this.example;
    }

    @Model.DATE()
    public setDateExample (_dateExample: Date): Model {
      this.dateExample = _dateExample;
      return this;
    }

    public getDateExample (): Date {
      return this.dateExample;
    }

}