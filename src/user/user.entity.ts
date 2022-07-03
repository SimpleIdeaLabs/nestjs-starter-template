import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as cryptojs from 'crypto-js';

@Entity()
export class User {
  constructor(params: Partial<User>) {
    Object.assign(this, params);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  email: string;

  @Column()
  securedPassword: string;

  set password(rawPassword) {
    this.securedPassword = cryptojs.AES.encrypt(
      rawPassword,
      process.env.CRYPTO_KEY,
    ).toString();
  }

  isPasswordMatching(rawPassword): boolean {
    const decryptedPassword = cryptojs.AES.decrypt(
      this.securedPassword,
      process.env.CRYPTO_KEY,
    ).toString(cryptojs.enc.Utf8);
    console.log(decryptedPassword);
    console.log(rawPassword);
    return decryptedPassword == rawPassword;
  }
}
