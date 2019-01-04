import React from 'react'
import propTypes from 'prop-types'
import {TaskForm} from '../container/task_form'
import {v4} from 'uuid'


class AddTask extends React.Component{
      constructor(props){
        super(props)
        this.state={ openForm:false,success:false }
        this.openFormModal=this.openFormModal.bind(this)
        this.closeForm=this.closeForm.bind(this)
        this.submit=this.submit.bind(this)
      }
      closeForm(event) {
       const { container,cross }=this.refs
       if (cross.contains(event.target)) {
                this.setState({ openForm: false }, () => {
                 document.removeEventListener('click', this.closeForm)
                })
       }
     }
      openFormModal(){
        this.setState({ openForm:true,failedAttempt:false,success:false }, () => {
         document.addEventListener('click', this.closeForm)
        })
      }
      submit(values){
        const {project}=this.props
        var oldTasks=[]
        if(project.tasks){
            oldTasks=[...project.tasks]
        }
        oldTasks.push({...values,id:v4(),completed:false})
        this.props.newTaskAdded({...project,tasks:oldTasks})
        this.setState({openForm:false})
      }
      componentWillUnmount(){
          document.removeEventListener('click',this.closeForm)
      }
      render(){
        const{openForm}=this.state
        return(
          <div>
        {!openForm?
          <div style={{textAlign: "center"}}>
         <button className="new-project-button buttons" style={{margin: "2%"}} onClick={this.openFormModal}>+ Add New Task</button>
          </div>
        :
        <div className='form-backdrop'>
        <div className='form-container' ref='container'>
        <div className='form-header'>
         <h2> Add Task</h2>
              <div className='cross' ref='cross'>✖</div>
        </div>
        <TaskForm onSubmit={this.submit}/>
        </div>
        </div>
        }
         </div>
      )
      }
}

export {AddTask}
