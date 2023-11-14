import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';


const SEARCH_PRODUCTS = gql`
  query searchProducts($text: String!, $locale: String!) {
    searchProducts(text: $text, locale: $locale) {
      edges {
        node {
          id
          title
          slug
        }
      }
    }
  }
`

@Component({
  selector: 'app',
  template: `
    <h1>Launches</h1>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">Error :(</div>
    <div *ngIf="searchProducts">

      <div *ngFor="let node of searchProducts.edges">
        <p><b>{{ node.title }}</b></p>
        <p>{{ node.slug }}</p>
      </div>
    </div>
  `,
})


export class AppComponent implements OnInit{
  title = 'my-angular-project';
  searchProducts: any;
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
    .watchQuery({
      query: SEARCH_PRODUCTS,
      variables: {text: "", locale: "en-gb"}

    })
    .valueChanges.subscribe((result: any) => {
      console.log(result);
      this.searchProducts = result.data?.searchProducts;
      this.loading = result.loading;
      this.error = result.error;
    });
  }
}
