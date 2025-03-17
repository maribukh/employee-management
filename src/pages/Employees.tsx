import { useEffect, useState } from "react";
import EmployeeForm from "../pages/EmployeeForm";
import { getEmployees, addEmployee, deleteEmployee } from "../api/employees";
import { Employee } from "../types";

const Employees = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployeeList(data);
      setFilteredEmployees(data);
    };
    fetchEmployees();
  }, []);

  // Search and Filter Function
  useEffect(() => {
    let filtered = employeeList;

    if (searchQuery) {
      filtered = filtered.filter((emp) =>
        String(emp.name).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDepartment !== "All") {
      filtered = filtered.filter(
        (emp) => emp.department === selectedDepartment
      );
    }

    setFilteredEmployees(filtered);
  }, [searchQuery, selectedDepartment, employeeList]);

  // Sorting function
  const sortByName = () => {
    const sortedEmployees = [...filteredEmployees].sort((a, b) =>
      String(a.name).localeCompare(String(b.name))
    );
    setFilteredEmployees(sortedEmployees);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Add employee via API
  const handleAddEmployee = async (newEmployee: Omit<Employee, "id">) => {
    const addedEmployee = await addEmployee(newEmployee);
    setEmployeeList([...employeeList, addedEmployee]);
  };

  // Delete employee via API
  const handleDeleteEmployee = async (id: number) => {
    await deleteEmployee(id);
    setEmployeeList(employeeList.filter((emp) => emp.id !== id));
  };

  // Enable edit mode
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  // Handle edit form submission
  const handleSaveEdit = () => {
    if (editingEmployee) {
      setEmployeeList(
        employeeList.map((emp) =>
          emp.id === editingEmployee.id ? editingEmployee : emp
        )
      );
      setEditingEmployee(null);
    }
  };

  // Get unique departments for filter dropdown
  const departmentOptions = [
    "All",
    ...new Set(employeeList.map((emp) => emp.department)),
  ];

  return (
    <div className="container">
      <h1>Employee Management</h1>

      <EmployeeForm onAddEmployee={handleAddEmployee} />

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedDepartment || "All"}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departmentOptions.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <button onClick={sortByName}>
          Sort by Name {sortOrder === "asc" ? "▲" : "▼"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Position</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>
                {editingEmployee?.id === emp.id ? (
                  <input
                    type="text"
                    value={editingEmployee.name ?? ""}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  emp.name
                )}
              </td>
              <td>{emp.age}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              <td>
                {editingEmployee?.id === emp.id ? (
                  <button onClick={handleSaveEdit}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(emp)}>Edit</button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
