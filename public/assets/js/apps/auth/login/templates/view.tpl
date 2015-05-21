<div class="row"><h1>User Dashboard</h1></div>
<div class="row">
<h3><%- username %></h3>
<h5><%if(!roles){ %>No Roles Assigned.<% } else{- roles}%></h5>
<ul class="list-group">
  <li class="list-group-item list-group-item-info">
        <div class="margin:0 0 10px 0;" style="">Note: the next time you login, it will be with the new password.
        <a href="#auth/<%- id %>/edit" style="margin-top:-5px;" class="btn btn-default btn-sm js-edit pull-right">
         <i class="glyphicon glyphicon-pencil"></i> Change Password</a></div>
        </li>
    </ul>
</div>


