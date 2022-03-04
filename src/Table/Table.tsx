import { ArrowLeftIcon, ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Table as CTable,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Checkbox,
  Text,
  Button,
} from "@chakra-ui/react";
import e from "express";

import React, { Dispatch, SetStateAction, useState } from "react";

import { ToDoItem } from "../types/ToDoItem";

interface TableProps {
  data: ToDoItem[];
  pageSize: number;
  setToDoItems: Dispatch<SetStateAction<ToDoItem[]>>;
  comparatorFunction?: (
    value: ToDoItem,
    index: number,
    array: ToDoItem[]
  ) => boolean;
}

export function Table({
  data,
  pageSize,
  setToDoItems,
  comparatorFunction,
}: TableProps): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<"asc" | "dcs" | "none">("none");

  function handleToggleItem(id: number, index: number): void {
    async function toggleItem() {
      const response = await fetch(`http://localhost:5000/items/${id}/toggle`, {
        method: "PUT",
      });
      setToDoItems((prev) => [
        ...prev.slice(0, index),
        { ...prev[index], completed: !prev[index].completed },
        ...prev.slice(index + 1),
      ]);
    }
    toggleItem();
  }

  function handleDeleteItem(id: number, index: number): void {
    async function deleteItem() {
      const response = await fetch(`http://localhost:5000/items/${id}`, {
        method: "DELETE",
      });
      setToDoItems((prev) => [
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ]);
    }

    deleteItem();
  }

  function sortData() {
    if (sortType === "none" || sortType === "asc") {
      setToDoItems((prev) => {
        prev.sort((a, b) => {
          return a.description == b.description
            ? 0
            : a.description < b.description
            ? -1
            : 1;
        });

        return prev;
      });
      setSortType("dcs");
    } else {
      setToDoItems((prev) => {
        prev.sort((a, b) => {
          return a.description == b.description
            ? 0
            : a.description < b.description
            ? 1
            : -1;
        });

        return prev;
      });

      setSortType("asc");
    }
  }

  function filterData() {
    if (comparatorFunction)
      setToDoItems((prev) => prev.filter(comparatorFunction));
  }

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="row">
        <Button alignSelf="flex-start" onClick={() => sortData()}>
          Sort
        </Button>
        {comparatorFunction && (
          <Button alignSelf="flex-start" onClick={() => filterData()}>
            Filter
          </Button>
        )}
      </Flex>
      <CTable variant="striped">
        <Thead>
          <Tr>
            <Th>Status</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => {
            if (
              index >= (currentPage - 1) * pageSize &&
              index < currentPage * pageSize
            ) {
              return (
                <Tr key={index}>
                  <Td>
                    <Checkbox
                      isChecked={item.completed}
                      onChange={() => handleToggleItem(item.id, index)}
                      width={100}
                      px={6}
                      py={4}
                    />
                  </Td>
                  <Td>{item.description}</Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete this item"
                      onClick={() => handleDeleteItem(item.id, index)}
                      size="xs"
                      background="gray.600"
                      _hover={{ bg: "red.600" }}
                      color="white"
                    />
                  </Td>
                </Tr>
              );
            }
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td colSpan={3}>
              <Flex justifyContent="center" alignItems="center">
                <IconButton
                  aria-label="previous-page"
                  size="sm"
                  icon={<ArrowLeftIcon />}
                  onClick={() => {
                    if (currentPage !== 1) setCurrentPage((prev) => prev - 1);
                  }}
                />
                <Text mx="8px">{currentPage}</Text>
                <IconButton
                  aria-label="next-page"
                  size="sm"
                  icon={<ArrowRightIcon />}
                  onClick={() => {
                    if (currentPage !== Math.ceil(data.length / pageSize))
                      setCurrentPage((prev) => prev + 1);
                  }}
                />
              </Flex>
            </Td>
          </Tr>
        </Tfoot>
      </CTable>
    </Flex>
  );
}
