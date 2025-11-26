import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { NewsType } from 'src/app/core/interfaces/news-type';
import { NewsTable } from 'src/app/core/interfaces/news-table';
import { NewsService } from 'src/app/core/services/news.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-news',
  templateUrl: './manage-news.component.html',
  styleUrls: ['./manage-news.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, NgIf, NgFor, ReactiveFormsModule, MatSnackBarModule]
})
export class ManageNewsComponent implements OnInit {
  URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\-~:/?#\[\]@!$&'()*+,;=]*)*\/?$/i;

  updateButton: boolean = false;

  updateData: NewsTable | null = null;

  newsForm: FormGroup;

  newsTypeFormControl = new FormControl<NewsType | null>(null, Validators.required);

  newsType: NewsType[] = [
    {name: 'Evento', value: 'event'},
    {name: 'Banner', value: 'banner'},
    {name: 'Código', value: 'code'}
  ];

  titleFormControl = new FormControl('', [
    Validators.required, 
    Validators.minLength(6),
    Validators.maxLength(50)]);

  descriptionFormControl = new FormControl('', [
    Validators.required, 
    Validators.minLength(16),
    Validators.maxLength(200)]);

  linkFormControl = new FormControl('', [Validators.pattern(this.URL_REGEX)]);
  
  ngOnInit(): void {
    const newsToUpdate = this.news.getNewsToUpdate();

    if (newsToUpdate) {
      this.newsForm.patchValue(newsToUpdate);
      
      const selectedType = this.newsType.find(
        type => type.value === newsToUpdate.newsType.toLowerCase()
      );

      if (selectedType) {
        this.newsTypeFormControl.setValue(selectedType);
      }

        this.updateData = newsToUpdate;
      
        this.news.clearNewsToUpdate();

        this.updateButton = true;
    } else {
      this.updateButton = false;
    }
  }

  constructor(private news: NewsService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.newsForm = new FormGroup({
      newsType: this.newsTypeFormControl,
      title: this.titleFormControl,
      description: this.descriptionFormControl,
      link: this.linkFormControl
    }); 
  }

  addNews(): void {
    const credentials = this.newsForm;

    if (credentials.valid) {
      const body = {
        newsType: String(this.newsTypeFormControl.value?.value),
        title: String(this.titleFormControl.value),
        description: String(this.descriptionFormControl.value),
        link: String(this.linkFormControl.value)
      };

      this.news.addNews(body).subscribe({
        next: (response) => {
          this.openSnackBar('Noticia agregada con éxito', 'Aceptar');

          this.redirectToTableNews();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo agregar la noticia', 'Aceptar');
        }
      });
    }
  }

  updateNews(): void {
    const newsToUpdate = this.updateData;
    const credentials = this.newsForm;

    if (credentials.valid && newsToUpdate) {
      const body = {
        newsType: String(this.newsTypeFormControl.value?.value),
        title: String(this.titleFormControl.value),
        description: String(this.descriptionFormControl.value),
        link: String(this.linkFormControl.value)
      };

      this.news.updateNews(body, newsToUpdate.id).subscribe({
        next: (response) => {
          this.openSnackBar('Noticia actualizada con éxito', 'Aceptar');

          this.redirectToTableNews();
          
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo actualizar la noticia', 'Aceptar');
        }
      });
    }
  }

  cancel(): void {
    window.location.reload();
  }

  redirectToTableNews(): void {
    this.router.navigate(['/table-news']);
  }

  compareNewsType = (option: NewsType, value: NewsType | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.value === value.value;
  };

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}