<td><%- username %></td>
<td style="inline-block">
Admin: <i class="<%- roles.admin %>"></i>
Creator: <i class="<%- roles.creator %>"></i>
Reviewer: <i class="<%- roles.review %>"></i>
Approver: <i class="<%- roles.approve %>"></i>
Supervisor: <i class="<%- roles.supervisor %>"></i>
</td>
<td>
  <a href="#contacts/<%- _id %>" class="btn btn-sm btn-default js-show">
    <i class="glyphicon glyphicon-eye-open"></i>
    Show
  </a>
  <a href="#contacts/<%- _id %>/edit" class="btn btn-sm btn-default js-edit">
    <i class="glyphicon glyphicon-pencil"></i>
      Edit
  </a>
  <button class="btn btn-sm btn-danger js-delete">
    <i class="glyphicon glyphicon-remove-circle"></i>
    Delete
  </button>
</td>
