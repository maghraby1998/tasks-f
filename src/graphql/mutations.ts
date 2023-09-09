// import { gql } from "../__generated__";
import { gql } from "@apollo/client";

// export const LOGIN = gql(/* GraphQL */ `
//   mutation login($email: String!, $password: String!) {
//     signIn(email: $email, password: $password) {
//       user {
//         id
//         name
//       }
//       access_token
//     }
//   }
// `);

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      user {
        id
        name
      }
      access_token
    }
  }
`;

export const upsertProject = gql`
  mutation upsertProject($input: UpsertProjectInput) {
    upsertProject(input: $input) {
      __typename
      id
      name
    }
  }
`;

export const updateProject = gql`
  mutation updateProject($input: UpdateProjectInput) {
    updateProject(input: $input) {
      __typename
      id
      name
      stages {
        __typename
        id
        name
      }
    }
  }
`;

export const upsertTask = gql`
  mutation UpsertTask($input: CreateTaskInput) {
    createTask(input: $input) {
      __typename
      id
    }
  }
`;

export const updateTaskStage = gql`
  mutation UpdateTaskStage($input: UpdateTaskStageInput) {
    updateTaskStage(input: $input) {
      __typename
      id
    }
  }
`;
