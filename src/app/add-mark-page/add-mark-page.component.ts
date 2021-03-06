import {Component, NgZone, OnInit} from '@angular/core';
import {Mark} from "../models/marks.model";
import {Assignment} from "../models/assignments.model";
import {Course} from "../models/courses.model";
import {DatabaseService} from "../services/database.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-add-mark-page',
  templateUrl: './add-mark-page.component.html',
  styleUrls: ['./add-mark-page.component.css']
})
export class AddMarkPageComponent implements OnInit {
  formTitle = 'Add Mark';
  courses: Course[] = []
  courseId: number = -1;
  assignments: Assignment[] = []
  alreadyMarked :boolean = false;
  selectAssignmentDisabled:boolean = true;
  weightMark:number = 0;

  mark:Mark = new Mark();

  constructor(private database: DatabaseService,
              private router: Router, private ngZone: NgZone
  ) {

  }
  ngOnInit(): void {
    this.database.selectAllCourses().then((data)=>{
      this.courses = data;
    }).catch((error)=>{
      console.error(error)
    });
  }

  onCourseChange(event){
    this.courseId = event;
    this.selectAssignmentDisabled = false;
    this.mark.assignmentId = undefined;
    this.weightMark = 0;
    this.database.selectAllAssignmentsByCourse(this.courseId).then((data)=>{
      this.assignments = data;
    }).catch((error)=>{
      console.error(error)
    });
  }

  onAssignmentChange(event){
    this.mark.assignmentId = event;
    this.alreadyMarked = false;
    this.database.selectAssignment(this.mark.assignmentId).then((data)=>{
      this.weightMark = data.weight;
    }).catch((error)=>{
      console.error(error)
    });
  }

  btnSave_click(){
    this.mark.grade = +this.mark.grade.toFixed(2);

    this.database.findMarkByAssignment(this.mark.assignmentId).then((data)=>{
      if(data != undefined) {
        this.alreadyMarked = true;
        alert("This assignment already received the mark.");
      }
      if(!this.alreadyMarked) {
        this.database.insertMarks(this.mark, () => {
          console.log("Record added successfully");
          alert("Record added successfully");
          this.ngZone.run(() => {
            this.router.navigate(['listMark/']);
          });
        });
      }
    });



  }
}
