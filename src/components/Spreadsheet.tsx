import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Filter,
  Download,
  Upload,
  Share2,
  Plus,
  Eye,
  Grid3X3,
  MoreHorizontal,
  Info,
} from "lucide-react";

// React Table hook simulation (simplified version)
interface Column {
  Header: React.ReactNode | (() => React.ReactNode);
  accessor: string;
  width?: number;
  minWidth?: number;
  canSort?: boolean;
  Cell?: (props: { value: any; row: any }) => React.ReactNode;
  render?: (type: string) => React.ReactNode;
}

interface UseTableProps {
  columns: Column[];
  data: any[];
}

interface SortBy {
  id: string;
  desc: boolean;
}

const useTable = ({ columns, data }: UseTableProps) => {
  const [sortBy, setSortBy] = useState<SortBy[]>([]);

  const getTableProps = () => ({
    role: "table",
  });

  const getTableBodyProps = () => ({
    role: "rowgroup",
  });

  const headerGroups = [
    {
      headers: columns.map((column, index) => ({
        ...column,
        getHeaderProps: () => ({
          key: `header-${index}`,
          onClick: column.canSort
            ? () => {
                const isDesc = sortBy.find(
                  (s: SortBy) => s.id === column.accessor
                )?.desc;
                setSortBy([{ id: column.accessor, desc: !isDesc }]);
              }
            : undefined,
        }),
        getSortByToggleProps: () => ({
          title: column.canSort ? "Toggle sort" : undefined,
        }),
        isSorted: sortBy.some((s: SortBy) => s.id === column.accessor),
        isSortedDesc:
          sortBy.find((s: SortBy) => s.id === column.accessor)?.desc || false,
      })),
    },
  ];

  const rows = data.map((rowData, index) => ({
    original: rowData,
    getRowProps: () => ({
      key: `row-${index}`,
    }),
    cells: columns.map((column, cellIndex) => ({
      column,
      value: rowData[column.accessor],
      getCellProps: () => ({
        key: `cell-${index}-${cellIndex}`,
      }),
      render: (type: string) => {
        if (type === "Cell" && column.Cell) {
          return column.Cell({
            value: rowData[column.accessor],
            row: { original: rowData },
          });
        }
        return rowData[column.accessor];
      },
    })),
  }));

  return {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  };
};

const SpreadsheetUI = () => {
  const [activeTab, setActiveTab] = useState("All Orders");

  const data = useMemo(
    () => [
      {
        id: 1,
        jobRequest: "Launch social media campaign for pro...",
        submitted: "15-11-2024",
        status: "In-process",
        submitter: "Aisha Patel",
        url: "www.aishapatel...",
        assigned: "Sophie Choudhury",
        priority: "Medium",
        dueDate: "20-11-2024",
        estValue: "6,200,000",
      },
      {
        id: 2,
        jobRequest: "Update press kit for company redesign",
        submitted: "28-10-2024",
        status: "Need to start",
        submitter: "Irfan Khan",
        url: "www.irfankhan...",
        assigned: "Tejas Pandey",
        priority: "High",
        dueDate: "30-10-2024",
        estValue: "3,500,000",
      },
      {
        id: 3,
        jobRequest: "Finalize user testing feedback for app...",
        submitted: "05-12-2024",
        status: "In-process",
        submitter: "Mark Johnson",
        url: "www.markjohns...",
        assigned: "Rachel Lee",
        priority: "Medium",
        dueDate: "10-12-2024",
        estValue: "4,750,000",
      },
      {
        id: 4,
        jobRequest: "Design new features for the website",
        submitted: "10-01-2025",
        status: "Complete",
        submitter: "Emily Green",
        url: "www.emilygreen...",
        assigned: "Tom Wright",
        priority: "Low",
        dueDate: "15-01-2025",
        estValue: "5,900,000",
      },
      {
        id: 5,
        jobRequest: "Prepare financial report for Q4",
        submitted: "25-01-2025",
        status: "Blocked",
        submitter: "Jessica Brown",
        url: "www.jessicabro...",
        assigned: "Kevin Smith",
        priority: "Low",
        dueDate: "30-01-2025",
        estValue: "2,800,000",
      },
      // Add empty rows for the remaining rows (6-25)
      ...Array.from({ length: 20 }, (_, i) => ({
        id: 6 + i,
        jobRequest: "",
        submitted: "",
        status: "",
        submitter: "",
        url: "",
        assigned: "",
        priority: "",
        dueDate: "",
        estValue: "",
      })),
    ],
    []
  );

  const StatusCell = ({ value }: { value: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "In-process":
          return "bg-yellow-100 text-yellow-800";
        case "Need to start":
          return "bg-gray-100 text-gray-800";
        case "Complete":
          return "bg-green-100 text-green-800";
        case "Blocked":
          return "bg-red-100 text-red-800";
        default:
          return "";
      }
    };

    if (!value) return <span></span>;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}
      >
        {value}
      </span>
    );
  };

  const PriorityCell = ({ value }: { value: string }) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "High":
          return "text-red-600 font-medium";
        case "Medium":
          return "text-yellow-600 font-medium";
        case "Low":
          return "text-blue-600 font-medium";
        default:
          return "text-gray-600";
      }
    };

    return <span className={getPriorityColor(value)}>{value}</span>;
  };

  const URLCell = ({ value }: { value: string }) => {
    if (!value) return <span></span>;

    return (
      <span className="text-blue-600 hover:underline cursor-pointer">
        {value}
      </span>
    );
  };

  const ValueCell = ({ value }: { value: string }) => {
    if (!value) return <span></span>;

    return <span className="text-gray-700">{value} ₹</span>;
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        width: 32,
        Cell: ({
          value,
          row: _row,
        }: {
          value: number;
          row: { original: any };
        }) => {
          // Special handling for row 8 (index 7) to show the highlighted cell
          if (value === 8) {
            return (
              <div className="flex">
                <span className="text-gray-400 mr-2">{value}</span>
              </div>
            );
          }
          return <span className="text-gray-400">{value}</span>;
        },
      },
      {
        Header: () => (
          <div className="flex items-center space-x-1">
            <span>Job Request</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        ),
        accessor: "jobRequest",
        minWidth: 300,
        canSort: true,
        Cell: ({ value }: { value: string; row: { original: any } }) => {
          // Special handling for row 8 to show highlighted cell
          
          return <span className="text-gray-900">{value}</span>;
        },
      },
      {
        Header: () => (
          <div className="flex items-center space-x-1">
            <span>Submitted</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        ),
        accessor: "submitted",
        width: 96,
        canSort: true,
        Cell: ({ value }: { value: string }) => (
          <span className="text-gray-700">{value}</span>
        ),
      },
      {
        Header: () => (
          <div className="flex items-center space-x-1">
            <span>Status</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        ),
        accessor: "status",
        width: 96,
        canSort: true,
        Cell: StatusCell,
      },
      {
        Header: () => (
          <div className="flex items-center space-x-1">
            <span>Submitter</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        ),
        accessor: "submitter",
        width: 112,
        canSort: true,
        Cell: ({ value }: { value: string }) => (
          <span className="text-gray-700">{value}</span>
        ),
      },
      {
        Header: () => (
          <div className="flex items-center space-x-1">
            <span>URL</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        ),
        accessor: "url",
        width: 112,
        canSort: true,
        Cell: URLCell,
      },
      {
        Header: () => (
          <div className="flex items-center space-x-1">
            <span>Assigned</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        ),
        accessor: "assigned",
        width: 128,
        canSort: true,
        Cell: ({ value }: { value: string }) => (
          <span className="text-gray-700">{value}</span>
        ),
      },
      {
        Header: "Priority",
        accessor: "priority",
        width: 80,
        Cell: PriorityCell,
      },
      {
        Header: "Due Date",
        accessor: "dueDate",
        width: 96,
        Cell: ({ value }: { value: string }) => (
          <span className="text-gray-700">{value}</span>
        ),
      },
      {
        Header: () => (
          <div className="flex items-center space-x-1">
            <span>Est. Value</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        ),
        accessor: "estValue",
        width: 96,
        canSort: true,
        Cell: ValueCell,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows } = useTable({
    columns,
    data,
  });

 
};

export default SpreadsheetUI;
