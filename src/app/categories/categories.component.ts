import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../shared/models/category.interface';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  @Input({required:true}) categories!: Category[]
  @Output() filter = new EventEmitter<Category>();

  public filterByCategory(category: Category):void{

    this.filter.emit(category);
  }

}
