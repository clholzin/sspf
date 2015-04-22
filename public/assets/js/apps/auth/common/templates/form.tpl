<form>
  <div class="form-group form-group-sm">
    <label for="contact-firstName" class="control-label">First name:</label>
    <input id="contact-firstName" class="form-control" name="firstName" type="text" value="<%- firstName %>"/>
  </div>
  <div class="form-group form-group-sm">
    <label for="contact-lastName" class="control-label">Last name:</label>
    <input id="contact-lastName" name="lastName" class="form-control" type="text" value="<%- lastName %>"/>
  </div>
  <div class="form-group form-group-sm">
    <label for="contact-phoneNumber" class="control-label">Phone number:</label>
    <input id="contact-phoneNumber" name="phoneNumber" class="form-control" type="text" value="<%- phoneNumber %>"/>
  </div>
  <button class="btn btn-success js-submit">Save</button>
</form>
