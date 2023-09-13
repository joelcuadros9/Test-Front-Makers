import React, {useState, useEffect, useRef} from 'react';
import {StudentService} from "./service/StudentService";
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column";
import {Panel} from 'primereact/panel';
import {Menubar} from 'primereact/menubar';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function App() {

    const toast = useRef(null)

    let state = {
        visible: false, student: {
            firstname: null, lastname: null, email: null
        }, selectedStudent: {}
    };

    const footer = (<div>
        <Button label="Guardar" icon="pi pi-check" onClick={save}/>
    </div>);

    const items = [{
        label: 'Nuevo', icon: 'pi pi-fw pi-plus', command: () => {
            showSaveDialog()
        }
    }, {
        label: 'Editar', icon: 'pi pi-fw pi-pencil', command: () => {
            showEditDialog()
        }
    }, {
        label: 'Eliminar', icon: 'pi pi-fw pi-trash', command: () => {
            drop()
        }
    }];

    const [students, setStudents] = useState([]);

    useEffect(() => {
        StudentService.getAll().then(data => setStudents(data));
    }, []);

    function save() {
        StudentService.save(state.student).then(data => {
            state = {
                visible: false, student: {
                    firstname: null, lastname: null, email: null
                },
            };
            toast.current.show({severity: 'success', summary: 'Success', detail: 'Saved.'});
            StudentService.getAll().then(data => setStudents(data));
        })
    }

    function drop() {
        if (window.confirm("Do you really want to delete the registry?")) {
            StudentService.delete(state.selectedStudent.id).then(data => {
                toast.current.show({severity: 'success', summary: 'Success', detail: 'Deleted.'});
                StudentService.getAll().then(data => setStudents(data));
            });
        }
    }


    return (<div style={{width: '80%', margin: '0 auto', marginTop: '20px'}}>
        <Toast ref={toast} />
        <Menubar model={items}/>
        <br/>
        <Panel header="React CRUD App">
            <DataTable value={students} paginator={true} rows="4" selectionMode="single"
                       selection={state.selectedStudent}
                       onSelectionChange={e => state.selectedStudent = e.value}>
                <Column field="firstname" header="Firstname"></Column>
                <Column field="lastname" header="Lastname"></Column>
                <Column field="email" header="Email"></Column>
            </DataTable>
        </Panel>
        <Dialog header="Create Student" visible={state.visible} style={{width: '400px'}} footer={footer} modal={true}
                onHide={() => state.visible = false}>
            <form id="student" role="form" name="student">
              <span className="p-float-label">
                <InputText value={state.student.firstname} style={{width: '100%'}} id="firstname" onChange={(e) => {
                    let val = e.target.value;
                    state = (prevState => {
                        let student = Object.assign({}, prevState.student);
                        student.firstname = val

                        return {student};
                    })
                }}/>
                <label htmlFor="firstname">FirstName</label>
              </span>
                <br/>
                <span className="p-float-label">
                <InputText value={state.student.lastname} style={{width: '100%'}} id="lastname" onChange={(e) => {
                    let val = e.target.value;
                    state = (prevState => {
                        let student = Object.assign({}, prevState.student);
                        student.lastname = val

                        return {student};
                    })
                }}/>
                <label htmlFor="lastname">LastName</label>
              </span>
                <br/>
                <span className="p-float-label">
                <InputText value={state.student.email} style={{width: '100%'}} id="email"
                           onChange={(e) => {
                               let val = e.target.value;
                               state = (prevState => {
                                   let student = Object.assign({}, prevState.student);
                                   student.email = val

                                   return {student};
                               })
                           }}/>
                <label htmlFor="email">Email</label>
              </span>
            </form>
        </Dialog>
    </div>)

    function showSaveDialog() {
        state = ({
            visible: true, student: {
                firstname: null, lastname: null, email: null
            }
        });
        document.getElementById('student').reset()
    }

    function showEditDialog() {
        state = ({
            visible: true, student: {
                id: state.selectedStudent.id,
                firstname: state.selectedStudent.firstname,
                lastname: state.selectedStudent.lastname,
                email: state.selectedStudent.email
            }
        });
    }

}
