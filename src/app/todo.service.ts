import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Todo } from './todo.model';

@Injectable({providedIn: 'root'})
export class TodoService {

    constructor(private http: HttpClient ){}

    createAndStoreTodo(completed: boolean, todo: string){
        const postData: Todo = {completed: completed, todo: todo};
        this.http
      .post(
        'https://dki48n2zn1.execute-api.us-east-1.amazonaws.com/dev/todos',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      });
    }

    getAllTodos(){
        return this.http
    .get('https://dki48n2zn1.execute-api.us-east-1.amazonaws.com/dev/todos')
    .pipe(map(responseData => {
      const postsArray: Todo[] = [];
      //TODO: return a better response object from the server side
        for( const item in responseData["output"]){
          postsArray.push({...responseData["output"][item]["todo"], id: responseData["output"][item]["id"]})
        }
        
      return postsArray;
    }));
    }

    deleteTodoItem(todo: Todo){
        return this
        .http
        .delete<{output: string,message: string}>(`https://dki48n2zn1.execute-api.us-east-1.amazonaws.com/dev/todos/${todo.id}`);
    }
}