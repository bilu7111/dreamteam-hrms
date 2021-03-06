import React from 'react'
import propTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import { app } from '../db/firebase'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Popup from 'reactjs-popup'


class ListSearchedprojects extends React.Component{
          constructor(props){
            super(props)
            this.state={admin:false,showPriority:false,openInvoice:false,showStatus:false,showPrompt:false,showProjectDetails:false,project:null}
            this.showPriority = this.showPriority.bind(this)
            this.closePriority = this.closePriority.bind(this)
            this.showProjectDetails = this.showProjectDetails.bind(this)
            this.remove = this.remove.bind(this)
            this.enterInvoice = this.enterInvoice.bind(this)
            this.changeStatus = this.changeStatus.bind(this)
            this.changePriority = this.changePriority.bind(this)
            this.openInvoice = this.openInvoice.bind(this)
            this.closeInvoice = this.closeInvoice.bind(this)
            this.showPrompt = this.showPrompt.bind(this)
            this.closePrompt = this.closePrompt.bind(this)
            this.isAdmin=this.isAdmin.bind(this)
          }
          isAdmin(self){
                app.auth().currentUser.getIdTokenResult()
                  .then((idTokenResult) => {
                     if (idTokenResult.claims.admin) {
                       self.setState({admin:true})
                     } else {
                       self.setState({admin:false})
                     }
                  })
                  .catch((error) => {
                    console.log(error)
                  })
          }
          componentWillMount(){
            this.setState({project:this.props.project})
            this.isAdmin(this)
          }
          changeStatus(state){
            this.setState({project:{...this.state.project,status:state}})
            this.props.projectChanged({...this.state.project,status:state})
          }
          changePriority(state){
            this.setState({project:{...this.state.project,priority:state}})
            console.log(state)
            console.log({...this.state.project,priority:state})
            this.props.projectChanged({...this.state.project,priority:state})
          }
          enterInvoice(e){
            e.preventDefault()
            const { invoice } = this.refs
            const invoiceNumber = invoice.value
            const newProjectState = {...this.state.project,invoice:invoiceNumber,invoiced:true}
            this.props.projectChanged(newProjectState)
            this.setState({openInvoice:false},
                 document.removeEventListener('click',this.closeInvoice,false)
            )
          }
          openInvoice(){
               this.setState({openInvoice:true},
                          document.addEventListener('click',this.closeInvoice)
               )
          }
          closeInvoice(e){
               const { prompt,cross } = this.refs
               if(!prompt.contains(e.target)||cross.contains(e.target)){
                     this.setState({openInvoice:false},
                          document.removeEventListener('click',this.closeInvoice,false)
                     )
               }
          }
          remove(id){
            this.setState({showMenu:false})
          }
          showPriority(e){
            e.preventDefault()
            this.setState({ showPriority: true }, () => {
             document.addEventListener('click', this.closePriority)
            })
          }
          closePriority(e){
            const { priorityMenu }=this.refs
            if (!priorityMenu.contains(event.target)) {
                     this.setState({ showPriority: false }, () => {
                      document.removeEventListener('click', this.closePriority)
                     })
            }
          }
          showMenu(event) {
            event.preventDefault()
            this.setState({ showMenu: true }, () => {
             document.addEventListener('click', this.closeMenu)
            })
          }
          showProjectDetails(){
            this.setState({showProjectDetails:true})
          }
          componentWillUnmount(){
            document.removeEventListener("click", this.closeMenu,false)
            document.removeEventListener('click', this.closePrompt,false)
            document.removeEventListener('click', this.closePriority,false)
            document.removeEventListener('click',this.closeInvoice,false)
          }
          closeMenu(event) {
           const {dropdownMenu}=this.refs
           if (!dropdownMenu.contains(event.target)) {
                    this.setState({ showMenu: false }, () => {
                     document.removeEventListener('click', this.closeMenu)
                    })
           }
         }
         showPrompt(){
              this.setState({showPrompt:true},()=>document.addEventListener('click',this.closePrompt))
          }
          closePrompt(e){
              const {prompt, confirm, cross} = this.refs
              if(!prompt.contains(e.target)||confirm.contains(e.target)||cross.contains(e.target)){
                   this.setState({showPrompt:false},()=>{
                   document.removeEventListener('click',this.closePrompt,false)
                  }
                 )
              }
          }
          render(){
          const {project} = this.state
          let members=[]
          if(project.members!==undefined||typeof(project.members)==="object"){
             var i
             if(project.members.length<5){
                 for(i=0;i<project.members.length;i++){
                     members.push(project.members[i])
                 }
             }
             else{
               for(i=0;i<5;i++){
                   members.push(project.members[i])
               }
             }
          }
          else{
             members=false
          }
          return(
          <div>
          <ul key={project.project_id} className='search-list'>
          <li>
          <NavLink to={{pathname : `projects/${project.title}`,
                       state : {project : project }}}>
              {project.title}
          </NavLink>
          </li>
          <li className='hide-on-mobiles'>
              {project.project_id}
          </li>
          {project.leader?
          <div>
          {project.leader.length!==0?
          <li className='hide-on-mobiles'>
           {project.leader[0].picture!==""?
           <div className='list-images-container'>
           <img src={project.leader[0].picture} className='list-images'/>
           </div>
           :
           <div className='list-images-container'>
           <FontAwesomeIcon icon='user' color='lightgrey'/>
           </div>
         }
          </li>
          :
          <li className='hide-on-mobiles'>
             ---
          </li>
        }
          </div>
          :
          <li className='hide-on-mobiles'>
             ---
          </li>
      }
              {members!==false?
              <div>
              {members.length!==0?
              <li className='team-members'>
              {members.map(i=>
                <div>
               {i.picture!==""||i.picture!==undefined?
               <div className='list-images-container'>
               <img src={i.picture} className='list-images'/>
               </div>
               :
               <div className='list-images-container'>
               <FontAwesomeIcon icon='user' color='lightgrey'/>
               </div>
             }
               </div>
           )
           }
              </li>
              :
              <li className='hide-on-mobiles'>
                 ---
              </li>
            }
              </div>
              :
              <li className='hide-on-mobiles'>
                 ---
              </li>
          }
          <li>
              {project.deadline}
          </li>
        <Popup trigger={ <li id='status-bar' className='actions-button'>
          {project.priority===0 ?
                    <span>
                    <FontAwesomeIcon
                    icon="circle"
                    color="#ffb507"
                    size="sm"
          />{' '} Low  </span>
                   :
                   <span>
                   <FontAwesomeIcon
                   icon="circle"
                   color="#6DB65B"
                   size="sm"
          />{' '} High
                  </span>
          }
          </li>
        } on="click"
          closeOnDocumentClick arrow={false}
          position="bottom center"
          contentStyle={{ padding: '0px', border: 'none' }}
          >
          <div>
          {this.state.admin?
                  <ul className='actions-list'>
                      <li onClick={()=>this.changePriority(0)}>Normal</li>
                      <li onClick={()=>this.changePriority(1)}>High</li>
                  </ul>
                  :
                  null
          }
          </div>
          </Popup>
          <Popup trigger={ <li id='status-bar' className='actions-button'>
              {project.status===0 ?
                          <span>
                          <FontAwesomeIcon
                          icon="circle"
                          color="#ffb507"
                          size="sm"
                />{' '} Active  </span>
                         :
                         <span>
                         <FontAwesomeIcon
                         icon="circle"
                         color="#6DB65B"
                         size="sm"
                />{' '} Completed
                        </span>
                }</li>
              }
              on="click"
              closeOnDocumentClick arrow={false}
              position="bottom left"
              contentStyle={{ padding: '0px', border: 'none' }}
              >
          <div>
          {this.state.admin?
                  <ul className='actions-list'>
                      <li onClick={()=>this.changeStatus(0)}>Active</li>
                      <li onClick={()=>this.changeStatus(1)}>Completed</li>
                  </ul>
                  :
                  null
          }
          </div>
          </Popup>
          <Popup trigger={ <li className='actions-button'>
          <FontAwesomeIcon
                    icon="th"
                    color="black"
           size="sm"/>
           </li>
         }
         on="click"
         closeOnDocumentClick arrow={false}
         position="bottom left"
         contentStyle={{ padding: '0px', border: 'none' }}
         >
              <ul className='actions-list'>
                  <li onClick={this.showPrompt}>Remove Project</li>
                  <li onClick={ this.openInvoice}>Enter Invoice</li>
              </ul>
          </Popup>
          {this.state.showPrompt&&
            <div className='form-backdrop'>
            <div className='form-container prompt-box' ref='prompt'>
            <div className='form-header'>
             <h2>Delete Project</h2>
             <div className='cross' ref='cross'>✖</div>
            </div>
            <div className='prompt-message'>
            <h3>Delete the Project {project.title} ?</h3>
            <input class="form-submit" type="submit" value="Confirm" onClick={()=>this.props.removeProject(project.id)} ref='confirm'/>
            </div>
            </div>
            </div>
          }
          {this.state.openInvoice&&
            <div className='form-backdrop'>
            <div className='form-container prompt-box' ref='prompt'>
            <div className='form-header'>
             <h2>Invoice</h2>
             <div className='cross' ref='cross'>✖</div>
            </div>
            <div className='prompt-message'>
            <h3> Enter Invoice </h3>
            <form onSubmit={this.enterInvoice}>
            <input className="form-controls" type="text" placeholder='Invoice' ref='invoice'/>
            <input type='submit' className='form-submit' value='Submit'/>
            </form>
            </div>
            </div>
            </div>
          }
          </ul>
          </div>
         )
      }
}

ListSearchedprojects.propTypes={
           removeProject:propTypes.func.isRequired,
           project:propTypes.object.isRequired
}
export {ListSearchedprojects}
