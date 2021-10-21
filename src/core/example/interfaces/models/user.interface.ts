
/**
 * Interface of model used outside of the core (application or repositories)
 * @date 20/09/2021 - 08:00:00
 * @author cecric
 *
 * @export
 * @interface IUser
 * @typedef {IUser}
 */
export interface IUser {

  /**
   * get id of user
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @returns {number}
   */
  getId(): number;

  /**
   * set id of user
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {number} _uid
   * @returns {IUser}
   */
  setId(_uid:number): IUser;

  /**
   * get email of user
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @returns {string}
   */
  getEmail(): string;

  /**
   * set email of user
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {string} _email
   * @returns {IUser}
   */
  setEmail(_email:string): IUser;

  /**
   * get plain password of user
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @returns {string}
   */
  getPassword(): string;

  /**
   * set plain password of user
   * @date 20/09/2021 - 08:00:00
   * @author cecric
   *
   * @param {string} _pwd
   * @returns {IUser}
   */
  setPassword(_pwd:string): IUser;
}