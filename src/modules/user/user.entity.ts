import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as jwt from 'jsonwebtoken';
import config from '../../common/config/env.config';
import { Role } from './role.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  updatedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  hashPassword: string;

  set password(rawPassword: string) {
    this.hashPassword = bcrypt.hashSync(
      rawPassword,
      Number(process.env.BCRYPT_SALT_ROUNDS),
    );
  }

  public doesPasswordMatch(rawPassword: string): boolean {
    return bcrypt.compareSync(`${rawPassword}`, this.hashPassword);
  }

  @Column({ default: false })
  deleted: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  public toJWT() {
    return jwt.sign(
      {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        deleted: this.deleted,
        roles: this.roles,
      },
      config().jwtSecret,
    );
  }

  public toJSON() {
    return {
      id: this.id,
      profilePhoto: this.profilePhoto,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      deleted: this.deleted,
      roles: this.roles,
    };
  }
}
