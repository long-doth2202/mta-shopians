import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Province } from 'src/app/common/Province';
import { District } from 'src/app/common/District';
import { Ward } from 'src/app/common/Ward';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  provinces = 'https://provinces.open-api.vn/api/p'
  districts = 'https://provinces.open-api.vn/api/p';
  wards = 'https://provinces.open-api.vn/api/d';

  province = 'https://provinces.open-api.vn/api/p/';
  district = 'https://provinces.open-api.vn/api/d/';  
  ward = 'https://provinces.open-api.vn/api/w/';

  distanceMatrix = "https://api.distancematrix.ai/maps/api/distancematrix/json";
  API_KEY = "bk5LhLzrZBlwvmrEHdtrvGAQ38zn9";

  constructor(private http: HttpClient) { }

  getDistanceMatrix(destination:string) {
    return this.http.get(this.distanceMatrix + "?origins=Học viện kỹ thuật quân sự" +
    "&destinations=" + destination + "&key=" + this.API_KEY);
  }

  getAllProvinces() {
    return this.http.get(this.provinces);
  }

  getDistricts(code:number) {
    return this.http.get(this.districts+'/'+code+'?depth=2');
  }

  getWards(code:number) {
    return this.http.get(this.wards+'/'+code+'?depth=2');
  }

  getProvince(id: number) {
    return this.http.get(this.province+id);
  }

  getDistrict(id: number) {
    return this.http.get(this.district+id);
  }

  getWard(id: number) {
    return this.http.get(this.ward+id);
  }
}
