import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
});

const requestOptions = { headers: headers };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'fileManagementWeb';
  files: any[] = [];
  displayedColumns: string[] = ['fileId', 'filename', 'filesize', 'filepath', 'fileExtension','actions'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.login();
  }

  
  login() {
    const body = {username: 'anakin', password: 'password'};
    this.http.post<any>('http://localhost:8082/login', body, requestOptions).subscribe((Response: any) => {
      const token = Response.token;
      const bearerToken = `Bearer ${token}`;
      console.log(bearerToken);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
      this.http.get('http://localhost:8082/files',{headers}).subscribe((response: any) => {
        this.files = response;
      }, error => {
        console.log('Dosyalar alınamadı!,token:',token,'error:',error,'headers: ', headers);
      });
    });
  }

  getFiles() {
    const token = localStorage.getItem('token');
    headers.set('Authorization', `Bearer ${token}`, );
    this.http.get('http://localhost:8082/files',{headers}).subscribe((response: any) => {
      this.files = response;
    }, error => {
      console.log('Dosyalar alınamadı!,token:',token,'error:',error);
    });
  }

  selectedFile!: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post<any>('http://localhost:8082/files/upload', formData).subscribe(response => {
      this.getFiles();
      console.log('Dosya yüklendi!');
    }, error => {
      console.log('Dosya yüklenirken hata oluştu!');
    });
  }

  onDelete(fileId: string) {
    this.http.delete<any>('http://localhost:8082/files/' + fileId).subscribe(response => {
      this.getFiles();
      console.log('Dosya silindi!');
    }, error => {
      console.log('Dosya silinirken hata oluştu!');
    });
  }

  onReplace(fileId: string) {
    const formData = new FormData();
  formData.append('file', this.selectedFile);

  this.http.put<any>('http://localhost:8082/files/' + fileId, formData).subscribe(response => {
    this.getFiles();
    console.log('Dosya değiştirildi!');
  }, error => {
    console.log('Dosya değiştirilirken hata oluştu!');
  });
  }
}
