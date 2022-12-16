import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { GenericApiResponse, Project } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { AddProjectComponent } from './add-project/add-project.component';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	projects: Project[] = [];
	
	constructor(private apiService: ApiService,
				private modalService: BsModalService,
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
		const modalRef = this.modalService.show(AddProjectComponent);
		if (modalRef.content) modalRef.content.modalRef = modalRef;
		

		modalRef.onHide?.subscribe(resp => this.getProjects());
	}
}
