import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpHeaders} from "@angular/common/http";
import { createPersistedQueryLink } from 'apollo-angular/persisted-queries';
import { sha256 } from 'crypto-hash';

const uri = 'https://spacex-production.up.railway.app/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {


  const middleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: new HttpHeaders({ 'Authorization': 'Bearer dan-test', 'Content-type': 'application/json'}
      ),
    });
    return forward(operation);
  });

  const link = middleware.concat(createPersistedQueryLink({ useGETForHashedQueries: true, sha256 }).concat(
    httpLink.create({ uri(operation) {
        return `${uri}?o=${operation.operationName}`
      } })
  ));
  //
  // const linkChain = createPersistedQueryLink({ useGETForHashedQueries: true, sha256 }).concat(
  //   httpLink.create({ uri }),
  // );

  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
