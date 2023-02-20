import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { faker } from '@faker-js/faker'

import { MdDelete, MdControlPointDuplicate } from "react-icons/md";

function Table() {
    const [rowData, setRowData] = useState([
        { id: 1, name: 'John', last_name: 'Doe', status: 'Active' },
        { id: 2, name: 'Jane', last_name: 'Doe', status: 'Inactive' },
        { id: 3, name: 'Bob', last_name: 'Smith', status: 'Active' },
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [gridApi, setGridApi] = useState(null);

    const columnDefs = [
        { field: 'id', checkboxSelection: true },
        { field: 'name' },
        { field: 'last_name' },
        { field: 'status' },
        {
            headerName: 'Actions',
            cellRendererFramework: (params) => (
                <div>
                    <MdControlPointDuplicate onClick={() => handleDuplicateRow(params)} />
                    <MdDelete onClick={() => handleDeleteRow(params)} style={{ margin: '0px 12px' }} />
                </div>
            ),
        },
    ];

    function handleAddRow() {
        const id = Math.max(...rowData.map((row) => row.id)) + 1;
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const status = Math.random() < 0.5 ? 'Active' : 'Inactive';
        setRowData([...rowData, { id, name: firstName, last_name: lastName, status }]);
    }

    function handleDeleteSelectedRows() {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedRows = selectedNodes.map((node) => node.data);
        const remainingRows = rowData.filter((row) => !selectedRows.includes(row));
        setRowData(remainingRows);
        setSelectedRows([]);
    }

    function handleDuplicateRow(params) {
        const { data } = params;
        const id = Math.max(...rowData.map((row) => row.id)) + 1;
        setRowData([...rowData, { ...data, id }]);
    }

    function handleDeleteRow(params) {
        const { data } = params;
        const remainingRows = rowData.filter((row) => row.id !== data.id);
        setRowData(remainingRows);
    }

    function onGridReady(params) {
        setGridApi(params.api);
    }

    function onSelectionChanged() {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedRows = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedRows);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20 }} >
            <div >
                <button onClick={handleAddRow} style={{padding:10, backgroundColor:'#04AA6D' , border:'none', borderRadius:6, color:'white', margin:20}} >Add Row</button>
                <button onClick={handleDeleteSelectedRows} style={{padding:10, backgroundColor:'#d11a2a' , border:'none', borderRadius:6, color:'white', marginRight:20}}>Delete Selected Rows</button>
            </div>
            <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection="multiple"
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}
                ></AgGridReact>
            </div>
        </div>
    );
}

export default Table;
