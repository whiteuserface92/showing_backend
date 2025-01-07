import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fromName' })
  fromName: string;

  @Column()
  subject: string;

  @Column()
  date: string;
}
