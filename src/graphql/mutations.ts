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
