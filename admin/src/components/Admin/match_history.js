import React, { Component } from 'react';
import Header from '../Header/Header';
import {Link,Redirect} from "react-router-dom";
import axios from "axios";
import Moment from 'moment'; 
import Modal from "react-bootstrap-modal";
import Switch from "react-switch";
import loadjs from 'loadjs'


require("react-bootstrap-modal/lib/css/rbm-complete.css");

const $ = require('jquery');
const baseUrl = "http://172.105.40.76:4000"; 
		
	
//  function  exposuredata  (id=null)  {
// 	let headers={
// 		Authorization:"Bearer "+ localStorage.getItem("token"),
// 	 }; 
	 	
// 		const resp11 =  axios.get(baseUrl + '/api/userbet/'+id, {headers});
// 	//  localStorage.setItem({id:resp11});
		
	


// }	
class Receive extends Component { 
	constructor(props) {
		super(props);
		var accessToken = localStorage.getItem("token");
		var user_id = localStorage.getItem("user_id");
		this.state = {accessToken:accessToken,
					  tabledata:"",
					  respStatus:false,
					  showUserAmountPopup:false,
					  old_update_amount:0.00,
					  master_password:'',
					  row_user_new_password:'',
					  row_user_confirm_password:'',
					  user_id:user_id,
					  exposuredata1:'',
					  new_data:"",
					  row_user_username:"",
					  newbalnce:0,
					  userType:0,
					  success:""
					};
		
	}	  
	componentWillMount() { 
		
       this.callAdminTable();
       this.currentUserData();
	}
  
	callAdminTable=()=>{
		let headers={
            Authorization:"Bearer "+ this.state.accessToken,
        };  
        axios.get(baseUrl + '/api/adminlist', {headers}).then((resp) => { 
         var respNew = resp.data; 
			if(respNew.success === true){
				this.setState({tabledata:respNew.adminlist,respStatus:respNew.success });
			}
			localStorage.setItem("id_data",resp.session_value)
		});
		
	}
	responseHtml = () =>{ 
		  if(this.state.success !='') {
			 return (
			  <div className="alert alert-success">
				  Logout All Chlid
			  </div>
			 )
		  }
	   } 
	handleLogout=()=>{
		let headers={
            Authorization:"Bearer "+ this.state.accessToken,
        };  
        axios.get(baseUrl + '/api/logouts', {headers}).then((resp) => { 
		 var respNew = resp.data; 
		 this.setState({success:respNew.message})
		 console.log(respNew.message);
		 //window.location.reload("/logout");
		});
		
		
	}
	
	
	currentUserData = () =>{
		let headers={
            Authorization:"Bearer "+ this.state.accessToken,
		};  
		axios.get(baseUrl + '/api/current',{headers}).then((resp) => { 
			var resp = resp.data;      
			this.setState({
						current_user_balance:resp.balance,
						current_user_username:resp.username,
						new_data:resp,
						userType:resp.userType,

					});
					localStorage.setItem("id_data",resp.session_value)
		}); 
		
	}
	
   handleChange = (event)=> {
		let {name,value} = event.target;
		
		if(name==="row_user_amount" && this.state.user_balance_type==="deposit"){
			// if(isNaN(parseInt(value)) || value>this.state.current_user_balance){
			// 	return false;
			// }
			var current_user_balance_remaining = Number(this.state.current_user_balance) - Number(value);
			var row_user_new_balance = Number(this.state.row_user_balance) + Number(value);
			this.setState({current_user_balance_remaining:current_user_balance_remaining,
						   row_user_new_balance:row_user_new_balance})
		}
		else if(name==="row_user_amount" && this.state.user_balance_type==="withdrawal"){
			if(isNaN(parseInt(value)) || value>this.state.row_user_balance){
				return false;
			}
			var current_user_balance_remaining = Number(this.state.current_user_balance) + Number(value);
			var row_user_new_balance = Number(this.state.row_user_balance) - Number(value);
			this.setState({current_user_balance_remaining:current_user_balance_remaining,
						   row_user_new_balance:row_user_new_balance})
		}
		
		
		this.setState({[name]: value,
						emptyField:false,
						emptyUserAmountField:false,
						emptyExposureField:false,
						emptyDepoWithdrField:false,
						emptyChangePassField:false,
						errMsg:""});
	   
     }
  
	showTableHtml = () =>{
	  if(this.state.respStatus===true){ 
		  const html = []
		 //this.state.tabledata.map(function(value, i){ 
			var newbalnce =0;
			var creditAmount =0;
			
			
			this.state.tabledata.sort(function (a, b) {
				let x = a.username.toUpperCase(),
				y = b.username.toUpperCase();
			return x == y ? 0 : x > y ? 1 : -1;
			});
			
		 for(var i=0;i<this.state.tabledata.length;i++) {
			
			

			var value = this.state.tabledata[i];
			console.log(value);
			newbalnce+=value.balance +value.profit_loss-value.data_new;
			creditAmount+=value.creditAmount;
			 
			var loginvalue= this.state.userType+1
			

			 
			var accountType = "";	
			var accountList = "";
				 
			if(value.userType==2){
			
				accountType = <a href={"/adminbetlist/"+value._id} className="btn btn-default">ADMIN</a>;
				accountList=<a href={"/accountlist/"+value._id} className="btn btn-default">{value.username.toUpperCase()}</a>;
		   }
		   else if(value.userType==3){
			accountType = <a href={"/adminbetlist/"+value._id} className="btn btn-default">SMDL</a>;
				
				accountList=<a href={"/accountlist/"+value._id} className="btn btn-default">{value.username.toUpperCase()}</a>;
		   }
		   else if(value.userType==4){
			accountType = <a href={"/adminbetlist/"+value._id} className="btn btn-default">MDL</a>;
				
				accountList=<a href={"/accountlist/"+value._id} className="btn btn-default">{value.username.toUpperCase()}</a>;
		   }
		   else if(value.userType==5){
			accountType = <a href={"/adminbetlist/"+value._id} className="btn btn-default">DL</a>;
				
				
				accountList=<a href={"/accountlist/"+value._id} className="btn btn-default">{value.username.toUpperCase()}</a>;
		   }
		   else if(value.userType==6){
			accountType = <a href={"/adminbetlist/"+value._id} className="btn btn-default">User</a>;
			  
			   accountList=<a href="#" className="btn btn-default">{value.username.toUpperCase()}</a>;
		  }


		  var exposure ="";
		  if(value.userType==6)
		  {
			var exposure=<button className="btn btn-default" onClick={this.handleExposureLimitShow.bind(this,value.exposerAmount,value._id,"exposure","Exposure Limit",value.username)}>L</button>;

		  }
		  var showPercentage = (value.userType==6) ? 0 : value.cricket_partnership_own;
			var userStatus = value.user_status=='Y' ? true : false;
			var userStatusIcon = value.user_status=='Y' ? 'check' : 'times';
			var betStatus = value.bet_status=='Y' ? true : false;
			var betStatusIcon = value.bet_status=='Y' ? 'check' : 'times';
			// if(loginvalue==value.userType){
			var mainHtml = <tr role="row" className="odd">
							<td>{accountList}</td>
							<td className="text-right">{value.creditAmount}</td>
							<td  className="text-right">{value.balance +value.profit_loss}</td>
							<td  className="text-right">{value.profit_loss.toFixed(2)}</td>
							<td  className="text-right">{value.data_new}</td>
							<td  className="text-right">{value.balance +value.profit_loss-value.data_new}</td>
							<td><span className="btn btn-default"><i className={"fas fa-"+userStatusIcon}></i></span></td>
							<td><span className="btn btn-default"><i className={"fas fa-"+betStatusIcon}></i></span></td>
							<td className="text-right">{value.exposerAmount}</td>
							<td className="text-right">{showPercentage}</td>
							<td className="text-right">{accountType}</td>
							<td className="text-right">0.00</td>
							<td>
							<a className="btn btn-default" href={"/min-max-bet/"+value._id} >M</a>&nbsp;
								<button className="btn btn-default" onClick={this.handleDepoWithdrPopupOpen.bind(this,value.balance,value._id,value.username,"deposit")}>D</button>&nbsp;
								<button className="btn btn-default" onClick={this.handleDepoWithdrPopupOpen.bind(this,value.balance,value._id,value.username,"withdrawal")} >W</button>&nbsp;
								{exposure} &nbsp;
								<button className="btn btn-default" onClick={this.handleExposureLimitShow.bind(this,value.creditAmount,value._id,"credit","Credit Limit",value.username)}>C</button>&nbsp;
								<button className="btn btn-default" onClick={this.handleChangePassPopupOpen.bind(this,value._id,value.username)}>P</button>&nbsp;
								<button className="btn btn-default" onClick={this.handleBetUserPopupOpen.bind(this,value._id,value.username,userStatus,betStatus,value.username)}>S</button>&nbsp;
								
								<a className="btn btn-default" href={"/user-logs/"+value._id} >U</a>&nbsp;
								
							</td>
						</tr>;
					//	} 
			html.push(mainHtml);
			loadjs(['js/custom.js'], function() {
      
			});
			
		
	}
		console.log(newbalnce);
		localStorage.removeItem('newbalnce');
		localStorage.removeItem('creditAmount');
		localStorage.setItem("newbalnce",newbalnce);
		localStorage.setItem("creditAmount",creditAmount);
		
		return <tbody>{html}</tbody>;
	  }
	}
  
   // deposit withdrawal button action 
	handleDepoWithdrPopupClose=()=>{
		 this.setState({showDepoWithdrPopup:false})
	}
	handleDepoWithdrPopupOpen=(get_row_user_balance,get_row_user_id,get_row_user_username,get_user_balance_type)=>{
		//console.log(get_row_user_username);
		 this.setState({showDepoWithdrPopup:true,
						current_user_balance_remaining:0,
						row_user_balance:get_row_user_balance,
						row_user_username:get_row_user_username,
						row_user_new_balance:0,
						user_balance_type:get_user_balance_type,
						row_user_id:get_row_user_id,
						user_depo_withdr_popup_title:get_user_balance_type.toUpperCase(),
						})
	}
	
	handleDepoWithdrSubmit =(event) => {
      event.preventDefault(); 
		
      if(isNaN(parseInt(this.state.row_user_amount)) || this.state.row_user_amount<=0){
         this.setState({emptyDepoWithdrField:true,errDepoWithdrMsg:"Enter Valid Amount"});
         return false;
      } 
	  if(this.state.user_balance_type===""){
         this.setState({emptyDepoWithdrField:true,errDepoWithdrMsg:"Invalid Action"});
         return false;
      }
	  if(this.state.master_password===""){
         this.setState({emptyDepoWithdrField:true,errDepoWithdrMsg:"Passowrd is required"});
         return false;
      }
		let sendData={
            row_user_id:this.state.row_user_id,
            user_balance_type:this.state.user_balance_type,
            row_user_amount:this.state.row_user_amount,
            row_user_remark:this.state.row_user_remark,
			master_password:this.state.master_password,

         }; 


         let headers={
            Authorization:"Bearer "+ this.state.accessToken,
         }; 
          axios.post(baseUrl + '/api/update_balance',sendData, {headers}).then((resp) => { 
           var resp = resp.data;
           if(resp.success === true){
				this.setState({respDepoWithdrStatus:resp.success,
							 respDepoWithdrMessage:resp.message,
                             row_user_amount:"",
                             master_password:""
                          });
				 this.callAdminTable();
				setTimeout(() => {this.setState({ respDepoWithdrStatus: "",showDepoWithdrPopup:false });}, 2000);
						
              }else{
				this.setState({respDepoWithdrStatus:resp.success,respDepoWithdrMessage:resp.message, master_password:""});
				setTimeout(() => {this.setState({ respDepoWithdrStatus: "" });}, 2000);  
          
              }
           
          });
    }
	
	responseDepoWithdrHtml = () =>{ 
      if(this.state.respDepoWithdrStatus === false) {
          return (
          <div className="alert alert-danger">
          {this.state.respDepoWithdrMessage}
          </div>
          )
        }
        else if(this.state.respDepoWithdrStatus === true) {
           return (
            <div className="alert alert-success">
            {this.state.respDepoWithdrMessage}
            </div>
           )
        }
     } 
  
   emptyDepoWithdrHtml = () =>{
	
      if(this.state.emptyDepoWithdrField === true) {
         return (
          <div className="alert alert-danger">
          {this.state.errDepoWithdrMsg}
          </div>
         )
      }
   }
	
  
  
  
  
  
	handleExposureLimitClose=()=>{
	 
	  this.setState({showUserAmountPopup:false,
					 old_update_amount:0.00,
					 user_amount_popup_title:"",
					 row_user_id:"",
					 master_password:"",
					 user_update_type:""})
	}
	handleExposureLimitShow=(getExAmt,get_row_user_id,get_user_update_type,get_user_amount_popup_title,name)=>{
	  
	  this.setState({showUserAmountPopup:true,
					user_amount_popup_title:get_user_amount_popup_title,
					old_update_amount:getExAmt,
					row_user_id:get_row_user_id,
					user_update_type:get_user_update_type,
					row_user_username:name
				})
	}
	handleExposureLimitSubmit =(event) => {
      event.preventDefault(); 
		
      if(isNaN(parseInt(this.state.updateAmount)) || this.state.updateAmount<0){
         this.setState({emptyExposureField:true,errExposureMsg:"Enter Valid Amount"});
         return false;
      } 
	  if(this.state.user_update_type===""){
         this.setState({emptyExposureField:true,errExposureMsg:"Invalid Action"});
         return false;
      }
	   if(this.state.master_password===""){
         this.setState({emptyExposureField:true,errExposureMsg:"Passowrd is required"});
         return false;
      }
		let sendData={
            row_user_id:this.state.row_user_id,
            user_update_type:this.state.user_update_type,
            updateAmount:this.state.updateAmount,
			master_password:this.state.master_password
          }; 


         let headers={
            Authorization:"Bearer "+ this.state.accessToken,
         }; 
          axios.post(baseUrl + '/api/update_user_amount',sendData, {headers}).then((resp) => { 
           var resp = resp.data;
           if(resp.success === true){
				this.setState({respExposureStatus:resp.success,
							 respExposureMessage:resp.message,
                             exposerAmount:"",
                             master_password:""
                          });
				 this.callAdminTable();
				setTimeout(() => {this.setState({ respExposureStatus: "",showUserAmountPopup:false });}, 2000);
						
              }else{
				this.setState({respStatus:resp.success,respMessage:resp.message, master_password:"",showUserAmountPopup:false });
				setTimeout(() => {this.setState({ respExposureStatus: "" });}, 2000);  
          
              }
           
          });
    }
	
	responseExposureHtml = () =>{ 
      if(this.state.respExposureStatus === false) {
          return (
          <div className="alert alert-danger">
          {this.state.respExposureMessage}
          </div>
          )
        }
        else if(this.state.respExposureStatus === true) {
           return (
            <div className="alert alert-success">
            {this.state.respExposureMessage}
            </div>
           )
        }
     } 
  
   emptyExposureHtml = () =>{
	
      if(this.state.emptyExposureField === true) {
         return (
          <div className="alert alert-danger">
          {this.state.errExposureMsg}
          </div>
         )
      }
   }
   
   
	handleChangePassPopupClose=()=>{
	 
	  this.setState({showChangePassPopup:false,
					row_user_id:"",
					row_user_new_password:"",
					row_user_confirm_password:""})
	}
	handleChangePassPopupOpen=(get_row_user_id,name)=>{
	 
	  this.setState({showChangePassPopup:true,
					row_user_id:get_row_user_id,
					row_user_new_password:"",
					row_user_confirm_password:"",
					row_user_username:name
				})
	}
	handleChangePassSubmit =(event) => {
      event.preventDefault(); 
		
		if(this.state.row_user_new_password===""){
			this.setState({emptyChangePassField:true,errChangePassMsg:"Passowrd Is required"});
			return false;
		}
		if(this.state.row_user_confirm_password===""){
			this.setState({emptyChangePassField:true,errChangePassMsg:"Confirm Passowrd Is required"});
			return false;
		} 
		if(this.state.row_user_confirm_password!==this.state.row_user_new_password){
			this.setState({emptyChangePassField:true,errChangePassMsg:"Password and Confirm Passowrd Should be Same"});
			return false;
		} 
		
		if(this.state.master_password===""){
         this.setState({emptyExposureField:true,errExposureMsg:"Passowrd is required"});
         return false;
		}
	 
		let sendData={
            row_user_id:this.state.row_user_id,
            row_user_new_password:this.state.row_user_new_password,
            master_password:this.state.master_password
          }; 


         let headers={
            Authorization:"Bearer "+ this.state.accessToken,
         }; 
          axios.post(baseUrl + '/api/change_user_password',sendData, {headers}).then((resp) => { 
			var resp = resp.data;
			if(resp.success === true){
				this.setState({ respChangePassStatus:resp.success,
								respChangePassMessage:resp.message,
								row_user_id:"",
								row_user_new_password:"",
								row_user_confirm_password:""
							});
				
				setTimeout(() => {this.setState({ respChangePassStatus: "",showChangePassPopup:false });}, 2000);
				this.callAdminTable();
				}else{
				this.setState({respChangePassStatus:resp.success,respChangePassMessage:resp.message, master_password:""});
				setTimeout(() => {this.setState({ respChangePassStatus: "" });}, 2000);  
          
              }
           
          });
    }
	
	responseChangePassHtml = () =>{ 
      if(this.state.respChangePassStatus === false) {
          return (
          <div className="alert alert-danger">
          {this.state.respChangePassMessage}
          </div>
          )
        }
        else if(this.state.respChangePassStatus === true) {
           return (
            <div className="alert alert-success">
            {this.state.respChangePassMessage}
            </div>
           )
        }
     } 
  
   emptyChangePassHtml = () =>{
	
      if(this.state.emptyChangePassField === true) {
         return (
          <div className="alert alert-danger">
          {this.state.errChangePassMsg}
          </div>
         )
      }
   }
   
   
   
	handleBetUserPopupClose=()=>{
	 
	  this.setState({showBetUserPopup:false,
					row_user_name:""})
	}
	handleBetUserPopupOpen=(get_row_user_id,get_row_user_username,get_row_user_status,get_row_user_bet,nane
		)=>{
	 
	  this.setState({showBetUserPopup:true,
					row_user_id:get_row_user_id,
					row_user_status:get_row_user_status,
					row_user_bet:get_row_user_bet,
					row_user_name:get_row_user_username,
					row_user_username:name
				})
	}
	handleBetUserSubmit =(event) => {
      event.preventDefault(); 
		
		
		let sendData={
            row_user_id:this.state.row_user_id,
            row_user_status:this.state.row_user_status,
            row_bet_status:this.state.row_user_bet,
            master_password:this.state.master_password
          }; 


         let headers={
            Authorization:"Bearer "+ this.state.accessToken,
         }; 
          axios.post(baseUrl + '/api/change_bet_user_status',sendData, {headers}).then((resp) => { 
			var resp = resp.data;
			if(resp.success === true){
				this.setState({ respBetUserStatus:resp.success,
								respBetUserMessage:resp.message,
								row_user_id:"",
								row_user_name:"",
							});
				
				setTimeout(() => {this.setState({ respBetUserStatus: "",showBetUserPopup:false });}, 2000);
				this.callAdminTable();
				}else{
				this.setState({respBetUserStatus:resp.success,respBetUserMessage:resp.message, master_password:""});
				setTimeout(() => {this.setState({ respBetUserStatus: "" });}, 2000);  
          
              }
           
          });
    }
	
	responseBetUserHtml = () =>{ 
      if(this.state.respBetUserStatus === false) {
          return (
          <div className="alert alert-danger">
          {this.state.respBetUserMessage}
          </div>
          )
        }
        else if(this.state.respBetUserStatus === true) {
           return (
            <div className="alert alert-success">
            {this.state.respBetUserMessage}
            </div>
           )
        }
     } 
  
   emptyBetUserHtml = () =>{
	
      if(this.state.emptyBetUserField === true) {
         return (
          <div className="alert alert-danger">
          {this.state.errBetUserMsg}
          </div>
         )
      }
   }
   
   
   
   handleUserStatusChange = (checked) =>{
	  
	   this.setState({row_user_status:checked});
   }
   
   
    handleUserBetChange = (checked) =>{
		console.log(checked);
	   this.setState({row_user_bet:checked});
	}
   
   
   
  render() {
	var change_password=localStorage.getItem("change_password")
	
	if (change_password==2 && change_password!=null) {
		return (
			<Redirect to="/changepass" />
		);
	}
	var value=this.state.new_data;
	var show ="";
	if(value.userType==1){
		var show=<button className="btn btn-default" onClick={this.handleLogout}>Logut From All Child</button>;
	}
	
	  
	  var value1 =0;
	  if(value.data_new!=undefined){
		 value1=value.data_new;
	  }
	  var newbalnce= localStorage.getItem("newbalnce");
	  var creditAmount= localStorage.getItem("creditAmount");
	  var creditreferce=0;
	  if(value.userType===1){
		var newcardit_amount=0;
		var creditreferce=0;
		creditAmount =0;
	  }else{
		var newcardit_amount=creditAmount-newamount2;
		var creditreferce=value.creditAmount;
	  }
	  
	  var newamount1=value.balance + value.profit_loss- value1;

	  var newamount2=parseFloat(newbalnce)+parseFloat(newamount1);
	var accessToken = this.state.accessToken;
	
	if(accessToken==="" || accessToken===null ||  localStorage.getItem("id_data") ==0 ){
		window.localStorage.clear();
		return(
			

				<Redirect to="/login" />
				);
	} 
    return (
	<div >
		<Header />
		<div id="wrapper">
		<div id="content-wrapper" className="container-fluid">
	    <div className="man_bglight">
		<div className="new-table">
				 <h3 className="a_manh">Match History</h3>
				 <div className="table-responsive">
					<table className="table table-striped">
    <thead>
      <tr>
        <th>Serle Name</th>
        <th>Market Name</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John</td>
        <td>Doe</td>
        <td>01/08/2010</td>
        <td><a className="btn btn-default " href="#">Add Account</a>  
		</td>
      </tr>
   
    </tbody>
  </table>
				 </div>
				 </div>

	  
	  
	</div>
	</div>
	</div>
	</div>
    );
  }
}

export default Receive;
