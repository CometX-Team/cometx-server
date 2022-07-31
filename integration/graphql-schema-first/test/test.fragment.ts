import { gql } from 'apollo-server-express';

export const ADMIN_FRAGMENT = gql`
  fragment CreatedAdmin on Administrator {
    id
    emailAddress
    user {
      id
      identifier
    }
  }
`;

export const CREATE_ADMIN = gql`
  mutation CreateTestAdmin($emailAddress: String!, $fail: Boolean!) {
    createTestAdministrator(emailAddress: $emailAddress, fail: $fail) {
      ...CreatedAdmin
    }
  }
  ${ADMIN_FRAGMENT}
`;

export const CREATE_ADMIN2 = gql`
  mutation CreateTestAdmin2($emailAddress: String!, $fail: Boolean!) {
    createTestAdministrator2(emailAddress: $emailAddress, fail: $fail) {
      ...CreatedAdmin
    }
  }
  ${ADMIN_FRAGMENT}
`;

export const CREATE_ADMIN3 = gql`
  mutation CreateTestAdmin3($emailAddress: String!, $fail: Boolean!) {
    createTestAdministrator3(emailAddress: $emailAddress, fail: $fail) {
      ...CreatedAdmin
    }
  }
  ${ADMIN_FRAGMENT}
`;

// export const CREATE_ADMIN4 = gql`
//   mutation CreateTestAdmin4($emailAddress: String!, $fail: Boolean!) {
//     createTestAdministrator4(emailAddress: $emailAddress, fail: $fail) {
//       ...CreatedAdmin
//     }
//   }
//   ${ADMIN_FRAGMENT}
// `;

export const CREATE_ADMIN5 = gql`
  mutation CreateTestAdmin5(
    $emailAddress: String!
    $fail: Boolean!
    $noContext: Boolean!
  ) {
    createTestAdministrator5(
      emailAddress: $emailAddress
      fail: $fail
      noContext: $noContext
    ) {
      ...CreatedAdmin
    }
  }
  ${ADMIN_FRAGMENT}
`;

export const CREATE_N_ADMINS = gql`
  mutation CreateNTestAdmins(
    $emailAddress: String!
    $failFactor: Float!
    $n: Int!
  ) {
    createNTestAdministrators(
      emailAddress: $emailAddress
      failFactor: $failFactor
      n: $n
    ) {
      ...CreatedAdmin
    }
  }
  ${ADMIN_FRAGMENT}
`;

export const CREATE_N_ADMINS2 = gql`
  mutation CreateNTestAdmins2(
    $emailAddress: String!
    $failFactor: Float!
    $n: Int!
  ) {
    createNTestAdministrators2(
      emailAddress: $emailAddress
      failFactor: $failFactor
      n: $n
    ) {
      ...CreatedAdmin
    }
  }
  ${ADMIN_FRAGMENT}
`;

export const VERIFY_TEST = gql`
  query VerifyTest {
    verify {
      administrators {
        id
        emailAddress
      }
      users {
        id
        identifier
      }
    }
  }
`;
