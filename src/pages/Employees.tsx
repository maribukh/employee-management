import { useEffect, useState } from "react";
import EmployeeForm from "../pages/EmployeeForm";
import { getEmployees, addEmployee, deleteEmployee } from "../api/employees";
import { Employee } from "../types";

const LOCAL_STORAGE_KEY = "employeeData";

const Employees = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Load employees from Local Storage or API
  useEffect(() => {
    const storedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedEmployees) {
      setEmployeeList(JSON.parse(storedEmployees));
      setFilteredEmployees(JSON.parse(storedEmployees));
    } else {
      fetchEmployees();
    }
  }, []);

  // Save employees to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employeeList));
  }, [employeeList]);

  // Fetch employees from API (only if Local Storage is empty)
  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployeeList(data);
    setFilteredEmployees(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

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

  // Add employee and update Local Storage
  const handleAddEmployee = async (newEmployee: Omit<Employee, "id">) => {
    const addedEmployee = await addEmployee(newEmployee);
    const updatedList = [...employeeList, addedEmployee];
    setEmployeeList(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Delete employee and update Local Storage
  const handleDeleteEmployee = async (id: number) => {
    await deleteEmployee(id);
    const updatedList = employeeList.filter((emp) => emp.id !== id);
    setEmployeeList(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Enable edit mode
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  // Handle edit form submission
  const handleSaveEdit = () => {
    if (editingEmployee) {
      const updatedList = employeeList.map((emp) =>
        emp.id === editingEmployee.id ? editingEmployee : emp
      );
      setEmployeeList(updatedList);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
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

      {/* Ensure EmployeeForm is included properly */}
      <div style={{ marginBottom: "20px" }}>
        <EmployeeForm onAddEmployee={handleAddEmployee} />
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={String(selectedDepartment) || "All"} // Ensure it's always a string
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departmentOptions.map((dept, index) => (
            <option key={index} value={String(dept)}>
              {" "}
              {/* Ensure dept is always a string */}
              {String(dept)}
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
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
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
                    value={editingEmployee?.name ?? ""} 
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee!,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  emp.name
                )}
              </td>
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
