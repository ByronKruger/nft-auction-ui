import { Injectable } from '@angular/core';
import { InteropReporting, ReportData } from 'interop-web-reporting';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private reporting = new InteropReporting();

  reportingData: ReportData = {
    dateAndTime: "",
    error: {
      errorCode: "",
      errorDescription: ""
    },
    subLevelFunctionCategory: "",
    topLevelFunctionCategory: "",
    userAgent: "",
    subLevelFunctionCategory1: ""
  }

  addUnitOfWork(key: keyof ReportData, value: any) {
    this.reporting.addUnitOfWork(key, value);
  }

  // submitForm() {
  //   this.reporting.addUnitOfWork("", "");
  // }

  reportIssue() {
    this.reporting.reportBug();
  }
}
