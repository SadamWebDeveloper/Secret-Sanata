import { Employee, Assignment } from '../models/secretSantaAssignment';

export const assignSecretSanta = (employees: Employee[], previousAssignments: Assignment[]): Assignment[] => {

  // Log parsed employees to inspect their structure
  const newAssignments: Assignment[] = [];
  const availableChildren = employees.map((employee) => employee.Employee_Name); // Ensure this field is correct


  employees.forEach((employee) => {
    let secretChild: any;
    do {
      const randomIndex = Math.floor(Math.random() * availableChildren.length);
      secretChild = availableChildren[randomIndex];
    } while (
      secretChild === employee.Employee_Name ||
      previousAssignments.some(
        (a) => a.Employee_Name === employee.Employee_Name && a.Secret_Child_Name === secretChild
      )
    );

    // Remove selected child to ensure they’re not reassigned
    availableChildren.splice(availableChildren.indexOf(secretChild,0), 1);

    // Log the assignment for the employee
    // console.log(`Assigning ${employee.Employee_Name} to ${secretChild}`);

    newAssignments.push({
      Employee_Name: employee.Employee_Name,
      Employee_EmailID: employee.Employee_EmailID,
      Secret_Child_Name: secretChild,
      Secret_Child_EmailID: employees.find((e) => e.Employee_Name === secretChild)?.Employee_EmailID || '',
    });
  });

  return newAssignments;
};

