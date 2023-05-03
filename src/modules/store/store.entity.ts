import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { AdminRegion } from 'ph-geo-admin-divisions/lib/dtos';

@Entity()
export class Store {
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

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column()
  contactNo: string;

  @Column()
  email: string;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @Column({ type: 'simple-json' })
  stateOrProvince: AdminRegion;

  @Column({ type: 'simple-json' })
  cityOrTown: AdminRegion;

  @Column({ type: 'simple-json' })
  baranggay: AdminRegion;

  @Column()
  postalOrZip: string;

  @Column()
  country: string;
}
