<form>
  <div class="form-group form-group-sm">
    <label for="contact-admin" class="control-label">Admin Role:</label>
    <input id="contact-admin" class="form-control" name="admin" type="radio" value="<%- admin %>"/>
  </div>
    <div class="form-group form-group-sm">
      <label for="contact-creator" class="control-label">Creator Role:</label>
      <input id="contact-creator" name="creator" class="form-control" type="radio" value="<%- creator %>"/>
    </div>
  <div class="form-group form-group-sm">
    <label for="contact-review" class="control-label">Reviewer Role:</label>
    <input id="contact-review" name="review" class="form-control" type="radio" value="<%- review %>"/>
  </div>
  <div class="form-group form-group-sm">
    <label for="contact-approve" class="control-label">Approve Role:</label>
    <input id="contact-approve" name="approve" class="form-control" type="radio" value="<%- approve %>"/>
  </div>
   <div class="form-group form-group-sm">
      <label for="contact-supervisor" class="control-label">Supervisor Role:</label>
      <input id="contact-supervisor" name="supervisor" class="form-control" type="radio" value="<%- supervisor %>"/>
    </div>
  <button class="btn btn-success js-submit">Save</button>
</form>
