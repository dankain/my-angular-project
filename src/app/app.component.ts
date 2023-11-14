import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app',
  template: `
    <h1>Launches</h1>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">Error :(</div>
    <div *ngIf="launches">

      <div *ngFor="let launch of launches">
        <p><b>{{ launch.mission_name }}</b></p>
        <p>{{ launch.details }}</p>
      </div>
    </div>
  `,
})

export class AppComponent implements OnInit{
  title = 'my-angular-project';
  launches: any[] = []
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
    .watchQuery({
      query: gql`query launches
        {
          launches {
            launch_date_local
            id
            details
            mission_name
          }
        }
      `,
    })
    .valueChanges.subscribe((result: any) => {
      this.launches = result.data?.launches;
      this.loading = result.loading;
      this.error = result.error;
    });
  }
}
