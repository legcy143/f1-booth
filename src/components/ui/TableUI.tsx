'use client';
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  getKeyValue,
  Skeleton,
  cn,
  Select,
  SelectItem,
} from '@heroui/react';
import { debounce } from 'lodash';
import { LuChevronDown, LuSearch } from 'react-icons/lu';


function Capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export interface columnInterface {
  uid: string;
  name: string;
  sortable?: boolean;
  className?: string;
}

interface statusOptionsInterface {
  uid: string;
  name: string;
}

interface tableDataInterface extends Record<any, any> {
  _id: string | number;
}

interface TableProps {
  isLoading?: boolean;
  title: string;
  columns: columnInterface[];
  tableData: tableDataInterface[];
  statusOptions: statusOptionsInterface[];
  INITIAL_VISIBLE_COLUMNS?: string[];
  TotalNumberOfData?: number;
  isAsynchronousPageChange?: boolean;
  renderCell?: (
    item: tableDataInterface,
    columnKey: string | number,
  ) => React.ReactNode;
  onPageChange?: (pagenumber: number) => void;
  currentPage?: number;
  action?: React.ReactNode;
  disabledSearchkeys?: string[];
  icon?: string;
  headerTitle?: string;
  headerAccumulate?: boolean;
  setSelectedTableRows?: Dispatch<SetStateAction<any>>;
  className?: string;
  searchByVariable?: string;
  selectionMode?: 'multiple' | 'none' | 'single';
  disabledKeys?: string[];
  searchBySelect?: boolean;
  isServerSideSearch?: boolean;
  numberOfDataPerPage?: number;
  setNumberOfDataPerPage?: (num: number) => void;
  onServerSideSearchChange?: (searchTerm: string, searchBy: string) => void;
  onSearchByChange?: (value: string) => void;
  debounceTime?: number;
}

function TableUI({
  isLoading = false,
  TotalNumberOfData,
  action,
  title,
  isAsynchronousPageChange = false,
  columns,
  tableData,
  statusOptions,
  renderCell,
  INITIAL_VISIBLE_COLUMNS,
  icon,
  disabledSearchkeys = [],
  headerTitle,
  searchByVariable = 'name',
  headerAccumulate = false,
  className,
  setSelectedTableRows,
  selectionMode = 'multiple',
  disabledKeys = [],
  onPageChange,
  searchBySelect = false,
  currentPage = 1,
  numberOfDataPerPage = 10,
  setNumberOfDataPerPage,
  onServerSideSearchChange,
  isServerSideSearch = false,
  onSearchByChange,
  debounceTime = 300,
}: TableProps) {
  const GetInitialVisibleColumns = React.useMemo(() => {
    let arr: string[] = [];
    columns.forEach((column) => {
      arr.push(column.uid);
    });
    return arr;
  }, [columns]);
  const INITIAL_VISIBLE_COLUMNS_LOCAL =
    INITIAL_VISIBLE_COLUMNS || GetInitialVisibleColumns;

  const [searchBy, setSearchBy] = useState(searchByVariable);
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS_LOCAL),
  );
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: 'ascending' | 'descending';
  }>({
    column: 'age',
    direction: 'ascending',
  });

  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    if (INITIAL_VISIBLE_COLUMNS) {
      setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS));
    } else {
      setVisibleColumns(new Set(GetInitialVisibleColumns));
    }
  }, [INITIAL_VISIBLE_COLUMNS]);

  useEffect(() => {
    setSelectedKeys(new Set());
  }, [tableData]);

  useEffect(() => {
    if (setSelectedTableRows) {
      setSelectedTableRows(selectedKeys);
    }
  }, [selectedKeys]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.size === columns.length || headerAccumulate) {
      return columns;
    }
    // console.log("columns", columns)
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns, columns]);

  const filteredItems = React.useMemo(() => {
    // For server-side search and pagination, return tableData as-is
    if (isServerSideSearch || isAsynchronousPageChange) return tableData;

    let filteredUsers = [...tableData];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((data) =>
        data[searchBy]?.toLowerCase()?.includes(filterValue?.toLowerCase()),
      );
    }
    if (
      typeof statusFilter === 'string' && statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((data) => {
        console.log("stattusFilter", statusFilter);
        console.log("data", data?.status);
        return Array.from(statusFilter.split(',')).includes(data?.status as string);
      });
      console.log("data", filteredUsers);
    }

    return filteredUsers;
  }, [tableData, filterValue, statusFilter, searchBy, isServerSideSearch, isAsynchronousPageChange]);

  const pages = TotalNumberOfData
    ? Math.ceil(TotalNumberOfData / numberOfDataPerPage)
    : Math.ceil(filteredItems.length / numberOfDataPerPage);

  // For server-side pagination, use tableData directly
  // For client-side pagination, slice the data
  const items = React.useMemo(() => {
    if (isAsynchronousPageChange || isServerSideSearch) {
      return filteredItems;
    }
    
    const start = ((currentPage || 1) - 1) * numberOfDataPerPage;
    const end = start + numberOfDataPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, numberOfDataPerPage, currentPage, isAsynchronousPageChange, isServerSideSearch]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const column = sortDescriptor.column as keyof typeof a;
      const first = a[column];
      const second = b[column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = React.useCallback(() => {
    const nextPage = (currentPage || 1) + 1;
    if (nextPage <= pages && onPageChange) {
      onPageChange(nextPage);
    }
  }, [currentPage, pages, onPageChange]);

  const onPreviousPage = React.useCallback(() => {
    const prevPage = (currentPage || 1) - 1;
    if (prevPage >= 1 && onPageChange) {
      onPageChange(prevPage);
    }
  }, [currentPage, onPageChange]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLimit = Number(e.target.value);
      if (setNumberOfDataPerPage) {
        setNumberOfDataPerPage(newLimit);
      }
      // Reset to page 1 when changing items per page
      if (onPageChange) {
        onPageChange(1);
      }
    },
    [setNumberOfDataPerPage, onPageChange],
  );

  // debounce for async search query
  const debouncedSearch = React.useMemo(() => {
    return debounce((value: string) => {
      if (onServerSideSearchChange) {
        // extract value and searchby on the TableUI
        onServerSideSearchChange(value, searchBy);
      }
    }, debounceTime);
  }, [searchBy, debounceTime]);

  const onSearchChange = React.useCallback(
    (value: string) => {
      if (value) {
        setFilterValue(value);
        // for async search query operation
        if (isServerSideSearch) {
          debouncedSearch(value);
        }
        // Reset to page 1 for new search unless it's async pagination
        if (!isAsynchronousPageChange && onPageChange) {
          onPageChange(1);
        }
      } else {
        setFilterValue('');
        // if empty value
        if (isServerSideSearch && onServerSideSearchChange) {
          debouncedSearch('');
        }
      }
    },
    [isServerSideSearch, isAsynchronousPageChange, debouncedSearch, onPageChange],
  );

  const onClear = React.useCallback(() => {
    setFilterValue('');
    // Reset to page 1 on clear
    if (onPageChange) {
      onPageChange(1);
    }
  }, [onPageChange]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        {headerTitle && (
          <header className={cn('flex items-center gap-3 p-2')}>
            <h1 className="text-xl font-semibold">{title}</h1>
          </header>
        )}
        <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between gap-3 ">
          <div className="flex flex-[2] sm:flex-row flex-col sm:items-center gap-2">
            <Input
              isClearable
              className={`w-full flex-[1/2] ${!searchBySelect && 'md:max-w-[44%]'} `}
              placeholder={`Search by ${searchBy}...`}
              startContent={<LuSearch />}
              value={filterValue}
              isDisabled={!searchBy}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            {searchBySelect && (
              <Select
                className="sm:max-w-40 w-full"
                aria-label="search by"
                placeholder="Select search by"
                disabledKeys={['action', ...disabledSearchkeys]}
                isDisabled={isLoading}
                disallowEmptySelection={filterValue.length > 0}
                selectedKeys={[
                  searchBy,
                  // columns.find((col) => col.uid === searchBy)?.uid || '',
                ]}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                  if (onSearchByChange) onSearchByChange(e.target.value);
                }}
              >
                {columns.map((col, index) => {
                  return <SelectItem key={col.uid}>{col.name}</SelectItem>;
                })}
              </Select>
            )}
          </div>
          <div className="flex sm:flex-row flex-col gap-3">
            {statusOptions?.length > 0 && (
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    isDisabled={isLoading} // disabled on loading
                    endContent={<LuChevronDown className="text-small" />}
                    variant="flat"
                  >
                    Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={statusFilter.split(',')}
                  selectionMode="multiple"
                  onChange={(keys) =>
                    console.log("keys from on change", keys)
                  }
                  onSelectionChange={(keys) => {
                    console.log("keys from on selection change", keys);
                    setStatusFilter(Array.from(keys).join(',')) 
                  }}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {Capitalize(status.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<LuChevronDown className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setVisibleColumns(new Set(Array.from(keys) as string[]))
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {Capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {action}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {TotalNumberOfData ?? tableData.length}{" "}{title}
          </span>
          <div className="flex items-center gap-2">
            <label
              htmlFor="tableSearch"
              // disable state on loading or on searching
              className={cn(
                'flex items-center text-default-400 text-small',
                ((isServerSideSearch && filterValue.length > 0) || isLoading) &&
                'text-opacity-disabled',
              )}
            >
              Rows per page:
            </label>
            <select
              id="tableSearch"
              // disable state on loading or on searching
              disabled={
                (isServerSideSearch && filterValue.length > 0) || isLoading
              }
              className="bg-transparent outline-none text-default-400 text-small"
              value={numberOfDataPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    isServerSideSearch,
    visibleColumns,
    // onRowsPerPageChange,
    numberOfDataPerPage,
    columns,
    tableData.length,
    onSearchChange,
    hasSearchFilter,
    searchBy,
    isLoading,
    disabledSearchkeys,
    searchBySelect,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div
        className={cn(
          'py-2 px-2 flex justify-between items-center',
          selectionMode === 'none' && 'justify-center sm:justify-between',
        )}
      >
        {selectionMode !== 'none' ? (
          <span className="w-[30%] text-small text-default-400">
            {selectedKeys.size === items.length
              ? 'All items selected'
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
          </span>
        ) : (
          <span className="sm:w-[30%] sm:block hidden" />
        )}
        <Pagination
          isDisabled={isLoading}
          // hidden on empty values on search
          hidden={
            (filterValue.length > 0 &&
              (tableData.length === 0 || sortedItems.length === 0)) ||
            tableData.length == 0 ||
            sortedItems.length == 0
          }
          classNames={{
            cursor:
              'bg-gradient-to-b shadow-lg from-primary-300 to-primary-700 dark:from-default-300 dark:to-default-100 text-white font-bold',
          }}
          isCompact
          showControls
          showShadow
          color="primary"
          page={currentPage || 1}
          total={pages}
          onChange={(e) => {
            if (onPageChange) onPageChange(e);
          }}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            // disable state on loading or no values
            isDisabled={
              pages === 1 ||
              isLoading ||
              tableData.length === 0 ||
              sortedItems.length === 0
            }
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            // disable state on loading or no values
            isDisabled={
              pages === 1 ||
              isLoading ||
              tableData.length === 0 ||
              sortedItems.length === 0
            }
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    items.length,
    sortedItems,
    currentPage,
    pages,
    tableData,
    hasSearchFilter,
    isServerSideSearch,
    filterValue,
    isLoading,
  ]);

  return (
    <Table
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      className={cn('h-full', className)}
      aria-labelledby="Tableui"
      classNames={{
        wrapper: 'p-4 border',
        // thead: '-top-3',
        // th: 'h-[3rem]',
      }}
      selectedKeys={selectedKeys}
      disabledKeys={disabledKeys}
      selectionMode={selectionMode}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={(keys: any) => {
        if (keys === 'all') {
          const keysSet = new Set();
          sortedItems.forEach((item, i) => {
            if (i < numberOfDataPerPage) {
              keysSet.add(item._id);
            }
            return;
          });
          // if (setSelectedTableRows) {
          //   setSelectedTableRows(keysSet);
          // }
          setSelectedKeys(keysSet as any);
        } else {
          // if (setSelectedTableRows) {
          //   setSelectedTableRows(keys);
          // }
          setSelectedKeys(keys as any);
        }
      }}
      onSortChange={(descriptor: any) =>
        setSortDescriptor(
          descriptor as {
            column: string;
            direction: 'ascending' | 'descending';
          },
        )
      }
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            className={column?.className}
            key={column.uid}
            align={'center'}
            allowsSorting={column.sortable}
          >
            {Capitalize(column.name)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingState={isLoading ? 'loading' : 'idle'}
        loadingContent={
          // change the loading to one full scale skeleton
          <Skeleton className="w-full h-full rounded-xl">Loading</Skeleton>
        }
        emptyContent={<>No {title} found</>}
        items={!isLoading ? sortedItems : []}
      >
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell key={`${item._id}-${columnKey}`}>
                {renderCell
                  ? renderCell(item, columnKey)
                  : getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
export default memo(TableUI);