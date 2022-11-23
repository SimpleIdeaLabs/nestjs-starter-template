import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Patient } from './patient.entity';

@Entity()
export class PatientDocument {
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
  path: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column({ default: false })
  deleted: boolean;

  @ManyToOne(() => Patient)
  patient: Patient;

  @Column({ default: null })
  patientId: number;
}
