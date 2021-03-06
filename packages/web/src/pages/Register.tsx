import React, { useState } from 'react';
import { commitMutation } from 'react-relay';
// @ts-ignore
import graphql from 'babel-plugin-relay/macro';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Content } from './styles/AuthStyles';
import environment from '../environment';
import history from '../routes/history';

const mutation = graphql`
  mutation RegisterMutation($input: createUserInput!) {
    createUser(input: $input) {
      userEdge {
        node {
          username
        }
      }
    }
  }
`;

function commit(username: string, email: string, password: string) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { username, email, password },
    },
    onCompleted: (_, errors) => {
      if (errors) {
        toast.error('😔 Something went wrong, please try again later');
        return;
      }
      toast.success('🚀 Successfully registered, please sign in!');
      history.push('/login');
    },
  });
}

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Container>
      <Content>
        <form>
          <img src="https://i.imgur.com/8BlGgfV.png" alt="Register" />
          <span>Username:</span>
          <input
            name="username"
            placeholder="cooluser"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <span>Email:</span>
          <input
            name="email"
            placeholder="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <span>Password:</span>
          <input
            name="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => commit(username, email, password)}
          >
            Register
          </button>
        </form>
        <p>
          <Link to="/login">Already have an account? Log in</Link>
        </p>
      </Content>
    </Container>
  );
}
