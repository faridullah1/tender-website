import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { GenericApiResponse, Project } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { AddProjectComponent } from './add-project/add-project.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	projects: Project[] = [];
	searchFC = new FormControl();

	constructor(private apiService: ApiService,
				private modalService: BsModalService,
				private toaster: ToastrService) 
	{
		this.searchFC.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(search => {
				this.getProjects(search);
			})
	}

	ngOnInit(): void {
		this.getProjects();
	}

	getProjects(search: string | null = null): void {
		const slug = search ? `/projects?name=${search}` : '/projects';

		this.apiService.get(slug).subscribe({
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
