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

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
            <span>Workspace</span>
            <ChevronDown className="w-3 h-3" />
            <span>Folder 2</span>
            <ChevronDown className="w-3 h-3" />
            <span className="text-gray-900 font-medium">Spreadsheet 3</span>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search within sheet"
                className="pl-9 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                1
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6 text-gray-600" />
              <div className="text-sm">
                <div className="font-medium">John Doe</div>
                <div className="text-gray-500 text-xs">john.doe...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span>Tool bar</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Hide fields</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Grid3X3 className="w-4 h-4" />
              <span>Sort</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Grid3X3 className="w-4 h-4" />
              <span>Cell view</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800" onClick={() => alert('Import button clicked!')}>
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800" onClick={() => alert('Export button clicked!')}>
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800" onClick={() => alert('Share button clicked!')}>
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1" onClick={() => alert('New Action button clicked!')}>
              <Plus className="w-4 h-4" />
              <span>New Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {/* <div className="w-64 bg-white border-r min-h-screen">
          <div className="p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">Q3</span>
              </div>
              <span>Q3 Financial Overview</span>
              <Info className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2 py-1">
                <span className="text-gray-400">#</span>
                <span>Job Request</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Table Area */}
        <div className="flex-1">
          {/* Action Buttons Row */}
          {/* <div className="bg-gray-100 p-2 flex space-x-2">
            <button className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">ABC</button>
            <button className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">Answer a question</button>
            <button className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm">Extract</button>
            <button className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div> */}

          {/* React Table */}
          <div className="overflow-x-auto">
            <table {...getTableProps()} className="w-full bg-white">
              <thead className="bg-gray-50 border-b">
                {/* Grouped header row */}
                <tr className="h-12">
                  <th
                    className="bg-white border-r border-dashed border-gray-300"
                    colSpan={1}
                  ></th>
                  <th colSpan={5} className=" bg-gray-200">
                    <div className="flex text-gray-700">
                      <div className="w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">Q3</span>
                      </div>
                      <span>Financial Overview <Info className="w-4 h-4 text-orange-500 inline-flex" /></span>
                      
                    </div>
                  </th>
                  <th
                    className="bg-green-100 text-green-800 font-semibold border-r border-dashed border-green-400 text-center"
                    colSpan={1}
                  >
                    ABC
                  </th>
                  <th
                    className="bg-purple-100 text-purple-800 font-semibold border-r border-dashed border-purple-400 text-center"
                    colSpan={2}
                  >
                    Answer a question
                  </th>
                  <th
                    className="bg-orange-100 text-orange-800 font-semibold border-r border-dashed border-orange-400 text-center"
                    colSpan={1}
                  >
                    Extract
                  </th>
                  <th className="bg-white" colSpan={1}></th>
                </tr>
                {/* Column header row */}
                {headerGroups.map((headerGroup) => (
                  <tr key="header-row" className="text-sm text-gray-600">
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="text-left py-2 px-2 font-medium border border-gray-200 "
                        style={{
                          width: column.width,
                          minWidth: column.minWidth,
                        }}
                      >
                        <div
                          className={`${
                            column.canSort ? "cursor-pointer select-none" : ""
                          }`}
                        >
                          {typeof column.render === "function"
                            ? column.render("Header")
                            : typeof column.Header === "function"
                            ? column.Header()
                            : column.Header}
                          {column.canSort && (
                            <span className="ml-1">
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => (
                  <tr
                    {...row.getRowProps()}
                    className="border-b hover:bg-gray-50 text-sm text-justify-between"
                  > 
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="py-2 px-3 border border-gray-200"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Tabs */}
          <div className="bg-white border-t fixed bottom-0 w-full">
            <div className="flex">
              {["All Orders", "Pending", "Reviewed", "Arrived"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); alert(tab + ' tab clicked!'); }}
                  className={`px-4 py-2 text-sm border-r ${
                    activeTab === tab
                      ? "bg-green-100 text-green-800 border-b-2 border-green-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button className="px-2 py-2 text-gray-400 hover:text-gray-600" onClick={() => alert('Plus tab button clicked!')}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetUI;
