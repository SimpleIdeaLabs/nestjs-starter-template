import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Store } from '../../../../modules/store/store.entity';
import { plainToClass } from 'class-transformer';
import { User } from '../../../../modules/user/user.entity';
import {
  searchBaranggay,
  searchMunicipality,
  searchProvince,
} from 'ph-geo-admin-divisions';

@Injectable()
export class StoreSeeding {
  constructor(private readonly dataSource: DataSource) {}

  public async seed(): Promise<Store> {
    const store = new Store();
    store.name = 'Messiah Clinic';
    store.address1 = 'Address 1';
    store.address2 = 'Guadalupe';
    store.stateOrProvince = searchProvince({ name: 'Bulacan' })[0];
    store.cityOrTown = searchMunicipality({
      provinceId: store.stateOrProvince.provinceId,
      name: 'Malolos',
    })[0];
    store.baranggay = searchBaranggay({
      provinceId: store.stateOrProvince.provinceId,
      municipalityId: store.cityOrTown.municipalityId,
    })[0];
    store.postalOrZip = '4001';
    store.country = 'Philippines';
    store.contactNo = '12345678';
    store.email = 'markmatuteclinicmanagement@gmail.com';
    store.logo = 'logo.png';
    const pmsAdmin = plainToClass(User, { id: 1 });
    store.createdBy = pmsAdmin;
    store.updatedBy = pmsAdmin;
    await this.dataSource.manager.save(store);
    return store;
  }
}
