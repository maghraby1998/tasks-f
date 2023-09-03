import { gql } from "@apollo/client";

export const projects = gql`
  query myProjects {
    projects {
      id
      name
    }
  }
`;
