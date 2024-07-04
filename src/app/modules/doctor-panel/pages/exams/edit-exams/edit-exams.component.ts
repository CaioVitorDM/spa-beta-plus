import { Component, OnInit, ViewChild } from '@angular/core';
import { ExamsFormComponent } from '../components/exams-form/exams-form.component';
import { FormUtilsService } from 'src/app/services/form-utils/form-utils.service';
import { FormGroup } from '@angular/forms';
import { ExamsService } from 'src/app/services/exams/exams.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-edit-exams',
  templateUrl: './edit-exams.component.html',
  styleUrl: './edit-exams.component.scss'
})
export class EditExamsComponent implements OnInit{
  @ViewChild(ExamsFormComponent) ExamsFormComponent!: ExamsFormComponent;
  exam?: number;

  formUtils: FormUtilsService;
  examsForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formService: ServiceService,
    private examsService: ExamsService,
    private formUtilsService: FormUtilsService
  ) {
    this.examsForm = this.formService.form;
    this.formUtils = this.formUtilsService;
  }

  ngOnInit() {
    const {id} = this.activatedRoute.snapshot.params;

    if (id) {
      this.exam = id;
    }
  }

  navigateBack() {
    this.router.navigate(['/doctor-panel/exams'], {relativeTo: this.activatedRoute});
  }
}
