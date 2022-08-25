import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  seeded: boolean;

  @Column({ default: 'nestjs-starter-template' })
  appName: string;
}
