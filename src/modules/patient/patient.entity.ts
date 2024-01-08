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
   * Common Fields
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
   * Personal Information
   */
  @Column({ nullable: true })
  controlNo: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthDate: Date;

  /**
   * Contact Information
   */
  @Column({ nullable: true })
  mobileNo: string;

  @Column({ nullable: true })
  email: string;

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
