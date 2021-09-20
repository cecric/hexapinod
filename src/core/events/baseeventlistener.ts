

export interface BaseEventListener {


  getManagedEvents (): string[];

  dispatch (_eventName: string, _data: unknown): Promise<unknown | boolean>;

}