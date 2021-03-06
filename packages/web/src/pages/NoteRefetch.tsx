import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { createRefetchContainer, RelayRefetchProp } from 'react-relay';
import { toast } from 'react-toastify';

// @ts-ignore
import graphql from 'babel-plugin-relay/macro';

import { Container, Content } from './styles/RefetchStyles';

import createQueryRenderer from '../golden-stack/createQueryRenderer';

import { NoteRefetch_query } from './__generated__/NoteRefetch_query.graphql';

interface RelayProps {
  query: NoteRefetch_query;
  relay: RelayRefetchProp;
  isLoading: boolean;
}

let qTerms = '';
function NoteRefetch(props: RelayProps) {
  const [terms, setTerms] = useState('');
  const [count, setCount] = useState(12);

  useEffect(() => {
    toast.info(
      "Whenever you get to the list's bottom you can scroll up to load more todos"
    );
  }, []);

  function loadMore() {
    if (!props.isLoading) {
      props.relay.refetch(
        { search: qTerms, first: count },
        null,
        () => {
          setCount(count + 3);
        },
        { force: true }
      );
    }
  }

  window.onscroll = () => {
    if (window.scrollY <= 40) {
      loadMore();
    }
  };

  useEffect(() => {
    qTerms = terms;
    loadMore();
  }, [terms]);

  return (
    <Container>
      <Content>
        <input
          type="text"
          value={terms}
          onChange={e => setTerms(e.target.value)}
          placeholder="query by title"
        />
        <button className="loadbutton" onClick={() => loadMore()} type="button">
          load more
        </button>
        {props?.query.notes.edges.map(item => (
          <div key={item?.node?.id}>
            <Link to={`/notes/${item?.node?.id}`}>
              <button type="button">{item?.node?.title}</button>
            </Link>
          </div>
        ))}
      </Content>
    </Container>
  );
}

const NoteRefetchContainer = createRefetchContainer(
  NoteRefetch,
  {
    query: graphql`
      fragment NoteRefetch_query on Query {
        notes(first: $first, search: $search)
          @connection(key: "Refetch_notes") {
          edges {
            node {
              id
              _id
              content
              title
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  },
  graphql`
    query NoteRefetchPaginationQuery($first: Int, $search: String) {
      ...NoteRefetch_query
    }
  `
);

const Renderer = createQueryRenderer(NoteRefetchContainer, NoteRefetch, {
  query: graphql`
    query NoteRefetchQuery($first: Int, $search: String) {
      ...NoteRefetch_query
    }
  `,
  variables: { first: 9, search: qTerms },
});

export default Renderer;
