/* import { useState, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import {

  ListGroupItem,
  Button,
} from 'react-bootstrap';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { v4 as uuid } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Container } from 'react-bootstrap/lib/Tab';

interface TodoItem {
  id: string;
  text: string;
  nodeRef: RefObject<HTMLLIElement>;
}

function TodoList() {
  const [items, setItems] = useState<TodoItem[]>(() => [
    {
      id: uuid(),
      text: 'Buy eggs',
      nodeRef: createRef<HTMLLIElement>(),
    },
    {
      id: uuid(),
      text: 'Pay bills',
      nodeRef: createRef<HTMLLIElement>(),
    },
    {
      id: uuid(),
      text: 'Invite friends over',
      nodeRef: createRef<HTMLLIElement>(),
    },
    {
      id: uuid(),
      text: 'Fix the TV',
      nodeRef: createRef<HTMLLIElement>(),
    },
  ]);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <ListGroupItem style={{ marginBottom: '1rem' }}>
        <TransitionGroup className="todo-list">
          {items.map(({ id, text, nodeRef }) => (
            <CSSTransition
              key={id}
              nodeRef={nodeRef}
              timeout={500}
              classNames="item"
            >
              <ListGroupItem itemRef='nodef'>
                <Button
                  className="remove-btn"
                  sizes="sm"
                  onClick={() =>
                    setItems((items) =>
                      items.filter((item) => item.id !== id)
                    )
                  }
                >
                  &times;
                </Button>
                {text}
              </ListGroupItem>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListGroupItem>
      <Button
        onClick={() => {
          const text = prompt('Enter some text');
          if (text) {
            setItems((items) => [
              ...items,
              {
                id: uuid(),
                text,
                nodeRef: createRef<HTMLLIElement>(),
              },
            ]);
          }
        }}
      >
        Add Item
      </Button>
    </Container>
  );
}

const container = document.getElementById('root');
ReactDOM.render(<TodoList />, container); // Use ReactDOM.render instead of createRoot.render

export default TodoList; */

const example = () => {
    return (
        <div>
        
        </div>
    )
    }