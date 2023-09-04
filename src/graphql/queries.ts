import { gql } from "@apollo/client";

export const projects = gql`
  query myProjects {
    projects {
      __typename
      id
      name
    }
  }
`;

export const project = gql`
  query project($id: ID!) {
    project(id: $id) {
      __typename
      id
      name
      stages {
        id
        name
        order
        tasks {
          id
          name
        }
      }
    }
  }
`;
