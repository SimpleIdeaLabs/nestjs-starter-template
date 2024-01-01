import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Service } from '../../../../modules/service/service.entity';
import { ServiceCategories } from '../../../../modules/service/service.constants';

@Injectable()
export class ServicesSeeding {
  constructor(private readonly dataSource: DataSource) {}
  private services = [];

  public async seed(): Promise<Service[]> {
    this._seedMedicalConsultations();
    this._seedDiagnosticServices();
    this._seedPreventiveHealthServices();
    await this.dataSource.manager.save(this.services);
    return this.services;
  }

  private _seedMedicalConsultations() {
    const generalConsultation = new Service();
    generalConsultation.name = 'General Consultation';
    generalConsultation.logo = 'General Consultation.png';
    generalConsultation.category = +ServiceCategories.MEDICAL_CONSULTATIONS.id;
    generalConsultation.description =
      'Perform general consultation up on patient.';
    generalConsultation.price = 500.0;
    this.services.push(generalConsultation);

    const specialistConsultation = new Service();
    specialistConsultation.name = 'Specialist Consultation';
    specialistConsultation.logo = 'Specialist Consultation.png';
    specialistConsultation.category =
      +ServiceCategories.MEDICAL_CONSULTATIONS.id;
    specialistConsultation.description =
      'Perform specialist consultation up on patient.';
    specialistConsultation.price = 1800.0;
    this.services.push(specialistConsultation);

    const medicalCheckUp = new Service();
    medicalCheckUp.name = 'Medical Check Up';
    medicalCheckUp.logo = 'Medical Check Up.png';
    medicalCheckUp.category = +ServiceCategories.MEDICAL_CONSULTATIONS.id;
    medicalCheckUp.description = 'Perform medical check up on patient.';
    medicalCheckUp.price = 100.0;
    this.services.push(medicalCheckUp);
  }

  private _seedDiagnosticServices() {
    const chestXRay = new Service();
    chestXRay.name = 'Chest X-Ray';
    chestXRay.logo = 'Chest X-Ray.png';
    chestXRay.category = +ServiceCategories.DIAGNOSTIC_SERVICES.id;
    chestXRay.description = 'Perform an X-ray of the chest area.';
    chestXRay.price = 1000.0;
    this.services.push(chestXRay);

    const bloodTest = new Service();
    bloodTest.name = 'Blood Test';
    bloodTest.logo = 'Blood Test.png';
    bloodTest.category = +ServiceCategories.DIAGNOSTIC_SERVICES.id;
    bloodTest.description = 'Conduct a blood test to evaluate patient health.';
    bloodTest.price = 500.0;
    this.services.push(bloodTest);
  }

  private _seedPreventiveHealthServices() {
    const vaccination = new Service();
    vaccination.name = 'Vaccination';
    vaccination.logo = 'Vaccination.png';
    vaccination.category = +ServiceCategories.PREVENTIVE_HEALTH_SERVICES.id;
    vaccination.description =
      'Administer vaccines to prevent infectious diseases.';
    vaccination.price = 800.0;
    this.services.push(vaccination);

    const healthScreening = new Service();
    healthScreening.name = 'Health Screening';
    healthScreening.logo = 'Health Screening.png';
    healthScreening.category = +ServiceCategories.PREVENTIVE_HEALTH_SERVICES.id;
    healthScreening.description =
      'Conduct a health screening to detect health issues early.';
    healthScreening.price = 1500.0;
    this.services.push(healthScreening);
  }

  private _treatmentServices() {
    const medicationDispensing = new Service();
    medicationDispensing.name = 'Medication Dispensing';
    medicationDispensing.logo = 'Medication Dispensing.png';
    medicationDispensing.category = +ServiceCategories.TREATMENT_SERVICES.id;
    medicationDispensing.description =
      'Dispense medication to treat illnesses or conditions.';
    medicationDispensing.price = 1200.0;
    this.services.push(medicationDispensing);

    const woundDressing = new Service();
    woundDressing.name = 'Wound Dressing';
    woundDressing.logo = 'Wound Dressing.png';
    woundDressing.category = +ServiceCategories.TREATMENT_SERVICES.id;
    woundDressing.description = 'Provide dressing and care for wounds.';
    woundDressing.price = 500.0;
    this.services.push(woundDressing);
  }

  private _seedMentalHealthService() {
    const psychotherapy = new Service();
    psychotherapy.name = 'Psychotherapy';
    psychotherapy.logo = 'Psychotherapy.png';
    psychotherapy.category = +ServiceCategories.MENTAL_HEALTH_SERVICES.id;
    psychotherapy.description =
      'Provide therapy to address mental health issues.';
    psychotherapy.price = 2000.0;
    this.services.push(psychotherapy);

    const cognitiveBehavioralTherapy = new Service();
    cognitiveBehavioralTherapy.name = 'Cognitive Behavioral Therapy';
    cognitiveBehavioralTherapy.logo = 'Cognitive Behavioral Therapy.png';
    cognitiveBehavioralTherapy.category =
      +ServiceCategories.MENTAL_HEALTH_SERVICES.id;
    cognitiveBehavioralTherapy.description =
      'Provide therapy to change negative thought patterns.';
    cognitiveBehavioralTherapy.price = 2500.0;
    this.services.push(cognitiveBehavioralTherapy);
  }
}
