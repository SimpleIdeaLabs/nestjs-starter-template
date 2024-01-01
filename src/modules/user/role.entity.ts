import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  constructor(key?: string, name?: string) {
    if (key && name) {
      this.key = key;
      this.name = name;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  /**
   * ***********************
   *     Placeholders
   * ***********************
   */

  /**
   * userCount
   * is used to hold
   * numbers of users
   * with the current Role
   */
  userCount: number;

  /**
   * ***********************
   *     Functions
   * ***********************
   */

  /**
   * generateKey
   * is used to
   * convert name
   * into a lowercase
   * string separated with _
   */
  public static generateKey(name: string) {
    return name.toLocaleLowerCase().replace(' ', '_');
  }
}
