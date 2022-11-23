import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { PatientDocument } from './patient-document.entity';
import { PatientPhoto } from './patient-photo.entity';
import { v4 } from 'uuid';

@Entity()
export class Patient {
  /**
   * common fields
   */
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

  @Column({ default: false })
  deleted: boolean;

  /**
   * entity fields
   */
  @Column()
  controlNo: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  middleName: string;

  @Column()
  email: string;

  @Column()
  birthDate: Date;

  /**
   * relations
   */
  @OneToMany(
    () => PatientDocument,
    (patientDocument) => patientDocument.patient,
    {
      cascade: ['insert', 'update'],
    },
  )
  documents: PatientDocument[];

  @OneToMany(() => PatientPhoto, (patientPhoto) => patientPhoto.patient, {
    cascade: ['insert', 'update'],
  })
  photos: PatientPhoto[];

  /**
   * methods
   */
  public generateControlNo() {
    this.controlNo = v4();
  }
}
