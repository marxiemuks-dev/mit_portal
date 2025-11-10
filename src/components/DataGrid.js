import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id',
    headerName: 'No',
    width: 50,
    type: 'number',},
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 350,
    editable: true,
  },
  {
    field: 'organizer',
    headerName: 'Organizer',
    width: 100,
    editable: true,
  },
  {
    field: 'totalAttendees',
    headerName: 'Total Attendees',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    type: 'number',
    width: 150,
  },
];

const rows = [
  {id: 2, title: 'Gender Sensitivity Training', description: 'An introduction to gender concepts and gender-sensitive practices.', link: '#',
    organizer:"GAD", totalAttendees:"100"
  },
  {id: 2, title: 'Gender Analysis Tools', description: 'Learn how to conduct gender analysis for your projects.', link: '#',
    organizer:"PICTO", totalAttendees:"100"
   },
  {id: 3, title: 'Legal Frameworks on Gender Equality', description: 'Explore national and international gender laws and policies.', link: '#',
    organizer:"PICTO", totalAttendees:"100"
   },
  {id: 4, title: 'GAD Budgeting Workshop', description: 'Hands-on training on how to prepare and monitor GAD budgets.', link: '#',
    organizer:"GAD", totalAttendees:"100"
   },
  {id: 5, title: 'Case Studies on GAD Implementation', description: 'Real-world examples of successful GAD projects.', link: '#',
    organizer:"PPDO", totalAttendees:"100"
   }
];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

export default function DataGridResource() {
  return (
    <Box sx={{ minHeight:'100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        sx={{minHeight:'80vh'}}
      />
    </Box>
  );
}
