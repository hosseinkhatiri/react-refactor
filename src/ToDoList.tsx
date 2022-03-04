import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  List,
  ListItem,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { SyntheticEvent, useEffect, useState } from "react";

import { ToDoItem } from "./types/ToDoItem";
import Table from "./Table";

function ToDoList() {
  const [toDoItems, setToDoItems] = useState<ToDoItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState<string>("");

  useEffect(() => {
    async function getItems() {
      const res = await fetch("http://localhost:5000/items");
      const data = await res.json();
      if (data) setToDoItems(data);
    }
    getItems();
  }, []);

  function handleSubmitNewItem(event: SyntheticEvent): void {
    event.preventDefault();
    async function createItem() {
      const response = await fetch("http://localhost:5000/items", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newItemDescription }),
      });
      const data = await response.json();
      if (data) {
        setToDoItems((prev) => [...prev, data]);
        setNewItemDescription("");
      }
    }

    createItem();
  }


  return (
    <>
      <Center>
        <Box p={4} width="640px">
          <Heading>To-Do List</Heading>
        </Box>
      </Center>

      <Center>
        <Box width="640px">
          <Table
            data={toDoItems}
            pageSize={10}
            comparatorFunction={(x) => x.description.length > 2}
            {...{ setToDoItems }}
          />
        </Box>
      </Center>

      <Center>
        <Box p={4} width="640px" bg="gray.50">
          <form onSubmit={handleSubmitNewItem}>
            <Flex>
              <FormControl>
                <Input
                  id="new-item"
                  type="text"
                  placeholder="Enter a new to-do item"
                  autoFocus
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                />
              </FormControl>
              <Button type="submit" marginLeft={2}>
                Submit
              </Button>
            </Flex>
          </form>
        </Box>
      </Center>
    </>
  );
}

export default ToDoList;
