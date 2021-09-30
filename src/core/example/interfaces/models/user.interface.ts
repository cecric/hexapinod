

export interface IUser {

  getId(): number;

  setId(_uid:number): IUser;

  getEmail(): string;

  setEmail(_email:string): IUser;

  getPassword(): string;

  setPassword(_email:string): IUser;
}