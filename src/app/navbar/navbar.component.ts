import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {



  constructor(readonly _router:Router){

  }
  @Output() scrollEvent = new EventEmitter<string>();

public scrollToSection(sectionName: string) {
  this.scrollEvent.emit(sectionName);
}

gotToParallex() {
this._router.navigate(['/parallex']);
}


}
