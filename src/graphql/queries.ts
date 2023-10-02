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
        __typename
        id
        name
        order
        tasks {
          __typename
          id
          name
        }
      }
    }
  }
`;

export const GET_TASK = gql`
  query getTask($id: ID!) {
    task(id: $id) {
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

export const GET_SENT_INVITATIONS = gql`
  query getSentInviations {
    sentInvitations {
      id
      receiver {
        id
        name
      }
      project {
        id
        name
      }
      status
    }
  }
`;

export const GET_RECEIVED_INVITATIONS = gql`
  query getReceivedInviations {
    receivedInvitations {
      id
      sender {
        id
        name
      }
      project {
        id
        name
      }
      status
    }
  }
`;
