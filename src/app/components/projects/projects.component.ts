import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { GenericApiResponse, Project } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectComponent } from './add-project/add-project.component';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	projects: Project[] = [];
	
	constructor(private apiService: ApiService,
				private modalService: NgbModal,
				private toaster: ToastrService) 
	{ }

	ngOnInit(): void {
		this.getProjects();
	}

	getProjects(): void {
		this.apiService.get('/projects').subscribe({
			next: (resp: GenericApiResponse) => this.projects = resp.data.projects,
			error: (error: any) => this.toaster.error(error)
		});
	}

	createProject(): void {
		this.modalService.open(AddProjectComponent)
	}
}
