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

export const UPDATE_TASK = gql`
  mutation updateTask($input: UpdateTaskInput) {
    updateTask(input: $input) {
      __typename
      id
      name
      users {
        __typename
        id
        name
      }
    }
  }
`;

export const INVITE_USER_TO_PROJECT = gql`
  mutation inviteUserToProject($input: InviteUserToProjectInput) {
    inviteUserToProject(input: $input) {
      id
    }
  }
`;

export const ACCEPT_INVITATION = gql`
  mutation acceptInviation($invitationId: Int!) {
    acceptInvitation(invitationId: $invitationId) {
      id
    }
  }
`;

export const REJECT_INVITATION = gql`
  mutation rejectInviation($invitationId: Int!) {
    rejectInvitation(invitationId: $invitationId) {
      id
    }
  }
`;

export const CANCEL_INVITATION = gql`
  mutation cancelInviation($invitationId: Int!) {
    cancelInvitation(invitationId: $invitationId) {
      id
    }
  }
`;
