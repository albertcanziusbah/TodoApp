import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Todo } from '../todo.model';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css']
})
export class TodoComponent {
loadedPosts: Todo[] = [];
  completed: boolean =false;
  isFetching = false;

  constructor(private http: HttpClient, private todoService: TodoService) {}

  ngOnInit() {
    this.isFetching = true;
    this.todoService.getAllTodos()
    .subscribe(
      todos => {
        this.isFetching = false;
        this.loadedPosts = todos;
      }
    )
    ;
  }

  onCreatePost(todoForm: NgForm) {
    this.todoService.createAndStoreTodo(todoForm.value.completed,todoForm.value.todo);
    todoForm.reset();
  }

  

  onFetchPosts() {
    this.todoService.getAllTodos()
    .subscribe(
      todos => {
        this.isFetching = false;
        this.loadedPosts = todos;
      }
    )
    ;
  }

  onClearPosts(){

  }

  deleteTodoItem(todo: Todo) {
    console.log(todo);
    this.todoService.deleteTodoItem(todo).subscribe( todoResponse => {
      console.log(todoResponse);
      this.loadedPosts = this.loadedPosts.filter( todoItem => {
        return todoItem.id != todoResponse.output;
      });
    });
  }
}