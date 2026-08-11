import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DefaultSlikaService } from '../services/default-slika';

@Component({
  selector: 'app-pocetna-stranica',
  imports: [RouterOutlet,FormsModule,RouterModule],
  templateUrl: './pocetna-stranica.html',
  styleUrls: ['./pocetna-stranica.css', '/../../styles.css'],
})
export class PocetnaStranica implements OnInit {
  constructor(private router:Router, private defaultSlikaService:DefaultSlikaService){

  }
  ngOnInit():void{

  }

  loginForm(){
    this.router.navigate(['login-stranica']);
  }
  registrationForm(){
    this.router.navigate(['registration-stranica']);
  }

   slika : any="";

   slikaTrener(event:Event){
    let input = event.target as HTMLInputElement;
    if(input.files && input.files[0]){
      let file=input.files[0];
      let reader = new FileReader();
      reader.onload = function(e:ProgressEvent<FileReader>){
        let slika=new Image();
        slika.src=e.target?.result?.toString() || '';
        slika.onload=function(){
          let minW=100;
          let minH=100;
          let maxW=300;
          let maxH=300;
          if(slika.width<minW || slika.height<minH){
            alert('Minimalne dimenzije slike su 100*100px');
            input.value='';
            return;
          }else if(slika.width>maxW || slika.height>maxH){
            alert("Maksimalne dimenzije slike su 300*300px");
            input.value='';
          } else{
            alert("Uspesno ste dodali sliku")
          }
        }
      }
      reader.readAsDataURL(input.files[0]);
      reader.onloadend=(e)=>{
        this.slika=reader.result;
      }
    }
  }
  dodajDefaultSliku(){
    this.defaultSlikaService.addDefaultSlika(this.slika).subscribe(
      data=>{
        if(data.message=="ok"){
          alert("Uspesni ste dodali sliku")
          location.reload();
        }
      }
    )
  }

}
