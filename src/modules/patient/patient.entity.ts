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
   * Address Information
   */
  @Column({ nullable: true })
  houseNo: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  cityOrTown: string;

  @Column({ nullable: true })
  provinceOrRegion: string;

  @Column({ nullable: true })
  postal: string;

  @Column({ nullable: true })
  country: string;

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
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const date = currentDate.getDate().toString().padStart(2, '0');
    this.controlNo = `${year}${month}${date}-${this.id
      .toString()
      .padStart(6, '0')}`;
  }
}
