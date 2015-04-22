<td><%- username %></td>
<td><%- roles %></td>
<td>
  <!--<a href="#contacts/<%- _id %>" class="btn btn-small btn-default js-show">
    <i class="glyphicon glyphicon-eye-open"></i>
    Show
  </a>-->
  <a href="#contacts/<%- _id %>/edit" class="btn btn-sm btn-default js-edit">
    <i class="glyphicon glyphicon-pencil"></i>
      Edit
  </a>
  <button class="btn btn-sm btn-danger js-delete">
    <i class="glyphicon glyphicon-remove-circle"></i>
    Delete
  </button>
</td>
